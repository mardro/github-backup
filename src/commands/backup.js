const { Octokit } = require("@octokit/core");

const exec = require("child_process").exec;
const fs = require("fs");

const getDateAndTime = () => {
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // prints time in HH:MM format
  return year + month + date + "_" + hours + minutes;
};

const getAllRepoNames = async (PAT, user, typ) => {
  let allRepos = [];
  const octokit = new Octokit({
    auth: PAT,
  });
  let response = await octokit.request("GET /" + typ + "/" + user + "/repos", {
    org: user,
  });

  response.data.forEach((repo) => {
    allRepos.push(repo.name);
  });

  console.log("found following projects to backup: " + allRepos.toString());

  return allRepos;
};

async function execCMD(cmd) {
  console.log("START execCMD: " + cmd);
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        throw new Error("ERROR: execCMD: " + err);
      }
      resolve(stdout ? console.log(stdout) : console.log(stderr));
      console.log("END execCMD: " + cmd);
    });
  });
}

function checkVerifyMsg(stdout, stderr) {
  if (
    (stdout && stdout.includes("is okay")) ||
    (stderr && stderr.includes("is okay"))
  ) {
    console.log("verify bundle check OK");
  } else {
    throw new Error(
      "ERROR: verify bundle failed:\n stdout was = " +
        stdout +
        "\nstderr was = " +
        stderr
    );
  }
}

async function execVerifyCMD(cmd) {
  console.log("START execVerifyCMD: " + cmd);
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        throw new Error("ERROR: execCMD: " + err);
      }
      resolve(checkVerifyMsg(stdout, stderr));
      console.log("END execVerifyCMD: " + cmd);
    });
  });
}

module.exports = {
  doBackup: async (options) => {
    console.log("Start backup...");
    const { repo, username, organisation, destination, save, PAT } = options;

    let user = "";
    let typ = "";
    if (!username && !organisation) {
      console.log("A username OR organisation is required");
      return;
    } else if (username && username.length > 0) {
      user = username;
      typ = "users";
    } else if (organisation && organisation.length > 0) {
      user = organisation;
      typ = "orgs";
    }

    /* get repos */
    let reposToBackup = [];

    let repoName = options.repo.toLowerCase();
    if (repoName === "all") {
      reposToBackup = await getAllRepoNames(PAT, user, typ);
    } else {
      reposToBackup.push(repo);
    }

    /* now backup all repos */

    for (let index = 0; index < reposToBackup.length; index++) {
      console.log("\n\n ##### BACKUP " + reposToBackup[index] + " #####");

      let rep = reposToBackup[index];
      let tempDir = destination + "/temp";
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true });
        }
      } catch (e) {
        console.error("problem deleting temp dir");
        return;
      }

      /* Git Clone */
      console.log("\n ### Step 1: git clone ###");
      let gitCloneCMD =
        "git clone --mirror https://" +
        user +
        ":" +
        PAT +
        "@github.com/" +
        user +
        "/" +
        rep +
        ".git" +
        " " +
        tempDir;

      await execCMD(gitCloneCMD);

      /* bundle the repository */
      console.log("\n ### Step 2: bundle the repository ###");
      let bundleName = getDateAndTime() + "_" + rep + ".bundle";
      if (repoName !== "all" && save && save.length > 0) {
        bundleName = save;
      }
      let bundleCMD =
        "git bundle create " + destination + "/" + bundleName + " --all";

      await execCMD("cd " + tempDir + " && " + bundleCMD);

      /* verify bundle */
      console.log("\n ### Step 3: verify bundle ###");
      let verifyCMD = "git bundle verify " + destination + "/" + bundleName;
      await execVerifyCMD("cd " + tempDir + " && " + verifyCMD);
    }
  },
};
