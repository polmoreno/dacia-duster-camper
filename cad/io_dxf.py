"""Minimal AutoCAD R12 DXF writer (LINE + CIRCLE). Units: millimetres."""

from __future__ import annotations


def begin() -> list[str]:
    return [
        "0",
        "SECTION",
        "2",
        "HEADER",
        "9",
        "$INSUNITS",
        "70",
        "4",
        "0",
        "ENDSEC",
        "0",
        "SECTION",
        "2",
        "TABLES",
        "0",
        "ENDSEC",
        "0",
        "SECTION",
        "2",
        "ENTITIES",
    ]


def end() -> list[str]:
    return ["0", "ENDSEC", "0", "EOF"]


def add_rect(out: list[str], x: float, y: float, w: float, h: float, layer: str = "CUT") -> None:
    pts = [(x, y), (x + w, y), (x + w, y + h), (x, y + h), (x, y)]
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        add_line(out, x1, y1, x2, y2, layer)


def add_line(out: list[str], x1: float, y1: float, x2: float, y2: float, layer: str = "CUT") -> None:
    out.extend(
        [
            "0",
            "LINE",
            "8",
            layer,
            "10",
            f"{x1:.3f}",
            "20",
            f"{y1:.3f}",
            "30",
            "0.0",
            "11",
            f"{x2:.3f}",
            "21",
            f"{y2:.3f}",
            "31",
            "0.0",
        ]
    )


def add_circle(out: list[str], cx: float, cy: float, d: float, layer: str = "CUT") -> None:
    out.extend(
        [
            "0",
            "CIRCLE",
            "8",
            layer,
            "10",
            f"{cx:.3f}",
            "20",
            f"{cy:.3f}",
            "30",
            "0.0",
            "40",
            f"{d / 2:.3f}",
        ]
    )
