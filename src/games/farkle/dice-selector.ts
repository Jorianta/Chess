import { ButtonBuilder, ButtonStyle } from "discord.js"
import { DiceEmoji } from "../../utility/dice"
import { FarkleRound } from "./farkleround"


export class DiceSelector{

    private buttonArray: ButtonBuilder[] = []

    constructor(private game: FarkleRound){
        
        for(let i=1; i<=6; i++){
            this.buttonArray.push(
                new ButtonBuilder().setCustomId(i.toString()).setLabel(DiceEmoji[0]).setStyle(ButtonStyle.Primary)
            )
        }
    }

    updateButtons(){
        const consumed = this.game.getCurrentHands().flat()
        const active = this.game.getCurrentRoll()

        let i = 0;
        for( ; i <consumed.length; i++){
            if(i >= 6) break;

            this.buttonArray[i].setLabel(DiceEmoji[consumed[i]]).setDisabled(true)
        }

        while(i<6){
            this.buttonArray[i].setLabel
        }
    }

    disable(){
        this.buttonArray.forEach(b => b.setDisabled())
    }
}