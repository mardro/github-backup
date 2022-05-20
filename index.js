#!/usr/bin/env node

const { program } = require("commander");
var pjson = require("./package.json");
const { showHeader } = require("./src/utils/utils");

showHeader();
program
  .name("github-repo-backup")
  .description(pjson.description)
  .usage("<command> [options]")
  .version(pjson.version);

program.parse(process.argv);
