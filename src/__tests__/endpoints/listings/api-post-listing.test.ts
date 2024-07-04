import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";

import { testImg1 } from "../../../db/data/test-data/image-data";

beforeEach(() => seed(testData));

afterAll(() => db.end());

// test for post listing with a valid image string

describe("POST /api/listings", () => {
  test("An org user successfully posts a listing with an image and skills", async () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };
    const newListing = {
      list_title: "Example Listing",
      list_location: "123 Main St, City, Country",
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: "2",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["Patience", "Sales"],
      list_visible: true,
    };

    // Login as org user and get cookie
    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { header } = loginResponse;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Cookie", header["set-cookie"])
      .send(newListing)
      .expect(201)
      .then(({ body }) => {
        expect(body.newListing).toMatchObject({
          list_id: 11,
          list_title: "Example Listing",
          list_location: "123 Main St, City, Country",
          list_date: expect.any(String),
          list_time: "14:00:00",
          list_duration: 2,
          list_description: "This is a sample description of the listing.",
          list_latitude: 37.7749,
          list_longitude: -122.4194,
          list_img_id: 2,
          list_visible: true,
          list_org: 2,
        });
      });

    // Assert that the length of list_skill_junc table has increased by 2 (assuming two skills were added)
    const skillJuncQuery = "SELECT * FROM list_skill_junc;";
    const skillJuncResult = await db.query(skillJuncQuery);
    // console.log("here is skillJuncResult", skillJuncResult);
    expect(skillJuncResult.rows).toHaveLength(18);
  });
});

// test for post listing without a valid image string

// test for post listing when user isnt an org produces a 4** error

// tests for remaining props of body being invalid or not found
