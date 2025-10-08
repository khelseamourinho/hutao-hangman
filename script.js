        const wordList = [
            { word: "JAVASCRIPT", hint: "Bahasa pemrograman web" },
            { word: "INFORMATIKA", hint: "Bidang studi Anda" },
            { word: "ALGORITMA", hint: "Langkah-langkah penyelesaian masalah" },
            { word: "DEVOPS", hint: "Kombinasi praktik pengembangan dan operasi IT" },
            { word: "DATABASE", hint: "Kumpulan data yang tersimpan secara terstruktur" }
        ];

        const SULIT_IMAGE_MAP = [0, 2, 3, 5, 7];

        let currentWord = "";
        let incorrectGuesses = 0;
        let maxLives = 0;
        let currentDifficulty = '';
        let guessedLetters = [];
        let currentHint = "";

        const hangmanImg = document.getElementById("hangman-img");
        const wordDisplay = document.getElementById("word-display");
        const keyboardDiv = document.getElementById("keyboard");
        const livesCountSpan = document.getElementById("lives-count");
        const gameMessage = document.getElementById("game-message");
        const playAgainBtn = document.getElementById("play-again-btn");
        const gameArea = document.getElementById("game-area");
        const difficultySelection = document.getElementById("difficulty-selection");
        const wordHintDisplay = document.getElementById("word-hint");

        const getRandomWord = () => {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            return wordList[randomIndex];
        };

        const startGame = (difficulty) => {
            currentDifficulty = difficulty;
            maxLives = difficulty === 'sulit' ? 4 : 7;

            difficultySelection.style.display = 'none';
            gameArea.style.display = 'block';
            
            incorrectGuesses = 0;
            guessedLetters = [];
            
            const selectedWordObj = getRandomWord();
            currentWord = selectedWordObj.word.toUpperCase();
            currentHint = selectedWordObj.hint;

            livesCountSpan.textContent = maxLives - incorrectGuesses;
            updateHangmanImage();
            wordHintDisplay.textContent = currentHint;
            
            displayWord();
            createKeyboard();
            
            gameMessage.className = 'message my-4 alert';
            gameMessage.textContent = "";
            playAgainBtn.style.display = 'none';
        };

        const updateHangmanImage = () => {
            let imageIndex = 0;
            if (currentDifficulty === 'sulit') {
                imageIndex = incorrectGuesses < SULIT_IMAGE_MAP.length 
                    ? SULIT_IMAGE_MAP[incorrectGuesses] 
                    : SULIT_IMAGE_MAP[SULIT_IMAGE_MAP.length - 1];
            } else {
                imageIndex = Math.min(incorrectGuesses, 7);
            }
            hangmanImg.src = `images/dummy-${imageIndex}.png`;
            livesCountSpan.textContent = maxLives - incorrectGuesses;
        };

        const displayWord = () => {
            wordDisplay.innerHTML = currentWord.split('').map(letter => {
                return `<span class="letter">${guessedLetters.includes(letter) ? letter : '_'}</span>`;
            }).join('');
            checkWinCondition();
        };

        const createKeyboard = () => {
            keyboardDiv.innerHTML = '';
            for (let i = 65; i <= 90; i++) {
                const letter = String.fromCharCode(i);
                const button = document.createElement('button');
                button.textContent = letter;
                button.onclick = () => handleGuess(letter, button);
                keyboardDiv.appendChild(button);
            }
        };

        const handleGuess = (letter, button) => {
            if (guessedLetters.includes(letter)) return;

            guessedLetters.push(letter);
            button.disabled = true;
            
            if (currentWord.includes(letter)) {
                button.classList.add('correct');
                displayWord();
            } else {
                button.classList.add('wrong');
                incorrectGuesses++;
                updateHangmanImage();
                checkLoseCondition();
            }
        };

        const checkWinCondition = () => {
            if (!wordDisplay.textContent.includes('_')) {
                endGame(true);
            }
        };

        const checkLoseCondition = () => {
            if (incorrectGuesses >= maxLives) {
                endGame(false);
            }
        };

        const endGame = (isWin) => {
            Array.from(keyboardDiv.children).forEach(btn => btn.disabled = true);
            
            if (isWin) {
                gameMessage.textContent = `🎉 SELAMAT! Anda menang! Kata yang benar adalah: ${currentWord}`;
                gameMessage.classList.add('alert-success');
                gameMessage.classList.remove('alert-danger');
            } else {
                updateHangmanImage();
                gameMessage.textContent = `💀 GAME OVER! Kata yang benar adalah: ${currentWord}`;
                gameMessage.classList.add('alert-danger');
                gameMessage.classList.remove('alert-success');
            }
            
            playAgainBtn.style.display = 'inline-block';
        };

        const resetGame = () => {
            gameArea.style.display = 'none';
            difficultySelection.style.display = 'block';
        };