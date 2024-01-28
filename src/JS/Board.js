import { Piece } from "./pieces/Piece";
import { Pawn } from "./pieces/Pawn";
import { Knight } from "./pieces/Knight";
import { Rook } from "./pieces/Rook";
import { Queen } from "./pieces/Queen";
import { Bishop } from "./pieces/Bishop";
import { Game } from "./Game";
import { King } from "./pieces/King";

const beginGame = function (game) {
    // ! Helper Functions

    const removeAvailableSelection = () => {
        [...document.querySelectorAll('.available-square')].forEach(ele => ele.classList.remove('available-square'));
    }


    // ! Variables
    const squares = document.querySelectorAll(".square");
    let clickedPiece;

    const resetBoard = function (pieces) {
        pieces.forEach(piece => {
            game.setImage(piece)
            // piece.addHandler(displayAvailable);
        });
    }
    resetBoard(game.pieces);

    const setAllowedSquares = function (piece) {
        clickedPiece = piece;

        const arrOfAllowed = game.getPieceAllowedMoves(piece);

        removeAvailableSelection();
        arrOfAllowed?.forEach(pos => {
            const availableSquare = game.getPieceSquare(pos);
            availableSquare.classList.add('available-square');

        })

        if (!arrOfAllowed) removeAvailableSelection();
    }
    const movePieceToSquare = function (square) {
        const position = parseInt(square.dataset.pos);
        const piece = game.getPieceByPos(position);

        if (piece && piece.color === game.turn) {
            removeAvailableSelection();

            return setAllowedSquares(piece);
        }
        // if not, then move it

        game.movePiece(clickedPiece, position);
        removeAvailableSelection();
        clickedPiece = null;

    }
    squares.forEach(square => {
        square.addEventListener("click", function (e) {
            movePieceToSquare(this);
        });
    });


    //TODO  game.handler("changeTurn", function (e) {

    // });
    //TODO game.handler("movePiece", function (e) { })
    // TODO game.handler("kill", function (e) { })
    // TODO game.handler("promote", function (e) { })
    // TODO game.handler("", function(e){})
    // TODO game.handler("check", function(e){})
    // TODO game.handler("castle", function(e){})
    // TODO game.handler("passent", function(e){})

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
    new King(85, "white", "king"),
    new Bishop(86, "white", "bishop"),
    new Knight(87, "white", "knight"),
    new Rook(88, "white", "rook"),
    ...addPawnsHelper(71, "white"),

    new Rook(11, "black", "rook"),
    new Knight(12, "black", "knight"),
    new Bishop(13, "black", "bishop"),
    new Queen(14, "black", "queen"),
    new King(15, "black", "king"),
    new Bishop(16, "black", "bishop"),
    new Knight(17, "black", "knight"),
    new Rook(18, "black", "rook"),
    ...addPawnsHelper(21, "black"),


]
const game = new Game(pieces);
beginGame(game);