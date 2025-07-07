import { createBoard } from "./src/game.js";

console.log("Testing basic import...");
const board = createBoard();
console.log("Board created:", board.length, "x", board[0].length);
