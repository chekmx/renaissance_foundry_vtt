export function getAbility(actorData, abilityName) {
    let result = {};
    if(actorData.data == undefined) return undefined
    if(actorData.data.abilities == undefined) return undefined

    Object.entries(actorData.data.abilities).forEach((pair) => {
        if (pair[0] == abilityName) {
            result = pair[1];
        }
    });

    return result;
}
