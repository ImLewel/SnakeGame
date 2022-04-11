let canvas = document.getElementById('game-canvas'); //получаем canvas
  canvas.width = 512;
  canvas.height = 384;
  canvas.style.width = '512px';
  canvas.style.height = '384px';
let colorsArr = document.querySelectorAll('.colorButton');
let headBodySwitcher = document.querySelectorAll('.headOrBodyColor');
let widthSelector = document.querySelectorAll('.fieldSizeBtn');
console.log(headBodySwitcher);
console.log(headBodySwitcher.keys);
console.log(headBodySwitcher.values);
console.log(typeof(headBodySwitcher));
let score = document.getElementById('score'); //получаем текст для очков
let record = document.getElementById('record'); //получаем текст для рекорда
let context = canvas.getContext('2d');//определяем тип холста
let scoreCount = 0; //подсчет очков
let recordCount = 0; //счет рекорда

const fieldProperties = {
  step: 0,
  maxStep: 10, //фпс
}

let snake = {
  sizeCell: 16, //размер одного куска змеи
  x: 160,
  y: 160,
  dirX: 0, //направление по x
  dirY: 0, //направление по y
  stepSize: 16, //один шаг в 'кадр'
  tails: [], //массив кусков змеи
  maxTails: 20, //текущее число кусков
  headColor: "blue",
  bodyColor: "midnightblue",
}

let berry = {
  x: 0,
  y: 0,
  avaliableSize: [8, 16],
  sizeBerry: 8, //размер ягоды
}

const align = () => { return ((snake.sizeCell - berry.sizeBerry) / 2); }//значение выравнивания положения фрукта и коллизии змеи с ним
let indent; //отступ

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

const gameLoop = () => {
  requestAnimationFrame(gameLoop);

  if (++fieldProperties.step < fieldProperties.maxStep) return;
  fieldProperties.step = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

  drawSnake();
  drawBerry();
  whatToPaint(getColor);
  score.innerHTML = `Your current score is ${scoreCount}`;
  record.innerHTML = `Your record was ${recordCount}`;
}
requestAnimationFrame(gameLoop);

const drawSnake = () => {
 
  snake.x += snake.dirX;
  snake.y += snake.dirY;
  collisionBorder()
  snake.tails.unshift({ x: snake.x, y: snake.y });
  head = snake.tails[0];
  if (snake.tails.length > snake.maxTails) {
    snake.tails.pop();
  }
  for (let cell of snake.tails) {
    if (cell === head) {
      context.fillStyle = snake.headColor;
    }
    else {
      context.fillStyle = snake.bodyColor;
    }
    context.fillRect(cell.x, cell.y, snake.sizeCell, snake.sizeCell);

    if (cell.x + indent == berry.x && cell.y + indent == berry.y) {
      let bonus;
      if (berry.sizeBerry = berry.avaliableSize[0]) bonus = 1;
      else bonus = 2;
      scoreCount+=bonus;
      if (scoreCount > recordCount) recordCount+=bonus;
      snake.maxTails+=bonus;
      berryPos();
    }
         if (snake.dirX < 0 && head.x - 16 === cell.x && head.y === cell.y) refreshGame();
    else if (snake.dirX > 0 && head.x + 16 === cell.x && head.y === cell.y) refreshGame();
    else if (snake.dirY < 0 && head.y - 16 === cell.y && head.x === cell.x) refreshGame();
    else if (snake.dirY > 0 && head.y + 16 === cell.y && head.x === cell.x) refreshGame();
  }
}

const refreshGame = () => {
  snake.x = 160;
  snake.y = 160;
  snake.tails = [];
  snake.maxTails = 20;
  snake.dirX = 0;
  snake.dirY = 0;
  scoreCount = 0;
  berryPos();
}

const drawBerry = () => {
  context.fillStyle = "#CF1B84";
  context.fillRect(berry.x, berry.y, berry.sizeBerry, berry.sizeBerry);
}

const berryPos = () => {
  berry.sizeBerry = berry.avaliableSize[Math.round(Math.random())];
  indent = align();
  console.log(indent);
  berry.x = (getRandomInt(0, canvas.width / snake.sizeCell) * snake.sizeCell) + indent;
  berry.y = getRandomInt(0, canvas.height / snake.sizeCell) * snake.sizeCell + indent;
}
berryPos();

function collisionBorder() {
  if (snake.x < 0) {
    snake.x = canvas.width - snake.sizeCell;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - snake.sizeCell;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
}

document.addEventListener("keydown", e => {
  if (e.code == "KeyW") {
    snake.dirX = 0;
    snake.dirY = -snake.stepSize;
  }
  else if (e.code == "KeyS") {
    snake.dirX = 0;
    snake.dirY = snake.stepSize;
  }
  else if (e.code == "KeyA") {
    snake.dirY = 0;
    snake.dirX = -snake.stepSize;
  }
  else if (e.code == "KeyD") {
    snake.dirY = 0;
    snake.dirX = snake.stepSize;
  }
});

let switcher;
const whatToPaint = (callback) => {
  for (let button of headBodySwitcher) {
    button.onclick = () => {
      button.style.color = 'red';
      button.style.backgroundColor = 'lightgray';
      if (button.id === 'head') {
        switcher = 0;
      }
      else if (button.id === 'body') {
        switcher = 1;
      }
      setTimeout(() => { button.style.color = 'black'; button.style.backgroundColor = 'floralwhite';}, 2000);
    }
  }
  callback(switcher);
}

const getColor = (num) => {
  for (let currColor of colorsArr) {
    if (num === 0) {
      currColor.onclick = () => {
        snake.headColor = currColor.style.backgroundColor;
        console.log(snake.headColor + ' for head');
      };
    }
    else {
      currColor.onclick = () => {
        snake.bodyColor = currColor.style.backgroundColor;
        console.log(snake.bodyColor + ' for body');
      };
    }
  }
}

const getFieldWidth = () => {
  for (let elem of widthSelector) {
    elem.onclick = () => {
      if (elem === widthSelector[0]) {
        canvas.width = 512;
        canvas.height = 384;
        canvas.style.width = '512px';
        canvas.style.height = '384px';
      }
      else {
        context.canvas.width = 640;
        context.canvas.height = 384;
        canvas.style.width = '640px';
        canvas.style.height = '384px';
      }
    }
  }
}
getFieldWidth();