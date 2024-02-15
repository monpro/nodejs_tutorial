import { SnakeGame } from './snake_game'; // Import the SnakeGame class

// @ts-ignore
jest.spyOn(process, 'exit').mockImplementation(() => {});

describe('SnakeGame', () => {
  let game: SnakeGame;

  beforeEach(() => {
    game = new SnakeGame(); // Create a new instance of SnakeGame before each test
  });

  test('should initialize game state correctly', () => {
    // Assert initial properties of the game object
    expect(game.width).toBe(10);
    expect(game.height).toBe(5);
    expect(game.snake).toEqual([{ x: 1, y: 2 }]);
    expect(game.direction).toEqual({ x: 1, y: 0 });
    expect(game.score).toBe(0);
  });

  test('should place food within the game area', () => {
    game.placeFood(); // Call the placeFood method

    // Ensure that the food position is within the game area
    expect(game.food.x).toBeGreaterThanOrEqual(0);
    expect(game.food.x).toBeLessThan(game.width);
    expect(game.food.y).toBeGreaterThanOrEqual(0);
    expect(game.food.y).toBeLessThan(game.height);

    // Ensure that the food position is not overlapping with the snake
    expect(game.snake.some(segment => segment.x === game.food.x && segment.y === game.food.y)).toBe(false);
  });

  test('should move the snake correctly', () => {
    // Simulate moving the snake to the right
    game.onKeyPress({ name: 'right' });
    game.moveSnake();

    // Ensure that the snake moved to the right
    expect(game.snake[0].x).toBe(2);
    expect(game.snake[0].y).toBe(2);
  });

  test('should increase score when eating food', () => {
    // Place the food adjacent to the snake's head
    game.food = { x: 2, y: 2 };

    // Move the snake to the right to eat the food
    game.onKeyPress({ name: 'right' });
    game.moveSnake();

    // Ensure that the score increases when the snake eats the food
    expect(game.score).toBe(1);
  });

  test('should place new food after eating', () => {
    // Place the food adjacent to the snake's head
    game.food = { x: 2, y: 2 };

    // Move the snake to the right to eat the food
    game.onKeyPress({ name: 'right' });
    game.moveSnake();

    // Ensure that new food is placed after the previous food is eaten
    expect(game.food).not.toEqual({ x: 2, y: 2 });
  });
});
