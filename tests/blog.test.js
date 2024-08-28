const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Adjust the path to your Express app
const Blog = require('../models/Blog');
const User = require('../models/User');

let mongoServer;
let server;
let token;
let user;

beforeAll(async () => {
  jest.setTimeout(30000); // Increase timeout for setup
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  // Start the server on a random port
  server = app.listen(0);

  // Create a test user and get a token for authentication
  user = new User({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });
  await user.save();
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await new Promise((resolve) => server.close(resolve));
});

describe('Blog Endpoints', () => {
  beforeEach(async () => {
    await Blog.deleteMany({}); // Clear blogs before each test
  });

  it('should create a new blog', async () => {
    const response = await request(server)
      .post('/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Blog',
        content: 'This is a test blog post.',
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Test Blog');
  });

  it('should get all blogs', async () => {
    await Blog.create({ title: 'Blog 1', content: 'Content 1', author: user._id });
    await Blog.create({ title: 'Blog 2', content: 'Content 2', author: user._id });

    const response = await request(server).get('/blogs');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  it('should get a blog by ID', async () => {
    const blog = await Blog.create({ title: 'Another Test Blog', content: 'Content of the blog', author: user._id });
    const response = await request(server).get(`/blogs/${blog._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Another Test Blog');
  });

  it('should update a blog', async () => {
    const blog = await Blog.create({ title: 'Blog to Update', content: 'Old content', author: user._id });
    const response = await request(server)
      .put(`/blogs/${blog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Blog', content: 'New content' });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Updated Blog');
  });

  it('should delete a blog', async () => {
    const blog = await Blog.create({ title: 'Blog to Delete', content: 'Content', author: user._id });
    const response = await request(server)
      .delete(`/blogs/${blog._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Blog deleted successfully');
  });

  it('should not create a blog without authentication', async () => {
    const response = await request(server)
      .post('/blogs')
      .send({
        title: 'Unauthorized Blog',
        content: 'This should not be created.',
      });
    expect(response.statusCode).toBe(401);
  });

  it('should not update a blog created by another user', async () => {
    const anotherUser = await User.create({ name: 'Another User', email: 'another@example.com', password: 'password123' });
    const blog = await Blog.create({ title: 'Not My Blog', content: 'Content', author: anotherUser._id });
    
    const response = await request(server)
      .put(`/blogs/${blog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tried to Update', content: 'New content' });
    expect(response.statusCode).toBe(403);
  });
});