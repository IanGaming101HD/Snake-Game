class Utility {
    constructor() {
      this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'y', 'z'];
    }
  
    increment(value) {
      if (this.letters.includes(value)) {
        value = this.letters[this.letters.indexOf(value.toLowerCase()) + 1];
        if (!value) {
          value = this.letters[0];
        }
        return value;
      } else {
        value++;
        return value;
      }
    }
  
    decrement(value) {
      if (this.letters.includes(value)) {
        value = this.letters[this.letters.indexOf(value.toLowerCase()) - 1];
        if (!value) {
          value = this.letters[this.letters.length - 1];
        }
        return value;
      } else {
        value--;
        return value;
      }
    }
  }

class Game {
  constructor(x, y) {
    this.score = 0;
    this.high_score = 0;
    this.gameOver = false;
    this.x = x;
    this.y = y;
    this.createBoard();
    this.generateApple('m8');
  }

  createBoard() {
    let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let squareType = 'light-square';

    function createSquare(id, row) {
      let element = document.createElement('div');

      element.id = id;
      element.classList.add('square');

      if (squareType === 'light-square') {
        element.classList.add('light-square');
        squareType = 'dark-square';
      } else if (squareType === 'dark-square') {
        element.classList.add('dark-square');
        squareType = 'light-square';
      }
      row.appendChild(element);
    }

    for (let x = 0; x < this.x; x++) {
      for (let y = 1; y <= this.y; y++) {
        if (x === 0) {
          let row = document.createElement('div');
          row.classList.add('row');
          row.classList.add(`row-${y}`);
          grid.appendChild(row);
        }
        let currentRow = document.querySelector(`.row-${y}`);
        createSquare(`${alphabet[x]}${y}`, currentRow);
      }
    }
  }

  updateBoard() {
    let score = document.getElementById('score');
    let highScore = document.getElementById('high-score');
    score.innerText = this.score;
    highScore.innerText = this.high_score;

    if (this.gameOver) {
      let newHighScore = this.score > this.high_score ? this.score : this.high_score;
      highScore.innerText = newHighScore;
      localStorage.setItem('high-score', newHighScore);
      console.log('Game Over!');
    }
  }

  generateApple(coordinate) {
    let element = document.createElement('img');
    element.src = './public/main/images/fruits/apple.png';
    element.classList.add('apple'); // remove this maybe, prob not needed
    document.getElementById(coordinate).appendChild(element);
    return element;
  }

  removeApple(coordinate) {
    let element = coordinate.getElementsByClassName('apple')[0];
    element.remove();
  }
}

class Snake {
  constructor(board) {
    this.board = board;
    this.previousDirection = 'east';
    this.direction = this.previousDirection;
    this.length = 0;
    this.sequence = [];
    this.createSnake();
  }

  createSnake() {
    this.createHead('d8');
    this.createBody('c8');
    this.createTail('b8');

    let snakeSegments = Array.from(document.getElementsByClassName('snake')).sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
    snakeSegments.forEach((value, index) => {
      this.sequence.push({
        coordinate: value.parentElement,
        direction: this.direction,
      });
    });
  }

  createHead(coordinate) {
    let element = document.createElement('img');
    this.length += 1;
    element.id = `snake-segment-${this.length}`;
    element.src = './public/main/images/snake/head.png';
    element.classList.add('snake');
    document.getElementById(coordinate).appendChild(element);
    this.head = element;
    return element;
  }

  createBody(coordinate) {
    let element = document.createElement('img');
    this.length += 1;
    element.id = `snake-segment-${this.length}`;
    element.src = './public/main/images/snake/body.png';
    element.classList.add('snake');
    document.getElementById(coordinate).appendChild(element);
    return element;
  }

  createTail(coordinate) {
    let element = document.createElement('img');
    this.length += 1;
    element.id = `snake-segment-${this.length}`;
    element.src = './public/main/images/snake/tail.png';
    element.classList.add('snake');
    document.getElementById(coordinate).appendChild(element);
    return element;
  }

  replaceBody(coordinate, direction) {
    let element = document.getElementById(coordinate);
  }

  replaceBody(coordinate, direction) {
    let element = document.getElementById(coordinate);
  }

  convertToCoordinate(string) {
    return [string[0], string.slice(1)];
  }

