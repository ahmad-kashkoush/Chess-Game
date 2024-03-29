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
    const statusHeading = document.querySelector("h1");
    const removeAvailableSelection = () => {
        [...document.querySelectorAll('.available-square')].forEach(ele => ele.classList.remove('available-square'));
        [...document.querySelectorAll('.available-square-capture')].forEach(ele => ele.classList.remove('available-square-capture'));
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
        // game.setCur(clickedPiece);
        const arrOfAllowed = game.getPieceAllowedMoves(piece);

        removeAvailableSelection();
        arrOfAllowed?.forEach(pos => {
            const availableSquare = game.getPieceSquare(pos);
            const classToAdd = availableSquare.querySelector("img") ? 'available-square-capture' : 'available-square';
            availableSquare.classList.add(classToAdd);

        })

        if (!arrOfAllowed) removeAvailableSelection();
    }
    const movePieceToSquare = function (square) {
        const position = parseInt(square.dataset.pos);
        const piece = game.getPieceByPos(position);
        let castleCondition = piece && clickedPiece
        castleCondition &&= clickedPiece.name === "rook" && piece.name === "king";
        castleCondition &&= game.canCastle(piece, clickedPiece);
        if (piece && piece.color === game.turn && !castleCondition) {
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

    game.handler("changeTurn", function (e) {
        document.querySelector("h1 span").textContent = `${game.turn} turn`;
    })
    game.handler("checkmate", function (e) {
        document.querySelector("h1 span").textContent = `${game.turn} Is Dead, Refresh Page for new game`;
    })
    game.handler("checked", function (e) {
        document.querySelector("h1 span").textContent = `${game.turn} Is Checked`;
    })

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