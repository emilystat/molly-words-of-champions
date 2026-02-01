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
    difficult: [],    // [word1, word2, ...]
    rootsStudied: {}, // {root: {attempts: 0, correct: 0, lastStudied: timestamp}}
    difficultRoots: [] // [root1, root2, ...] - roots marked as difficult
};

// Roots organization
let greekRoots = [];
let latinRoots = [];
let allRoots = [];
let currentRootsStudyGroup = [];
let rootsStudyIndex = 0;
let rootsTestScore = 0;
let rootsMissedRoots = [];
let rootsStudyPhase = 'browse'; // 'browse', 'learn', 'test', 'results'
let currentRootsTab = null; // Track which tab is currently showing

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadProgressData();
    combineAllWords();
    organizeRoots();
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

// Organize roots by language family
function organizeRoots() {
    if (typeof rootsData === 'undefined') {
        console.warn('rootsData not loaded');
        return;
    }

    greekRoots = rootsData.filter(r => r.languageFamily === 'Greek').sort((a, b) => a.root.localeCompare(b.root));
    latinRoots = rootsData.filter(r => r.languageFamily === 'Latin').sort((a, b) => a.root.localeCompare(b.root));
    allRoots = [...greekRoots, ...latinRoots];
}

// Filter Management
function updateFilters() {
    const wordListFilter = document.getElementById('wordListFilter').value;

    filteredWords = allWords.filter(word => {
        return wordListFilter === 'all' || word.wordList === wordListFilter;
    });

    // Update filter info
    const filterInfo = document.getElementById('filterInfo');
    const wordListName = wordListFilter === 'all' ? 'All Words' : getWordListName(wordListFilter);

    filterInfo.textContent = `Showing ${filteredWords.length} words from ${wordListName}`;
}

