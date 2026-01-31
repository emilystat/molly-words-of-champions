# Words of Champions Website - Implementation Plan

## Project Overview

Create a new spelling bee practice website for Molly focusing on the Words of Champions list (4,000 words total) with enhanced features for studying roots/patterns. This will be a separate website from the existing School Spelling Bee site.

**Source Material:** WordsOfChampions.pdf (located in /Users/Emily/claude-emily/Molly-spellingbee/)

**New Project Location:** /Users/Emily/claude-emily/Molly-spellingbee/Molly-wordsofchampions/

**Deployment:** New GitHub repository with GitHub Pages (e.g., emilystat.github.io/molly-words-of-champions)

## Word Organization Structure

### Primary Word Lists (4,000 words total)
From the PDF structure:
- **One Bee:** 1,000 words (pages 6-17 of PDF) - easier words with common patterns
- **Two Bee:** 2,000 words (pages 18-41 of PDF) - trickier words with more complex patterns
- **Three Bee:** 1,000 words (pages 42-55 of PDF) - challenging words with irregular patterns

### Cross-Referenced Difficulty Tags
Each word can also be tagged with bee difficulty (independent system):
- **oneBee** - Easy level
- **twoBee** - Medium level
- **threeBee** - Hard level

This allows filtering like:
- "Show me all Two Bee words that are also twoBee difficulty"
- "Show me One Bee words that are threeBee difficulty" (easier list, harder words)

## Key Features to Implement

### 1. Enhanced Study Modes (from current site)
Carry over the proven features:
- **Practice Mode:** Random words, unlimited attempts, manual pacing
- **Quiz Mode:** 10-word quizzes with scoring
- **Study Mode:** Sequential learning in groups of 10 with flashcards + testing
- **Review Difficult Words:** Dedicated mode for marked difficult words

### 2. NEW: Roots & Patterns Library
Based on PDF pages 64-81, implement a browsable roots library:

**Root Categories:**
- Greek (page 64-65)
- Latin (page 66-67)
- French (page 68-69)
- Italian (page 70)
- Spanish (page 71)
- German (page 72)
- Dutch/Afrikaans (page 73)
- Scandinavian (page 73)
- Japanese (page 74)
- Other East Asian (page 75)
- Austronesian (page 75)
- Sanskrit/South Asian (page 76)
- Hebrew (page 77)
- Arabic (page 77)
- Persian/Turkish (page 78)
- African/American/Eastern European (page 78)

**Root Browser Features:**
- Browse by language family
- Click on a root to see:
  - Root meaning
  - Example Words of Champions words containing that root
  - Etymology information
- Search functionality to find roots by keyword
- Link from any word in study mode to its roots

**Example:**
- Root: "tele" (Greek: distant, far)
- Meaning: distant, far
- Example words: telepathy, telegnosis, telescope
- Each example links back to the word's full entry

### 3. Dual Filtering System
Since 1000/2000/3000 and oneBee/twoBee/threeBee are independent:

**Filter Options:**
- Word List Level: "1000 words" OR "2000 words" OR "3000 words" OR "All Words"
- Bee Difficulty: "One Bee" OR "Two Bee" OR "Three Bee" OR "All Difficulties"
- Can combine both filters: e.g., "2000 words" + "Two Bee difficulty"

### 4. Improved Study Features
Building on current site strengths:
- **Customizable group sizes:** Allow 5, 10, 15, or 20 words per study group (current site only does 10)
- **Smart review:** Track which words are frequently missed
- **Spaced repetition:** Suggest review schedule based on performance
- **Custom study lists:** Create personalized lists from any combination of filters
- **Progress analytics:** Visual charts showing improvement over time
- **Word metadata display:** Show language of origin, roots, etymology for each word

### 5. Enhanced Progress Tracking
- Track progress separately for:
  - Each main word list (1000/2000/3000)
  - Each bee difficulty level
  - Each language family
