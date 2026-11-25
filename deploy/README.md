# Going live: your capstone on a real server

In week 9 (CP2, task 8) you put your capstone on the internet for one day: a small AWS server in Mumbai, a free name from DuckDNS, HTTPS from Caddy, and your Compose stack. Then you tear it all down and prove that nothing is left running.

Everything is done by hand, in the AWS console, AWS CloudShell and Git Bash. Read Parts 1 to 6 first, then do them **on one day**, from the budget alarm to the teardown. Plan about three hours.

| Part | What you do | Where |
|---|---|---|
| 1 | Your AWS account: Free plan, root MFA, a card if AWS asks | AWS console |
| 2 | **The budget alarm, first**: `capstone-5usd` | Billing console and CloudShell |
| 3 | An SSH key, then the server: Ubuntu 24.04, `t3.small`, security group `capstone-web` | Git Bash, EC2 console and CloudShell |
| 4 | DuckDNS, copy the project, `.env`, Compose with the override, the `curl` checks | duckdns.org, Git Bash and SSH |
| 5 | The cost record: `capstone/deploy/COST.md` | Your task folder |
| 6 | The teardown checklist, and the proof that nothing is left | EC2 console, CloudShell and Git Bash |

Before you start, your capstone runs on your laptop with `docker compose up -d --build` (CP2 task 5): `compose.yml` with `db` (MongoDB, as in the next section), `api` (your Express API on port 3000) and `web` (Caddy serving your built front end), and `web/Caddyfile` copied from [`Caddyfile.example`](Caddyfile.example). Below, `<ip>` is your server's public IPv4 address and `<name>` is your DuckDNS name without `.duckdns.org`.

**Facts checked on 24 November 2026** on aws.amazon.com and AWS's documentation: the Free plan, the free-tier instance types, CloudShell in Mumbai and the Mumbai prices. Let's Encrypt's limits were checked the same day on letsencrypt.org. If you read this much later, check the prices again (Part 5).

## The `db` service for compose.yml

CP2 task 5 runs MongoDB inside your capstone's own Compose stack, as the service `db`. It is the same one-node replica set as the cloud lab (transactions need one), with one difference: inside Compose, the set's only member is called **`db:27017`**, the name the `api` container uses to reach it.

```yaml
services:
  db:
    image: mongo:8.0
    command: ["--replSet", "rs0", "--bind_ip_all"]
    volumes:
      - db-data:/data/db
    # The health check also starts the replica set the first time, as the cloud lab's does.
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "try { rs.status() } catch (e) { rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'db:27017' }] }) }; quit(db.hello().isWritablePrimary ? 0 : 1)"]
      interval: 5s
      timeout: 10s
      retries: 20
      start_period: 20s

  api:
    environment:
      MONGODB_URI: mongodb://db:27017/capstone?replicaSet=rs0
    depends_on:
      db:
        condition: service_healthy

volumes:
  db-data:
```

- `rs.status()` fails until the set exists; then `rs.initiate()` makes it with the member `db:27017`. The check passes once `db` is the primary, so `docker compose ps` shows `db` as `(healthy)` about 15 seconds after the first start, and the `api` waits for that before it starts.
- `db` publishes **no port**. Only the `api` container reaches it, on Compose's private network. To look inside, use `docker compose exec db mongosh capstone`.
- The `api`'s `MONGODB_URI` names `db`, never `localhost`: inside the `api` container, `localhost` is the `api` container itself.
- The image includes `mongosh`, which the health check runs. This recipe was run on 24 November 2026 with `mongo:8.0.38`, a Node 26 API image and Caddy: `db` healthy in about 15 seconds, a transaction from the API worked, and `/api/health` answered through Caddy.

### Why MongoDB has no password

