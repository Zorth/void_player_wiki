---
title: Contributing to the wiki
draft: false
aliases:
  - Contributing to the wiki
date:
---
There are a couple ways to contribute to the wiki, first and foremost all articles written should follow the [[_guidelines]].

> [!warning] GitHub Access
> In order to contribute to the [github repo]( https://github.com/Zorth/void_player_wiki ) with method 2 or 3, you will need to be granted access[^1]. This is done by sending your GitHub account or e-mail to Jasper on discord.

Method 3 is the preferred method for anyone that wishes to contribute multiple times to the wiki and has some mental capacity to understand git.
# Method 1: Offloading
The first way to contribute is simply to send your note (preferably in `.md` format) to somebody with access to the wiki (visible on the [github repo]( https://github.com/Zorth/void_player_wiki )). They can then upload your file(s) and fix everything for you.

This is only recommended if you only want to contribute very little and/or are technically incapable of using git.

# Method 2: Github Web
Simply navigate to the [github repo]( https://github.com/Zorth/void_player_wiki ) and navigate to the content folder in the repository, there you can edit or add files in the appropriate folders and commit them straight to the repo. Doing this on the branch `v4` will automatically update the wiki in a couple of seconds.

# Method 3: Obsidian
1. Follow the Instructions in the readme.md at the root of the repo to clone and setup the repo locally.
2. Open obsidian, open folder as vault, and select the `content` folder inside the repo
3. Make sure to `git pull --rebase` every time before you start making changes.
4. Use git (or lazygit, GitHub desktop, etc.) to commit and push changes to the repository.
5. Changes to the `v4` branch will sync to the wiki after deployment.

[^1]: This could also be achieved by forking the repo and making a pull request, if you are familiar with GitHub.
