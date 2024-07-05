import request from "supertest";
import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";
import { checkPassword } from "../../../auth/auth-utils";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("PATCH /api/vol/:user_id", () => {
  test("updates a user profile when email is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "mattygemail@email.com" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: email changed");

    const userResponse = await db.query(
      "SELECT vol_email FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_email).toBe("mattygemail@email.com");
  });

  test("updates a user profile when password is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ password: "mygoatpassword" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: password changed");

    const userResponse = await db.query(
      "SELECT vol_password FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(checkPassword("mygoatpassword", updatedUser.vol_password)).toBe(
      true
    );
  });
  test("updates a user profile when first name is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "Winston" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: firstName changed");

    const userResponse = await db.query(
      "SELECT vol_first_name FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_first_name).toBe("Winston");
  });
  test("updates a user profile when last name is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ lastName: "Churchill" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: lastName changed");

    const userResponse = await db.query(
      "SELECT vol_last_name FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_last_name).toBe("Churchill");
  });
  test("updates a user profile when contact telephone number is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ contactTel: "98239238928398" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: contactTel changed");

    const userResponse = await db.query(
      "SELECT vol_contact_tel FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_contact_tel).toBe("98239238928398");
  });
  //   TODO: updating avatar image
  test("updates a user profile when bio is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "Help, I need somebody, help!" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: bio changed");

    const userResponse = await db.query(
      "SELECT vol_bio FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_bio).toBe("Help, I need somebody, help!");
  });
  test("updates a user profile when all possible changes are included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "mattygemail@email.com",
        password: "mygoatpassword",
        firstName: "Winston",
        lastName: "Churchill",
        contactTel: "98239238928398",
        bio: "Help, I need somebody, help!",
      })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe(
      "Update successful: email and password and firstName and lastName and contactTel and bio changed"
    );

    const userResponse = await db.query(
      "SELECT vol_email,vol_password,vol_first_name,vol_last_name,vol_contact_tel,vol_bio FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_email).toBe("mattygemail@email.com");
    expect(checkPassword("mygoatpassword", updatedUser.vol_password)).toBe(
      true
    );
    expect(updatedUser.vol_first_name).toBe("Winston");
    expect(updatedUser.vol_last_name).toBe("Churchill");
    expect(updatedUser.vol_contact_tel).toBe("98239238928398");
    expect(updatedUser.vol_bio).toBe("Help, I need somebody, help!");
  });
  test("Returns a 403 error when user is not a vol user", async () => {
    const volCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "mattygemail@email.com",
        password: "mygoatpassword",
        firstName: "Winston",
        lastName: "Churchill",
        contactTel: "98239238928398",
        bio: "Help, I need somebody, help!",
      })
      .expect(403)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
      });
  });
  test("Returns a 403 error when id of vol user does not match the vol user id supplied in parametric endpoint", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/2")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "mattygemail@email.com",
        password: "mygoatpassword",
        firstName: "Winston",
        lastName: "Churchill",
        contactTel: "98239238928398",
        bio: "Help, I need somebody, help!",
      })
      .expect(403)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
      });
  });
  test("Returns a 400 error when vol id supplied as parametric endpoint is not valid", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/one")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "mattygemail@email.com",
        password: "mygoatpassword",
        firstName: "Winston",
        lastName: "Churchill",
        contactTel: "98239238928398",
        bio: "Help, I need somebody, help!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("user_id is not a number!");
      });
  });
  test("A 400 error with email is an empty string", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "",
        first_name: "Matty",
        last_name: "Matty",
        password: "mypassword",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email cannot be empty!");
      });
  });
  test("A 400 error with email is not valid email", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "Thisisnotvalidemail",
        first_name: "Matty",
        last_name: "Matty",
        password: "mypassword",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email address is not valid!");
      });
  });
  test("A 400 error with an email containing spaces", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "Thisisnotvalidema@ email.com",
        first_name: "Matty",
        last_name: "Matty",
        password: "mypassword",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email address is not valid!");
      });
  });
  test("A 400 error with an email under 5 characters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "T@om",
        first_name: "Matty",
        last_name: "Matty",
        password: "mypassword",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Email address must be between 5 and 80 characters!"
        );
      });
  });
  test("A 400 error with an email above 80 characters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email:
          "Tasdasdadsssssssssssssssssssssssssssssssssssssssssssssssssssdddddddddddddddddddd@email.com",
        first_name: "Matty",
        last_name: "Matty",
        password: "mypassword",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Email address must be between 5 and 80 characters!"
        );
      });
  });
  test("A 400 error with an email that is already used by a volunteer", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "alice.smith@email.com",
        first_name: "Matty",
        last_name: "Matty",
        password: "mypassword",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email already exists!");
      });
  });
  test("A 400 error with an email that is already used by an organisation", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "unicef@email.com",
        first_name: "Matty",
        last_name: "Matty",
        password: "mypassword",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email already exists!");
      });
  });
  test("A 400 error with password is empty string", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Password cannot be empty!");
      });
  });
  test("A 400 error with password too short provided", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "22",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Password must be between 5 and 20 characters in length!"
        );
      });
  });
  test("A 400 error with password too long provided", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "abcdefghijklmnopqrstuvwxyz",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Password must be between 5 and 20 characters in length!"
        );
      });
  });
  test("A 400 error with password with whitespace", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "abcd efghij",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Password must not contain whitespace characters!"
        );
      });
  });
  test("Bio cannot be longer than 700 characters", async () => {
    let str = "";
    for (let i = 0; i < 705; i++) {
      str += "g";
    }

    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bio: str,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bio must be between 1 and 700 characters in length!"
        );
      });
  });
  test("Bio cannot be empty", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bio: "",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bio cannot be empty!");
      });
  });
  test("Bio can not start or end with whitespace", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bio: " yoyoyoyoyoyo",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bio cannot start or end with spaces!");
      });
  });
  test("Contact tel cannot be empty string", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        contactTel: "",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Contact Telephone cannot be empty!");
      });
  });
  test("Contact tel cannot contain letters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        contactTel: "yoyoyoyoyoyo",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Contact Telephone must only contain numbers!");
      });
  });
  test("Contact tel cannot be less than 5 characters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        contactTel: "123",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Contact Telephone must be between 5 and 50 characters!"
        );
      });
  });
  test("Contact tel cannot be more than 50 characters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        contactTel:
          "1234567890123456789012345678901234567890123456789012345678901234567890",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Contact Telephone must be between 5 and 50 characters!"
        );
      });
  });
  test("first name cannot be empty string", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name cannot be empty!");
      });
  });
  test("first name cannot be less than 2 characters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "g",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name must be between 2 and 50 characters!");
      });
  });
  test("first name cannot be more than 50 characters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName:
          "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name must be between 2 and 50 characters!");
      });
  });
  test("first name must only contain letters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "j4mes",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name is not valid!");
      });
  });
  test("last name cannot be empty string", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lastName: "",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name cannot be empty!");
      });
  });
  test("last name cannot be less than 2 characters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lastName: "g",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name must be between 2 and 50 characters!");
      });
  });
  test("last name cannot be more than 50 characters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lastName:
          "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name must be between 2 and 50 characters!");
      });
  });
  test("last name must only contain letters", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);
    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lastName: "j4mes",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Name is not valid!");
      });
  });
});
