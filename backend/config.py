import os

class Config:
    # Stream settings
    BUFFER_SIZE = 10  # Max frames in queue
    MAX_STREAMS = 12   # Max simultaneous streams
    
    # Path configurations
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    OUTPUT_DIR = os.path.join(BASE_DIR, "results")
    MODEL_DIR = os.path.join(BASE_DIR, "models")
    
    # Model paths
    MODEL_PATHS = {
        "asset_detection": os.path.join(MODEL_DIR, "asset_detection.pth"),
        "defect_analysis": os.path.join(MODEL_DIR, "defect_analysis.onnx")
    }
    
    # Sample videos for testing
    SAMPLE_VIDEOS = {
        "bunny": os.path.join(BASE_DIR, "sample_videos", "BigBuckBunny.mp4"),
        "traffic": os.path.join(BASE_DIR, "sample_videos", "traffic.mp4")
    }
    
    # Add any other configuration parameters you need
    OPENCV_LOG_LEVEL = "ERROR"  # Suppress OpenCV debug logs