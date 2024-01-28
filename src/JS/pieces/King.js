import { Piece } from "./Piece";

export class King extends Piece {
    constructor(pos, color, name) {
        super(pos, "king", color, name);
    }
    getAllowedMoves() {
        return [this.pos + 1, this.pos - 1,
        this.pos + 11, this.pos - 11,
        this.pos + 9, this.pos - 9,
        this.pos + 10, this.pos - 10].filter(poos => this.validPos(poos));
    }
    /* Block moves
        - cant move to square that make it check
            - Iterate over all enemy pieces
            - remove intersected squares between enemy and king
    */
}