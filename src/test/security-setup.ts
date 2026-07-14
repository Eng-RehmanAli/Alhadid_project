process.env.JWT_SECRET ??=
  "test-jwt-secret-at-least-32-characters-long!!";
process.env.SESSION_SECRET ??=
  "test-session-secret-at-least-32-characters-long";
process.env.REFRESH_TOKEN_SECRET ??=
  "test-refresh-secret-at-least-32-characters-long";
process.env.mongodb_url ??= "mongodb://127.0.0.1:27017/alhadid-test";
process.env.NODE_ENV ??= "test";
