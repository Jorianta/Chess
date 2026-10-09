import { match } from "assert";
import { extreme } from "../../utility/array.js";
import { rollDice } from "../../utility/dice.js";
import { BehaviorSubject, ignoreElements, Subject } from "rxjs";

export class FarkleRound {

    private static OfAKind = /([0-9])\1{2,}/g
    private static Straight = /6*5+4+3+2+1*/
    
    private hands: number[][] = [];

    private rolled = rollDice(6,6)[0]

    private farkle = false

    private accepted = 0;
    private get inPlay(){
        return 6-this.accepted
    }

    private _scoreSubject = new BehaviorSubject(0)
    public score$ = this._scoreSubject.asObservable()

    private rollReady = false;

    get score() {
        return this._scoreSubject.value
    }
    
    toString(){
        return this.printHands() + "\n" + this.rolled.join(" ")
    }

    printHands(){
        return this.hands.flatMap(arr => {
            return arr.join(" ")
        }).join(" | ") 
    }

    getCurrentRoll(){
        return this.rolled
    }

    getCurrentHands(){
        return this.hands
    }

    getState(){
        if(this.farkle) return "Farkle"
        if(this.accepted >= 6) return "Complete";
        return "In Play"
    }

    roll(){
        if(!this.rollReady) return;
        this.rollReady = false;

        const rolls = this.inPlay
        if(rolls <= 0) throw "round is over"

        this.rolled = rollDice(rolls, 6)[0]

        if(FarkleRound.isFarkle(...this.rolled)) {
            this._scoreSubject.next(0);
            this.farkle = true;
            this.stay()
            return;
        }

    }

    tryAcceptDice(accepted: boolean[]): boolean {
        if(accepted.length <= 0 || accepted.every(v => !v)) return false

        const lim = Math.min(this.rolled.length, accepted.length)

        if(lim <=0) return false

        let hand = [];
        let rejected = [];

        let i=0
        for(; i<lim; i++){
            if(accepted[i]) hand.push(this.rolled[i])
            else rejected.push(this.rolled[i])
        }
        
        const rollScore = FarkleRound.scoreHand(...hand)

        if(rollScore <= 0) return false

        this.accepted += hand.length
        this.hands.push(hand)
        this._scoreSubject.next(this.score + rollScore)
        this.rolled = rejected;
        this.rollReady = true;

        return true
    }

    stay(){
        this.tryAcceptDice(this.rolled.map(v => true))
        this.accepted = 6;
        this.rolled = []
        this.rollReady = false;

        this._scoreSubject.complete()
    }

    //assumes dice sorted in descending order
    public static scoreHand(...dice: number[]): number{
        let hand = dice.join('')
        let score=0

        let s = 0;
        
        //score of kinds
        [s, hand] = this.scoreOfAKind(hand)
        score += s;

        //score straights
        [s, hand] = this.scoreStraights(hand)
        score += s

        //score 1s, 5s
        for(let d of hand){
            if(d==='1') score += 100
            else if(d==='5') score += 50
        }
        
        return score
    }
    
    private static scoreOfAKind(hand: string): [number, string]{
        
        const result = hand.matchAll(FarkleRound.OfAKind)
        const unused = hand.replaceAll(FarkleRound.OfAKind, '')

        let score = 0

        for(let ofAKind of result){
            
            const rank = parseFloat(ofAKind[1])

            const bonus = ofAKind[0].length - 3
            const base = rank === 0 ? 1000 : (rank) * 100

            score += base * (2**bonus)
        }

        return [score, unused]
    }

    private static scoreStraights(hand:string): [number, string]{
        const result = FarkleRound.Straight.exec(hand)?.[0] ?? null
        // no straight
        if(result === null || result.length<5) return [0,hand]
        //full straight
        if(result.length >= 6) return [1500, '']

        let score = 500
        const extra = /([0-9])\1/.exec(hand)?.[0] ?? ""

        if(result[0] === '6') score += 250 
        return [score, extra];
    }

    public static isFarkle(...dice: number[]): boolean{
        const hand = dice.join('')

        return ! (FarkleRound.OfAKind.test(hand) || FarkleRound.Straight.test(hand) || hand.includes('5') || hand.includes('1'))
    }

    public constructSelectArray(){
        let out: boolean[] = []
        for(let i = 0; i<this.inPlay; i++) out[i] = false
        return out
    }
}

