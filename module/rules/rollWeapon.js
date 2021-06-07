import { D100Roll } from "./D100Roll.js";

export async function rollWeapon(actor, item, roll, damageRoll, token) {

    const itemData = item.data;

    let skill = actor.items.filter((i) => i.data.type === "skill" && i.data.name === itemData.skill)[0];

    console.log(skill);
    let successDisplay = D100Roll(roll, skill.data)

    let chatData = {
      type: CHAT_MESSAGE_TYPES.ROLL,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      roll: roll,
      rollMode: game.settings.get("core", "rollMode")
    };

    let damageRollChatData = {
      type: CHAT_MESSAGE_TYPES.ROLL,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      roll: damageRoll,
      rollMode: game.settings.get("core", "rollMode")
    }

    const template = `systems/renaissance/templates/chat/weapon-card.html`;

    let templateData = {
      actor: actor,
      tokenId: token ? `${token.scene._id}.${token.id}` : null,
      success: successDisplay,
      skillData: skill.data,
      item: item,
      data: chatData,
      damageRoll: damageRollChatData
    };

    if (game.dice3d) {
      await game.dice3d.showForRoll(roll, game.user, true);
      await game.dice3d.showForRoll(damageRoll, game.user, true);
    }
    
    chatData["content"] = await renderTemplate(template, templateData).then(content => {
      ChatMessage.create({
        user: game.user._id,
        speaker :ChatMessage.getSpeaker({actor: actor}),
        content: content
      });
    });


}