import { insertSorted } from './array'

export function rollDice(rolls: number, sides: number): [number[], number] {
    if(rolls <= 0 || sides <= 0) throw "Dice need to have at least 2 sides, and you need to roll at least 1 die!"

    let results = []
    let sum = 0

    for(let i=0; i<rolls; i++)
    {
        let r = Math.floor(Math.random()*sides)+1
        sum += r
        insertSorted(r, results, (a,b)=>a-b)
    }

    return [results, sum]
}