function getWordListName(list) {
    const names = {
        '1000': 'One Bee',
        '2000': 'Two Bee',
        '3000': 'Three Bee'
    };
    return names[list] || list;
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
    document.getElementById('quizOptionsSelection').style.display = 'none';

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

    document.getElementById('wordDefinition').innerHTML = currentWord.definition;
    document.getElementById('wordSentence').innerHTML = currentWord.sentence || 'No example sentence available.';

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

// Helper function to mark word as difficult without alert (for auto-marking)
function addToDifficultWords(word) {
    if (!progressData.difficult.includes(word)) {
        progressData.difficult.push(word);
        saveProgressData();
        updateProgressStats();
    }
}

// Mark current flashcard as difficult (for study mode)
function markCurrentFlashcardDifficult() {
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
    // Show quiz options selection
    document.getElementById('modeSelection').style.display = 'block';
    document.getElementById('quizOptionsSelection').style.display = 'block';
}

function cancelQuizOptions() {
    document.getElementById('quizOptionsSelection').style.display = 'none';
    exitMode();
}

function startQuizWithOptions() {
    const wordListOption = document.getElementById('quizWordListFilter').value;
    const orderOption = document.getElementById('quizOrderFilter').value;

    // Filter words based on selected options
    let quizPool = [];

    if (wordListOption === 'difficult') {
        // Use only difficult words
        if (progressData.difficult.length < 10) {
            alert('You need at least 10 difficult words marked! Current: ' + progressData.difficult.length);
            return;
        }
        quizPool = allWords.filter(word => progressData.difficult.includes(word.word));
    } else if (wordListOption === 'all') {
        quizPool = [...allWords];
    } else {
        // Filter by word list (1000, 2000, or 3000)
        quizPool = allWords.filter(word => word.wordList === wordListOption);
    }

    if (quizPool.length < 10) {
        alert(`Need at least 10 words for quiz mode! Selected pool has ${quizPool.length} words.`);
        return;
    }

    // Order words based on selected option
    if (orderOption === 'alphabetical') {
        quizPool.sort((a, b) => a.word.localeCompare(b.word));
        quizWords = quizPool.slice(0, 10);
    } else {
        // Random order
        const shuffled = [...quizPool].sort(() => Math.random() - 0.5);
        quizWords = shuffled.slice(0, 10);
    }

    quizScore = 0;
    quizQuestion = 0;

    // Hide options, show quiz
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('quizOptionsSelection').style.display = 'none';
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
    document.getElementById('wordDefinition').innerHTML = currentWord.definition;
    document.getElementById('wordSentence').innerHTML = currentWord.sentence || 'No example sentence available.';

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

        // Auto-mark incorrect words as difficult
        addToDifficultWords(currentWord.word);

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

    // Select words alphabetically for study group
    const alphabetical = [...filteredWords].sort((a, b) => a.word.localeCompare(b.word));
    studyGroup = alphabetical.slice(0, studyGroupSize);

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
    document.getElementById('flashcardDefinition').innerHTML = currentWord.definition;
    document.getElementById('flashcardSentence').innerHTML = currentWord.sentence || 'No example sentence available.';

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
    document.getElementById('testDefinition').innerHTML = currentWord.definition;
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

        // Auto-mark incorrect words as difficult
        addToDifficultWords(currentWord.word);
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

// Roots Mode - Browse and Study
function startRootsMode() {
    document.getElementById('rootsBrowser').style.display = 'block';
    document.getElementById('rootsBrowseMode').style.display = 'block';
    document.getElementById('rootsStudyOptions').style.display = 'none';
    document.getElementById('rootsLearnPhase').style.display = 'none';
    document.getElementById('rootsTestPhase').style.display = 'none';
    document.getElementById('rootsResultsPhase').style.display = 'none';

    // Update difficult roots count
    document.getElementById('difficultRootsCount').textContent = progressData.difficultRoots.length;

    rootsStudyPhase = 'browse';
}

function showRootsTab(language) {
    currentRootsTab = language; // Track current tab
    const rootsList = document.getElementById('rootsList');
    rootsList.innerHTML = '';

    let rootsToShow = [];
    let title = '';

    if (language === 'greek') {
        rootsToShow = greekRoots;
        title = `<h3>Greek Roots (${greekRoots.length})</h3>`;
    } else if (language === 'latin') {
        rootsToShow = latinRoots;
        title = `<h3>Latin Roots (${latinRoots.length})</h3>`;
    } else if (language === 'difficult') {
        rootsToShow = allRoots.filter(root => progressData.difficultRoots.includes(root.root));
        title = `<h3>My Difficult Roots (${rootsToShow.length})</h3>`;
        if (rootsToShow.length === 0) {
            rootsList.innerHTML = '<p class="hint">No difficult roots marked yet! Mark roots as difficult while browsing or studying.</p>';
            return;
        }
    }

    rootsList.innerHTML = title;

    rootsToShow.forEach(root => {
        const rootCard = document.createElement('div');
        rootCard.className = 'root-card';

        const isDifficult = progressData.difficultRoots.includes(root.root);
        const buttonText = isDifficult ? '⭐ Remove from Difficult' : '⭐ Mark as Difficult';

        rootCard.innerHTML = `
            <h4>${root.root}</h4>
            <p class="root-language">${root.languageFamily}</p>
            <p class="meaning"><strong>Meaning:</strong> ${root.meaning}</p>
            <div class="examples">
                <strong>Example Words:</strong>
                <p class="example-words">${root.examples}</p>
            </div>
            <button class="action-btn" onclick="markRootDifficultFromBrowse('${root.root}')" style="margin-top: 10px;">${buttonText}</button>
        `;

        rootsList.appendChild(rootCard);
    });
}

// Roots Study Mode
function startRootsStudyOptions() {
    document.getElementById('rootsBrowseMode').style.display = 'none';
    document.getElementById('rootsStudyOptions').style.display = 'block';
}

function cancelRootsStudy() {
    document.getElementById('rootsStudyOptions').style.display = 'none';
    document.getElementById('rootsBrowseMode').style.display = 'block';
    startRootsMode();
}

function startRootsStudyWithOptions() {
    const languageOption = document.getElementById('rootsLanguageFilter').value;
    const groupSize = parseInt(document.getElementById('rootsGroupSize').value);

    // Select roots pool
    let rootsPool = [];
    if (languageOption === 'difficult') {
        // Use only difficult roots
        if (progressData.difficultRoots.length < groupSize) {
            alert(`You need at least ${groupSize} difficult roots marked! Current: ${progressData.difficultRoots.length}`);
            return;
        }
        // Get the full root objects for difficult roots
        rootsPool = allRoots.filter(root => progressData.difficultRoots.includes(root.root));
    } else if (languageOption === 'greek') {
        rootsPool = [...greekRoots];
    } else if (languageOption === 'latin') {
        rootsPool = [...latinRoots];
    } else {
        rootsPool = [...allRoots];
    }

    if (rootsPool.length < groupSize) {
        alert(`Need at least ${groupSize} roots! Selected pool has ${rootsPool.length} roots.`);
        return;
    }

    // Always alphabetical - take first N roots
    currentRootsStudyGroup = rootsPool.slice(0, groupSize);
    rootsStudyIndex = 0;
    rootsTestScore = 0;
    rootsMissedRoots = [];
    rootsStudyPhase = 'learn';

    // Hide options, show learn phase
    document.getElementById('rootsStudyOptions').style.display = 'none';
    document.getElementById('rootsLearnPhase').style.display = 'block';

    document.getElementById('rootsTotalFlashcards').textContent = currentRootsStudyGroup.length;
    showRootFlashcard();
}

let isRootFlipped = false;

function showRootFlashcard() {
    const currentRoot = currentRootsStudyGroup[rootsStudyIndex];
    isRootFlipped = false;

    document.getElementById('rootsFlashcardNumber').textContent = rootsStudyIndex + 1;
    document.getElementById('rootsFlashcardRoot').textContent = currentRoot.root;
    document.getElementById('rootsFlashcardLanguage').textContent = currentRoot.languageFamily;
    document.getElementById('rootsFlashcardMeaning').textContent = currentRoot.meaning;
    document.getElementById('rootsFlashcardExamples').textContent = currentRoot.examples;

    // Show front, hide back
    document.getElementById('rootsFlashcardFront').style.display = 'block';
    document.getElementById('rootsFlashcardBack').style.display = 'none';

    // Update navigation buttons
    document.getElementById('prevRootCardBtn').disabled = rootsStudyIndex === 0;

    if (rootsStudyIndex === currentRootsStudyGroup.length - 1) {
        document.getElementById('nextRootCardBtn').style.display = 'none';
        document.getElementById('startRootsTestBtn').style.display = 'inline-block';
    } else {
        document.getElementById('nextRootCardBtn').style.display = 'inline-block';
        document.getElementById('startRootsTestBtn').style.display = 'none';
    }
}

function flipRootCard() {
    isRootFlipped = !isRootFlipped;

    if (isRootFlipped) {
        document.getElementById('rootsFlashcardFront').style.display = 'none';
        document.getElementById('rootsFlashcardBack').style.display = 'block';
    } else {
        document.getElementById('rootsFlashcardFront').style.display = 'block';
        document.getElementById('rootsFlashcardBack').style.display = 'none';
    }
}

function markCurrentRootDifficult() {
    const currentRoot = currentRootsStudyGroup[rootsStudyIndex];

    if (!progressData.difficultRoots.includes(currentRoot.root)) {
        progressData.difficultRoots.push(currentRoot.root);
        saveProgressData();
        alert(`Root "${currentRoot.root}" marked as difficult!`);
        updateProgressStats();
    } else {
        // Remove from difficult
        progressData.difficultRoots = progressData.difficultRoots.filter(r => r !== currentRoot.root);
        saveProgressData();
        alert(`Root "${currentRoot.root}" removed from difficult roots!`);
        updateProgressStats();
    }
}

// Helper function to mark root as difficult without alert (for auto-marking)
function addToDifficultRoots(root) {
    if (!progressData.difficultRoots.includes(root)) {
        progressData.difficultRoots.push(root);
        saveProgressData();
        updateProgressStats();
    }
}

// Mark a root as difficult from browse mode
function markRootDifficultFromBrowse(root) {
    if (!progressData.difficultRoots.includes(root)) {
        progressData.difficultRoots.push(root);
        saveProgressData();
        alert(`Root "${root}" marked as difficult!`);
        updateProgressStats();
    } else {
        progressData.difficultRoots = progressData.difficultRoots.filter(r => r !== root);
        saveProgressData();
        alert(`Root "${root}" removed from difficult roots!`);
        updateProgressStats();
    }

    // Update the difficult roots count
    document.getElementById('difficultRootsCount').textContent = progressData.difficultRoots.length;

    // Refresh the current view if we're browsing
    if (currentRootsTab) {
        showRootsTab(currentRootsTab);
    }
}

function previousRootCard() {
    if (rootsStudyIndex > 0) {
        rootsStudyIndex--;
        showRootFlashcard();
    }
}

function nextRootCard() {
    if (rootsStudyIndex < currentRootsStudyGroup.length - 1) {
        rootsStudyIndex++;
        showRootFlashcard();
    }
}

// Roots Test Phase
function startRootsTestPhase() {
    rootsStudyPhase = 'test';
    rootsStudyIndex = 0;
    rootsTestScore = 0;

    document.getElementById('rootsLearnPhase').style.display = 'none';
    document.getElementById('rootsTestPhase').style.display = 'block';

    document.getElementById('rootsTotalTestRoots').textContent = currentRootsStudyGroup.length;
    document.getElementById('rootsTestTotal').textContent = currentRootsStudyGroup.length;

    showRootsTestRoot();
}

function showRootsTestRoot() {
    if (rootsStudyIndex >= currentRootsStudyGroup.length) {
        showRootsResults();
        return;
    }

    const currentRoot = currentRootsStudyGroup[rootsStudyIndex];

    document.getElementById('rootsTestNumber').textContent = rootsStudyIndex + 1;
    document.getElementById('rootsTestScore').textContent = rootsTestScore;
    document.getElementById('rootsTestRoot').textContent = currentRoot.root;
    document.getElementById('rootsTestLanguage').textContent = currentRoot.languageFamily;
    document.getElementById('rootsTestFeedback').textContent = '';
    document.getElementById('rootsTestCorrectAnswer').style.display = 'none';
    document.getElementById('nextRootsTestBtn').style.display = 'none';
    document.getElementById('finishRootsTestBtn').style.display = 'none';

    // Generate multiple choice options
    generateMultipleChoiceOptions(currentRoot);
}

function generateMultipleChoiceOptions(correctRoot) {
    const multipleChoiceDiv = document.getElementById('rootsMultipleChoice');
    multipleChoiceDiv.innerHTML = '';

    // Get 3 wrong answers from other roots
    const otherRoots = allRoots.filter(r => r.root !== correctRoot.root);
    const shuffledOthers = [...otherRoots].sort(() => Math.random() - 0.5);
    const wrongAnswers = shuffledOthers.slice(0, 3).map(r => r.meaning);

    // Combine correct and wrong answers
    const allOptions = [correctRoot.meaning, ...wrongAnswers];

    // Shuffle the options
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    // Create buttons for each option
    shuffledOptions.forEach(meaning => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = meaning;
        btn.onclick = () => submitRootsTestAnswer(meaning);
        multipleChoiceDiv.appendChild(btn);
    });
}

function submitRootsTestAnswer(selectedMeaning) {
    const currentRoot = currentRootsStudyGroup[rootsStudyIndex];
    const correctMeaning = currentRoot.meaning;

    const feedback = document.getElementById('rootsTestFeedback');
    const correctAnswerDiv = document.getElementById('rootsTestCorrectAnswer');

    // Disable all choice buttons
    const allButtons = document.querySelectorAll('.choice-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;

        // Highlight correct answer in green
        if (btn.textContent === correctMeaning) {
            btn.classList.add('correct');
        }

        // Highlight selected wrong answer in red
        if (btn.textContent === selectedMeaning && selectedMeaning !== correctMeaning) {
            btn.classList.add('incorrect');
        }
    });

    const isCorrect = selectedMeaning === correctMeaning;

    if (isCorrect) {
        feedback.textContent = `✓ Correct!`;
        feedback.className = 'correct';
        rootsTestScore++;
        recordRootAttempt(currentRoot.root, true);
    } else {
        feedback.textContent = `✗ Incorrect`;
        feedback.className = 'incorrect';
        recordRootAttempt(currentRoot.root, false);
        rootsMissedRoots.push(currentRoot);

        // Auto-mark incorrect roots as difficult
        addToDifficultRoots(currentRoot.root);

        // Show correct answer with examples
        correctAnswerDiv.style.display = 'block';
        document.getElementById('rootsCorrectMeaning').textContent = currentRoot.meaning;
        document.getElementById('rootsCorrectExamples').textContent = currentRoot.examples;
    }

    document.getElementById('rootsTestScore').textContent = rootsTestScore;

    // Show next button
    if (rootsStudyIndex < currentRootsStudyGroup.length - 1) {
        document.getElementById('nextRootsTestBtn').style.display = 'inline-block';
    } else {
        document.getElementById('finishRootsTestBtn').style.display = 'inline-block';
    }
}

