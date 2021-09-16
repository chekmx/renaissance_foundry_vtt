import { D100Roll } from "./D100Roll.js";

export async function rollSpell(actor, item, token) {

    const itemData = item.data;
    const actorData = actor ? actor.data.data : {};

    let roll = new Roll('1d100', actorData);
    roll.evaluate(); 

    let skill = actor.items.filter((i) => i.data.type === "skill").filter((i) => i.data.name === itemData.skill)[0];

    let successDisplay = D100Roll(roll, skill.data.data.value);

    let chatData = {
      type: CHAT_MESSAGE_TYPES.ROLL,
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      roll: roll,
      rollMode: game.settings.get("core", "rollMode")
    };

    const template = `systems/renaissance/templates/chat/spell-card.html`;

    item.data.tags = getTags(item)

    let templateData = {
      actor: actor,
      tokenId: token ? `${token.scene._id}.${token.id}` : null,
      success: successDisplay,
      skillData: skill.data,
      item: item,
      data: chatData
    };

    chatData["content"] = await renderTemplate(template, templateData);

    ChatMessage.create(chatData);
}

function getTags(item) {
  
  let tags = ""

  if(item.data.concentration){
    tags = "Concentration"
  } else if(item.data.instant){
    tags = "Instant"
  } else if(item.data.duration > 0){
    tags = "Duration " + item.data.duration
  }

  tags = tags + ", Magnitude " +  item.data.magnitude

  if(item.data.progressive){
    tags = tags + ", Progressive"
  }

  if(item.data.eyeContact){
    tags = tags + ", Eye Contact"
  }

  if(item.data.ranged){
    tags = tags + ", Ranged"
  }

  if(item.data.resist != ""){
    tags = tags + `, Resist(${item.data.resist})`
  }

  if(item.data.touch){
    tags = tags + ", Touch"
  }

  if(item.data.trigger){
    tags = tags + ", Trigger"
  }

  return tags
}

