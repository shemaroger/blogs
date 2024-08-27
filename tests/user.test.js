const request = require('supertest');
const app = require('../app'); // Your Express app
const mongoose = require('mongoose');

describe('User Authentication', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/blog_app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send({ name: 'Test User', email: 'roger@gmail.com', password: 'pass123' });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User created successfully');
  });

  it('should login a user', async () => {
    await request(app)
      .post('/users/signup')
      .send({ name: 'Test User', email: 'roger@gmail.com', password: 'pass123' });

    const res = await request(app)
      .post('/users/login')
      .send({ email: 'roger@gmail.com', password: 'pass123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
