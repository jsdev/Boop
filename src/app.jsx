import { useState, useCallback } from "preact/hooks";
import { createGameState, makeMove } from "./game";
import "./app.css";
import kitten1 from "./assets/kitten_1.png";
import kitten2 from "./assets/kitten_2.png";
import cat1 from "./assets/cat_1.png";
import cat2 from "./assets/cat_2.png";

export function App() {
  const [gameState, setGameState] = useState(createGameState());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [draggedPiece, setDraggedPiece] = useState(null);

  const currentPlayer = gameState.players[gameState.currentPlayer];

  // Auto-select piece if player only has one type available
  const getAvailablePieces = () => {
    const pieces = [];
    if (currentPlayer.kittens > 0) pieces.push("kitten");
    if (currentPlayer.cats > 0) pieces.push("cat");
    return pieces;
  };

  const availablePieces = getAvailablePieces();

  // Auto-select if only one piece type available
  const effectiveSelectedPiece =
    availablePieces.length === 1 ? availablePieces[0] : selectedPiece;

  // Memoized handlers to avoid new function instances in JSX props
  const handlePieceSelect = useCallback((pieceType) => {
    setSelectedPiece(pieceType);
  }, []);
  const handleDragStart = useCallback((e, pieceType) => {
    setDraggedPiece(pieceType);
    e.dataTransfer.effectAllowed = "move";
  }, []);
  const handleKittenClick = useCallback(
    () => handlePieceSelect("kitten"),
    [handlePieceSelect],
  );
  const handleCatClick = useCallback(
    () => handlePieceSelect("cat"),
    [handlePieceSelect],
  );
  const handleKittenDragStart = useCallback(
    (e) => handleDragStart(e, "kitten"),
    [handleDragStart],
  );
  const handleCatDragStart = useCallback(
    (e) => handleDragStart(e, "cat"),
    [handleDragStart],
  );

  // Memoized handlers for board cells
  const handleCellClickMemo = useCallback(
    (row, col) => {
      if (gameState.gameOver || gameState.board[row][col] !== null) {
        return;
      }
      const pieceToPlace = effectiveSelectedPiece;
      if (!pieceToPlace) {
        return;
      }
      const newState = makeMove(gameState, row, col, pieceToPlace);
      setGameState(newState);
      if (availablePieces.length > 1) {
        setSelectedPiece(null);
      }
    },
    [gameState, effectiveSelectedPiece, availablePieces.length],
  );
  const handleDropMemo = useCallback(
    (e, row, col) => {
      e.preventDefault();
      if (
        gameState.gameOver ||
        gameState.board[row][col] !== null ||
        !draggedPiece
      ) {
        setDraggedPiece(null);
        return;
      }
      const newState = makeMove(gameState, row, col, draggedPiece);
      setGameState(newState);
      setDraggedPiece(null);
    },
    [gameState, draggedPiece],
  );
  const handleDragOverMemo = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  // Memoized handler for reset
  const handleResetGame = useCallback(() => {
    setGameState(createGameState());
    setSelectedPiece(null);
    setDraggedPiece(null);
  }, []);

  // Memoized handler for board cell click (no arrow in JSX)
  const handleBoardCellClick = useCallback(
    (rowIndex, colIndex) => () => handleCellClickMemo(rowIndex, colIndex),
    [handleCellClickMemo],
  );
  const handleBoardDrop = useCallback(
    (rowIndex, colIndex) => (e) => handleDropMemo(e, rowIndex, colIndex),
    [handleDropMemo],
  );

  const renderPiece = (piece) => {
    if (!piece) return null;
    const [type, player] = piece.split("_");
    const isPlayer1 = player === "player1";
    let imgSrc = null;
    if (type === "kitten") {
      imgSrc = isPlayer1 ? kitten1 : kitten2;
    } else if (type === "cat") {
      imgSrc = isPlayer1 ? cat1 : cat2;
    }
    return (
      <div className={`piece ${type} ${isPlayer1 ? "player1" : "player2"}`}>
        <img src={imgSrc} alt={`${type} ${player}`} className="piece-img" />
      </div>
    );
  };

  // Memoized instructions text
  const instructionsText = useCallback(() => {
    if (availablePieces.length === 0) return "No pieces available!";
    if (availablePieces.length === 1)
      return `Click a cell to place your ${effectiveSelectedPiece}`;
    if (availablePieces.length > 1 && !effectiveSelectedPiece)
      return "Select a piece type first";
    if (availablePieces.length > 1 && effectiveSelectedPiece)
      return `Click a cell to place your ${effectiveSelectedPiece}, or drag & drop`;
    return null;
  }, [availablePieces.length, effectiveSelectedPiece]);

  return (
    <div className="app">
      <header className="header">
        <h1>🐱 Boop 🐈</h1>
        <p>Strategic board game by Scott Brady</p>
      </header>

      <div className="game-container">
        <div className="game-info">
          <div className="player-info">
            <h3>Player {gameState.currentPlayer + 1}'s Turn</h3>

            {/* Piece Selection Area */}
            <div className="piece-selection">
              <h4>Choose your piece:</h4>
              <div className="available-pieces">
                {availablePieces.includes("kitten") && (
                  <button
                    type="button"
                    className={`piece-selector ${
                      effectiveSelectedPiece === "kitten" ? "selected" : ""
                    }`}
                    onClick={handleKittenClick}
                    draggable
                    onDragStart={handleKittenDragStart}
                    data-testid="kitten-selector"
                  >
                    <div className="piece-display">
                      <img
                        src={
                          currentPlayer.color === "player1"
                            ? kitten1
                            : kitten2
                        }
                        alt="Kitten"
                        className="piece-img"
                      />
                    </div>
                    <span>Kitten ({currentPlayer.kittens})</span>
                  </button>
                )}

                {availablePieces.includes("cat") && (
                  <button
                    type="button"
                    className={`piece-selector ${
                      effectiveSelectedPiece === "cat" ? "selected" : ""
                    }`}
                    onClick={handleCatClick}
                    draggable
                    onDragStart={handleCatDragStart}
                    data-testid="cat-selector"
                  >
                    <div className="piece-display">
                      <img
                        src={currentPlayer.color === "player1" ? cat1 : cat2}
                        alt="Cat"
                        className="piece-img"
                      />
                    </div>
                    <span>Cat ({currentPlayer.cats})</span>
                  </button>
                )}
              </div>

              {effectiveSelectedPiece && (
                <div className="selection-hint">
                  {availablePieces.length === 1
                    ? `Auto-selected: ${effectiveSelectedPiece}`
                    : `Selected: ${effectiveSelectedPiece}`}
                </div>
              )}
            </div>

            <div className="player-pieces">
              <span>🐱 Kittens: {currentPlayer.kittens}</span>
              <span>🐈 Cats: {currentPlayer.cats}</span>
            </div>
          </div>

          {gameState.gameOver && (
            <div className="game-over">
              <h2>🎉 {gameState.winner} Wins! 🎉</h2>
              <button onClick={handleResetGame} className="reset-button">
                Play Again
              </button>
            </div>
          )}
        </div>

        <div className="board">
          {gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  data-testid={`cell-${rowIndex}-${colIndex}`}
                  className={`board-cell ${cell ? "occupied" : "empty"} ${
                    effectiveSelectedPiece && !cell ? "selectable" : ""
                  }`}
                  onClick={handleBoardCellClick(rowIndex, colIndex)}
                  onDragOver={handleDragOverMemo}
                  onDrop={handleBoardDrop(rowIndex, colIndex)}
                  disabled={!!cell || gameState.gameOver}
                >
                  {renderPiece(cell)}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="controls">
          <div className="instructions">
            <p>{instructionsText()}</p>
          </div>

          <button onClick={handleResetGame} className="reset-button">
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}
