import * as readline from 'readline';

interface Position {
  x: number;
  y: number;
}

export class SnakeGame {
  readonly width: number = 10;
  readonly height: number = 5;
  snake: Position[] = [{ x: 1, y: 2 }];
  food: Position = { x: 1, y: 2 };
  direction: Position = { x: 1, y: 0 };
  score: number = 0;

  constructor() {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => this.onKeyPress(key));
    this.placeFood();
  }

  placeFood(): void {
    let x : number, y : number
    do {
      x = Math.floor(Math.random() * this.width)
      y = Math.floor(Math.random() * this.height)
    } while (this.snake.some(pos => pos.x === x && pos.y === y))
    this.food = {x: x, y: y}
  }

  onKeyPress(key: readline.Key): void {
    const dir = key.name;
    if (dir === 'up' && this.direction.y === 0) this.direction = { x: 0, y: -1 };
    else if (dir === 'down' && this.direction.y === 0) this.direction = { x: 0, y: 1 };
    else if (dir === 'left' && this.direction.x === 0) this.direction = { x: -1, y: 0 };
    else if (dir === 'right' && this.direction.x === 0) this.direction = { x: 1, y: 0 };
  }

  moveSnake(): void {
    const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };
    if (head.x >= this.width || head.x < 0 || head.y >= this.height || head.y < 0 || this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      console.log(`Game Over. Your score: ${this.score}`);
      process.exit();
    }
    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.placeFood();
    } else {
      this.snake.pop();
    }
  }

  public start(): void {
    setInterval(() => {
      this.moveSnake();
      this.render();
    }, 500);
  }

  private render(): void {
    console.clear();
    for (let y = 0; y < this.height; y++) {
      let line = '';
      for (let x = 0; x < this.width; x++) {
        if (this.snake.some(segment => segment.x === x && segment.y === y)) {
          line += 'O';
        } else if (this.food.x === x && this.food.y === y) {
          line += 'F';
        } else {
          line += '.';
        }
      }
      console.log(line);
    }
    console.log(`Score: ${this.score}`);
  }
}

const game = new SnakeGame();
game.start();
