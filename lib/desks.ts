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

export const MAP_PLACES: MapPlace[] = [];

export const GARAGE_SPECS: GarageSpec[] = [];
