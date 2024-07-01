const rows = 15;
const cols = 15;
let board = [];
let currentPlayer = 'black';
let timer;
let timeLeft = 5;
const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timerDisplay');

function initBoard() {
    board = Array.from({ length: rows }, () => Array(cols).fill(null));
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.left = `${col * 30 + 15}px`;
            cell.style.top = `${row * 30 + 15}px`;
            gameBoard.appendChild(cell);
        }
    }

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const intersection = document.createElement('div');
            intersection.className = 'intersection ' + (currentPlayer === 'black' ? 'black-hover' : 'white-hover');
            intersection.style.left = `${col * 30 + 15}px`;
            intersection.style.top = `${row * 30 + 15}px`;
            intersection.dataset.row = row;
            intersection.dataset.col = col;
            intersection.addEventListener('click', handleCellClick);
            gameBoard.appendChild(intersection);
        }
    }
    startTimer();
}

function handleCellClick(event) {
    clearInterval(timer);
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    if (board[row][col] === null) {
        board[row][col] = currentPlayer;
        const piece = document.createElement('div');
        piece.className = currentPlayer;
        piece.style.left = `${col * 30 + 15}px`;
        piece.style.top = `${row * 30 + 15}px`;
        gameBoard.appendChild(piece);

        if (checkWin(row, col)) {
            setTimeout(() => {
                alert(`${currentPlayer === 'black' ? '黑棋' : '白棋'}获胜!`);
                resetGame();
            }, 100);
        } else {
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            updateHoverEffects();
            startTimer();
        }
    }
}

function updateHoverEffects() {
    document.querySelectorAll('.intersection').forEach(intersection => {
        intersection.classList.remove('black-hover', 'white-hover');
        intersection.classList.add(currentPlayer === 'black' ? 'black-hover' : 'white-hover');
    });
}

function checkWin(row, col) {
    row = parseInt(row);
    col = parseInt(col);
    const directions = [
        { x: 1, y: 0 }, { x: 0, y: 1 },
        { x: 1, y: 1 }, { x: 1, y: -1 }
    ];
    for (const { x, y } of directions) {
        let count = 1;
        for (let i = 1; i < 5; i++) {
            const r = row + i * y;
            const c = col + i * x;
            if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== currentPlayer) break;
            count++;
        }
        for (let i = 1; i < 5; i++) {
            const r = row - i * y;
            const c = col - i * x;
            if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== currentPlayer) break;
            count++;
        }
        if (count >= 5) return true;
    }
    return false;
}

function resetGame() {
    clearInterval(timer);
    gameBoard.innerHTML = '';
    currentPlayer = 'black';
    initBoard();
}

function startTimer() {
    timeLeft = 5;
    updateTimerDisplay();
    timer = setInterval(function() {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft === 0) {
            clearInterval(timer);
            alert(`${currentPlayer === 'black' ? '白棋' : '黑棋'}获胜，对方超时!`);
            resetGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = `剩余时间: ${timeLeft} 秒`;
}

initBoard();
