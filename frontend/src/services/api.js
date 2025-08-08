import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export default {
  // Stream endpoints
  getStreams() {
    return api.get('/dashboard');
  },
  
  addStream(source) {
    return api.post('/streams', { source });
  },
  
  removeStream(streamId) {
    return api.delete(`/streams/${streamId}`);
  },
  
  // Inference endpoints
  runInference(streamId, modelName) {
    return api.post('/inference', { stream_id: streamId, model_name: modelName });
  },
  
  // Model management
  getModels() {
    return api.get('/models');
  },
  
  
};