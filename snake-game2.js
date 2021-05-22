let totalFoodAte = 0;
let totalDistanceTravelled = 0;
let snakeBody = [];
let snakeTailPosition = 817;
let currentSnakeHeadPosition = 820;
let foodEaten = 0;

const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;

let oldSnakeDirection = LEFT;
let newSnakeDirection = LEFT;

let snakeIsBumpingOnToTheWall = false;
let currentFoodPosition = 0;

let adder = 1;


const gameContainer = document.getElementById('gameContainer');
const createGameBoardPixels = () =>{
    // Populate the [#gameContainer] div with small divs representing game pixels
    for (let i=1; i<=1600; ++i){
        gameContainer.innerHTML = `${gameContainer.innerHTML} <div class="gameBoardPixel" id="pixel${i}"></div>`;
    };
    document.getElementById('highScore').innerHTML = highScore;
}

// This variable always holds the updated array of game pixels created by createGameBoardPixels() function
const gameBoardPixels = document.getElementsByClassName('gameBoardPixel');

// Initallizing the snake:
snakeBody.push(820, 819);

const gameOver = () => {    
    clearInterval(moveSnake);
    snakeBody = [];

    if (highScore < foodEaten){
        localStorage.setItem('highScore', foodEaten);
        alert(`Your Score: ${foodEaten}\nNew High Score: ${foodEaten}`);
    
        return window.location.reload()
    }
    alert(`Your Score: ${foodEaten}\nHigh Score: ${highScore}`);
    return window.location.reload()
}

const createFood = () => {
    gameBoardPixels[currentFoodPosition].classList.remove('food');

    currentFoodPosition = Math.random();
    currentFoodPosition = Math.floor(currentFoodPosition * 1600);
    gameBoardPixels[currentFoodPosition].classList.add('food');
}

const makeSnake = () => {
    if (!snakeIsBumpingOnToTheWall){
        gameBoardPixels[snakeTailPosition].classList.remove('snakeBodyPixel');
    }
    
    for (let a of snakeBody){
        gameBoardPixels[a].classList.add('snakeBodyPixel');
    }
    snakeTailPosition = snakeBody[snakeBody.length-1]
    currentSnakeHeadPosition = snakeBody[0];
    
    gameBoardPixels[currentSnakeHeadPosition].classList.add('snakeHead');
}

const moveSnake = (newSnakeDirection) => {
    if (gameBoardPixels[snakeBody[0]+adder] && gameBoardPixels[snakeBody[0]+adder].classList.contains('snakeBodyPixel')){
        return gameOver();
    }

    if (currentFoodPosition == snakeBody[0]){
        foodEaten+=1;
        document.getElementById('currentScore').innerHTML = foodEaten;
        snakeBody = [currentFoodPosition, ...snakeBody];
        createFood();
        
    }

    switch (newSnakeDirection){
        case LEFT:
            snakeIsBumpingOnToTheWall = snakeBody[0] % 40 == 0;
            if (snakeIsBumpingOnToTheWall){
                return gameOver();
            }

            if (oldSnakeDirection == RIGHT){
                break;
            }
            adder = -1
            
            oldSnakeDirection = newSnakeDirection;
            break;
        case RIGHT:
            snakeIsBumpingOnToTheWall = snakeBody[0] % 40 == 39;
            if (snakeIsBumpingOnToTheWall){
                return gameOver();
            }

            if (oldSnakeDirection == LEFT){
                break;
            }
            adder = 1
            oldSnakeDirection = newSnakeDirection;
            break;
        case UP:
            snakeIsBumpingOnToTheWall = snakeBody[0] < 1+40;
            if (snakeIsBumpingOnToTheWall){
                return gameOver();
            }

            if (oldSnakeDirection == DOWN){
                break;
            }
            adder = -40
            oldSnakeDirection = newSnakeDirection;
            break;
        case DOWN:
            snakeIsBumpingOnToTheWall = snakeBody[0] > 1600-40;
            if (snakeIsBumpingOnToTheWall){
                return gameOver();
            }

            if (oldSnakeDirection == UP){
                break;
            }
            adder = 40
            oldSnakeDirection = newSnakeDirection;
            break;
        default:
            break;
    }

    for (i=snakeBody.length - 2; i>=0; i--){
        snakeBody[i+1] = snakeBody[i];
    }
    gameBoardPixels[currentSnakeHeadPosition].classList.remove('snakeHead');
    snakeBody[0] = snakeBody[0] + adder;
}


let highScore = localStorage.getItem('highScore');

if (!highScore) {
    localStorage.setItem('highScore', 0)
    highScore = localStorage.getItem('highScore')
}

createGameBoardPixels();

createFood();

setInterval(() => {
    moveSnake(newSnakeDirection);
    makeSnake();
}, 100);

addEventListener('keydown', e => {
    if (e.keyCode == UP ||e.keyCode == DOWN || e.keyCode == LEFT || e.keyCode == RIGHT) {
        newSnakeDirection = e.keyCode;
    }
})
