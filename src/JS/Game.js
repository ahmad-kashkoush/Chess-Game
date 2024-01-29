import { Piece } from "./pieces/Piece";
import { Pawn } from "./pieces/Pawn";
import { Knight } from "./pieces/Knight";
import { Rook } from "./pieces/Rook";
import { Queen } from "./pieces/Queen";
import { Bishop } from "./pieces/Bishop";

import { King } from "./pieces/King";


export class Game {
    /* Rules
    - Promotion: Pawn can promote itself to others pieces if it reaches the end of the board
    -  */
    constructor(pieces) {
        this.pieces = pieces;
        this.turn = "white";
        this.curPiece = null;
        /* Game Events */
        // messages to show
        this._events = {
            changeTurn: [],
            movePiece: [],
            kill: [],
            promote: [],
            passent: [],
            check: [],
            castle: [],
            stalemate: [],


        }
    }
    handler(eventName, callback) {
        if (!this._events[eventName]) return;
        if (typeof callback !== "function") return;
        this._events[eventName].push(callback);
    }
    triggerHandler(eventName, callbackParameter) {
        if (!this._events[eventName]) return;
        this._events[eventName].forEach(callback => {
            callback(callbackParameter);
        });
    }
    kill(piece) {
        this.pieces.splice(this.pieces.indexOf(piece), 1);
    }
    getPieceSquare(pos) { return document.querySelector(`[data-pos="${pos}"]`); }
    setCur(piece) { this.curPiece = piece; }
    setImage(piece) {

        const square = this.getPieceSquare(piece.pos);
        square.innerHTML = '';
        if (piece.truncate) return;
        const img = document.createElement("img");
        let path = `${piece.color}-${piece.name}.png`
        img.src = new URL(path, import.meta.url);
        square.appendChild(img);

    }
    getPiecesByColor(color) {
        return this.pieces.filter(piece => piece.color === color);
    }
    getPieceByPos(pos) { return this.pieces.find(piece => piece.pos === pos); }
    movePiece(piece, position, castling = false) {
        if (!piece) return;
        const prevPosition = piece.pos;

        if (this.getPieceAllowedMoves(piece).indexOf(position) === -1 && !castling)
            return false;

        const pieceInSquare = this.getPieceByPos(position);
        if (pieceInSquare) {
            if (piece.name === "rook" && pieceInSquare.name === "king" && this.canCastle(pieceInSquare, piece)) {
                this.castleRook(pieceInSquare, piece)
                return true;
            } else
                this.kill(pieceInSquare);
        }
        else if (piece.name === "pawn") this.enPassent(piece, position);
        this.setImage({
            pos: prevPosition,
            truncate: true
        });
        piece.setPos(position);
        this.setImage({ ...piece, truncate: false });
        // passent Move
        if (piece.name === "pawn") {
            piece.setPassent(Math.abs(position - prevPosition) === 20);
        }

        if (piece.name === "pawn" && (position > 80 || position < 20))
            this.promote(piece);
        // TODO add castleRook method
        // TODO add king check method
        this.changeTurn();
        return true;
        // if (piece.name === "king" && pieceInSquare.name === "rook" && pieceInSquare.ableToCastle && Math.abs(prevPosition - position) < 3) {
        //     this.castle();

        //     piece.setPos(position);
        // }

    }
    getPieceAllowedMoves(piece) {

        if (piece.name === "knight")
            return piece.getAllowedMoves().filter(pos => {
                const piece = this.getPieceByPos(pos);
                if (piece && piece.color === this.turn)
                    return false;
                return true;
            });
        return this.unblockedMoves(piece);
    }
    unblockedMoves(piece) {
        let allowedMoves = piece.getAllowedMoves();

        if (piece.name === "pawn") {
            // allowedMoves = piece.getAllowedMoves();
            const arrOfPieces = allowedMoves.map(ele => this.getPieceByPos(ele));
            arrOfPieces.forEach(ele => {

                if (ele && Math.abs(ele.pos - piece.pos) !== 11 && Math.abs(ele.pos - piece.pos) !== 9)
                    allowedMoves.splice(allowedMoves.indexOf(ele.pos), 1);

            });

            return [...allowedMoves, ...this.enPassentMoves(piece)];
        }

        const arrOfPieces = allowedMoves.map(ele => this.getPieceByPos(ele));

        const toRemove = [];
        for (const ele of arrOfPieces) {

            if (!ele) continue;
            if (toRemove.indexOf(ele.pos) !== -1) continue;

            // remove ele if friend
            if (ele.color === this.turn)
                toRemove.push(ele.pos);
            if (piece.name === "rook" && ele.name === "king" && this.canCastle(ele, piece))
                toRemove.pop(ele.pos);
            // remove elements in its direction

            // if (ele.pos > piece.pos) {
            //     const diff = ele.pos - piece.pos;
            //     if (diff % 10 === 0) toRemove.push(...ele.getBottomMoves());
            //     else if (diff < 8) toRemove.push(...ele.getRightMoves());
            //     else {
            //         if(piece.get)
            //     }
            // } else {
            //     const diff = piece.pos - ele.pos;
            //     if (diff % 10 === 0) toRemove.push(...ele.getTopMoves());
            //     if (diff % 10 === 9) toRemove.push(...ele.getTopRightMoves());
            //     if (diff === 1) toRemove.push(...ele.getRightMoves());
            //     else if (diff % 10 === 1) toRemove.push(...ele.getTopLeftMoves());
            // }
            if (piece.getTopMoves().indexOf(ele.pos) !== -1)
                toRemove.push(...ele.getTopMoves());
            if (piece.getBottomMoves().indexOf(ele.pos) !== -1)
                toRemove.push(...ele.getBottomMoves());
            if (piece.getLeftMoves().indexOf(ele.pos) !== -1)
                toRemove.push(...ele.getLeftMoves());
            if (piece.getRightMoves().indexOf(ele.pos) !== -1)
                toRemove.push(...ele.getRightMoves());
            if (piece.getTopLeftMoves().indexOf(ele.pos) !== -1)
                toRemove.push(...ele.getTopLeftMoves());
            if (piece.getTopRightMoves().indexOf(ele.pos) !== -1)
                toRemove.push(...ele.getTopRightMoves());
            if (piece.getBottomRightMoves().indexOf(ele.pos) !== -1)
                toRemove.push(...ele.getBottomRightMoves());
            if (piece.getBottomLeftMoves().indexOf(ele.pos) !== -1)
                toRemove.push(...ele.getBottomLeftMoves());

        }
        allowedMoves = allowedMoves.filter(pos => (toRemove.indexOf(pos) === -1));
        // console.log(allowedMoves);
        return allowedMoves;
    }
    promote(piece) {
        const option = prompt("r:rook\nk:knight\nb:bishop\nothers:queen\nEnter Promote Options");

        let newPiece;
        if (option === "r")
            newPiece = new Rook(piece.pos, piece.color, "rook");
        else if (option === "k")
            newPiece = new Knight(piece.pos, piece.color, "knight");
        else if (option === "b")
            newPiece = new Knight(piece.pos, piece.color, "bishop");
        else
            newPiece = new Queen(piece.pos, piece.color, "queen");

        this.kill(piece);
        this.setImage(newPiece);
        this.pieces.push(newPiece);
    }
    enPassent(piece, position) {
        /* Case
      - When friend pawn goes two moves 
      - friend pawn crossed potential capture square for enemy pawn
   What Happens?
      - enemy pawn can still capture it
      - you mark crossed square as available 
      - moving to crossed means killing friend pawn
  */

        const pos = this.turn === "white" ? position + 10 : position - 10;
        if (pos === piece.pos) return;
        const toKill = this.getPieceByPos(pos);
        if (!toKill) return;
        if (!toKill.passent) return;
        this.kill(toKill);
        this.setImage({
            pos: pos,
            truncate: true
        });
    }
    enPassentMoves(piece) {

        const piece1 = this.getPieceByPos(piece.pos - 1);
        const piece2 = this.getPieceByPos(piece.pos + 1);
        const allowed = [];
        if (this.turn === "white") {
            if (piece1 &&
                piece1.name === "pawn" &&
                piece1.color === "black" &&
                piece1.passent) {
                allowed.push(piece.pos - 11);
            }
            if (piece2 &&
                piece2.name === "pawn" &&
                piece2.color === "black" &&
                piece2.passent) {
                allowed.push(piece.pos - 9);
            }

        } else {
            if (piece1 &&
                piece1.name === "pawn" &&
                piece1.color === "black" &&
                piece1.passent) {
                allowed.push(piece.pos + 9);
            }
            if (piece2 &&
                piece2.name === "pawn" &&
                piece2.color === "black" &&
                piece2.passent) {
                allowed.push(piece.pos + 11);
            }

        }
        return allowed;

    }
    isInCheck() {

    }
    check() {
        /* 
            - display king available moves
            - display any piece 
                - can capture the piece make king in check
                - can block the piece make king in check
            
        */

    }
    checkmate() {
        /* 
        - make current color lose by display message
        - End game
        - reset board
         */
    }
    stalemate() {
        /* 
            - When all available king moves in check
            - King can't play his turn
            - enemy piece are not attacking the king
        */
    }
    canCastle(king, rook) {
        /* When
            - King, rook has never moved
            - King is note in check
            - abs(kingPos-rookPos)<=3
            - Squares in between
                - empty
                - are not under enemy gaze (first two squares)
     
          How
            - King moves two squares towards rook
            - rook moves to square behind the king
        */
        if (!(king.isAbleToCastle && rook.isAbleToCastle)) return false;
        return true;

    }
    castleRook(king, rook) {
        const sign = rook.pos < king.pos ? -1 : 1;
        this.movePiece(king, king.pos + 2 * sign, true);
        this.movePiece(rook, king.pos - sign, true);
        this.changeTurn();
    }
    changeTurn() {
        this.turn = this.turn === "white" ? "black" : "white";
    }


}