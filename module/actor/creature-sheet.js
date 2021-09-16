/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class RenaissanceCreatureSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["renaissance", "sheet", "actor", "creature"],
      template: "systems/renaissance/templates/actor/creature-sheet.html",
      width: 1000,
      height: 650,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  // /** @override */
  // get template() {
  //   const path = "systems/renaissance/templates/actor";
  //   // Return a single sheet for all item types.
  //   // return `${path}/item-sheet.html`;

  //   // Alternatively, you could use the following return statement to do a
  //   // unique item sheet by type, like `weapon-sheet.html`.
  //   return `${path}/${this.actor.data.type}-sheet.html`;
  // }

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

    //console.log(data)
    
    // Prepare items.
    if (this.actor.data.type == 'character') {
      for (let attr of Object.values(sheetData.data.attributes)) {
        attr.isCheckbox = attr.dtype === "Boolean";
      }
    }
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
    const skills = [];
    const gear = [];
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
    // let totalWeight = 0;
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item'  || i.type === 'armour'  || i.type === 'weapon') {
        gear.push(i);
      }
      // Append to skills.
      else if (i.type === 'skill') {
        skills.push(i);
      }
    }
    actorData.data.data.armour.gunpoints = Math.floor(actorData.data.data.armour.points / 2);
    // Assign and return
    actorData.gear = gear;
    actorData.skills = skills;
    actorData.spells = spells;

    actorData.weapons = actorData.gear.filter( function (e) {
      return e.type === "weapon"
    });

    actorData.data.combatOrder = actorData.data.data.abilities.dex.value;
    this.actor.setTurnOrder(actorData.data.data.abilities.dex.value);
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

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

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

  async _updateObject(event, formData){
    if(event.currentTarget){
      if(event.currentTarget.classList.contains('input-skill-edit')){
        //console.log(event.currentTarget.closest('.item').dataset)
        const item = this.actor.items.get(event.currentTarget.closest('.item').dataset.itemId)
        //console.log(event.currentTarget.value)
        item.update({'data.value': event.currentTarget.value})
      }

      if(event.currentTarget.classList.contains('input-weapon-name')){
        //console.log(event.currentTarget.closest('.item').dataset)
        const item = this.actor.items.get(event.currentTarget.closest('.item').dataset.itemId)
        console.log(event.currentTarget.value)
        item.update({'name': event.currentTarget.value})
      }

      if(event.currentTarget.classList.contains('input-weapon-skill')){
        //console.log(event.currentTarget.closest('.item').dataset)
        const item = this.actor.items.get(event.currentTarget.closest('.item').dataset.itemId)
        console.log(event.currentTarget.value)
        item.update({'data.skill': event.currentTarget.value})
      }

      if(event.currentTarget.classList.contains('input-weapon-damage')){
        //console.log(event.currentTarget.closest('.item').dataset)
        const item = this.actor.items.get(event.currentTarget.closest('.item').dataset.itemId)
        console.log(event.currentTarget.value)
        item.update({'data.damage': event.currentTarget.value})
      }
    }

    return super._updateObject(event, formData)
    }
  }
