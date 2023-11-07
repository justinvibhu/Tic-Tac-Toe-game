

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');
const board = document.getElementById('board');
const center = document.querySelector('.center');

// Define player names and emoji symbols
const playerXName = 'Devil';
const playerOName = 'Angel';
const playerXEmoji = '\u{1F608}'; // Man emoji
const playerOEmoji = '\u{1F607}'; // Woman emoji

// Define audio elements
const playerXAudio = new Audio('./Music/playerO.wav'); // Replace 'playerX.mp3' with your audio file
const playerOAudio = new Audio('./Music/playerX.wav'); // Replace 'playerO.mp3' with your audio file
const emojiClickAudio = new Audio('./Music/emojiclick.wav'); // Replace 'emojiClick.mp3' with your audio file
const drawAudio = new Audio('./Music/playerX.wav'); // Add your draw audio file

let currentPlayer = 'X'; // Use 'X' and 'O' for tracking the player
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function playAudio(audio) {
    if (!audio.paused) {
        audio.currentTime = 0;
    }
    audio.play();
}

function checkWinner() {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            const winnerName = currentPlayer === 'X' ? playerXName : playerOName;
            message.textContent = `${winnerName} wins!`;
            cells[a].style.background = cells[b].style.background = cells[c].style.background = '#2ecc71';

            // Play audio based on the current player
            if (currentPlayer === 'X') {
                playAudio(playerXAudio);
            } else {
                playAudio(playerOAudio);
            }

            // Add celebration animation
            const celebration = document.createElement('div');
            celebration.className = 'winner-celebration';
            celebration.textContent = `${winnerName} wins! \u{1F389}`;
            center.appendChild(celebration);

            // Reset the game after 3 seconds and refresh the page
            setTimeout(() => {
                handleResetClick();
                location.reload(); // Refresh the page
            }, 3000);
        }
    }

    if (!gameBoard.includes('') && gameActive) {
        gameActive = false;
        message.textContent = "It's a draw!";
        playAudio(drawAudio); // Play draw audio
    }
}

function handleCellClick(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cells[index].textContent = currentPlayer === 'X' ? playerXEmoji : playerOEmoji;
        cells[index].style.fontSize = '2em';
        const playerName = currentPlayer === 'X' ? playerXName : playerOName;
        message.textContent = `${playerName}'s turn`;
        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        // Play audio when an emoji cell is clicked
        playAudio(emojiClickAudio);
    }
}

function handleResetClick() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.background = '#f2f2f2';
        cell.style.fontSize = '2em';
    });
    message.textContent = `${playerXName}'s turn`;

    // Remove any previous celebration animation
    const previousCelebration = document.querySelector('.winner-celebration');
    if (previousCelebration) {
        previousCelebration.remove();
    }
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

resetButton.addEventListener('click', handleResetClick);
