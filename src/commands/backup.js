const { Octokit } = require("@octokit/core");
const { exec } = require("node:child_process");
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

  // current seconds
  let seconds = date_ob.getSeconds();

  // prints date in YYYY-MM-DD format
  console.log(year + "-" + month + "-" + date);

  // prints date & time in YYYY-MM-DD HH:MM:SS format
  console.log(
    year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
  );

  // prints time in HH:MM format
  console.log(hours + ":" + minutes);

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
  return allRepos;
};

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
    reposToBackup.forEach((rep) => {
      let tempDir = destination + "/temp";
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmdirSync(tempDir, { recursive: true });
        }
      } catch (e) {
        console.error("problem deleting temp dir");
        return;
      }

      /* Git Clone */
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

      console.log("gitCloneCMD: " + gitCloneCMD);

      let gitCloneCMDChild = exec(gitCloneCMD, (error, stdout, stderr) => {
        if (error) {
          console.error("error: " + error);
          return;
        }
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
      });
      gitCloneCMDChild.stdout.pipe(process.stdout);
      gitCloneCMDChild.on("exit", function () {
        process.exit();
        console.log("finished...");
      });

      /* bundle the repository */
      let bundleName = getDateAndTime() + "_" + rep + ".bundle";
      if (save && save.length > 0) {
        bundleName = save;
      }
      let bundleCMD =
        "git bundle create " + destination + "/" + bundleName + " --all";
      console.log("bundleCMD: " + bundleCMD);

      exec("cd " + tempDir + " && " + bundleCMD, (error, stdout, stderr) => {
        if (error) {
          console.error("error: " + error);
          return;
        }
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
      });

      /* verify bundle */
      let verifyCMD = "git bundle verify " + destination + "/" + bundleName;
      console.log("verifyCMD: " + verifyCMD);
      exec("cd " + tempDir + " && " + verifyCMD, (error, stdout, stderr) => {
        if (error) {
          console.error("error: " + error);
          return;
        }
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);

        if (!stderr.includes("is okay")) {
          console.error("the bundle verify check failed");
          return;
        }
      });
    });
  },
};
