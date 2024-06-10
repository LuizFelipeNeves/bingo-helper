const matchPositions = [
    // 1 PART
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],

    // 2 PART
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
]

const DiagonalPositions = [
    // 3 PART
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]
]

const userboard = document.getElementById('playerBoard')
const cpuBoard = document.getElementById('cpuBoard')
const totalNumbers = document.getElementById('totalNumbers')
const newRound = document.getElementById('novaRodada')
const saveCartela = document.getElementById('saveCartela')
const resetCartela = document.getElementById('resetCartela')
const saveNum = document.getElementById('saveNum')
const bestCard = document.getElementById('bestCard')

document.getElementById('changeColor').onclick = () => {
    console.log('change color')
    document.getElementById('add-cart').style = 'background-color: red;'
}

/*
[10, 21, 37, 46, 68, 11, 16,  41, 48, 67, 8, 23, 56, 72, 12, 24, 39, 54, 66, 9, 25, 40, 58 ].map(n => {
    balls.splice(balls.indexOf(n), 1)
    checkWinner(n)
})*/

let quinaRounds = 1

// Creo el array con todos los numeros del 1 al 99, ya que son las bolas que pueden salir
let balls = []

resetBalls()

function resetBalls() {
    balls = []
    for (let i = 1; i <= 75; i++) {
        balls.push(i)
    }
}

for (let i = 0; i < 25; i++) {
    const isBingo = i === 12
    userboard.innerHTML += `<div class="numero-contenedor__child${isBingo ? ' bingo' : ''}" id='userNum${i}'>
        ${isBingo ? 'BINGO' : `<input type="number" name="quantity" min="1" max="75" id='input-card-${i}'>`}
    </div>`
}

function renderBestCard(cardId, numbers) {
    cpuBoard.innerHTML = ''
    for (let i = 0; i < 25; i++) {
        const isBingo = i === 12
        if (bestCard.classList.contains('hidden')) {
            bestCard.classList.remove('hidden')
        }
        const includesNum = !balls.includes(numbers[i])

        document.getElementById('cpuName').innerHTML = `Cartela ${cardId}`
        cpuBoard.innerHTML += `<div class="numero-contenedor__child${isBingo ? ' bingo' : ''}"" id='cpuNum${i}' ${includesNum && 'style="background-color: green;"'}>${numbers[i]}</div>`
    }
}

function saveCartelaAction() {
    let numbs = []

    const cardId = document.getElementById('player').value

    for (let index = 0; index < 25; index++) {
        const field = `input-card-${index}`

        if (index !== 12) {
            const valueInput = document.getElementById(field).value
            const currentNum = valueInput ? parseInt(valueInput) : 0
            numbs.push(currentNum)
        }
        else numbs.push('bingo')
    }

    const storageNumbsJSON = getStorageJson('cards')
    const cards = storageNumbsJSON?.cards || []
    const newItem = { id: cardId, numbers: numbs }
    saveStorageJSON('cards', { cards: [...cards, newItem] })
    alert('Cartela salva!')
}

function novaRodada() {
    totalNumbers.innerHTML = ''
    quinaRounds = 1


    for (let i = 0; i < 25; i++) {
        document.getElementById(`cpuNum${i}`).style.backgroundColor = 'white'
    }

    resetBalls()
}


function getStorageJson(key) {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch (error) {
        return {}
    }
}


function saveStorageJSON(key, params) {
    localStorage.setItem(key, JSON.stringify(params))
}

newRound.addEventListener('click', novaRodada)
saveNum.addEventListener('click', randomNumberDraw)

resetCartela.addEventListener('click', () => saveStorageJSON('cards', { cards: [] }))
saveCartela.addEventListener('click', saveCartelaAction)

function randomNumberDraw() {
    let randomNumber = document.getElementById('numberDraw').value
    randomNumber = parseInt(randomNumber)

    balls.splice(balls.indexOf(randomNumber), 1)

    const audio = new Audio('song.mp3');
    audio.play()

    totalNumbers.innerHTML += `<div class="numero-obtenido">${randomNumber}</div>`

    setTimeout(checkWinner(randomNumber), 500)
}

function checkWinner(randomNumber) {
    const currentCards = getStorageJson('cards').cards || []
    if (currentCards.length) {
        let usersMatchs = currentCards.map(p => ({ id: p.id, numbers: p.numbers, positions: matchPositions.map(pa => pa.map(paa => p.numbers[paa])) }))

        for (const cpuMatchs of usersMatchs) {
            renderBestCard(cpuMatchs.id, cpuMatchs.numbers)

            const currentCPU = cpuMatchs.positions.filter(pa => pa.includes(randomNumber) && !pa.some(x => balls.find(b => b === x)))
            if (quinaRounds > 0) {
                if (currentCPU.length) {
                    quinaRounds--
                    // renderBestCard(cpuMatchs.id, cpuMatchs.numbers)
                    alert(`${randomNumber} - CPU ${JSON.stringify(currentCPU)}`)
                    const audio = new Audio('win.mp3');
                    audio.play()
                }
            }
           
            const hasAll = cpuMatchs.positions.every(pa => !pa.some(x => balls.find(b => b === x)))
            if (hasAll) {
                const audio = new Audio('win.mp3');
                audio.play()
                alert('Cartela completa! parabéns!')
            }
        }
    }
}

function gerarCartela() {
    const arr = [];
    while (arr.length < 24) {
        const randomNumber = balls[Math.floor(Math.random() * balls.length)]
        isInArray = arr.includes(randomNumber)
        if (!isInArray) {
            arr.push(randomNumber)
        }
    }

    arr.sort((a, b) => a - b)
    arr.splice(12, 0, 'BINGO')
    return arr
}