import type { Application } from "../../../db/data/types";

export const applications: Application[] = [
  {
    vol_id: 1,
    listing_id: 3,
    confirm: true,
    attended: false,
  },
  {
    vol_id: 2,
    listing_id: 3,
    confirm: false,
    attended: false,
  },
  {
    vol_id: 3,
    listing_id: 4,
    confirm: true,
    attended: true,
  },
  {
    vol_id: 4,
    listing_id: 5,
    confirm: false,
    attended: false,
  },
  {
    vol_id: 2,
    listing_id: 4,
    confirm: false,
    attended: false,
  },
  {
    vol_id: 5,
    listing_id: 1,
    confirm: false,
    attended: false,
  },
  {
    vol_id: 6,
    listing_id: 1,
    confirm: false,
    attended: false,
  },
  {
    vol_id: 10,
    listing_id: 7,
    confirm: true,
    attended: false,
  },
];
