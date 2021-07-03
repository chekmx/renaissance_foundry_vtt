import { D100Roll } from "./D100Roll.js";

export async function rollSkill(actor, item, token) {

    const itemData = item.data;
    const actorData = actor ? actor.data.data : {};

    let roll = new Roll('1d100', actorData);
    roll.evaluate(); 

    let successDisplay = D100Roll(roll, item.data.value);

    let chatData = {
      type: CHAT_MESSAGE_TYPES.ROLL,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      roll: roll,
      rollMode: game.settings.get("core", "rollMode")
    };

    const template = `systems/renaissance/templates/chat/skill-card.html`;

    let templateData = {
      actor: actor,
      tokenId: token ? `${token.scene._id}.${token.id}` : null,
      success: successDisplay,
      item: item,
      data: chatData
    };

    chatData["content"] = await renderTemplate(template, templateData);

    ChatMessage.create(chatData);
}


