"""Minimal SVG helpers. Units are millimetres (1 user unit = 1 mm)."""

from __future__ import annotations


def svg_header(w: float, h: float, title: str = "") -> list[str]:
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}mm" height="{h}mm"',
        f'     viewBox="0 0 {w} {h}">',
        f"  <title>{_esc(title)}</title>",
        "  <style>",
        "    .cut { fill: none; stroke: #111; stroke-width: 0.4; }",
        "    .cut-inner { fill: none; stroke: #111; stroke-width: 0.4; }",
        "    .engrave { fill: none; stroke: #888; stroke-width: 0.2; }",
        "    .dim { fill: #333; font: 12px sans-serif; }",
        "    .dim-line { fill: none; stroke: #444; stroke-width: 0.5; }",
        "    .part-name { fill: #111; font: 15px sans-serif; }",
        "    .size { fill: #222; font: 13px sans-serif; }",
        "    .section { fill: #111; font: 18px sans-serif; }",
        "    .title { fill: #111; font: 22px sans-serif; }",
        "    .note { fill: #444; font: 11px sans-serif; }",
        "    .fill-box { fill: #d8c7a1; stroke: #5a4a32; stroke-width: 0.8; }",
        "    .fill-deck { fill: #c9b48a; stroke: #5a4a32; stroke-width: 0.8; }",
        "    .fill-wing { fill: #b9d4c0; stroke: #2f5d3a; stroke-width: 0.8; }",
        "    .fill-frame { fill: #9aa7b5; stroke: #2c3a4a; stroke-width: 0.8; }",
        "    .car { fill: none; stroke: #666; stroke-width: 1.2; stroke-dasharray: 8 4; }",
        "    .sheet { fill: #f4f1ea; stroke: #333; stroke-width: 1; }",
        "  </style>",
    ]


def svg_footer() -> list[str]:
    return ["</svg>"]


def rect(x: float, y: float, w: float, h: float, cls: str = "cut") -> str:
    return f'  <rect x="{_n(x)}" y="{_n(y)}" width="{_n(w)}" height="{_n(h)}" class="{cls}"/>'


def circle(cx: float, cy: float, d: float, cls: str = "cut-inner") -> str:
    return f'  <circle cx="{_n(cx)}" cy="{_n(cy)}" r="{_n(d / 2)}" class="{cls}"/>'


def text(x: float, y: float, s: str, cls: str = "dim", extra: str = "") -> str:
    extra_s = f" {extra}" if extra else ""
    return f'  <text x="{_n(x)}" y="{_n(y)}" class="{cls}"{extra_s}>{_esc(s)}</text>'


def dim_h(x: float, y: float, drawn_w: float, actual_mm: float, tick: float = 5) -> list[str]:
    """Horizontal size bar under a part. Label is the real millimetre value."""
    mid = x + drawn_w / 2
    return [
        line(x, y - tick, x, y + tick, "dim-line"),
        line(x + drawn_w, y - tick, x + drawn_w, y + tick, "dim-line"),
        line(x, y, x + drawn_w, y, "dim-line"),
        text(mid, y - 3, f"{actual_mm:g}", "dim", extra='text-anchor="middle"'),
    ]


def dim_v(x: float, y: float, drawn_h: float, actual_mm: float, tick: float = 5) -> list[str]:
    """Vertical size bar to the left of a part. Label is the real millimetre value."""
    mid = y + drawn_h / 2
    return [
        line(x - tick, y, x + tick, y, "dim-line"),
        line(x - tick, y + drawn_h, x + tick, y + drawn_h, "dim-line"),
        line(x, y, x, y + drawn_h, "dim-line"),
        text(x - 7, mid + 4, f"{actual_mm:g}", "dim", extra='text-anchor="end"'),
    ]


def line(x1: float, y1: float, x2: float, y2: float, cls: str = "engrave") -> str:
    return (
        f'  <line x1="{_n(x1)}" y1="{_n(y1)}" x2="{_n(x2)}" y2="{_n(y2)}" class="{cls}"/>'
    )


def polyline(pts: list[tuple[float, float]], cls: str = "car") -> str:
    d = " ".join(f"{_n(x)},{_n(y)}" for x, y in pts)
    return f'  <polyline points="{d}" class="{cls}" fill="none"/>'


def _n(v: float) -> str:
    return f"{v:.2f}".rstrip("0").rstrip(".")


def _esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )
