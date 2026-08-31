# Build and deploy guide — Duster II Sleep Pack clone v0.1

Official-style 3-in-1: boot box + picnic table + 1900 × 950 / 1300 mm winged bed. No kitchen. No drilling the car.

Read [research.md](research.md) and fill [vehicle.md](vehicle.md) before you cut 15 mm sheets.

## Safety

- Strap the box to the **factory boot tie-downs** whenever the car moves. Treat it as cargo (quita-y-pon), not a homologated conversion.
- Picnic table: **15 kg max**. Do not sit on it.
- Sleep load: **180 kg** total (two adults), same as aftermarket listings of the official pack.
- Deck must rest on the box, the two slats, and the front legs. Do not sleep on an unbraced Z-fold.
- Cook outside the car if you bring a stove. This kit has no kitchen. The car is GLP — keep cartridges disconnected in transit.
- Two people to lift the finished box (~30–45 kg).
- Do not block the rear-view if the folded stack sits above the parcel shelf. Measure G.

## 0. Measure, then cardboard

1. Fill the checklist in [vehicle.md](vehicle.md).
2. If any measured limit is tighter than v0.1, edit [`cad/params.py`](../cad/params.py) and run:

   ```text
   python cad/export_cnc.py
   ```

3. Plot [`cad/export/cardboard-templates.svg`](../cad/export/cardboard-templates.svg) at **100%** (1 unit = 1 mm), or grid it onto taped cardboard.
4. Tape the **box footprint** in the boot with the rear seats **up**. It must clear both arches.
5. Fold the rear seats, push the front seats forward, tape the **bed plan** and the **1300 mm width bar** at mattress height in the rear-door opening.
6. Only then cut plywood.

## 1. Cut

- Nest: [`cad/export/sheet-1.svg`](../cad/export/sheet-1.svg) + [`sheet-2.svg`](../cad/export/sheet-2.svg) (also DXF).
- Two 2440 × 1220 × 15 mm sheets.
- Black lines are cuts. Inner rectangles/circles are cut-outs (strap slots, table handle, slat finger holes).
- Label every part on the face that will be hidden.
- Edge-band every edge you will touch.
- Sand strap slots so webbing does not fray.

Part list: [`cad/export/parts.md`](../cad/export/parts.md).

## 2. Box carcass

Orientation: **Y = 0 at the tailgate**, **Y = 800 at the cabin wall**.

1. Glue 20 × 20 cleats on SIDE_L, SIDE_R, FRONT, and RAIL_BOT, 15 mm up from the bottom so BOTTOM sits flush with the lower edge of the sides.
2. Stand SIDE_L and SIDE_R. Screw FRONT between them at the cabin end, sitting on BOTTOM (or on the cabin cleat). `FRONT` is 305 mm tall so its top lands flush with the 320 mm sides and becomes a landing for DECK_P1.
3. Screw RAIL_BOT and RAIL_TOP between the sides at the tailgate. RAIL_TOP’s top is flush with the side tops.
4. Drop in BOTTOM. Glue and screw down into the cleats.
5. Add four 40 mm corner brackets inside.
6. Piano-hinge TABLE to the **lower** edge of RAIL_TOP so the flap hangs as the rear wall, then folds **out** to horizontal. Fit two folding stays to the sides. 15 kg max.
7. Fit two barrel bolts so TABLE cannot drop while driving.
8. Stick felt under the box.

Storage is the inner cavity (920 × 770 × ~290 mm), reachable through the table opening with the bed open.

## 3. Concertina frame

1. Piano-hinge two RAIL_SEG pieces end-to-end (550 + 550 = 1100 mm) for the left rail. Repeat for the right.
2. Screw two SLAT_SOCKET catches on the inside of each assembled rail — one at ~180 mm from the box, one at ~580 mm. Opening faces up so a SLAT drops in.
3. Butt-hinge one LEG to the free end of each rail so the leg folds against the rail for storage.
4. Screw a SEAT_REST block under each rail where it will sit on the folded seatbacks (measure S2). Add felt.
5. Hinge the **box end** of each rail to the inside of FRONT, near the top, so the rails fold **into** the box for driving and pull out over the seats for sleep.

