# Void Wiki - Self-Hosted Wiki.js Setup Guide

This guide walks you through deploying **Wiki.js** on your server using **Docker Compose**, authenticating users with your production **Clerk instance** (`clerk.tarragon.be`), and maintaining **two-way Git sync** with your GitHub repository and local Obsidian vault via the clean `content` branch.

---

## Architecture Overview

```
[Browser / Mobile (wiki.zorth.eu / void.tarragon.be)]
               │ (HTTPS)
               ▼
[Nginx / NPM Reverse Proxy (Port 443)]
               │ (Proxy to 127.0.0.1:3005)
               ▼
[Wiki.js Container (Node.js)] ◄─── OIDC Auth ───► [Clerk (clerk.tarragon.be)]
               │
               ├─► [PostgreSQL Container (Content, Revisions, Full-Text Search)]
               │
               └─► [Bidirectional Git Sync] ◄───► [GitHub (branch: content)]
                                                         │
                                                         ▼
                                            [GM Local Obsidian Vault]
```

---

## Branch Structure

- **`wikijs`**: Houses the Docker Compose deployment, reverse proxy templates, environment configurations, and documentation.
- **`content`**: Contains the raw Markdown vault (`index.md`, `World Notes/`, `_META/`, etc.) located at the repository root. Used directly by Obsidian and by Wiki.js for storage sync.

---

## 1. Quickstart: Running on Thor Server

### Step 1.1: Clone & Configure
On your server:

```bash
# Clone the repository or checkout the wikijs branch
git clone -b wikijs https://github.com/Zorth/void_player_wiki.git /thor-server/apps/void_player_wiki
cd /thor-server/apps/void_player_wiki

# Copy environment template
cp .env.example .env
```

### Step 1.2: Edit `.env`
Open `.env` and set your configuration:

```bash
DB_USER=wikijs
DB_PASS=YourSecurePasswordHere123!
DB_NAME=wiki
WIKI_PORT=3005
WIKI_BIND_IP=0.0.0.0
WIKI_URL=https://wiki.zorth.eu
```

> [!IMPORTANT]
> **Host Path Rule:** Dockge and Docker Compose on Thor require **absolute host paths** for all volume bind mounts (e.g. `/thor-server/apps/void_player_wiki/data/...` and `/mnt/whale/...`). Do not use relative `./data` paths.

### Step 1.3: Start the Containers

```bash
docker compose up -d
```

Check that both containers are running and healthy:

```bash
docker compose ps
```

You should see:
- `void-wiki-db`: `Up (healthy)`
- `void-wiki`: `Up`

---

## 2. Reverse Proxy Configuration

Forward incoming HTTPS traffic for your domain to internal port `3005`:

### Nginx Proxy Manager (GUI)
- **Domain Names:** `wiki.zorth.eu` (or `void.tarragon.be`)
- **Scheme:** `http`
- **Forward Host / IP:** `127.0.0.1` (or host IP)
- **Forward Port:** `3005`
- **Websockets Support:** Enabled
- **Block Common Exploits:** Enabled
- **SSL:** Request Let's Encrypt certificate with Force SSL and HTTP/2 Support.

### Raw Nginx Configuration
A ready-to-use template is available in `nginx/wiki.tarragon.be.conf`. Copy it to your sites configuration:

```bash
sudo cp nginx/wiki.tarragon.be.conf /etc/nginx/sites-available/void.tarragon.be.conf
sudo ln -s /etc/nginx/sites-available/void.tarragon.be.conf /etc/nginx/sites-enabled/
sudo certbot --nginx -d void.tarragon.be
sudo nginx -t && sudo systemctl reload nginx
```

---

## 3. Initial Setup Wizard

1. On your first visit to `https://wiki.zorth.eu`, you will see the **Wiki.js Initial Setup** screen.
2. Enter:
   - **Administrator Email**: your email
   - **Administrator Password**: a secure master password
   - **Site URL**: `https://wiki.zorth.eu` (or `https://void.tarragon.be`)
