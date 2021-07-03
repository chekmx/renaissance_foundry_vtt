export function D100Roll(roll, baseTarget, modifier = 0) {
  let target =  parseInt(baseTarget) + parseInt(modifier)
  console.log(target)
  return roll.result == 100 ? "FUMBLE"
    : target < 100 && roll.result >= 95 ? "FAIL"
      : roll.result <= target / 10 ? "CRITICAL"
        : roll.result <= 5 ? "AUTO SUCCESS"
          : roll.result <= target ? "SUCCESS" : "FAIL";
}
