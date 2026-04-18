# MediGuide - Full-Stack Drug Information Website

MediGuide is a beginner-friendly full-stack web project built with:

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

It allows users to:

- Search drugs by name
- View full drug details
- Check basic interactions between two drugs

## Project Structure

```bash
drug_info_website/
  client/
    assets/
      main.js
      styles.css
    about.html
    drug.html
    index.html
    package.json
    search.html
  server/
    data/
      drugs.js
    models/
      Drug.js
    .env.example
    index.js
    package.json
    seed.js
  README.md
```

## 1) Prerequisites

Install these first:

- Node.js (v18+ recommended)
- MongoDB (local installation)

## 2) Backend Setup

Open terminal in `server` folder:

```bash
cd server
npm install
```

Create environment file:

- Copy `.env.example` to `.env`
- Keep default values (or edit if needed)

`.env` example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/mediguide
PORT=5000
```

Seed sample data (10 drugs):

```bash
npm run seed
```

Run backend server:

```bash
npm run dev
```

Backend API will run at:

- `http://localhost:5000`

## 3) Frontend Setup

Open a new terminal in `client` folder:

```bash
cd client
npm install
npm start
```

Frontend will run at:

- `http://localhost:3000`

## 4) API Endpoints

- `GET /drugs` -> Get all drugs
- `GET /drugs/:name` -> Get one drug by name
- `POST /interactions` -> Check interaction

Example body for interactions:

```json
{
  "drug1": "Ibuprofen",
  "drug2": "Losartan"
}
```

## 5) Notes

- Data is dummy/demo-only and not medical advice.
- The app includes loading indicators and basic error handling.
- No external drug APIs are used.
