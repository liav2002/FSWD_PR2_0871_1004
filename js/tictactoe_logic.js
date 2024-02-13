// Retrieve loggedInUser from local storage
const loggedInUserString = localStorage.getItem('loggedInUser');

// Check if loggedInUser does not exist in local storage
if (!loggedInUserString) {
    window.location.href = '../index.html';
}

// Get LoggedIn User
const loggedInUser = JSON.parse(loggedInUserString);
const loggedInUserId = loggedInUser.user_id;

// Load scores from local storage
const scores = JSON.parse(localStorage.getItem('scores')) || [];
let userScoreIndex = scores.findIndex(score => score.user_id === loggedInUserId);

// Global variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let human_sign = Math.random() < 0.5 ? 'X' : 'O'; // Randomly choose 'X' or 'O' for the human player
let botPlayer = (human_sign === 'X') ? 'O' : 'X'; // Determine the bot player
let gameActive = true;
let totalPoints = 0;
let currentPoints = 0;

function updateScoreDisplay() {
    document.getElementById('total-points').textContent = totalPoints;
    document.getElementById('current-points').textContent = currentPoints;

    // Find the best score and player
    const bestScoreObj = scores.reduce((prev, curr) => (curr.tictactoe_score >= prev.tictactoe_score) ? curr : prev, { tictactoe_score: 0 });
    document.getElementById('best-score').textContent = bestScoreObj.tictactoe_score;

    // Find the username of the player with the best score
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const bestPlayer = users.find(user => user.user_id === bestScoreObj.user_id);
    document.getElementById('best-player').textContent = bestPlayer ? bestPlayer.username : '-';

    // local storage save
    saveScores2LocalStorage();
}

function handleMove(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        document.getElementById(index).textContent = currentPlayer;

        if (checkWin()) {
            // Player wins
            if (currentPlayer === human_sign) {
                currentPoints += 10;
                totalPoints += 10;
            } else {
                totalPoints -= 5; 
                currentPoints -= 5;
            }
            gameActive = false;

            // Update score display
            updateScoreDisplay();

            // Delay the alert to show the final sign before the alert
            setTimeout(() => {
                alert(`${currentPlayer} wins!`);
            }, 100);
        } else if (board.every(cell => cell !== '')) {
            // It's a draw
            gameActive = false;

            // Update score display
            updateScoreDisplay();

            // Delay the alert to show the final sign before the alert
            setTimeout(() => {
                alert('It\'s a draw!');
            }, 100);
        } else {
            // Switch player
            currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';

            // If the current player is the bot, make the bot move
            if (currentPlayer === botPlayer) {
                botMove();
            }
        }
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return (board[a] !== '' && board[a] === board[b] && board[b] === board[c]);
    });
}

function checkWin_alphabetapuring(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return (board[a] === player && board[b] === player && board[c] === player);
    });
}

function botMove() {
    if (gameActive) {
        const bestMove = getBestMove(board, botPlayer, -Infinity, Infinity);
        handleMove(bestMove);
    }
}

function getBestMove(board, player, alpha, beta) {
    const emptyCells = board.reduce((acc, cell, index) => (cell === '') ? acc.concat(index) : acc, []);

    if (checkWin_alphabetapuring(board, human_sign)) {
        return -10;
    } else if (checkWin_alphabetapuring(board, botPlayer)) {
        return 10;
    } else if (emptyCells.length === 0) {
        return 0;
    }

    let bestMove;
    let bestScore = (player === botPlayer) ? -Infinity : Infinity;

    for (let i = 0; i < emptyCells.length; i++) {
        const index = emptyCells[i];
        board[index] = player;

        let score;
        if (player === botPlayer) {
            score = getBestMove(board, human_sign, alpha, beta);
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
            alpha = Math.max(alpha, score);
        } else {
            score = getBestMove(board, botPlayer, alpha, beta);
            if (score < bestScore) {
                bestScore = score;
                bestMove = index;
            }
            beta = Math.min(beta, score);
        }

        board[index] = ''; // Undo the move

        if (beta <= alpha) {
            break; // Prune remaining branches
        }
    }

    return (player === botPlayer) ? bestMove : bestScore;
}

function saveScores2LocalStorage() {
    scores[userScoreIndex].tictactoe_score = totalPoints;
    localStorage.setItem('scores', JSON.stringify(scores));
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;

    // Clear the board
    for (let i = 0; i < 9; i++) {
        document.getElementById(i).textContent = '';
    }

    // Init players
    human_sign = Math.random() < 0.5 ? 'X' : 'O'; // Randomly choose 'X' or 'O' for the human player
    botPlayer = (human_sign === 'X') ? 'O' : 'X'; // Determine the bot player

    // If the bot plays first, make the initial bot move
    if (currentPlayer === botPlayer) {
        botMove();
    }

    updateScoreDisplay();
}

function gamesButtonClicked() {
    window.location.href = '../html/games.html';
}

// Event listener for the reset button
document.getElementById('reset-button').addEventListener('click', resetGame);

// Event listener for the games button
document.getElementById('games-button-id').addEventListener('click', gamesButtonClicked);

// Initialize the game board
document.addEventListener('DOMContentLoaded', function () {
    if (userScoreIndex === -1) {
        // User record not found, initialize a new one
        const newUserScore = { user_id: loggedInUserId, tictactoe_score: 0 };

        // Save the new user score to the scores array
        scores.push(newUserScore);

        // Update user's score index
        userScoreIndex = scores.findIndex(score => score.user_id === loggedInUserId);
    } else {
        // User record found, ensure tictactoe_score is present
        if (!scores[userScoreIndex].hasOwnProperty('tictactoe_score')) {
            scores[userScoreIndex].tictactoe_score = 0;
        }
    }

    // Save updated scores to local storage
    localStorage.setItem('scores', JSON.stringify(scores));

    // Update Total Points
    totalPoints = scores[userScoreIndex].tictactoe_score;

    // Initialize the game board
    const gameContainer = document.getElementById('game-container');
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('id', i);
        cell.addEventListener('click', () => handleMove(i));
        gameContainer.appendChild(cell);
    }

    // If the bot plays first, make the initial bot move
    if (currentPlayer === botPlayer) {
        botMove();
    }

    // Initial update of score display
    updateScoreDisplay();
});