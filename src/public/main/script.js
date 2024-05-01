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
        this.gameOver = false
        this.x = x
        this.y = y
        this.squareType = Board.squareType
        this.createBoard()
        this.generateApple('m8')
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

    updateBoard() {
        let score = document.getElementById('score')
        let highScore = document.getElementById('high-score')
        score.innerText = this.score
        highScore.innerText = this.high_score
        
        if (this.gameOver) {
            let newHighScore = this.score > this.high_score ? this.score : this.high_score
            highScore.innerText = newHighScore
            sessionStorage.setItem('high-score', newHighScore)
            console.log('Game Over!')
        }
    }

    generateApple(coordinate) {
        let element = document.createElement('img')
        element.src = './images/fruits/apple.png'
        element.classList.add('apple') // remove this maybe, prob not needed
        document.getElementById(coordinate).appendChild(element)
        return element
    }

    removeApple(coordinate) {
        let element = coordinate.getElementsByClassName('apple')[0]
        element.remove()
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
        this.createHead('d8')
        this.createBody('c8')
        this.createTail('b8')

        let snakeSegments = Array.from(document.getElementsByClassName('snake-segment')).reverse()
        snakeSegments.forEach((value, index) => {
            snakeSegments[index].classList.add(`snake-segment-${index + 1}`)
            this.sequence[value.parentNode.id] = `snake-segment-${snakeSegments.indexOf(value) + 1}`
            this.sequence.push({ coordinate: value.parentElement.id, direction: this.direction })
        })
    }

    createHead(coordinate) {
        let element = document.createElement('img')
        element.src = './images/snake/head.png'
        element.classList.add('head') // remove this maybe, prob not needed
        element.classList.add('snake')
        element.classList.add('snake-segment')
        document.getElementById(coordinate).appendChild(element)
        this.head = element
        return element
    }

    createBody(coordinate) {
        let element = document.createElement('img')
        element.src = './images/snake/body.png'
        element.classList.add('snake')
        element.classList.add('snake-segment')
        document.getElementById(coordinate).appendChild(element)
        return element
    }

    createTail(coordinate) {
        let element = document.createElement('img')
        element.src = './images/snake/tail.png'
        element.classList.add('snake')
        element.classList.add('snake-segment')
        document.getElementById(coordinate).appendChild(element)
        return element
    }

    replaceBody(coordinate, direction) {
        let element = document.getElementById(coordinate)
    }

    replaceBody(coordinate, direction) {
        let element = document.getElementById(coordinate)
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
        return Object.values(snakeSegments).find((value) => `snake-segment-${snakeSegments.reverse().indexOf(value) + 1}` == segmentName)
    }

    move() {
        let snakeSegments = Array.from(document.getElementsByClassName('snake-segment')).sort()
        let head = document.getElementsByClassName('head')[0]
        let newCoordinate = document.getElementById(this[this.direction](this.convertToCoordinate(head.parentElement.id)))

        if (this.direction !== this.previousDirection) {
            let rotation = this.rotate(this.direction)
            document.getElementsByClassName('head')[0].style.transform = `rotate(${rotation}deg)`
            this.previousDirection = this.direction
        }

        if (newCoordinate && (newCoordinate.children.length == 0 || Array.from(newCoordinate.children)[0].classList.contains('apple'))) {
            newCoordinate.appendChild(head)
            this.sequence.unshift({ coordinate: newCoordinate, direction: this.direction })
            console.log(this.sequence)
            // this.sequence[newCoordinate.id] = ''
            // this.sequence = shiftValuesDown(this.sequence)

            // Object.keys(this.sequence).forEach((key) => {
            //     if (this.sequence[key] !== '') {
            //         document.getElementById(key).appendChild(this.getSegment(this.sequence[key]))
            //     }
            // })
            if (Array.from(newCoordinate.children)[0].classList.contains('apple')) {
                this.eatApple()
            }
        } else {
            // game over, loss, made contact with wall or itself
            alert('Game over!')
            this.board.gameOver = true
        }
    }

    eatApple() {
        this.board.removeApple(this.head.parentElement)
        let coordinates = Array.from(document.getElementsByClassName('square')).map((coordinate) => coordinate.id)
        let freeCoordinates = []
        coordinates.forEach((coordinate) => {
            if (Array.from(document.getElementById(coordinate).children).length === 0) {
                freeCoordinates.push(coordinate)
            }
        })
        let randomCoordinate = freeCoordinates[Math.floor(Math.random() * freeCoordinates.length)]
        this.board.generateApple(randomCoordinate)
        this.board.score += 1
        this.board.updateBoard()
    }
}

function shiftValuesDown(object) {
    let keys = Object.keys(object);
    let temp = '';
    let newObject = {};

    for (let i = 0; i < keys.length; i++) {
        let currentValue = object[keys[i]];
        newObject[keys[i]] = temp;
        temp = currentValue;
    }

    return newObject;
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

    let snakeInterval = setInterval(snakeMovement, 200)

    document.addEventListener('keydown', (event) => {
        if (board.gameOver) return;

        let keyName = event.key;
        let validKeys = ['ArrowUp', 'w', 'ArrowRight', 'd', 'ArrowDown', 's', 'ArrowLeft', 'a']
        if (!validKeys.includes(keyName)) return;

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
            snakeInterval = setInterval(snakeMovement, 200)
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