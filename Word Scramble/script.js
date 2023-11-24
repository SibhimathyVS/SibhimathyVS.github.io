var wordsArray = [
    { word: 'ARTICLE', hint: 'A written composition in a newspaper or magazine' },
    { word: 'BEACH', hint: 'Sandy shores along the ocean' },
    { word: 'CAFE', hint: 'A place to get coffee and light meals' },
    { word: 'DREAM', hint: 'A series of thoughts, images, and sensations occurring in a person\'s mind during sleep' },
    { word: 'EARTH', hint: 'The third planet from the sun and the only known planet to support life' },
    { word: 'FRUIT', hint: 'The edible part of a plant that contains seeds' },
    { word: 'GREAT', hint: 'Of an extent, amount, or intensity considerably above average' },
    { word: 'HAT', hint: 'A covering for the head, typically with a shaped crown and a brim' },
    { word: 'IDEAL', hint: 'A standard of perfection or excellence' },
    { word: 'JUMP', hint: 'To push oneself off a surface and into the air using the legs and feet' },
    { word: 'KITE', hint: 'A toy consisting of a light frame with thin material stretched over it' },
    { word: 'LIFE', hint: 'The condition that distinguishes organisms from inorganic objects' },
    { word: 'MUSIC', hint: 'An art form and cultural activity whose medium is sound' },
    { word: 'NATURE', hint: 'The phenomena of the physical world collectively' },
    { word: 'ORACLE', hint: 'A person or agency considered to provide wise and insightful counsel or prophetic predictions' },
    { word: 'PASTRY', hint: 'A dough of flour, fat, and water used as a base for various sweet and savory dishes' },
    { word: 'QUEST', hint: 'A long or arduous search for something' },
    { word: 'REALITY', hint: 'The state of things as they actually exist' },
    { word: 'SCARY', hint: 'Causing fear or alarm' },
    { word: 'THIEF', hint: 'A person who steals another persons property' },
    { word: 'UNITE', hint: 'To come or bring together for a common purpose or action' },
    { word: 'VENUS', hint: 'The second planet from the sun, named after the Roman goddess of love and beauty' },
    { word: 'WINGS', hint: 'The structures on the body of a bird, insect, or bat that enable flight' },
    { word: 'XMAS', hint: 'An abbreviation for a holiday celebrated on December 25th' },
    { word: 'YOGHURT', hint: 'A dairy product created by bacterial fermentation of milk' },
    { word: 'ZEBRA', hint: 'A large wild animal with black and white stripes native to Africa' }
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
