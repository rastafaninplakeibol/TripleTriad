let $ = require('jquery')

let yogiUrl = './yogi.jpg'
let harambeUrl = './harambe.jpg'
let player1Hand = []
let player2Hand = []

let pg1 = 5
let pg2 = 5


class Card {
    constructor(up, down, left, right, opt) {
        this.up = up
        this.down = down
        this.left = left
        this.right = right
        this.player = null
        if (opt.url) this.url = opt.url
        if (opt.element) this.element = opt.element
    }
}

/**
 * 
 * @param {Card} card 
 */
function createCard(card) {
    let htmlCard = document.createElement('div')
    let upRow = document.createElement('div')
    let upText = document.createElement('div')

    let midRow = document.createElement('div')
    let leftCol = document.createElement('div')
    let middleCol = document.createElement('div')
    let rightCol = document.createElement('div')

    let downRow = document.createElement('div')
    let downText = document.createElement('div')

    htmlCard.classList.add('card')

    upRow.classList.add('row', 'card-row')
    upText.classList.add('single-col')
    upText.innerText = `${card.up}`
    upRow.appendChild(upText)

    midRow.classList.add('row', 'card-row')
    midRow.style.height = '128px'
    midRow.style.width = '180px'

    leftCol.classList.add('lateral-col', 'h-100')
    leftCol.innerText = `${card.left}`

    rightCol.classList.add('lateral-col', 'h-100')
    rightCol.innerText = `${card.right}`

    middleCol.classList.add('card-img')
    middleCol.style.backgroundImage = `url(${card.url})`

    midRow.appendChild(leftCol)
    midRow.appendChild(middleCol)
    midRow.appendChild(rightCol)

    downRow.classList.add('row', 'card-row')
    downText.classList.add('single-col')
    downText.innerText = `${card.down}`
    downRow.appendChild(downText)

    htmlCard.appendChild(upRow)
    htmlCard.appendChild(midRow)
    htmlCard.appendChild(downRow)
    //$('#table').append(htmlCard)
    return htmlCard
}

/**
 * 
 * @param {number} i 
 * @param {number} j 
 * @param {Card} card 
 */
function insertCard(i, j, card) {
    $(`#cs${i}${j}`).append(createCard(card))
}

/**
 * 
 * @param {String} elemId 
 */
function checkRibaltamento(elemId, tableSlotId) {
    console.log(elemId)
    let playerId = parseInt(elemId.charAt(1))
    let position = parseInt(elemId.charAt(elemId.length - 1))

    let tableSlot = document.getElementById(tableSlotId)

    let card = null

    if (playerId == 1) card = player1Hand[position]
    else card = player2Hand[position]

    let riga = parseInt(tableSlot.id.charAt(tableSlot.id.length - 2))
    let colonna = parseInt(tableSlot.id.charAt(tableSlot.id.length - 1))

    if (checkBounds(riga, colonna + 1) && existCardNear(riga, colonna + 1)) ribalta(card, playerId, riga, colonna + 1, 'left')
    if (checkBounds(riga, colonna - 1) && existCardNear(riga, colonna - 1)) ribalta(card, playerId, riga, colonna - 1, 'right')
    if (checkBounds(riga + 1, colonna) && existCardNear(riga + 1, colonna)) ribalta(card, playerId, riga + 1, colonna, 'up')
    if (checkBounds(riga - 1, colonna) && existCardNear(riga - 1, colonna)) ribalta(card, playerId, riga - 1, colonna, 'down')
}
function checkBounds(i, j) {
    return (i >= 0 && i <= 2 && j >= 0 && j <= 2)
}
function existCardNear(i, j) {
    return (document.getElementById(`cs${i}${j}`).childElementCount != 0)

}
function ribalta(card, playerId, riga, colonna, direction) {
    let htmlNearCard = document.getElementById(`cs${riga}${colonna}`).childNodes[0]
    let playId = (htmlNearCard.classList.contains('player-1') ? 1 : 2)
    if (playId != playerId) {
        let pos = parseInt(htmlNearCard.id.charAt(htmlNearCard.id.length - 1))
        let nearCard = (playId == 1 ? player1Hand[pos] : player2Hand[pos])
        let condition = false
        if (direction === 'up') condition = card.down > nearCard.up
        else if (direction === 'down') condition = card.up > nearCard.down
        else if (direction === 'left') condition = card.right > nearCard.left
        else if (direction === 'right') condition = card.left > nearCard.right
        console.log(`c: ${condition}, player: ${playerId} , vicino : ${playId}, dir: ${direction}`)
        if (condition) {
            if (playerId == 1) {
                pg1++
                pg2--
                $('#pg1').text(`${pg1}`)
                $('#pg2').text(`${pg2}`)
                htmlNearCard.classList.remove('player-2')
                htmlNearCard.classList.add('player-1')
            }
            else {
                pg1--
                pg2++
                $('#pg1').text(`${pg1}`)
                $('#pg2').text(`${pg2}`)
                htmlNearCard.classList.remove('player-1')
                htmlNearCard.classList.add('player-2')
            }
        }
    }
}

