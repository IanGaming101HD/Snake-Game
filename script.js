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
    this.high_score = localStorage.getItem('high-score') ? localStorage.getItem('high-score') : 0;
    this.gameOver = false;
    this.x = x ? x : 17;
    this.y = y ? y : 15;
    this.snake;
    this.createBoard();
  }

  startGame() {
    this.snake = new Snake(this);
    this.snake.createDefaultSnake();

    this.generateFruit('m8');
  }

  resetGame() {
    let grid = document.getElementById('grid');
    let fruits = Array.from(grid.getElementsByClassName('fruit'));
    fruits.forEach((fruit) => {
      fruit.remove();
    });

    this.score = 0;
    this.gameOver = false;
    this.snake.remove();
    this.startGame();
  }

  initEvents() {
    let snakeMovement = () => {
      this.snake.move();

      if (this.gameOver) {
        clearInterval(snakeInterval);
      }
    };

    let msDelay = 200;
    let snakeInterval = setInterval(snakeMovement, msDelay);

    document.addEventListener('keydown', (event) => {
      if (this.gameOver) return;

      let keyName = event.key;
      let validKeys = ['arrowup', 'w', 'arrowright', 'd', 'arrowdown', 's', 'arrowleft', 'a'];
      if (!validKeys.includes(keyName.toLowerCase())) return;

      let oldDirection = this.snake.direction;
      let newDirection = getKeyDirection(keyName);
      let oppositeDirection = {
        north: 'south',
        south: 'north',
        east: 'west',
        west: 'east',
      };

      if (newDirection !== oppositeDirection[oldDirection]) {
        this.snake.direction = newDirection;
      } else {
        return;
      }

      if (newDirection !== oldDirection) {
        this.snake.move();
        clearInterval(snakeInterval);
        snakeInterval = setInterval(snakeMovement, msDelay);
      }
    });
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

    let highScores = Array.from(document.getElementsByClassName('high-score'));
    highScores.forEach((highScore) => {
      highScore.innerHTML = this.high_score;
    });
  }

  updateBoard() {
    let scores = Array.from(document.getElementsByClassName('score'));
    scores.forEach((score) => {
      score.innerHTML = this.score;
    });

    if (this.gameOver) {
      this.high_score = this.score > this.high_score ? this.score : this.high_score;
      localStorage.setItem('high-score', this.high_score);

      let highScores = Array.from(document.getElementsByClassName('high-score'));
      highScores.forEach((highScore) => {
        highScore.innerHTML = this.high_score;
      });

      let menu = document.getElementById('menu');
      menu.style.visibility = 'visible';
    }
  }

  generateFruit(coordinate) {
    let element = document.createElement('img');
    element.src = './images/fruits/apple.png';
    element.classList.add('fruit');
    document.getElementById(coordinate).appendChild(element);
    return element;
  }

  removeFruit(coordinate) {
    let element = Array.from(coordinate.children).find((child) => child.classList.contains('fruit'));
    element.remove();
  }
}

class Snake {
  constructor(game) {
    this.game = game;
    this.previousDirection = 'east';
    this.direction = this.previousDirection;
    this.length = 0;
    this.sequence = [];
    this.utility = new Utility();
  }

  createDefaultSnake() {
    this.createSegment('head', 'd8');
    this.createSegment('body', 'c8');
    this.createSegment('tail', 'b8');

    let snakeSegments = Array.from(document.getElementsByClassName('snake')).sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
    snakeSegments.forEach((value, index) => {
      this.sequence.push({
        coordinate: value.parentElement,
        direction: this.direction,
      });
    });
  }

  createSegment(type, coordinate) {
    this.length += 1;

    let element = document.createElement('img');
    element.id = `snake-segment-${this.length}`;
    element.src = `./images/snake/${type}.png`;
    element.classList.add('snake');
    document.getElementById(coordinate).appendChild(element);

    if (type === 'head') {
      this.head = element;
    }
    return element;
  }

  addBody() {
    let snakeSegments = Array.from(document.getElementsByClassName('snake')).sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
    snakeSegments[this.length - 1].src = `./images/snake/body.png`;

    this.createSegment('tail', this.sequence[this.length - 2].coordinate.id);
  }

  convertToCoordinate(string) {
    return [string[0], string.slice(1)];
  }

