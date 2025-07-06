import { useState } from 'preact/hooks'
import { createGameState, makeMove } from './game'
import './app.css'

export function App() {
  const [gameState, setGameState] = useState(createGameState())
  
  const handleCellClick = (row, col) => {
    if (gameState.gameOver || gameState.board[row][col] !== null) {
      return
    }
    
    // For now, always place kittens - we'll add piece selection later
    const newState = makeMove(gameState, row, col, 'kitten')
    setGameState(newState)
  }
  
  const resetGame = () => {
    setGameState(createGameState())
  }
  
  const renderPiece = (piece) => {
    if (!piece) return null
    
    const [type, player] = piece.split('_')
    const isPlayer1 = player === 'player1'
    
    return (
      <div className={`piece ${type} ${isPlayer1 ? 'player1' : 'player2'}`}>
        {type === 'kitten' ? '🐱' : '🐈'}
      </div>
    )
  }
  
  const currentPlayer = gameState.players[gameState.currentPlayer]
  
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
            <div className="player-pieces">
              <span>🐱 Kittens: {currentPlayer.kittens}</span>
              <span>🐈 Cats: {currentPlayer.cats}</span>
            </div>
          </div>
          
          {gameState.gameOver && (
            <div className="game-over">
              <h2>🎉 {gameState.winner} Wins! 🎉</h2>
              <button onClick={resetGame} className="reset-button">
                Play Again
              </button>
            </div>
          )}
        </div>
        
        <div className="board">
          {gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`board-cell ${cell ? 'occupied' : 'empty'}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {renderPiece(cell)}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="controls">
          <button onClick={resetGame} className="reset-button">
            Reset Game
          </button>
        </div>
      </div>
    </div>
  )
}
