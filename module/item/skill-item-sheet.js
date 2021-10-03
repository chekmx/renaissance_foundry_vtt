//import { getBaseSkill } from '../rules/getBaseSkill.js'
/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class RenaissanceSkillItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["renaissance", "sheet", "skill"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      template:  "systems/renaissance/templates/item/item-skill-sheet.html"
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
    let abilities = { Str : "Strength", Con : "Constitution", Siz : "Size", Int: "Intelligence", Pow :"Power", Dex :"Dexterity", Cha :"Charisma"};
    sheetData.abilities = abilities;
    if(sheetData.data.value == null || sheetData.data.value == 0){
      sheetData.data.value = sheetData.data.baseSkill
    }
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

     // combat-type selector
//     html.find('.order-selector').click(this._onOrderSelector.bind(this));

    // Roll handlers, click handlers, etc. would go here.
  }
}
