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
            checkmate: [],

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
        if (this.getPieceAllowedMoves(piece).indexOf(position) === -1 && !castling)
            return false;
        const prevPosition = piece.pos;
        this.setCur(piece);
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
            const piece1 = this.getPieceByPos(position + 1);
            const piece2 = this.getPieceByPos(position - 1);
            let ok = piece1 && piece1.name === "pawn" && piece1.color !== this.turn;
            ok = ok || (piece2 && piece2.name === "pawn" && piece2.color !== this.turn);
            piece.setPassent(Math.abs(position - prevPosition) === 20 && ok);
        }

        if (piece.name === "pawn" && (position > 80 || position < 20))
            this.promote(piece);
        // TODO add castleRook method
        // TODO add king check method
        if (position !== prevPosition)
            this.changeTurn();

        if (this.kingChecked(this.turn)) {
            console.log(`${this.turn}: Checked`);
            if (this.kingDead(this.turn))
                this.checkmate(this.turn);
        }
        return true;


    }
    getPieceAllowedMoves(piece) {
        let allowedMoves = [];
        if (piece.color === this.turn) {
            const notAvailable = [];
            this.setCur(piece);
            allowedMoves = this.unblockedMoves(piece);
            if (piece.name === "king") {
                let enemyPieces = this.getPiecesByColor(this.turn === "white" ? "black" : "white");
                enemyPieces.forEach(p => {
                    notAvailable.push(...this.getPieceAllowedMoves(p));
                })
            } else {

                if (this.kingChecked(this.turn)) {
                    allowedMoves.forEach(move => {
                        if (this.myKingChecked(move, true))
                            notAvailable.push(move);
                    })
                }
            }
            allowedMoves = allowedMoves.filter(allowed => (notAvailable.indexOf(allowed) === -1));
        }
        else {
            allowedMoves = this.unblockedMoves(piece);
        }

        return allowedMoves;

    }
    unblockedMoves(piece, checking = false) {
        let allowedMoves = piece.getAllowedMoves();
        const toRemove = [];
        // chcking condition
        if (piece.name === "pawn") {
            // allowedMoves = piece.getAllowedMoves();
            const arrOfPieces = allowedMoves.map(ele => this.getPieceByPos(ele));
            arrOfPieces.forEach(ele => {

                if (ele && (ele.color === this.turn || Math.abs(ele.pos - piece.pos) !== 11 && Math.abs(ele.pos - piece.pos) !== 9)) {
                    toRemove.push(ele.pos);
                    if (this.turn === "white") toRemove.push(...ele.getTopMoves());
                    if (this.turn === "black") toRemove.push(...ele.getBottomMoves());
                }


            });
            allowedMoves = allowedMoves
                .filter(pos => (toRemove.indexOf(pos) === -1))
            return [...allowedMoves, ...this.enPassentMoves(piece)];
        }

        const arrOfPieces = allowedMoves.map(ele => this.getPieceByPos(ele));

        for (const ele of arrOfPieces) {

            if (!ele) continue;
            if (toRemove.indexOf(ele.pos) !== -1) continue;

            // remove ele if friend
            if (ele.color === piece.color)
                toRemove.push(ele.pos);
            if (piece.name === "rook" && this.canCastle(ele, piece))
                toRemove.pop(ele.pos);
            // remove elements in its direction

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



        allowedMoves = allowedMoves
            .filter(pos => (toRemove.indexOf(pos) === -1));

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

    myKingChecked(pos, kill = true) {

        const clickedPiece = this.curPiece;
        const returnToPos = clickedPiece.pos;
        const enemyPiece = this.getPieceByPos(pos);
        const needToKill = kill && clickedPiece && enemyPiece && enemyPiece.name !== "king";
        if (enemyPiece) console.log(this.getPieceAllowedMoves(enemyPiece), needToKill);
        if (needToKill) this.kill(enemyPiece);
        clickedPiece.setPos(pos);
        const stillChecked = this.kingChecked(this.turn);
        if (needToKill) this.pieces.push(enemyPiece);
        clickedPiece.setPos(returnToPos);
        return stillChecked;


    }
    kingChecked(color) {

        const enemyColor = color === "white" ? "black" : "white";
        const returnToPiece = this.curPiece;
        const enemyPieces = this.getPiecesByColor(enemyColor);
        const king = this.pieces.find(friendKing => (friendKing.color === color && friendKing.name === "king"));

        // console.log(enemyPieces);
        for (const enemy of enemyPieces) {
            this.setCur(enemy);
            const enemyAllowedMoves = this.getPieceAllowedMoves(enemy);
            if (enemyAllowedMoves.indexOf(king.pos) !== -1) {
                console.log(`${enemy.color} ${enemy.name}:`, enemyAllowedMoves);
                this.setCur(returnToPiece);
                return true;
            }
        }

        return false;

    }
    kingDead(color) {
        // King Dead: no Piece can move
        const returnToPiece = this.curPiece;
        const friendPieces = this.getPiecesByColor(color);
        for (const piece of friendPieces) {
            this.setCur(piece);
            if (this.getPieceAllowedMoves(piece).length) {
                this.setCur(returnToPiece);
                return false;
            }
        }
        this.setCur(returnToPiece);
        return true;
    }
    checkmate() {
        /* 
        - make current color lose by display message
        - End game
        - reset board
         */
        this.triggerHandler("checkmate", this.turn);
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
        this.triggerHandler("changeTurn", this.turn);
    }


}