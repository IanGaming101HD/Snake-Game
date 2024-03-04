const gameContainer = document.getElementById('game-container')
const game = document.getElementById('game')
const soundButton = document.getElementById('sound')
const closeButton = document.getElementById('close')

document.getElementById('score').innerText = '0'
document.getElementById('high-score').innerText = '0'

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
}

function main() {
    let board = new Board(17, 15)
}

soundButton.addEventListener('click', (event) => {

})

closeButton.addEventListener('click', (event) => {
    
})

gameContainer.addEventListener('contextmenu', (event) => {
    // event.preventDefault()
});

main()