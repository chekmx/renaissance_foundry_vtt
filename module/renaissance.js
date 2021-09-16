// Import Modules
import { RenaissanceActor } from "./actor/actor.js";
import { RenaissanceCharacterSheet } from "./actor/character-sheet.js";
import { RenaissanceCreatureSheet } from "./actor/creature-sheet.js"
import { RenaissanceItem } from "./item/item.js";
import { RenaissanceItemSheet } from "./item/item-sheet.js";
import { RenaissanceWeaponItemSheet } from "./item/weapon-item-sheet.js"
import { RenaissanceSpellItemSheet } from "./item/spell-item-sheet.js"
import { RenaissanceSkillItemSheet } from "./item/skill-item-sheet.js"
//import { _getInitiativeFormula } from "./module/combat.js";

Hooks.once('init', async function() {

  game.renaissance = {
    RenaissanceActor,
    RenaissanceItem,
    rollItemMacro
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "@combatOrder",
    decimals: 2
  };
  //Combat.prototype._getInitiativeFormula = _getInitiativeFormula;


  // Define custom Entity classes
  CONFIG.Actor.documentClass = RenaissanceActor;
  CONFIG.Item.documentClass = RenaissanceItem;
  CONFIG.time.roundTime = 5;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("renaissance", RenaissanceCharacterSheet, { types: ['character'], makeDefault: true });
  Actors.registerSheet("renaissance", RenaissanceCreatureSheet, {  types: ['creature'], makeDefault: true });
  
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("renaissance", RenaissanceItemSheet, { types: ['item', "fatigue", "armour", "faction"], makeDefault: true });
  Items.registerSheet("renaissance", RenaissanceWeaponItemSheet, { types: ['weapon'], makeDefault: true });
  Items.registerSheet("renaissance", RenaissanceSpellItemSheet, { types: ['spell'], makeDefault: true });
  Items.registerSheet("renaissance", RenaissanceSkillItemSheet, { types: ['skill'], makeDefault: true });
  
 
  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createBoilerplateMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createBoilerplateMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.renaissance.rollItemMacro("${item.name}");`;
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "renaissance.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}