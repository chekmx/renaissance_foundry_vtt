/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class RenaissanceWeaponItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["renaissance", "sheet", "weapon"],
      width: 620,
      height: 580,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      template:  "systems/renaissance/templates/item/item-weapon-sheet.html"
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    let combatSkills = { 
      "Close Combat" : "Close Combat",
       "Close Combat (Polearms)" : "Close Combat (Polearms)",
        "Gun Combat":  "Gun Combat",
        "Ranged Combat": "Ranged Combat",
        "Ranged Combat (Bow)" :  "Ranged Combat (Bow)",
        "Unarmed Combat" : "Unarmed Combat" };
    let combatSizes = { "S" : "S", "M" : "M", "L" : "L", "H" : "H" }
    data.combatSkills = combatSkills;
    data.combatSizes = combatSizes;
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}
