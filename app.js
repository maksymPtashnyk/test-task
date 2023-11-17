class Game {
  constructor(field) {
    this.field = field;
  }

  findGroup(row, column) {
    const value = this.field[row][column];
    const visited = new Set();
    const group = [];

    this.searchGroup(row, column, value, visited, group);

    return group;
  }

  searchGroup(row, column, value, visited, group) {
    if (
      row < 0 || row >= this.field.length ||
      column < 0 || column >= this.field[0].length ||
      visited.has(`${row}-${column}`) ||
      this.field[row][column] !== value
    ) {
      return;
    }

    visited.add(`${row}-${column}`);
    group.push({ row, column });

    this.searchGroup(row - 1, column, value, visited, group);
    this.searchGroup(row + 1, column, value, visited, group);
    this.searchGroup(row, column - 1, value, visited, group);
    this.searchGroup(row, column + 1, value, visited, group);
  }

  deleteGroup(group) {
    group.forEach(({ row, column }) => {
      this.field[row][column] = 0;
    });
    this.renderGame();
  }

  applyDarkenEffect(group) {
    group.forEach(({ row, column }) => {
      const cellDiv = document.querySelector(`.game-cell[data-row="${row}"][data-column="${column}"]`);
      cellDiv.classList.add('darken');
    });
  }

  removeDarkenEffect() {
    const darkenCells = document.querySelectorAll('.darken');
    darkenCells.forEach(cell => {
      cell.classList.remove('darken');
    });
  }

  renderGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    this.field.forEach((row, rowIndex) => {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('row');

      row.forEach((cell, columnIndex) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('game-cell');
        cellDiv.setAttribute('data-row', rowIndex);
        cellDiv.setAttribute('data-column', columnIndex);
        cellDiv.textContent = cell === null ? '' : cell;

        cellDiv.addEventListener('click', () => {
          const group = this.findGroup(rowIndex, columnIndex);
          this.deleteGroup(group);
        });

        cellDiv.addEventListener('mouseenter', () => {
          const group = this.findGroup(rowIndex, columnIndex);
          this.applyDarkenEffect(group);
        });

        cellDiv.addEventListener('mouseleave', () => {
          this.removeDarkenEffect();
        });

        rowDiv.appendChild(cellDiv);
      });

      gameBoard.appendChild(rowDiv);
    });
  }
}

const gameField = [
  ['♠','♠','♣','♢','♣','♣'],
  ['♠','♠','♣','♢','♢','♢'],
  ['♠','♣','♣','♢','♢','♢'],
  ['♠','♣','♣','♣','♣','♢'],
  ['♡','♣','♣','♣','♡','♡'],
  ['♡','♡','♣','♣','♢','♣'],
  ['♡','♡','♡','♠','♠','♣'],
];

const game = new Game(gameField);

game.renderGame();