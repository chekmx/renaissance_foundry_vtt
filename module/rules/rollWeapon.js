import { D100Roll } from "./D100Roll.js";

export async function rollWeapon(actor, item, token) {

    const itemData = item.data;
    const actorData = actor ? actor.data.data : {};

    let modifier = 0;
    let reason = "";
    if(actor.data.data.abilities.str.value < item.data.minimumStr) {
      reason = `${item.name} requires ${item.data.minimumStr} strength`
      modifier = -20;
    }
    if (actor.data.data.abilities.dex.value < item.data.minimumDex){
      reason = `${item.name} requires ${item.data.minimumDex} dexterity`
      modifier = -20;
    }

    let roll = new Roll('1d100', actorData);
    roll.evaluate();  

    let skill = actor.items.filter((i) => i.data.type === "skill" && i.data.name === itemData.skill)[0];

    let damageRoll = "";
    if(hasDamageModifier(skill)){
      damageRoll = new Roll(itemData.damage + actor.data.data.damageModifier, actor.data);
    } else {
      damageRoll = new Roll(itemData.damage, actor.data);
    }

    damageRoll.evaluate();

    let successDisplay = D100Roll(roll, skill.data, modifier)

    const template = `systems/renaissance/templates/chat/weapon-card.html`;

    let templateData = {
      actor: actor,
      tokenId: token ? `${token.scene._id}.${token.id}` : null,
      success: successDisplay,
      modifier: { "reason": reason, "value" : modifier },
      skillData: skill.data,
      item: item,
      roll: roll,
      damageRoll: damageRoll
    };

    if (game.dice3d) {
      await game.dice3d.showForRoll(roll, game.user, true);
      await game.dice3d.showForRoll(damageRoll, game.user, true);
    }

    await renderTemplate(template, templateData).then(content => {
      ChatMessage.create({
        user: game.user._id,
        speaker :ChatMessage.getSpeaker({actor: actor}),
        content: content
      });
    });


}

function hasDamageModifier(skill) {
  return skill.name != "Gun Combat" && skill.name != "Ranged Combat" && skill.name != "Ranged Combat(Bows)";
}
