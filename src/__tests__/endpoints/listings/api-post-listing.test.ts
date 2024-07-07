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
    const orgId = 2;
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
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["Patience", "Sales"],
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
        const { listing } = body;

        expect(listing).toMatchObject({
          list_id: expect.any(Number),
          list_title: newListing.list_title,
          list_location: newListing.list_location,
          list_date: expect.any(String),
          list_time: expect.any(String),
          list_duration: newListing.list_duration,
          list_description: newListing.list_description,
          list_latitude: newListing.list_latitude,
          list_longitude: newListing.list_longitude,
          list_img_id: expect.any(Number),
          list_org: orgId,
        });

        return listing.list_id;
      })
      .then((listId) => {
        return request(app).get(`/api/skills/${listId}`);
      })
      .then(({ body }) => {
        const { skills } = body;

        expect(skills).toHaveLength(2);
      });
  });

  test("Skills can be uppercase", async () => {
    const orgId = 2;
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
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["PATIENCE", "SALES"],
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
        const { listing } = body;

        expect(listing).toMatchObject({
          list_id: expect.any(Number),
          list_title: newListing.list_title,
          list_location: newListing.list_location,
          list_date: expect.any(String),
          list_time: expect.any(String),
          list_duration: newListing.list_duration,
          list_description: newListing.list_description,
          list_latitude: newListing.list_latitude,
          list_longitude: newListing.list_longitude,
          list_img_id: expect.any(Number),
          list_org: orgId,
        });

        return listing.list_id;
      })
      .then((listId) => {
        return request(app).get(`/api/skills/${listId}`);
      })
      .then(({ body }) => {
        const { skills } = body;

        expect(skills).toHaveLength(2);
      });
  });

  test("Skills can be lowercase", async () => {
    const orgId = 2;
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
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["patience", "sales"],
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
        const { listing } = body;

        expect(listing).toMatchObject({
          list_id: expect.any(Number),
          list_title: newListing.list_title,
          list_location: newListing.list_location,
          list_date: expect.any(String),
          list_time: expect.any(String),
          list_duration: newListing.list_duration,
          list_description: newListing.list_description,
          list_latitude: newListing.list_latitude,
          list_longitude: newListing.list_longitude,
          list_img_id: expect.any(Number),
          list_org: orgId,
        });

        return listing.list_id;
      })
      .then((listId) => {
        return request(app).get(`/api/skills/${listId}`);
      })
      .then(({ body }) => {
        const { skills } = body;

        expect(skills).toHaveLength(2);
      });
  });

  test("Posts without an image", async () => {
    const orgId = 2;
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
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      list_skills: ["Patience", "Sales"],
    };

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
        const { listing } = body;

        expect(listing).toMatchObject({
          list_id: expect.any(Number),
          list_title: newListing.list_title,
          list_location: newListing.list_location,
          list_date: expect.any(String),
          list_time: expect.any(String),
          list_duration: newListing.list_duration,
          list_description: newListing.list_description,
          list_latitude: newListing.list_latitude,
          list_longitude: newListing.list_longitude,
          list_img_id: null,
          list_org: orgId,
        });

        return listing.list_id;
      })
      .then((listId) => {
        return request(app).get(`/api/skills/${listId}`);
      })
      .then(({ body }) => {
        const { skills } = body;

        expect(skills).toHaveLength(2);
      });
  });

  test("Posts no skills", async () => {
    const orgId = 2;
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
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

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
        const { listing } = body;

        expect(listing).toMatchObject({
          list_id: expect.any(Number),
          list_title: newListing.list_title,
          list_location: newListing.list_location,
          list_date: expect.any(String),
          list_time: expect.any(String),
          list_duration: newListing.list_duration,
          list_description: newListing.list_description,
          list_latitude: newListing.list_latitude,
          list_longitude: newListing.list_longitude,
          list_img_id: null,
          list_org: orgId,
        });

        return listing.list_id;
      })
      .then((listId) => {
        return request(app)
          .get(`/api/skills/${listId}`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No skills found!");
          });
      });
  });

  // TODO
  test("Needs to be an org user", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_location: "123 Main St, City, Country",
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_title is not a string!");
      });
  });

  test("400 Error when Title is empty", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_location: "123 Main St, City, Country",
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_title is not a string!");
      });
  });

  test("400 Error when Title is not a string", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: 22,
      list_location: "123 Main St, City, Country",
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_title is not a string!");
      });
  });

  test("400 Error when Title is too long", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    let title = "";
    for (let i = 0; i < constants.MAX_TITLE_LENGTH + 1; i++) {
      title += "a";
    }

    const newListing = {
      list_title: title,
      list_location: "123 Main St, City, Country",
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `list_title must be between ${constants.MIN_TITLE_LENGTH} and ` +
            `${constants.MAX_TITLE_LENGTH} characters in length!`
        );
      });
  });

  test("400 Error when Title is too short", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "a",
      list_location: "123 Main St, City, Country",
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `list_title must be between ${constants.MIN_TITLE_LENGTH} and ` +
            `${constants.MAX_TITLE_LENGTH} characters in length!`
        );
      });
  });

  test("400 Error when Title contains symbols", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "title@@@",
      list_location: "123 Main St, City, Country",
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_title contains invalid symbols!");
      });
  });

  test("400 Error when list_location is not set", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_location is not a string!");
      });
  });

  test("400 Error when list_location is not a string", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: 22,
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_location is not a string!");
      });
  });

  test("400 Error when list_location is too long", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    let loc = "";
    for (let i = 0; i < constants.MAX_LOCAT_LENGTH + 1; i++) {
      loc += "a";
    }

    const newListing = {
      list_title: "A title",
      list_location: loc,
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `list_location must be between ${constants.MIN_LOCAT_LENGTH} and ` +
            `${constants.MAX_LOCAT_LENGTH} characters in length!`
        );
      });
  });

  test("400 Error when list_location is too short", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "sda",
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `list_location must be between ${constants.MIN_LOCAT_LENGTH} and ` +
            `${constants.MAX_LOCAT_LENGTH} characters in length!`
        );
      });
  });

  // test("400 Error when list_location contains invalid symbols", async () => {
  //   const orgId = 2;
  //   const orgCredentials = {
  //     email: "redcross@email.com",
  //     password: "mybadpassword234",
  //     role: "organisation",
  //   };

  //   const newListing = {
  //     list_title: "A title",
  //     list_location: "@@@2313123@@",
  //     list_date: "2024-07-05",
  //     list_time: "14:00",
  //     list_duration: 2,
  //     list_description: "This is a sample description of the listing.",
  //     list_latitude: 37.7749,
  //     list_longitude: -122.4194,
  //   };

  //   const loginResponse = await request(app)
  //     .post("/api/login")
  //     .send(orgCredentials);
  //   const { token } = loginResponse.body.user;

  //   // Post the new listing
  //   const postResponse = await request(app)
  //     .post("/api/listings")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send(newListing)
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe(`list_location contains invalid symbols!`);
  //     });
  // });

  test("400 Error when date is empty", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_date is not a string!`);
      });
  });

  test("400 Error when date is not a string", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_time: "14:00",
      list_date: 22,
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_date is not a string!`);
      });
  });

  test("400 Error when date is in an invalid format", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_time: "14:00",
      list_date: "65th of movember",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_date is in an invalid format!`);
      });
  });

  test("400 Error when list_duration is empty", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_time: "14:00",
      list_date: "2024-07-05",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_duration is not a number!`);
      });
  });

  test("400 Error when list_duration is not a number", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_duration: "2",
      list_time: "14:00",
      list_date: "2024-07-05",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_duration is not a number!`);
      });
  });

  test("400 Error when list_duration is negative", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_duration: -3,
      list_time: "14:00",
      list_date: "2024-07-05",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `duration must not be negative or exceed ` +
            `${constants.MAX_LIST_DURATION} hours!`
        );
      });
  });

  test("400 Error when list_duration is 0", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_duration: 0,
      list_time: "14:00",
      list_date: "2024-07-05",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("duration cannot be empty!");
      });
  });

  test("400 Error when list_duration is too big", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_duration: -3,
      list_time: "14:00",
      list_date: "2024-07-05",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `duration must not be negative or exceed ` +
            `${constants.MAX_LIST_DURATION} hours!`
        );
      });
  });

  test("400 Error when list_time is empty", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_time is not a string!");
      });
  });

  test("400 Error when list_time is not a string", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: 23,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_time is not a string!");
      });
  });

  test("400 Error when list_time is in an invalid format", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "11 o clock",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_time is in an invalid format!");
      });
  });

  test("400 Error when list_time is over 24 hours", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "25:00",
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_time is in an invalid format!");
      });
  });

  test("400 Error list_description is empty", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_description is not a string!");
      });
  });

  test("400 Error list_description is not a string", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: 22,
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_description is not a string!");
      });
  });

  test("400 Error list_description is too long", async () => {
    let desc = "";
    for (let i = 0; i < constants.MAX_LIST_DESC_LENGTH + 1; i++) {
      desc += "a";
    }

    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: desc,
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `description must be between ${constants.MIN_LIST_DESC_LENGTH} ` +
            `${constants.MAX_LIST_DESC_LENGTH} in length!`
        );
      });
  });

  test("400 Error list_description is too short", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `description must be between ${constants.MIN_LIST_DESC_LENGTH} ` +
            `${constants.MAX_LIST_DESC_LENGTH} in length!`
        );
      });
  });

  test("400 Error when latitude is not set", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a description",
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_latitude is not a number!`);
      });
  });

  test("400 Error when latitude is not a number", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a description",
      list_latitude: "123",
      list_longitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_latitude is not a number!`);
      });
  });

  test("400 Error when longitude is not set", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a description",
      list_latitude: -122.4194,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_longitude is not a number!`);
      });
  });

  test("400 Error when longitude is not a number", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a description",
      list_latitude: -122.4194,
      list_longitude: "23",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_longitude is not a number!`);
      });
  });

  test("400 Error when skills is not an array", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a description",
      list_latitude: -122.4194,
      list_longitude: -122.4194,
      list_skills: "Patience",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_skills is not an array!`);
      });
  });

  test("400 Error when skills is not an array of strings", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a description",
      list_latitude: -122.4194,
      list_longitude: -122.4194,
      list_skills: [2, 33],
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`skills must be strings!`);
      });
  });

  test("400 Error when skills aren't valid skills", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a description",
      list_latitude: -122.4194,
      list_longitude: -122.4194,
      list_skills: ["invalid", "another invalid"],
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `Invalid skill found! (${newListing.list_skills[0]})`
        );
      });
  });

  test("400 Error when list too many skills", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a description",
      list_latitude: -122.4194,
      list_longitude: -122.4194,
      list_skills: [
        "Teamwork",
        "Sports",
        "Art",
        "Sales",
        "Cooking",
        "First Aid",
      ],
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `You may only list a maximum of ${constants.MAX_LIST_SKILLS}!`
        );
      });
  });

  test("List_visible must a boolean", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a description",
      list_latitude: -122.4194,
      list_longitude: -122.4194,
      list_visible: "banana",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_visible is not a boolean!`);
      });
  });

  test("List_visible must a boolean", async () => {
    const orgId = 2;
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const newListing = {
      list_title: "A title",
      list_location: "A valid location",
      list_date: "2024-07-05",
      list_duration: 4,
      list_time: "23:00",
      list_description: "a description",
      list_latitude: -122.4194,
      list_longitude: -122.4194,
      list_visible: 1,
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(orgCredentials);
    const { token } = loginResponse.body.user;

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`list_visible is not a boolean!`);
      });
  });

  test("User must be an organisation user", async () => {
    const orgId = 2;
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
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["Patience", "Sales"],
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

  test("User must be logged in", async () => {
    const newListing = {
      list_title: "Example Listing",
      list_location: "123 Main St, City, Country",
      list_date: "2024-07-05",
      list_time: "14:00",
      list_duration: 2,
      list_description: "This is a sample description of the listing.",
      list_latitude: 37.7749,
      list_longitude: -122.4194,
      img_b64_data: testImg1,
      list_skills: ["Patience", "Sales"],
    };

    // Post the new listing
    const postResponse = await request(app)
      .post("/api/listings")
      .send(newListing)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_NOT_LOGGED_IN);
      });
  });
});
