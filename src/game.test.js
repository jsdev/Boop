import { describe, it, expect } from 'vitest';
import { createBoard, placePiece, detectLines, graduateKittens, boop } from './game';

describe('game board', () => {
  it('should create a 6x6 board', () => {
    const board = createBoard();
    expect(board.length).toBe(6);
    board.forEach(row => {
      expect(row.length).toBe(6);
    });
  });

  it('should have null values for all initial positions', () => {
    const board = createBoard();
    board.forEach(row => {
      row.forEach(cell => {
        expect(cell).toBeNull();
      });
    });
  });
});

describe('piece placement', () => {
  it('should place a piece on the board', () => {
    const board = createBoard();
    const newBoard = placePiece(board, 0, 0, 'kitten');
    expect(newBoard[0][0]).toBe('kitten');
  });

  it('should not place a piece on an occupied space', () => {
    const board = createBoard();
    const newBoard = placePiece(board, 0, 0, 'kitten');
    const finalBoard = placePiece(newBoard, 0, 0, 'cat');
    expect(finalBoard[0][0]).toBe('kitten');
  });
});

describe('line detection', () => {
  it('should detect a horizontal line of 3', () => {
    let board = createBoard();
    board = placePiece(board, 0, 0, 'kitten');
    board = placePiece(board, 0, 1, 'kitten');
    board = placePiece(board, 0, 2, 'kitten');
    const lines = detectLines(board, 'kitten');
    expect(lines).toEqual([[{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }]]);
  });

  it('should detect a vertical line of 3', () => {
    let board = createBoard();
    board = placePiece(board, 0, 0, 'kitten');
    board = placePiece(board, 1, 0, 'kitten');
    board = placePiece(board, 2, 0, 'kitten');
    const lines = detectLines(board, 'kitten');
    expect(lines).toEqual([[{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }]]);
  });

  it('should detect a diagonal line of 3', () => {
    let board = createBoard();
    board = placePiece(board, 0, 0, 'kitten');
    board = placePiece(board, 1, 1, 'kitten');
    board = placePiece(board, 2, 2, 'kitten');
    const lines = detectLines(board, 'kitten');
    expect(lines).toEqual([[{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }]]);
  });

  it('should not detect a line of different pieces', () => {
    let board = createBoard();
    board = placePiece(board, 0, 0, 'kitten');
    board = placePiece(board, 0, 1, 'cat');
    board = placePiece(board, 0, 2, 'kitten');
    const lines = detectLines(board, 'kitten');
    expect(lines.length).toBe(0);
  });
});

describe('kitten graduation', () => {
  it('should remove 3 kittens in a line and return the new board and graduated cats', () => {
    let board = createBoard();
    board = placePiece(board, 0, 0, 'kitten');
    board = placePiece(board, 0, 1, 'kitten');
    board = placePiece(board, 0, 2, 'kitten');

    const lines = detectLines(board, 'kitten');
    const { newBoard, graduatedCount } = graduateKittens(board, lines);

    expect(graduatedCount).toBe(1);
    expect(newBoard[0][0]).toBeNull();
    expect(newBoard[0][1]).toBeNull();
    expect(newBoard[0][2]).toBeNull();
  });
});

describe('boop mechanics', () => {
  it('should boop an adjacent kitten', () => {
    let board = createBoard();
    board = placePiece(board, 0, 1, 'kitten'); // The piece to be booped
    board = placePiece(board, 0, 0, 'kitten'); // The piece that boops
    const newBoard = boop(board, 0, 0);
    expect(newBoard[0][2]).toBe('kitten');
    expect(newBoard[0][1]).toBeNull();
  });

  it('a cat should boop an adjacent kitten', () => {
    let board = createBoard();
    board = placePiece(board, 0, 1, 'kitten');
    board = placePiece(board, 0, 0, 'cat');
    const newBoard = boop(board, 0, 0);
    expect(newBoard[0][2]).toBe('kitten');
  });

  it('a cat should boop an adjacent cat', () => {
    let board = createBoard();
    board = placePiece(board, 0, 1, 'cat');
    board = placePiece(board, 0, 0, 'cat');
    const newBoard = boop(board, 0, 0);
    expect(newBoard[0][2]).toBe('cat');
  });

  it('a kitten should not boop a cat', () => {
    let board = createBoard();
    board = placePiece(board, 0, 1, 'cat');
    board = placePiece(board, 0, 0, 'kitten');
    const newBoard = boop(board, 0, 0);
    expect(newBoard[0][1]).toBe('cat');
  });

  it('should boop a piece off the board', () => {
    let board = createBoard();
    board = placePiece(board, 0, 5, 'kitten');
    board = placePiece(board, 0, 4, 'kitten');
    const newBoard = boop(board, 0, 4);
    expect(newBoard[0][5]).toBeNull();
  });

  it('should not boop a group of pieces', () => {
    let board = createBoard();
    board = placePiece(board, 0, 1, 'kitten');
    board = placePiece(board, 0, 2, 'kitten');
    board = placePiece(board, 0, 0, 'kitten');
    const newBoard = boop(board, 0, 0);
    expect(newBoard[0][1]).toBe('kitten');
    expect(newBoard[0][2]).toBe('kitten');
  });
});
