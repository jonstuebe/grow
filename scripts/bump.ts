import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";

import app from "../app.json";

(async () => {
  app.expo.ios.buildNumber = (Number(app.expo.ios.buildNumber) + 1).toString();
  await fs.writeFile(
    path.join(__dirname, "../app.json"),
    JSON.stringify(app, null, 2),
    "utf8"
  );
  console.log(chalk.green("✅ bumped build version"));
})();