A database without a password is safe here only because nothing outside the server can reach it: `db` publishes no port, `compose.prod.yml` removes any port it might have (`ports: !reset []`), and the security group opens only 22, 80 and 443. Never publish 27017 on a server.
Turning on MongoDB's users and passwords for a replica set also needs a shared key file for the members (`--keyFile`). That is a good next step after the course, not part of it.

## Part 1: your AWS account

**The AWS Free plan** (aws.amazon.com/free and the Free Tier FAQ, read on 24 November 2026):

- A new account gets **$100 in credits** at sign-up, and can earn up to $100 more.
- The Free plan ends **6 months after you open the account, or when the credits run out**, whichever comes first. You are not charged on the Free plan unless you upgrade to the Paid plan.
- When it ends, AWS suspends the account, keeps your data for 90 days, then erases it unless you upgrade.
- Most new customers need no payment card, but AWS may ask for one to check who you are. If it asks and you have no card that allows international payments, tell your mentor early: the centre provides one.

Do this once, the first time you use the account:

1. Sign up at https://aws.amazon.com and choose the **Free plan**.
2. Sign in as the **root user** (the email you signed up with). Open your account name at the top right, then **Security credentials**, and assign an **MFA device** (an authenticator app on your phone). Sign out and in again to check it asks for the code.
3. Recommended: work as an IAM user, not root. As root, open your account name, then **Account**; under **IAM user and role access to Billing information**, choose **Edit**, tick **Activate IAM Access** and update. Then in **IAM**, **Users**, **Create user**: a name such as `admin-asha`, **Provide user access to the AWS Management Console**, and the policy **AdministratorAccess**. Sign in as that user from now on.
4. At the top right of the console, choose the region **Asia Pacific (Mumbai) ap-south-1**. Check it says Mumbai before every step.

## Part 2: the budget alarm, first

A budget compares your spending with an amount you choose, and emails you when it passes a threshold. Set it **before** you create anything.

**Budgets alert. They never stop spending.**

- A budget only sends an email. It does not stop, pause or delete anything. A server keeps running, and keeps using credits, after the 100% alert.
- The alert comes late: AWS updates budget data up to three times a day.
- The only way to stop spending is to delete what you made (Part 6).

**Exclude credits.** On the Free plan, credits pay for what you use. A budget counts credits by default, so its spending stays at $0 while your credits drain, and the alarm never fires. Exclude them, so the budget counts your real usage.

1. Open https://console.aws.amazon.com/cost-management/ and choose **Budgets**, then **Create budget**.
2. Under **Budget setup**, choose **Customize (advanced)**. Under **Budget types**, choose **Cost budget**, then **Next**.
3. Name it `capstone-5usd`. Set **Period** to **Monthly**, **Budget renewal type** to **Recurring budget** and **Budgeting method** to **Fixed**. Enter `5.00`.
4. In **Budget scope**, add a filter for **Charge type**, choose to exclude, and select **Credit**. (An older console shows a **Credits** box under **Advanced options** instead: clear it.) Choose **Next**.
5. **Add an alert threshold**: `80`, **% of budgeted amount**, trigger **Actual**, with your email under **Email recipients**.
6. Add a second threshold: `100`, **% of budgeted amount**, trigger **Forecasted**, with the same email.
7. Choose **Next** twice (no actions), check the summary, and choose **Create budget**.
8. Open the email from AWS and choose the link to verify your address. You get no alerts until you do.

**The evidence, as text.** Open **AWS CloudShell**: the `>_` icon at the top of the console, or https://console.aws.amazon.com/cloudshell/. It is a terminal in your browser, already signed in as you, with the AWS CLI installed, and it has no extra charge. CloudShell runs in Mumbai (`ap-south-1`); check the region at the top right. Then run:

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws budgets describe-budgets --account-id "$ACCOUNT_ID" --query "Budgets[].{Name:BudgetName,Limit:BudgetLimit,TimeUnit:TimeUnit,IncludeCredit:CostTypes.IncludeCredit,Updated:LastUpdatedTime}"
aws budgets describe-notifications-for-budget --account-id "$ACCOUNT_ID" --budget-name capstone-5usd
```

Paste both outputs under `## Budget` in `evidence.md`. They show `capstone-5usd`, `5.0 USD`, `MONTHLY`, the time you set it (before your server's launch time), and the two alerts: `ACTUAL` at 80 and `FORECASTED` at 100.