  north(coordinate) {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) return null;
    return coordinate[0] + this.utility.decrement(coordinate[1]);
  }

  east(coordinate) {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) return null;
    return this.utility.increment(coordinate[0]) + coordinate[1];
  }

  south(coordinate) {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) return null;
    return coordinate[0] + this.utility.increment(coordinate[1]);
  }

  west(coordinate) {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) return null;
    return this.utility.decrement(coordinate[0]) + coordinate[1];
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
    let snakeSegments = [...document.getElementsByClassName('snake')].sort((a, b) => a.id.localeCompare(b.id));
    let head = document.getElementById('snake-segment-1');
    let newCoordinate = document.getElementById(this[this.direction](this.convertToCoordinate(head.parentElement.id)));

    let canMove = newCoordinate && (!newCoordinate.children.length || newCoordinate.firstElementChild.classList.contains('fruit'));
    if (!canMove) {
      this.game.gameOver = true;
      this.game.updateBoard();
      return;
    }

    newCoordinate.appendChild(head);
    this.sequence.unshift({ direction: this.direction, coordinate: newCoordinate });

    if (this.direction !== this.previousDirection) {
      head.style.transform = `rotate(${this.getRotation(this.direction)}deg)`;
      this.previousDirection = this.direction;
    }

    snakeSegments.forEach((segment, i) => {
      let currentDirection = this.sequence[i].direction;
      let upcomingDirection = this.sequence[i - 1]?.direction;
      let rotation = this.getRotation(currentDirection);

      if (segment.src.includes('body')) {
        if (currentDirection !== upcomingDirection) {
          let turnsLeft = [
            ['north', 'west'],
            ['west', 'south'],
            ['south', 'east'],
            ['east', 'north'],
          ];
          segment.src = turnsLeft.some((turn) => turn.every((v, i) => [currentDirection, upcomingDirection][i] === v)) ? './images/snake/body_turning_left.png' : './images/snake/body_turning_right.png';
        } else {
          segment.src = './images/snake/body.png';
        }
      } else if (segment.src.includes('tail')) {
        rotation = this.getRotation(upcomingDirection);
      }

      segment.style.transform = `rotate(${rotation}deg)`;
      this.sequence[i].coordinate.appendChild(segment);
    });

    if (newCoordinate.firstElementChild?.classList.contains('fruit')) {
      this.eatFruit();
    }
  }

  eatFruit() {
    let coordinate = this.head.parentElement;
    this.game.removeFruit(coordinate);

    let coordinates = Array.from(document.getElementsByClassName('square')).map((coordinate) => coordinate.id);
    let freeCoordinates = coordinates.filter((coordinate) => Array.from(document.getElementById(coordinate).children).length === 0);
    let randomCoordinate = freeCoordinates[Math.floor(Math.random() * freeCoordinates.length)];

    this.game.score += 1;
    this.game.updateBoard();
    this.addBody();
    this.game.generateFruit(randomCoordinate);
  }

  remove() {
    let snakeSegments = [...document.getElementsByClassName('snake')];
    snakeSegments.forEach((snakeSegment) => {
      snakeSegment.remove();
    });
  }
}

function getKeyDirection(keyName) {
  let direction;
  if (['ArrowUp', 'w'].includes(keyName.toLowerCase())) {
    direction = 'north';
  } else if (['ArrowRight', 'd'].includes(keyName.toLowerCase())) {
    direction = 'east';
  } else if (['ArrowDown', 's'].includes(keyName.toLowerCase())) {
    direction = 'south';
  } else if (['ArrowLeft', 'a'].includes(keyName.toLowerCase())) {
    direction = 'west';
  }
  return direction;
}

function updateSound() {
  let sound = document.getElementById('sound-button');
  let soundEnabled = JSON.parse(localStorage.getItem('sound')) ? true : false;
  localStorage.setItem('sound', !soundEnabled);

  if (soundEnabled) {
    sound.src = './images/other/volume_on.png';
  } else {
    sound.src = './images/other/volume_off.png';
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  let game = new Game();
  game.startGame();

  let fullscreenButton = document.getElementById('fullscreen-button');
  fullscreenButton.addEventListener('click', (event) => {
    alert('Fullscreened');
  });

  let soundButton = document.getElementById('sound-button');
  soundButton.addEventListener('click', (event) => {
    updateSound();
  });

  let closeButton = document.getElementById('close-button');
  closeButton.addEventListener('click', (event) => {
    alert('Closed');
  });

  let gameContainer = document.getElementById('game-container');
  gameContainer.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  let playButton = document.getElementById('play-button');
  playButton.addEventListener('click', (event) => {
    game.resetGame();

    let menu = document.getElementById('menu');
    menu.style.visibility = 'hidden';

    let handleKeyDown = (event) => {
      let { key } = event;
      let directions = { north: 'south', south: 'north', east: 'west', west: 'east' };

      if (!['arrowup', 'w', 'arrowright', 'd', 'arrowdown', 's'].includes(key.toLowerCase())) return;

      let newDirection = getKeyDirection(key);
      if (newDirection === directions[game.snake.direction]) return;

      document.getElementById('key-tip').style.visibility = 'hidden';
      game.snake.move();
      game.snake.direction = newDirection;
      game.initEvents();

      document.removeEventListener('keydown', handleKeyDown);
    };

    document.addEventListener('keydown', handleKeyDown);
  });
  updateSound();
});
