"""v0.1 dimensions for a Duster II 4x2 GLP Sleep Pack clone.

All values are millimetres unless noted. After you measure the car
(see docs/vehicle.md), edit the values in MEASURED / BOX / BED and
re-run `python cad/export_cnc.py`.
"""

from __future__ import annotations

# ---------------------------------------------------------------------------
# Published Duster II (2018-2024) 4x2 — press kit RE37517
# ---------------------------------------------------------------------------
BOOT_ARCH_WIDTH = 977
BOOT_DEPTH_SEATS_UP = 990
BOOT_LENGTH_SEATS_FOLDED = 1792
REAR_ELBOW_WIDTH = 1416
REAR_SHOULDER_WIDTH = 1379
BOOT_VOLUME_L = 445

# ---------------------------------------------------------------------------
# Material
# ---------------------------------------------------------------------------
PLY = 15
SHEET_W = 2440
SHEET_H = 1220
NEST_MARGIN = 15
NEST_GAP = 12
KERF = 0.2

# ---------------------------------------------------------------------------
# Box (must pass between the wheel arches with the seats UP)
# ---------------------------------------------------------------------------
BOX_WIDTH = 950  # outer X; 977 arch minus 27 clearance
BOX_DEPTH = 800  # outer Y; official III box is ~800; seats-up depth is 990
BOX_HEIGHT = 320  # outer Z; stay under the parcel shelf (measure G)

# Inner cavity (sides overlap front / back / bottom)
INNER_W = BOX_WIDTH - 2 * PLY
INNER_D = BOX_DEPTH - 2 * PLY
INNER_H = BOX_HEIGHT - PLY  # lid (deck P1) sits on the walls

# Rear opening / picnic table
RAIL_TOP_H = 70
RAIL_BOT_H = 50
TABLE_OPENING_H = BOX_HEIGHT - RAIL_TOP_H - RAIL_BOT_H  # 200
TABLE_GAP = 2
TABLE_W = INNER_W - TABLE_GAP
TABLE_H = TABLE_OPENING_H - TABLE_GAP
TABLE_LOAD_KG = 15

# ---------------------------------------------------------------------------
# Bed (official sleep size, Duster II envelope)
# ---------------------------------------------------------------------------
BED_LENGTH = 1900
BED_WIDTH = BOX_WIDTH  # 950; arch-limited. Official "100 cm" is 1000 on Duster III.
WING_TOTAL = 1300  # official shoulder width
WING_EXTRA = (WING_TOTAL - BED_WIDTH) // 2  # 175 each side
DECK_GAP = 2  # hinge knuckle between P2 and P3

# P1 is the box lid and the first deck section (full box depth).
# Remainder of the 1900 mm bed is two equal Z-fold panels.
P1_LEN = BOX_DEPTH  # 800
_remainder = BED_LENGTH - P1_LEN - DECK_GAP
P2_LEN = _remainder // 2  # 549
P3_LEN = _remainder - P2_LEN  # 549
WING_LEN = P2_LEN  # wings live on the rear-door / seatback bay

# Concertina frame: from the cabin face of the box to the end of P3
FRAME_LEN = P2_LEN + DECK_GAP + P3_LEN  # 1100
FRAME_SEG = FRAME_LEN // 2  # 550 — two hinged segments fold into the box
FRAME_SEG_B = FRAME_LEN - FRAME_SEG
FRAME_RAIL_H = 80
SLAT_W = INNER_W - 2  # drop-in clearance
SLAT_H = 80
LEG_H = BOX_HEIGHT - PLY  # deck underside to a flat boot-like floor
SEATBACK_ANGLE_DEG = 18  # typical Duster II fold; measure S1
SEAT_REST_H = 50

# Strap slots on the box sides (factory tie-downs)
SLOT_W = 40
SLOT_H = 8
SLOT_INSET_Y = 80
SLOT_INSET_Z = 40

# ---------------------------------------------------------------------------
# Mattress (official: 32 kg/m3 polyester foam)
# ---------------------------------------------------------------------------
MATTRESS_THICK = 50
MATTRESS_DENSITY = 32  # kg/m3
MATTRESS_MAIN_W = BED_WIDTH
MATTRESS_MAIN_L = BED_LENGTH
WING_PAD_W = WING_EXTRA
WING_PAD_L = WING_LEN
FOOTWELL_PAD_W = 150
FOOTWELL_PAD_L = 400
FOOTWELL_PAD_T = 80

# ---------------------------------------------------------------------------
# Loads / safety
# ---------------------------------------------------------------------------
MAX_SLEEPERS_KG = 180
MAX_TABLE_KG = TABLE_LOAD_KG
TARGET_BOX_KG = 45

# ---------------------------------------------------------------------------
# Derived helpers
# ---------------------------------------------------------------------------


def summary() -> dict[str, float]:
    return {
        "BOX_WIDTH": BOX_WIDTH,
        "BOX_DEPTH": BOX_DEPTH,
        "BOX_HEIGHT": BOX_HEIGHT,
        "INNER_W": INNER_W,
        "INNER_D": INNER_D,
        "INNER_H": INNER_H,
        "BED_LENGTH": BED_LENGTH,
        "BED_WIDTH": BED_WIDTH,
        "WING_TOTAL": BED_WIDTH + 2 * WING_EXTRA,
        "WING_EXTRA": WING_EXTRA,
        "P1_LEN": P1_LEN,
        "P2_LEN": P2_LEN,
        "P3_LEN": P3_LEN,
        "FRAME_LEN": FRAME_LEN,
        "TABLE_W": TABLE_W,
        "TABLE_H": TABLE_H,
        "PLY": PLY,
    }
