import { rollWeapon } from '../rules/rollWeapon.js'
import { rollSkill } from '../rules/rollSkill.js'

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class RenaissanceItem extends Item {
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

    if(item.type == "weapon"){
      let damageRoll = new Roll(itemData.damage, actorData);
      damageRoll.evaluate();

      await rollWeapon(this.actor, item, roll, damageRoll, token);
    } else {
      await rollSkill(this.actor, item, roll, token)
    }
  }
}
