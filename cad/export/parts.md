# CNC parts — v0.1

Plywood area (no waste): **4.23 m²**.
Sheets: **2440 × 1220 × 15 mm**.

| Part | Qty | W mm | H mm | Group | Notes |
| --- | --- | --- | --- | --- | --- |
| `SIDE_L` | 1 | 800 | 320 | box | Left side. Four strap slots to factory tie-downs. |
| `SIDE_R` | 1 | 800 | 320 | box | Right side. Same as SIDE_L (box is symmetric). |
| `BOTTOM` | 1 | 920 | 770 | box | Sits between the sides. Glue and screw into 20x20 cleats. |
| `FRONT` | 1 | 920 | 305 | box | Cabin-facing wall. Top edge is the landing for deck P1. |
| `RAIL_TOP` | 1 | 920 | 70 | box | Tailgate-end top rail. Piano hinge for TABLE and for P1. |
| `RAIL_BOT` | 1 | 920 | 50 | box | Tailgate-end bottom rail. Closes the storage opening. |
| `TABLE` | 1 | 918 | 198 | box | Picnic flap, 15 kg max. Finger slot. Two folding stays. |
| `DECK_P1` | 1 | 950 | 800 | deck | Box lid / first deck section. Hinge to RAIL_TOP. |
| `DECK_P2` | 1 | 950 | 549 | deck | Middle section (rear-door bay). Wing tracks on the underside. |
| `DECK_P3` | 1 | 950 | 549 | deck | Front section (toward the front seats). |
| `WING` | 2 | 175 | 549 | deck | Slide-out shoulder wings. One left, one right, under P2. |
| `WING_RUNNER` | 4 | 549 | 20 | deck | Pair of 20 mm guides per wing, screwed under P2. |
| `RAIL_SEG` | 4 | 550 | 80 | frame | Two hinged segments per side. Piano hinge between A/B. |
| `SLAT` | 2 | 918 | 80 | frame | Width-ways braces. Drop into U-sockets on the rails. |
| `LEG` | 2 | 80 | 305 | frame | Folding front legs. Hinge to the free end of RAIL_SEG B. |
| `SEAT_REST` | 2 | 80 | 50 | frame | Short blocks under the rails where they meet the seatbacks. |
| `SLAT_SOCKET` | 4 | 40 | 90 | frame | U-shaped catch. Screw to the inside of the rails. Or use steel U-brackets. |

## Locked parameters

| Name | mm |
| --- | --- |
| `BOX_WIDTH` | 950 |
| `BOX_DEPTH` | 800 |
| `BOX_HEIGHT` | 320 |
| `INNER_W` | 920 |
| `INNER_D` | 770 |
| `INNER_H` | 305 |
| `BED_LENGTH` | 1900 |
| `BED_WIDTH` | 950 |
| `WING_TOTAL` | 1300 |
| `WING_EXTRA` | 175 |
| `P1_LEN` | 800 |
| `P2_LEN` | 549 |
| `P3_LEN` | 549 |
| `FRAME_LEN` | 1100 |
| `TABLE_W` | 918 |
| `TABLE_H` | 198 |
| `PLY` | 15 |
