import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

type FavListing = {
  fav_lists_id: number;
  vol_id: number;
  list_id: number;
  list_title: string;
  list_description: string;
  list_img?: string;
};

describe("GET /api/favourites/:vol_id/listings", () => {
  test("Returns a list of the volunteer user's favourites", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        // Fetch favourites
        return request(app)
          .get("/api/favourites/1/listings")
          .set("Cookie", [...header["set-cookie"]])
          .expect(200)
          .then(({ body }) => {
            const { favourite_listings: listings } = body;

            expect(listings).toHaveLength(4);

            listings.forEach((listing: FavListing) => {
              expect(listing).toMatchObject({
                fav_lists_id: expect.any(Number),
                vol_id: expect.any(Number),
                list_id: expect.any(Number),
                list_title: expect.any(String),
                list_description: expect.any(String),
              });

              expect(listing.list_img).toBeDefined();
            });
          });
      });
  });

  test("Returns a 400 error when user_id is not a number", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        // Fetch favourites
        return request(app)
          .get("/api/favourites/banana/listings")
          .set("Cookie", [...header["set-cookie"]])
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("user_id is not a number!");
          });
      });
  });

  test("Returns a 403 when trying to access different user's favourite listings", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        // Fetch favourites
        return request(app)
          .get("/api/favourites/3/listings")
          .set("Cookie", [...header["set-cookie"]])
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });

  test("Returns a 404 when user does not have any favourites listings", () => {
    const volCredentials = {
      email: "isabella.thomas@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        // Fetch favourites
        return request(app)
          .get("/api/favourites/10/listings")
          .set("Cookie", [...header["set-cookie"]])
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No favourites found!");
          });
      });
  });

  test("Returns a 401 when user is not logged in", () => {
    // Fetch favourites
    return request(app)
      .get("/api/favourites/3/listings")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_NOT_LOGGED_IN);
      });
  });
});

type FavOrg = {
  fav_orgs_id: Number;
  vol_id: Number;
  org_id: Number;
  org_name: String;
  org_avatar?: String;
};

describe("GET /api/favourites/:vol_id/orgs", () => {
  test("Returns a list of the volunteer user's favourite organisations", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        // Fetch favourites
        return request(app)
          .get("/api/favourites/1/orgs")
          .set("Cookie", [...header["set-cookie"]])
          .expect(200)
          .then(({ body }) => {
            const { favourite_orgs: listings } = body;

            expect(listings).toHaveLength(3);

            listings.forEach((listing: FavOrg) => {
              expect(listing).toMatchObject({
                fav_orgs_id: expect.any(Number),
                vol_id: expect.any(Number),
                org_id: expect.any(Number),
                org_name: expect.any(String),
              });

              expect(listing.org_avatar).toBeDefined();
            });
          });
      });
  });

  test("Returns a 400 error when id is not a number", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        // Fetch favourites
        return request(app)
          .get("/api/favourites/banana/orgs")
          .set("Cookie", [...header["set-cookie"]])
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("user_id is not a number!");
          });
      });
  });

  test("Returns a 403 when trying to access another user's favourite organisations", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        // Fetch favourites
        return request(app)
          .get("/api/favourites/3/orgs")
          .set("Cookie", [...header["set-cookie"]])
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });

  test("Returns a 401 when not logged in", () => {
    return request(app)
      .get("/api/favourites/3/orgs")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_NOT_LOGGED_IN);
      });
  });

  test("Returns a 404 when the user does not have any favourite organisations", () => {
    const volCredentials = {
      email: "isabella.thomas@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        // Fetch favourites
        return request(app)
          .get("/api/favourites/10/orgs")
          .set("Cookie", [...header["set-cookie"]])
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No favourites found!");
          });
      });
  });
});
