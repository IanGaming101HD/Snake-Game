const gameContainer = document.getElementById('game-container')
const game = document.getElementById('game')
const fullscreenButton = document.getElementById('fullscreen')
const soundButton = document.getElementById('sound')
const closeButton = document.getElementById('close')
soundEnabled = true

class Board {
    constructor(x, y) {
        this.score = 0
        this.high_score = 0
        this.x = x
        this.y = y
        this.squareType = Board.squareType
        this.createBoard()
        this.gameOver = false
    }

    createBoard() {
        let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        let squareType = 'light-square'

        function createSquare(id, row) {
            let element = document.createElement('div')

            element.id = id
            element.classList.add('square')

            if (squareType === 'light-square') {
                element.classList.add('light-square')
                squareType = 'dark-square'
            } else if (squareType === 'dark-square') {
                element.classList.add('dark-square')
                squareType = 'light-square'
            }
            row.appendChild(element)
        }

        for (let x = 0; x < this.x; x++) {
            for (let y = 1; y <= this.y; y++) {
                if (x === 0) {
                    let row = document.createElement('div');
                    row.classList.add('row');
                    row.classList.add(`row-${y}`);
                    game.appendChild(row);
                }
                let currentRow = document.querySelector(`.row-${y}`);
                createSquare(`${alphabet[x]}${y}`, currentRow);
            }
        }
    }
}

class Snake {
    constructor(board) {
        this.board = board
        this.previousDirection = 'east'
        this.direction = this.previousDirection
        this.length = 3
        this.sequence = []
        this.createSnake()
    }

    createSnake() {
        let tail = document.createElement('img')
        let body = document.createElement('img')
        let head = document.createElement('img')

        tail.src = './images/snake/tail.png'
        body.src = './images/snake/body.png'
        head.src = './images/snake/head.png'

        head.classList.add('head')
        head.classList.add('snake-segment')
        body.classList.add('snake-segment')
        tail.classList.add('snake-segment')

        document.getElementById('b8').appendChild(tail)
        document.getElementById('c8').appendChild(body)
        document.getElementById('d8').appendChild(head)

        let snakeSegments = Array.from(document.getElementsByClassName('snake-segment'))
        snakeSegments.forEach((value) => {
            this.sequence.push({
                [value.parentNode.id]: `snake-segment-${snakeSegments.reverse().indexOf(value) + 1}`
            })
        })
    }

    convertToCoordinate(string) {
        return [string[0], string.slice(1)]
    }

    north(coordinate) {
        if (!Array.isArray(coordinate) || coordinate.length !== 2) return null
        return coordinate[0] + functions.decrement(coordinate[1])
    }

    east(coordinate) {
        if (!Array.isArray(coordinate) || coordinate.length !== 2) return null
        return functions.increment(coordinate[0]) + coordinate[1]
    }

    south(coordinate) {
        if (!Array.isArray(coordinate) || coordinate.length !== 2) return null
        return coordinate[0] + functions.increment(coordinate[1])
    }

    west(coordinate) {
        if (!Array.isArray(coordinate) || coordinate.length !== 2) return null
        return functions.decrement(coordinate[0]) + coordinate[1]
    }

    rotate(newDirection) {
        let rotations = {
            'north': 270,
            'east': 0,
            'south': 90,
            'west': 180
        };
        return rotations[newDirection];
    }

    getSegment(segmentName) {
        let snakeSegments = Array.from(document.getElementsByClassName('snake-segment'))
        return snakeSegments.find((value) => `snake-segment-${snakeSegments.reverse().indexOf(value) + 1}` == segmentName)
    }

    move() {
        let snakeSegments = Array.from(document.getElementsByClassName('snake-segment'))
        let head = document.getElementsByClassName('head')[0]
        let newCoordinate = document.getElementById(this[this.direction](this.convertToCoordinate(head.parentElement.id)))

        if (this.direction !== this.previousDirection) {
            let rotation = this.rotate(this.direction)
            document.getElementsByClassName('head')[0].style.transform = `rotate(${rotation}deg)`
            this.previousDirection = this.direction
        }

        if (newCoordinate && newCoordinate.children.length == 0) {
            newCoordinate.appendChild(head)
            this.sequence.push({
                [newCoordinate.id]: ''
            })
            this.sequence = shiftValuesDown(this.sequence)
            
            Object.values(this.sequence).forEach((object) => {
                let key = Object.keys(object)[0]
                if (this.sequence[key] !== '') {
                    console.log(object)
                    console.log(this.getSegment(this.sequence[key]))
                    document.getElementById(key).appendChild(this.getSegment(this.sequence[key]))
                }
            })
        } else {
            // game over, loss, made contact with wall or itself
            alert('Game over!')
            this.board.gameOver = true
        }
    }
}

function shiftValuesDown(array) {
    let temp = '';
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
      const currentValue = Object.values(array[i])[0];
      newArray.push({ [Object.keys(array[i])[0]]: temp });
      temp = currentValue;
    }
    return newArray;
}

class Functions {
    constructor() {
        this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'y', 'z'];
    }

    increment(value) {
        if (this.letters.includes(value)) {
            value = this.letters[this.letters.indexOf(value.toLowerCase()) + 1]
            if (!value) {
                value = this.letters[0]
            }
            return value
        } else {
            value++
            return value
        }
    }

    decrement(value) {
        if (this.letters.includes(value)) {
            value = this.letters[this.letters.indexOf(value.toLowerCase()) - 1]
            if (!value) {
                value = this.letters[this.letters.length - 1]
            }
            return value
        } else {
            value--
            return value
        }
    }
}

let functions = new Functions()

function main() {
    document.getElementById('score').innerText = '0'
    document.getElementById('high-score').innerText = '0'

    let board = new Board(17, 15)
    let snake = new Snake(board)

    fullscreenButton.addEventListener('click', (event) => {
        alert('Fullscreened')
    })

    soundButton.addEventListener('click', (event) => {
        soundEnabled = !soundEnabled

        if (soundEnabled) {
            document.getElementById('sound').src = './images/others/volume_on.png'
        } else {
            document.getElementById('sound').src = '/images/others/volume_off.png'
        }
    })

    closeButton.addEventListener('click', (event) => {
        alert('Closed')
    })

    gameContainer.addEventListener('contextmenu', (event) => {
        // event.preventDefault()
    });

    let snakeMovement = () => {
        snake.move()

        if (board.gameOver) {
            clearInterval(snakeInterval)
        }
    }

    let snakeInterval = setInterval(snakeMovement, 5000)

    document.addEventListener('keydown', (event) => {
        if (board.gameOver) return;

        let keyName = event.key;
        let oldDirection = snake.direction;
        let newDirection = getKeyDirection(keyName)
        let oppositeDirection = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        };

        if (newDirection !== oppositeDirection[oldDirection]) {
            snake.direction = newDirection
        } else {
            return;
        }

        if (newDirection !== oldDirection) {
            snake.move()
            clearInterval(snakeInterval)
            snakeInterval = setInterval(snakeMovement, 5000)
        }
    })
}

function getKeyDirection(keyName) {
    let direction;
    if (['ArrowUp', 'w'].includes(keyName)) {
        direction = 'north'
    } else if (['ArrowRight', 'd'].includes(keyName)) {
        direction = 'east'
    } else if (['ArrowDown', 's'].includes(keyName)) {
        direction = 'south'
    } else if (['ArrowLeft', 'a'].includes(keyName)) {
        direction = 'west'
    }
    return direction
}

main()