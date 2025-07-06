export const ROWS = 6;
export const COLS = 6;

export const createBoard = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

export const placePiece = (board, row, col, piece) => {
  if (board[row][col]) {
    return board; // Space already occupied
  }
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = piece;
  return newBoard;
};

export const detectLines = (board, pieceType) => {
  const lines = [];

  // Check horizontal lines
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - 3; col++) {
      if (
        board[row][col] === pieceType &&
        board[row][col + 1] === pieceType &&
        board[row][col + 2] === pieceType
      ) {
        lines.push([{ row: row, col: col }, { row: row, col: col + 1 }, { row: row, col: col + 2 }]);
      }
    }
  }

  // Check vertical lines
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - 3; row++) {
      if (
        board[row][col] === pieceType &&
        board[row + 1][col] === pieceType &&
        board[row + 2][col] === pieceType
      ) {
        lines.push([{ row: row, col: col }, { row: row + 1, col: col }, { row: row + 2, col: col }]);
      }
    }
  }

  // Check diagonal lines (top-left to bottom-right)
  for (let row = 0; row <= ROWS - 3; row++) {
    for (let col = 0; col <= COLS - 3; col++) {
      if (
        board[row][col] === pieceType &&
        board[row + 1][col + 1] === pieceType &&
        board[row + 2][col + 2] === pieceType
      ) {
        lines.push([{ row: row, col: col }, { row: row + 1, col: col + 1 }, { row: row + 2, col: col + 2 }]);
      }
    }
  }

  // Check diagonal lines (top-right to bottom-left)
  for (let row = 0; row <= ROWS - 3; row++) {
    for (let col = 2; col < COLS; col++) {
      if (
        board[row][col] === pieceType &&
        board[row + 1][col - 1] === pieceType &&
        board[row + 2][col - 2] === pieceType
      ) {
        lines.push([{ row: row, col: col }, { row: row + 1, col: col - 1 }, { row: row + 2, col: col - 2 }]);
      }
    }
  }

  return lines;
};

export const graduateKittens = (board, lines) => {
  let graduatedCount = 0;
  const newBoard = board.map(r => [...r]);

  lines.forEach(line => {
    graduatedCount++;
    line.forEach(pos => {
      newBoard[pos.row][pos.col] = null;
    });
  });

  return { newBoard, graduatedCount };
};

export const boop = (board, row, col) => {
  const newBoard = board.map(r => [...r]);
  const boopingPiece = newBoard[row][col];

  if (!boopingPiece) {
    return newBoard;
  }

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  directions.forEach(([dRow, dCol]) => {
    const adjacentRow = row + dRow;
    const adjacentCol = col + dCol;

    if (
      adjacentRow >= 0 && adjacentRow < ROWS &&
      adjacentCol >= 0 && adjacentCol < COLS &&
      newBoard[adjacentRow][adjacentCol]
    ) {
      const boopedPiece = newBoard[adjacentRow][adjacentCol];

      // A kitten can't boop a cat
      if (boopingPiece === 'kitten' && boopedPiece === 'cat') {
        return;
      }

      // Check for group immunity
      const nextRow = adjacentRow + dRow;
      const nextCol = adjacentCol + dCol;
      if (
        nextRow >= 0 && nextRow < ROWS &&
        nextCol >= 0 && nextCol < COLS &&
        newBoard[nextRow][nextCol]
      ) {
        // If there's a piece next to the booped piece in the same direction, it's a group.
        return;
      }

      const boopToRow = adjacentRow + dRow;
      const boopToCol = adjacentCol + dCol;

      if (boopToRow >= 0 && boopToRow < ROWS && boopToCol >= 0 && boopToCol < COLS) {
        if (!newBoard[boopToRow][boopToCol]) { // Cannot boop onto an occupied space
            newBoard[boopToRow][boopToCol] = boopedPiece;
            newBoard[adjacentRow][adjacentCol] = null;
        }
      } else {
        // Booped off the board
        newBoard[adjacentRow][adjacentCol] = null;
      }
    }
  });

  return newBoard;
};
