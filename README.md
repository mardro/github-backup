# github-repo-backup

A NodeJs CLI tool to Backup Github Repositories

## Usage

- To Backup ALL repositories from an organisation (a GET reequest to GitHub will be made)

  `github-repo-backup backup -d PATH_TO_BACKUP_DIR -r all -o ORGANISATION_NAME -p GITHUB_PAT`

- To Backup a specific repository from an organisation (a GET reequest to GitHub will be made)

  `github-repo-backup backup -d PATH_TO_BACKUP_DIR -r MY_REPO -o ORGANISATION_NAME -p GITHUB_PAT`

- To Backup ALL repositories from an user (a GET reequest to GitHub will be made)

  `github-repo-backup backup -d PATH_TO_BACKUP_DIR -r all -u USER_NAME -p GITHUB_PAT`

- To Backup a specific repository from an user (a GET reequest to GitHub will be made)

  `github-repo-backup backup -d PATH_TO_BACKUP_DIR -r MY_REPO -u USER_NAME -p GITHUB_PAT`

- To Backup a specific repository from an user (a GET reequest to GitHub will be made) with an individual backup name

  ## `github-repo-backup backup -d PATH_TO_BACKUP_DIR -s MY_BACKUP_NAME -r MY_REPO -u USER_NAME -p GITHUB_PAT`

---

## Backup Steps (what this program does)

1. Git Clone

   Clone the Repository from GitHub

   `git clone --mirror https://<username>:<githubtoken>@github.com/<username_organisation>/<repositoryname>.git <destination>`

2. Bundle the Repository

   cd into the currently cloned repository directory from Step 1

   `git bundle create path/to/file.bundle --all`

3. Verify Bundle

   `git bundle verify file.bundle`

---

## Restore Steps (do manually)

### Get the Bundle Content Steps

1.  Clone the Repo from the bundle

    `git clone path/to/file.bundle`

2.  Get all the branches locally to be pushed up to your origin later

    ```bash
    remote=origin ; for brname in `git branch -r | grep $remote | grep -v master | grep -v HEAD | awk '{gsub(/^[^\/]+\//,"",$1); print $1}'`; do git branch --track $brname $remote/$brname || true; done 2>/dev/null
    ```

### Push to GitHub

1.  Create a new repo on your git server and update the origin of the local repo

    `git remote set-url origin git@github.com/xtream1101/test-backup.git`

2.  Push all branches and tags to the new remote origin
    `git push --all`
    `git push --tags`
