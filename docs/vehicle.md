# Duster II 4x2 GLP — vehicle pack and measure checklist

Print this page. Fill the **Measured** column in millimetres before cutting 15 mm plywood.

Car: **Dacia Duster II (2018–2024) 1.6 GLP 115 Ambiance 4x2**

GLP (LPG) tanks sit in the spare-wheel well. Expect a repair kit, not a spare, and a relatively flat boot floor compared with a 4x4 that carries a spare.

## Published starting dimensions (v0.1 CAD)

From the Duster II press kit unless noted. These are the defaults in `cad/params.py`.

| ID | What | Published | v0.1 CAD | Measured |
| --- | --- | --- | --- | --- |
| A | Width between wheel arches (narrowest) | 977 mm | box outer **950 mm** | |
| B | Load length, rear seats **up**, floor to seatback | 990 mm | box depth **800 mm** | |
| C | Load length, rear seats **folded**, floor to front-seat back | 1792 mm | bed length **1900 mm** (front seats fully forward) | |
| D | Rear elbow width | 1416 mm | — | |
| E | Rear shoulder width | 1379 mm | wings to **1300 mm** | |
| F | Boot volume 4x2 | 445 L | — | |
| G | Parcel-shelf height above boot floor | not published | box height **320 mm** | |
| H | Wheelbase | 2674 mm | — | |

Duster III (official pack car) is **1000 mm** between arches and **1672 mm** seats-folded. Do not use those numbers for cuts.

## How to measure

Use a steel tape. Two people helps for C and W1. Record the **smallest** number if the gap tapers.

Set-up for sleep-mode measurements (C, G, S1–S3, W1–W3, L1):

1. Front seats fully forward, backrests upright or slightly reclined as you would sleep.
2. Rear headrests removed or pushed down.
3. Rear seatbacks folded toward the front.
4. Parcel shelf removed.

Set-up for daily-mode measurements (A, B, G, T1–T4):

1. Rear seats up, usable for passengers.
2. Parcel shelf in its normal position.

## Print-ready checklist

### Boot envelope (box must fit)

| ID | Measure | How | Target / limit | Measured mm | OK? |
| --- | --- | --- | --- | --- | --- |
| A | Arch width | Narrowest gap between wheel-arch plastics, 50 mm above the floor | ≥ 960 (950 box + 10 clearance) | | |
| A2 | Arch width at 200 mm | Same gap at 200 mm above the floor (arches often lean in) | ≥ 960 | | |
| A3 | Arch width at shelf | Same gap at parcel-shelf height | ≥ 960 | | |
| B | Depth seats up | Inner tailgate plastic to rear seatback, on the floor centreline | ≥ 820 (800 box + 20) | | |
| B2 | Depth at mid height | Same, at 160 mm above the floor | ≥ 820 | | |
| G | Shelf height | Boot floor to underside of parcel shelf, centre | ≥ 330 (320 box + 10) | | |
| G2 | Floor flatness | Highest bump vs lowest point of the boot floor (GLP well / foam floor) | note mm | | |
| T1–T4 | Tie-downs | X/Y of each factory loop from the left-front corner of the boot floor | strap reach | | |

### Sleep envelope (bed 190 × 100 / 130)

| ID | Measure | How | Target / limit | Measured mm | OK? |
| --- | --- | --- | --- | --- | --- |
| C | Length seats folded | Inner tailgate to the back of the front seats (seats fully forward) | ≥ 1900 | | |
| C2 | Length to dash / pedals | If C < 1900, can feet go between the front seats? Note extra mm | 1900 − C | | |
| L1 | Deck height check | Folded seatback height above boot floor (highest point of the 60/40 split) | compare to 320 | | |
| S1 | Seatback angle | Angle of the folded backrest from horizontal (phone inclinometer) | typical 10–25° | | |
| S2 | Seatback contact Y | Distance from inner tailgate to the first point the frame will rest on the seatback | | | |
| S3 | Front footwell drop | Floor height in the rear footwell vs boot floor (for front legs) | | | |
| W1 | Door-area width | Inside-to-inside at **mattress height** (~320 mm) between rear door cards / plastics, with doors closed | ≥ 1320 (1300 + 20) | | |
| W2 | Door-area width at head | Same, 200 mm above the deck (shoulder room) | ≥ 1320 | | |
| W3 | Wing length available | Along Y, how long a 150 mm-wide wing can sit without hitting the C-pillar or arch | ≥ 600 | | |

### Hardware

| ID | Measure | How | Measured |
| --- | --- | --- | --- |
| H1 | Tie-down type | Photo + loop ID size (mm) | |
| H2 | 60/40 split | Both sides fold? Height mismatch left vs right (mm) | |
| H3 | Parcel shelf keep? | Can the shelf sit above a 320 mm box? yes/no | |
| H4 | Year / VIN year | Plate or V5 | |

## Sketch — where to put the tape

```text
TOP VIEW (rear seats folded, looking down)

        FRONT SEATS (pushed forward)
   +----------- C / C2 ----------------+
   |                                   |
   |     W1 / W2 (door-area width)     |
   |   <-------- 1300 target --------> |
   |         [wing]     [wing]         |
   |                                   |
   |  A = arch width (977 published)   |
   |   <-------- 950 box -------->     |
   |                                   |
 TAILGATE                         TAILGATE
   +------------- B (seats up) --------+

SIDE VIEW

  roof
   |        parcel shelf ---- G
   |   +--------+
   |   |  BOX   | 320          folded seatback / S1
   |   | 800 mm |==============\\======== deck 1900
   |   +--------+              legs
   +---- boot floor / G2 --+  footwell S3
         T1  T2     T3  T4
```

## After measuring

1. Edit the matching variables in [`cad/params.py`](../cad/params.py) (`BOOT_ARCH_WIDTH`, `BOX_WIDTH`, `BOX_DEPTH`, `BOX_HEIGHT`, `BED_LENGTH`, `WING_EXTRA`, `SEATBACK_ANGLE_DEG`, …).
2. Run `python cad/export_cnc.py` to regenerate SVG, DXF, nests, and drawings.
3. Cut the **cardboard templates** first ([`cad/export/cardboard-templates.svg`](../cad/export/cardboard-templates.svg)). Tape them in the car.
4. Only then cut 15 mm plywood.

If A, A2, or A3 is under 960 mm, shrink `BOX_WIDTH` to measured − 20 mm. If W1 is under 1320 mm, shrink `WING_EXTRA` so `BED_WIDTH + 2*WING_EXTRA` ≤ W1 − 20. If C is under 1900 mm, either accept a shorter bed or plan to put feet between the front seats and shorten `BED_LENGTH` to what actually lies flat.
