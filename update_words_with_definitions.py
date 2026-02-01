#!/usr/bin/env python3
"""
Update word lists with real definitions from 2026 Champ Bee Words Excel file
"""

import openpyxl
import json
import re

def normalize_word(word):
    """Normalize word for comparison (lowercase, strip asterisks and whitespace)"""
    return word.strip().lower().replace('*', '').strip()

def read_excel_definitions():
    """Read definitions from Excel file"""
    print("📖 Reading definitions from Excel file...")

    wb = openpyxl.load_workbook(
        '../2026 Champ Bee Words -2 lists (by language of origin and ABC order for ALL words).xlsx',
        read_only=True
    )
    ws = wb['Words sorted by Orign & Level']

    definitions_dict = {}

    for row in ws.iter_rows(min_row=5, values_only=True):
        level = row[1]  # Column 2: B1, B2, etc.
        word = row[3]   # Column 4: Word
        origin = row[6]  # Column 7: Language of Origin
        definition = row[7]  # Column 8: Definition
        sentence = row[8]  # Column 9: Sample Sentence

        if not word or not definition:
            continue

        # Only process B1 (One Bee) and B2 (Two Bee) words
        if level not in ['B1', 'B2']:
            continue

        word_key = normalize_word(word)

        definitions_dict[word_key] = {
            'level': level,
            'origin': origin.strip() if origin else 'To be determined',
            'definition': definition.strip() if definition else '',
            'sentence': sentence.strip() if sentence else ''
        }

    wb.close()

    print(f"  ✓ Loaded {len(definitions_dict)} words with definitions")
    return definitions_dict

def update_word_list(input_file, output_file, var_name, definitions_dict, word_list_name):
    """Update a word list with definitions from Excel"""
    print(f"\n📝 Updating {word_list_name}...")

    # Read current word list
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON data (everything after "const varName = " and before ";\n")
    match = re.search(r'const\s+\w+\s*=\s*(\[[\s\S]*\]);', content)
    if not match:
        print(f"  ✗ Could not parse {input_file}")
        return

    words = json.loads(match.group(1))

    # Update words with definitions from Excel
    updated_count = 0
    google_link_count = 0

    for word_obj in words:
        word = word_obj['word']
        word_key = normalize_word(word)

        if word_key in definitions_dict:
            excel_data = definitions_dict[word_key]

            # Update with real data
            word_obj['languageOrigin'] = excel_data['origin']
            word_obj['definition'] = excel_data['definition']
            word_obj['sentence'] = excel_data['sentence'] if excel_data['sentence'] else f'[Example sentence to be added. <a href="https://www.google.com/search?q={word}+example+sentence" target="_blank">Search Google</a>]'

            # Remove googleLink if it exists
            if 'googleLink' in word_obj:
                del word_obj['googleLink']

            updated_count += 1
        else:
            # Keep Google links for words without definitions
            google_link_count += 1

    # Write updated word list
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"// {word_list_name}\n")
        f.write(f"// Updated with definitions from 2026 Champ Bee Words Excel file\n")
        f.write(f"// Total items: {len(words)}\n")
        f.write(f"// With real definitions: {updated_count}, Google links: {google_link_count}\n")
        f.write("\n")
        f.write(f"const {var_name} = ")
        f.write(json.dumps(words, indent=2, ensure_ascii=False))
        f.write(";\n")

    print(f"  ✓ Updated {updated_count} words with real definitions")
    print(f"  ✓ {google_link_count} words still use Google links")

    return updated_count, google_link_count

# Main execution
print("🐝 Updating word lists with definitions from Excel file\n")

definitions_dict = read_excel_definitions()

# Update One Bee (B1)
one_bee_updated, one_bee_google = update_word_list(
    'data/words-1000.js',
    'data/words-1000.js',
    'words1000',
    definitions_dict,
    'One Bee: 1,000 words (easier words with common patterns)'
)

# Update Two Bee (B2)
two_bee_updated, two_bee_google = update_word_list(
    'data/words-2000.js',
    'data/words-2000.js',
    'words2000',
    definitions_dict,
    'Two Bee: 2,000 words (trickier words with more complex patterns)'
)

print("\n✅ All word lists updated successfully!")
print(f"\nSummary:")
print(f"  One Bee: {one_bee_updated} real definitions, {one_bee_google} Google links")
print(f"  Two Bee: {two_bee_updated} real definitions, {two_bee_google} Google links")
print(f"  Total: {one_bee_updated + two_bee_updated} words with real definitions")
