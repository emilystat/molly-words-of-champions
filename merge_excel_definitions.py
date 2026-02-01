#!/usr/bin/env python3
"""
Merge definitions from 2026 Excel file into word data files
"""

import openpyxl
import json
import re

# Load Excel file with definitions
print("Loading Excel file...")
excel_path = '../2026 Champ Bee Words -2 lists (by language of origin and ABC order for ALL words).xlsx'
wb = openpyxl.load_workbook(excel_path, read_only=True)
ws = wb["ALL Words in ABC Order - useful"]

# Extract word data from Excel (starting from row 3)
excel_words = {}
print("Extracting word data from Excel...")

for row in ws.iter_rows(min_row=4, values_only=True):
    word = row[3]  # Column 4: Word
    if word and isinstance(word, str):
        word = word.strip().lower()
        excel_words[word] = {
            'word': row[3].strip() if row[3] else '',
            'pronunciation': row[5].strip() if row[5] else '',
            'origin': row[6].strip() if row[6] else 'To be determined',
            'definition': row[7].strip() if row[7] else '',
            'sentence': row[8].strip() if row[8] else ''
        }

print(f"Found {len(excel_words)} words with definitions in Excel")
wb.close()

# Function to update a word data file
def update_word_file(input_file, output_file, bee_level, bee_difficulty):
    print(f"\nProcessing {input_file}...")

    # Read current file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract current words
    current_words = re.findall(r'"word":\s*"([^"]+)"', content)
    print(f"  Found {len(current_words)} words in current file")

    # Update each word
    updated_words = []
    matched = 0
    not_found = 0

    for word in current_words:
        word_lower = word.lower()

        if word_lower in excel_words:
            # Word found in Excel - use real data
            excel_data = excel_words[word_lower]

            definition = excel_data['definition'] if excel_data['definition'] else f'[Definition for "{word}" to be added]'

            # If sentence is missing from Excel, add Google search link
            if excel_data['sentence']:
                sentence = excel_data['sentence']
            else:
                google_link_sentence = f'https://www.google.com/search?q={word.replace(" ", "+")}+example+sentence'
                sentence = f'[Example sentence to be added. <a href="{google_link_sentence}" target="_blank">Google "{word} example sentence"</a>]'

            origin = excel_data['origin'] if excel_data['origin'] else 'To be determined'
            pronunciation = excel_data['pronunciation']

            updated_words.append({
                'word': word,
                'definition': definition,
                'sentence': sentence,
                'wordList': bee_level,
                'beeDifficulty': bee_difficulty,
                'languageOrigin': origin,
                'roots': [],
                'isNewThisYear': False,
                'pronunciationGuide': pronunciation,
                'audioUrl': None
            })
            matched += 1
        else:
            # Word NOT found in Excel - add Google search link
            google_link_meaning = f'https://www.google.com/search?q={word.replace(" ", "+")}+meaning'
            google_link_sentence = f'https://www.google.com/search?q={word.replace(" ", "+")}+example+sentence'

            updated_words.append({
                'word': word,
                'definition': f'[Definition not available. <a href="{google_link_meaning}" target="_blank">Google "{word} meaning"</a>]',
                'sentence': f'[Example sentence to be added. <a href="{google_link_sentence}" target="_blank">Google "{word} example sentence"</a>]',
                'wordList': bee_level,
                'beeDifficulty': bee_difficulty,
                'languageOrigin': 'To be determined',
                'roots': [],
                'isNewThisYear': False,
                'pronunciationGuide': '',
                'audioUrl': None,
                'googleLink': google_link_meaning
            })
            not_found += 1

    print(f"  Matched: {matched}, Not found (Google links added): {not_found}")

    # Write updated file
    with open(output_file, 'w', encoding='utf-8') as f:
        if bee_level == '1000':
            comment = 'One Bee: 1,000 words (easier words with common patterns)'
        elif bee_level == '2000':
            comment = 'Two Bee: 2,000 words (trickier words with more complex patterns)'
        else:
            comment = 'Three Bee: 1,000 words (challenging words with irregular patterns)'

        f.write(f"// {comment}\n")
        f.write(f"// Definitions from 2026 Champ Bee Words Excel file\n")
        f.write(f"// Total items: {len(updated_words)}\n")
        f.write(f"// With definitions: {matched}, Google links: {not_found}\n\n")
        f.write(f"const words{bee_level} = ")
        f.write(json.dumps(updated_words, indent=2, ensure_ascii=False))
        f.write(";\n")

    print(f"  ✓ Updated {output_file}")

# Update all three word files
update_word_file('data/words-1000.js', 'data/words-1000.js', '1000', 'oneBee')
update_word_file('data/words-2000.js', 'data/words-2000.js', '2000', 'twoBee')
update_word_file('data/words-3000.js', 'data/words-3000.js', '3000', 'threeBee')

print("\n✅ All word files updated successfully!")
print("\nSummary:")
print("- Words with definitions from Excel: Use real definitions")
print("- Words not in Excel: Have Google search links for easy lookup")
