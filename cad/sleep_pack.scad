// Duster II Sleep Pack clone — v0.1 visualization
// Open in OpenSCAD. Set unfolded = true to see the bed deployed.
// Numbers match cad/params.py — if you change params.py, update these.

unfolded = false;

ply = 15;
box_w = 950;
box_d = 800;
box_h = 320;
inner_w = box_w - 2 * ply;
inner_d = box_d - 2 * ply;
inner_h = box_h - ply;
rail_top_h = 70;
rail_bot_h = 50;
table_w = inner_w - 2;
table_h = box_h - rail_top_h - rail_bot_h - 2;

p1 = 800;
p2 = 549;
p3 = 549;
deck_gap = 2;
bed_w = 950;
wing = 175;
wing_len = p2;
frame_rail_h = 80;
leg_h = inner_h;

module ply_xy(w, d) {
    cube([w, d, ply]);
}

module box() {
    // sides
    cube([ply, box_d, box_h]);
    translate([box_w - ply, 0, 0]) cube([ply, box_d, box_h]);
    // bottom
    translate([ply, ply, 0]) cube([inner_w, inner_d, ply]);
    // front (cabin)
    translate([ply, box_d - ply, ply]) cube([inner_w, ply, inner_h]);
    // rear rails
    translate([ply, 0, box_h - rail_top_h]) cube([inner_w, ply, rail_top_h]);
    translate([ply, 0, 0]) cube([inner_w, ply, rail_bot_h]);
}

module table_flap() {
    color("#c9b48a")
    translate([ply + 1, -table_h, rail_bot_h + 1])
        cube([table_w, ply, table_h]);
}

module deck_folded() {
    color("#c9b48a") {
        translate([0, 0, box_h]) ply_xy(bed_w, p1);
        translate([0, 0, box_h + ply]) ply_xy(bed_w, p2);
        translate([0, 0, box_h + 2 * ply]) ply_xy(bed_w, p3);
    }
}

module deck_open() {
    color("#c9b48a") {
        translate([0, 0, box_h]) ply_xy(bed_w, p1);
        translate([0, p1 + deck_gap, box_h]) ply_xy(bed_w, p2);
        translate([0, p1 + p2 + 2 * deck_gap, box_h]) ply_xy(bed_w, p3);
    }
    color("#b9d4c0") {
        translate([-wing, p1 + deck_gap, box_h]) ply_xy(wing, wing_len);
        translate([bed_w, p1 + deck_gap, box_h]) ply_xy(wing, wing_len);
    }
}

module frame_open() {
    color("#9aa7b5") {
        translate([ply, box_d, box_h - frame_rail_h])
            cube([ply, p2 + p3, frame_rail_h]);
        translate([box_w - 2 * ply, box_d, box_h - frame_rail_h])
            cube([ply, p2 + p3, frame_rail_h]);
        translate([2 * ply, box_d + 180, box_h - frame_rail_h])
            cube([inner_w - 2 * ply, ply, frame_rail_h]);
        translate([2 * ply, box_d + 180 + 400, box_h - frame_rail_h])
            cube([inner_w - 2 * ply, ply, frame_rail_h]);
        translate([ply, box_d + p2 + p3 - ply, 0])
            cube([ply, ply, leg_h]);
        translate([box_w - 2 * ply, box_d + p2 + p3 - ply, 0])
            cube([ply, ply, leg_h]);
    }
}

box();
if (unfolded) {
    table_flap();
    deck_open();
    frame_open();
} else {
    deck_folded();
}
