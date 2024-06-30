type VolUser = {
  vol_id?: number,
  vol_first_name: string,
  vol_last_name: string,
  vol_email: string,
  vol_password: string,
  vol_contact_tel?: string,
  vol_avatar?: Blob,
  vol_bio?: string,
  vol_hours?: number,
  vol_badges?: number
};

type Listing = {
    list_id?: number;
    list_title: string;
    list_location: string;
    list_longitude: number;
    list_latitude: number;
    list_date: string;
    list_time: string;
    list_duration: number;
    list_description: string;
    list_img: string;
    list_visible: boolean;
    list_org: string;
    list_skills: string[];
};

type Skill = {
  skill_id?: number,
  skill_name: string
};

export type {VolUser, Listing, Skill};
