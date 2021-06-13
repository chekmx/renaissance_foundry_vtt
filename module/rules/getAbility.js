export function getAbility(actorData, abilityName) {
    let result = {};
    Object.entries(actorData.data.abilities).forEach((pair) => {
        if (pair[0] == abilityName) {
            result = pair[1];
        }
    });

    return result;
}
