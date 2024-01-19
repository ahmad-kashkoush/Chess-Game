import { Piece } from "./Piece";

export class Rook extends Piece {
    constructor(pos, color, name) {
        super(pos, "rook", color, name);
    }
    getAllowedMoves() {
        return [...this.getBottomMoves(), ...this.getTopMoves(), ...this.getLeftMoves(), ...this.getRightMoves()];
    }
}