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

export const checkWinCondition = (board, player) => {
  const playerCatType = `cat_${player}`;
  
  // Check for 3 cats in a row
  const catLines = detectLines(board, playerCatType);
  if (catLines.length > 0) {
    return player;
  }
  
  // Check for 8 cats on board
  let catCount = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === playerCatType) {
        catCount++;
      }
    }
  }
  
  if (catCount >= 8) {
    return player;
  }
  
  return null;
};

export const createGameState = () => {
  return {
    board: createBoard(),
    currentPlayer: 0,
    players: [
      { color: 'player1', kittens: 8, cats: 0 },
      { color: 'player2', kittens: 8, cats: 0 }
    ],
    winner: null,
    gameOver: false
  };
};

export const makeMove = (gameState, row, col, pieceType) => {
  // Validate move
  if (gameState.board[row][col] !== null) {
    return gameState; // Invalid move, return unchanged state
  }
  
  const currentPlayer = gameState.players[gameState.currentPlayer];
  const playerColor = currentPlayer.color;
  const fullPieceType = `${pieceType}_${playerColor}`;
  
  // Check if player has the piece available
  if (pieceType === 'kitten' && currentPlayer.kittens <= 0) {
    return gameState;
  }
  if (pieceType === 'cat' && currentPlayer.cats <= 0) {
    return gameState;
  }
  
  // Create new game state
  const newState = {
    ...gameState,
    board: placePiece(gameState.board, row, col, fullPieceType),
    players: gameState.players.map((player, index) => {
      if (index === gameState.currentPlayer) {
        return {
          ...player,
          kittens: pieceType === 'kitten' ? player.kittens - 1 : player.kittens,
          cats: pieceType === 'cat' ? player.cats - 1 : player.cats
        };
      }
      return player;
    })
  };
  
  // Apply boop mechanics
  newState.board = boop(newState.board, row, col);
  
  // Check for line formation and graduation
  const kittenType = `kitten_${playerColor}`;
  const lines = detectLines(newState.board, kittenType);
  if (lines.length > 0) {
    const { newBoard, graduatedCount } = graduateKittens(newState.board, lines);
    newState.board = newBoard;
    newState.players[gameState.currentPlayer].cats += graduatedCount;
  }
  
  // Check win condition
  const winner = checkWinCondition(newState.board, playerColor);
  if (winner) {
    newState.winner = winner;
    newState.gameOver = true;
  }
  
  // Switch players
  newState.currentPlayer = (gameState.currentPlayer + 1) % 2;
  
  return newState;
};
