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
  .command("backup")
  .version(pjson.version)
  .description("Backup remote repositories")
  .requiredOption(
    "-d, --destination <path to backup destination> REQUIRED",
    "the backup destination directory"
  )
  .requiredOption(
    "-p, --PAT <the Personal Access Token> REQUIRED",
    "the personal access token used in GitHub"
  )
  .requiredOption(
    "-r, --repo <the repo name> REQUIRED",
    "the repo name used in GitHub or 'all' "
  )
  .option(
    "-u, --username <the username> REQUIRED",
    "the username used in GitHub"
  )
  .option(
    "-o, --organisation <the organisation>",
    "the name of the ORGANISATION used in git clone command. (e.g. git clone https://USERNAME:GITHUB_TOKEN@github.com/ORGANISATION/REPO.git). If not set the USERNAME will be used"
  )
  .option(
    "-s, --save <the name of the backup>",
    "the name of the backup bundle file. If not set the repo name with timestamp will be used (e.g. yyyyMMdd_HHmm_REPO.bundle)"
  )

  .action(backup.doBackup);

program.parse(process.argv);
