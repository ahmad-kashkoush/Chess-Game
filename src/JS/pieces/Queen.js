import { Piece } from "./Piece";

export class Queen extends Piece {
    constructor(pos, color, name) {
        super(pos, "queen", color, name);
    }
    getAllowedMoves() {
        return [
            ...this.getTopMoves(),
            ...this.getBottomMoves(),
            ...this.getRightMoves(),
            ...this.getLeftMoves(),
            ...this.getTopLeftMoves(),
            ...this.getTopRightMoves(),
            ...this.getBottomLeftMoves(),
            ...this.getBottomRightMoves()
        ];
    }
}