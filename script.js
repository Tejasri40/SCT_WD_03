document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const cells = document.querySelectorAll('.cell');
  const status = document.getElementById('status');
  const currentPlayerDisplay = document.getElementById('current-player');
  const resetButton = document.getElementById('reset');

  let gameState = Array(9).fill('');
  let currentPlayer = 'X';
  let gameActive = false;
  let vsComputer = true;
  let computerDifficulty = 'easy'; // Change to 'medium' or 'hard' if needed

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
      cell.classList.remove('x', 'o', 'win');
    });

    updateStatus();
    status.textContent = "";//Playing against Computer

    if (vsComputer && currentPlayer === 'O') {
      setTimeout(computerMove, 500);
    }
  }

  function handleCellClick(e) {
    if (!gameActive || (vsComputer && currentPlayer === 'O')) return;

    const clickedCell = e.target;
    const index = parseInt(clickedCell.dataset.index);

    if (gameState[index] !== '') return;

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
    let winCombo = [];

    for (const [a, b, c] of winningConditions) {
      if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
        roundWon = true;
        winCombo = [a, b, c];
        break;
      }
    }

    if (roundWon) {
      winCombo.forEach(i => document.querySelector(`.cell[data-index="${i}"]`).classList.add('win'));
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
    const emptyCells = gameState
      .map((value, index) => value === '' ? index : null)
      .filter(index => index !== null);
    return emptyCells.length ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
  }

  function resetGame() {
    initializeGame();
  }

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', resetGame);

  initializeGame();
});
