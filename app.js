const canvas = document.getElementById('game-canvas'), //получаем canvas
  widthSelector = document.querySelectorAll('.fieldSizeBtn'), //получаем кнопки размера пол€
  headColor = document.querySelector('#headColor'), //получаем ползунок цвета головы
  bodyColor = document.querySelector('#bodyColor'), //получаем ползунок цвета тела
  headExample = document.querySelector('#head'), //получаем пример цвета головы
  bodyExample = document.querySelector('#body'), //получаем пример цвета тела
  score = document.getElementById('score'), //получаем текст дл€ очков
  record = document.getElementById('record'), //получаем текст дл€ рекорда
  context = canvas.getContext('2d'),//определ€ем тип холста
  width = 512, //изначальна€ ширина пол€
  height = 384; //изначальна€ высота пол€
let scoreCount = 0, //счетчик очков
  recordCount = 0, //счетчик рекорда
  bonus;

canvas.width = width;
canvas.height = height;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

const fieldProperties = {
  step: 0,
  maxStep: 10, //фпс
}

let snake = {
  sizeCell: 16, //размер одного куска змеи
  x: 160,  //положение по x
  y: 160,  //положение по y
  dirX: 0, //направление по x
  dirY: 0, //направление по y
  stepSize: 16, //один шаг в 'кадр'
  tails: [], //массив кусков змеи
  maxTails: 20, //текущее число кусков
  headColor: "blue",
  bodyColor: "midnightblue",
}

let berry = {
  x: 0, //положение по x
  y: 0, //положение по y
  avaliableSize: [8, 16], //массив возможных размеров
  sizeBerry: 8, //размер €годы
}

const align = () => { return ((snake.sizeCell - berry.sizeBerry) / 2); }//значение выравнивани€ положени€ фрукта и коллизии змеи с ним
let indent; //отступ

const getRandomInt = (min, max) => { //генератор чисел в заданом диапазоне
  return Math.floor(Math.random() * (max - min) + min);
}

const gameLoop = () => {
  requestAnimationFrame(gameLoop);

  if (++fieldProperties.step < fieldProperties.maxStep) return;
  fieldProperties.step = 0;
  //очистка канваса
  context.clearRect(0, 0, canvas.width, canvas.height);
  //отрисовка
  drawSnake();
  drawBerry();
  getColor();
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
  if (snake.tails.length > snake.maxTails) snake.tails.pop();
  for (let cell of snake.tails) {
    if (cell === head) context.fillStyle = snake.headColor;
    else context.fillStyle = snake.bodyColor;
    context.fillRect(cell.x, cell.y, snake.sizeCell, snake.sizeCell);
    if (cell.x + indent == berry.x && cell.y + indent == berry.y) {
      if (berry.sizeBerry === berry.avaliableSize[0]) bonus = 1;
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
  berry.x = (getRandomInt(0, canvas.width / snake.sizeCell) * snake.sizeCell) + indent;
  berry.y = getRandomInt(0, canvas.height / snake.sizeCell) * snake.sizeCell + indent;
}
berryPos();

function collisionBorder() {
  if (snake.x < 0) snake.x = canvas.width - snake.sizeCell;
  else if (snake.x >= canvas.width) snake.x = 0;
  if (snake.y < 0) snake.y = canvas.height - snake.sizeCell;
  else if (snake.y >= canvas.height) snake.y = 0;
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

const colors = ['blue', 'red', 'green', 'yellow', 'brown', 'purple', 'pink', 'orange'];
headExample.style.backgroundColor = colors[0];
bodyExample.style.backgroundColor = colors[0];
const getColor = () => {
  headColor.oninput = () => {
    snake.headColor = colors[headColor.value];
    headExample.style.backgroundColor = colors[headColor.value];
  }
  bodyColor.oninput = () => {
    snake.bodyColor = colors[bodyColor.value];
    bodyExample.style.backgroundColor = colors[bodyColor.value];
  }
}

const getFieldWidth = () => {
  for (let elem of widthSelector) {
    elem.onclick = () => {
      if (Array.from(widthSelector).indexOf(elem) === 0) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      else {
        canvas.width = width * 1.5;
        canvas.height = height * 1.25;
        canvas.style.width = `${width * 1.5}px`;
        canvas.style.height = `${height * 1.25}px`;
      }
    }
  }
}
getFieldWidth();