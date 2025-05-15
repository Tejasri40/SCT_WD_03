document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const cells = document.querySelectorAll('.cell');
  const status = document.getElementById('status');
  const currentPlayerDisplay = document.getElementById('current-player');
  const resetButton = document.getElementById('reset');
  const vsHumanButton = document.getElementById('vsHuman');
  const vsComputerButton = document.getElementById('vsComputer');

  let gameState = Array(9).fill('');
  let currentPlayer = 'X';
  let gameActive = false;
  let vsComputer = false;
  let computerDifficulty = 'easy';

  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function initializeGame() {
    gameState = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;

    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('x', 'o');
    });

    updateStatus();

    if (vsComputer && currentPlayer === 'O') {
      setTimeout(computerMove, 500);
    }
  }

  function handleCellClick(e) {
    const clickedCell = e.target;
    const index = parseInt(clickedCell.dataset.index);

    if (gameState[index] !== '' || !gameActive) return;

    updateCell(clickedCell, index);
    checkResult();

    if (vsComputer && gameActive && currentPlayer === 'O') {
      setTimeout(computerMove, 500);
    }
  }

  function updateCell(cell, index) {
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
  }

  function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }

  function updateStatus() {
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
  }

  function checkResult() {
    let roundWon = false;

    for (const [a, b, c] of winningConditions) {
      if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      status.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;
      return;
    }

    if (!gameState.includes('')) {
      status.textContent = "Game ended in a draw!";
      gameActive = false;
      return;
    }

    changePlayer();
  }

  function computerMove() {
    if (!gameActive) return;

    let move;
    switch (computerDifficulty) {
      case 'easy': move = getRandomMove(); break;
      case 'medium': move = getMediumMove(); break;
      case 'hard': move = getBestMove(); break;
      default: move = getRandomMove();
    }

    if (move !== null) {
      const cell = document.querySelector(`.cell[data-index="${move}"]`);
      updateCell(cell, move);
      checkResult();
    }
  }

  function getRandomMove() {
    return gameState.map((v, i) => v === '' ? i : null).filter(v => v !== null)
                    .sort(() => Math.random() - 0.5)[0];
  }

  function getMediumMove() {
    for (let [a, b, c] of winningConditions) {
      if (gameState[a] === 'O' && gameState[b] === 'O' && gameState[c] === '') return c;
      if (gameState[a] === 'O' && gameState[c] === 'O' && gameState[b] === '') return b;
      if (gameState[b] === 'O' && gameState[c] === 'O' && gameState[a] === '') return a;
    }

    for (let [a, b, c] of winningConditions) {
      if (gameState[a] === 'X' && gameState[b] === 'X' && gameState[c] === '') return c;
      if (gameState[a] === 'X' && gameState[c] === 'X' && gameState[b] === '') return b;
      if (gameState[b] === 'X' && gameState[c] === 'X' && gameState[a] === '') return a;
    }

    if (gameState[4] === '') return 4;

    const corners = [0, 2, 6, 8].filter(i => gameState[i] === '');
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    return getRandomMove();
  }

  function getBestMove() {
    function minimax(board, depth, isMax) {
      const winner = checkWinner(board);
      if (winner === 'O') return 10 - depth;
      if (winner === 'X') return depth - 10;
      if (!board.includes('')) return 0;

      let bestScore = isMax ? -Infinity : Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = isMax ? 'O' : 'X';
          const score = minimax(board, depth + 1, !isMax);
          board[i] = '';
          bestScore = isMax ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
      }
      return bestScore;
    }

    let bestMove = null, bestScore = -Infinity;
    for (let i = 0; i < gameState.length; i++) {
      if (gameState[i] === '') {
        gameState[i] = 'O';
        const score = minimax(gameState, 0, false);
        gameState[i] = '';
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove ?? getRandomMove();
  }

  function checkWinner(board) {
    for (let [a, b, c] of winningConditions) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function resetGame() {
    initializeGame();
    status.textContent = vsComputer ? "Playing against Computer" : "Playing against Human";
  }

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', resetGame);
  vsHumanButton.addEventListener('click', () => {
    vsComputer = false;
    status.textContent = "Playing against Human";
    initializeGame();
  });
  vsComputerButton.addEventListener('click', () => {
    vsComputer = true;
    status.textContent = "Playing against Computer";
    initializeGame();
  });

  updateStatus();
});
