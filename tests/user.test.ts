import request from "supertest";

import { userId, sampleUser, setupDatabase } from "./fixtures/db";
import app from "../src/app";
import User from "../src/models/user";

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/api/v1/auth/signUp")
    .send({
      name: "Enoch",
      email: "enoch@test.com",
      password: "test1234",
      age: 22
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Enoch",
      email: "enoch@test.com",
    },
    // token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("test1234");
});

test("Should signin an existing user", async () => {
  const response = await request(app)
    .post("/api/v1/auth/signIn")
    .send({
      email: sampleUser.email,
      password: sampleUser.password,
    })
    .expect(200);

  const user = await User.findById(userId);

  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: sampleUser.name,
      email: sampleUser.email,
    },
    // token: user.tokens[1].token,
  });
});

test("Should not signin non-existing user", async () => {
  await request(app)
    .post("/api/v1/auth/signIn")
    .send({
      email: "nonexisting@user.com",
      password: "test1234",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/api/v1/users/me")
    .set("Authorization", `Bearer ${sampleUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/api/v1/users/me").send().expect(401);
});

test("Should delete account for authenticated user", async () => {
  const response = await request(app)
    .delete("/api/v1/users/me")
    .set("Authorization", `Bearer ${sampleUser.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(response.body._id);

  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/api/v1/users/me").send().expect(401);
});

// test("Should upload avatar", async () => {
//   await request(app)
//     .post("/api/v1/users/me/avatar")
//     .set("Authorization", `Bearer ${sampleUser.tokens[0].token}`)
//     .attach("avatar", "tests/fixtures/profile-pic.jpg")
//     .expect(200);

//   const user = await User.findById(userId);

//   expect(user.avatar).toEqual(expect.any(Buffer));
// });

test("Should update valid user fields", async () => {
  const updateUser = {
    name: "nameChanged",
    email: "sample@changed.com",
  };
  await request(app)
    .patch("/api/v1/users/me")
    .set("Authorization", `Bearer ${sampleUser.tokens[0].token}`)
    .send(updateUser)
    .expect(201);

  const user = await User.findById(userId);

  expect(user.name).toEqual(updateUser.name);
  expect(user.email).toEqual(updateUser.email);
});

test("Should not update invalid fields", async () => {
  await request(app)
    .patch("/api/v1/users/me")
    .set("Authorization", `Bearer ${sampleUser.tokens[0].token}`)
    .send({
      location: "some where",
    })
    .expect(400);
});
