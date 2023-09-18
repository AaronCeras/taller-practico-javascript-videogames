/**
 * @type {HTMLCanvasElement}
 */

const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let mapRowCols;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

let enemyPosition = [];

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);

function setCanvasSize() {

    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    startGame();
}

function startGame() {
    console.log({canvasSize, elementsSize});

    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if(!map) {
        gameWin();
        return;
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    mapRowCols = mapRows.map(row => row.trim().split(''));

    showLives();

    enemyPosition = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = (elementsSize * (colI + 1)) + (elementsSize / 5);
            const posY = (elementsSize * (rowI + 1)) - (elementsSize / 5);

            if(col == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log({playerPosition});
                }
            } else if(col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if(col == 'X') {
                enemyPosition.push({
                    x: posX,
                    y: posY,
                })
            }

            game.fillText(emoji, posX, posY);
        })
    });

    // for(let row = 1; row <= 10; row++) {
    //     for(let col = 1; col <= 10; col++) {
    //         const simbol = mapRowCols[row-1][col-1];
    //         const emoji = emojis[simbol];

    //         game.fillText(emoji, (elementsSize * col) + (elementsSize / 5), (elementsSize *row)-(elementsSize / 5));
    //     }
    // }

    movePlayer();
}

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
    const giftCollisionY = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
    const giftCollision = giftCollisionX && giftCollisionY;

    if(giftCollision) {
        levelUp();
    }

    const enemyCollision = enemyPosition.find(enemy => {
        const enemyCollisionX =  enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
        const enemyCollisionY =  enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
        return enemyCollisionX && enemyCollisionY;
    })

    if(enemyCollision) {
        loseLife();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelUp() {
    console.log('Subiste de nivel');
    level++;
    startGame();
}

function loseLife() {

    if(lives > 1){
        lives--;
    } else{
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();

    console.log(lives);
}

function gameWin() {
    console.log('Terminaste el juego');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_Time');
    const timePlayer = Date.now() - timeStart;

    if(recordTime) {
        if(recordTime >= timePlayer) {
            localStorage.setItem('record_Time', timePlayer);
            pResult.innerHTML = 'Felicidades! Superaste el record anterior';
        } else {
            pResult.innerHTML = 'Lo siento no superaste el record';
        }
    } else {
        localStorage.setItem('record_Time', timePlayer);
        pResult.innerHTML = 'Fuiste el primero en jugar y registrar un nuevo record';
    }

    console.log({recordTime, timePlayer});
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']);
    console.log(heartsArray);

    // spanLives.innerHTML = emojis['HEART'].repeat(lives);

    // spanLives.innerHTML = "";
    // heartsArray.forEach(heart => spanLives.append(heart));
    spanLives.innerHTML = heartsArray.join('');
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_Time');
}

window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {

    if(event.code == 'ArrowUp' || event.code == 'KeyW') moveUp();
    else if(event.code == 'ArrowLeft' || event.code == 'KeyA') moveLeft();
    else if(event.code == 'ArrowRight' || event.code == 'KeyD') moveRight();
    else if(event.code == 'ArrowDown' || event.code == 'KeyS') moveDown();

}

function moveUp() {
    if(playerPosition.y > elementsSize) {
        playerPosition.y -= elementsSize;
        startGame();
    }

}

function moveLeft() {
    if(playerPosition.x > (elementsSize + (elementsSize))) {
        playerPosition.x -= elementsSize;
        startGame();
    }
}

function moveRight() {
    if(playerPosition.x < (elementsSize * (mapRowCols.length))) {
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown() {
    if(playerPosition.y < (elementsSize * (mapRowCols.length-1))) {
        playerPosition.y += elementsSize;
        startGame();
    }
}