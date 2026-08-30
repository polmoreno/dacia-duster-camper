"""Generate nested SVG/DXF sheets, cardboard templates, and drawings.

Run from the repo root:

    python cad/export_cnc.py
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from cad import params as P
from cad.io_dxf import add_circle, add_rect, begin, end
from cad.io_svg import circle, line, polyline, rect, svg_footer, svg_header, text
from cad.parts import Part, all_parts, expanded_parts, plywood_area_m2

EXPORT = ROOT / "cad" / "export"
DRAW = ROOT / "docs" / "drawings"


def _ensure_dirs() -> None:
    EXPORT.mkdir(parents=True, exist_ok=True)
    DRAW.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Nesting (shelf packer, rotate 90 if it fits better)
# ---------------------------------------------------------------------------


def nest(parts: list[Part]) -> list[list[tuple[Part, float, float, bool]]]:
    """Return sheets of (part, x, y, rotated)."""
    items = []
    for p in parts:
        w, h = p.w, p.h
        rot = False
        if h > w and h > P.SHEET_H - 2 * P.NEST_MARGIN and w <= P.SHEET_H - 2 * P.NEST_MARGIN:
            rot = True
            w, h = h, w
        items.append((p, w, h, rot))
    items.sort(key=lambda t: max(t[1], t[2]), reverse=True)

    sheets: list[list[tuple[Part, float, float, bool]]] = []
    # each sheet: list of (x, y, w, h) occupied
    occupied: list[list[tuple[float, float, float, float]]] = []

    usable_w = P.SHEET_W - 2 * P.NEST_MARGIN
    usable_h = P.SHEET_H - 2 * P.NEST_MARGIN

    def fits(ox: list[tuple[float, float, float, float]], x: float, y: float, w: float, h: float) -> bool:
        if x + w > usable_w + 0.01 or y + h > usable_h + 0.01:
            return False
        for ax, ay, aw, ah in ox:
            if not (x + w + P.NEST_GAP <= ax or ax + aw + P.NEST_GAP <= x or y + h + P.NEST_GAP <= ay or ay + ah + P.NEST_GAP <= y):
                return False
        return True

    def place(ox: list[tuple[float, float, float, float]], w: float, h: float) -> tuple[float, float] | None:
        xs = [0.0] + [x + w0 + P.NEST_GAP for x, _, w0, _ in ox]
        ys = [0.0] + [y + h0 + P.NEST_GAP for _, y, _, h0 in ox]
        candidates = sorted({(x, y) for x in xs for y in ys}, key=lambda p: (p[1], p[0]))
        for x, y in candidates:
            if fits(ox, x, y, w, h):
                return x, y
        return None

    for p, w, h, rot in items:
        placed = False
        # try both orientations on existing sheets
        for sheet_i, ox in enumerate(occupied):
            for trial_w, trial_h, trial_rot in ((w, h, rot), (h, w, not rot)):
                pos = place(ox, trial_w, trial_h)
                if pos is not None:
                    x, y = pos
                    ox.append((x, y, trial_w, trial_h))
                    sheets[sheet_i].append((p, P.NEST_MARGIN + x, P.NEST_MARGIN + y, trial_rot))
                    placed = True
                    break
            if placed:
                break
        if not placed:
            occupied.append([])
            sheets.append([])
            ox = occupied[-1]
            for trial_w, trial_h, trial_rot in ((w, h, rot), (h, w, not rot)):
                pos = place(ox, trial_w, trial_h)
                if pos is not None:
                    x, y = pos
                    ox.append((x, y, trial_w, trial_h))
                    sheets[-1].append((p, P.NEST_MARGIN + x, P.NEST_MARGIN + y, trial_rot))
                    placed = True
                    break
            if not placed:
                raise RuntimeError(f"Part {p.name} ({w}x{h}) does not fit a {P.SHEET_W}x{P.SHEET_H} sheet")
    return sheets


def _draw_part_svg(lines: list[str], p: Part, x: float, y: float, rotated: bool) -> None:
    w, h = (p.h, p.w) if rotated else (p.w, p.h)
    lines.append(rect(x, y, w, h, "cut"))
    for hole in p.holes:
        hx, hy, hw, hh = hole.x, hole.y, hole.w, hole.h
        if rotated:
            # rotate 90° CCW around part origin, then place
            hx, hy, hw, hh = hy, p.w - hx - hole.w, hole.h, hole.w
            if hole.kind == "circle":
                hx, hy = hole.y, p.w - hole.x
                lines.append(circle(x + hx, y + hy, hole.w))
                continue
        if hole.kind == "circle":
            lines.append(circle(x + hx, y + hy, hole.w))
        else:
            lines.append(rect(x + hx, y + hy, hw, hh, "cut-inner"))
    lines.append(text(x + 6, y + 16, p.name, "note"))


def _draw_part_dxf(out: list[str], p: Part, x: float, y: float, rotated: bool) -> None:
    w, h = (p.h, p.w) if rotated else (p.w, p.h)
    add_rect(out, x, y, w, h, "CUT")
    for hole in p.holes:
        hx, hy, hw, hh = hole.x, hole.y, hole.w, hole.h
        if rotated:
            if hole.kind == "circle":
                add_circle(out, x + hole.y, y + (p.w - hole.x), hole.w, "CUT")
                continue
            hx, hy, hw, hh = hole.y, p.w - hole.x - hole.w, hole.h, hole.w
        if hole.kind == "circle":
            add_circle(out, x + hx, y + hy, hole.w, "CUT")
        else:
            add_rect(out, x + hx, y + hy, hw, hh, "CUT")


def write_nests(sheets: list[list[tuple[Part, float, float, bool]]]) -> None:
    for i, sheet in enumerate(sheets, start=1):
        svg = svg_header(P.SHEET_W, P.SHEET_H, f"Duster II Sleep Pack — sheet {i}")
        svg.append(rect(0, 0, P.SHEET_W, P.SHEET_H, "sheet"))
        svg.append(text(20, 28, f"Sheet {i}/{len(sheets)}  —  {P.SHEET_W} x {P.SHEET_H} x {P.PLY} mm  —  cut: black  —  v0.1", "title"))
        for p, x, y, rot in sheet:
            _draw_part_svg(svg, p, x, y, rot)
        svg.extend(svg_footer())
        (EXPORT / f"sheet-{i}.svg").write_text("\n".join(svg), encoding="utf-8")

        dxf = begin()
        add_rect(dxf, 0, 0, P.SHEET_W, P.SHEET_H, "SHEET")
        for p, x, y, rot in sheet:
            _draw_part_dxf(dxf, p, x, y, rot)
        dxf.extend(end())
        (EXPORT / f"sheet-{i}.dxf").write_text("\n".join(dxf), encoding="utf-8")


def write_parts_index() -> None:
    lines = [
        "# CNC parts — v0.1",
        "",
        f"Plywood area (no waste): **{plywood_area_m2():.2f} m²**.",
        f"Sheets: **{P.SHEET_W} × {P.SHEET_H} × {P.PLY} mm**.",
        "",
        "| Part | Qty | W mm | H mm | Group | Notes |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for p in all_parts():
        note = p.notes.replace("|", "/")
        lines.append(f"| `{p.name}` | {p.qty} | {p.w:.0f} | {p.h:.0f} | {p.group} | {note} |")
    s = P.summary()
    lines += [
        "",
        "## Locked parameters",
        "",
        "| Name | mm |",
        "| --- | --- |",
    ]
    for k, v in s.items():
        lines.append(f"| `{k}` | {v:g} |")
    (EXPORT / "parts.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# Cardboard templates (print at 100% or cut on a plotter)
# ---------------------------------------------------------------------------


def write_cardboard() -> None:
    # Full-size templates for a plotter or taped-together paper. 1 SVG unit = 1 mm.
    w = max(P.BED_WIDTH + 2 * P.WING_EXTRA + 80, P.BOX_WIDTH + 80, 1400)
    h = 100 + P.BOX_DEPTH + 50 + P.BED_LENGTH + 80 + 80 + P.BOX_HEIGHT + 40
    svg = svg_header(w, h, "Cardboard templates — tape these in the Duster before cutting plywood")
    svg.append(text(20, 36, "Cardboard templates — plot at 100% (1 unit = 1 mm). Do not cut plywood until these fit.", "title"))
    svg.append(text(20, 56, "1) Box footprint   2) Bed plan 1900 x 1300   3) Width bars   4) Side profile", "note"))

    # 1 box footprint
    x, y = 40, 80
    svg.append(rect(x, y, P.BOX_WIDTH, P.BOX_DEPTH, "fill-box"))
    svg.append(text(x + 10, y + 24, f"BOX FOOTPRINT  {P.BOX_WIDTH} x {P.BOX_DEPTH} mm", "dim"))
    svg.append(text(x + 10, y + 42, "Tape on the boot floor, seats UP. Must clear both arches.", "note"))

    # 2 bed plan (tailgate at the top of this block)
    bx, by = 40, 80 + P.BOX_DEPTH + 50
    svg.append(rect(bx + P.WING_EXTRA, by, P.BED_WIDTH, P.P1_LEN, "fill-box"))
    svg.append(rect(bx + P.WING_EXTRA, by + P.P1_LEN, P.BED_WIDTH, P.P2_LEN, "fill-deck"))
    svg.append(rect(bx + P.WING_EXTRA, by + P.P1_LEN + P.P2_LEN, P.BED_WIDTH, P.P3_LEN, "fill-deck"))
    svg.append(rect(bx, by + P.P1_LEN, P.WING_EXTRA, P.WING_LEN, "fill-wing"))
    svg.append(rect(bx + P.WING_EXTRA + P.BED_WIDTH, by + P.P1_LEN, P.WING_EXTRA, P.WING_LEN, "fill-wing"))
    svg.append(text(bx + P.WING_EXTRA + 10, by + 22, f"BED PLAN  {P.BED_LENGTH} x {P.BED_WIDTH} + wings {P.WING_EXTRA} = {P.BED_WIDTH + 2 * P.WING_EXTRA} mm", "dim"))
    svg.append(text(bx + P.WING_EXTRA + 10, by + 40, "Seats folded, front seats forward. P1 (box) at tailgate, then P2 + wings, then P3.", "note"))

    # 3 width bars
    wy = by + P.BED_LENGTH + 40
    svg.append(rect(40, wy, P.BOX_WIDTH, 40, "fill-box"))
    svg.append(text(48, wy + 26, f"WIDTH BAR BOX  {P.BOX_WIDTH} mm  (must pass between arches)", "dim"))
    svg.append(rect(40, wy + 60, P.BED_WIDTH + 2 * P.WING_EXTRA, 40, "fill-wing"))
    svg.append(text(48, wy + 86, f"WIDTH BAR WINGS  {P.BED_WIDTH + 2 * P.WING_EXTRA} mm  (rear doors, mattress height)", "dim"))

    # 4 side profile
    py = wy + 130
    svg.append(rect(40, py, P.BOX_DEPTH, P.BOX_HEIGHT, "fill-box"))
    svg.append(rect(40, py, P.P1_LEN, 8, "fill-deck"))
    svg.append(rect(40 + P.P1_LEN, py, P.P2_LEN + P.P3_LEN + P.DECK_GAP, 8, "fill-deck"))
    svg.append(text(40, py - 12, f"SIDE PROFILE  box {P.BOX_DEPTH} x {P.BOX_HEIGHT}  + deck {P.BED_LENGTH}", "dim"))

    svg.extend(svg_footer())
    (EXPORT / "cardboard-templates.svg").write_text("\n".join(svg), encoding="utf-8")


# ---------------------------------------------------------------------------
# Drawings
# ---------------------------------------------------------------------------


def write_folded() -> None:
    w, h = 1400, 900
    svg = svg_header(w, h, "Folded — daily driving")
    svg.append(text(24, 36, "Folded (daily driving) — v0.1  ·  Duster II 4x2 GLP", "title"))
    svg.append(text(24, 58, "5 seats usable. Box strapped to factory tie-downs. Parcel shelf on top if G allows.", "note"))

    # side
    sx, sy = 80, 200
    svg.append(text(sx, sy - 16, "SIDE (left)", "dim"))
    svg.append(polyline([(sx - 20, sy + 400), (sx - 20, sy), (sx + 980, sy), (sx + 980, sy + 400)], "car"))
    svg.append(text(sx - 16, sy + 390, "boot floor", "note"))
    svg.append(rect(sx + 40, sy + 400 - P.BOX_HEIGHT, P.BOX_DEPTH, P.BOX_HEIGHT, "fill-box"))
    svg.append(rect(sx + 40, sy + 400 - P.BOX_HEIGHT - 30, P.BOX_DEPTH, 30, "fill-deck"))
    svg.append(text(sx + 50, sy + 400 - P.BOX_HEIGHT + 24, f"{P.BOX_DEPTH} x {P.BOX_HEIGHT}", "dim"))
    svg.append(text(sx + 50, sy + 400 - P.BOX_HEIGHT - 10, "P2+P3 stacked", "note"))

    # rear
    rx, ry = 1000, 200
    svg.append(text(rx, ry - 16, "REAR (tailgate)", "dim"))
    svg.append(rect(rx, ry + 400 - P.BOX_HEIGHT, P.BOX_WIDTH, P.BOX_HEIGHT, "fill-box"))
    svg.append(rect(rx + P.PLY, ry + 400 - P.RAIL_BOT_H - P.TABLE_H, P.TABLE_W, P.TABLE_H, "fill-deck"))
    svg.append(text(rx + 8, ry + 400 - P.BOX_HEIGHT + 22, f"{P.BOX_WIDTH} wide", "dim"))
    svg.append(text(rx + 8, ry + 400 - 80, "table flap closed", "note"))

    svg.append(text(24, 820, f"Clearance target: arches {P.BOOT_ARCH_WIDTH} mm  ·  box {P.BOX_WIDTH} mm  ·  seats-up depth {P.BOOT_DEPTH_SEATS_UP} mm", "note"))
    svg.extend(svg_footer())
    (DRAW / "folded.svg").write_text("\n".join(svg), encoding="utf-8")


def write_unfolded() -> None:
    w, h = 2100, 2550
    svg = svg_header(w, h, "Unfolded — sleep")
    svg.append(text(24, 36, "Unfolded sleep  ·  1900 x 950 / 1300 mm  ·  official size, Duster II box", "title"))

    ox = 80
    svg.append(text(ox, 80, "PLAN (looking down, tailgate at the top)", "dim"))
    plan_y = 110
    svg.append(rect(ox + P.WING_EXTRA, plan_y, P.BED_WIDTH, P.P1_LEN, "fill-box"))
    svg.append(rect(ox + P.WING_EXTRA, plan_y + P.P1_LEN, P.BED_WIDTH, P.P2_LEN, "fill-deck"))
    svg.append(rect(ox + P.WING_EXTRA, plan_y + P.P1_LEN + P.P2_LEN, P.BED_WIDTH, P.P3_LEN, "fill-deck"))
    svg.append(rect(ox, plan_y + P.P1_LEN, P.WING_EXTRA, P.WING_LEN, "fill-wing"))
    svg.append(rect(ox + P.WING_EXTRA + P.BED_WIDTH, plan_y + P.P1_LEN, P.WING_EXTRA, P.WING_LEN, "fill-wing"))
    svg.append(text(ox + P.WING_EXTRA + 12, plan_y + 24, "P1 / box  (tailgate / table)", "dim"))
    svg.append(text(ox + P.WING_EXTRA + 12, plan_y + P.P1_LEN + 24, "P2  + wings 1300 mm", "dim"))
    svg.append(text(ox + P.WING_EXTRA + 12, plan_y + P.P1_LEN + P.P2_LEN + 24, "P3  (front seats)", "dim"))
    svg.append(
        text(
            ox,
            plan_y + P.BED_LENGTH + 28,
            f"length {P.BED_LENGTH}   boot width {P.BED_WIDTH}   door width {P.BED_WIDTH + 2 * P.WING_EXTRA}",
            "dim",
        )
    )

    sx, sy = 80, plan_y + P.BED_LENGTH + 80
    svg.append(text(sx, sy - 20, "SIDE", "dim"))
    svg.append(rect(sx, sy, P.BOX_DEPTH, P.BOX_HEIGHT, "fill-box"))
    svg.append(rect(sx, sy - P.PLY, P.P1_LEN, P.PLY, "fill-deck"))
    svg.append(rect(sx + P.P1_LEN, sy - P.PLY, P.P2_LEN + P.DECK_GAP + P.P3_LEN, P.PLY, "fill-deck"))
    svg.append(rect(sx + P.P1_LEN, sy + 40, 12, P.FRAME_RAIL_H, "fill-frame"))
    svg.append(rect(sx + P.BED_LENGTH - 12, sy + P.BOX_HEIGHT - P.LEG_H, 12, P.LEG_H, "fill-frame"))
    svg.append(text(sx, sy + P.BOX_HEIGHT + 24, "box 800   frame + legs under P2/P3", "note"))

    svg.append(
        text(
            24,
            sy + P.BOX_HEIGHT + 60,
            "Deploy: fold rear seats · pull frame · slot 2 slats · unfold Z-deck · slide wings · mattress + wing pads · footwell pads. Table 15 kg max.",
            "note",
        )
    )
    svg.extend(svg_footer())
    (DRAW / "unfolded.svg").write_text("\n".join(svg), encoding="utf-8")


def write_exploded() -> None:
    w, h = 1800, 1200
    svg = svg_header(w, h, "Exploded assembly")
    svg.append(text(24, 36, "Exploded assembly — 15 mm plywood  ·  v0.1", "title"))

    items = [
        (80, 80, P.INNER_W * 0.35, P.INNER_D * 0.35, "fill-box", "BOTTOM"),
        (80, 380, P.BOX_DEPTH * 0.35, P.BOX_HEIGHT * 0.35, "fill-box", "SIDE_L / SIDE_R"),
        (420, 80, P.INNER_W * 0.35, P.INNER_H * 0.35, "fill-box", "FRONT"),
        (420, 280, P.INNER_W * 0.35, P.RAIL_TOP_H * 0.8, "fill-box", "RAIL_TOP"),
        (420, 360, P.INNER_W * 0.35, P.RAIL_BOT_H * 0.8, "fill-box", "RAIL_BOT"),
        (420, 440, P.TABLE_W * 0.35, P.TABLE_H * 0.35, "fill-deck", "TABLE"),
        (800, 80, P.BED_WIDTH * 0.28, P.P1_LEN * 0.28, "fill-deck", "DECK_P1"),
        (800, 340, P.BED_WIDTH * 0.28, P.P2_LEN * 0.28, "fill-deck", "DECK_P2"),
        (800, 540, P.BED_WIDTH * 0.28, P.P3_LEN * 0.28, "fill-deck", "DECK_P3"),
        (800, 740, P.WING_EXTRA * 0.8, P.WING_LEN * 0.28, "fill-wing", "WING x2"),
        (1200, 80, P.FRAME_SEG * 0.35, P.FRAME_RAIL_H * 0.6, "fill-frame", "RAIL_SEG x4"),
        (1200, 180, P.SLAT_W * 0.28, P.SLAT_H * 0.6, "fill-frame", "SLAT x2"),
        (1200, 280, P.FRAME_RAIL_H * 0.6, P.LEG_H * 0.35, "fill-frame", "LEG x2"),
        (1200, 480, P.FRAME_RAIL_H * 0.6, P.SEAT_REST_H * 0.8, "fill-frame", "SEAT_REST x2"),
    ]
    for x, y, ww, hh, cls, label in items:
        svg.append(rect(x, y, ww, hh, cls))
        svg.append(text(x, y - 8, label, "dim"))

    svg.append(text(24, 1140, "Joinery: glue + 4x40 screws + 40 mm corner brackets. Piano hinges on deck and table. Frame hinges on rail segments and legs.", "note"))
    svg.extend(svg_footer())
    (DRAW / "exploded.svg").write_text("\n".join(svg), encoding="utf-8")


def write_cutlist_csv() -> None:
    rows = ["name,qty,width_mm,height_mm,thickness_mm,group,notes"]
    for p in all_parts():
        note = p.notes.replace(",", ";")
        rows.append(f"{p.name},{p.qty},{p.w:.1f},{p.h:.1f},{p.thickness},{p.group},{note}")
    (EXPORT / "cutlist.csv").write_text("\n".join(rows) + "\n", encoding="utf-8")


def main() -> None:
    _ensure_dirs()
    parts = expanded_parts()
    sheets = nest(parts)
    write_nests(sheets)
    write_parts_index()
    write_cutlist_csv()
    write_cardboard()
    write_folded()
    write_unfolded()
    write_exploded()
    print(f"Sheets: {len(sheets)}")
    print(f"Plywood area: {plywood_area_m2():.2f} m2")
    print(f"Wrote {EXPORT} and {DRAW}")
    for i, sheet in enumerate(sheets, 1):
        print(f"  sheet {i}: {len(sheet)} parts")


if __name__ == "__main__":
    main()
