# 🍽️ PawangDahar - AI Food Chat Assistant

PawangDahar adalah aplikasi chat interaktif dengan AI yang membantu memberikan saran nutrisi makanan. Aplikasi memiliki dua mode personality:

- **💚 Supportive (Bude Waras)** - Mendukung dan memotivasi
- **🔥 Savage (Bude Pemaksa)** - Sarkastik dengan gaya Jawa

Kirim pesan teks atau upload foto makanan untuk mendapatkan analisis nutrisi real-time dari Gemini AI.

---

## 📁 Struktur Folder

```
Pawang-Dahar/
├── src/                          # Frontend Source
│   ├── api/
│   │   ├── client.ts            # Axios configuration
│   │   ├── chatApi.ts           # Chat API endpoints
│   │   └── geminiApi.ts         # Gemini AI integration
│   ├── components/
│   │   └── ui/                  # UI components
│   ├── pages/
│   │   └── ChatRoom.tsx         # Main chat interface
│   ├── store/
│   │   └── chatStore.ts         # Zustand state management
│   ├── App.tsx                  # Application root
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
│
├── server/                        # Backend Source
│   ├── controllers/
│   │   ├── chatController.js    # Chat message handling
│   │   └── geminiController.js  # AI response generation
│   ├── routes/
│   │   ├── chatRoutes.js        # Chat endpoints
│   │   └── geminiRoutes.js      # Gemini AI endpoints
│   ├── config/
│   │   └── multer.js            # File upload configuration
│   ├── uploads/                 # Uploaded images storage
│   ├── app.js                   # Express setup
│   ├── index.js                 # Server entry point
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── Dockerfile.frontend           # Frontend Docker image
├── docker-compose.yml            # Docker orchestration
├── .dockerignore
├── package.json                  # Frontend dependencies
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── components.json              # shadcn config
└── README.md
```

---

## 🚀 Instalasi

### Prasyarat

- **Node.js** v18 atau lebih tinggi
- **npm** atau **yarn**
- **Google Gemini API Key** (gratis di https://ai.google.dev)

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Konfigurasi Environment

**Frontend (.env)** - Buat file di root folder:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

**Backend (server/.env)** - Buat file di folder server:

```
PORT=5000
NODE_ENV=development
GOOGLE_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

### Step 3: Jalankan Development Servers

**Terminal 1 - Frontend:**

```bash
npm run dev
```

Frontend berjalan di `http://localhost:5173`

**Terminal 2 - Backend:**

```bash
cd server
npm run dev
```

Backend berjalan di `http://localhost:5000`

### Step 4: Gunakan Aplikasi

1. Buka `http://localhost:5173`
2. Pilih mode personality (Supportive atau Savage)
3. Ketik pesan atau upload foto makanan
4. Dapatkan analisis nutrisi dari Bude Dahar

---

## 🐳 Docker Setup

```bash
# Build dan jalankan dengan Docker Compose
docker-compose up -d

# Frontend di http://localhost:3000
# Backend di http://localhost:5000

# Hentikan services
docker-compose down
```

---

## 🔧 Perintah Berguna

### Frontend

```bash
npm run dev      # Development server dengan hot reload
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Check code quality
```

### Backend

```bash
cd server
npm run dev      # Development dengan auto-restart
npm start        # Production server
```

---

## 📝 Tech Stack

**Frontend:**

- React 19 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- Axios

**Backend:**

- Node.js + Express
- Google Generative AI (Gemini 2.5 Flash)
- Multer (file upload)

**Infrastructure:**

- Docker & Docker Compose

---

## 💡 Catatan Penting

- **Chat tidak disimpan** - Setiap reload, chat akan kosong (session-based)
- **Upload gambar** - Max 5MB, format JPG/PNG/WebP
- **Gemini API** - Pastikan API key valid dan memiliki quota
- **Port** - Frontend: 5173, Backend: 5000 (bisa diubah di .env)

---

## 🤝 Kontribusi

Feel free membuat pull request atau membuka issue untuk perbaikan.

---
