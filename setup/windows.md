# Set up your Windows laptop

This guide sets up a Windows 11 laptop for the whole MERN-ESS course.
Everything runs on Windows, and **Git Bash is your terminal**, inside VS Code.
Do Part 1 in Launchpad task 6 and Part 2 in Launchpad tasks 12 and 13, all in week 1. After each step, run its check before you go on.

The versions the course uses are in [`VERSIONS.md`](../VERSIONS.md).

## Before you start

- **Windows 11, version 23H2 or newer.** Press Windows+R, type `winver` and press Enter to see your version. Docker Desktop needs 23H2 or newer.
- **At least 8 GB of memory** and **15 GB of free disk space**.
- **Virtualisation turned on.** Open Task Manager, select Performance, then CPU. It must say `Virtualization: Enabled`. If it says Disabled, ask your mentor to turn on Intel VT-x or AMD SVM in the laptop's BIOS.
- **An administrator account** on the laptop, because the installers change system settings.
- Keep the charger plugged in. If your laptop does not run Windows, ask your mentor for the matching steps.

## Where each tool lives

| Tool | Where it runs | When you install it |
|---|---|---|
| Git and Git Bash | Windows | Week 1, Launchpad task 5 |
| VS Code | Windows | Week 1, Launchpad task 6 |
| Node.js (LTS) and npm | Windows | Week 1, Launchpad task 6 |
| Git Bash as VS Code's terminal | Windows | Week 1, Launchpad task 12 |
| The course kit | Windows, in your home folder: `~/mern-ess-kit` | Week 1, Launchpad task 12 |
| WSL 2 (a Linux system inside Windows) | Windows; Docker Desktop runs on it | Week 1, Launchpad task 13 |
| Docker Desktop | Windows, with the WSL 2 engine | Week 1, Launchpad task 13 |

You first use Docker in week 2 (P1 makes your bank statement with it) and MongoDB in week 4 (P2). Run every course command in **Git Bash**, unless a step says PowerShell.
You never install Python, MongoDB or a web server on Windows: Docker runs them in containers.

## Part 1, week 1 (task 6): Git, VS Code and Node.js

### Step 1: Git for Windows

You installed Git in Launchpad task 5, from https://git-scm.com/downloads/win with the default options. Those options include Git Bash and Git Credential Manager (for signing in to GitHub).

Check it in Git Bash:

```bash
git --version
```

You see `git version 2.` and more numbers. Any version from 2.45 is fine.

### Step 2: VS Code

Install VS Code from https://code.visualstudio.com/download with the default options. Open it once to check that it starts.

Two extensions help in this course. Select **Extensions** (Ctrl+Shift+X), search for each and install it:

- **ESLint** (from Microsoft): shows lint errors as you type, from P1.
- **Prettier - Code formatter** (from Prettier): formats your files on save, from P1.

Check it in Git Bash: `code --version` prints a version number.

### Step 3: Node.js LTS and npm

Node.js runs JavaScript and TypeScript outside a browser. npm, which comes with it, installs packages. The course uses the **LTS** (long-term support) version named in [`VERSIONS.md`](../VERSIONS.md): Node.js 26.

Use **one** of these two ways.

**The installer (recommended).**

1. Open https://nodejs.org/en/download and choose **v26 (LTS)**, **Windows** and **x64**. Download the **Windows Installer (.msi)**.
2. Run it with the default options. Leave **Automatically install the necessary tools** unticked: this course does not need them.

**Or winget**, in PowerShell:

```powershell
winget install --id OpenJS.NodeJS.LTS --exact
```

`OpenJS.NodeJS.LTS` installs the newest LTS version, which is v26 (checked on 24 November 2026).

Then close every terminal and VS Code, and open them again. Check it:

```bash
node --version
npm --version
```

`node --version` prints `v26.` and more numbers. `npm --version` prints `11.` and more.

In PowerShell, `npm` may say that running scripts is disabled. Type `npm.cmd` there instead, or use Git Bash from Part 2, which has no such rule.

## Part 2, week 1 (tasks 12 and 13): Git Bash in VS Code, the kit, WSL 2 and Docker Desktop

Task 12 does Steps 4 to 7, all in Git Bash; it clones the kit (Step 7) before it checks Node.js (Step 6). Task 13 does Steps 8 to 10: only the `wsl` commands there run in PowerShell.

### Step 4: Make Git Bash the terminal in VS Code

1. In VS Code, press Ctrl+Shift+P and type `Terminal: Select Default Profile`.
2. Choose **Git Bash**.

