# Duster II Sleep Pack clone

DIY plans for a **Dacia Duster II (2018–2024) 1.6 GLP 115 Ambiance 4x2** clone of the official InNature Sleep Pack.

The factory SKU ([7717274284](https://www.dacia.es/accesorios-dacia/catalogo/detalles.html?productId=PA_7717274284)) is a **Duster III** part. It will not drop into this car. The **sleep size** does: **1900 × 950 mm** between the wheel arches, **1300 mm** at the rear doors via slide-out wings.

3-in-1 only: removable boot box, storage while the bed is open, rear picnic table (15 kg). No kitchen. No drilling.

## Quick start

1. Print and fill [docs/vehicle.md](docs/vehicle.md) in the car.
2. If your numbers differ from v0.1, edit [cad/params.py](cad/params.py) and run `python cad/export_cnc.py`.
3. Plot [cad/export/cardboard-templates.svg](cad/export/cardboard-templates.svg) at 100% and tape it in the Duster.
4. Cut two 2440 × 1220 × 15 mm sheets from [cad/export/sheet-1.svg](cad/export/sheet-1.svg) / [sheet-2.svg](cad/export/sheet-2.svg) (DXF next to them).
5. Build and deploy with [docs/build-guide.md](docs/build-guide.md). Hardware: [hardware/bom.md](hardware/bom.md).

## Repo map

| Path | What |
| --- | --- |
| [docs/research.md](docs/research.md) | Official pack vs Duster II, sources, why 190×130 is still the target |
| [docs/vehicle.md](docs/vehicle.md) | Published dims + tape-measure checklist (including 130 cm wings) |
| [docs/build-guide.md](docs/build-guide.md) | Cut, assemble, strap, official 9-step unfold, safety |
| [docs/drawings/](docs/drawings/) | Folded, unfolded, exploded SVG |
| [cad/params.py](cad/params.py) | All millimetre variables |
| [cad/sleep_pack.scad](cad/sleep_pack.scad) | OpenSCAD preview (`unfolded = true`) |
| [cad/export/](cad/export/) | Nested SVG + DXF, cut list, cardboard templates |
| [hardware/bom.md](hardware/bom.md) | Wood, hinges, straps, foam |

## v0.1 numbers (change after measuring)

| | mm |
| --- | --- |
| Box outer | 950 × 800 × 320 |
| Bed | 1900 × 950 |
| Wings | 175 each → **1300** at the doors |
| Plywood | 15 mm, 2 sheets, 4.23 m² net |

Typical DIY cost **€200–380** vs ~€1,590 official.

Python 3.10+ is enough to regenerate files (`python cad/export_cnc.py`). No extra packages.
