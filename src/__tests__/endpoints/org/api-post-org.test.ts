import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";

import { testImg1 } from "../../../db/data/test-data/image-data";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("POST /api/org", () => {
  test("Successfully registers a new org user", () => {
    const newOrgUser = {
      email: "mattymoo@moo.com",
      org_name: "Matty Moo Charity",
      org_type_id: 1,
      password: "password",
      contact_tel: "2222222",
      bio: "This is a bio!",
    };

    return request(app)
      .post("/api/org")
      .send(newOrgUser)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;

        expect(user).toMatchObject({
          org_id: expect.any(Number),
          org_name: newOrgUser.org_name,
          org_type: newOrgUser.org_type_id,
          org_contact_tel: newOrgUser.contact_tel,
          org_bio: newOrgUser.bio,
          org_verified: true,
        });
      });
  });

  test("Can login after registration", () => {
    const newOrgUser = {
      email: "mattymoo@moo.com",
      org_name: "Matty Moo Charity",
      org_type_id: 1,
      password: "password",
      contact_tel: "2222222",
      bio: "This is a bio!",
    };

    return request(app)
      .post("/api/org")
      .send(newOrgUser)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;

        expect(user).toMatchObject({
          org_id: expect.any(Number),
          org_name: newOrgUser.org_name,
          org_type: newOrgUser.org_type_id,
          org_contact_tel: newOrgUser.contact_tel,
          org_bio: newOrgUser.bio,
          org_verified: true,
        });

        const loginObj = {
          email: "mattymoo@moo.com",
          password: "password",
          role: "organisation",
        };

        return request(app)
          .post("/api/login")
          .send(loginObj)
          .expect(200)
          .then(({ body }) => {
            const { user } = body;

            expect(user).toMatchObject({
              org_id: expect.any(Number),
              org_email: expect.any(String),
              org_name: expect.any(String),
              org_bio: expect.any(String),
              org_verified: expect.any(Boolean),
              role: "organisation",
              token: expect.any(String),
            });

            expect(user.org_avatar_img_id).toBeDefined();
          });
      });
  });

  test("Successfully registers a new org user with image avatar image attached", () => {
    let b64Image = testImg1;

    const newOrgUser = {
      email: "mattymoo@moo.com",
      org_name: "Matty Moo Charity",
      org_type_id: 1,
      password: "password",
      contact_tel: "2222222",
      bio: "This is a bio!",
      avatarImg: b64Image,
    };

    return request(app)
      .post("/api/org")
      .send(newOrgUser)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;

        expect(user).toMatchObject({
          org_id: expect.any(Number),
          org_name: newOrgUser.org_name,
          org_type: newOrgUser.org_type_id,
          org_contact_tel: newOrgUser.contact_tel,
          org_bio: newOrgUser.bio,
          org_verified: true,
        });
      });
  });

  test("Successfully registers a new org user with no bio", () => {
    const newOrgUser = {
      email: "mattymoo@moo.com",
      org_name: "Matty Moo Charity",
      org_type_id: 1,
      password: "password",
      contact_tel: "2222222",
    };

    return request(app)
      .post("/api/org")
      .send(newOrgUser)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;

        expect(user).toMatchObject({
          org_id: expect.any(Number),
          org_name: newOrgUser.org_name,
          org_type: newOrgUser.org_type_id,
          org_contact_tel: newOrgUser.contact_tel,
          org_verified: true,
        });
      });
  });

  test("Successfully registers a new org user with no contact telephone", () => {
    const newOrgUser = {
      email: "mattymoo@moo.com",
      org_name: "Matty Moo Charity",
      org_type_id: 1,
      password: "password",
    };

    return request(app)
      .post("/api/org")
      .send(newOrgUser)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;

        expect(user).toMatchObject({
          org_id: expect.any(Number),
          org_name: newOrgUser.org_name,
          org_type: newOrgUser.org_type_id,
          org_verified: true,
        });
      });
  });

  /*
   *  Org type id tests
   */
  test("Fails to register a new org user with no org_type_id", () => {
    const newOrgUser = {
      email: "mattymoo@moo.com",
      org_name: "Matty Moo Charity",
      password: "password",
      contact_tel: "2222222",
      bio: "This is a bio!",
    };

    return request(app)
      .post("/api/org")
      .send(newOrgUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Org Type ID is undefined!");
      });
  });

  test("Org_type_id must be a number", () => {
    const newOrgUser = {
      email: "mattymoo@moo.com",
      org_name: "Matty Moo Charity",
      password: "password",
      org_type_id: "banana",
      contact_tel: "2222222",
      bio: "This is a bio!",
    };

    return request(app)
      .post("/api/org")
      .send(newOrgUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Org Type ID is not a number!");
      });
  });

  test("Org_type_id must exist", () => {
    const newOrgUser = {
      email: "mattymoo@moo.com",
      org_name: "Matty Moo Charity",
      password: "password",
      org_type_id: 9999,
      contact_tel: "2222222",
      bio: "This is a bio!",
    };

    return request(app)
      .post("/api/org")
      .send(newOrgUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Organisation type does not exist and is not valid!"
        );
      });
  });

  /*
   *  Test email
   */
  describe("Email test", () => {
    test("Email cannot already exist", () => {
      const newOrgUser = {
        email: "oxfam@email.com",
        org_name: "Matty Moo Charity",
        org_type_id: 1,
        password: "password",
        contact_tel: "2222222",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Email already exists!");
        });
    });

    test("Email must be valid email pattern", () => {
      const newOrgUser = {
        email: "thisisnotvalid",
        org_name: "Matty Moo Charity",
        org_type_id: 1,
        password: "password",
        contact_tel: "2222222",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Email address is not valid!");
        });
    });

    test("Email must not be empty", () => {
      const newOrgUser = {
        org_name: "Matty Moo Charity",
        password: "password",
        org_type_id: 1,
        contact_tel: "2222222",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Email cannot be empty!");
        });
    });

    test("Email too short", () => {
      const newOrgUser = {
        org_name: "Matty Moo Charity",
        email: "m@m",
        org_type_id: 1,
        password: "password",
        contact_tel: "2222222",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          const expected =
            `Email address must be between ${constants.MIN_EMAIL_LENGTH} and ` +
            `${constants.MAX_EMAIL_LENGTH} characters!`;

          expect(body.msg).toBe(expected);
        });
    });

    test("Email too long", () => {
      const newOrgUser = {
        org_name: "Matty Moo Charity",
        email:
          "masdasdasdasdad@asdasdsdasdadsasaddsadsadsadsadsadsadasdsasdasdasdadsasadasdm.com",
        org_type_id: 1,
        password: "password",
        contact_tel: "2222222",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          const expected =
            `Email address must be between ${constants.MIN_EMAIL_LENGTH} and ` +
            `${constants.MAX_EMAIL_LENGTH} characters!`;

          expect(body.msg).toBe(expected);
        });
    });
  });

  /*
   * Password test
   */
  describe("Password test", () => {
    test("Password cannot be empty", () => {
      const newOrgUser = {
        org_name: "Matty Moo Charity",
        email: "matt@sasadasdm.com",
        org_type_id: 1,
        contact_tel: "2222222",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          const expected = "Password cannot be empty!";

          expect(body.msg).toBe(expected);
        });
    });

    test("Password must not contain spaces", () => {
      const newOrgUser = {
        org_name: "Matty Moo Charity",
        email: "matt@sasadasdm.com",
        password: "my password",
        org_type_id: 1,
        contact_tel: "2222222",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          const expected = "Password must not contain whitespace characters!";

          expect(body.msg).toBe(expected);
        });
    });

    test("Password too short", () => {
      const newOrgUser = {
        org_name: "Matty Moo Charity",
        email: "matt@sasadasdm.com",
        password: "m",
        org_type_id: 1,
        contact_tel: "2222222",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          const expected =
            `Password must be between ${constants.MIN_PASSWD_LENGTH} and ` +
            `${constants.MAX_PASSWD_LENGTH} characters in length!`;

          expect(body.msg).toBe(expected);
        });
    });

    test("Password too long", () => {
      const newOrgUser = {
        org_name: "Matty Moo Charity",
        email: "matt@sasadasdm.com",
        password:
          "masdasdkjlalkjdjwioliodwio092813903812093129032213123123123213123easdsaadsads",
        org_type_id: 1,
        contact_tel: "2222222",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          const expected =
            `Password must be between ${constants.MIN_PASSWD_LENGTH} and ` +
            `${constants.MAX_PASSWD_LENGTH} characters in length!`;

          expect(body.msg).toBe(expected);
        });
    });
  });

  /*
   *  Contact telephone testing
   */
  describe("Contact telephone testing", () => {
    test("Can only contain numbers", () => {
      const newOrgUser = {
        org_name: "Matty Moo Charity",
        email: "matt@sasadasdm.com",
        password: "asdasdg4345gfdgfd",
        org_type_id: 1,
        contact_tel: "222222sadfdg2",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Contact Telephone must only contain numbers!");
        });
    });

    test("Contact telephone is too short", () => {
      const newOrgUser = {
        org_name: "Matty Moo Charity",
        email: "matt@sasadasdm.com",
        password: "asdasdg4345gfdgfd",
        org_type_id: 1,
        contact_tel: "22",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          const msg =
            `Contact Telephone must be between ${constants.MIN_CONT_TEL_LENGTH} and ` +
            `${constants.MAX_CONT_TEL_LENGTH} characters!`;

          expect(body.msg).toBe(msg);
        });
    });

    test("Contact telephone is too long", () => {
      const newOrgUser = {
        org_name: "Matty Moo Charity",
        email: "matt@sasadasdm.com",
        password: "asdasdg4345gfdgfd",
        org_type_id: 1,
        contact_tel:
          "2223123123128793978128973718923791737189237919823719823791872319832719823",
        bio: "This is a bio!",
      };

      return request(app)
        .post("/api/org")
        .send(newOrgUser)
        .expect(400)
        .then(({ body }) => {
          const msg =
            `Contact Telephone must be between ${constants.MIN_CONT_TEL_LENGTH} and ` +
            `${constants.MAX_CONT_TEL_LENGTH} characters!`;

          expect(body.msg).toBe(msg);
        });
    });
  });
});
