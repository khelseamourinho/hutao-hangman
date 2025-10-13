const easyWords = [
    { word: "KOMPUTER", hint: "Alat elektronik untuk memproses data" },
    { word: "INTERNET", hint: "Jaringan global yang menghubungkan perangkat" },
    { word: "LAPTOP", hint: "Komputer portabel" },
    { word: "MOUSE", hint: "Alat untuk menggerakkan kursor" },
    { word: "MONITOR", hint: "Layar untuk menampilkan output komputer" },
    { word: "KEYBOARD", hint: "Perangkat untuk mengetik huruf dan angka" },
    { word: "ROUTER", hint: "Perangkat pengatur lalu lintas jaringan" },
    { word: "PRINTER", hint: "Alat untuk mencetak dokumen" },
    { word: "FILE", hint: "Berkas digital yang berisi data" },
    { word: "DATA", hint: "Informasi mentah yang dapat diolah" },
    { word: "EMAIL", hint: "Surat elektronik" },
    { word: "PASSWORD", hint: "Kata sandi untuk keamanan akun" },
    { word: "BROWSER", hint: "Aplikasi untuk menjelajahi internet" },
    { word: "UPLOAD", hint: "Mengirim file ke internet" },
    { word: "DOWNLOAD", hint: "Mengambil file dari internet" },
    { word: "SOFTWARE", hint: "Program yang dijalankan oleh komputer" },
    { word: "HARDWARE", hint: "Komponen fisik dari komputer" },
    { word: "FOLDER", hint: "Tempat menyimpan kumpulan file" },
    { word: "SEARCH", hint: "Mencari informasi di internet" },
    { word: "LOGIN", hint: "Masuk ke dalam sistem dengan akun" },
    { word: "LOGOUT", hint: "Keluar dari akun atau sistem" },
    { word: "MEMORY", hint: "Penyimpanan sementara dalam komputer" },
    { word: "BACKUP", hint: "Salinan data untuk keamanan" },
    { word: "SCREEN", hint: "Bagian tampilan pada perangkat" },
    { word: "CLOUD", hint: "Penyimpanan data secara online" },
    { word: "ICON", hint: "Simbol grafis pada antarmuka komputer" },
    { word: "DESKTOP", hint: "Tampilan utama layar komputer" },
    { word: "WINDOWS", hint: "Sistem operasi populer dari Microsoft" },
    { word: "ANDROID", hint: "Sistem operasi untuk perangkat mobile" },
    { word: "APPLE", hint: "Perusahaan pembuat iPhone dan Mac" }
];

const hardWords = [
    { word: "ALGORITMA", hint: "Langkah-langkah penyelesaian masalah" },
    { word: "DATABASE", hint: "Kumpulan data yang terstruktur" },
    { word: "ENKRIPSI", hint: "Proses mengamankan data dengan kode" },
    { word: "DEKRIPSI", hint: "Proses mengubah kode menjadi data asli" },
    { word: "BLOCKCHAIN", hint: "Teknologi penyimpanan data terdesentralisasi" },
    { word: "MACHINELEARNING", hint: "Cabang AI yang mempelajari pola dari data" },
    { word: "DEEPLEARNING", hint: "Metode pembelajaran mesin menggunakan jaringan saraf" },
    { word: "ARTIFICIALINTELLIGENCE", hint: "Kecerdasan buatan" },
    { word: "VIRTUALISASI", hint: "Menjalankan sistem seolah-olah di perangkat lain" },
    { word: "KOMPLEKSITAS", hint: "Ukuran tingkat kesulitan dari algoritma" },
    { word: "MULTITHREADING", hint: "Menjalankan beberapa proses bersamaan" },
    { word: "CONCURRENCY", hint: "Eksekusi banyak tugas dalam waktu bersamaan" },
    { word: "CRYPTOGRAPHY", hint: "Ilmu tentang penyandian data" },
    { word: "CYBERSECURITY", hint: "Perlindungan terhadap ancaman digital" },
    { word: "FRAMEWORK", hint: "Kerangka kerja untuk membangun aplikasi" },
    { word: "BACKEND", hint: "Bagian server dari aplikasi web" },
    { word: "FRONTEND", hint: "Bagian tampilan aplikasi web" },
    { word: "FULLSTACK", hint: "Pengembang yang menguasai frontend dan backend" },
    { word: "DEVOPS", hint: "Kombinasi praktik pengembangan dan operasi IT" },
    { word: "COMPILER", hint: "Penerjemah kode program ke bahasa mesin" },
    { word: "DEBUGGING", hint: "Proses menemukan dan memperbaiki kesalahan kode" },
    { word: "OPTIMIZATION", hint: "Proses meningkatkan performa sistem" },
    { word: "CONTAINERIZATION", hint: "Teknik menjalankan aplikasi dalam lingkungan terisolasi" },
    { word: "KUBERNETES", hint: "Platform untuk mengatur kontainer" },
    { word: "MICROSERVICES", hint: "Arsitektur yang memecah sistem jadi layanan kecil" },
    { word: "SERIALISASI", hint: "Mengubah objek menjadi format data tertentu" },
    { word: "DESERIALISASI", hint: "Mengubah data kembali menjadi objek" },
    { word: "VIRTUALREALITY", hint: "Simulasi dunia nyata dalam bentuk digital" },
    { word: "AUGMENTEDREALITY", hint: "Menggabungkan dunia nyata dengan elemen digital" },
    { word: "RECURSION", hint: "Fungsi yang memanggil dirinya sendiri" }
];

// Mapping gambar untuk mode sulit
const SULIT_IMAGE_MAP = [0, 2, 3, 5, 7];

// Variabel global
let currentWord = "";
let incorrectGuesses = 0;
let maxLives = 0;
let currentDifficulty = '';
let guessedLetters = [];
let currentHint = "";

// Element DOM
const hangmanImg = document.getElementById("hangman-img");
const wordDisplay = document.getElementById("word-display");
const keyboardDiv = document.getElementById("keyboard");
const livesCountSpan = document.getElementById("lives-count");
const gameMessage = document.getElementById("game-message");
const playAgainBtn = document.getElementById("play-again-btn");
const gameArea = document.getElementById("game-area");
const difficultySelection = document.getElementById("difficulty-selection");
const wordHintDisplay = document.getElementById("word-hint");

// ========================
// 🎮 Fungsi Game
// ========================

const getRandomWord = () => {
    const words = currentDifficulty === 'sulit' ? hardWords : easyWords;
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
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
