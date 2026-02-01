#!/usr/bin/env python3
"""
Update One Bee words from Excel file with proper definitions and Google links
"""

import openpyxl
import json

# Load the Excel file
excel_path = '/Users/Emily/Downloads/OneTwoThreeBee_AI_Definitions_Examples_UPDATED.xlsx'
wb = openpyxl.load_workbook(excel_path, read_only=True)
ws = wb['One Bee']

# Generic phrases that indicate placeholder content
GENERIC_PHRASES = [
    "a person, place, thing, or idea that is important to understand in context",
    "During the lesson, the teacher explained",
    "Understanding",
    "helped the students answer the question",
    "describing a noun by giving more information",
    "the study of a specific subject or field",
    "describing how an action is done",
    "the act of doing something",
    "made the concept easy to understand",
    "aloud",
    "you are less likely to make a mistake"
]

def is_useful_content(text):
    """Check if text is useful (not a generic placeholder)"""
    if not text or not text.strip():
        return False

    # Check if it contains any generic phrases
    for phrase in GENERIC_PHRASES:
        if phrase.lower() in text.lower():
            return False

    return True

# Convert words from the sheet
words = []
with_definitions = 0
with_google_links = 0

for row in ws.iter_rows(min_row=2, values_only=True):
    word = row[0]
    if word:
        word = word.strip()
        definition = row[1].strip() if row[1] else ""
        sentence = row[2].strip() if row[2] else ""

        # Check if definition and sentence are useful
        has_useful_definition = is_useful_content(definition)
        has_useful_sentence = is_useful_content(sentence)

        # Create word object
        word_obj = {
            "word": word,
            "wordList": "1000",
            "beeDifficulty": "oneBee",
            "languageOrigin": "To be determined",
            "roots": [],
            "isNewThisYear": False,
            "pronunciationGuide": "",
            "audioUrl": None
        }

        # Set definition
        if has_useful_definition:
            word_obj["definition"] = definition
            with_definitions += 1
        else:
            word_obj["definition"] = f'[Definition not available. <a href="https://www.google.com/search?q={word}+meaning" target="_blank">Search Google</a>]'
            word_obj["googleLink"] = f"https://www.google.com/search?q={word}+meaning"
            with_google_links += 1

        # Set sentence
        if has_useful_sentence:
            word_obj["sentence"] = sentence
        else:
            word_obj["sentence"] = f'[Example sentence to be added. <a href="https://www.google.com/search?q={word}+example+sentence" target="_blank">Search Google</a>]'
            if "googleLink" not in word_obj:
                word_obj["googleLink"] = f"https://www.google.com/search?q={word}+meaning"

        words.append(word_obj)

wb.close()

# Write JavaScript file
output_file = 'data/words-1000.js'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("// One Bee: 1,000 words (easier words with common patterns)\n")
    f.write("// Definitions from 2026 Champ Bee Words Excel file\n")
    f.write(f"// Total items: {len(words)}\n")
    f.write(f"// With definitions: {with_definitions}, Google links: {with_google_links}\n")
    f.write("\n")
    f.write("const words1000 = ")
    f.write(json.dumps(words, indent=2, ensure_ascii=False))
    f.write(";\n")

print(f"✅ Updated One Bee words!")
print(f"Total words: {len(words)}")
print(f"With useful definitions: {with_definitions}")
print(f"With Google links: {with_google_links}")
print(f"\nOutput file: {output_file}")