/**
 * 
 * @param {number} playerId 
 * @param {Card} card 
 */
function insertInHand(playerId, card) {
    let position = 0;
    let htmlCard = createCard(card)
    //makeDraggable(htmlCard)
    if (playerId == 1) {
        card.player = 1
        player1Hand.push(card)
        position = player1Hand.length - 1
        htmlCard.id = `g${playerId}ch${position}`
        htmlCard.classList.add('player-1')
    }
    else {
        card.player = 2
        player2Hand.push(card)
        position = player2Hand.length - 1
        htmlCard.id = `g${playerId}ch${position}`
        htmlCard.classList.add('player-2')
    }
    $(`#g${playerId}c${position}`).append(htmlCard)
}


$(document).ready(() => {
    let m0 = {
        a0: new Card(1, 1, 5, 4, { url: yogiUrl }),
        a1: new Card(5, 1, 3, 1, { url: yogiUrl }),
        a2: new Card(1, 3, 5, 3, { url: yogiUrl }),
        a3: new Card(6, 1, 2, 1, { url: yogiUrl }),
        a4: new Card(2, 1, 5, 3, { url: yogiUrl }),
        a5: new Card(2, 4, 4, 1, { url: yogiUrl }),
        a6: new Card(1, 4, 1, 5, { url: yogiUrl }),
        a7: new Card(3, 2, 1, 5, { url: yogiUrl }),
        a8: new Card(2, 6, 1, 1, { url: yogiUrl }),
        a9: new Card(4, 4, 3, 2, { url: yogiUrl }),
        a10: new Card(2, 2, 6, 1, { url: yogiUrl })
    }

    let m1 = {
        harambe0: new Card(7, 3, 1, 1, { url: harambeUrl }),
        harambe1: new Card(6, 2, 3, 2, { url: harambeUrl }),
        harambe2: new Card(5, 3, 4, 3, { url: harambeUrl }),
        harambe3: new Card(6, 4, 3, 1, { url: harambeUrl }),
        harambe4: new Card(3, 5, 3, 4, { url: harambeUrl }),
        harambe5: new Card(5, 2, 5, 3, { url: harambeUrl }),
        harambe6: new Card(5, 3, 5, 1, { url: harambeUrl }),
        harambe7: new Card(5, 5, 2, 2, { url: harambeUrl }),
        harambe8: new Card(4, 5, 2, 4, { url: harambeUrl }),
        harambe9: new Card(3, 1, 7, 2, { url: harambeUrl }),
        harambe10: new Card(5, 5, 3, 2, { url: harambeUrl })
    }



    let taken = []
    count = 10
    for (; count > 0;) {
        let gioc = count % 2 == 0? 1:2
        let n = Math.floor(Math.random() * 11)
        let m = Math.floor(Math.random() * 2)
        if (!taken.includes(`${m}${n}`)) {
            taken.push(`${m}${n}`)
            count--
            if (m == 0) insertInHand(gioc,m0[`a${n}`])
            else insertInHand(gioc,m1[`harambe${n}`])
        }
    }

    if(Math.floor(Math.random() * 2) == 0) alert('Inizia gg1')
    else alert('Inizia gg2')
    /*insertInHand(1, a0)
    insertInHand(1, a1)
    insertInHand(1, a2)
    insertInHand(1, a3)
    insertInHand(1, a4)
    insertInHand(2, harambe0)
    insertInHand(2, harambe1)
    insertInHand(2, harambe2)
    insertInHand(2, harambe3)
    insertInHand(2, harambe4)*/

})
