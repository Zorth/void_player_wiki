
# Setting up Obsidian.md

Clone the repo using github.

Copy the `/content/.obsidian.defaults` folder and name it `/content/.obsidian`.

Open Obsidian.md > open folder as vault > select the `/content` folder.

# Committing

Use git, lazygit, or the git plugin (in obsidian) to push changes to v4, they will then automatically be updated to the website.

ALWAYS `git pull --rebase` before pushing, preferably before editing.

This can be defaulted with `git config pull.rebase true` (optionally with `--global` if you want it everywhere).

