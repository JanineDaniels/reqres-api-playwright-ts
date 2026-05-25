# ReqRes API Test Suite

A Playwright + TypeScript API test framework built against the [ReqRes](https://reqres.in) public REST API, demonstrating contract testing, parameterised tests, and API automation patterns.

## Tech Stack

- [Playwright](https://playwright.dev) — test runner and API request handling
- TypeScript
- Node.js v20

## Implementation Notes

- Response validation beyond status codes on key endpoints — field types, pagination metadata, and email format explicitly asserted
- A single parameterised test covers both valid and 404 user lookup scenarios using a data-driven loop, with conditional contract assertions per response type
- Test data is stored in a dedicated `test-data/` folder, keeping test logic separate from test data
- API key and base URL are stored in `.env` and never hardcoded
- Negative path coverage is included alongside happy path scenarios for both user and auth endpoints

## Project Structure

```
├── tests/
│   └── api/
│       ├── users.spec.ts     # User endpoint tests
│       └── auth.spec.ts      # Authentication endpoint tests
├── test-data/
│   └── UserData.ts           # Centralised test data
├── .env.example              # Environment variable template
└── playwright.config.ts
```

## Test Coverage

| Test | Method | Endpoint | Description |
|------|--------|----------|-------------|
| US-001 | GET | `/api/users?page=2` | List users with pagination and contract validation |
| US-002/008 | GET | `/api/users/{id}` | Single user — parameterised for valid and 404 cases |
| US-003 | POST | `/api/users` | Create user and validate response shape |
| US-004 | PUT | `/api/users/2` | Update user |
| US-005 | DELETE | `/api/users/2` | Delete user |
| US-006 | POST | `/api/login` | Successful authentication returns token |
| US-007 | POST | `/api/login` | Failed authentication returns error message |

## Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Add your ReqRes API key to .env

# Run tests
npx playwright test

# View HTML report
npx playwright show-report
```

## Environment Variables

```
BASE_URL=https://reqres.in
API_KEY=your_reqres_api_key
```

## Known Limitations

ReqRes is a public mock API. As a result:

- PUT and DELETE operations do not persist data — responses return pre-seeded mock data regardless of the request body
- Response behaviour can vary slightly between requests due to A/B testing on the ReqRes platform
- This suite is intended to demonstrate API testing patterns rather than validate a production system

In a production context, these tests would run against a stable staging environment with predictable, resettable data.
