const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Adjust the path to your Express app
jest.setTimeout(70000);
let mongoServer;
let server;

beforeAll(async () => {
   // Increase timeout for setup
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri)
  
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  // await new Promise((resolve) => server.close(resolve));
});

describe('User Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({}); // Clear users before each test
  });

  it('should register a new user', async () => {
    const response = await request(server)
      .post('/users/signup')
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should log in a user', async () => {
    await User.create({
      name: 'Existing User',
      email: 'existinguser@example.com',
      password: 'password123' // Note: In a real scenario, ensure this is hashed
    });

    const response = await request(server)
      .post('/users/login')
      .send({
        email: 'existinguser@example.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should not log in with incorrect credentials', async () => {
    const response = await request(server)
      .post('/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
    
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should not register a user with an existing email', async () => {
    await User.create({
      name: 'Existing User',
      email: 'existinguser@example.com',
      password: 'password123'
    });

    const response = await request(server)
      .post('/users/signup')
      .send({
        name: 'Another User',
        email: 'existinguser@example.com',
        password: 'newpassword123'
      });
    
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Email already exists');
  });
});