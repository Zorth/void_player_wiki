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
	n0 -- Straight --> n1_0
	n0 -- Left --> n2_0
	n0 -- right --> n3_0
	n0 -- back --> n4_0
	
	%% n1 = straight at entrance
	n1_0["n1_0<br>Busts of the EoU<br>(4 Doors + back, small planar tear)"]
	n1_0 -- Door 1 (most left) --> n1_1a
	n1_0 -- Door 2 --> n1_2
	n1_0 -- Door 3 --> n1_3
	n1_0 -- Door 4 --> n1_4

	%% n1_1 = first door (a, b, ___ is linear depth)
	n1_1a["n1_1a<br>Aluum Golem Workshop"]
	n1_1a --> n1_1b
	n1_1b["n1_1b<br>Mirror maze<br>! Expect combat"]
	n1_1b --> n1_1c
	n1_1c["n1_1c<br>Magic Sewers"]
	n1_1c --> n1_1d
	n1_1d["n1_1d<br>Living Room"]
	n1_1d --> n1_1e
	n1_1e("n1_1e<br>The Golem's Heart")
	n1_1e --o n1_1f
	n1_1f["n1_1f<br>Golem's Guard Hall<br>! Expect difficult combat"]
	n1_1f --> n1_1g
	n1_1g["n1_1g<br>Zakhad's Bedchambers"]
	
	%% n2 = left at entrance
	n2_0[n2_0<br>???]

	%% n3 = right at entrance
	n3_0[n3_0<br>???]
	
	%% n4 = back at entrance	
	n4_0[n4_0<br>???]

```

> [!Example] Graph explanation
> - Diamond rooms `{}` have different directions
> 	- they increase the depth of the id (e.g. n1**\_1**)
> - Square rooms `[]` have only a door forwards and backwards
> 	- they increment the linear depth (e.g. n1\_1**b**)
> - Rounded rooms `()` are dead ends and only go backwards
> - arrowed lines `-->` are moving forwards
> - circle lines `--o` are moving backwards
