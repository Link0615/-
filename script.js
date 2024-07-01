const rows = 15;
const cols = 15;
let board = [];
let currentPlayer = 'black';
let timer;
let timeLeft = 5;
const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timerDisplay');
const undoButton = document.getElementById('undoButton'); // 假设页面中有一个id为undoButton的按钮
const startButton = document.getElementById('startButton'); // 假设页面中有一个id为startButton的按钮
let history = [];
let gameStarted = false;

function initBoard() {
    board = Array.from({ length: rows }, () => Array(cols).fill(null));
    gameBoard.innerHTML = ''; // 清空棋盘避免重复创建
    history = []; // 初始化历史记录
    gameStarted = false; // 初始化游戏状态

    // 生成棋盘格子
    for (let row = 0; row < rows - 1; row++) {
        for (let col = 0; col < cols - 1; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.left = `${col * 30 + 15}px`;
            cell.style.top = `${row * 30 + 15}px`;
            gameBoard.appendChild(cell);
        }
    }

    // 生成交点
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const intersection = document.createElement('div');
            intersection.className = 'intersection ' + (currentPlayer === 'black' ? 'black-hover' : 'white-hover');
            intersection.style.left = `${col * 30 + 15}px`;
            intersection.style.top = `${row * 30 + 15}px`;
            intersection.dataset.row = row;
            intersection.dataset.col = col;

            // 给正中央的交点添加特殊样式
            if (row === Math.floor(rows / 2) && col === Math.floor(cols / 2)) {
                intersection.classList.add('central-point');
            }

            intersection.addEventListener('click', handleCellClick);
            gameBoard.appendChild(intersection);
        }
    }
}

function handleCellClick(event) {
    if (!gameStarted) return; // 如果游戏没有开始，不允许下棋
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

        // 保存当前棋盘状态
        history.push({ row, col, player: currentPlayer });

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

function undoMove() {
    if (history.length >= 2) {
        clearInterval(timer);

        // 撤销两步棋
        for (let i = 0; i < 2; i++) {
            const lastMove = history.pop();
            board[lastMove.row][lastMove.col] = null;
            const pieces = document.querySelectorAll(`.${lastMove.player}`);
            pieces[pieces.length - 1].remove();

            // 更新当前玩家
            currentPlayer = lastMove.player;
        }

        updateHoverEffects();
        startTimer();
    } else {
        alert('没有可以悔棋的步骤了!');
    }
}

function startGame() {
    gameStarted = true;
    startTimer();
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
undoButton.addEventListener('click', undoMove); // 绑定悔棋按钮事件
startButton.addEventListener('click', startGame); // 绑定开始游戏按钮事件
