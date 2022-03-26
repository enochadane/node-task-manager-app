import request from "supertest";
import { PrismaClient } from "@prisma/client";

import app from "../src/app";
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

const prisma = new PrismaClient();

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/api/v1/tasks")
    .set("Authorization", `Bearer ${sampleUser.tokens[0].token}`)
    .send({
      description: "test task",
    })
    .expect(201);

  const task = await prisma.tasks.findUnique({
    where: {
      id: response.body._id,
    },
  });
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should return tasks created by the user", async () => {
  const response = await request(app)
    .get("/api/v1/tasks")
    .set("Authorization", `Bearer ${sampleUser.tokens[0].token}`)
    .send()
    .expect(200);
  console.log(response.body, 'response body')
  expect(response.body.length).toBe(2);
});

test("Should fail to delete other users task", async () => {
  await request(app)
    .delete(`/api/v1/tasks/${taskOne.id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(401);

  const task = prisma.tasks.findUnique({
    where: {
      id: taskOne.id,
    },
  });
  expect(task).not.toBeNull();
});
