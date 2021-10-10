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
    const baseData = super.getData();
    let sheetData={
      owner: this.item.isOwner,
      editable: this.isEditable,
      item: baseData.item,
      data: baseData.item.data.data
    }
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

    sheetData.resistances = resistances
    sheetData.spellSkills = spellSkills
    return sheetData;
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