3. Click **Install**. Within a few seconds, you will be taken to the login screen.

---

## 4. Clerk Authentication Setup (Production: `clerk.tarragon.be`)

To let players and GMs log in using their Void Guild accounts:

### Step 4.1: Register OAuth Application in Clerk
1. Go to your **Clerk Dashboard** (for `clerk.tarragon.be`).
2. Navigate to **Configure** -> **OAuth Applications** (or **SSO / Integrations**).
3. Click **Add OAuth Application**:
   - **Name**: `Void Player Wiki`
   - **Redirect URI / Callback URL**: `https://wiki.zorth.eu/login/callback` (and `https://void.tarragon.be/login/callback`)
   - **Scopes**: `openid`, `profile`, `email`
4. Copy the generated **Client ID** and **Client Secret**.

### Step 4.2: Enable Generic OIDC in Wiki.js
1. Log into Wiki.js as Administrator.
2. Open the **Administration Area** (gear icon in the sidebar).
3. In the left menu, click **Authentication** -> **Add Strategy**.
4. Select **Generic OIDC (OpenID Connect)**.
5. Fill in the fields:
   - **Client ID**: `<Your Clerk Client ID>`
   - **Client Secret**: `<Your Clerk Client Secret>`
   - **Discovery / Issuer URL**: `https://clerk.tarragon.be`
   - **Authorization URL**: `https://clerk.tarragon.be/oauth/authorize`
   - **Token URL**: `https://clerk.tarragon.be/oauth/token`
   - **User Info URL**: `https://clerk.tarragon.be/oauth/userinfo`
   - **Display Name**: `Guild of The Void`
   - **Allow Self-Registration**: Toggle **ON** (so existing guild members are automatically assigned the default `Users` group on first login).
   - **Assign to Group**: `Users` (or default group with Edit permissions).
6. Click **Save** in the top right.

Players will now see a **"Log in with Guild of The Void"** button on the login screen.

---

## 5. Connecting Git Storage (Two-Way Sync with Obsidian)

Wiki.js supports **Bidirectional Git Sync**, allowing web edits to automatically push to GitHub, and Obsidian edits to automatically pull into Wiki.js.

### Step 5.1: Configure Git Storage in Wiki.js
1. In the Wiki.js Administration Area, click **Storage**.
2. Click **Git** from the list of storage targets.
3. Configure the settings:
   - **Repository URL**: `https://github.com/Zorth/void_player_wiki.git`
   - **Branch**: `content`
   - **Authentication**:
     - **Username**: `Zorth` (or a bot account)
     - **Personal Access Token**: GitHub token with `repo` read/write permissions
   - **Sync Direction**:
     - Select **Bidirectional (Storage <-> Database)**:
       - Edits on the web are pushed to GitHub `content` branch.
       - Edits pushed to GitHub (from Obsidian) are pulled into Wiki.js.
   - **Sync Schedule**: Every 5 minutes (or trigger manually).
4. Click **Apply**.

---

## 6. Backups & Maintenance

All persistent data is stored in host-mounted directories:
- `/thor-server/apps/void_player_wiki/data/postgres`: PostgreSQL database (articles, users, revisions).
- `/thor-server/apps/void_player_wiki/data/wiki`: Wiki.js configuration, avatars, and cache.
- `/mnt/whale/07_NOTES_WORKING/void_player_wiki`: Storage bind mount.

### PostgreSQL Database Backup
To create an immediate database dump:

```bash
docker exec -t void-wiki-db pg_dump -U wikijs -d wiki > ~/backup_wiki_$(date +%Y%m%d_%H%M%S).sql
```

### PostgreSQL Database Restore
```bash
cat ~/backup_wiki_<timestamp>.sql | docker exec -i void-wiki-db psql -U wikijs -d wiki
```
