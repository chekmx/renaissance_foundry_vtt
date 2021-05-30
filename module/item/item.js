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
    // let label = `Rolling ${item.name}`;
    // roll.roll().toMessage({
    //   speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    //   flavor: label
    // });

    //TO DO: Handle skills > 100.  check if auto fail for 95-99 
    let successDisplay = roll.result == 100 ? "FUMBLE" : roll.result <= item.data.value / 10 ? "CRITICAL" : roll.result <= item.data.value ? "SUCCESS" : "FAIL"
    
    let chatData = {
      type: CHAT_MESSAGE_TYPES.ROLL,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      roll: roll,
      rollMode: game.settings.get("core", "rollMode"),
      content:  `<p><b>${successDisplay}</b><br>  
                 Against Target <b>${item.data.value}</b>
                 with a roll of <b>${roll.result}</b></p>`
      };
      ChatMessage.create(chatData);
  }
}
