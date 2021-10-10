import { getDamageModifier } from "../rules/getDamageModifier.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class RenaissanceActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character' || actorData.type === 'creature') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;

    // Make modifications to data here. For example:
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2);
    }
 
    data.damageModifier = getDamageModifier(data.abilities.str.value + data.abilities.siz.value);
      
    data.health.max = Math.ceil((data.abilities.con.value + data.abilities.siz.value) / 2);
    data.majorWoundLevel = Math.ceil(data.health.max / 2);
    data.movementRate = 15;
  }

  async setTurnOrder(order){
    await this.update({"data.combatOrder" : order});
  }
}


