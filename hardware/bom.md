# Bill of materials — Duster II Sleep Pack clone v0.1

Prices are Spain hardware-store ballparks. Preferred shop: **[Cadena 88](https://www.cadena88.com/es)** (pick a store by postcode; web prices are recommended PVP, stock is local). Buy after the cardboard templates fit.

Cadena 88 web matches (Aug 2026):

| Need | Cadena 88 product | Link |
| --- | --- | --- |
| Edge band 22 mm | Canto melamina EHL 5 m × 22 mm (~4,60 €) | [cantos](https://www.cadena88.com/es/ferreteria/ferreteria-para-muebles/cantos-para-tablero) |
| Piano hinge | Bisagra piano EHL en tiras (from ~1,95 €) | [piano](https://www.cadena88.com/es/cerrajeria/accesorios-puertas-y-ventanas/bisagras-y-pernios/bisagras-de-piano) |
| Leg hinges | Bisagra EHL 207 / butts | [bisagras](https://www.cadena88.com/es/cerrajeria/accesorios-puertas-y-ventanas/bisagras-y-pernios/bisagras) |
| Table bolts | Pasador cerrojo EHL | [pasadores](https://www.cadena88.com/es/cerrajeria/pasadores-candados-y-cierrapuertas/pasadores-y-pestillos-para-puertas/pasadores-y-pestillos) |
| Wing runners | Guía metálica EUROLATON **500 mm** (~4,50 € / pair, 45 kg) | [guías](https://www.cadena88.com/es/ferreteria/ferreteria-para-muebles/complementos-para-muebles/guia-metalica-eurolaton-cajones) |
| Corner brackets | Escuadras EHL 40 mm (from ~2,00 €) | [escuadras](https://www.cadena88.com/es/ferreteria/ferreteria-para-muebles/pletinas-y-escuadras-de-ensamblaje) |
| Glue | Cola blanca CEYS 500 g (~6,60 €) or RAYT 1 kg | [colas](https://www.cadena88.com/es/fijaciones-y-adhesivos/adhesivos-colas-y-cintas/colas-blancas) |
| Screws | SPAX / EHS chipboard 4×40 and 3.5×20 | [SPAX](https://www.cadena88.com/es/marcas/spax) |

**Ask at the shop (not on the website):** 15 mm birch/phenolic 2440 × 1220, pine 20×20 cleat, felt pads, table stays, cam-buckle straps, foam mattress. Do not buy the Emuca 30 mm table tops.

## Plywood

| Item | Spec | Qty | Notes | Est. € |
| --- | --- | --- | --- | --- |
| Birch or phenolic plywood | 2440 × 1220 × **15 mm** | **2 sheets** | Nested in [`cad/export/sheet-1.svg`](../cad/export/sheet-1.svg) and `sheet-2`. Poplar is lighter; HPL phenolic is toughest. | 80–140 |
| Edge banding | 22 mm iron-on, matching | 20 m | All cut edges that you will touch | 10 |
| Felt / wool pads | 3 mm, self-adhesive | 1 pack | Under the box and on seat-rest blocks | 6 |

Cut list: [`cad/export/cutlist.csv`](../cad/export/cutlist.csv) and [`cad/export/parts.md`](../cad/export/parts.md). Net area 4.23 m²; two sheets are 5.95 m².

Optional instead of plywood slat sockets: four steel 40 × 40 × 80 mm U-brackets.  
Optional instead of plywood `WING_RUNNER` strips: two pairs of 550 mm drawer slides under P2.

## Timber (not CNC)

| Item | Spec | Qty | Use | Est. € |
| --- | --- | --- | --- | --- |
| Pine cleat | 20 × 20 mm | 3 m | Bottom sits on cleats glued to SIDE_L/R, FRONT, RAIL_BOT | 6 |

## Hinges and stays

| Item | Spec | Qty | Use | Est. € |
| --- | --- | --- | --- | --- |
| Piano hinge | 32 × 950 mm, steel or stainless | 2 | DECK_P1–P2 and P2–P3 | 16 |
| Piano hinge | 32 × 920 mm | 2 | TABLE to RAIL_TOP; P1 to RAIL_TOP | 16 |
| Piano hinge | 32 × 80 mm (or 2× 40 mm butt) | 4 | RAIL_SEG A–B (two per side) | 8 |
| Butt hinge | 40 mm | 4 | LEG to RAIL_SEG B (two per leg) | 4 |
| Folding table stay | 200–250 mm, 15 kg rated | 2 | TABLE underside to SIDE_L/R | 10 |
| Barrel bolts | 50 mm | 2 | Hold TABLE closed while driving | 4 |

## Fasteners

| Item | Spec | Qty | Use | Est. € |
| --- | --- | --- | --- | --- |
| Wood screws | 4 × 40 mm | 100 | Box carcass | 6 |
| Wood screws | 3.5 × 20 mm | 80 | Hinges, runners, sockets | 4 |
| Corner brackets | 40 × 40 × 40 mm | 8 | Inside box corners | 6 |
| PVA / PU wood glue | D3/D4 | 1 bottle | All butt joints | 8 |
| Threaded inserts + M6 | optional | 8 | If you want a take-apart box | 8 |

## Straps and comfort

| Item | Spec | Qty | Use | Est. € |
| --- | --- | --- | --- | --- |
| Cam-buckle lashing strap | 25 mm × 2 m | 4 | Through SIDE slots to factory tie-downs | 16 |
| Soft loop / webbing | 25 mm | 2 m | Protect the tie-down plastics | 4 |
| Foam mattress | 50 mm, 32 kg/m³ polyester (official spec) or 80 mm PU | 1 | 950 × 1900 mm main | 40–80 |
| Wing pads | same foam | 2 | 175 × 549 mm | included if cut from leftover |
| Footwell pads | 80 mm foam | 2 | 150 × 400 mm | 15 |
| Mattress covers | zip, washable | 3 | Main + two wings | 20 |

80 mm foam is more comfortable than the official 50 mm / 32 kg/m³ slab. If you use 80 mm, confirm parcel-shelf height (measure G) still clears the folded stack.

## Tools

Circular saw or CNC/panel saw, 2 mm drill, countersink, square, clamps, iron (edge band), 2 mm hex / Pozidriv. A hardware store will cut the nest if you take printed [`sheet-1.svg`](../cad/export/sheet-1.svg) / [`sheet-2.svg`](../cad/export/sheet-2.svg) or the DXF files.

## Total

| | € |
| --- | --- |
| Wood + glue + band | 100–160 |
| Hardware | 70–100 |
| Foam + covers | 75–120 |
| **Typical DIY** | **€200–380** |

Official Sleep Pack: ~€1,590. Kit Mueble Camper (different layout): from ~€600.
