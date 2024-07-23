import type { BoardIndex } from "../BoardIndex";
import type { ChessState } from "../ChessState";
import type { Piece } from "./Piece";


export const enum MoveType {
    Movement,
    Attack
}

export abstract class Move {
    public abstract readonly type: MoveType;


    public constructor(
        public readonly from: BoardIndex,
        public readonly to: BoardIndex,
        public readonly state: ChessState
    ) {
    }


    protected get piece(): Piece { // Is also a brand.
        return this.state.mutableBoard[this.from]!;
    }


    /** @internal */
    public abstract apply(): Rollback;
}

export type Rollback = () => void;


export class MovementMove extends Move {
    /** @sealed */
    public override get type(): MoveType.Movement {
        return MoveType.Movement;
    }


    public override apply(): Rollback {
        const { piece, from, to } = this;
        piece.move(to);
        const previousIsMoved = piece.isMoved;
        piece.setIsMoved(true);

        return () => {
            piece.setIsMoved(previousIsMoved);
            piece.move(from);
        };
    }
}


export class AttackMove extends Move {
    /** @sealed */
    public override get type(): MoveType.Attack {
        return MoveType.Attack;
    }


    public override apply(): Rollback {
        const { piece, from, to } = this;
        const enemyPiece = this.state.mutableBoard[to]!;
        enemyPiece.delete();
        piece.move(to);
        const previousIsMoved = piece.isMoved;
        piece.setIsMoved(true);

        return () => {
            piece.setIsMoved(previousIsMoved);
            piece.move(from);
            enemyPiece.restore();
        };
    }
}
