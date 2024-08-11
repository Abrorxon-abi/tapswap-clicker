if (location.hostname === "app.tapswap.club") {
  const getRandomArrayElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };
  const generateRandomUserAgent = () => {
    const androidVersions = ["10", "11", "12", "13", "14"];
    const deviceModels = [
      "SM-A205U",
      "SM-A102U",
      "SM-G960U",
      "SM-N960U",
      "LM-Q720",
      "LM-X420",
      "LM-Q710(FGN)",
    ];
    const chromeVersions = [
      "120",
      "121",
      "122",
      "123",
      "124",
      "125",
      "126",
      "127",
    ];

    const randomAndroidVersion = getRandomArrayElement(androidVersions);
    const randomDeviceModel = getRandomArrayElement(deviceModels);
    const randomChromeVersion = getRandomArrayElement(chromeVersions);
    const randomChromeBuildNumber = Math.floor(Math.random() * 10000);

    return `Mozilla/5.0 (Linux; Android ${randomAndroidVersion}${randomDeviceModel}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomChromeVersion}.0.${randomChromeBuildNumber}.64 Mobile Safari/537.36`;
  };

  Object.defineProperty(navigator, "maxTouchPoints", {
    get: () => 5,
  });

  Object.defineProperty(navigator, "userAgent", {
    get: () => generateRandomUserAgent(),
  });
}
