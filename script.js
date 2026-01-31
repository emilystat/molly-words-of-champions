// Words of Champions - Main Script

// Global State
let currentMode = null;
let allWords = [];
let filteredWords = [];
let currentWord = null;
let currentWordIndex = 0;
let quizWords = [];
let quizScore = 0;
let quizQuestion = 0;
let studyGroup = [];
let studyGroupSize = 10;
let studyPhase = 'learn'; // 'learn' or 'test'
let flashcardIndex = 0;
let isFlipped = false;
let testIndex = 0;
let testScore = 0;
let missedWords = [];

// Progress Data (stored in localStorage)
let progressData = {
    studied: {},      // {word: {attempts: 0, correct: 0, lastStudied: timestamp}}
    mastered: [],     // [word1, word2, ...]
    difficult: []     // [word1, word2, ...]
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadProgressData();
    combineAllWords();
    updateFilters();
    updateProgressStats();
});

// Combine all word datasets
function combineAllWords() {
    allWords = [
        ...words1000.map(w => ({...w, wordList: '1000'})),
        ...words2000.map(w => ({...w, wordList: '2000'})),
        ...words3000.map(w => ({...w, wordList: '3000'}))
    ];
    filteredWords = [...allWords];
}

// Filter Management
function updateFilters() {
    const wordListFilter = document.getElementById('wordListFilter').value;
    const difficultyFilter = document.getElementById('difficultyFilter').value;

    filteredWords = allWords.filter(word => {
        let matchWordList = wordListFilter === 'all' || word.wordList === wordListFilter;
        let matchDifficulty = difficultyFilter === 'all' || word.beeDifficulty === difficultyFilter;
        return matchWordList && matchDifficulty;
    });

    // Update filter info
    const filterInfo = document.getElementById('filterInfo');
    const wordListName = wordListFilter === 'all' ? 'all' : getWordListName(wordListFilter);
    const difficultyName = difficultyFilter === 'all' ? 'all difficulties' : getDifficultyName(difficultyFilter);

    filterInfo.textContent = `Showing ${filteredWords.length} words (${wordListName}, ${difficultyName})`;
}

function getWordListName(list) {
    const names = {
        '1000': 'One Bee',
        '2000': 'Two Bee',
        '3000': 'Three Bee'
    };
    return names[list] || list;
}

function getDifficultyName(difficulty) {
    const names = {
        'oneBee': 'One Bee difficulty',
        'twoBee': 'Two Bee difficulty',
        'threeBee': 'Three Bee difficulty'
    };
    return names[difficulty] || difficulty;
}

// Mode Selection
function selectMode(mode) {
    currentMode = mode;

    // Hide mode selection
    document.getElementById('modeSelection').style.display = 'none';

    // Show appropriate interface based on mode
    if (mode === 'practice') {
        startPracticeMode();
    } else if (mode === 'quiz') {
        startQuizMode();
    } else if (mode === 'study') {
        showGroupSizeSelection();
    } else if (mode === 'review') {
        startReviewMode();
    } else if (mode === 'roots') {
        startRootsMode();
    }
}

function exitMode() {
    currentMode = null;

    // Hide all mode interfaces
    document.getElementById('wordCard').style.display = 'none';
    document.getElementById('studyCard').style.display = 'none';
    document.getElementById('rootsBrowser').style.display = 'none';
    document.getElementById('groupSizeSelection').style.display = 'none';

    // Show mode selection
    document.getElementById('modeSelection').style.display = 'block';

    // Update progress stats
    updateProgressStats();
}

// Practice Mode
function startPracticeMode() {
    if (filteredWords.length === 0) {
        alert('No words available with current filters!');
        exitMode();
        return;
    }

    document.getElementById('modeTitle').textContent = 'Practice Mode';
    document.getElementById('wordCard').style.display = 'block';
    document.getElementById('answerSection').style.display = 'none';
    document.getElementById('quizScore').style.display = 'none';

    loadRandomWord();
}

