import { Piece } from "./pieces/Piece";
import { Pawn } from "./pieces/Pawn";
import { Knight } from "./pieces/Knight";
import { Rook } from "./pieces/Rook";
import { Queen } from "./pieces/Queen";
import { Bishop } from "./pieces/Bishop";

// const testAllowed = function (test) {
//     console.log(`${test.name} Allowed Moves:${test.getAllowedMoves()}`);
// }


// testAllowed(new Knight(55, "white", "knight"));
// testAllowed(new Pawn(55, "black", "pawn"));
// testAllowed(new Rook(55, "white", "rook"));
// testAllowed(new Queen(55, "white", "queen"));
// testAllowed(new Bishop(55, "white", "bishop"));

const getPieceSquare = (pos => document.querySelector(`[data-pos="${pos}"]`));
const removeAvailableSelection = function () {
    [...document.querySelectorAll('.available-square')].forEach(ele => ele.classList.remove('available-square'));
}
const resetBoard = function (pieces) {

    pieces.forEach(piece => {
        const square = getPieceSquare(piece.getPos());
        square.innerHTML = '';
        const img = document.createElement("img");
        let path = `${piece.color}-${piece.name}.png`
        img.src = new URL(path, import.meta.url);
        square.appendChild(img);
        piece.addHandler(displayAvailable);
    });

}
const displayAvailable = function (piece) {
    const arrOfAllowed = piece.getAllowedMoves();
    console.log(arrOfAllowed);
    removeAvailableSelection();
    arrOfAllowed.forEach(pos => {
        const curSquare = getPieceSquare(pos);

        curSquare.classList.add('available-square');
        console.log(curSquare);
        curSquare.addEventListener('click', function (e) {
            moveCurPiece(pos, piece);
        });

    })

}


const moveCurPiece = function (toPos, piece) {
    const curSquare = getPieceSquare(piece.getPos());
    curSquare.innerHTML = '';
    piece.setPos(toPos);
    const square = getPieceSquare(piece.getPos());
    const img = document.createElement("img");
    let path = `${piece.color}-${piece.name}.png`
    console.log(path);
    img.src = new URL(path, import.meta.url);
    square.appendChild(img);
    removeAvailableSelection();


}








const addPawnsHelper = (starterPosition, color) => {
    const pawns = [];
    for (let i = starterPosition; i < starterPosition + 8; i++)
        pawns.push(new Pawn(i, color, "pawn"));
    return pawns;
}
const pieces = [

    new Rook(81, "white", "rook"),
    new Knight(82, "white", "knight"),
    new Bishop(83, "white", "bishop"),
    new Queen(84, "white", "queen"),
    new Knight(85, "white", "king"),
    new Bishop(86, "white", "bishop"),
    new Knight(87, "white", "knight"),
    new Rook(88, "white", "rook"),
    ...addPawnsHelper(71, "white"),

    new Rook(11, "black", "rook"),
    new Knight(12, "black", "knight"),
    new Bishop(13, "black", "bishop"),
    new Queen(14, "black", "queen"),
    new Knight(15, "black", "king"),
    new Bishop(16, "black", "bishop"),
    new Knight(17, "black", "knight"),
    new Rook(18, "black", "rook"),
    ...addPawnsHelper(21, "black"),


]
resetBoard(pieces);