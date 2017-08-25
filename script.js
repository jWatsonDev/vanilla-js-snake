const c = document.getElementById('snake-game'); // grab canvas
const ctx = c.getContext('2d'); // 2d context
const width = c.width; console.log(width);
const height = c.height; console.log(height);
const cellWidth = 12;
let direction = 'right';
let food;
let score = 0;
const speed = 100; // SLOW down to see how snake moves cell by cell
let snakeArray = [];

/*
* starts game
*/
function init() {
document.querySelector('#overlay').style.display = 'none';
createSnake();
createFood();
// if the snake is not being drawn, draw it
if (typeof gameLoop != 'undefined') clearInterval(gameLoop);
gameLoop = setInterval(drawSnake, speed);

}

/*
* create snake
*/
function createSnake() {
let length = 5;
for (let i = length - 1; i >= 0; i--) {
  // storing xy object in snakeArray
  snakeArray.push({x: i, y: 0});
}
}

/*
* create food
*/
function createFood() {
 // (width - cellWidth) / cellWidth)
 food = {
   x: randomNumber(0, (width - cellWidth) / cellWidth),
   y: randomNumber(0, (height - cellWidth) / cellWidth)
 };

}

/*
* draw snake
*/
function drawSnake() {
  // repaint the canvas background each frame
  // comment this out to see how game works
  ctx.fillStyle = '#272727';
  ctx.fillRect(0, 0, width, height);

  // store tail cell in front of the head cell
  let headX = snakeArray[0].x; // x value of first obj in snakeArray
  let headY = snakeArray[0].y; // y value of first obj in snakeArray
  if      (direction === 'right') headX++;
  else if (direction === 'left') headX--;
  else if (direction === 'up') headY--;
  else if (direction === 'down') headY++;
  console.log('headX ' + headX + ' headY: ' + headY);
  if (  headX == -1 || // hits left wall
        headX == width/cellWidth || // hits right wall
        headY == -1 || // hits top wall
        headY == height/cellWidth || // hits bottom wall
        checkSelfCollision(headX, headY, snakeArray) // runs into itself
      ) {
      //restart game
      // init();
      console.log('You lose.');
      gameOver();
      return;
    }

    // if snake head gets food
    if(headX == food.x && headY == food.y) {
      score++;
      // update score
      document.querySelector('#score').innerHTML = 'Score: ' + score;
      createFood(); // create new food
    } else {
      // if we don't hit food, the tail is removed, creating
      // the illusion that the snake is moving. .pop() removes last item in array.
      snakeArray.pop();
    }
    let newHead = {x: headX, y: headY};
    // puts tail as first cell. unshift() adds to beginning of array
    // crucial part of program. this make snake appear to move
    // tail removed and then added to the front
    snakeArray.unshift(newHead);

    for(let i = 0; i < snakeArray.length; i++) {
      paintCell(snakeArray[i].x, snakeArray[i].y, '#ff652f');
    }
    paintCell(food.x, food.y, '#ffe400');
}

/*
 * used to paint food and snake
 * just quick way to create canvas rectangle
 */
function paintCell(x, y, color) {
  ctx.fillStyle = color;
  // !important - x * cellWidth = topRight point for painting cell
  // this linke of code makes the game work
  ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
  ctx.strokeStyle = '#272727';
  ctx.lineWidth = 4;
  ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
}

/*
* returns random number
*/
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/*
 * check for collision with self
 * loop through passed in array, looking for an xy match
 */
function checkSelfCollision(x, y, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].x == x && array[i].y == y) return true;
  }
  return false;
}

/*
 * set direction based on key press
 */
function handler(e) {
  switch (e.keyCode) {
    case 39:
      direction = 'right';
      break;
    case 37:
      direction = 'left';
      break;
    case 38:
      direction = 'up';
      break;
    case 40:
      direction = 'down';
      break;
    default:
      console.log('Only the arrow keys.');
  }
}

/*
 * currently just reloading page when the game is over
 */
function gameOver() {
  location.reload();
}

// call handler() when a key is pressed
document.addEventListener('keydown', handler);

// call init() when button is clicked
document.querySelector('button').onclick = init;
