import type { OrgUser } from "../../../db/data/types";

export const orgUsers: OrgUser[] = [
  {
    org_name: "Oxfam",
    org_email: "oxfam@email.com",
    org_password: "mybadpassword",
    org_type: 2,
    org_contact_tel: "923892238923",
    org_bio:
      "Oxfam is a British-founded confederation of 21 independent non-governmental organizations (NGOs).",
    org_verified: true,
  },
  {
    org_name: "Red Cross",
    org_email: "redcross@email.com",
    org_password: "mybadpassword234",
    org_type: 2,
    org_contact_tel: "81234567890",
    org_bio:
      "The Red Cross is a humanitarian organization that provides emergency assistance, disaster relief, and education.",
    org_verified: true,
  },
  {
    org_name: "UNICEF",
    org_email: "unicef@email.com",
    org_password: "mypassword",
    org_type: 2,
    org_contact_tel: "123456789",
    org_bio:
      "UNICEF works in over 190 countries and territories to protect the rights of every child.",
    org_verified: true,
  },
  {
    org_name: "Doctors Without Borders",
    org_email: "doctorswithoutborders@email.com",
    org_password: "bobbinspassword",
    org_type: 1,
    org_contact_tel: "987654321",
    org_bio:
      "Doctors Without Borders is an international medical humanitarian organization that provides medical care to people affected by conflict, epidemics, disasters, or exclusion from healthcare.",
    org_verified: true,
  },
  {
    org_name: "World Wildlife Fund",
    org_email: "wwf@email.com",
    org_password: "anotherpassword12345",
    org_type: 5,
    org_contact_tel: "1231231234",
    org_bio:
      "The World Wildlife Fund is dedicated to protecting nature and reducing the most pressing threats to the diversity of life on Earth.",
    org_verified: false,
  },
  {
    org_name: "Amnesty International",
    org_email: "amnesty@email.com",
    org_password: "mybadpassword",
    org_type: 7,
    org_contact_tel: "2223334444",
    org_bio:
      "Amnesty International is a global movement of people fighting injustice and promoting human rights.",
    org_verified: true,
  },
  {
    org_name: "Feeding America",
    org_email: "feedingamerica@email.com",
    org_password: "mybadpassword",
    org_type: 7,
    org_contact_tel: "8885551212",
    org_bio:
      "Feeding America is a nationwide network of food banks that feeds more than 46 million people through food pantries, soup kitchens, shelters, and other community-based agencies.",
    org_verified: false,
  },
  {
    org_name: "Habitat for Humanity",
    org_email: "habitat@email.com",
    org_password: "mybadpassword",
    org_type: 6,
    org_contact_tel: "1112223333",
    org_bio:
      "Habitat for Humanity is a global nonprofit housing organization working in local communities across all 50 states in the U.S. and in approximately 70 countries.",
    org_verified: true,
  },
  {
    org_name: "Care International",
    org_email: "care@email.com",
    org_password: "mybadpassword",
    org_contact_tel: "4445556666",
    org_type: 7,
    org_bio:
      "Care International is a global confederation of 14 members working together to fight poverty and provide emergency relief.",
    org_verified: true,
  },
];
