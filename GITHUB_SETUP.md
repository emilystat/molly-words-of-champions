# GitHub Repository Setup - Quick Guide

## Step 1: Create Repository (Browser is Opening)

The GitHub new repository page should be opening in your browser.

Fill in these details:
- **Repository name:** `molly-words-of-champions`
- **Description:** `Words of Champions spelling bee practice website - 4,000 words with roots & patterns`
- **Visibility:** Public ✓
- **Initialize this repository with:**
  - [ ] Do NOT check "Add a README file"
  - [ ] Do NOT check "Add .gitignore"
  - [ ] Do NOT check "Choose a license"

(We already have these files!)

Click **"Create repository"**

## Step 2: Push Your Code

After creating the repository, run these commands:

```bash
cd /Users/Emily/claude-emily/Molly-spellingbee/Molly-wordsofchampions

# Add the GitHub remote
git remote add origin https://github.com/emilystat/molly-words-of-champions.git

# Push your code
git push -u origin main
```

If prompted for credentials, you may need to use a Personal Access Token instead of a password.

## Step 3: Enable GitHub Pages

1. Go to: https://github.com/emilystat/molly-words-of-champions/settings/pages
2. Under "Source", select **main** branch
3. Click **Save**
4. Wait 1-2 minutes for deployment

## Your Site Will Be Live At:

```
https://emilystat.github.io/molly-words-of-champions/
```

## Quick Setup Script

Or run this script to do it all:

```bash
cd /Users/Emily/claude-emily/Molly-spellingbee/Molly-wordsofchampions
git remote add origin https://github.com/emilystat/molly-words-of-champions.git
git push -u origin main
echo "✅ Code pushed to GitHub!"
echo "Now enable GitHub Pages at: https://github.com/emilystat/molly-words-of-champions/settings/pages"
```

## Troubleshooting

**If remote already exists:**
```bash
git remote remove origin
git remote add origin https://github.com/emilystat/molly-words-of-champions.git
git push -u origin main
```

**If you need to use a different username:**
Replace `emilystat` with your GitHub username in the commands above.