function loadRandomWord() {
    if (filteredWords.length === 0) {
        alert('No words available!');
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    currentWord = filteredWords[randomIndex];
    displayWord(false); // Start with spelling hidden
}

function displayWord(revealed) {
    const spellingEl = document.getElementById('wordSpelling');
    const revealBtn = document.getElementById('revealBtn');

    if (revealed) {
        spellingEl.textContent = currentWord.word;
        spellingEl.style.display = 'block';
        revealBtn.style.display = 'none';
    } else {
        spellingEl.style.display = 'none';
        revealBtn.style.display = 'inline-block';
    }

    document.getElementById('wordDefinition').textContent = currentWord.definition;
    document.getElementById('wordSentence').textContent = currentWord.sentence || 'No example sentence available.';

    // Etymology
    document.getElementById('wordOrigin').textContent = currentWord.languageOrigin || 'Unknown';
    const rootsDiv = document.getElementById('wordRoots');
    rootsDiv.innerHTML = '';
    if (currentWord.roots && currentWord.roots.length > 0) {
        currentWord.roots.forEach(root => {
            const rootItem = document.createElement('div');
            rootItem.className = 'root-item';
            rootItem.innerHTML = `<strong>${root.root}</strong>: ${root.meaning}`;
            rootsDiv.appendChild(rootItem);
        });
    } else {
        rootsDiv.innerHTML = '<p>No root information available.</p>';
    }

    // Reset etymology toggle
    document.getElementById('etymologyContent').style.display = 'none';
    document.getElementById('etymologyToggleText').textContent = '▶ Show Etymology & Roots';
}

function revealWord() {
    displayWord(true);
}

function toggleEtymology() {
    const content = document.getElementById('etymologyContent');
    const toggleText = document.getElementById('etymologyToggleText');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggleText.textContent = '▼ Hide Etymology & Roots';
    } else {
        content.style.display = 'none';
        toggleText.textContent = '▶ Show Etymology & Roots';
    }
}

function speakWord() {
    if ('speechSynthesis' in window && currentWord) {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-speech not supported in your browser.');
    }
}

function nextWord() {
    if (currentMode === 'practice') {
        loadRandomWord();
    } else if (currentMode === 'quiz') {
        nextQuizQuestion();
    } else if (currentMode === 'review') {
        loadRandomWord();
    }
}

function markDifficult() {
    if (!currentWord) return;

    if (!progressData.difficult.includes(currentWord.word)) {
        progressData.difficult.push(currentWord.word);
        saveProgressData();
        alert(`"${currentWord.word}" marked as difficult!`);
        updateProgressStats();
    } else {
        // Remove from difficult
        progressData.difficult = progressData.difficult.filter(w => w !== currentWord.word);
        saveProgressData();
        alert(`"${currentWord.word}" removed from difficult words!`);
        updateProgressStats();
    }
}

// Quiz Mode
function startQuizMode() {
    if (filteredWords.length < 10) {
        alert('Need at least 10 words for quiz mode! Adjust your filters.');
        exitMode();
        return;
    }

    // Select 10 random words
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    quizWords = shuffled.slice(0, 10);
    quizScore = 0;
    quizQuestion = 0;

    document.getElementById('modeTitle').textContent = 'Quiz Mode';
    document.getElementById('wordCard').style.display = 'block';
    document.getElementById('answerSection').style.display = 'block';
    document.getElementById('quizScore').style.display = 'block';

    loadQuizQuestion();
}

function loadQuizQuestion() {
    if (quizQuestion >= 10) {
        showQuizResults();
        return;
    }

    currentWord = quizWords[quizQuestion];

    // Hide spelling, show definition
    document.getElementById('wordSpelling').style.display = 'none';
    document.getElementById('revealBtn').style.display = 'none';
    document.getElementById('wordDefinition').textContent = currentWord.definition;
    document.getElementById('wordSentence').textContent = currentWord.sentence || 'No example sentence available.';

    // Update quiz stats
    document.getElementById('questionNumber').textContent = quizQuestion + 1;
    document.getElementById('currentScore').textContent = quizScore;

    // Clear answer input
    document.getElementById('answerInput').value = '';
    document.getElementById('feedbackMessage').textContent = '';
    document.getElementById('answerInput').focus();
}

