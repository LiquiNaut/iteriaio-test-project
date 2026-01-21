# 📄 # Document Management System

A simple document management application created as a technical assignment.

## 🚀 The Project

🔗 **Live Demo:** [iteraioproject.netlify.app](https://iteraioproject.netlify.app)

Main features:

- Login and registration (via Supabase).
- View list of your uploaded documents.
- Creating/Uploading new documents.
- Editing and deleting documents.
- Viewing document details with previews.

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Framework:** Refine.dev
- **Backend & Database:** Supabase (PostgreSQL + Storage)
- **Testing:** Vitest, React Testing Library
- **Deployment** Netlify

## ⚙️ How to Run It Locally

1. **Clone the repo**

   ```bash
   git clone ...
   cd iteriaio-test-project
   ```

2. **Install libraries**

   ```bash
   npm install
   ```

3. **Set up .env file**

   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_KEY=your_anon_key
   ```

4. **Run it**

   ```bash
   npm run dev
   ```

   The app will run at `http://localhost:5173`.

5. **Test it**
   ```bash
   npm run test
   ```

6. **Docker**

   Replace the values with your actual Supabase credentials from your `.env` file.

   ```bash
   docker build \
     --build-arg VITE_SUPABASE_URL=your_supabase_url \
     --build-arg VITE_SUPABASE_KEY=your_supabase_key \
     -t iteriaio-test-project .
   ```
   
   Run the container:
   ```bash
   docker run -p 5173:5173 iteriaio-test-project
   ```

## 📂 Architecture

- **CSR + BaaS (Supabase)** 

- **Refine - Provider pattern** 
- **Component-based architecture** 
- **Material UI** 

## 📄 Used Libs

- **Material UI** 
- **Uppy** 
- **React PDF** 
- **Pretty Bytes**
- **Vitest & React Testing Library**
