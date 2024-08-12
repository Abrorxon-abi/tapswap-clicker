import { generateRandomNumber, loadJSON, sleep } from "./utils.js";
import { applyBoost, checkLogin, submitTaps } from "./tapswap.js";

const SLEEP_INTERVAL = 14;
const SLEEP_INTERVAL_SHORT = 4;
const SLEEP_INTERVAL_EXTRA_SHORT = 2;

async function tapLoop(token, id, maxTapsPerSubmit) {
  let hasEnergy = true;
  while (hasEnergy) {
    let tapResponse = await submitTaps(token, id, maxTapsPerSubmit);

    if (tapResponse && tapResponse.player.energy < maxTapsPerSubmit) {
      hasEnergy = false;
      console.log(
        "Current energy level",
        tapResponse.player.energy,
        "have to stop it"
      );
    }
    await sleep(SLEEP_INTERVAL);
  }
}

(async () => {
  const maxTouchPoints = 5;

  try {
    let response = await loadJSON("./response.json");

    if (!response) {
      console.log("Update response.json file");
      return;
    }

    if (checkLogin(response.player.login_ts)) {
      console.log("Update response.json file, session expired");
      return;
    }

    const token = response.access_token;
    const { energy, tap_level, id } = response.player;
    const [turboBoost] = response.player.boost.filter(
      (item) => item.type === "turbo"
    );
    const [energyBoost] = response.player.boost.filter(
      (item) => item.type === "energy"
    );

    // submit taps method should be executed every 15 seconds according to submit_interval_s
    const maxTapsPerSubmit = generateRandomNumber(
      maxTouchPoints * 14,
      maxTouchPoints * 15
    ); // assume that user taps every second

    if (energy < tap_level) {
      console.log(
        "You don't have enough energy for 1 request, you have",
        energy,
        ", you need",
        tap_level * maxTapsPerSubmit
      );
      return;
    }

    // tap without boost
    await tapLoop(token, id, maxTapsPerSubmit);

    // tap with boost x5 turbo
    // during boost I found that user can submit 2 request with taps
    for (let i = 0; i < turboBoost.cnt; i++) {
      let abResponse = await applyBoost(token, "turbo");
      if (!abResponse) {
        console.log("Cannot apply turbo boost");
        break;
      }
      await sleep(SLEEP_INTERVAL);
      await submitTaps(token, id, maxTapsPerSubmit);
      await sleep(SLEEP_INTERVAL_SHORT);
      await submitTaps(token, id, maxTapsPerSubmit);
      await sleep(SLEEP_INTERVAL_EXTRA_SHORT);
    }

    // tap with boost energy
    for (let i = 0; i < energyBoost.cnt; i++) {
      let abResponse = await applyBoost(token, "energy");
      if (!abResponse) {
        console.log("Cannot apply energy boost");
        break;
      }
      await tapLoop(token, id, maxTapsPerSubmit);
    }

    console.log("Finished");
  } catch (e) {
    console.log(e);
    console.log("Update token");
  }
})();
