# Implementation Notes

## Authentication Flow

The register and login forms send user details to the Express API through Axios. After a successful request, the frontend stores the returned user and token in local storage. `AuthContext` keeps the logged-in user available across the application and removes the stored data on logout.

Passwords are never stored directly. The User model hashes each password with bcrypt before saving it to MongoDB.

## JWT Implementation

The backend creates a JWT after registration or login. The token contains the user ID and expires after seven days.

The Axios request interceptor reads the token from local storage and adds it to API requests:

```http
Authorization: Bearer <token>
```

If the API returns `401`, the response interceptor clears the saved login and redirects to the login page.

## Protected Routes

`PrivateRoute` prevents logged-out users from opening the dashboard. This is mainly a frontend convenience.

The actual security is handled by the backend `protect` middleware. It verifies the JWT, loads the user, and rejects missing or invalid tokens before a task controller runs.

## Task CRUD Flow

`TaskContext` contains the API calls and shared task state. The dashboard fetches tasks after loading. Adding, editing, or deleting a task updates both MongoDB and the context state, so a full refresh is not required.

Every task query includes the logged-in user's ID. This prevents one user from reading or changing another user's tasks.

## Search

Search is handled on the frontend because this is a small project and all of the current user's tasks are already loaded. The dashboard compares the search text with each task title using a case-insensitive match.

## Filtering

Status and priority filters are applied to the task array before rendering. The available status values are Not Started, In Progress, and Completed. Priority can be Low, Medium, or High.

Sorting runs after filtering and supports newest first, oldest first, and nearest due date.

## Pagination

Pagination is also handled on the frontend. After search, filtering, and sorting are applied, the result is split into pages of five tasks.

This keeps the implementation simple for an assignment-sized application. Server-side pagination would be a better option if users could have a very large number of tasks.

## Error Handling

Controllers use `async/await` with `try-catch` and pass unexpected errors to the global error middleware. The middleware handles Mongoose validation errors, invalid IDs, duplicate emails, and general server errors.

The frontend displays request errors in forms or dashboard alerts. Loading buttons, retry actions, delete confirmation, and toast messages provide feedback during common actions.

## Folder Structure Decisions

The backend follows a small MVC-style structure with models, controllers, routes, middleware, and configuration kept separate. A large service layer was not added because the application logic is still simple.

The frontend separates pages, reusable components, contexts, and the Axios configuration. Context API is enough for authentication and task state, so Redux or another state library would add unnecessary complexity.
