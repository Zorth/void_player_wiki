---
title:
draft: false
aliases:
  - 
date:
---
#location [[Kalogeron]]

Dungeon in [[Kalogeron]], used to belong to [[Zakhad]]

# Mapping
> [!note]
> The layout of the tower is *funky*™ and therefore this may or may not actually be useful.

```mermaid
flowchart TB

	n0{"n0<br>Starting Room<br>(4 Doors)"}
	n0 -- Straight --> n1.0
	n0 -- Left --> n2.0
	n0 -- right --> n3.0
	n0 -- back --> n4.0
	
	n1.0["n1.0<br>Busts of the EoU<br>(4 Doors + back, small planar tear)"]
	n1.0 -- Door 1 (most left) --> n1.1a
	n1.0 -- Door 2 --> n1.2
	n1.0 -- Door 3 --> n1.3
	n1.0 -- Door 4 --> n1.4

	n1.1a["n1.1a<br>Aluum Golem Workshop"]
	n1.1a --> n1.1b
	n1.1b["n1.1b<br>Mirror maze<br>! Expect combat"]
	n1.1b --> n1.1c
	n1.1c["n1.1c<br>Magic Sewers"]
	n1.1c --> n1.1d
	n1.1d["n1.1d<br>Living Room"]
	n1.1d --> n1.1e
	n1.1e("n1.1e<br>The Golem's Heart")
	n1.1e --o n1.1f
	n1.1f["n1.1f<br>Golem's Guard Hall<br>! Expect difficult combat"]
	n1.1f --> n1.1g
	n1.1g["n1.1g<br>Zakhad's Bedchambers"]
	
	n2.0[n2.0<br>???]

	n3.0[n3.0<br>???]
	
	n4.0[n4.0<br>???]

```

> [!Example] Graph explanation
> - Diamond rooms `{}` have different directions
> 	- they increase the depth of the id (e.g. n1**.1**)
> - Square rooms `[]` have only a door forwards and backwards
> 	- they increment the linear depth (e.g. n1.1**b**)
> - Rounded rooms `()` are dead ends and only go backwards
> - arrowed lines `-->` are moving forwards
> - circle lines `--o` are moving backwards
