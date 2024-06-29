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

const volUsers: VolUser[] = [
  {
    vol_first_name: "Matt",
    vol_last_name: "Dixon",
    vol_email: "mattydemail@email.com",
    vol_contact_tel: "98239238928392",
    vol_bio: "HELLO I AM MATT :o",
    vol_hours: 10000
  },
  {
    vol_first_name: "Alice",
    vol_last_name: "Smith",
    vol_email: "alice.smith@email.com",
    vol_contact_tel: "1234567890",
    vol_bio: "Passionate about volunteering and helping the community.",
    vol_hours: 8000
  },
  {
    vol_first_name: "John",
    vol_last_name: "Doe",
    vol_email: "john.doe@email.com",
    vol_contact_tel: "0987654321",
    vol_bio: "Love to contribute to social causes and meet new people.",
    vol_hours: 6000
  },
  {
    vol_first_name: "Emma",
    vol_last_name: "Johnson",
    vol_email: "emma.johnson@email.com",
    vol_contact_tel: "1122334455",
    vol_bio: "Dedicated volunteer with a passion for education and literacy.",
    vol_hours: 7500
  },
  {
    vol_first_name: "Michael",
    vol_last_name: "Brown",
    vol_email: "michael.brown@email.com",
    vol_contact_tel: "6677889900",
    vol_bio: "Experienced in organizing community events and activities.",
    vol_hours: 9200
  },
  {
    vol_first_name: "Sophie",
    vol_last_name: "Davis",
    vol_email: "sophie.davis@email.com",
    vol_contact_tel: "4455667788",
    vol_bio: "Enjoy helping others and making a positive impact.",
    vol_hours: 5500
  },
  {
    vol_first_name: "James",
    vol_last_name: "Wilson",
    vol_email: "james.wilson@email.com",
    vol_contact_tel: "9988776655",
    vol_bio: "Interested in environmental conservation and wildlife protection.",
    vol_hours: 8900
  },
  {
    vol_first_name: "Olivia",
    vol_last_name: "Taylor",
    vol_email: "olivia.taylor@email.com",
    vol_contact_tel: "5566778899",
    vol_bio: "Passionate about health and wellness programs.",
    vol_hours: 7200
  },
  {
    vol_first_name: "David",
    vol_last_name: "Anderson",
    vol_email: "david.anderson@email.com",
    vol_contact_tel: "2233445566",
    vol_bio: "Love working with children and supporting youth initiatives.",
    vol_hours: 6500
  },
  {
    vol_first_name: "Isabella",
    vol_last_name: "Thomas",
    vol_email: "isabella.thomas@email.com",
    vol_contact_tel: "3322114455",
    vol_bio: "Enjoy fundraising and community outreach programs.",
    vol_hours: 7800
  }
];

export default volUsers;
export type { VolUser };