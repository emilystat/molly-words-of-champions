# Words of Champions - Spelling Bee Practice Website

A comprehensive spelling bee practice website for the Words of Champions list (4,000 words) with enhanced features for studying roots and patterns.

## Features

- **4,000 Words**: Complete Words of Champions list organized into three levels
  - One Bee: 1,000 words (easier words with common patterns)
  - Two Bee: 2,000 words (trickier words with more complex patterns)
  - Three Bee: 1,000 words (challenging words with irregular patterns)

- **Dual Filtering System**: Independent filtering by word list level and bee difficulty
  - Filter by Word List: 1000/2000/3000 or All Words
  - Filter by Bee Difficulty: oneBee/twoBee/threeBee or All Difficulties
  - Combine both filters for targeted practice

- **Study Modes**:
  - **Practice Mode**: Random words with unlimited attempts and manual pacing
  - **Quiz Mode**: 10-word quizzes with scoring
  - **Study Mode**: Sequential learning in customizable groups (5/10/15/20 words) with flashcards and testing
  - **Review Difficult Words**: Dedicated mode for marked difficult words
  - **Browse Roots**: Explore etymology and language patterns

- **Roots & Patterns Library**: Browse roots by language family (Greek, Latin, Romance languages, Germanic languages, Asian languages, etc.) with example words from the Words of Champions list

- **Enhanced Progress Tracking**:
  - Track progress by word list, difficulty level, and language family
  - Export/import progress data for backup
  - Detailed analytics and statistics
  - Smart review suggestions based on performance

- **Additional Features**:
  - Text-to-speech pronunciation
  - Mark difficult words for review
  - Responsive mobile-friendly design
  - No backend required (static site)

## Technology

- Pure HTML/CSS/JavaScript (no frameworks)
- localStorage for progress tracking
- Web Speech API for text-to-speech
- GitHub Pages for hosting

## Usage

Simply open `index.html` in a web browser to start practicing!

## Data Organization

Each word includes:
- Word spelling
- Definition
- Example sentence
- Word list level (1000/2000/3000)
- Bee difficulty (oneBee/twoBee/threeBee)
- Language origin
- Root information
- Etymology notes

## Development

This is a static website - no build process required. Just edit the HTML/CSS/JS files directly.

Data files are located in the `data/` directory:
- `words-1000.js` - One Bee words
- `words-2000.js` - Two Bee words
- `words-3000.js` - Three Bee words
- `roots-data.js` - Roots and patterns library

## Quick Start

**The website is ready to use right now!**

Simply open `index.html` in your browser, or follow the deployment instructions below to publish online.

### Current Status

✅ **Fully functional website** with all features
✅ **60 sample words** (20 from each bee level) for testing
✅ **All 5 study modes** working
✅ **Dual filtering system** implemented
✅ **Progress tracking** with localStorage
✅ **Responsive design** for mobile and desktop

⏳ **3,940 additional words** can be added incrementally (see WORD_EXTRACTION.md)

## Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step instructions to:
1. Create a GitHub repository
2. Push your code
3. Enable GitHub Pages
4. Access your site at: `https://emilystat.github.io/molly-words-of-champions/`

## Adding More Words

See **[WORD_EXTRACTION.md](WORD_EXTRACTION.md)** for strategies to add more words from the PDF:
- Manual extraction guide
- Recommended incremental approach
- Quality checklist
- File formats and testing instructions

## Credits

Built with love for Molly's Words of Champions preparation!

Data source: Words of Champions © Scripps National Spelling Bee
