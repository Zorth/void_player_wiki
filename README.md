# Void Player Wiki (Wiki.js Stack)

This branch (`wikijs`) contains the Docker Compose infrastructure, configuration, and documentation for running the self-hosted **Wiki.js** instance powering **The Void Player Wiki**.

---

## Architecture & Branches

- **`wikijs` branch (This branch):**
  - Docker Compose configuration (`docker-compose.yml`, `.env.example`).
  - Nginx reverse proxy configuration.
  - Deployment and administrative documentation.
  - No markdown content or static site generator build code is tracked here.

- **`content` branch:**
  - Dedicated exclusively to the raw markdown notes, world documents, and media assets.
  - Clean directory structure where files (`index.md`, `World Notes/`, `_META/`, etc.) live at the repository root.
  - Used directly as the root folder for the **Obsidian.md** vault.

---

## Quickstart (Thor Server)

### 1. Requirements & Storage Paths
Per Thor host guidelines, all bind mounts use absolute host paths:
- PostgreSQL Data: `/thor-server/apps/void_player_wiki/data/postgres`
- Wiki.js Cache / Local Data: `/thor-server/apps/void_player_wiki/data/wiki`
- Persistent Storage / Vault: `/mnt/whale/07_NOTES_WORKING/void_player_wiki`

### 2. Environment Configuration
Create `.env` from `.env.example`:
```bash
cp .env.example .env
```
Ensure the port (`3005`) and domain (`https://wiki.zorth.eu` or `https://void.tarragon.be`) match your proxy setup.

### 3. Running the Stack
```bash
docker compose up -d
```

Check service status:
```bash
docker compose ps
```

---

## Setting up Obsidian for GMs / Contributors

To edit wiki content directly from Obsidian:

1. Clone the `content` branch:
   ```bash
   git clone -b content https://github.com/Zorth/void_player_wiki.git ~/Documents/VoidWikiVault
   ```
2. Open Obsidian -> **Open folder as vault** -> select `~/Documents/VoidWikiVault`.
3. Set your git pull strategy to rebase to keep history linear:
   ```bash
   git config pull.rebase true
   ```
4. Push your changes to `content`.

---

## Authentication & Administration
- **Authentication:** Managed via Clerk OIDC (`https://clerk.tarragon.be`).
- **Detailed Documentation:** See [DOCKER_WIKI_SETUP.md](file:///thor-server/apps/void_player_wiki/DOCKER_WIKI_SETUP.md) for full OIDC setup, reverse proxy guides, and database backup routines.
