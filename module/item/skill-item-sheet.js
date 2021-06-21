import { getBaseSkill } from '../rules/getBaseSkill.js'
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
    const data = super.getData();
    let abilities = { Str : "Strength", Con : "Constitution", Siz : "Size", Int: "Intelligence", Pow :"Power", Dex :"Dexterity", Cha :"Charisma"};
    data.abilities = abilities;
    if(data.data.value == null || data.data.value == 0){
      data.data.value = data.data.baseSkill
    }
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

     // combat-type selector
//     html.find('.order-selector').click(this._onOrderSelector.bind(this));

    // Roll handlers, click handlers, etc. would go here.
  }
}
