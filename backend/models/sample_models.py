# Simple detection model for demonstration 
class AssetDetector:
    def predict(self, frame):
        return {
            "assets": [
                {"type": "vehicle", "confidence": 0.92, "bbox": [10, 20, 100, 200]},
                {"type": "person", "confidence": 0.87, "bbox": [150, 30, 50, 180]},
            ]
        }
    
class DefectAnalyzer:
    def analyze(self, frame):
        return {
            "defects": 3,
            "locations": [[25, 35], [120, 80], [200, 150]],
            "severity": "high"
        }