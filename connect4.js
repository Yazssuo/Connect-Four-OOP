class Player {
  constructor(color){
    this.playerColor = color;
  }
}

class Game {
  constructor (width, height, playerArray) {
      this.WIDTH = width;
      this.HEIGHT = height;
      this.Players = playerArray;
      this.currPlayer = this.Players[0];
      this.gameOver = false;
      this.makeBoard();
      this.makeHtmlBoard();
  }
  makeBoard(){
      this.board = [];
      for (let y = 0; y < this.HEIGHT; y++) {
          this.board.push(Array.from({ length: this.WIDTH }));
      }
  }
  makeHtmlBoard() {
      const board = document.getElementById('board');
    
      // make column tops (clickable area for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');

      top.addEventListener('click', this.handleClick.bind(this));
    
      for (let x = 0; x < this.WIDTH; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
    
      board.append(top);
    
      // make main part of board
      for (let y = 0; y < this.HEIGHT; y++) {
        const row = document.createElement('tr');
    
        for (let x = 0; x < this.WIDTH; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
    
        board.append(row);
      }
  }
  findSpotForCol(x) {
      for (let y = this.HEIGHT - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null;
  }
  placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.top = -50 * (y + 2);
      piece.style.backgroundColor = this.currPlayer.playerColor;
    
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
  }
  endGame(msg) {
    this.gameOver = true;
      alert(msg);
  }
  handleClick(evt) {
      // get x from ID of clicked cell
      const x = +evt.target.id;
    
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null || this.gameOver === true) {
        return;
      }
    
      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
      
      // check for win
      if (this.checkForWin()) {
        return this.endGame(`Player ${this.currPlayer.playerColor} won!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
        
      // switch players
      this.currPlayer = this.currPlayer === this.Players[0] ? this.Players[1] : this.Players[0];
  }
  checkForWin() {
      const _win = (cells) => {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer
    
        return cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.HEIGHT &&
            x >= 0 &&
            x < this.WIDTH &&
            this.board[y][x] === this.currPlayer
        );
      }
    
      for (let y = 0; y < this.HEIGHT; y++) {
        for (let x = 0; x < this.WIDTH; x++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    
          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
  }
}

let currGame;

const btn = document.querySelector('#btn');
const color1 = document.querySelector('#color1');
const color2 = document.querySelector('#color2');
btn.addEventListener('click', () => {
  currGame = new Game(6,7, [new Player(color1.value), new Player(color2.value)]);
})