#!/bin/bash

# Deployment script for Words of Champions website

echo "🐝 Words of Champions - GitHub Deployment 🐝"
echo "=============================================="
echo ""

# Check if remote exists
if git remote | grep -q origin; then
    echo "✓ Remote 'origin' already configured"
else
    echo "Setting up remote..."
    # You'll need to replace this with your actual GitHub repo URL after creating it
    echo "Please create a repository on GitHub first, then run:"
    echo "git remote add origin https://github.com/emilystat/molly-words-of-champions.git"
    echo ""
    read -p "Press Enter after creating the repository and adding the remote..."
fi

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

# Enable GitHub Pages (manual step required)
echo ""
echo "=============================================="
echo "Next steps to enable GitHub Pages:"
echo "1. Go to https://github.com/emilystat/molly-words-of-champions/settings/pages"
echo "2. Under 'Source', select 'main' branch"
echo "3. Click 'Save'"
echo "4. Your site will be available at: https://emilystat.github.io/molly-words-of-champions/"
echo "=============================================="