- Export progress data (JSON download)
- Import progress data (for backup/transfer)
- Detailed statistics:
  - Words mastered vs. needs practice
  - Success rate per word
  - Time spent studying
  - Weak areas (by language family, word list, etc.)

## Data Structure

### Word Data Format
Each word object should contain:
```javascript
{
  word: "telepathy",
  definition: "communication by extrasensory means",
  sentence: "Some people claim to have telepathy abilities.",

  // Primary organization
  wordList: "2000",  // or "1000" or "3000"

  // Difficulty tag (independent)
  beeDifficulty: "twoBee",  // or "oneBee" or "threeBee"

  // Etymology and roots
  languageOrigin: "Greek",
  roots: [
    { root: "tele", meaning: "distant, far" },
    { root: "path", meaning: "feeling, disease" }
  ],

  // Metadata
  isNewThisYear: false,  // if word is on pages 56-61
  pronunciationGuide: "tuh-LEP-uh-thee",

  // Audio (optional future enhancement)
  audioUrl: null
}
```

## Technical Implementation

### Technology Stack
Following current site's proven approach:
- **Frontend:** Pure HTML/CSS/JavaScript (no frameworks)
- **Data Storage:** JavaScript files (one per word list level)
- **Progress Tracking:** localStorage (with export/import capability)
- **Hosting:** GitHub Pages (static site)
- **No backend required**

### File Structure
```
Molly-wordsofchampions/
├── index.html              # Main application
├── style.css              # Styling
├── script.js              # Main application logic
├── data/
│   ├── words-1000.js      # One Bee words
│   ├── words-2000.js      # Two Bee words
│   ├── words-3000.js      # Three Bee words
│   └── roots-data.js      # Roots/patterns library
├── README.md              # Project documentation
├── PLAN.md               # This implementation plan
└── .gitignore
```

### Roots Library Data Structure
```javascript
const rootsLibrary = {
  "Greek": [
    {
      root: "tele",
      meaning: "distant, far",
      exampleWords: ["telepathy", "telegnosis", "telescope"],
      notes: "Common in scientific and technical terms"
    },
    // ... more Greek roots
  ],
  "Latin": [
    // ... Latin roots
  ],
  // ... other language families
}
```

## Data Extraction Plan

### Phase 1: Extract Word Lists from PDF
Since the PDF contains all 4,000 words with definitions and sentences:

**Extraction approach:**
1. The PDF text has been read - we have the content from pages 6-55
2. Parse structured word lists from:
   - Pages 6-17: One Bee (1,000 words)
   - Pages 18-41: Two Bee (2,000 words)
   - Pages 42-55: Three Bee (1,000 words)
3. For each word, extract:
   - Word spelling
   - Definition (in gray boxes)
   - Example sentence
4. Assign cross-reference difficulty based on complexity analysis or manual tagging

**Note:** The PDF shows each word is listed with its definition often in a colored box, making it structured and parseable.

### Phase 2: Extract Roots/Patterns Data
From PDF pages 64-81:
1. Extract root tables and descriptions for each language family
2. Map roots to example words
3. Create the roots library data structure
4. Link roots back to words in main word lists

### Phase 3: Manual Review and Enhancement
1. Review extracted data for accuracy
2. Add pronunciation guides where helpful
3. Verify difficulty tagging
4. Add any missing cross-references

## Implementation Phases

### Phase 1: Project Setup & Data Preparation
**Files to create:**
- Project folder structure
- Extract and structure word data from PDF
- Create data files (words-1000.js, words-2000.js, words-3000.js)
- Extract and structure roots data
- Create roots-data.js

**Estimated complexity:** Medium-High (data extraction is most time-intensive)

### Phase 2: Core UI Implementation
**Files to create/modify:**
- index.html - Basic structure and layout
- style.css - Styling (adapt from current bee-themed site)
- script.js - Shell with mode management

