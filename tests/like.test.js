// const request = require('supertest');
// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const jwt = require('jsonwebtoken');
// const app = require('../app'); // Adjust the path to your Express app
// const Blog = require('../models/Blog');
// const User = require('../models/User');

// let mongoServer;
// let server;
// let token;
// let user;
// let blogId;

// beforeAll(async () => {
//   jest.setTimeout(30000); // Increase timeout for setup
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();
//   await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
//   // Start the server on a random port
//   server = app.listen(0);

//   // Create a test user and get a token for authentication
//   user = new User({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });
//   await user.save();
//   token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

//   // Create a test blog
//   const blog = new Blog({ title: 'Blog for Likes', content: 'Content of the blog', author: user._id });
//   await blog.save();
//   blogId = blog._id;
// }, 30000);

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
//   await new Promise((resolve) => server.close(resolve));
// });

// describe('Like Endpoints', () => {
//   beforeEach(async () => {
//     // Reset likes before each test
//     await Blog.findByIdAndUpdate(blogId, { $set: { likes: [] } });
//   });

//   it('should toggle a like on a blog', async () => {
//     const response = await request(server)
//       .post(`/blogs/${blogId}/likes`)
//       .set('Authorization', `Bearer ${token}`);
//     expect(response.statusCode).toBe(200);
//     expect(Array.isArray(response.body.likes)).toBe(true);
//     expect(response.body.likes).toContain(user._id.toString());
//   });

//   it('should remove a like when toggled twice', async () => {
//     // First like
//     await request(server)
//       .post(`/blogs/${blogId}/likes`)
//       .set('Authorization', `Bearer ${token}`);

//     // Second like (should remove)
//     const response = await request(server)
//       .post(`/blogs/${blogId}/likes`)
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.statusCode).toBe(200);
//     expect(Array.isArray(response.body.likes)).toBe(true);
//     expect(response.body.likes).not.toContain(user._id.toString());
//   });

//   it('should not toggle a like without authentication', async () => {
//     const response = await request(server)
//       .post(`/blogs/${blogId}/likes`);
//     expect(response.statusCode).toBe(401);
//   });

//   it('should not toggle a like on a non-existent blog', async () => {
//     const fakeId = mongoose.Types.ObjectId();
//     const response = await request(server)
//       .post(`/blogs/${fakeId}/likes`)
//       .set('Authorization', `Bearer ${token}`);
//     expect(response.statusCode).toBe(404);
//   });

//   it('should get likes count for a blog', async () => {
//     // Add a like first
//     await request(server)
//       .post(`/blogs/${blogId}/likes`)
//       .set('Authorization', `Bearer ${token}`);

//     const response = await request(server)
//       .get(`/blogs/${blogId}/likes/count`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty('count');
//     expect(response.body.count).toBe(1);
//   });
// });
