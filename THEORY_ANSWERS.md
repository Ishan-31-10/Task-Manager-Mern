# Theory Answers

## 1. How would you scale a MERN application?

I would first monitor the API and database to find the real bottleneck. The Node API can remain stateless and run on multiple instances behind a load balancer, while the React build can be served through a CDN.

For MongoDB, useful indexes should be added for common queries, and Atlas can provide replicas or sharding when traffic requires it. Redis and background queues can be introduced later for repeated reads or slow jobs, but they are unnecessary for a small application.

## 2. What are the pros and cons of MongoDB for relational data?

MongoDB is flexible and maps naturally to JavaScript objects. It works well when data can be stored as documents or when related data can be embedded without complicated joins.

It is less suitable for systems with many relationships, strict foreign-key rules, or complex reporting. MongoDB supports transactions and lookups, but a relational database such as PostgreSQL is usually clearer for strongly relational data.

## 3. Fix this Express code

```js
app.get("/user", (req, res) => {
  User.findById(req.params.id, (err, user) => {
    res.send(user);
  });
});
```

The route does not define an `id` parameter, and it does not handle errors or a missing user. A practical version is:

```js
app.get("/user/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

## 4. What happens when React state is updated?

React schedules another render of the component. It compares the new output with the previous output and updates only the required DOM elements.

State updates may be batched, so the new value should not be expected immediately after calling the setter. If the next state depends on the previous state, use the callback form such as `setCount(count => count + 1)`.

## 5. Create a React table from JSON

The array can be rendered by mapping each object to a table row. A stable value such as the user ID should be used as the React key.

```jsx
const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

const UsersTable = () => (
  <table className="table table-bordered">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
```

## 6. What is the difference between PUT and PATCH?

`PUT` is normally used to replace the full resource, so the client sends its complete representation. `PATCH` is used to update only selected fields.

Both should be idempotent when implemented correctly. This project uses `PUT` for task updates but applies only the fields included in the request, which is common in smaller APIs even though it behaves more like `PATCH`.
