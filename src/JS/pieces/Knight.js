import { Piece } from "./Piece";
export class Knight extends Piece {
    constructor(pos, color, name) {
        super(pos, 'knight', color, name);
    }
    /* Knigh Rules
    - Can bypass pieces to goes in its way
     */
    getAllowedMoves() {
        return [
            this.pos + 20 + 1, this.pos + 20 - 1,
            this.pos - 20 + 1, this.pos - 20 - 1,
            this.pos + 2 - 10, this.pos + 2 + 10,
            this.pos - 2 - 10, this.pos - 2 + 10
        ].filter(poss => this.validPos(poss));

    }
}

