export type MapPlace = {
  name: string;
  region: string;
  note: string;
  slug: string;
};

export type GarageSpec = {
  name: string;
  klass: string;
  stat: string;
  slug: string;
};

export const MAP_PLACES: MapPlace[] = [
  {
    name: "Vice City",
    region: "Atlantic coast",
    note: "Hotel row, clubs, and the capital grid after dark.",
    slug: "neon-after-dark-vice-city-districts",
  },
  {
    name: "Leonida Keys",
    region: "Island chain",
    note: "Causeways, ferries, and folklore south of the skyline.",
    slug: "leonida-keys-swamps-lore",
  },
  {
    name: "Grassrivers",
    region: "Inland wetlands",
    note: "Night convoy country. No headlights.",
    slug: "leonida-keys-swamps-lore",
  },
  {
    name: "Port Gellhorn",
    region: "Gulf industrial",
    note: "Cranes, offices, and a 22-minute getaway window.",
    slug: "port-gellhorn-run-mission-intel",
  },
  {
    name: "Bayside Marina",
    region: "Waterfront",
    note: "Yacht security and a garage that thinks in liveries.",
    slug: "bayside-marina-mod-garage-preview",
  },
  {
    name: "Leonida",
    region: "Playable state",
    note: "Bigger than a city. Smaller than a fantasy Los Santos.",
    slug: "leonida-map-size-compared",
  },
];

export const GARAGE_SPECS: GarageSpec[] = [
  {
    name: "Vice Stance Kit",
    klass: "Sports",
    stat: "Ride −18 mm",
    slug: "vice-city-vehicle-customization-deep-dive",
  },
  {
    name: "Hollow-Point Bench",
    klass: "Sidearm",
    stat: "Stop 1.4×",
    slug: "weapons-bench-ammo-types",
  },
  {
    name: "Script Hook Preview",
    klass: "PC toolchain",
    stat: "ASI +5",
    slug: "pc-mod-scene-after-launch",
  },
  {
    name: "Marina Lift Dock",
    klass: "Boat",
    stat: "Draft 0.8 m",
    slug: "bayside-marina-mod-garage-preview",
  },
];
