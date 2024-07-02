import type { Application } from "../types";

export const applications: Application[] = [
  {
    vol_id: 1,
    listing_id: 3,
    prov_confirm: false,
    full_conf: false,
  },
  {
    vol_id: 2,
    listing_id: 3,
    prov_confirm: false,
    full_conf: false,
  },
  {
    vol_id: 3,
    listing_id: 4,
    prov_confirm: true,
    full_conf: false,
  },
  {
    vol_id: 4,
    listing_id: 5,
    prov_confirm: true,
    full_conf: true,
  },
  {
    vol_id: 2,
    listing_id: 4,
    prov_confirm: false,
    full_conf: true,
  },
  {
    vol_id: 5,
    listing_id: 1,
    prov_confirm: false,
    full_conf: false,
  },
];
