import { D100Roll } from "./D100Roll.js";

export async function rollWeapon(actor, item, token, asClub) {
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

    //Handle case if proper skill or id funky hack for creatures
    let successDisplay = ""
    let target = ""
    if(skill) {
      successDisplay = D100Roll(roll, skill.data.data.value, modifier)
      target = Number(skill.data.data.value) + Number(modifier)
    } else if(item.data.skill  && !isNaN(item.data.skill)) {
      console.log("HERE")
      successDisplay = D100Roll(roll, item.data.skill, modifier)
      target = parseInt(item.data.skill) + parseInt(modifier)
    } else {
      ui.notifications.info(`${actor.name} does not have required skill ${itemData.skill}`);
      return
    }

    let isSuccess = (successDisplay != "FAIL" && successDisplay != "FUMBLE")

    let damageRoll = {};
    if(isSuccess)
    {
      if(hasDamageModifier(skill, asClub)){
        console.log(itemData)
        damageRoll = new Roll((asClub ? itemData.clubDamage : itemData.damage) + actor.data.data.damageModifier, actor.data);
      } else {
        console.log(itemData)
        damageRoll = new Roll(itemData.damage, actor.data);
      }

      if(Roll.validate(itemData.damage))
      {
        if(successDisplay =="CRITICAL"){
          if(actor.data.data.damageModifier.trim().startsWith("-")){
            damageRoll = new Roll(itemData.damage, actor.data);
          }
          damageRoll.evaluate({maximize : true});
        } else {
          damageRoll.evaluate();
        }
      } 
    }
    
    const template = `systems/renaissance/templates/chat/weapon-card.html`;

    let templateData = {
      actor: actor,
      tokenId: token ? `${token.scene._id}.${token.id}` : null,
      success: { "text" : successDisplay, "isSuccess": isSuccess },
      target: target,
      modifier: { "reason": reason, "value" : modifier },
      skillData: (skill) ? skill.data : { name: item.name , data : { value: item.name}},
      item: item,
      roll: roll,
      damageRoll: damageRoll
    };

    if (game.dice3d) {
      await game.dice3d.showForRoll(roll, game.user, true);
      if(isSuccess)
      {
        await game.dice3d.showForRoll(damageRoll, game.user, true);
      }
    }

    await renderTemplate(template, templateData).then(content => {
      ChatMessage.create({
        user: game.user._id,
        speaker :ChatMessage.getSpeaker({actor: actor}),
        content: content
      });
    });


}

function hasDamageModifier(skill, asClub) {
  if(!skill) return true
  if(asClub) return true
  return skill.name != "Gun Combat" && skill.name != "Ranged Combat" && skill.name != "Ranged Combat (Bow)";
}
