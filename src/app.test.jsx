import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/preact";
import '@testing-library/jest-dom';
import { App } from "./app.jsx";
import * as gameModule from "./game.js";

// Mock the game module to control behavior
vi.mock("./game.js", () => ({
  createGameState: () => ({
    board: Array(6)
      .fill(null)
      .map(() => Array(6).fill(null)),
    currentPlayer: 0,
    players: [
      { color: "player1", kittens: 8, cats: 0 },
      { color: "player2", kittens: 8, cats: 0 },
    ],
    winner: null,
    gameOver: false,
  }),
  makeMove: (gameState, row, col, piece) => {
    const playerColor = gameState.players[gameState.currentPlayer].color;
    return {
      ...gameState,
      board: gameState.board.map((r, rIdx) =>
        rIdx === row
          ? r.map((c, cIdx) => (cIdx === col ? `${piece}_${playerColor}` : c))
          : r,
      ),
      currentPlayer: (gameState.currentPlayer + 1) % 2,
      players: gameState.players.map((player, idx) =>
        idx === gameState.currentPlayer
          ? { ...player, kittens: player.kittens - 1 }
          : player,
      ),
    };
  },
}));

describe("App Component", () => {
  it("should render the game title", () => {
    render(<App />);
    expect(screen.getByText("🐱 Boop 🐈")).toBeTruthy();
  });

  it("should render the game board with clickable cells", () => {
    render(<App />);
    const cells = document.querySelectorAll(".board-cell");
    expect(cells.length).toBe(36); // 6x6 grid
  });

  it("should display current player turn", () => {
    render(<App />);
    expect(screen.getByText("Player 1's Turn")).toBeTruthy();
  });

  it("should display player piece counts", () => {
    render(<App />);
    expect(screen.getByText("🐱 Kittens: 8")).toBeTruthy();
    expect(screen.getByText("🐈 Cats: 0")).toBeTruthy();
  });

  it("should auto-select kitten when only kittens are available", () => {
    render(<App />);
    // With 8 kittens and 0 cats, kitten should be auto-selected
    expect(screen.getByText("Auto-selected: kitten")).toBeTruthy();
  });

  it("should show piece selection when multiple pieces are available", () => {
    // Mock a state where player has both kittens and cats
    vi.spyOn(gameModule, "createGameState").mockImplementationOnce(() => ({
      board: Array(6)
        .fill(null)
        .map(() => Array(6).fill(null)),
      currentPlayer: 0,
      players: [
        { color: "player1", kittens: 5, cats: 2 },
        { color: "player2", kittens: 8, cats: 0 },
      ],
      winner: null,
      gameOver: false,
    }));

    render(<App />);
    expect(screen.getByText("Choose your piece:")).toBeTruthy();
    expect(screen.getByTestId("kitten-selector")).toBeTruthy();
    expect(screen.getByTestId("cat-selector")).toBeTruthy();
  });

  it("should allow piece selection", () => {
    // Mock a state where player has both pieces
    vi.spyOn(gameModule, "createGameState").mockImplementationOnce(() => ({
      board: Array(6)
        .fill(null)
        .map(() => Array(6).fill(null)),
      currentPlayer: 0,
      players: [
        { color: "player1", kittens: 5, cats: 2 },
        { color: "player2", kittens: 8, cats: 0 },
      ],
      winner: null,
      gameOver: false,
    }));

    render(<App />);

    // Click on cat selector
    fireEvent.click(screen.getByTestId("cat-selector"));
    expect(screen.getByText("Selected: cat")).toBeTruthy();
  });

  it("should handle cell clicks", () => {
    render(<App />);
    const cells = document.querySelectorAll(".board-cell");

    fireEvent.click(cells[0]);

    // After click, should switch to player 2's turn
    expect(screen.getByText("Player 2's Turn")).toBeTruthy();
  });

  it("should render reset button", () => {
    render(<App />);
    expect(screen.getByText("Reset Game")).toBeTruthy();
  });

  it("should handle reset button click", () => {
    render(<App />);
    const resetButton = screen.getByText("Reset Game");

    fireEvent.click(resetButton);

    // Should be back to player 1's turn
    expect(screen.getByText("Player 1's Turn")).toBeTruthy();
  });

  it("should render piece when placed", () => {
    render(<App />);
    const cells = document.querySelectorAll(".board-cell");

    fireEvent.click(cells[0]);

    // Should contain a piece emoji
    expect(cells[0].textContent).toContain("🐱");
  });

  describe("additional UI interactions", () => {
    it("should handle rapid consecutive clicks on same cell", () => {
      render(<App />);
      const cell = screen.getByTestId("cell-0-0");

      // Click multiple times rapidly
      fireEvent.click(cell);
      fireEvent.click(cell);
      fireEvent.click(cell);

      // Should only place one piece
      expect(cell).toHaveTextContent("🐱"); // kitten symbol
    });

    it("should display different pieces correctly", () => {
      render(<App />);

      // Make moves to get different piece types
      const cell1 = screen.getByTestId("cell-0-0");
      const cell2 = screen.getByTestId("cell-0-1");

      fireEvent.click(cell1); // Player 1 kitten
      fireEvent.click(cell2); // Player 2 kitten

      expect(cell1).toHaveTextContent("🐱");
      expect(cell2).toHaveTextContent("🐱");

      // Check piece classes
      const piece1 = cell1.querySelector(".piece");
      const piece2 = cell2.querySelector(".piece");
      expect(piece1).toHaveClass("player1");
      expect(piece2).toHaveClass("player2");
    });

    it("should update current player display correctly", () => {
      render(<App />);

      expect(screen.getByText(/player 1's turn/i)).toBeInTheDocument();

      // Make a move
      const cell = screen.getByTestId("cell-0-0");
      fireEvent.click(cell);

      expect(screen.getByText(/player 2's turn/i)).toBeInTheDocument();
    });

    it("should handle game reset during play", () => {
      render(<App />);

      // Make some moves
      fireEvent.click(screen.getByTestId("cell-0-0"));
      fireEvent.click(screen.getByTestId("cell-0-1"));
      fireEvent.click(screen.getByTestId("cell-1-0"));

      // Reset the game
      fireEvent.click(screen.getByText("Reset Game"));

      // Check that board is cleared and player is reset
      expect(screen.getByText(/player 1's turn/i)).toBeInTheDocument();
      expect(screen.queryByText(/winner/i)).not.toBeInTheDocument();

      // Check that all cells are empty
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          const cell = screen.getByTestId(`cell-${row}-${col}`);
          expect(cell).toHaveTextContent("");
        }
      }
    });
  });
});
