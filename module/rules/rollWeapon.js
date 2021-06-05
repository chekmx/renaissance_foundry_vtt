export async function rollWeapon(actor, item, roll, damageRoll, token) {

    let skill = actor.items.filter((i) => i.data.type === "skill" && i.data.name === item.data.skill)[0];

    console.log(skill);
    let successDisplay = roll.result == 100 ? "FUMBLE"
      : roll.result <= skill.data.data.value / 10 ? "CRITICAL"
        : roll.result <= skill.data.data.value ? "SUCCESS" : "FAIL";

    let chatData = {
      type: CHAT_MESSAGE_TYPES.ROLL,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      roll: roll,
      rollMode: game.settings.get("core", "rollMode")
    };

    const template = `systems/renaissance/templates/chat/weapon-card.html`;

    let templateData = {
      actor: actor,
      tokenId: token ? `${token.scene._id}.${token.id}` : null,
      success: successDisplay,
      skillData: skill.data,
      item: item,
      data: chatData,
      damageRoll: damageRoll
    };

    chatData["content"] = await renderTemplate(template, templateData);

    ChatMessage.create(chatData);
}