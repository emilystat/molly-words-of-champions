# Word Extraction Guide

## Current Status

✅ **60 sample words** extracted (20 from each bee level)
⏳ **3,940 words** remaining to extract from PDF

## PDF Structure

**Source:** `/Users/Emily/claude-emily/Molly-spellingbee/WordsOfChampions.pdf`

- Pages 6-17: One Bee (1,000 words)
- Pages 18-41: Two Bee (2,000 words)
- Pages 42-55: Three Bee (1,000 words)
- Pages 64-81: Language patterns and roots

## Recommended Extraction Approaches

### Option 1: Manual Extraction (Most Accurate)

**Pros:** Complete control, highest accuracy
**Cons:** Time-intensive for 4,000 words

**Process:**
1. Open `WordsOfChampions.pdf`
2. Copy text from a page
3. Add words to the appropriate data file following this format:

```javascript
{
  word: "example",
  definition: "definition text here",
  sentence: "Example sentence here.",
  wordList: "1000",  // or "2000" or "3000"
  beeDifficulty: "oneBee",  // or "twoBee" or "threeBee"
  languageOrigin: "",  // Add later from pages 64-81
  roots: [],  // Add later from pages 64-81
  isNewThisYear: false,
  pronunciationGuide: "",
  audioUrl: null
},
```

### Option 2: Incremental Approach (Recommended)

Add words gradually as Molly studies:

1. **Keep the current 60 sample words** - site is fully functional
2. **Add 10-20 words per session** as you review material with Molly
3. This ensures words are accurate and useful for her practice
4. Deploy updates to GitHub Pages regularly

**Benefits:**
- Site is immediately usable
- Quality over quantity
- Words added are ones Molly is actually studying
- Can add pronunciation and notes as you go

### Option 3: Hybrid Approach

1. **Use current sample (60 words)** for initial deployment
2. **Extract high-priority sections first:**
   - New words for this year (pages 56-61)
   - Words from specific language families Molly finds challenging
   - Words at her current difficulty level
3. **Add remaining words over time**

### Option 4: Python Script with OCR

If you want to automate extraction:

```bash
# Install dependencies
pip3 install PyPDF2 pdfplumber

# Run extraction script (will need refinement)
python3 /Users/Emily/claude-emily/Molly-spellingbee/extract_words.py
```

**Note:** This requires manual review and cleanup due to PDF formatting variations.

## Files to Update

### For One Bee words:
```
/Users/Emily/claude-emily/Molly-spellingbee/Molly-wordsofchampions/data/words-1000.js
```

### For Two Bee words:
```
/Users/Emily/claude-emily/Molly-spellingbee/Molly-wordsofchampions/data/words-2000.js
```

### For Three Bee words:
```
/Users/Emily/claude-emily/Molly-spellingbee/Molly-wordsofchampions/data/words-3000.js
```

## Testing After Adding Words

1. Open `index.html` in your browser
2. Select the word list level you updated
3. Try Practice Mode to verify words display correctly
4. Check that filters work properly

## Committing Updates

After adding words:

```bash
cd /Users/Emily/claude-emily/Molly-spellingbee/Molly-wordsofchampions
git add data/
git commit -m "Add [number] new words to [One/Two/Three] Bee list"
git push
```

## Quality Checklist

When adding words, ensure:
- [ ] Word spelling is correct
- [ ] Definition is complete and readable
- [ ] Sentence makes sense (if available)
- [ ] Proper JavaScript syntax (commas, quotes, brackets)
- [ ] No special characters that break JavaScript strings

## Tips for Efficient Extraction

1. **Work in batches** - 25-50 words at a time
2. **Use a text editor** with syntax highlighting (VS Code, Sublime)
3. **Test frequently** - Verify words load correctly after each batch
4. **Keep PDF open** - Reference as you add words
5. **Use find/replace** - For consistent formatting

## Etymology and Roots (Future Enhancement)

Pages 64-81 contain language pattern information. This can be added later:

1. Extract roots by language family
2. Update `data/roots-data.js`
3. Link words to their roots by adding to word.roots array
4. This enhances the Browse Roots feature

## Realistic Timeline

- **Immediate:** 60 words (✅ Done)
- **Week 1:** Add 100-200 priority words
- **Month 1:** 500-1,000 words (site very useful at this point)
- **Full 4,000:** Incremental addition as needed

## My Recommendation

**Deploy the site NOW with the 60 sample words.** The site is fully functional and provides real value immediately. Then add words incrementally based on what Molly is studying. This approach:

✅ Gets the site live quickly
✅ Provides immediate practice value
✅ Allows for quality over speed
✅ Keeps the project manageable
✅ Words added will be the ones Molly actually needs

Quality matters more than quantity - a well-curated list of 500 words Molly is actively studying is more valuable than 4,000 words she may never encounter.
