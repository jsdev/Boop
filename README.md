# Boop - Digital Board Game

A digital implementation of "Boop" by Scott Brady - a strategic board game where players place kittens and cats on a bed to form lines of three while "booping" (pushing) opponent pieces.

## 🎮 Game Overview

Boop is a two-player strategy game where players take turns placing kittens and cats on a 6x6 grid. The goal is to form lines of three pieces while using the "boop" mechanic to push opponent pieces around the board.

## 📋 Documentation

- **[Game Logic & Rules](./docs/GAME_LOGIC.md)** - Complete game mechanics, rules, and implementation details
- **[Tech Stack](./docs/TECH_STACK.md)** - Technology choices, setup, and development environment
- **[GitHub Actions](./docs/GITHUB_ACTIONS.md)** - CI/CD pipeline and automated workflows

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🎯 Current Status

✅ **Completed:**
- Game board creation (6x6 grid)
- Piece placement system
- Line detection (horizontal, vertical, diagonal)
- Kitten graduation mechanics
- Boop mechanics with group immunity
- Comprehensive test suite (15 tests passing)

🚧 **In Progress:**
- Game state management
- Player turn system
- Win condition detection

📋 **Planned:**
- UI/UX implementation
- Game animations
- Multiplayer support

## 🧪 Testing

The project uses Test-Driven Development (TDD) with Vitest:

```bash
npm test  # Run all tests
```

All core game logic is thoroughly tested with 15 passing unit tests covering:
- Board creation and validation
- Piece placement rules
- Line detection algorithms
- Kitten graduation mechanics
- Boop mechanics and edge cases

## 📦 Project Structure

```
src/
├── game.js           # Core game logic
├── game.test.js      # Unit tests
├── app.jsx           # Main React component
└── main.jsx          # Entry point

docs/
├── GAME_LOGIC.md     # Game rules and mechanics
├── TECH_STACK.md     # Technical documentation
└── GITHUB_ACTIONS.md # CI/CD documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests first (TDD approach)
4. Implement functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is open source. Please respect the original game design by Scott Brady.
