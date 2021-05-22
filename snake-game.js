let totalFoodAte = 0;
let totalDistanceTravelled = 0;
let pause = false;

const gameContainer = document.getElementById('gameContainer');
const createGameBoardPixels = () =>{
    // Populate the [#gameContainer] div with small divs representing game pixels
    for (let i=1; i<=1600; ++i){
        gameContainer.innerHTML = `${gameContainer.innerHTML} <div class="gameBoardPixel" id="pixel${i}"></div>`;
    };
}

// This variable always holds the updated array of game pixels created by createGameBoardPixels() function

const gameBoardPixels = document.getElementsByClassName('gameBoardPixel');

let currentFoodPosition = 0; //Initioally set to 0

const createFood = () =>{
    // Remove previous Food;
    gameBoardPixels[currentFoodPosition].classList.remove('food');

    // Create new Food
    currentFoodPosition = Math.random();
    currentFoodPosition = Math.floor(currentFoodPosition * 1600);
    gameBoardPixels[currentFoodPosition].classList.add('food')
}

//  Direction codes (Keyboard key codes for arrow keys):
const LEFT_DIR = 37;
const RIGHT_DIR = 39;
const UP_DIR = 38;
const DOWN_DIR = 40;
const SPACE_BAR = 32;
 
// Snake Current Direction initially set to right

let snakeCurrentDirection = RIGHT_DIR;

const changeDirection = newDirectionCode => {
    // Change the direction of the snake

    if (newDirectionCode == snakeCurrentDirection) return;
    if (newDirectionCode == RIGHT_DIR && snakeCurrentDirection != LEFT_DIR){
        snakeCurrentDirection = newDirectionCode    
    }
    else if (newDirectionCode == UP_DIR && snakeCurrentDirection != DOWN_DIR){
        snakeCurrentDirection = newDirectionCode    
    }
    else if (newDirectionCode == DOWN_DIR && snakeCurrentDirection != UP_DIR){
        snakeCurrentDirection = newDirectionCode    
    }
    else if (newDirectionCode == LEFT_DIR && snakeCurrentDirection != RIGHT_DIR){
        snakeCurrentDirection = newDirectionCode    
    }
    else if (newDirectionCode == SPACE_BAR){
        pause = !pause
    }
}

// Let the starting position of the snake be at the middle of the gameboard
let currentSnakeHeadPosition = 799;
let snakeLength = 1000; // Initial legth of the snake 

// Move the snake continiously by calling this function repeatedly:
const moveSnake = () =>{

    switch (snakeCurrentDirection){
        case LEFT_DIR:
            --currentSnakeHeadPosition;
            const isSnakeHeadAtLastGameBoardPixelTowardsLeft = currentSnakeHeadPosition % 40 == 39 || currentSnakeHeadPosition < 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsLeft){
                currentSnakeHeadPosition = currentSnakeHeadPosition + 40;
            }
            break;
        case UP_DIR:
            currentSnakeHeadPosition = currentSnakeHeadPosition - 40;
            const isSnakeHeadAtLastGameBoardPixelTowardsUp = currentSnakeHeadPosition < 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsUp){
                currentSnakeHeadPosition = currentSnakeHeadPosition + 1600;
            }
            break;
        case RIGHT_DIR:
            ++currentSnakeHeadPosition;
            const isSnakeHeadAtLastGameBoardPixelTowardsRight = currentSnakeHeadPosition % 40 == 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsRight){
                currentSnakeHeadPosition = currentSnakeHeadPosition - 40;
            }
            break;
        case DOWN_DIR:
            currentSnakeHeadPosition = currentSnakeHeadPosition + 40;    
            const isSnakeHeadAtLastGameBoardPixelTowardsDown = currentSnakeHeadPosition > 1599;
            if (isSnakeHeadAtLastGameBoardPixelTowardsDown){
                currentSnakeHeadPosition = currentSnakeHeadPosition - 1600;
            }
            break;
        default:
            break;
    }
    let nextSnakeHeadPixel = gameBoardPixels[currentSnakeHeadPosition];

    // Kill the snake if it bites itself:
    if(nextSnakeHeadPixel.classList.contains('snakeBodyPixel')){
        // Stop Moving the snake
        clearInterval(moveSnakeInterval);
        if(!alert(`You have ate ${totalFoodAte} food by travelling ${totalDistanceTravelled} blocks.`))
        window.location.reload();
    }

    // If not killed add the snake body
    nextSnakeHeadPixel.classList.add("snakeBodyPixel");

    // This function removes the snake body from the end of the snake as it moves.
    // Also note that snake length is used as the time out interval
    setTimeout(() => {
        nextSnakeHeadPixel.classList.remove('snakeBodyPixel')
    }, snakeLength);

    // Update total distance travelled
    totalDistanceTravelled++;

    // Update in UI
    document.getElementById('blocksTravelled').innerHTML = totalDistanceTravelled;

    // If snake bites the food:
    if(currentSnakeHeadPosition == currentFoodPosition){
        // Update total Food eaten
        totalFoodAte++;
        
        // Update in UI
        document.getElementById('pointsEarned').innerHTML = totalFoodAte;

        // Increase Snake length
        snakeLength = snakeLength + 100;

        createFood();
    }
}

// Create game board pixels:
createGameBoardPixels();

// Create the initial food
createFood();

// The variable, 'movesnakeInterval' is used to stop the snake when it is killed.
// Move snake:
var moveSnakeInterval = setInterval(moveSnake, 80)

// Call change direction on key presses:
addEventListener('keydown', e => changeDirection(e.keyCode))

// Button configuration for mobile phones ... coming soon