This is the same as the setting `"terminal.integrated.defaultProfile.windows": "Git Bash"`.

Check it: open a new terminal (**Terminal**, then **New Terminal** in the top menu). The prompt shows `MINGW64`, and `uname -s` prints a line that starts with `MINGW64`.

### Step 5: Line endings

Windows ends each line of a text file with two characters (CRLF), and Linux ends it with one (LF).
Linux containers and servers need LF: a script saved with CRLF fails inside a container with errors such as `$'\r': command not found`, and Prettier reports every line as changed.

1. In VS Code, open **Settings** (Ctrl+,) and search for `eol`.
2. Set **Files: Eol** to `\n`. This is the setting `"files.eol": "\n"`.

Check it: open a new file. The status bar at the bottom right shows `LF`, not `CRLF`. In Git Bash, this prints the setting:

```bash
grep eol "$APPDATA/Code/User/settings.json"
```

### Step 6: Node.js in Git Bash, and the rupee sign

Check that Git Bash finds Node.js, and that it prints `₹` through a pipe (P1 prints rupee amounts):

```bash
node --version
npm --version
node -e "console.log('₹ ok')" | cat
```

You see the two versions, then `₹ ok`. If `node` is not found, close every terminal and VS Code and open them again.

### Step 7: Clone the course kit

In Git Bash:

```bash
cd ~ && git clone https://github.com/Anaxionai/mern-ess-kit.git
```

This makes the folder `~/mern-ess-kit`, which is `C:\Users\<your name>\mern-ess-kit`.
Keep it next to your course repository, never inside it. When a task says so, update it with `git pull` in that folder.

Check it: `ls ~/mern-ess-kit` lists `README.md`, `VERSIONS.md`, `setup` and `data`.

### Step 8: WSL 2

WSL 2 runs a real Linux system inside Windows. Docker Desktop uses it to run containers.
Open **PowerShell as administrator** (right-click PowerShell and choose "Run as administrator") and run:

```powershell
wsl --install
```

Restart the laptop when it asks. If Ubuntu opens and asks for a user name and a password, choose a short name, such as `asha`, and a password you will remember. The course does not need Ubuntu, so you can close it after this.

Check it in PowerShell:

```powershell
wsl --version
wsl -l -v
```

`wsl --version` shows `WSL version: 2.` and more numbers: it must be 2.1.5 or newer. If it is older, run `wsl --update`.

### Step 9: Limit WSL 2's memory

Docker Desktop runs inside WSL 2, so this limit keeps Docker and every container to 4 GB.
That leaves enough memory for Windows, VS Code, your browser and your Node apps on an 8 GB laptop.

In Git Bash, write the settings file `.wslconfig` into your Windows user folder:

```bash
cat > ~/.wslconfig <<'EOF'
[wsl2]
memory=4GB
swap=2GB

[experimental]
autoMemoryReclaim=gradual
EOF
cat ~/.wslconfig
```

- `memory=4GB`: WSL 2 and Docker may use at most 4 GB. On a laptop with 16 GB of memory, change it to `memory=8GB`.
- `swap=2GB`: when Linux needs more memory, it uses up to 2 GB of disk as slower, extra memory.
- `autoMemoryReclaim=gradual`: memory Linux no longer uses goes back to Windows, a little at a time.

Then, in PowerShell, stop WSL so that it starts again with the limit:

```powershell
wsl --shutdown
```

Wait 8 seconds before you start Docker Desktop again. You check the limit in Step 10, once Docker Desktop runs.

### Step 10: Docker Desktop

Docker Desktop runs containers on Windows, using WSL 2. The course runs MongoDB, Mailpit, the kit's data generators and, in the capstone, your whole app in containers.
**Licence:** Docker Desktop is free under the Personal plan for individual learning. It is also free for small businesses with fewer than 250 employees and less than $10 million in yearly revenue.

1. Download **Docker Desktop for Windows (x86_64)** from https://docs.docker.com/desktop/setup/install/windows-install/. (`winget install --id Docker.DockerDesktop --exact` in PowerShell installs the same.)
2. Run the installer. Keep **Use WSL 2 instead of Hyper-V** ticked, then finish. Restart the laptop if it asks.
3. Start **Docker Desktop** from the Start menu.
4. Accept the Docker Subscription Service Agreement. Signing in is optional: you may skip it.
5. Wait until the bottom left of the Docker Desktop window says **Engine running**.

Check it in Git Bash:

