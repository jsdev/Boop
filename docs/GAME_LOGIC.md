# Game Logic & Rules

This document outlines the complete game mechanics and rules for the digital implementation of Boop.

## Core Game Components

### 1. Game Board Setup ✅
- **6x6 grid** representing the bed/quilt
- **Coordinate system** for board positions (0-5, 0-5)
- **Empty space validation** - pieces can only be placed on null positions

### 2. Game Pieces
- **Kittens**: 8 per player, can be placed on empty spaces
- **Cats**: 8 per player, obtained through kitten graduation
- **Two colors**: Each player controls one color (e.g., orange vs gray)

### 3. Player Management
- **Two-player game** with alternating turns
- **Piece inventory**: Track available kittens and cats per player
- **Turn-based gameplay**: Players alternate placing pieces

## Core Game Mechanics

### 4. Piece Placement System ✅
- Players can place pieces on any empty board space
- Occupied spaces reject new piece placement
- Each placement triggers boop mechanics

### 5. Line Detection & Graduation ✅
- **Line Detection**: Automatically detect horizontal, vertical, and diagonal lines of 3+ pieces
- **Kitten Graduation**: When 3+ kittens of the same color form a line:
  - All kittens in the line are removed from the board
  - Player gains 1 cat per line (not per kitten)
- **Mixed Lines**: Lines containing both kittens and cats of the same color also trigger graduation

### 6. Boop Mechanics ✅
When a piece is placed, it "boops" (pushes) adjacent pieces:

#### Boop Rules:
- **Kittens can boop**: Other kittens only
- **Cats can boop**: Both kittens and cats
- **Direction**: Pieces are pushed away from the booping piece
- **Group Immunity**: Pieces in a line (2+ pieces in a row) cannot be booped
- **Board Edge**: Pieces booped off the board are removed

#### Boop Process:
1. Check all 8 adjacent spaces around the placed piece
2. For each adjacent piece that can be booped:
   - Check if target space is available
   - Move piece to new position
   - If no space available (edge/occupied), remove piece

### 7. Boop Chain Resolution 🚧
- Process all boop effects from a single placement
- Booped pieces do not cause additional boops
- If booping creates new lines, handle graduation

### 8. Win Conditions 🚧
- **Primary**: Three cats of the same color in a row
- **Alternate**: All 8 cats on board at end of turn

## Advanced Game Rules

### 9. Board Overflow Management 🚧
- When a player has all 8 pieces on board at start of turn
- Player must remove a piece before placing a new one
- Removed kittens graduate to cats, removed cats go to reserves

### 10. Edge Case Handling 🚧
- **Overlapping lines**: Multiple lines of 3+ pieces
- **Player choice**: When multiple valid graduation options exist
- **Simultaneous lines**: Both players form lines in same turn

## Implementation Status

### ✅ Completed
- Board creation and validation
- Piece placement with occupancy checking
- Line detection (horizontal, vertical, diagonal)
- Kitten graduation mechanics
- Basic boop mechanics with group immunity
- Comprehensive test coverage

### 🚧 In Progress
- Win condition detection
- Player turn management
- Game state persistence

### 📋 Planned
- Boop chain resolution
- Board overflow handling
- Advanced edge cases
- Animation system
- AI opponent

## Testing Coverage

All implemented mechanics are covered by unit tests:

```javascript
// Board Management
✅ should create a 6x6 board
✅ should have null values for all initial positions

// Piece Placement
✅ should place a piece on the board
✅ should not place a piece on an occupied space

// Line Detection
✅ should detect a horizontal line of 3
✅ should detect a vertical line of 3
✅ should detect a diagonal line of 3
✅ should not detect a line of different pieces

// Kitten Graduation
✅ should remove 3 kittens in a line and return graduated cats

// Boop Mechanics
✅ should boop an adjacent kitten
✅ a cat should boop an adjacent kitten
✅ a cat should boop an adjacent cat
✅ a kitten should not boop a cat
✅ should boop a piece off the board
✅ should not boop a group of pieces
```

## Game Flow

1. **Setup**: Create empty 6x6 board, give each player 8 kittens
2. **Turn Loop**:
   - Current player selects piece type (kitten/cat)
   - Player places piece on empty space
   - Process boop mechanics
   - Check for line formation and graduation
   - Check win conditions
   - Switch to other player
3. **End Game**: When win condition is met or stalemate

## Data Structures

### Board Representation
```javascript
// 6x6 array, null = empty, string = piece type
board = [
  [null, 'kitten', null, 'cat', null, null],
  [null, null, 'kitten', null, null, null],
  // ... 4 more rows
]
```

### Player State
```javascript
player = {
  color: 'orange' | 'gray',
  kittens: 8,      // Available kittens
  cats: 0,         // Available cats
  onBoard: []      // Pieces currently on board
}
```

### Game State
```javascript
gameState = {
  board: Array(6).fill(null).map(() => Array(6).fill(null)),
  currentPlayer: 0 | 1,
  players: [player1, player2],
  winner: null,
  gameOver: false
}
```
