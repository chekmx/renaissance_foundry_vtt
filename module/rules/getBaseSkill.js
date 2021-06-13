import { getAbility } from "./getAbility.js";

export function getBaseSkill(actorData, itemData) {
    if (actorData) {
        let baseAbility1 = getAbility(actorData, itemData.data.base1.toLowerCase());
        let baseAbility2 = getAbility(actorData, itemData.data.base2.toLowerCase());
        return baseAbility1.value + baseAbility2.value;
    }
}

