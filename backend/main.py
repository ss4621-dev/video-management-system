from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import json
import os

# Correct imports (use absolute paths)
from model_loader import ModelLoader
from stream_manager import StreamManager
from config import Config

app = FastAPI()
stream_manager = StreamManager()
model_loader = ModelLoader()  # Instantiate ModelLoader

# Load models on startup
@app.on_event("startup")
async def startup_event():
    print("Starting up... Loading models")
    for name, path in Config.MODEL_PATHS.items():
        # Call load_model on the instance
        model_loader.load_model(name, path)

#CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class StreamRequest(BaseModel):
    source: str

class InferenceRequest(BaseModel):
    stream_id: int
    model_name: str

#API Endpoints
@app.post("/streams")
async def add_stream(req: StreamRequest):
    try:
        stream_id = len(stream_manager.streams) + 1
        if stream_manager.add_stream(stream_id, req.source):
            return {"stream_id": stream_id}
        raise HTTPException(status_code=400, detail="Max streams reached")
    except Exception as e:
        print(f"Error adding stream: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}" )

@app.delete("/streams/{stream_id}")
async def remove_stream(stream_id: int):
    stream_manager.stop_stream(stream_id)
    return {"message": "Stream stopped"}

@app.post("/inference")
async def run_inference(req: InferenceRequest):
    frame = stream_manager.get_frame(req.stream_id)
    if frame is None:
        raise HTTPException(status_code=404, detail="Frame not available")
    
    results = model_loader.run_inference(req.model_name, frame)
    #Save results
    os.makedirs(Config.OUTPUT_DIR, exist_ok=True)
    with open(f"{Config.OUTPUT_DIR}/results_{req.stream_id}.json", "w") as f:
        json.dump(results, f)
    return results

@app.get("/dashboard")
async def get_dashboard():
    status = []
    try:
        for stream_id in list(stream_manager.streams.keys()):
            status.append({
                "stream_id": stream_id,
                "active": stream_id in stream_manager.streams,
                "queue_size": stream_manager.frame_queues[stream_id].qsize(),
                "source": stream_manager.sources.get(stream_id, "Unknown")
            })
        return {"streams": status}
    except Exception as e:
        print(f"Error generating dashboard: {str(e)}")
        return {"streams": []}  # Always return a valid structure

@app.get("/alerts")
async def get_alerts():
    # In a real system, you would fetch from a database
    # For now, return sample alerts
    return {
        "alerts": [
            {
                "id": 1,
                "timestamp": "2025-08-07T18:15:00Z",
                "message": "System started successfully",
                "severity": "low"
            }
        ]
    }

    return {"streams": status}