## Part 3: the SSH key and the server

### The SSH key

In Git Bash on your laptop:

```bash
mkdir -p ~/.ssh
ssh-keygen -t ed25519 -f ~/.ssh/capstone-key -N ""
cat ~/.ssh/capstone-key.pub
```

`~/.ssh/capstone-key` is the private key: it never leaves your laptop and never goes into Git. `capstone-key.pub` is the public key, which is safe to share. Git Bash's `ssh` accepts the key as `ssh-keygen` writes it: no `chmod` is needed.

In the EC2 console (Mumbai), open **Key pairs** (under **Network & Security**), then **Actions**, **Import key pair**. Name it `capstone-key`, paste the whole `.pub` line, and choose **Import key pair**.

### The server

`t3.small` (2 vCPUs, 2 GiB) is on the list of **Free tier eligible** instance types in the EC2 User Guide's "Free Tier usage" page, read on 24 November 2026 (with `t3.micro`, `t4g.micro`, `t4g.small` and others). Credits pay for it on the Free plan.

In the EC2 console, choose **Instances**, then **Launch instances**:

| Setting | Choose |
|---|---|
| **Name and tags** | Name `capstone`. Choose **Add additional tags**: key `project`, value `capstone`, and in **Resource types** tick Instances and Volumes |
| **Application and OS Images** | **Ubuntu**, then **Ubuntu Server 24.04 LTS (HVM), SSD Volume Type**, 64-bit (x86), marked Free tier eligible |
| **Instance type** | `t3.small`, marked Free tier eligible |
| **Key pair (login)** | `capstone-key` |
| **Network settings** | **Edit**. Keep **Auto-assign public IP** enabled. **Create security group** named `capstone-web`. Rules: **SSH** (22) from **My IP**; then **Add security group rule** twice: **HTTP** (80) and **HTTPS** (443), each from **Anywhere** (`0.0.0.0/0`) |
| **Configure storage** | 20 GiB, `gp3` |
| **Advanced details**, **User data** | The script below |

The **user data** script runs once, as root, when the server first starts. It installs Docker Engine and the Compose plugin, lets the `ubuntu` user run Docker, and adds 2 GiB of swap, so building the web image does not run out of memory:

```bash
#!/bin/bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker ubuntu
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

Choose **Launch instance**, then **View all instances**. Wait until **Instance state** is **Running**. Copy its **Public IPv4 address**: that is `<ip>`.

**The evidence.** In CloudShell, paste both outputs under `## Server` in `evidence.md`:

```bash
aws ec2 describe-instances --region ap-south-1 --filters Name=tag:project,Values=capstone --query "Reservations[].Instances[].[InstanceId,InstanceType,LaunchTime,State.Name,PublicIpAddress]" --output table
aws ec2 describe-security-groups --region ap-south-1 --group-names capstone-web --query "SecurityGroups[].IpPermissions[].[FromPort,IpRanges[].CidrIp]"
```

The first shows `t3.small` and its `LaunchTime`, which must be after your budget's time. The second shows port 22 from one `/32` (your address) and ports 80 and 443 from `0.0.0.0/0`.

## Part 4: DNS, the project and HTTPS

### A DuckDNS name

1. Open https://www.duckdns.org and sign in with GitHub or Google.
2. Add a sub domain, such as `capstone-asha`. In **current ip**, type `<ip>` and choose **update ip**.
3. The page shows your **token**. It works like a password for your names: never put it in Git, `evidence.md` or a chat.

