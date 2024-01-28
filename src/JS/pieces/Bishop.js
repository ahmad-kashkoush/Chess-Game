import { Piece } from "./Piece";

export class Bishop extends Piece {
    constructor(pos, color, name) {
        super(pos, "bishop", color, name);
    }

    /*  Bishop Logic
    - We have 2 bishops [one on light square, other on dark]
    - Each Bishop can move only on its diagonal either light, or black diagonal
      
    
    */
    getAllowedMoves() {
        return [
            ...this.getTopLeftMoves(),
            ...this.getTopRightMoves(),
            ...this.getBottomLeftMoves(),
            ...this.getBottomRightMoves()
        ];
    }
}