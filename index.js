#!/usr/bin/env node

const { program } = require("commander");
var pjson = require("./package.json");
const { showHeader } = require("./src/utils/utils");
const backup = require("./src/commands/backup");

showHeader();
program
  .name("github-repo-backup")
  .description(pjson.description)
  .usage("<command> [options]")
  .version(pjson.version);

program
  .command("local")
  .version(pjson.version)
  .description("Backup local repositories")
  .requiredOption(
    "-p, --path <path to repo> REQUIRED",
    "the repo directory that should be backuped"
  )
  .requiredOption(
    "-d, --destination <path to backup destination> REQUIRED",
    "the backup destination directory"
  )
  .option(
    "-s, --save <the name of the backup>",
    "the name of the backup bundle file. If not set the repo name with timestamp will be used (e.g. yyyyMMdd_REPO.bundle"
  )
  .action(backup.local);

program
  .command("remote")
  .version(pjson.version)
  .description("Backup remote repositories")
  .requiredOption(
    "-d, --destination <path to backup destination> REQUIRED",
    "the backup destination directory"
  )
  .requiredOption(
    "-u, --username <the username> REQUIRED",
    "the username used in GitHub"
  )
  .requiredOption(
    "-r, --repo <the repo name> REQUIRED",
    "the repo name used in GitHub"
  )
  .option(
    "-s, --save <the name of the backup>",
    "the name of the backup bundle file. If not set the repo name with timestamp will be used (e.g. yyyyMMdd_REPO.bundle"
  )
  .option(
    "-o, --organisation <the organisation>",
    "the name of the ORGANISATION used in git clone command. (e.g. git clone https://USERNAME:GITHUB_TOKEN@github.com/ORGANISATION/REPO.git). If not set the USERNAME will be used"
  )
  .action(backup.remote);

program.parse(process.argv);
