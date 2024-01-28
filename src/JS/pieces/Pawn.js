import { Piece } from "./Piece";

export class Pawn extends Piece {
    constructor(pos, color, name) {
        super(pos, 'Pawn', color, name);
        this.firstTwoStep = true;

    }
    setPos(position) {
        this.pos = position;
        this.firstTwoStep = false;
    }
    /*  Pawn Logic 
     - Can move two squares on first move

     */
    validConrnerMove(destination) {
        const destElement = document.querySelector(`[data-pos="${destination}"] img`);
        if (!destElement) return false;
        console.log(destElement);
        return true;

    }
    getAllowedMoves() {
        const sign = this.color === "white" ? -1 : 1;

        const cornerMoves = [this.pos + 9 * sign, this.pos + 11 * sign].filter(poos => this.validPos(poos) && this.validConrnerMove(poos));

        const allowedMoves = [this.pos + 10 * sign, ...cornerMoves];
        if (this.firstTwoStep) allowedMoves.push(this.pos + 20 * sign);
        return allowedMoves.filter(poos => this.validPos(poos));

    }
}



// testPawn(new Pawn(55, "black", "pawn1"))
// testPawn(new Pawn(11, "black", "pawn2"))