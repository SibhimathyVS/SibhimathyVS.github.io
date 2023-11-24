var wordsArray = [
    { word: 'ARTICLE', hint: 'Newspaper or magazine writing' },
    { word: 'BEACH', hint: 'Sandy ocean shores' },
    { word: 'CAFE', hint: 'Coffee and light meals spot' },
    { word: 'DREAM', hint: 'Sleeping minds thoughts' },
    { word: 'EARTH', hint: 'Third planet, supports life' },
    { word: 'FRUIT', hint: 'Edible plant part with seeds' },
    { word: 'GREAT', hint: 'Significantly above average' },
    { word: 'HAT', hint: 'Head cover with a brim' },
    { word: 'IDEAL', hint: 'Perfection standard' },
    { word: 'JUMP', hint: 'Leap into the air' },
    { word: 'KITE', hint: 'Light frame toy' },
    { word: 'LIFE', hint: 'Organisms defining condition' },
    { word: 'MUSIC', hint: 'Sound-based art form' },
    { word: 'NATURE', hint: 'Collective physical world phenomena' },
    { word: 'ORACLE', hint: 'Provider of wise counsel' },
    { word: 'PASTRY', hint: 'Dough for sweet or savory dishes' },
    { word: 'QUEST', hint: 'Long search' },
    { word: 'REALITY', hint: 'Actual state of things' },
    { word: 'SCARY', hint: 'Causes fear' },
    { word: 'THIEF', hint: 'Steals property' },
    { word: 'UNITE', hint: 'Bringing together for a purpose' },
    { word: 'VENUS', hint: 'Second planet, goddess' },
    { word: 'WINGS', hint: 'Flight structures' },
    { word: 'XMAS', hint: 'December 25th holiday' },
    { word: 'YOGHURT', hint: 'Fermented milk product' },
    { word: 'ZEBRA', hint: 'Striped African animal' }
];


var randomIndex = 0;
var correctWord = "";
var scrambledWord = "";
var draggedLetters = 0;
var score = 0;
var players = [];
var maxWordsPerPlayer = 5;
var currentWordIndex = 0;
var nextButtonAdded = false;

function checkWord(word) {
    var foundWord = wordsArray.find(item => item.word === word.toUpperCase());
    if (foundWord) {
        document.getElementById('message').innerText = 'Correct word!';
        if (!players.length || players[players.length - 1].wordsFound >= maxWordsPerPlayer) {
            players.push({ wordsFound: 1 });
        } else {
            players[players.length - 1].wordsFound++;
        }
        players[players.length - 1].score = players[players.length - 1].wordsFound;
        document.getElementById('score').innerText = `Score: ${players[players.length - 1].score}`;

        if (players[players.length - 1].wordsFound < maxWordsPerPlayer && !nextButtonAdded) {
            var nextButton = document.createElement('button');
            nextButton.innerText = 'Next';
            nextButton.onclick = nextWord;
            document.querySelector('.gamearea').appendChild(nextButton);
            nextButtonAdded = true;
        } else if (players[players.length - 1].wordsFound === maxWordsPerPlayer) {
            document.getElementById('restartButton').style.display = 'inline-block';
            document.getElementById('startButton').style.display = 'none';
            document.getElementById('message').innerText = 'You have won!';
            showFinalScores();
        }
        wordsArray = wordsArray.filter(item => item.word !== foundWord.word);
    } else {
        document.getElementById('message').innerText = 'Not a match, Try Again!';
        resetWord();
    }
}


function nextWord() {
    currentWordIndex++;
    resetWord();
    startGame();
    document.querySelector('.gamearea').removeChild(document.querySelector('.gamearea').lastChild);
    nextButtonAdded = false;
}

function resetWord() {
    var dropZone = document.getElementById('dropZone');
    var filledBoxes = document.querySelectorAll('.droppable-box.filled');
    filledBoxes.forEach(function (box) {
        box.innerText = '';
        box.classList.remove('filled');
    });
}

function restartGame() {
    location.reload();
}

function startGame() {
    randomIndex = Math.floor(Math.random() * wordsArray.length);
    correctWord = wordsArray[randomIndex].word;
    scrambledWord = scrambleWord(correctWord);
    draggedLetters = 0;
    var currentHint = wordsArray[randomIndex].hint;

    document.getElementById('hint').innerText = `Hint: ${currentHint}`;
    document.getElementById('wordBank').style.display = 'inline-block';
    document.getElementById('dropZone').style.display = 'inline-block';
    document.getElementById('message').innerText = '';
    document.getElementById('score').innerText = 'Score: ' + score;
    document.getElementById('startButton').style.display = 'none';
    initializeWordBank(scrambledWord);
    initializeDropZone(correctWord);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.innerText);
    //ev.target.style.color = 'pink';
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var droppedLetter = data.trim();

    if (ev.target.classList.contains('droppable-box') && !ev.target.classList.contains('filled')) {
        ev.target.innerText = droppedLetter;
        ev.target.classList.add('filled');

        // Change color in the word bank for the dropped letter
        var wordBankLetters = document.querySelectorAll('.draggable');
        wordBankLetters.forEach(function (letter) {
            if (letter.innerText === droppedLetter) {
                letter.style.color = 'pink'; // Change to your desired color
            }
        });
    }

    var filledBoxes = document.querySelectorAll('.droppable-box.filled');
    if (filledBoxes.length === ev.currentTarget.children.length) {
        var currentWord = '';
        filledBoxes.forEach(function (box) {
            currentWord += box.innerText;
        });
        checkWord(currentWord);
    }
}

function scrambleWord(word) {
    return word.split('').sort(function () {
        return 0.5 - Math.random();
    }).join('');
}

function initializeWordBank(word) {
    var wordBank = document.getElementById('wordBank');
    wordBank.innerHTML = '';
    for (var i = 0; i < word.length; i++) {
        var newLetter = document.createElement('div');
        newLetter.innerHTML = word[i];
        newLetter.className = 'draggable';
        newLetter.draggable = true;
        newLetter.ondragstart = drag;
        wordBank.appendChild(newLetter);
    }
}

function initializeDropZone(word) {
    var dropZone = document.getElementById('dropZone');
    dropZone.innerHTML = '';
    for (var i = 0; i < word.length; i++) {
        var newBox = document.createElement('div');
        newBox.className = 'droppable-box';
        newBox.dataset.expectedLetter = word[i];
        newBox.addEventListener('dragover', allowDrop);
        newBox.addEventListener('drop', drop);
        dropZone.appendChild(newBox);
    }
}

function showFinalScores() {
    var scoreboard = document.getElementById('scoreboard');
    scoreboard.style.display = 'block';
    var scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = '';
    for (var i = 0; i < players.length; i++) {
        var listItem = document.createElement('li');
        listItem.innerText = 'Player ' + (i + 1) + ': ' + players[i].score;
        scoreList.appendChild(listItem);
    }
}
