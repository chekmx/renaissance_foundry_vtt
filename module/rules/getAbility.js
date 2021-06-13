export function getAbility(actorData, abilityName) {
    let result = {};
    Object.entries(actorData.data.abilities).forEach((pair) => {
        //console.log(pair[0]);
        //console.log(abilityName);
        
        if (pair[0] == abilityName) {
            console.log(abilityName);
            console.log(pair[1]);
            result = pair[1];
        }
    });

    return result;
}
