/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([
  
      // Shared Partials
      //"systems/dnd5e/templates/actors/parts/active-effects.html",
  
      // Actor Sheet Partials
      "systems/renaissance/templates/actor/parts/character-summary.html",
      "systems/renaissance/templates/actor/parts/character-biography.html", 
      "systems/renaissance/templates/actor/parts/character-item-list.html", 
      "systems/renaissance/templates/actor/parts/character-weapon-list.html",   
      "systems/renaissance/templates/actor/parts/character-skill-list.html",
      "systems/renaissance/templates/actor/parts/character-spell-list.html",  
      "systems/renaissance/templates/actor/parts/character-header.html",
      "systems/renaissance/templates/actor/parts/character-stats.html",
      // Item Sheet Partials
    ]);
  };
  