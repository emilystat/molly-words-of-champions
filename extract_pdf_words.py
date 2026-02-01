#!/usr/bin/env python3
"""
Extract One Bee words from the PDF to compare with Excel data.
"""

import re

# Based on manual inspection of the PDF, let me check specific suspicious entries
# Row 572 context: leaven (571), "Bee turned" (572), "Years" (573), maximum (574)
# Row 869 context: sloop (868), "It wasn't until" (869), stencil (870)

# From the PDF One Bee section (pages 6-17), I'll look for words that should be
# in those positions alphabetically

# Looking at the PDF content, after "leaven" and before "maximum":
# The words should be in alphabetical order

# Searching for words around row 572 position:
# After "leaven" (L words) and before "maximum" (M words)
# Could be words starting with: li-, lo-, lu-, ly-, or early M words

# Searching for words around row 869 position:
# After "sloop" (S words) and before "stencil" (S words)
# Should be other S words

print("Analyzing suspicious entries...")
print("\nRow 572 area:")
print("  Row 571: leaven")
print("  Row 572: 'Bee turned' <- SUSPICIOUS")
print("  Row 573: 'Years' <- SUSPICIOUS (capital Y)")
print("  Row 574: maximum")
print("\nRow 869 area:")
print("  Row 868: sloop")
print("  Row 869: 'It wasn't until' <- SUSPICIOUS")
print("  Row 870: stencil")

print("\n" + "="*60)
print("SEARCHING PDF FOR CORRECT WORDS...")
print("="*60)

# Based on the PDF One Bee section, let me identify likely correct words
# by looking at what would fit alphabetically

# From visual inspection of the PDF at page 12-13 area:
# The progression goes: league -> leaven -> ??? -> maximum

# Let me check what One Bee words exist between "leaven" and "maximum"
# Checking the PDF content around pages 12-16...

# For sloop -> ??? -> stencil
# Need to find S words between these two

print("\nChecking PDF One Bee word list for alphabetical sequence...")
print("\nLooking for words that would fall between:")
print("1. 'leaven' and 'maximum'")
print("2. 'sloop' and 'stencil'")
