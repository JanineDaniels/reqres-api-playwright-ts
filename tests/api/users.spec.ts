import { test, expect } from "@playwright/test";
import { loginCredentials, newUser, updateUser } from "../../test-data/UserData";

test.describe("API - User Endpoint Tests", () => { 

  test("US-001 - GET: List All Users", async ({ request }) => { 
    const pageNumber = 2;
    const response = await request.get(`/api/users?page=${pageNumber}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.page).toBe(pageNumber)
    expect(body.data[0].id).toBeDefined();
    expect(body.data[0].email).toBeDefined();
    expect(body.data[0].first_name).toBeDefined();
    expect(body.data[0].last_name).toBeDefined();
  })

  // Parameterised - 002 and 008 use same logic
  const userLookups = [
    { userId: 2, expectedStatus: 200, description: "existing user" },
    { userId: 999, expectedStatus: 404, description: "non-existent user" },
  ];

  for (const { userId, expectedStatus, description } of userLookups) {
    test(`US-002/008 - GET: Single User - ${description}`, async ({ request }) => {
      const response = await request.get(`/api/users/${userId}`);
      expect(response.status()).toBe(expectedStatus);
      const body = await response.json();

      if (expectedStatus === 200) {
        expect(body.data).toBeDefined();
        expect(body.data.id).toBe(userId)
        expect(body.data.email).toBeDefined();
        expect(body.data.email).toContain("@");
      } else { 
        expect(body).toBeDefined();
        expect(Object.keys(body).length).toBe(0)
      }
    })
  }

  test("US-003 - POST: Create User", async ({ request }) => { 
    const response = await request.post('/api/users', {
      data: {
        name: newUser.name,
        job: newUser.job,
      }
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(newUser.name);
    expect(body.job).toBe(newUser.job);
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined()
  })

  test("US-004 - PUT: Update User", async ({ request }) => {
    const response = await request.put("/api/users/2", {
      data: {
        name: updateUser.name,
        job: updateUser.job,
      },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    // Note: reqres is a mock API and does not persist updates
    expect(body).toBeDefined();
  })

  test("US-005 - DELETE: Delete User", async ({ request }) => {
    const response = await request.delete("/api/users/2");
    expect(response.status()).toBe(204);
    //Note: Mock APi behaviour does not return empty JSON so cannot be asserted
  })

})