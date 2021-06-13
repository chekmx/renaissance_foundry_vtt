export function getDamageModifier(damgeModSizeAndStr) {
  if (damgeModSizeAndStr <= 10) {
    return "-1d6";
  } else if (damgeModSizeAndStr <= 15) {
    return "-1d4";
  } else if (damgeModSizeAndStr <= 25) {
    return "";
  } else if (damgeModSizeAndStr <= 30) {
    return "+1d4";
  } else if (damgeModSizeAndStr > 30) {
    var numberOfD6s = Math.ceil((damgeModSizeAndStr - 30) / 15);
    return `+${numberOfD6s}d6`;
  } else {
    return data.abilities.str.value + data.abilities.siz.value;
  }
}
