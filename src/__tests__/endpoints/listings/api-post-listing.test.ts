import request from "supertest";

import * as constants from "../../../constants";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";

import { testImg1 } from "../../../db/data/test-data/image-data";

beforeEach(() => seed(testData));

afterAll(() => db.end());

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
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
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
    expect(skillJuncResult.rows).toHaveLength(20);
  });
  test("An org user successfully posts a listing with skills, but without an image", async () => {
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
      //   img_b64_data: "",
      list_skills: ["Patience", "Sales"],
      list_visible: true,
    };

    // Login as org user and get cookie
    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
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
          list_img_id: null,
          list_visible: true,
          list_org: 2,
        });
      });

    // Assert that the length of list_skill_junc table has increased by 2 (assuming two skills were added)
    const skillJuncQuery = "SELECT * FROM list_skill_junc;";
    const skillJuncResult = await db.query(skillJuncQuery);
    // console.log("here is skillJuncResult", skillJuncResult);
    expect(skillJuncResult.rows).toHaveLength(20);
  });
  test("An org user successfully posts a listing with an image, but no skills", async () => {
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
      list_skills: [],
      list_visible: true,
    };

    // Login as org user and get cookie
    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
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

    // Assert that the length of list_skill_junc table has stayed the same
    const skillJuncQuery = "SELECT * FROM list_skill_junc;";
    const skillJuncResult = await db.query(skillJuncQuery);
    // console.log("here is skillJuncResult", skillJuncResult);
    expect(skillJuncResult.rows).toHaveLength(18);
  });

  // test for post listing when user isnt an org produces a 4** error

  test("Returns a 403 error when user is not an org user", async () => {
    const orgCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
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
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(403)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
      });
  });

  // tests for remaining props of body being invalid or not found

  test("List_title cannot be undefined or an empty string", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };
    const newListing = {
      list_title: "",
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

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "list_title needs to be populated with characters!"
            );
          });
      });
  });

  test("List_location cannot be undefined or an empty string", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };
    const newListing = {
      list_title: "Example Listing",
      list_location: "",
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

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "list_location needs to be populated with characters!"
            );
          });
      });
  });

  test("List_date cannot be undefined or an empty string", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };
    const newListing = {
      list_title: "Example Listing",
      list_location: "123 Main St, City, Country",
      list_date: "",
      list_time: "14:00",
      list_duration: "2",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["Patience", "Sales"],
      list_visible: true,
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "list_date needs to be populated with characters!"
            );
          });
      });
  });

  test("List_time cannot be undefined or an empty string", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };
    const newListing = {
      list_title: "Example Listing",
      list_location: "123 Main St, City, Country",
      list_date: "2024-07-05",
      list_time: "",
      list_duration: "2",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["Patience", "Sales"],
      list_visible: true,
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "list_time needs to be populated with characters!"
            );
          });
      });
  });

  test("List_duration cannot be undefined or an empty string", () => {
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
      list_duration: "",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["Patience", "Sales"],
      list_visible: true,
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "list_duration needs to be populated with characters!"
            );
          });
      });
  });

  test("List_description cannot be undefined or an empty string", () => {
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
      list_description: "",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["Patience", "Sales"],
      list_visible: true,
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "list_description needs to be populated with characters!"
            );
          });
      });
  });

  test("List_latitude cannot be a type other than number", () => {
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
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["Patience", "Sales"],
      list_visible: true,
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("list_latitude needs to be given!");
          });
      });
  });

  test("List_longitude cannot be a type other than number", () => {
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
      list_latitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["Patience", "Sales"],
      list_visible: true,
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("list_longitude needs to be given!");
          });
      });
  });

  test("list_skills needs to be present in the request body.", () => {
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
      // list_skills: ["Patience", 2],
      list_visible: true,
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("list_skills needs to be given!");
          });
      });
  });

  test("list_skills must be of array type and only contain string elements if populated", () => {
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
      list_skills: ["Patience", 2],
      list_visible: true,
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "list_skills must contain valid skills only!"
            );
          });
      });
  });

  test("list_visible must be present and have value of true", () => {
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
      // list_visible: true,
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;
        console.log(token);

        return request(app)
          .post("/api/listings")
          .set("Authorization", `Bearer ${token}`)
          .send(newListing)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("list_visible must be set to true!");
          });
      });
  });
});