On your laptop, wait until the name gives your server's address (usually under a minute), and paste the output under `## DNS`:

```bash
nslookup <name>.duckdns.org
```

### Copy the project to the server

On your laptop, in your task folder (the one that holds `capstone/`):

```bash
cp ~/mern-ess-kit/deploy/compose.prod.example.yml capstone/compose.prod.yml
tar --exclude=node_modules --exclude=dist --exclude=.env -czf ~/capstone.tgz capstone
scp -i ~/.ssh/capstone-key ~/capstone.tgz ubuntu@<ip>:~
```

Read `compose.prod.yml` before you copy it: its comments explain each line. `--exclude=node_modules` and `--exclude=dist` leave out what the server builds again (Windows `node_modules` do not work in a Linux container). `--exclude=.env` leaves your laptop's `.env` behind, but keeps `web/.env.production` (`VITE_API_URL=/api`), which the web build needs.

### Start it on the server

```bash
ssh -i ~/.ssh/capstone-key ubuntu@<ip>
```

The first time, SSH asks `Are you sure you want to continue connecting`: type `yes`. On the server:

```bash
cloud-init status --wait
docker compose version
free -h
tar -xzf capstone.tgz && cd capstone
nano .env
```

`cloud-init status --wait` waits until the user data has finished, then prints `status: done`. `free -h` shows about 1.9 GiB of memory and 2.0 GiB of swap.

In `.env`, write your site's name and **new** values for your API's secrets (the names from your `.env.example`), then save with Ctrl+O, Enter and Ctrl+X:

```text
SITE_DOMAIN=<name>.duckdns.org
JWT_SECRET=<a new long random value>
```

`openssl rand -hex 32` on the server prints a good random value. If your API has no secrets, `SITE_DOMAIN` is the only line. MongoDB needs no password here (see "Why MongoDB has no password" above). Then start the stack with both files, and load your seed data:

```bash
docker compose -f compose.yml -f compose.prod.yml up -d --build
docker compose -f compose.yml -f compose.prod.yml exec -T api node seed/seed.ts
docker compose -f compose.yml -f compose.prod.yml ps
```

The first build takes several minutes. Paste `ps` under `## Live`: `db` is `(healthy)`, and only `web` publishes ports, 80 and 443. If your seed script has another name, run that file instead; it must use the same `MONGODB_URI` as the API.

Caddy asks Let's Encrypt for a certificate within a minute. Watch it with `docker compose -f compose.yml -f compose.prod.yml logs web --tail 20`, and look for `certificate obtained successfully`.

### The checks

On your laptop, paste each output under `## HTTPS`:

```bash
curl -I http://<name>.duckdns.org
curl -I https://<name>.duckdns.org
curl -s https://<name>.duckdns.org/api/health
```

- `http://` answers `308 Permanent Redirect` with `Location: https://...`: Caddy sends plain HTTP to HTTPS.
- `https://` answers `HTTP/1.1 200` or `HTTP/2 200`: your web app, over HTTPS.
- `/api/health` prints `{"status":"ok"}`: the API, through Caddy.

