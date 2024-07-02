type VolUser = {
  vol_id?: number;
  vol_first_name: string;
  vol_last_name: string;
  vol_email: string;
  vol_password: string;
  vol_contact_tel?: string;
  vol_avatar?: Blob;
  vol_bio?: string;
  vol_hours?: number;
  vol_badges?: number;
};

type OrgUser = {
  org_id?: number;
  org_name: string;
  org_email: string;
  org_password: string;
  org_contact_tel?: string;
  org_type: number;
  org_bio?: string;
  org_avatar?: Blob;
  org_verified: boolean;
};

type OrgType = {
  type_id?: number;
  type_title: string;
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
  list_org: number;
};

// List <-> Skill junction table
type ListSkillJunc = {
  list_skill_id?: number;
  list_id: number;
  skill_id: number;
};

type Skill = {
  skill_id?: number;
  skill_name: string;
};

// Vol_User <-> Skill junction table
type VolUserSkillJunc = {
  vol_user_skill_id?: number;
  vol_id: number;
  skill_id: number;
};

type Badge = {
  badge_id?: number;
  badge_name: string;
  badge_img_path: string;
  badge_points: number;
};

// Vol_User <-> Badge junction table
type VolUserBadgeJunc = {
  vol_user_badge_id?: number;
  vol_id: number;
  badge_id: number;
};

type Application = {
  app_id?: number;
  vol_id: number;
  listing_id: number;
  prov_confirm: boolean;
  full_conf: boolean;
};

type FavouriteOrg = {
  fav_org_id?: number;
  vol_id: number;
  org_id: number;
};

type FavouriteListing = {
  fav_org_id?: number;
  vol_id: number;
  list_id: number;
};

export type {
  VolUser,
  OrgUser,
  OrgType,
  Listing,
  Skill,
  Badge,
  Application,
  VolUserBadgeJunc,
  ListSkillJunc,
  VolUserSkillJunc,
  FavouriteOrg,
  FavouriteListing,
};
