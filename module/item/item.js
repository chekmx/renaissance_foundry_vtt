import { rollWeapon } from '../rules/rollWeapon.js'
import { rollSkill } from '../rules/rollSkill.js'
import { rollSpell } from '../rules/rollSpell.js'

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
    
    //CalculateBaseSkill
    if(itemData.type == "skill"){
      this.setBaseSkill(actorData, itemData, data);
    }
    //this.update({"data.baseSkill" : data.baseSkill});
    //console.log(this)
  }

  async setBaseSkill(actorData, itemData, data) {
    if (this.actor) {
      let baseAbility1 = this.getAbility(actorData, itemData.data.base1.toLowerCase());
      let baseAbility2 = this.getAbility(actorData, itemData.data.base2.toLowerCase());
      // let base2Attribute = Object.entries(actorData.data.abilities)[itemData.data.base2.toLowerCase()];
      data.baseSkill = baseAbility1.value + baseAbility2.value;
      
    }
  }

  getAbility(actorData, abilityName) {
    let ability ={};
    Object.entries(actorData.data.abilities).forEach((pair) => {

      if (pair[0] == abilityName) {
        ability = pair[1];
      }
    });
    return ability;
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
      await rollWeapon(this.actor, item, roll, token);
    } else if (item.type == "spell") {
      await rollSpell(this.actor, item, roll, token)
    } else {
      await rollSkill(this.actor, item, roll, token)
    }
  }
}