function checkAnswer() {
    const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
    const correctAnswer = currentWord.word.toLowerCase();

    const feedback = document.getElementById('feedbackMessage');

    if (userAnswer === correctAnswer) {
        feedback.textContent = `✓ Correct! The word is "${currentWord.word}"`;
        feedback.className = 'correct';
        quizScore++;

        // Update progress
        recordAttempt(currentWord.word, true);

        setTimeout(() => {
            quizQuestion++;
            loadQuizQuestion();
        }, 2000);
    } else {
        feedback.textContent = `✗ Incorrect. The correct spelling is "${currentWord.word}"`;
        feedback.className = 'incorrect';

        // Update progress
        recordAttempt(currentWord.word, false);

        setTimeout(() => {
            quizQuestion++;
            loadQuizQuestion();
        }, 3000);
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
}

function nextQuizQuestion() {
    quizQuestion++;
    loadQuizQuestion();
}

function showQuizResults() {
    const percentage = (quizScore / 10) * 100;
    let message = '';

    if (percentage === 100) message = '🎉 Perfect score! Excellent work!';
    else if (percentage >= 80) message = '👏 Great job! You\'re doing well!';
    else if (percentage >= 60) message = '👍 Good effort! Keep practicing!';
    else message = '📚 Keep studying! You\'ll improve with practice.';

    alert(`Quiz Complete!\n\nYour score: ${quizScore}/10 (${percentage}%)\n\n${message}`);
    exitMode();
}

// Study Mode
function showGroupSizeSelection() {
    document.getElementById('modeSelection').style.display = 'block';
    document.getElementById('groupSizeSelection').style.display = 'block';
}

function setGroupSize(size) {
    studyGroupSize = size;
    document.getElementById('groupSizeSelection').style.display = 'none';
    startStudyMode();
}

function startStudyMode() {
    if (filteredWords.length < studyGroupSize) {
        alert(`Need at least ${studyGroupSize} words for this group size! Adjust your filters or choose a smaller group.`);
        exitMode();
        return;
    }

    // Select random words for study group
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    studyGroup = shuffled.slice(0, studyGroupSize);

    flashcardIndex = 0;
    testIndex = 0;
    testScore = 0;
    missedWords = [];
    studyPhase = 'learn';

    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('studyCard').style.display = 'block';

    startLearnPhase();
}

function startLearnPhase() {
    document.getElementById('learnPhase').style.display = 'block';
    document.getElementById('testPhase').style.display = 'none';
    document.getElementById('resultsPhase').style.display = 'none';

    document.getElementById('totalFlashcards').textContent = studyGroup.length;
    showFlashcard();
}

function showFlashcard() {
    currentWord = studyGroup[flashcardIndex];
    isFlipped = false;

    document.getElementById('flashcardNumber').textContent = flashcardIndex + 1;
    document.getElementById('flashcardWord').textContent = currentWord.word;
    document.getElementById('flashcardDefinition').textContent = currentWord.definition;
    document.getElementById('flashcardSentence').textContent = currentWord.sentence || 'No example sentence available.';

    // Show front, hide back
    document.getElementById('flashcardFront').style.display = 'block';
    document.getElementById('flashcardBack').style.display = 'none';

    // Update navigation buttons
    document.getElementById('prevCardBtn').disabled = flashcardIndex === 0;

    if (flashcardIndex === studyGroup.length - 1) {
        document.getElementById('nextCardBtn').style.display = 'none';
        document.getElementById('startTestBtn').style.display = 'inline-block';
    } else {
        document.getElementById('nextCardBtn').style.display = 'inline-block';
        document.getElementById('startTestBtn').style.display = 'none';
    }
}

function flipCard() {
    isFlipped = !isFlipped;

    if (isFlipped) {
        document.getElementById('flashcardFront').style.display = 'none';
        document.getElementById('flashcardBack').style.display = 'block';
    } else {
        document.getElementById('flashcardFront').style.display = 'block';
        document.getElementById('flashcardBack').style.display = 'none';
    }
}

function speakCurrentWord(event) {
    if (event) event.stopPropagation(); // Prevent card flip

    if ('speechSynthesis' in window && currentWord) {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }
}

function previousCard() {
    if (flashcardIndex > 0) {
        flashcardIndex--;
        showFlashcard();
    }
}

function nextCard() {
    if (flashcardIndex < studyGroup.length - 1) {
        flashcardIndex++;
        showFlashcard();
    }
}

function startTestPhase() {
    studyPhase = 'test';
    document.getElementById('learnPhase').style.display = 'none';
    document.getElementById('testPhase').style.display = 'block';

    document.getElementById('totalTestWords').textContent = studyGroup.length;
    document.getElementById('testTotal').textContent = studyGroup.length;

    showTestWord();
}

function showTestWord() {
    if (testIndex >= studyGroup.length) {
        showStudyResults();
        return;
    }

    currentWord = studyGroup[testIndex];

    document.getElementById('testNumber').textContent = testIndex + 1;
    document.getElementById('testScore').textContent = testScore;
    document.getElementById('testDefinition').textContent = currentWord.definition;
    document.getElementById('testInput').value = '';
    document.getElementById('testFeedback').textContent = '';
    document.getElementById('nextTestBtn').style.display = 'none';
    document.getElementById('finishTestBtn').style.display = 'none';
    document.getElementById('testInput').focus();
}

function speakTestWord() {
    if ('speechSynthesis' in window && currentWord) {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }
}

function submitTestAnswer() {
    const userAnswer = document.getElementById('testInput').value.trim().toLowerCase();
    const correctAnswer = currentWord.word.toLowerCase();

    const feedback = document.getElementById('testFeedback');

    if (userAnswer === correctAnswer) {
        feedback.textContent = `✓ Correct! "${currentWord.word}"`;
        feedback.className = 'correct';
        testScore++;
        recordAttempt(currentWord.word, true);
    } else {
        feedback.textContent = `✗ Incorrect. The correct spelling is "${currentWord.word}"`;
        feedback.className = 'incorrect';
        recordAttempt(currentWord.word, false);
        missedWords.push(currentWord);
    }

    document.getElementById('testScore').textContent = testScore;

    // Show next button
    if (testIndex < studyGroup.length - 1) {
        document.getElementById('nextTestBtn').style.display = 'inline-block';
    } else {
        document.getElementById('finishTestBtn').style.display = 'inline-block';
    }
}

function checkTestEnter(event) {
    if (event.key === 'Enter') {
        submitTestAnswer();
    }
}

function nextTestWord() {
    testIndex++;
    showTestWord();
}

function finishStudyGroup() {
    showStudyResults();
}

function showStudyResults() {
    document.getElementById('testPhase').style.display = 'none';
    document.getElementById('resultsPhase').style.display = 'block';

    document.getElementById('finalScore').textContent = testScore;
    document.getElementById('finalTotal').textContent = studyGroup.length;

    const percentage = (testScore / studyGroup.length) * 100;
    let message = '';

    if (percentage === 100) message = '🎉 Perfect! You mastered this group!';
    else if (percentage >= 80) message = '👏 Excellent work! Almost there!';
    else if (percentage >= 60) message = '👍 Good progress! Review the missed words.';
    else message = '📚 Keep practicing! Review and try again.';

    document.getElementById('resultsMessage').textContent = message;
}

function reviewMissed() {
    if (missedWords.length === 0) {
        alert('You didn\'t miss any words!');
        return;
    }

    // Restart with only missed words
    studyGroup = [...missedWords];
    flashcardIndex = 0;
    testIndex = 0;
    testScore = 0;
    missedWords = [];

    startLearnPhase();
}

function startNextGroup() {
    startStudyMode();
}

// Review Mode
function startReviewMode() {
    if (progressData.difficult.length === 0) {
        alert('No difficult words marked yet! Mark words as difficult while practicing to review them here.');
        exitMode();
        return;
    }

    // Filter to only show difficult words
    filteredWords = allWords.filter(word => progressData.difficult.includes(word.word));

    document.getElementById('modeTitle').textContent = 'Review Difficult Words';
    document.getElementById('wordCard').style.display = 'block';
    document.getElementById('answerSection').style.display = 'none';
    document.getElementById('quizScore').style.display = 'none';

    loadRandomWord();
}

// Roots Mode
function startRootsMode() {
    document.getElementById('rootsBrowser').style.display = 'block';

    // Populate language buttons
    const languageButtons = document.getElementById('languageButtons');
    languageButtons.innerHTML = '';

    Object.keys(rootsLibrary).forEach(language => {
        const btn = document.createElement('button');
        btn.className = 'language-btn';
        btn.textContent = language;
        btn.onclick = () => showRootsForLanguage(language, btn);
        languageButtons.appendChild(btn);
    });
}

function showRootsForLanguage(language, btnElement) {
    // Highlight active button
    document.querySelectorAll('.language-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    // Display roots
    const rootsList = document.getElementById('rootsList');
    rootsList.innerHTML = '';

    const roots = rootsLibrary[language];
    if (!roots || roots.length === 0) {
        rootsList.innerHTML = '<p class="hint">No roots available for this language family.</p>';
        return;
    }

    roots.forEach(root => {
        const rootCard = document.createElement('div');
        rootCard.className = 'root-card';

        rootCard.innerHTML = `
            <h4>${root.root}</h4>
            <p class="meaning">${root.meaning}</p>
            <div class="examples">
                <strong>Example Words:</strong>
                <p class="example-words">${root.exampleWords.join(', ')}</p>
            </div>
            ${root.notes ? `<p class="notes">${root.notes}</p>` : ''}
        `;

        rootsList.appendChild(rootCard);
    });
}

// Progress Tracking
function loadProgressData() {
    const saved = localStorage.getItem('wordsOfChampionsProgress');
    if (saved) {
        progressData = JSON.parse(saved);
    }
}

function saveProgressData() {
    localStorage.setItem('wordsOfChampionsProgress', JSON.stringify(progressData));
}

function recordAttempt(word, correct) {
    if (!progressData.studied[word]) {
        progressData.studied[word] = {
            attempts: 0,
            correct: 0,
            lastStudied: Date.now()
        };
    }

    progressData.studied[word].attempts++;
    if (correct) {
        progressData.studied[word].correct++;
    }
    progressData.studied[word].lastStudied = Date.now();

    // Check if mastered (3+ correct attempts)
    if (progressData.studied[word].correct >= 3 && !progressData.mastered.includes(word)) {
        progressData.mastered.push(word);
    }

    saveProgressData();
}

function updateProgressStats() {
    document.getElementById('totalStudied').textContent = Object.keys(progressData.studied).length;
    document.getElementById('totalMastered').textContent = progressData.mastered.length;
    document.getElementById('totalDifficult').textContent = progressData.difficult.length;
}

// Settings
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function exportProgress() {
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'words-of-champions-progress.json';
    link.click();

    URL.revokeObjectURL(url);
    alert('Progress exported successfully!');
}

function importProgress() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                progressData = imported;
                saveProgressData();
                updateProgressStats();
                alert('Progress imported successfully!');
            } catch (error) {
                alert('Error importing progress file. Please check the file format.');
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        progressData = {
            studied: {},
            mastered: [],
            difficult: []
        };
        saveProgressData();
        updateProgressStats();
        alert('All progress has been reset.');
    }
}
