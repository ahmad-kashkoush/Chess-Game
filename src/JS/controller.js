import { Piece } from "./pieces/Piece";

const testPiece = new Piece(44, 5, "red", "test");

console.log(`Top Moves: ${testPiece.getTopMoves()}`);
console.log(`Bottom Moves: ${testPiece.getBottomMoves()}`);
console.log(`Left Moves: ${testPiece.getLeftMoves()}`);
console.log(`Right Moves: ${testPiece.getRightMoves()}`);
console.log(`Top Left Moves: ${testPiece.getTopLeftMoves()}`);
console.log(`Top Right Moves: ${testPiece.getTopRightMoves()}`);
console.log(`Bottom Left Moves: ${testPiece.getBottomLeftMoves()}`);
console.log(`Bottom Right Moves: ${testPiece.getBottomRightMoves()}`);