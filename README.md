# Student Feedback Management API

REST API built with Node.js, Express, MongoDB, and Mongoose for submitting,
listing, and updating student feedback.

## Setup

1. Install dependencies with `npm install`.
2. Set `MONGODB_URI` in the `.env` file to your MongoDB connection string.
   The provided `.env` uses `mongodb://127.0.0.1:27017/student_feedback`, which
   requires a local MongoDB server to be running. For MongoDB Atlas, replace it
   with your Atlas connection string.
3. Start the API with `npm start`.

The API listens on port `3000` by default. Set `PORT` to use another port.

## Endpoints

### Submit feedback

`POST /api/feedback`

```json
{
  "studentName": "Alex Student",
  "courseName": "Backend Development",
  "message": "The session was helpful.",
  "rating": 5
}
```

All fields are required. The rating must be an integer from 1 to 5. New
feedback has a `status` of `Pending`.

### Retrieve feedback

`GET /api/feedback?page=1&limit=10`

Both query parameters are optional and must be positive integers when provided.
The response contains the `feedback` records, `currentPage`, and `totalRecords`.

### Update review status

`PATCH /api/feedback/:id`

```json
{
  "status": "Reviewed"
}
```

The status must be `Pending` or `Reviewed`. A valid ID for a record that does
not exist returns `404`.

## Tests

Run the API tests with `npm test`.
