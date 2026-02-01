#!/usr/bin/env python3
"""
Fetch definitions and example sentences from Free Dictionary API
for Words of Champions One Bee words
"""

import json
import time
import urllib.request
import urllib.error
import re

# Read current One Bee words
with open('data/words-1000.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract words from JavaScript array
words_match = re.findall(r'"word":\s*"([^"]+)"', content)
print(f"Found {len(words_match)} words to process")

# Fetch definitions from Free Dictionary API
updated_words = []
failed_words = []

for i, word in enumerate(words_match, 1):
    print(f"Processing {i}/{len(words_match)}: {word}")

    # Retry logic for rate limiting
    max_retries = 3
    retry_delay = 5

    for attempt in range(max_retries):
        try:
        # Call Free Dictionary API with proper headers
        url = f'https://api.dictionaryapi.dev/api/v2/entries/en/{word}'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())[0]

            # Get first definition and example
            meaning = data['meanings'][0]
            definition = meaning['definitions'][0]['definition']

            # Get example sentence if available
            example = meaning['definitions'][0].get('example', '')
            if not example:
                # Try to find an example in other definitions
                for defn in meaning['definitions']:
                    if defn.get('example'):
                        example = defn['example']
                        break

            # If still no example, create a simple one
            if not example:
                example = f"The word '{word}' is used in this context."

            # Get language origin if available
            origin = data.get('origin', 'To be determined')

            # Get phonetic if available
            phonetic = ''
            if 'phonetic' in data:
                phonetic = data['phonetic']
            elif 'phonetics' in data and len(data['phonetics']) > 0:
                phonetic = data['phonetics'][0].get('text', '')

            updated_words.append({
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
            break  # Success, exit retry loop

        except urllib.error.HTTPError as e:
            if e.code == 429:  # Too Many Requests
                if attempt < max_retries - 1:
                    print(f"  ⚠ Rate limited, waiting {retry_delay * (attempt + 1)} seconds...")
                    time.sleep(retry_delay * (attempt + 1))
                    continue
                else:
                    print(f"  ✗ Rate limit exceeded, skipping")
                    updated_words.append({
                        'word': word,
                        'definition': f'[Rate limited - definition for "{word}" to be added]',
                        'sentence': f'[Example sentence for "{word}" to be added]',
                        'wordList': '1000',
                        'beeDifficulty': 'oneBee',
                        'languageOrigin': 'To be determined',
                        'roots': [],
                        'isNewThisYear': False,
                        'pronunciationGuide': '',
                        'audioUrl': None
                    })
                    failed_words.append(word)
                    break
            elif e.code == 404:
        if e.code == 404:
            print(f"  ✗ Not found in dictionary")
            # Keep placeholder for words not found
            updated_words.append({
                'word': word,
                'definition': f'[Definition for "{word}" not found in dictionary]',
                'sentence': f'[Example sentence for "{word}" to be added manually]',
                'wordList': '1000',
                'beeDifficulty': 'oneBee',
                'languageOrigin': 'To be determined',
                'roots': [],
                'isNewThisYear': False,
                'pronunciationGuide': '',
                'audioUrl': None
            })
            failed_words.append(word)
                break
            else:
                raise

        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
            updated_words.append({
                'word': word,
                'definition': f'[Definition for "{word}" - error fetching]',
                'sentence': f'[Example sentence for "{word}" to be added]',
                'wordList': '1000',
                'beeDifficulty': 'oneBee',
                'languageOrigin': 'To be determined',
                'roots': [],
                'isNewThisYear': False,
                'pronunciationGuide': '',
                'audioUrl': None
            })
            failed_words.append(word)
            break

    # Rate limit: wait 2 seconds between requests to avoid 429 errors
    if i < len(words_match):
        time.sleep(2)

# Write updated JavaScript file
print(f"\nWriting updated file...")
with open('data/words-1000.js', 'w', encoding='utf-8') as f:
    f.write("// One Bee: 1,000 words (easier words with common patterns)\n")
    f.write("// Auto-generated with definitions from Free Dictionary API\n")
    f.write(f"// Total items: {len(updated_words)}\n\n")
    f.write("const words1000 = ")
    f.write(json.dumps(updated_words, indent=2, ensure_ascii=False))
    f.write(";\n")

print(f"\n✅ Complete!")
print(f"Successfully processed: {len(updated_words) - len(failed_words)}/{len(updated_words)}")
print(f"Failed/Not found: {len(failed_words)}")

if failed_words:
    print(f"\nWords that need manual review: {', '.join(failed_words[:20])}")
    if len(failed_words) > 20:
        print(f"... and {len(failed_words) - 20} more")
