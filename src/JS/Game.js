
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
    getPiecesByColor() { return; }
    getPieceByPos(pos) { return this.pieces.find(piece => piece.pos === pos); }
    movePiece(piece, position) {
        if (!piece) return;
        const prevPosition = piece.pos;

        if (this.getPieceAllowedMoves(piece).indexOf(position) === -1)
            return false;

        const pieceInSquare = this.getPieceByPos(position);
        if (pieceInSquare) this.kill(pieceInSquare);
        this.setImage({
            pos: prevPosition,
            truncate: true
        });
        piece.setPos(position);
        this.setImage({ ...piece, truncate: false });
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
                if (ele && Math.abs(ele.pos - piece.pos) !== 11 && Math.abs(ele.pos - piece.pos !== 9))
                    allowedMoves.splice(allowedMoves.indexOf(ele.pos), 1);

            });

            return allowedMoves;
        }

        const arrOfPieces = allowedMoves.map(ele => this.getPieceByPos(ele));

        const toRemove = [];
        for (const ele of arrOfPieces) {

            if (!ele) continue;
            if (toRemove.indexOf(ele.pos) !== -1) continue;

            // remove ele if friend
            if (ele.color === this.turn)
                toRemove.push(ele.pos);
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
    promote() { }
    enPassent() {
        /* Case
            - When friend pawn goes two moves 
            - friend pawn crossed potential capture square for enemy pawn
         What Happens?
            - enemy pawn can still capture it
            - you mark crossed square as available 
            - moving to crossed means killing friend pawn
        */
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
    castling() {
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

    }
    changeTurn() {
        this.turn = this.turn === "white" ? "black" : "white";
    }


}