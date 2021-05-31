/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class BoilerplateActor extends Actor {

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
    console.log(data);
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2);
    }
 
    var damgeModSizeAndStr = data.abilities.str.value + data.abilities.siz.value
    if (damgeModSizeAndStr <= 10){
      data.damageModifier = "-1d6";
    } else if (damgeModSizeAndStr <= 15) {
      data.damageModifier = "-1d4";
    } else if (damgeModSizeAndStr <= 25) {
      data.damageModifier = "";
    }  else if (damgeModSizeAndStr <= 30) {
      data.damageModifier = "+1d4";
    }  else if (damgeModSizeAndStr > 30) {
      var numberOfD6s = Math.ceil((damgeModSizeAndStr - 30)/15) 
      data.damageModifier = `+${numberOfD6s}d6`;
    } else {
      data.damageModifier = data.abilities.str.value + data.abilities.siz.value //this._calculateDamageModifier(actorData);
    }
      
    data.hitPoints = Math.ceil((data.abilities.con.value + data.abilities.siz.value) / 2);
    data.majorWoundLevel = Math.ceil(data.hitPoints / 2);
    data.movementRate = 15;
  }

  async testMethod(){
    console.log("Test Method");
  }
}