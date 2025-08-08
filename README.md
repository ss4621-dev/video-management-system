# Video Management System (VMS) with AI Integration

A comprehensive video management solution supporting 10+ simultaneous video streams with real-time AI analysis capabilities.

## Features
- 📹 Multi-input handling (RTSP, files, webcams)
- 🤖 AI model integration for asset detection and defect analysis
- 📊 Real-time dashboard with stream monitoring
- 🔔 Alert and notification system
- ⚙️ Scalable backend architecture

## Getting Started

### Prerequisites
- Python 3.11
- Node.js 18.x
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/video-management-system.git
cd video-management-system

# Set up backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up frontend
cd ../frontend
npm install
```

Running the Application

```bash
# Start backend
cd backend
uvicorn main:app --reload --port 8000

# Start frontend (in new terminal)
cd frontend
npm run dev
```

Access dashboard at: http://localhost:3000

Project Structure

```bash
video-management-system/
├── backend/            # FastAPI backend
│   ├── main.py         # API endpoints
│   ├── stream_manager.py # Stream processing
│   ├── model_loader.py # AI integration
│   └── config.py       # Configuration
├── frontend/           # React dashboard
│   ├── src/            # UI components
│   └── public/         # Static assets
├── .gitignore          # Git exclusion rules
└── README.md           # This file
```

Contributing

1. Fork the repository

2. Create your feature branch (git checkout -b feature/amazing-feature)

3. Commit your changes (git commit -m 'Add amazing feature')

4. Push to the branch (git push origin feature/amazing-feature)

5. Open a pull request

License

Distributed under the MIT License. See LICENSE for more information.


