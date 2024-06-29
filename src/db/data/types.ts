type VolUser = {
  vol_id?: number,
  vol_first_name: string,
  vol_last_name: string,
  vol_email: string,
  vol_contact_tel?: string,
  vol_avatar?: Blob,
  vol_bio?: string,
  vol_hours?: number,
  vol_badges?: number
};

export type { VolUser };