To see the certificate, run `curl -sv https://<name>.duckdns.org -o /dev/null 2>&1 | grep -iE "subject:|issuer:|expire"`. If it prints nothing (Windows' curl uses its own TLS library), run `echo | openssl s_client -connect <name>.duckdns.org:443 -servername <name>.duckdns.org 2>/dev/null | openssl x509 -noout -subject -issuer -enddate`.

Then use the site on your phone, through your main flow and the hard rule.

**Let's Encrypt's limits** (letsencrypt.org, read on 24 November 2026): at most **5 certificates for the same name every 7 days**, and at most 5 failed checks for one name an hour. `duckdns.org` is on the Public Suffix List, so your name counts on its own, not with everyone else's DuckDNS names. Never delete the `caddy-data` volume to "retry": fix the cause, then restart `web`.

## Part 5: the cost record

Prices for Asia Pacific (Mumbai), on demand, Linux, from AWS's price list published on 23 November 2026 and read on 24 November 2026. Check them again at https://aws.amazon.com/ec2/pricing/on-demand/, https://aws.amazon.com/ebs/pricing/ and https://aws.amazon.com/vpc/pricing/ if you deploy much later.

| Item | AWS price | Per hour |
|---|---|---|
| EC2 `t3.small` | $0.0224 an hour | $0.0224 |
| Public IPv4 address | $0.005 an hour, in use or idle | $0.0050 |
| EBS `gp3` disk, 20 GiB | $0.0912 a GB-month: 20 × 0.0912 ÷ 730 | $0.0025 |
| **Total** | | **about $0.03 an hour** |

A server you run for 8 hours uses about **$0.24** of credits. One you forget for a 30-day month (730 hours) uses about **$21.83**. That is why Part 6 matters.

Write `capstone/deploy/COST.md` with this table, filled with your own hours (from the `LaunchTime` in Part 3 to your teardown time, rounded up):

```markdown
# What the capstone cost on AWS

Prices: Asia Pacific (Mumbai), on demand, read on <date> from <page>.

| Item | Price per hour (USD) | Hours | Cost (USD) |
|---|---|---|---|
| EC2 t3.small | 0.0224 | | |
| Public IPv4 address | 0.0050 | | |
| EBS gp3, 20 GiB | 0.0025 | | |
| **Total** | | | |

A 30-day month (730 hours) would cost: <sum> USD.
Budget's actual spend, read on <date and time>: <CalculatedSpend> USD.
```

Show every sum. The next day, add the actual spend from Part 6.

Write `capstone/deploy/DEPLOY.md` as you go: every command, in order, from the budget to the teardown, with the setting names of `.env` but never their values. Someone else must be able to repeat the deploy from it.

## Part 6: tear it down, and prove nothing is left

Do this on the same day. Work through the checklist, then paste the proof under `## Teardown` in `evidence.md`.

- [ ] **On the server** (optional, it stops the app cleanly): `docker compose -f compose.yml -f compose.prod.yml down`, then `exit`.
- [ ] **Instance**: in the EC2 console (Mumbai), **Instances**, select `capstone`, **Instance state**, **Terminate (delete) instance**. Wait for **Terminated**. Its root disk is deleted with it, and its public IPv4 address is released.
- [ ] **Security group**: **Security Groups**, select `capstone-web`, **Actions**, **Delete security groups**. It can go only after the instance is terminated.
- [ ] **Key pair**: **Key pairs**, select `capstone-key`, **Actions**, **Delete**.
- [ ] **Elastic IPs**, **Volumes** and **Snapshots**: each list is empty. If you made anything there, delete or release it: an unattached address still costs $0.005 an hour.
- [ ] **DuckDNS**: clear your name's address from your laptop. The command prints `OK`; paste only `OK`, never the token.

  ```bash
  curl "https://www.duckdns.org/update?domains=<name>&token=<your token>&clear=true"
  ```

**The proof, in CloudShell** (Mumbai). Paste each output:

```bash
aws ec2 describe-instances --region ap-south-1 --filters Name=tag:project,Values=capstone --query "Reservations[].Instances[].[InstanceId,LaunchTime,State.Name]" --output table
aws ec2 describe-volumes --region ap-south-1 --query "Volumes[].[VolumeId,State]"
aws ec2 describe-addresses --region ap-south-1 --query "Addresses[].PublicIp"
aws ec2 describe-security-groups --region ap-south-1 --group-names capstone-web
aws ec2 describe-key-pairs --region ap-south-1 --key-names capstone-key
```

| Command | Proof that nothing is left |
|---|---|
| `describe-instances` | Your instance shows `terminated`, on the same date as its `LaunchTime` |
| `describe-volumes` | `[]` |
| `describe-addresses` | `[]` |
| `describe-security-groups` | an error with `InvalidGroup.NotFound` |
| `describe-key-pairs` | an error with `InvalidKeyPair.NotFound` |

A terminated instance stays in the list for about an hour, then disappears; both are fine.

**The next day**, read the actual spend in CloudShell and add it to `COST.md`:

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws budgets describe-budget --account-id "$ACCOUNT_ID" --budget-name capstone-5usd --query "Budget.CalculatedSpend"
```

It can show `0` or a few cents for up to a day, because budgets update up to three times a day. Write down when you read it. Keep the budget itself: it costs nothing and protects you for the rest of the Free plan.

## Secrets: what never goes into Git

- the private key `~/.ssh/capstone-key` (the `.pub` file is safe);
- the server's `.env` and your laptop's `.env` (only `.env.example`, with names and placeholder values such as `JWT_SECRET=change-me`, is committed);
- the DuckDNS token;
- any AWS password or access key.

The public IP address, your DuckDNS name and your 12-digit account ID are not secrets.

## If something goes wrong

| What you see | What to do |
|---|---|
| `ssh` hangs, then `Connection timed out` | Your own address changed. Edit the `capstone-web` SSH rule to **My IP** again. Check the instance is **Running**. |
| `Permission denied (publickey)` | Use `-i ~/.ssh/capstone-key` and the user `ubuntu`. Check the instance uses the key pair `capstone-key`. |
| `docker: command not found` or `permission denied ... docker.sock` | The user data has not finished: run `cloud-init status --wait`, then `exit` and `ssh` again. If it says `error`, read `sudo tail -50 /var/log/cloud-init-output.log`. |
| No certificate: the `web` log shows `challenge failed` or a timeout | `nslookup <name>.duckdns.org` must give `<ip>`, and ports 80 and 443 must be open to Anywhere. Fix it, then `docker compose -f compose.yml -f compose.prod.yml restart web`. |
| The `web` log says `too many certificates` | You hit Let's Encrypt's 5-a-week limit. Keep `caddy-data`; wait, or use a new DuckDNS name. |
| `502 Bad Gateway` on `/api/...` | The API is not running. Read `docker compose -f compose.yml -f compose.prod.yml logs api --tail 30`: often a missing secret in `.env`, or the API cannot reach MongoDB (next rows). |
| The `api` log says `ERR_MODULE_NOT_FOUND` | A relative import has no file ending. Node's type stripping needs the full name: `import { connect } from './db.ts'`, not `'./db'`. Fix it, then `up -d --build` again. |
| The `api` log says `MongoServerSelectionError` or `ECONNREFUSED 127.0.0.1:27017` | `MONGODB_URI` says `localhost`. Inside Compose it must say `db`: `mongodb://db:27017/capstone?replicaSet=rs0`. |
| `db` stays `(health: starting)` or `unhealthy` | Read `docker compose -f compose.yml -f compose.prod.yml logs db --tail 30`. Check the health check names `db:27017` and `command` has `--replSet rs0`. A set made earlier with another member name stays in the `db-data` volume: on a fresh server, `down -v` and `up` again (this deletes the data, so seed again). |
| The `api` log says `Transaction numbers are only allowed on a replica set member` | `MONGODB_URI` has no `replicaSet=rs0`, or `db` runs without `--replSet rs0`. |
| The page loads but every API call fails | The web app was built without `VITE_API_URL=/api`. Check `web/.env.production`, then build again with `up -d --build`. |
| The build stops with exit code 137 | The server ran out of memory. Check `free -h` shows the swap, then build again while nothing else runs. |
| `npm ci` fails in the web build with a platform error | `web/.dockerignore` is missing, so Windows `node_modules` were copied in. Add `node_modules` and `dist` to it. |
| A page gives 404 after a reload | Check the `try_files {path} /index.html` line in `web/Caddyfile`. |
