import { Piece } from "./Piece";

export class Rook extends Piece {
    constructor(pos, color, name) {
        super(pos, "rook", color, name);
        this.isAbleToCastle = true;
    }
    setPos(position) {
        this.pos = position;
        this.isAbleToCastle = false;
    }

    getAllowedMoves() {
        return [...this.getBottomMoves(), ...this.getTopMoves(), ...this.getLeftMoves(), ...this.getRightMoves()];
    }
}