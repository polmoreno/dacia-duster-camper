"""2D CNC parts derived from params.py.

Each part is a rectangle (cut outer) plus optional inner holes / slots.
Coordinates are millimetres, origin at the part's bottom-left.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from cad import params as P


@dataclass
class Hole:
    x: float
    y: float
    w: float
    h: float
    kind: str = "rect"  # rect | circle (w = diameter)


@dataclass
class Part:
    name: str
    qty: int
    w: float
    h: float
    thickness: float = P.PLY
    material: str = "15mm plywood"
    holes: list[Hole] = field(default_factory=list)
    notes: str = ""
    group: str = "box"


def _slot(x: float, y: float) -> Hole:
    return Hole(x, y, P.SLOT_W, P.SLOT_H, "rect")


def all_parts() -> list[Part]:
    """One entry per unique part (qty > 1 where mirrored / repeated)."""
    parts: list[Part] = []

    # --- Box sides (mirrored slots) ---
    side_holes = [
        _slot(P.SLOT_INSET_Y, P.SLOT_INSET_Z),
        _slot(P.BOX_DEPTH - P.SLOT_INSET_Y - P.SLOT_W, P.SLOT_INSET_Z),
        _slot(P.SLOT_INSET_Y, P.BOX_HEIGHT - P.SLOT_INSET_Z - P.SLOT_H),
        _slot(P.BOX_DEPTH - P.SLOT_INSET_Y - P.SLOT_W, P.BOX_HEIGHT - P.SLOT_INSET_Z - P.SLOT_H),
    ]
    parts.append(
        Part(
            "SIDE_L",
            1,
            P.BOX_DEPTH,
            P.BOX_HEIGHT,
            holes=side_holes,
            notes="Left side. Four strap slots to factory tie-downs.",
            group="box",
        )
    )
    parts.append(
        Part(
            "SIDE_R",
            1,
            P.BOX_DEPTH,
            P.BOX_HEIGHT,
            holes=side_holes,
            notes="Right side. Same as SIDE_L (box is symmetric).",
            group="box",
        )
    )
    parts.append(
        Part(
            "BOTTOM",
            1,
            P.INNER_W,
            P.INNER_D,
            notes="Sits between the sides. Glue and screw into 20x20 cleats.",
            group="box",
        )
    )
    parts.append(
        Part(
            "FRONT",
            1,
            P.INNER_W,
            P.INNER_H,
            notes="Cabin-facing wall. Top edge is the landing for deck P1.",
            group="box",
        )
    )
    parts.append(
        Part(
            "RAIL_TOP",
            1,
            P.INNER_W,
            P.RAIL_TOP_H,
            notes="Tailgate-end top rail. Piano hinge for TABLE and for P1.",
            group="box",
        )
    )
    parts.append(
        Part(
            "RAIL_BOT",
            1,
            P.INNER_W,
            P.RAIL_BOT_H,
            notes="Tailgate-end bottom rail. Closes the storage opening.",
            group="box",
        )
    )
    parts.append(
        Part(
            "TABLE",
            1,
            P.TABLE_W,
            P.TABLE_H,
            holes=[Hole(P.TABLE_W / 2 - 50, P.TABLE_H / 2 - 15, 100, 30, "rect")],
            notes="Picnic flap, 15 kg max. Finger slot. Two folding stays.",
            group="box",
        )
    )

    # --- Deck ---
    parts.append(
        Part(
            "DECK_P1",
            1,
            P.BED_WIDTH,
            P.P1_LEN,
            notes="Box lid / first deck section. Hinge to RAIL_TOP.",
            group="deck",
        )
    )
    parts.append(
        Part(
            "DECK_P2",
            1,
            P.BED_WIDTH,
            P.P2_LEN,
            notes="Middle section (rear-door bay). Wing tracks on the underside.",
            group="deck",
        )
    )
    parts.append(
        Part(
            "DECK_P3",
            1,
            P.BED_WIDTH,
            P.P3_LEN,
            notes="Front section (toward the front seats).",
            group="deck",
        )
    )
    parts.append(
        Part(
            "WING",
            2,
            P.WING_EXTRA,
            P.WING_LEN,
            notes="Slide-out shoulder wings. One left, one right, under P2.",
            group="deck",
        )
    )
    parts.append(
        Part(
            "WING_RUNNER",
            4,
            P.WING_LEN,
            20,
            notes="Pair of 20 mm guides per wing, screwed under P2.",
            group="deck",
        )
    )

    # --- Concertina frame ---
    parts.append(
        Part(
            "RAIL_SEG",
            4,
            P.FRAME_SEG,
            P.FRAME_RAIL_H,
            notes="Two hinged segments per side. Piano hinge between A/B.",
            group="frame",
        )
    )
    parts.append(
        Part(
            "SLAT",
            2,
            P.SLAT_W,
            P.SLAT_H,
            holes=[Hole(P.SLAT_W / 2, P.SLAT_H / 2, 30, 30, "circle")],
            notes="Width-ways braces. Drop into U-sockets on the rails.",
            group="frame",
        )
    )
    parts.append(
        Part(
            "LEG",
            2,
            P.FRAME_RAIL_H,
            P.LEG_H,
            notes="Folding front legs. Hinge to the free end of RAIL_SEG B.",
            group="frame",
        )
    )
    parts.append(
        Part(
            "SEAT_REST",
            2,
            P.FRAME_RAIL_H,
            P.SEAT_REST_H,
            notes="Short blocks under the rails where they meet the seatbacks.",
            group="frame",
        )
    )
    parts.append(
        Part(
            "SLAT_SOCKET",
            4,
            40,
            P.SLAT_H + 10,
            notes="U-shaped catch. Screw to the inside of the rails. Or use steel U-brackets.",
            group="frame",
        )
    )

    return parts


def expanded_parts() -> list[Part]:
    """Repeat unique parts by qty for nesting."""
    out: list[Part] = []
    for p in all_parts():
        for i in range(p.qty):
            name = p.name if p.qty == 1 else f"{p.name}_{i + 1}"
            out.append(
                Part(
                    name=name,
                    qty=1,
                    w=p.w,
                    h=p.h,
                    thickness=p.thickness,
                    material=p.material,
                    holes=list(p.holes),
                    notes=p.notes,
                    group=p.group,
                )
            )
    return out


def plywood_area_m2() -> float:
    return sum(p.w * p.h * p.qty for p in all_parts()) / 1_000_000
