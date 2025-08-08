import cv2
import threading
import time
from queue import Queue
import config as Config


class StreamManager:
    def __init__(self):
        self.streams = {}
        self.frame_queues = {}
        self.stop_events = {}
        self.sources = {}
        self.lock = threading.Lock()

        #set default values if config is missing
        self.buffer_size = getattr(Config, 'BUFFER_SIZE', 10)
        self.max_streams = getattr(Config, 'MAX_STREAMS', 10)

    def add_stream(self, stream_id, source):
        with self.lock:
            if len(self.streams) >= self.max_streams:
                return False
                
            if stream_id not in self.streams:
                print(f"Adding stream {stream_id} with source {source}")
                self.stop_events[stream_id] = threading.Event()
                self.frame_queues[stream_id] = Queue(maxsize=self.buffer_size)
                self.sources[stream_id] = source
                
                thread = threading.Thread(
                    target=self._capture_frames,
                    args=(stream_id, source),
                    daemon=True
                )
                thread.start()
                self.streams[stream_id] = thread
                return True
        return False
    
    def _capture_frames(self, stream_id, source):
        cap = cv2.VideoCapture(source)
        while not self.stop_events[stream_id].is_set():
            ret, frame = cap.read()
            if not ret:
                break
            if not self.frame_queues[stream_id].full():
                self.frame_queues[stream_id].put(frame)
            time.sleep(0.01)
        cap.release()

    def get_frame(self, stream_id):
        if stream_id in self.frame_queues:
            return self.frame_queues[stream_id].get()
        return None
    
    def stop_stream(self, stream_id):
        if stream_id in self.stop_events:
            self.stop_events[stream_id].set()
            del self.streams[stream_id]
            del self.frame_queues[stream_id]
            del self.stop_events[stream_id]