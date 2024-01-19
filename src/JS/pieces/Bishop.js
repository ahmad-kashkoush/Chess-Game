import { Piece } from "./Piece";

export class Bishop extends Piece {
    constructor(pos, color, name) {
        super(pos, "bishop", color, name);
    }
    getAllowedMoves() {
        return [
            ...this.getTopLeftMoves(),
            ...this.getTopRightMoves(),
            ...this.getBottomLeftMoves(),
            ...this.getBottomRightMoves()
        ];
    }
}