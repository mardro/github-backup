const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
var pjson = require("../../package.json");

module.exports = {
  showHeader: () => {
    clear();

    console.log(chalk.greenBright(figlet.textSync("GITHUB - REPO - BACKUP")));
    console.log(chalk.green(pjson.description));
    console.log(chalk.green("Originally created by Mark Drobnick\n"));
  },

  isWindows: () => {
    return process.platform === "win32";
  },
};