function nextRootsTestRoot() {
    rootsStudyIndex++;
    showRootsTestRoot();
}

function finishRootsStudy() {
    showRootsResults();
}

function showRootsResults() {
    document.getElementById('rootsTestPhase').style.display = 'none';
    document.getElementById('rootsResultsPhase').style.display = 'block';

    document.getElementById('rootsFinalScore').textContent = rootsTestScore;
    document.getElementById('rootsFinalTotal').textContent = currentRootsStudyGroup.length;

    const percentage = Math.round((rootsTestScore / currentRootsStudyGroup.length) * 100);
    let message = '';

    if (percentage >= 90) {
        message = 'Excellent work! You have mastered these roots!';
    } else if (percentage >= 70) {
        message = 'Good job! Keep practicing to master all roots.';
    } else {
        message = 'Keep studying! Review the missed roots and try again.';
    }

    document.getElementById('rootsResultsMessage').textContent = message;
}

function reviewMissedRoots() {
    if (rootsMissedRoots.length === 0) {
        alert('No missed roots to review! Great job!');
        return;
    }

    currentRootsStudyGroup = [...rootsMissedRoots];
    rootsStudyIndex = 0;
    rootsTestScore = 0;
    rootsMissedRoots = [];

    document.getElementById('rootsResultsPhase').style.display = 'none';
    document.getElementById('rootsLearnPhase').style.display = 'block';

    document.getElementById('rootsTotalFlashcards').textContent = currentRootsStudyGroup.length;
    showRootFlashcard();
}

// Progress tracking for roots
function recordRootAttempt(root, correct) {
    if (!progressData.rootsStudied[root]) {
        progressData.rootsStudied[root] = {
            attempts: 0,
            correct: 0,
            lastStudied: Date.now()
        };
    }

    progressData.rootsStudied[root].attempts++;
    if (correct) {
        progressData.rootsStudied[root].correct++;
    }
    progressData.rootsStudied[root].lastStudied = Date.now();

    saveProgressData();
}

// Progress Tracking
function loadProgressData() {
    const saved = localStorage.getItem('wordsOfChampionsProgress');
    if (saved) {
        progressData = JSON.parse(saved);

        // Ensure backwards compatibility - initialize new fields if missing
        if (!progressData.rootsStudied) {
            progressData.rootsStudied = {};
        }
        if (!progressData.difficultRoots) {
            progressData.difficultRoots = [];
        }
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