```bash
docker run hello-world
docker compose version
docker info | grep "Total Memory"
```

- `docker run hello-world` prints `Hello from Docker!` and a few lines that explain what happened.
- `docker compose version` prints `Docker Compose version` and a number.
- `Total Memory` is about `3.8GiB`: that is your 4 GB limit from Step 9. If it shows more, run `wsl --shutdown` in PowerShell, wait 8 seconds and start Docker Desktop again.

Docker Desktop must be running whenever you use Docker. Start it from the Start menu after you restart the laptop.

### Step 11: Git Bash and Docker: the path rule

Git Bash changes any word that looks like a Linux path, such as `/etc` or `/tmp/file.json`, into a Windows path before Docker sees it.
So this command fails, because Docker receives `C:/Program Files/Git/etc`:

```bash
docker run --rm alpine ls /etc
```

When a `docker` command names a path inside a container, put `MSYS_NO_PATHCONV=1` in front of it. This works:

```bash
MSYS_NO_PATHCONV=1 docker run --rm alpine ls /etc
MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD":/work alpine ls /work
```

- Put `MSYS_NO_PATHCONV=1` in front of one command at a time. Never set it for the whole terminal with `export`: then other commands that take a path break.
- With the prefix, give files on your laptop as relative paths, such as `data/stations.json`, or as `"$PWD"`, not `~/...`.
- You do not need it for paths inside quotes after `sh -c`, such as `docker exec web sh -c 'ls /tmp'`, or for paths inside a Compose file.
- Interactive commands such as `docker exec -it ...` work in VS Code's terminal. In the separate Git Bash window, put `winpty` in front if you see `the input device is not a TTY`.

## Final check

Run these in Git Bash, in VS Code's terminal. Compare each line with the "You see" column.

| Command | You see |
|---|---|
| `git --version` | `git version 2.` and more |
| `node --version` | `v26.` and more |
| `npm --version` | `11.` and more |
| `node -e "console.log('₹ ok')" \| cat` | `₹ ok` |
| `docker run hello-world` | `Hello from Docker!` |
| `docker info \| grep "Total Memory"` | about `3.8GiB` (or about `7.7GiB` with `memory=8GB`) |
| `cat ~/.wslconfig` | `memory=4GB` and `swap=2GB` |
| `ls ~/mern-ess-kit` | `README.md`, `VERSIONS.md` and the kit folders |

## Ubuntu (optional)

`wsl --install` may also install Ubuntu. The course does not need it, because every tool runs on Windows or in Docker.
You may use it to practise Linux commands: type `wsl` in PowerShell to open it, and `exit` to leave. In week 9 you use a real Ubuntu server in the cloud, over SSH from Git Bash (see `deploy/README.md`).

## If something goes wrong

| What you see | What to do |
|---|---|
| `node`, `npm` or `code` is not recognised | The terminal was open before the install. Close every terminal and VS Code, then open them again. |
| `node --version` shows an older major version | An old Node.js is installed. Uninstall it in Windows Settings, Apps, then do Step 3 again. |
| `npm` in PowerShell says running scripts is disabled | Use `npm.cmd`, or use Git Bash. |
| `npm install` fails with `EACCES`, `EPERM` or a locked file | Close VS Code's other terminals and any running `npm run dev`, then run it again. Antivirus scans can lock `node_modules`: wait a minute and retry. |
| `wsl --install` says that virtualisation is off | Turn on Intel VT-x or AMD SVM in the BIOS. Ask your mentor if you are unsure. |
| Docker Desktop says WSL needs an update | Run `wsl --update` in PowerShell, then start Docker Desktop again. |
| `error during connect` or `Is the docker daemon running?` | Start Docker Desktop and wait for **Engine running**. |
| An error shows a path such as `C:/Program Files/Git/...` | Add `MSYS_NO_PATHCONV=1` in front of the `docker` command (Step 11). |
| `the input device is not a TTY` | Run the command in VS Code's terminal, or put `winpty` in front of it. |
| `₹` prints as `?` or strange characters | Run the command in VS Code's Git Bash terminal, and check the file is saved as UTF-8 (status bar). |
| `$'\r': command not found` or `bad interpreter` | The file has CRLF line endings. In VS Code, select `CRLF` in the status bar, choose `LF` and save. Then do Step 5. |
| `port is already allocated` for 27017 | Another MongoDB runs on your laptop. Stop the `MongoDB` service in Windows Services, or ask your mentor. |
| The laptop is slow while Docker runs | Check Step 9, and stop the cloud lab when you are not using it. |