When deployed, the rails run from the cabin face of the box to the front of P3. Slot both SLATs. Legs stand on the rear footwell / floor (measure S3 — shim LEG_H if the floor is lower than the boot).

## 4. Z-fold deck and wings

1. Rest DECK_P1 on the box as the lid (950 × 800). Piano-hinge it to RAIL_TOP along the **tailgate** long edge so it stays captive and the Z-fold opens toward the cabin.
2. Piano-hinge P2 to the cabin edge of P1 (underside knuckle so the fold stacks upward).
3. Piano-hinge P3 to the cabin edge of P2 (alternate knuckle so it Z-folds).
4. Under P2, screw two WING_RUNNER pairs as 20 mm channels, 15.5 mm apart, opening to the left and right. The WING panels slide in those channels.
5. Add a small end-stop screw so each wing cannot fall out, but can be pulled 175 mm.

Folded stack on the box: P1 (lid) + P2 + P3 ≈ 45 mm, plus the mattress if you store it on top.

## 5. Mattress

Cut foam:

| Piece | Size mm | Qty |
| --- | --- | --- |
| Main | 950 × 1900 × 50 (or 80) | 1 |
| Wing pad | 175 × 549 × same | 2 |
| Footwell pad | 150 × 400 × 80 | 2 |

Zip covers. Official spec is 32 kg/m³ polyester; 80 mm PU is more comfortable if shelf height allows.

## 6. Install in the car (folded / daily)

1. Rear seats up. Parcel shelf out.
2. Two people: box into the boot, centred, felt down.
3. Four cam-buckle straps through the SIDE slots to the factory loops. Snug, do not crush the plastics.
4. Stack P2/P3 (if not already hinged on) and the mattress on the box.
5. Parcel shelf back if measure G still clears.
6. Five seats usable.

## 7. Deploy — official nine steps

Same order as Autofácil’s write-up of the factory pack.

1. Push the **front seats** fully forward (cushion and backrest).
2. Fold the **rear seats**. Remove headrests if they fight the fold.
3. Take out the two **SLATs** (store them in the box while driving).
4. Release the frame retaining strap if you fitted one. Pull the **concertina rails** out over the seatbacks. Legs down.
5. Drop the two SLATs into the sockets (width-ways braces). The frame must feel rigid.
6. Unfold the **Z-fold deck** (P1 stays on the box; P2 and P3 go toward the front seats) so it sits on the rails and slats.
7. Slide out the **wings** to 1300 mm at the rear doors.
8. Lay the **main mattress**, then the two **wing pads**.
9. Place the **footwell pads** so nobody rolls into the front footwell.

Picnic table: open the tailgate, unbolt TABLE, fold the stays. **15 kg. Do not sit.**

To pack: reverse 9 → 1. Slats back in the box. Straps tight before you drive.

## 8. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Box rubs the arches | Shrink `BOX_WIDTH` in `params.py` to measured A − 20, regenerate, recut sides/bottom/deck width |
| 1300 mm wings hit the door cards | Shrink `WING_EXTRA` so `BED_WIDTH + 2*WING_EXTRA` ≤ W1 − 20 |
| Bed shorter than 1900 mm flat | Shorten `BED_LENGTH` or put feet between the front seats |
| Deck not level | Change `LEG_H` / `SEAT_REST_H` to match S1–S3 |
| Parcel shelf will not sit | Store the mattress in the box, or lower `BOX_HEIGHT` |
| Rattle | More felt, tighter straps, foam between P2/P3 |

## 3D preview

Open the workshop site [`docs/site/`](site/index.html) (English / Catalan): 3D, tape-measure fit, shopping list, cut list. Full-screen 3D: [`docs/viewer/index.html`](viewer/index.html). Serve the repo if a page is blank: `python -m http.server`.

Open [`cad/sleep_pack.scad`](../cad/sleep_pack.scad) in OpenSCAD. Set `unfolded = true;` to see the bed out.
