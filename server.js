Creating a full-stack web application for a blog using React for the frontend, Node.js for the backend, and Supabase for the database requires setting up several components. Below is a basic guide to help you get started with each part of the stack.

### Prerequisites
- Node.js installed on your machine
- npm or yarn
- Supabase account
- Basic understanding of React, Node.js, and PostgreSQL

### Configuration and Setup

#### Supabase Schema
First, you need to create a project in Supabase and set up your database tables. You will have a `posts` table as a minimum requirement.

1. **Create the `posts` table**:
   You can use Supabase's SQL Editor to execute the following SQL command:

   ```sql
   CREATE TABLE posts (
     id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
     title text,
     content text,
     created_at timestamp DEFAULT now()
   );
   ```

2. Save your API key and Supabase URL, which you'll need later for connecting your backend.

#### Backend: Node.js with Express

1. **Initialize your Node.js project**:

   ```bash
   mkdir blog-backend
   cd blog-backend
   npm init -y
   npm install express dotenv cors supabase-js
   ```

2. **Create the server (`server.js`)**:

   ```javascript
   require('dotenv').config();
   const express = require('express');
   const cors = require('cors');
   const { createClient } = require('@supabase/supabase-js');

   const app = express();
   app.use(cors());
   app.use(express.json());

   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

   // Endpoint to fetch all posts
   app.get('/posts', async (req, res) => {
     const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });

     if (error) return res.status(400).json({ error: error.message });

     res.json(data);
   });

   // Endpoint to create a new post
   app.post('/posts', async (req, res) => {
     const { title, content } = req.body;
     const { data, error } = await supabase.from('posts').insert([{ title, content }]);

     if (error) return res.status(400).json({ error: error.message });

     res.status(201).json(data);
   });

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. **Environment Configuration** (`.env` file):

   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   PORT=5000
   ```

#### Frontend: React

1. **Initialize your React app**:

   ```bash
   npx create-react-app blog-frontend
   cd blog-frontend
   npm install axios
   ```

2. **Create the main components** (`src/App.js`):

   ```javascript
   import React, { useState, useEffect } from 'react';
   import axios from 'axios';

   const App = () => {
     const [posts, setPosts] = useState([]);
     const [newPost, setNewPost] = useState({ title: '', content: '' });

     useEffect(() => {
       fetchPosts();
     }, []);

     const fetchPosts = async () => {
       const response = await axios.get('http://localhost:5000/posts');
       setPosts(response.data);
     };

     const createPost = async (e) => {
       e.preventDefault();
       if (!newPost.title || !newPost.content) return;
       await axios.post('http://localhost:5000/posts', newPost);
       setNewPost({ title: '', content: '' });
       fetchPosts();
     };

     return (
       <div className="App">
         <h1>Blog</h1>
         <form onSubmit={createPost}>
           <input
             type="text"
             placeholder="Title"
             value={newPost.title}
             onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
           />
           <textarea
             placeholder="Content"
             value={newPost.content}
             onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
           />
           <button type="submit">Create Post</button>
         </form>
         <div>
           {posts.map((post) => (
             <div key={post.id}>
               <h2>{post.title}</h2>
               <p>{post.content}</p>
               <small>{new Date(post.created_at).toLocaleString()}</small>
             </div>
           ))}
         </div>
       </div>
     );
   };

   export default App;
   ```

3. **Run your frontend and backend**:
   - Start the backend server: `node server.js`
   - Navigate to the `blog-frontend` directory and run the React app: `npm start`

### Summary
This basic setup will allow you to create and list blog posts using a React frontend, a Node.js backend, and Supabase as your database. Feel free to expand this with user authentication, better error handling, and more advanced features. Supabase also provides authentication features you can integrate, so consider adding user accounts for a more robust application.