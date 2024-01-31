unblockedMoves(piece) {
    let allowedMoves = piece.getAllowedMoves();
    const toRemove = [];

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

        console.log(allowedMoves.filter(pos => (this.myKingChecked(pos))));
        return [...allowedMoves, ...this.enPassentMoves(piece)];
    }

    const arrOfPieces = allowedMoves.map(ele => this.getPieceByPos(ele));

    for (const ele of arrOfPieces) {

        if (!ele) continue;
        if (toRemove.indexOf(ele.pos) !== -1) continue;

        // remove ele if friend
        if (ele.color === this.turn)
            toRemove.push(ele.pos);
        if (piece.name === "rook" && ele.name === "king" && this.canCastle(ele, piece))
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

    if (piece.name === "king" && piece.color === this.turn) {
        let enemyPieces = this.pieces.filter(en => en.color !== piece.color);
        console.log(enemyPieces);
        enemyPieces.forEach(en => {
            toRemove.push(...this.getPieceAllowedMoves(en));
        })
    }


    allowedMoves = allowedMoves
        .filter(pos => (toRemove.indexOf(pos) === -1));
    // console.log(allowedMoves);
    return allowedMoves;
}