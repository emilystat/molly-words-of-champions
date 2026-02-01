#!/usr/bin/env python3
"""
Fetch definitions in batches to avoid rate limits
Usage: python3 fetch_definitions_batch.py [start_index] [end_index]
Example: python3 fetch_definitions_batch.py 0 100  # First 100 words
"""

import json
import time
import urllib.request
import urllib.error
import re
import sys

# Get batch range from command line
start_idx = int(sys.argv[1]) if len(sys.argv) > 1 else 0
end_idx = int(sys.argv[2]) if len(sys.argv) > 2 else 100

print(f"Processing words {start_idx} to {end_idx}")

# Read current One Bee words
with open('data/words-1000.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract words from JavaScript array
words_match = re.findall(r'"word":\s*"([^"]+)"', content)
batch_words = words_match[start_idx:end_idx]

print(f"Found {len(batch_words)} words to process in this batch\n")

# Read existing data to preserve already fetched definitions
existing_data = []
if 'const words1000 = ' in content:
    json_start = content.find('[', content.find('const words1000 = '))
    json_end = content.rfind('];') + 1
    if json_start > 0 and json_end > 0:
        try:
            existing_data = json.loads(content[json_start:json_end])
        except:
            pass

# Fetch definitions
updated_count = 0
failed_words = []

for i, word in enumerate(batch_words, start_idx + 1):
    print(f"Processing {i}/{len(words_match)}: {word}")

    # Skip if already has real definition
    existing_word = next((w for w in existing_data if w.get('word') == word), None)
    if existing_word and not existing_word.get('definition', '').startswith('['):
        print(f"  ↺ Already has definition, skipping")
        continue

    max_retries = 3
    success = False

    for attempt in range(max_retries):
        try:
            url = f'https://api.dictionaryapi.dev/api/v2/entries/en/{word}'
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())[0]

            meaning = data['meanings'][0]
            definition = meaning['definitions'][0]['definition']
            example = meaning['definitions'][0].get('example', '')

            if not example:
                for defn in meaning['definitions']:
                    if defn.get('example'):
                        example = defn['example']
                        break

            if not example:
                example = f"The word '{word}' is commonly used in spelling bees."

            origin = data.get('origin', 'To be determined')
            phonetic = ''
            if 'phonetic' in data:
                phonetic = data['phonetic']
            elif 'phonetics' in data and len(data['phonetics']) > 0:
                phonetic = data['phonetics'][0].get('text', '')

            # Update existing word or create new entry
            if existing_word:
                existing_word['definition'] = definition
                existing_word['sentence'] = example
                existing_word['languageOrigin'] = origin if origin != 'To be determined' else existing_word.get('languageOrigin', 'To be determined')
                existing_word['pronunciationGuide'] = phonetic
            else:
                existing_data.append({
                    'word': word,
                    'definition': definition,
                    'sentence': example,
                    'wordList': '1000',
                    'beeDifficulty': 'oneBee',
                    'languageOrigin': origin if origin != 'To be determined' else 'To be determined',
                    'roots': [],
                    'isNewThisYear': False,
                    'pronunciationGuide': phonetic,
                    'audioUrl': None
                })

            print(f"  ✓ Success: {definition[:50]}...")
            updated_count += 1
            success = True
            break

        except urllib.error.HTTPError as e:
            if e.code == 429:
                if attempt < max_retries - 1:
                    wait_time = 10 * (attempt + 1)
                    print(f"  ⚠ Rate limited, waiting {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                else:
                    print(f"  ✗ Rate limit exceeded")
                    failed_words.append(word)
                    break
            elif e.code == 404:
                print(f"  ✗ Not found in dictionary")
                failed_words.append(word)
                break
            else:
                raise
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
            failed_words.append(word)
            break

    # Rate limit: wait 2 seconds between requests
    if success and i < len(words_match):
        time.sleep(2)

# Sort by original order
word_order = {w: idx for idx, w in enumerate(words_match)}
existing_data.sort(key=lambda x: word_order.get(x['word'], 9999))

# Write updated JavaScript file
print(f"\nWriting updated file...")
with open('data/words-1000.js', 'w', encoding='utf-8') as f:
    f.write("// One Bee: 1,000 words (easier words with common patterns)\n")
    f.write("// Definitions fetched from Free Dictionary API\n")
    f.write(f"// Total items: {len(existing_data)}\n")
    f.write(f"// Definitions completed: {sum(1 for w in existing_data if not w.get('definition', '').startswith('['))}\n\n")
    f.write("const words1000 = ")
    f.write(json.dumps(existing_data, indent=2, ensure_ascii=False))
    f.write(";\n")

print(f"\n✅ Batch complete!")
print(f"Updated in this batch: {updated_count}")
print(f"Failed/Not found: {len(failed_words)}")
if failed_words:
    print(f"Failed words: {', '.join(failed_words[:10])}")
