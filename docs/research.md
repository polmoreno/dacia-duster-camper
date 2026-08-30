# Research: Duster II Sleep Pack clone

Original design notes. This project clones the **public function** of Dacia’s InNature Sleep Pack for a **Duster II (2018–2024) 1.6 GLP 115 Ambiance 4x2**. It does not copy official CNC outlines or paid DIY PDFs.

## Official SKU vs this car

| Item | Official pack | This project |
| --- | --- | --- |
| SKU | [7717274284](https://www.dacia.es/accesorios-dacia/catalogo/detalles.html?productId=PA_7717274284) (Spain) | Original Duster II geometry |
| Title on dacia.es | Pack Sleep for Duster 4x2 and **Hybrid 150 4x4 without spare** | — |
| Fitment | Duster III (2024+), plus separate SKUs for Jogger / Bigster | Duster II 4x2 GLP |
| Box width | Built for **1000 mm** between wheel arches | Built for **977 mm** (target outer width 950 mm) |
| Sleep size | 190 × 130 cm mattress (100 cm in the boot, 130 cm at the rear doors) | Same sleep size, Duster II envelope |
| Weight | ~45 kg box + 5 kg mattress | Target ≤ 45 kg box |
| Price | ~€1,590–1,650 | DIY wood + hardware ~€200–400 |
| Designer | Eric Bouffette / Qstomize (Renault Group) | This repo |

Hybrid 150 4x4 exists only on Duster III. The 1.6 SCe 115 LPG (GLP) and Ambiance trim are Duster II. Dacia NL states each model has its **own** Sleep Pack because the interiors differ.

The dacia.es “modelos disponibles” list that includes Sandero, Logan, Dokker, Lodgy, Spring, and “DUSTER 1 PHAS2” is a catalogue dump, not a fitment check. It does not list Duster II.

**The official box will not drop into a Duster II boot.** The official *sleep size* is still the target.

### Published cargo comparison

| Dimension | Duster III (official pack car) | Duster II 4x2 (this car) |
| --- | --- | --- |
| Width between wheel arches | 1000 mm | **977 mm** |
| Load length, seats up | ~665–990 mm (generation-specific) | **990 mm** |
| Load length, seats folded | 1672 mm | **1792 mm** (longer) |
| Rear elbow / shoulder | ~1433 / 1377 mm | **1416 / 1379 mm** |
| Boot volume 4x2 | ~472 L | **445 L** |
| Spare / LPG | Hybrid / no-spare variants | LPG tank in the spare-wheel well, typically no spare |

Sources: Duster II press kit ([RE37517](https://www.press.dacia.co.uk/assets/documents/original/3064-RE37517DaciaDusterPressKitV1.pdf)); Duster III dimensions (Autotijd / Dacia).

The official 190 × 130 cm figure is the **unfolded mattress**, not the box. Motorpasión quotes the Duster III box at about **1000 × 800 × 300 mm**. Reviews (Motor1) give the bed as **190 cm long, 100 cm in the boot, 130 cm at the rear doors**.

## Official unfold (public reviews)

Compiled from Autofácil, Auto Express, and Motor1. No official exploded drawing is public.

1. Push the front seats fully forward (cushion and backrest).
2. Fold the rear seats.
3. Remove the two wooden cross-slats stored on the box (used later).
4. Release the retaining strap and pull the **concertina / hinged frame** out over the folded seatbacks.
5. Slot the two cross-slats across the frame (width-ways braces).
6. Unfold the **Z-fold three-section deck** so it rests on the box and the frame.
7. Slide out the **side wings** to use the space up to the rear door glass (~130 cm at the shoulders).
8. Unfold the foam mattress (stored between the parcel shelf and the box) and add the two wing pads.
9. Add side / footwell cushions so nobody rolls into the front footwell.

Other official traits used here:

- Rear flap of the box folds down as a picnic table (**15 kg max**; do not sit on it).
- Storage stays reachable with the bed open (~160–175 L on Duster III; this clone targets a similar cavity).
- Box straps to factory boot tie-downs. No drilling.
- Mattress: 100% polyester foam, **32 kg/m³** (Motor1).
- Two-adult rating on aftermarket listings: **180 kg** total.

Early prototypes used fold-out flaps for the extra width; the production pack uses **slide-out** wings (Auto Express).

## Commercial and DIY sources (not copied)

None of these publish free complete cut lists for a Sleep Pack clone. Geometry in this repo is original.

| Source | What it is | Sleep size | Notes |
| --- | --- | --- | --- |
| [Kit Mueble Camper](https://www.kitmueblecamper.com/dacia-duster/) | Paid furniture kit, kitchen + chest | ~180 × 110 cm | 15 mm plywood, ~30–35 kg poplar, from ~€600. 2017–2023 is workshop adaptation. |
| [Simple Campervans MK2](https://www.simplecampervans.com/shop/conversion-modules/dacia-duster-camper-van-conversion/) | Paid CNC module | 1730 × 900 mm (cushions 1800 × 1000) | 12 mm birch, 21 kg, £399. No kitchen. |
| [Campal Estate](https://campal.co.uk/campal-estate/) | Paid kitchen + bed kit | Vehicle-specific | £1,320–1,520. Separate small/extendable variant for Duster 4x4 / bi-fuel / spare. |
| [Tchao Tchao](https://tchao-tchao.com/es/pages/kit-amenagement-duster) | Paid Duster kit | 190 × 122 cm | Two drawers, adjustable legs. |
| [mobiles-bett.de](https://mobiles-bett.de/en/dacia-duster-en/) | Paid €9.95 instructions | 1950 × 1100 mm | Square timber + fibreboard platform, not a 3-in-1 box. |
| [Etsy camping-box PDF](https://www.etsy.com/listing/1596598387/wooden-camping-box-project-foldable-bed) | Paid tutorial | 164 × 98 cm deck | Written for Duster II 1.0 TCe LPG 4x2 Access. |
| [Reddit Duster 2 bed](https://www.reddit.com/r/Dacia/comments/1sq65s0/diy_bed_frame_for_the_duster_2/) | Photos | — | No published plans. |
| [Foro Dacia kit thread](https://www.foroclub.es/duster/viewtopic.php?t=6945) | Forum | — | Author promised plans; they were not posted. |
| [Nimblecamper DIY](https://nimblecamper.com/dacia-duster-camper-diy/) | Photo example | ~176 cm boot, 180+ cm with front seats forward | Push front seats forward for length. |

Third-party Duster II kits usually skip the official **wings**, which is why they advertise ~180 × 110 cm. This clone keeps the wings so the sleep surface matches the official 190 × 100 / 130 cm.

## Design decisions

1. **Sleep size matches the official pack:** 1900 mm long, 1000 mm between the arches, 1300 mm at the rear doors via slide-out wings.
2. **Box is narrower than the official pack:** 950 mm outer width (977 mm arches minus clearance).
3. **No kitchen drawer.** 3-in-1 only: storage + table + bed.
4. **Parametric CAD.** Published Duster II numbers are v0.1. Measure the car, then regenerate cuts (see [vehicle.md](vehicle.md)).
5. **15 mm birch or phenolic plywood.** Official pack is hygienic birch. Butt joints, glue, screws, corner brackets — no hidden dados required.
6. **Quita-y-pon.** Strapped cargo, not a homologated conversion.

## Sources

- [dacia.es SKU 7717274284](https://www.dacia.es/accesorios-dacia/catalogo/detalles.html?productId=PA_7717274284)
- [dacia.co.uk InNature](https://www.dacia.co.uk/innature-accessories.html)
- [dacia.nl Sleep Pack (per-model sizes)](https://www.dacia.nl/accessoires/sleep-pack.html)
- [Autofácil: nine-step Jogger/Duster unfold](https://www.autofacil.es/video-dacia-pack-sleep/)
- [Auto Express: prototype, slats, wings](https://www.autoexpress.co.uk/dacia/359729/dacia-jogger-sleep-pack-exclusive-review-night-amazing-budget-motorhome)
- [Motor1 Duster Sleep Pack test (190 / 100 / 130, 45+5 kg, 32 kg/m³)](https://www.motor1.com/reviews/723549/dacia-duster-sleep-pack-first-drive-review/)
- [Autocar Duster overnight](https://www.autocar.co.uk/car-news/features/future-camping-we-spend-night-dacias-%C2%A32000-sleep-pack)
- [Motorpasión box envelope ~1000 × 800 × 300 mm](https://www.motorpasion.com/furgonetas-y-caravanas/me-he-configurado-dacia-duster-sea-camper-24-000-euros-ahora-tengo-coche-casa-ruedas-para-finde)
- [Autobild: Duster III only](https://www.autobild.es/motor/dacia-duster-puede-convertirse-camper-con-dacia-pack-sleep-una-caja-con-que-se-puede-hacer-magia_6929495_0.html)
