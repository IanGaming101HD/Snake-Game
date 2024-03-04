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

        for (let y = 1; y <= this.y; y++) {
            let row = document.createElement('div')

            row.classList.add('row')
            row.classList.add(`row-${y}`)
            
            game.appendChild(row)
            for (let x = 1; x <= this.x; x++) {
                createSquare(`${alphabet[y - 1]}${x}`, row)
            }
        }
    }

    getElement(coordinate) {
        // let coordinates = document.getElementsByClassName('square')
        // let element = coordinates.find((element) => elementcoordinate)
        return document.getElementById(coordinate)

        // this might be useless, remove if unnecessary
    }
}

class Snake {
    directions = ['north', 'east', 'south', 'west']

    constructor() {
        this.direction = 'east'
        this.length = 3
        this.createSnake()
    }

    createSnake() {
        let tail = document.createElement('img')
        let body = document.createElement('img')
        let head = document.createElement('img')

        // [tail, body, head].forEach((bodyPart) => {
        //     let bodyPartName = Object.keys(varObj)[0]

        //     tail.src = `./images/snake/${bodyPartName}.png`
        // }) tryna be extra, remove this if unnecessary

        tail.src = './images/snake/tail.png'
        body.src = './images/snake/body.png'
        head.src = './images/snake/head.png'
        
        tail.classList.add('body-part')
        body.classList.add('body-part')
        head.classList.add('body-part')

        document.getElementById('g2').appendChild(tail)
        document.getElementById('g3').appendChild(body)
        document.getElementById('g4').appendChild(head)
    }

    north() {

    }

    east() {

    }

    south() {

    }

    west() {

    }

    move() {
        this.direction
    }
}

function main() {
    document.getElementById('score').innerText = '0'
    document.getElementById('high-score').innerText = '0'
    
    let board = new Board(17, 15)
    let snake = new Snake()

    setInterval(async () => {
        snake.move()
    }, 1000)
}

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

main()