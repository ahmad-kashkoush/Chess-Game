import { Piece } from "./Piece";

export class Pawn extends Piece {
    constructor(pos, color, name) {
        super(pos, 'Pawn', color, name);
    }

    getAllowedMoves() {
        const sign = this.color === "white" ? -1 : 1;
        return [this.pos + 10 * sign, this.pos + 20 * sign,
        this.pos + 9 * sign, this.pos + 11 * sign // second two is for Attack moves
        ].filter(poos => this.validPos(poos));

    }
}



// testPawn(new Pawn(55, "black", "pawn1"))
// testPawn(new Pawn(11, "black", "pawn2"))