import { test, expect } from "@playwright/test";
import { loginCredentials, newUser } from "../../test-data/UserData";

test.describe("API - Auth Endpoint Tests", () => {
   test("US-006 - POST: Login Success", async ({ request }) => {
     const response = await request.post("/api/login", {
       data: {
         email: loginCredentials.valid.email,
         password: loginCredentials.valid.password,
       },
     });
     expect(response.status()).toBe(200);
     const body = await response.json();
     expect(body.token).toBeDefined();
     expect(body.token.length).toBeGreaterThan(0);
   });

   test("US-007 - POST: Login Fail", async ({ request }) => {
     const response = await request.post("/api/login", {
       data: {
         email: loginCredentials.missingPassword.email,
         password: loginCredentials.missingPassword.password,
       },
     });
     expect(response.status()).toBe(400);
     const body = await response.json();
     expect(body.error).toBe("Missing password");
   });
 })