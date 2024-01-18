export class Piece {
    constructor(pos, rank, color, name) {
        this.pos = parseInt(pos);
        this.color = color;
        this.name = name;
        this.rank = rank;
    }
    setPos(pos) {
        this.pos = pos;
    }
    getAvaliableMoves() {
        return [];
    }
    getTopMoves() {
        const moves = [];
        for (let i = this.pos; i >= 11; i -= 10) {
            if (this.pos == i) continue;
            moves.push(i);
        }
        return moves;

    }
    getBottomMoves() {
        const moves = [];
        for (let i = this.pos; i <= 88; i += 10) {
            if (this.pos == i) continue;
            moves.push(i);
        }
        return moves;
    }
    getRightMoves() {
        const moves = [];
        const lastIndex = Math.floor(this.pos / 10) * 10 + 8;
        for (let i = this.pos; i <= lastIndex; i++) {
            if (this.pos == i) continue;
            moves.push(i);
        }
        return moves;
    }
    getLeftMoves() {
        const moves = [];
        const lastIndex = Math.floor(this.pos / 10) * 10 + 1;
        for (let i = this.pos; i >= lastIndex; i--) {
            if (this.pos == i) continue;
            moves.push(i);
        }
        return moves;
    }
    getTopLeftMoves() {
        const moves = [];
        const cant = (val => (val < 10 || val % 10 === 0));
        for (let i = this.pos; !cant(i); i -= 11) {
            if (this.pos == i) continue;
            moves.push(i);
        }
        return moves;
    }
    getTopRightMoves() {
        const moves = [];
        const cant = (val => (val < 10 || val % 10 === 9));
        for (let i = this.pos; !cant(i); i -= 9) {
            if (this.pos == i) continue;
            moves.push(i);
        }
        return moves;
    }
    getBottomRightMoves() {
        const moves = [];
        const cant = (val => (val > 88 || val % 10 === 9));
        for (let i = this.pos; !cant(i); i += 11) {
            if (this.pos == i) continue;
            moves.push(i);
        }
        return moves;
    }
    getBottomLeftMoves() {
        const moves = [];
        const cant = (val => (val > 88 || val % 10 === 0));
        for (let i = this.pos; !cant(i); i += 9) {
            if (this.pos == i) continue;
            moves.push(i);
        }
        return moves;
    }

}