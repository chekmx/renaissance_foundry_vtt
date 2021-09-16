import { getBaseSkill } from '../rules/getBaseSkill.js'
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class RenaissanceCharacterSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["renaissance", "sheet", "actor", "character"],
      width: 1200,
      height: 1000,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/renaissance/templates/actor";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/${this.actor.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const baseData = super.getData();
    let sheetData={
      owner: this.actor.isOwner,
      editable: this.isEditable,
      actor: baseData.actor,
      items: baseData.items,
      data: baseData.actor.data.data
    }
    sheetData.dtypes = ["String", "Number", "Boolean"];

    // Prepare items.
    if (this.actor.data.type == 'character') {
      for (let attr of Object.values(sheetData.data.attributes)) {
        attr.isCheckbox = attr.dtype === "Boolean";
      }
    }
    let orderTypes = { 0: "Combat", 1: "Spell" }
    sheetData.orderTypes = orderTypes
    this._prepareCharacterItems(sheetData);
    return sheetData;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;

 
    // Initialize containers.
    const gear = [];
    const skills = [];

    const spells = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: []
    };

    // Iterate through items, allocating to containers
    
    for (let i of sheetData.items) {
      //let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item'  || i.type === 'armour'  || i.type === 'weapon') {
        gear.push(i);
      }
      // Append to skills.
      else if (i.type === 'skill') {
        i.data.baseSkill = getBaseSkill(actorData, i)
        if(i.data.value == null || i.data.value == 0){
          i.data.value = i.data.baseSkill;
        }
        skills.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.data.magnitude != undefined) {
          spells[i.data.magnitude].push(i);
        }
      }
    }

    // Assign and return
    actorData.gear = gear;
    actorData.skills = skills;
    actorData.spells = spells;

    console.log(actorData);
    let baseMagick =  Math.ceil((actorData.data.data.abilities.int.value + actorData.data.data.abilities.pow.value) / 10);

    if(baseMagick > actorData.data.magick || actorData.data.magick == undefined){
      actorData.data.magick = baseMagick;
    }

    actorData.currentArmour = actorData.gear.filter( function (e) {
      return e.type === "armour"
    })[0];

    actorData.weapons = actorData.gear.filter( function (e) {
      return e.type === "weapon"
    });

    if(actorData.currentArmour){
      actorData.combatOrder = actorData.data.data.abilities.dex.value - actorData.currentArmour.data.points;
      actorData.spellOrder = actorData.data.data.abilities.int.value - actorData.currentArmour.data.points;
    } else {
      actorData.combatOrder = actorData.data.data.abilities.dex.value;
      actorData.spellOrder = actorData.data.data.abilities.int.value ;
    }
    if(actorData.data.data.orderType == "0") {
      console.log(`use combat order ${actorData.combatOrder}`);
      actorData.data.combatOrder = actorData.combatOrder;
      
    } else {
      console.log(`use spell order ${actorData.spellOrder}`);
      actorData.data.combatOrder = actorData.spellOrder;    
    }
    this.actor.setTurnOrder(actorData.data.combatOrder);
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // html.find('.item-update').change( ev =>{
    //   const li = $(ev.currentTarget).parents(".item");
    //   console.log(li);
    //   const item = this.actor.items.get(li.data("itemId"));
    // });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // TO DO confirm if this is used  
    // combat-type selector 
    html.find('.order-selector').click(this._onOrderSelector.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {

    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    return item.roll();
  }

  /**
   * Handle spawning the TraitSelector application which allows a checkbox of multiple trait options
   * @param {Event} event   The click event which originated the selection
   * @private
   */
   _onOrderSelector(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const label = a.parentElement.querySelector("label");
    //const choices = CONFIG.DND5E[a.dataset.options];
    const options = { name: a.dataset.target, title: label.innerText, choices };
    //return new TraitSelector(this.actor, options).render(true)
  }

  async _updateObject(event, formData){
    if(event.currentTarget){
      if(event.currentTarget.classList.contains('input-skill-edit')){
        //console.log(event.currentTarget.closest('.item').dataset)
        const item = this.actor.items.get(event.currentTarget.closest('.item').dataset.itemId)
        //console.log(event.currentTarget.value)
        item.update({'data.value': event.currentTarget.value})
      }
    }

    return super._updateObject(event, formData)
  }

}
