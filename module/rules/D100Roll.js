export function D100Roll(roll, item) {
  return roll.result == 100 ? "FUMBLE"
    : item.data.value < 100 && roll.result >= 95 ? "FAIL"
      : roll.result <= item.data.value / 10 ? "CRITICAL"
        : roll.result <= 5 ? "AUTO SUCCESS"
          : roll.result <= item.data.value ? "SUCCESS" : "FAIL";
}
