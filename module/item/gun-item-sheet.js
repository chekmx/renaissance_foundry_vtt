/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class RenaissanceGunItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["renaissance", "sheet", "gun"],
      width: 650,
      height: 450,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }],
      template:  "systems/renaissance/templates/item/item-gun-sheet.html"
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
    let combatSkills = { 
        "Gun Combat":  "Gun Combat" };
    let combatSizes = { "S" : "S", "M" : "M", "L" : "L", "H" : "H" }
    sheetData.combatSkills = combatSkills;
    sheetData.combatSizes = combatSizes;
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

    // Roll handlers, click handlers, etc. would go here.
  }
}
