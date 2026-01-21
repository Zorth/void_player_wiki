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
	n0 <-- Left<br>(no rune) --> n2a
	n0 -- right --> n3.0
	n0 -- back --> n4.0
	
	n1.0{"n1.0<br>Busts of the EoU<br>(4 Doors + back, <s>small planar tear</s>)"}
	n1.0 -- Door 1 (most left) --> n1.1a
	n1.0 -- Door 2 --> n1.2
	n1.0 -- Door 3 --> n1.3
	n1.0 -- Door 4 --> n1.4
	n1.0 --o n1.5a
	n1.5a["n1.5a<br>Chained Fire Elemental"]
	n1.5a --o n1.5b.0
	
	n1.5b.0{"n1.5b.0<br>Laboratory"}
	n1.5b.0 -- left --> n1.5b.1a
	n1.5b.0 --o n2a
	n1.5b.0 -- straight --> n1.5b.2
	n1.5b.1a["n1.5b.1a<br>Enhanced Gravity Room"] 
	n1.5b.1a --> n1.5b.1b.0
	n1.5b.1b.0["n1.5b.1b.0<br>Mirror flats"]
	n1.5b.1b.0 -- left --> n1.1a
	n1.5b.1b.0 -- right --> n1.5b.1b.2

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
	
	n2a{"n2<br>Storage room"}
	n2a -- upstairs<br>(secret) --> n2b

	n3.0{n3.0<br>Kitchen room}
	n3.0 -- Door 1 (most left) --> n1.5b.0
	n3.0 -- Door 2 --> n3.2
	
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
