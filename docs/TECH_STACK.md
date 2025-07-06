# Tech Stack

This document outlines the technology choices, setup, and development environment for the Boop digital board game.

## 🛠️ Core Technologies

### Frontend Framework
- **[Preact](https://preactjs.com/)** - Fast 3kB alternative to React
  - Chosen for lightweight bundle size
  - React-compatible API
  - Perfect for game UIs with frequent updates

### Build Tool
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
  - Lightning-fast hot module replacement (HMR)
  - Optimized production builds
  - Built-in TypeScript/JSX support
  - Native ES modules in development

### Testing Framework
- **[Vitest](https://vitest.dev/)** - Vite-native testing framework
  - Fast execution with Vite's transform pipeline
  - Jest-compatible API
  - Built-in code coverage
  - Watch mode for TDD workflow

### Development Environment
- **[jsdom](https://github.com/jsdom/jsdom)** - DOM environment for testing
- **[ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)** - Modern JavaScript module system

## 📦 Package Dependencies

### Production Dependencies
```json
{
  "preact": "^10.22.1"
}
```

### Development Dependencies
```json
{
  "@preact/preset-vite": "^2.8.2",
  "vite": "^5.3.3",
  "vitest": "^2.0.2",
  "jsdom": "latest"
}
```

## 🏗️ Project Structure

```
Boop/
├── src/
│   ├── game.js           # Core game logic (pure JS)
│   ├── game.test.js      # Unit tests for game logic
│   ├── app.jsx           # Main Preact component
│   ├── main.jsx          # Application entry point
│   ├── app.css           # Component styles
│   ├── index.css         # Global styles
│   └── assets/           # Static assets
├── public/               # Public assets
├── docs/                 # Documentation
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── index.html            # HTML entry point
```

## ⚙️ Configuration

### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  test: {
    environment: 'jsdom',
    globals: true,
  }
})
```

### Package Scripts
```json
{
  "scripts": {
    "dev": "vite",                    // Development server
    "build": "vite build",            // Production build
    "preview": "vite preview",        // Preview production build
    "test": "vitest run"              // Run tests once
  }
}
```

## 🚀 Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Serves at http://localhost:5173

# Run tests in watch mode
npm test
```

### Test-Driven Development (TDD)
1. Write failing test
2. Implement minimal code to pass
3. Refactor while keeping tests green
4. Repeat

### Build Process
```bash
# Development build with HMR
npm run dev

# Production build
npm run build
# Outputs to dist/ directory

# Preview production build
npm run preview
```

## 🎯 Architecture Decisions

### Why Preact over React?
- **Bundle Size**: 3kB vs 42kB (React)
- **Performance**: Faster rendering for game state updates
- **Compatibility**: Drop-in replacement for React
- **Simplicity**: Less complexity for a focused game app

### Why Vite over Webpack?
- **Speed**: Instant server start and fast HMR
- **Simplicity**: Minimal configuration needed
- **Modern**: Built for ES modules and modern browsers
- **Integration**: Perfect Vitest integration

### Why Vitest over Jest?
- **Performance**: Faster test execution
- **Integration**: Shares Vite's transform pipeline
- **Modern**: Built for ES modules
- **Compatibility**: Jest-compatible API

### Game Logic Separation
- **Pure Functions**: Game logic in separate JS file
- **Framework Agnostic**: Can be used with any UI framework
- **Testable**: Easy to unit test without UI concerns
- **Portable**: Can be reused for different implementations

## 🧪 Testing Strategy

### Unit Tests
- **Game Logic**: Comprehensive coverage of core mechanics
- **Pure Functions**: Easy to test without side effects
- **Edge Cases**: Cover all rule variations and boundary conditions

### Test Structure
```javascript
describe('game feature', () => {
  it('should handle normal case', () => {
    // Arrange
    const board = createBoard();
    
    // Act
    const result = gameFunction(board, params);
    
    // Assert
    expect(result).toEqual(expectedResult);
  });
});
```

### Coverage Goals
- **Game Logic**: 100% function coverage
- **Edge Cases**: All rule variations tested
- **Integration**: Key game flow scenarios

## 🌐 Browser Support

### Targets
- **Modern Browsers**: ES2020+ support
- **Mobile**: iOS Safari 14+, Android Chrome 90+
- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+

### Progressive Enhancement
- **Core Functionality**: Works without JavaScript (future consideration)
- **Enhanced Experience**: Rich interactions with JavaScript
- **Mobile First**: Responsive design from the start

## 📈 Performance Considerations

### Bundle Optimization
- **Tree Shaking**: Vite automatically removes unused code
- **Code Splitting**: Dynamic imports for larger features
- **Asset Optimization**: Vite optimizes images and other assets

### Runtime Performance
- **Preact**: Efficient virtual DOM with small overhead
- **Game State**: Immutable updates for predictable performance
- **Animation**: CSS transforms for smooth animations

### Development Experience
- **Hot Reload**: Instant feedback during development
- **Fast Tests**: Vitest runs tests in milliseconds
- **Type Safety**: JSDoc comments for IDE support

## 🔧 Future Enhancements

### Potential Additions
- **TypeScript**: For larger codebase and better IDE support
- **PWA**: Service worker for offline gameplay
- **WebRTC**: Real-time multiplayer
- **Canvas/WebGL**: Advanced animations and effects
- **State Management**: Redux or Zustand for complex state

### Scalability
- **Component Library**: Reusable UI components
- **Theme System**: Multiple visual themes
- **Plugin Architecture**: Extensible game rules
- **Analytics**: Performance and usage tracking

## 📚 Learning Resources

### Documentation
- [Preact Documentation](https://preactjs.com/guide/v10/getting-started)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/guide/)

### Best Practices
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [React/Preact Patterns](https://reactpatterns.com/)
