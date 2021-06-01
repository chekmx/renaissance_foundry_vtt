/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class BoilerplateItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
    if(itemData.type === "armour"){
      data.gunPoints = Math.floor(data.points / 2);
    }
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    // Basic template rendering data
    const token = this.actor.token;
    const item = this.data;
    const actorData = this.actor ? this.actor.data.data : {};
    const itemData = item.data;

    let roll = new Roll('1d100', actorData);
    roll.evaluate();  

    console.log(item);
    console.log(this.actor);


    if(item.type == "weapon"){
      let damageRoll = new Roll(itemData.damage, actorData);
      damageRoll.evaluate();

      let skill = this.actor.items.filter( (i) => i.data.type === "skill" && i.data.name === item.data.skill)[0];

      console.log(skill);
      let successDisplay = roll.result == 100 ? "FUMBLE" : roll.result <= skill.data.value / 10 ? "CRITICAL" : roll.result <= skill.data.value ? "SUCCESS" : "FAIL"
      
      let chatData = {
        type: CHAT_MESSAGE_TYPES.ROLL,
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({actor: this.actor}),
        roll: roll,
        rollMode: game.settings.get("core", "rollMode"),
        content:  `<p><b>${successDisplay}</b><br>  
                  Against Target <b>${skill.data.data.value}</b>
                  with a roll of <b>${roll.result}</b></p>
                  damage = ${damageRoll.result}
                  ${skill.data.data.description}`
        };
        ChatMessage.create(chatData);
    } else {
    //TO DO: Handle skills > 100.  check if auto fail for 95-99 

      let successDisplay = roll.result == 100 ? "FUMBLE" : roll.result <= item.data.value / 10 ? "CRITICAL" : roll.result <= item.data.value ? "SUCCESS" : "FAIL"
      
      let chatData = {
        type: CHAT_MESSAGE_TYPES.ROLL,
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({actor: this.actor}),
        roll: roll,
        rollMode: game.settings.get("core", "rollMode"),
        content:  `<p><b>${successDisplay}</b><br>  
                  Against Target <b>${item.data.value}</b>
                  with a roll of <b>${roll.result}</b></p>
                  ${item.data.description}`
        };
        ChatMessage.create(chatData);
    }
  }
}
