// Daftar kata-kata untuk ditebak (Anda bisa menambahkan lebih banyak)
const wordList = [
    { word: "JAVASCRIPT", hint: "Bahasa pemrograman web" },
    { word: "INFORMATIKA", hint: "Bidang studi Anda" },
    { word: "ALGORITMA", hint: "Langkah-langkah penyelesaian masalah" },
    { word: "HTML", hint: "Struktur dasar halaman web" }
];

// MAPPING KHUSUS UNTUK KESULITAN SULIT (4 Nyawa / 5 Gambar)
// Indeks Array: Jumlah Kesalahan (0, 1, 2, 3, 4)
// Nilai Array: Indeks Gambar Dummy yang akan digunakan
const SULIT_IMAGE_MAP = [0, 3, 4, 6, 7]; 

// Variabel Global
let currentWord = "";
let incorrectGuesses = 0;
let maxLives = 0; // Jumlah kesalahan maksimum yang diperbolehkan
let currentDifficulty = ''; // Menyimpan mode 'mudah' atau 'sulit'
let guessedLetters = [];

const hangmanImg = document.getElementById("hangman-img");
const wordDisplay = document.getElementById("word-display");
const keyboardDiv = document.getElementById("keyboard");
const livesCountSpan = document.getElementById("lives-count");
const gameMessage = document.getElementById("game-message");
const playAgainBtn = document.getElementById("play-again-btn");
const gameArea = document.getElementById("game-area");
const difficultySelection = document.getElementById("difficulty-selection");

// Fungsi untuk memilih kata secara acak
const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex].word.toUpperCase();
};

// Fungsi untuk memulai permainan
const startGame = (difficulty) => {
    currentDifficulty = difficulty; // Simpan tingkat kesulitan

    // 1. Tentukan nyawa maksimal berdasarkan kesulitan
    if (difficulty === 'sulit') {
        maxLives = 4; // 4 nyawa = 4 kesalahan maksimum
        console.log("Mode: Sulit (4 Nyawa, Gambar: 0, 3, 4, 6, 8)");
    } else { // mudah
        maxLives = 7; // 7 nyawa = 7 kesalahan maksimum (sesuai dummy-0 sampai dummy-7)
        console.log("Mode: Mudah (7 Nyawa, Gambar: 0 sampai 8)");
    }

    // 2. Sembunyikan pemilihan kesulitan dan tampilkan area permainan
    difficultySelection.style.display = 'none';
    gameArea.style.display = 'block';

    // 3. Reset state permainan
    incorrectGuesses = 0;
    guessedLetters = [];
    currentWord = getRandomWord();
    
    // Tampilkan nyawa awal dan gambar pertama
    livesCountSpan.textContent = maxLives - incorrectGuesses;
    updateHangmanImage();
    
    // Tampilkan tampilan kata
    displayWord();
    
    // Buat keyboard
    createKeyboard();
    
    // Sembunyikan pesan dan tombol main lagi
    gameMessage.textContent = "";
    playAgainBtn.style.display = 'none';
};

// Fungsi untuk memperbarui gambar Hangman
const updateHangmanImage = () => {
    let imageIndex = 0;

    if (currentDifficulty === 'sulit') {
        // Gunakan mapping khusus untuk mode Sulit
        // incorrectGuesses 0 -> dummy-0, 1 -> dummy-3, 2 -> dummy-4, 3 -> dummy-6, 4 -> dummy-8
        // Kita menggunakan nilai incorrectGuesses sebagai indeks array SULIT_IMAGE_MAP
        if (incorrectGuesses < SULIT_IMAGE_MAP.length) {
            imageIndex = SULIT_IMAGE_MAP[incorrectGuesses];
        } else {
             // Jika entah bagaimana melampaui batas (seharusnya tidak terjadi), gunakan gambar terakhir
             imageIndex = SULIT_IMAGE_MAP[SULIT_IMAGE_MAP.length - 1]; 
        }
    } else {
        // Untuk mode Mudah, gunakan jumlah kesalahan langsung sebagai indeks gambar (0 hingga 8)
        imageIndex = incorrectGuesses;
    }

    // Menggunakan template string untuk memanggil file gambar dummy yang sesuai
    hangmanImg.src = `images/dummy-${imageIndex}.png`;
    
    // Perbarui tampilan nyawa
    livesCountSpan.textContent = maxLives - incorrectGuesses;
};


// Fungsi untuk menampilkan kata (dengan garis bawah untuk huruf yang belum ditebak)
const displayWord = () => {
    wordDisplay.innerHTML = currentWord.split('').map(letter => {
        return `<span class="letter">${guessedLetters.includes(letter) ? letter : '_'}</span>`;
    }).join('');
    
    // Cek kemenangan setelah menampilkan kata
    checkWinCondition();
};

// Fungsi untuk membuat tombol keyboard A-Z
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

// Fungsi penanganan tebakan huruf
const handleGuess = (letter, button) => {
    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    button.disabled = true;
    
    if (currentWord.includes(letter)) {
        displayWord();
    } else {
        incorrectGuesses++;
        updateHangmanImage(); // Panggil untuk memperbarui gambar dan nyawa
        checkLoseCondition();
    }
};

// Fungsi untuk mengecek kondisi menang
const checkWinCondition = () => {
    if (!wordDisplay.textContent.includes('_')) {
        endGame(true);
    }
};

// Fungsi untuk mengecek kondisi kalah
const checkLoseCondition = () => {
    if (incorrectGuesses >= maxLives) {
        endGame(false);
    }
};

// Fungsi untuk mengakhiri permainan
const endGame = (isWin) => {
    // Nonaktifkan semua tombol keyboard
    Array.from(keyboardDiv.children).forEach(btn => btn.disabled = true);
    
    if (isWin) {
        gameMessage.textContent = `SELAMAT, Anda menang! Kata yang benar adalah: ${currentWord}`;
        gameMessage.style.color = 'green';
    } else {
        // Jika kalah, updateHangmanImage sudah dipanggil dan seharusnya sudah menampilkan dummy-8.png
        gameMessage.textContent = `GAME OVER. Nyawa habis! Kata yang benar adalah: ${currentWord}`;
        gameMessage.style.color = 'red';
    }
    
    playAgainBtn.style.display = 'block';
};

// Fungsi untuk mengatur ulang permainan
const resetGame = () => {
    // Kembali ke layar pemilihan kesulitan
    gameArea.style.display = 'none';
    difficultySelection.style.display = 'block';
};