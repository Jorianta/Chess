// import { ButtonBuilder, StringSelectMenuBuilder } from "@discordjs/builders";
// import { FarkleRound } from "./farkleround.js";
// import { ActionRowBuilder, ButtonInteraction, ButtonStyle, ComponentType, Interaction, InteractionCollector, InteractionResponse, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
// import { DiceEmoji } from "../../utility/dice.js";
// import { delay, endWith, fromEvent, ignoreElements } from "rxjs";

// export class FarkleBoard{

    
//     private diceSelector: ButtonBuilder[]

//     private submitCollector: InteractionCollector<ButtonInteraction>
//     private submitButton = new ButtonBuilder().setCustomId('submit').setLabel("Keep Dice").setStyle(ButtonStyle.Success)

//     private selected: boolean[]

//     constructor(private response: InteractionResponse , private game: FarkleRound){

//         this.game.score$.pipe(ignoreElements(), endWith(false)).subscribe(_ => this.diceSelector.setDisabled(true))
        
//         console.log("Making interaction collectors")
  
//         this.submitCollector = response.createMessageComponentCollector({
//             componentType: ComponentType.Button,
//             time: 600000
//         })

        
//         fromEvent(this.submitCollector, "collect").pipe(delay(100)).subscribe(_ => { 
//             this.submit()
//         })

//         this.updateBoard()

//     }

//     private static buildSelector(){
//         let out = []
//         for(let i=0; i<=6; i++){
//             out.push(
//                 new ButtonBuilder().setCustomId(i.toString()).setLabel(DiceEmoji[0])
//             )
//         }

//         return out
//     }

//     public getBoard(){
//         console.log("getting game board")
//         return [
//             // new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([this.diceSelector]),
//             // new ActionRowBuilder<ButtonBuilder>().addComponents(this.submitButton)
//         ]
//     }

//     private updateSelection(selection: string[]){

//         let boolArr = this.game.constructSelectArray();

//         selection.forEach(index => {
//             const i = parseFloat(index)
//             boolArr[i] = true;
//         })

//         this.selected = boolArr;
//     }
    
//     private updateBoard(){
//         console.log("Updating Board")
//         console.log("updating locked")

//         this.locked
//         .setOptions(
//             this.game.getCurrentHands().flat().map(die => 
//                 new StringSelectMenuOptionBuilder({label: DiceEmoji[die], value: "X"})
//             )
//         )

//         console.log("updating selector")

//         const selectable = this.game.getCurrentRoll().map((die, i) => 
//             new StringSelectMenuOptionBuilder({label: DiceEmoji[die], value: i.toString()})
//         )
//         try{
//         this.diceSelector
//         .setOptions(
//             ...selectable
//         )} catch(e) {
//             console.log(e)
//             console.log(this.game.getCurrentRoll())
//         }
//         console.log("done")
//     }

//     private submit() {
//         console.log("Submitting")
//         const stay = this.selected.length >= this.diceSelector.options.length

//         if(!this.game.tryAcceptDice(this.selected)) return false;

//         if(stay) return true;

//         this.game.roll()
//         this.updateBoard()

//         return true
//     }
// }