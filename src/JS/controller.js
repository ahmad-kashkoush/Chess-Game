import { Piece } from "./pieces/Piece";
import { Pawn } from "./pieces/Pawn";
import { Knight } from "./pieces/Knight";
import { Rook } from "./pieces/Rook";
import { Queen } from "./pieces/Queen";
import { Bishop } from "./pieces/Bishop";

const testAllowed = function (test) {
    console.log(`${test.name} Allowed Moves:${test.getAllowedMoves()}`);
}


testAllowed(new Knight(55, "white", "knight"));
testAllowed(new Pawn(55, "black", "pawn"));
testAllowed(new Rook(55, "white", "rook"));
testAllowed(new Queen(55, "white", "queen"));
testAllowed(new Bishop(55, "white", "bishop"));