  north(coordinate) {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) return null;
    return coordinate[0] + utility.decrement(coordinate[1]);
  }

  east(coordinate) {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) return null;
    return utility.increment(coordinate[0]) + coordinate[1];
  }

  south(coordinate) {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) return null;
    return coordinate[0] + utility.increment(coordinate[1]);
  }

  west(coordinate) {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) return null;
    return utility.decrement(coordinate[0]) + coordinate[1];
  }

  getRotation(newDirection) {
    let rotations = {
      north: 270,
      east: 0,
      south: 90,
      west: 180,
    };
    return rotations[newDirection];
  }

  move() {
    let snakeSegments = Array.from(document.getElementsByClassName('snake')).sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
    let head = document.getElementById('snake-segment-1');
    let newCoordinate = document.getElementById(this[this.direction](this.convertToCoordinate(head.parentElement.id)));

    if (this.direction !== this.previousDirection) {
      let rotation = this.getRotation(this.direction);
      head.style.transform = `rotate(${rotation}deg)`;
      this.previousDirection = this.direction;
    }

    if (newCoordinate && (newCoordinate.children.length == 0 || Array.from(newCoordinate.children)[0].classList.contains('apple'))) {
      newCoordinate.appendChild(head);
      this.sequence.unshift({
        direction: this.direction,
        coordinate: newCoordinate,
      });

      for (let x = 0; x < snakeSegments.length; x++) {
        let rotation = this.getRotation(this.sequence[x].direction);
        snakeSegments[x].style.transform = `rotate(${rotation}deg)`;
        this.sequence[x].coordinate.appendChild(snakeSegments[x]);

        if (snakeSegments.length > 1) {
          if (snakeSegments[x].src.includes('body')) {
            if (this.sequence[x].direction === this.sequence[x - 1].direction) {
              snakeSegments[x].src = './public/main/images/snake/body.png';
            } else {
              if (this.getRotation(this.sequence[x].direction) < this.getRotation(this.sequence[x - 1].direction)) {
                snakeSegments[x].src = './public/main/images/snake/body_turning_right.png';
              } else {
                snakeSegments[x].src = './public/main/images/snake/body_turning_left.png';
              }
            }
          } else if (snakeSegments[x].src.includes('tail')) {
            snakeSegments[x].style.transform = `rotate(${this.getRotation(this.sequence[x - 1].direction)}deg)`;
          }
        }
      }
      if (Array.from(newCoordinate.children)[0].classList.contains('apple')) {
        this.eatApple();
      }
    } else {
      this.board.gameOver = true;
      this.board.updateBoard();
    }
  }

  eatApple() {
    this.board.removeApple(this.head.parentElement);
    let coordinates = Array.from(document.getElementsByClassName('square')).map((coordinate) => coordinate.id);
    let freeCoordinates = [];
    coordinates.forEach((coordinate) => {
      if (Array.from(document.getElementById(coordinate).children).length === 0) {
        freeCoordinates.push(coordinate);
      }
    });
    let randomCoordinate = freeCoordinates[Math.floor(Math.random() * freeCoordinates.length)];
    this.board.generateApple(randomCoordinate);
    this.board.score += 1;
    this.board.updateBoard();
  }
}

let utility = new Utility();

function main() {
  let board = new Game(17, 15);
  let snake = new Snake(board);

  let snakeMovement = () => {
    snake.move();

    if (board.gameOver) {
      clearInterval(snakeInterval);
    }
  };

  let snakeInterval = setInterval(snakeMovement, 200);

  document.addEventListener('keydown', (event) => {
    if (board.gameOver) return;

    let keyName = event.key;
    let validKeys = ['ArrowUp', 'w', 'ArrowRight', 'd', 'ArrowDown', 's', 'ArrowLeft', 'a'];
    if (!validKeys.includes(keyName)) return;

    let oldDirection = snake.direction;
    let newDirection = getKeyDirection(keyName);
    let oppositeDirection = {
      north: 'south',
      south: 'north',
      east: 'west',
      west: 'east',
    };

    if (newDirection !== oppositeDirection[oldDirection]) {
      snake.direction = newDirection;
    } else {
      return;
    }

    if (newDirection !== oldDirection) {
      snake.move();
      clearInterval(snakeInterval);
      snakeInterval = setInterval(snakeMovement, 200);
    }
  });
}

function getKeyDirection(keyName) {
  let direction;
  if (['ArrowUp', 'w'].includes(keyName)) {
    direction = 'north';
  } else if (['ArrowRight', 'd'].includes(keyName)) {
    direction = 'east';
  } else if (['ArrowDown', 's'].includes(keyName)) {
    direction = 'south';
  } else if (['ArrowLeft', 'a'].includes(keyName)) {
    direction = 'west';
  }
  return direction;
}

function updateSound() {
  let sound = document.getElementById('sound');
  let soundEnabled = JSON.parse(localStorage.getItem('sound')) ? true : false;
  localStorage.setItem('sound', !soundEnabled);

  if (soundEnabled) {
    sound.src = './public/main/images/others/volume_on.png';
  } else {
    sound.src = './public/main/images/others/volume_off.png';
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateSound()

    main();
});

const grid = document.getElementById('grid');

const fullscreenButton = document.getElementById('fullscreen');
fullscreenButton.addEventListener('click', (event) => {
  alert('Fullscreened');
});

const soundButton = document.getElementById('sound');
soundButton.addEventListener('click', (event) => {
    updateSound()
});

const closeButton = document.getElementById('close');
closeButton.addEventListener('click', (event) => {
  alert('Closed');
});

const gameContainer = document.getElementById('game-container');
gameContainer.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});