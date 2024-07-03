import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";

import { testImg1 } from "../../../db/data/test-data/image-data";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("POST /api/vol", () => {
  test("A volunteer user successfully registers", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
      contact_tel: "2222222",
      bio: "This is a bio!",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          vol_id: expect.any(Number),
          vol_email: newUser.email,
          vol_first_name: newUser.first_name,
          vol_last_name: newUser.last_name,
          vol_contact_tel: newUser.contact_tel,
          vol_avatar_img_id: null,
          vol_bio: newUser.bio,
          vol_hours: 0,
        });
      });
  });

  test("A volunteer user successfully registers with avatar provided", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
      contact_tel: "2222222",
      bio: "This is a bio!",
      avatar_img_b64: testImg1,
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          vol_id: expect.any(Number),
          vol_email: newUser.email,
          vol_first_name: newUser.first_name,
          vol_last_name: newUser.last_name,
          vol_contact_tel: newUser.contact_tel,
          vol_avatar_img_id: expect.any(Number),
          vol_bio: newUser.bio,
          vol_hours: 0,
        });
      });
  });

  test("A volunteer user successfully registers with no bio provided", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
      contact_tel: "2222222",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          vol_id: expect.any(Number),
          vol_email: newUser.email,
          vol_first_name: newUser.first_name,
          vol_last_name: newUser.last_name,
          vol_contact_tel: newUser.contact_tel,
          vol_avatar_img_id: null,
          vol_bio: null,
          vol_hours: 0,
        });
      });
  });

  test("A volunteer user successfully registers with no contact tel provided", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          vol_id: expect.any(Number),
          vol_email: newUser.email,
          vol_first_name: newUser.first_name,
          vol_last_name: newUser.last_name,
          vol_contact_tel: null,
          vol_avatar_img_id: null,
          vol_bio: null,
          vol_hours: 0,
        });
      });
  });

  test("A volunteer can login after registering", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
      contact_tel: "2222222",
      bio: "This is a bio!",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(200)
      .then(() => {
        return request(app)
          .post("/api/login")
          .send({
            email: newUser.email,
            password: newUser.password,
            role: "volunteer",
          })
          .expect(200);
      });
  });

  /*
   * Test password validation
   */
  test("A 400 error with no password provided", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Password cannot be empty!");
      });
  });

  test("A 400 error with password too short", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "22",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Password must be between 5 and 20 characters in length!"
        );
      });
  });

  test("A 400 error with password too long", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password:
        "22ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Password must be between 5 and 20 characters in length!"
        );
      });
  });

  test("A 400 error with password contains whitespace characters", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "22s   ssssss",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Password must not contain whitespace characters!"
        );
      });
  });

  test("A 400 error with password is an empty string", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Password cannot be empty!");
      });
  });

  /*
   * Test email validation!
   */
  test("A 400 error with no email provided", () => {
    const newUser = {
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email cannot be empty!");
      });
  });

  test("A 400 error with email is an empty string", () => {
    const newUser = {
      email: "",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email cannot be empty!");
      });
  });

  test("A 400 error with an invalid email provided", () => {
    const newUser = {
      email: "Thisisnotvalidemail",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email address is not valid!");
      });
  });

  test("A 400 error with an email containing spaces", () => {
    const newUser = {
      email: "Thisisnotvalidema@ email.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email address is not valid!");
      });
  });

  test("A 400 error with an email under 5 characters", () => {
    const newUser = {
      email: "T@om",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Email address must be between 5 and 80 characters!"
        );
      });
  });

  test("A 400 error with an email over 80 characters", () => {
    const newUser = {
      email:
        "Tasdasdadsssssssssssssssssssssssssssssssssssssssssssssssssssdddddddddddddddddddd@email.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Email address must be between 5 and 80 characters!"
        );
      });
  });

  test("Volunteer user cannot sign up with an already registered email", () => {
    const newUser = {
      email: "mattydemail@email.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email already exists!");
      });
  });

  test("Volunteer user cannot sign up with an already registerd charity email", () => {
    const newUser = {
      email: "unicef@email.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email already exists!");
      });
  });

  /*
   * Validate bio
   */
  test("Bio cannot be longer than 700 characters", () => {
    let str = "";
    for (let i = 0; i < 701; i++) {
      str += "g";
    }

    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
      bio: str,
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bio must be between 1 and 700 characters in length!"
        );
      });
  });

  /*
   * Validate contact tel
   */
  test("Contact tel cannot contain letters", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
      contact_tel: "22teretr123123",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Contact Telephone must only contain numbers!");
      });
  });

  test("Contact tel cannot be less than 5 characters", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
      contact_tel: "123",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Contact Telephone must be between 5 and 50 characters!"
        );
      });
  });

  test("Contact tel cannot be more than 50 characters", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      last_name: "Matty",
      password: "mypassword",
      contact_tel:
        "123233333333333333333333333333333333333333333333333333333333333333333333333333",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Contact Telephone must be between 5 and 50 characters!"
        );
      });
  });

  /*
   * Validate first name
   */
  test("User cannot register with no first name provided", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name cannot be empty!");
      });
  });

  test("400 error with first name less than 2 characters", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "s",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name must be between 2 and 50 characters!");
      });
  });

  test("400 with first name more than than 50 characters", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name:
        "sasdasdsadsdasdasdasadasdasdsadasdsadsdadsasdasdadsaadsasdasdsadasd",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name must be between 2 and 50 characters!");
      });
  });

  test("First name can only contain letters", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "sasdas45dsadasd",
      last_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name is not valid!");
      });
  });

  /*
   * Validate last name
   */
  test("User cannot register with no last name provided", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      first_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name cannot be empty!");
      });
  });

  test("400 error with last name less than 2 characters", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      last_name: "s",
      first_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name must be between 2 and 50 characters!");
      });
  });

  test("400 with last name more than than 50 characters", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      last_name:
        "sasdasdsadsdasdasdasadasdasdsadasdsadsdadsasdasdadsaadsasdasdsadasd",
      first_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name must be between 2 and 50 characters!");
      });
  });

  test("Last name can only contain letters", () => {
    const newUser = {
      email: "mattymoo@moo.com",
      last_name: "sasdas45dsadasd",
      first_name: "Matty",
      password: "mypassword",
    };

    return request(app)
      .post("/api/vol")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name is not valid!");
      });
  });
});
