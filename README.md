# github-repo-backup

A NodeJs CLI tool to Backup Github Repositories

## Backup Steps

1. Git Clone

   Clone the Repository from GitHub

   `git clone --mirror https://<username>:<githubtoken>@github.com/<username_organisation>/<repositoryname>.git`

2. Bundle the Repository

   cd into the currently cloned repository directory from Step 1

   `git bundle create path/to/file.bundle --all`

3. Verify Bundle
   `git bundle verify file.bundle`

---

## Get the Bundle Content Steps

1.  Init a new Repo

    `git init backup-repo`

2.  Git Remote Add
    cd into the new created repo diretory

    `git remote add origin path/to/file.bundle`

3.  Git Pull

    `git pull origin master`

## TEST COMMIT -> DELETE ME
