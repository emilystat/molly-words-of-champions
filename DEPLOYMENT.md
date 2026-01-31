# Deployment Instructions

## Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `molly-words-of-champions`
3. Description: `Words of Champions spelling bee practice website - 4,000 words with roots & patterns`
4. Choose **Public**
5. Do NOT initialize with README (we already have files)
6. Click **Create repository**

### Step 2: Push Your Code

From the project directory, run these commands:

```bash
cd /Users/Emily/claude-emily/Molly-spellingbee/Molly-wordsofchampions

# Add the GitHub remote (replace emilystat with your username if different)
git remote add origin https://github.com/emilystat/molly-words-of-champions.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Source**, select **main** branch
5. Click **Save**
6. Wait 1-2 minutes for deployment

### Your Site Will Be Live At:
```
https://emilystat.github.io/molly-words-of-champions/
```

## Updating the Site

After making changes to any files:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically rebuild and deploy (takes 1-2 minutes).

## Current Status

✅ Website is fully functional with 60 sample words
✅ All 5 study modes working
✅ Dual filtering system implemented
✅ Progress tracking active
✅ Responsive mobile design

⏳ Full 4,000-word dataset extraction pending (see WORD_EXTRACTION.md)
