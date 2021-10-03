import { rollWeapon } from '../rules/rollWeapon.js'
import { rollSkill } from '../rules/rollSkill.js'
import { rollSpell } from '../rules/rollSpell.js'
//import { getBaseSkill} from '../rules/getBaseSkill.js'
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
    
    // if(itemData.type == "skill"){
    //   data.baseSkill = getBaseSkill(actorData, itemData, data);
    //   if( data.value == 0){
    //     data.value = data.baseSkill
    //   }
    // }
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll(asClub = false) {
    // Basic template rendering data
    const token = this.actor.token;
    const item = this.data;
    
    if(item.type == "melee weapon" || item.type == "gun" || item.type == "ranged weapon"){
      await rollWeapon(this.actor, item, token, asClub);
    } else if (item.type == "spell") {
      await rollSpell(this.actor, item, token)
    } else {
      await rollSkill(this.actor, item, token)
    }
  }
}
