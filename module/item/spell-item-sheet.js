/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class RenaissanceSpellItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["renaissance", "sheet", "spell"],
      width: 750,
      height: 550,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      template:  "systems/renaissance/templates/item/item-spell-sheet.html"
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    let spellSkills = { 
      "Elemental Casting (Air)" : "Elemental Casting (Air)",
      "Elemental Casting (Earth)" : "Elemental Casting (Earth)",
      "Elemental Casting (Fire)" : "Elemental Casting (Fire)",
      "Elemental Casting (Water)" : "Elemental Casting (Water)",
      "Witchcraft" :  "Witchcraft" };

    let resistances = {
      "" : "",
      "Dodge" : "Dodge",
      "Persistence" : "Persistence",
      "Resilience" : "Resilience",
    }

    data.resistances = resistances
    data.spellSkills = spellSkills
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
  }
}
