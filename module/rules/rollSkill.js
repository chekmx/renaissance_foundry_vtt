export async function rollSkill(actor, item, roll, token) {

    const itemData = item.data;

    console.log(item);
    let successDisplay = roll.result == 100 ? "FUMBLE"
      : roll.result <= item.data.value / 10 ? "CRITICAL"
        : roll.result <= item.data.value ? "SUCCESS" : "FAIL";

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