**Features:**
- Header with bee branding
- Mode selector (Practice/Quiz/Study/Review Difficult/Browse Roots)
- Dual filter dropdowns (Word List Level + Bee Difficulty)
- Basic card-based layout
- Responsive design for mobile

### Phase 3: Study Modes Implementation
**script.js sections:**
- Practice Mode logic
- Quiz Mode (10 words, scoring)
- Study Mode (customizable groups, flashcards, testing)
- Review Difficult Words mode
- Progress tracking in localStorage
- Mark difficult words functionality

### Phase 4: Roots Library Implementation
**New features:**
- Roots browser interface
- Language family navigation
- Root detail view with example words
- Search functionality
- Integration with study modes (show roots for current word)

### Phase 5: Enhanced Progress Features
- Statistics dashboard
- Visual progress charts
- Export/import functionality
- Spaced repetition suggestions
- Detailed analytics by category

### Phase 6: Testing & Refinement
- Test all modes thoroughly
- Verify data accuracy
- Mobile testing
- Progress persistence testing
- Performance optimization for 4,000 words

### Phase 7: Deployment
- Create new GitHub repository
- Set up GitHub Pages
- Deploy site
- Test live site
- Share URL with Molly

## Improvements Over Current Site

### From Current Site Analysis
The current site (https://emilystat.github.io/molly-spelling-bee/) has:
- ✅ 450 words (good for school-level)
- ✅ Three difficulty levels
- ✅ Practice, Quiz, and Study modes
- ✅ Difficult words tracking
- ✅ Progress tracking with localStorage
- ✅ Reset progress functionality
- ✅ Manual pacing (no auto-advance)
- ✅ Bee-themed design
- ✅ Text-to-speech

### New Site Will Add
- ⭐ **4,000 words** (vs 450) - nearly 9x more content
- ⭐ **Dual filtering system** - Two independent ways to organize (word list level + difficulty)
- ⭐ **Roots & Patterns Library** - Browse and learn etymology
- ⭐ **Customizable study groups** - Choose group size (5/10/15/20)
- ⭐ **Enhanced analytics** - Charts and detailed statistics
- ⭐ **Export/import progress** - Backup and restore capability
- ⭐ **Smart review suggestions** - Based on performance patterns
- ⭐ **Etymology integration** - See roots for each word while studying
- ⭐ **Search functionality** - Find words and roots quickly

### Features to Keep From Current Site
- Text-to-speech (Web Speech API)
- Bee-themed design (yellow/gold colors, bee emoji 🐝)
- localStorage progress tracking
- Manual pacing with "Next Word" button
- Two-phase study mode (study then test)
- Mark difficult words functionality
- Reset progress options
- Responsive mobile design
- No backend required (static site)

## Potential Challenges & Solutions

### Challenge 1: Large Dataset (4,000 words)
**Problem:** 4,000 words might cause performance issues loading all at once

**Solution:**
- Split into three separate data files (words-1000.js, words-2000.js, words-3000.js)
- Lazy-load data files only when needed
- Use efficient data structures (objects for lookup, arrays for iteration)
- Consider IndexedDB for very large datasets if localStorage becomes limiting

### Challenge 2: Data Extraction from PDF
**Problem:** Extracting 4,000 words accurately from PDF

**Solution:**
- Use structured parsing of the PDF content we've already read
- The PDF has consistent formatting (word, definition in box, sentence)
- Implement validation checks during extraction
- Manual spot-checking of samples
- May need some manual cleanup/correction

### Challenge 3: Roots Library Complexity
**Problem:** Mapping roots to words across 4,000-word dataset

**Solution:**
- Start with major roots from PDF (already categorized by language)
- Build incrementally - start with Greek/Latin (most common)
- Use automated matching where possible (search for root in word)
- Manual verification for accuracy
- Phase implementation (launch with core roots, expand over time)

### Challenge 4: Progress Tracking Complexity
**Problem:** Tracking progress across multiple dimensions (word list, difficulty, language family)

**Solution:**
- Use structured progress object in localStorage
- Separate tracking for each dimension
- Aggregate views in dashboard
- Implement export functionality early for data backup

### Challenge 5: Mobile Performance
**Problem:** Rich features might be sluggish on mobile

**Solution:**
- Progressive enhancement approach
- Test on mobile devices early
- Optimize for touch interactions
- Consider simplified mobile view if needed
- Use CSS for animations (GPU-accelerated)

## Success Criteria

The new Words of Champions website will be considered successful when:

1. ✅ All 4,000 words are accurately loaded and accessible
2. ✅ Both filtering systems work independently and in combination
3. ✅ All study modes (Practice, Quiz, Study, Review) function correctly
4. ✅ Roots library is browsable with example words
5. ✅ Progress tracking works reliably across sessions
6. ✅ Site is responsive and works well on mobile devices
7. ✅ Performance is good even with large dataset
8. ✅ Site is deployed to GitHub Pages and accessible via URL
9. ✅ Molly can effectively use it to study for Words of Champions competitions
10. ✅ Features are intuitive and don't require extensive documentation

## Future Enhancements (Post-Launch)

Potential additions for later:
- Audio pronunciations for all words (recorded or high-quality TTS)
- Multiplayer mode (compete with friends)
- Printable study sheets
- Integration with Scripps Spelling Bee Word Club app data
- Gamification (badges, streaks, achievements)
- Dark mode toggle
- More advanced spaced repetition algorithms
- Teacher dashboard (if multiple students use it)
- API integration with Merriam-Webster for additional word data

## Questions & Decisions Needed

### Before Implementation:
1. ✅ **Data source:** WordsOfChampions.pdf confirmed
2. ✅ **Roots feature:** Confirmed - Browse roots library with example words
3. ✅ **Organization:** Confirmed - Independent systems (word list + difficulty)
4. ✅ **Deployment:** Confirmed - New GitHub repo with GitHub Pages

### During Implementation:
1. **Color scheme:** Keep current bee theme (yellow/gold) or new colors?
2. **Study group defaults:** What should default group size be? (Suggest 10 to match current site)
3. **Root depth:** How many roots to include initially? (Suggest start with Greek/Latin)
4. **TTS:** Keep Web Speech API or enhance? (Suggest keep initially)
5. **Analytics detail:** How granular should statistics be? (Can determine based on data structure)

## Timeline Estimate

**Note:** Per instructions, no time estimates provided. Breaking into phases allows flexible scheduling.

**Dependencies:**
- Phase 1 must complete before other phases (need data files)
- Phase 2 must complete before Phases 3-4 (need UI shell)
- Phases 3-5 can be done incrementally/iteratively
- Phase 6 happens throughout development
- Phase 7 is final step

**Priority ordering:**
1. **P0 (Critical):** Phases 1-3 - Core functionality
2. **P1 (Important):** Phase 4 - Roots library (key differentiator)
3. **P2 (Nice-to-have):** Phase 5 - Enhanced analytics
4. **P3 (Can defer):** Future enhancements

## Conclusion

This plan provides a comprehensive roadmap for building a Words of Champions website that:
- Scales up from 450 to 4,000 words
- Maintains proven features from the current site
- Adds powerful new features (roots library, dual filtering, enhanced analytics)
- Provides an excellent study tool for Molly's Words of Champions preparation
- Can be deployed independently without affecting the current school spelling bee site

The modular approach allows for iterative development, testing each feature before moving to the next. The data-driven design ensures scalability and maintainability.

---

**Plan created:** January 30, 2026
**Plan author:** Claude (Sonnet 4.5)
**Project location:** /Users/Emily/claude-emily/Molly-spellingbee/Molly-wordsofchampions/
**Target deployment:** New GitHub repository with Pages enabled
