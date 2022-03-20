import request from "supertest";

import app from "../src/app";
import Task from "../src/models/task";
import {
  userId,
  sampleUser,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
} from "./fixtures/db";

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/api/v1/tasks")
    .set("Authorization", `Bearer ${sampleUser.tokens[0].token}`)
    .send({
      description: "test task",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should return tasks created by the user", async () => {
  const response = await request(app)
    .get("/api/v1/tasks")
    .set("Authorization", `Bearer ${sampleUser.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("Should fail to delete other users task", async () => {
  await request(app)
    .delete(`/api/v1/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo._id}`)
    .send()
    .expect(401);

  const task = Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

