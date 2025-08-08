import React, { useState, useEffect, useRef } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Alert as BootstrapAlert, 
  Badge,
  Spinner
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaVideo, 
  FaExclamationTriangle,
  FaTrash,
  FaCog
} from 'react-icons/fa';
import StreamMonitor from './StreamMonitor';
import AlertPanel from './Alertpanel';
import VideoPlayer from './VideoPlayer';
import api from '../services/api';

const Dashboard = () => {
  const [streams, setStreams] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [sourceInput, setSourceInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeStream, setActiveStream] = useState(null);
  const alertCounter = useRef(0);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const streamsResponse = await api.getStreams();
      
      if (!streamsResponse || !streamsResponse.data) {
        throw new Error('Invalid response from server');
      }
      
      const streamsData = Array.isArray(streamsResponse.data.streams) 
        ? streamsResponse.data.streams 
        : [];
        
      setStreams(streamsData);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
      setStreams([]);
      addAlert('Failed to load stream data: ' + err.message, 'high');
    } finally {
      setIsLoading(false);
    }
  };

  const addAlert = (message, severity = 'medium') => {
    alertCounter.current += 1;
    setAlerts(prev => [
      ...prev.slice(-50),
      {
        id: `${Date.now()}-${alertCounter.current}`,
        timestamp: new Date().toISOString(),
        message,
        severity
      }
    ]);
  };

  const handleAddStream = async () => {
    if (!sourceInput.trim()) {
      addAlert('Please enter a valid video source', 'medium');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await api.addStream(sourceInput);
      
      if (!response.data || !response.data.stream_id) {
        throw new Error('Invalid response from server');
      }
      
      setSourceInput('');
      setError('');
      fetchDashboardData();
      addAlert(`Stream added successfully: ${sourceInput}`, 'low');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Server error';
      setError(`Failed to add stream: ${errorMsg}`);
      addAlert(`Failed to add stream: ${errorMsg}`, 'high');
      console.error('Add stream error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStream = async (streamId) => {
    try {
      setIsLoading(true);
      await api.removeStream(streamId);
      
      if (activeStream === streamId) {
        setActiveStream(null);
      }
      
      fetchDashboardData();
      addAlert(`Stream ${streamId} stopped successfully`, 'low');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Server error';
      setError(`Failed to remove stream: ${errorMsg}`);
      addAlert(`Failed to remove stream ${streamId}: ${errorMsg}`, 'high');
      console.error('Remove stream error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunInference = async (streamId, modelName) => {
    try {
      setIsLoading(true);
      const response = await api.runInference(streamId, modelName);
      
      addAlert(
        `Inference completed on stream ${streamId} with ${modelName}: ${JSON.stringify(response.data)}`,
        'medium'
      );
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Server error';
      addAlert(
        `Inference failed on stream ${streamId}: ${errorMsg}`,
        'high'
      );
      console.error('Inference error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1><FaVideo className="me-2" /> Video Management System</h1>
        <div className="status-indicator">
          <Badge bg={isLoading ? "warning" : "success"}>
            {isLoading ? <Spinner size="sm" /> : "Connected"}
          </Badge>
        </div>
      </div>

      {error && <BootstrapAlert variant="danger">{error}</BootstrapAlert>}

      <div className="stream-controls mb-3">
        <div className="input-group">
          <Form.Control 
            type="text"
            placeholder="Enter video source (rtsp://... or file://...)"
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddStream()}
          />
          <Button variant="primary" onClick={handleAddStream}>
            <FaPlus className="me-1" /> Add Stream
          </Button>
        </div>
        
        <div className="mt-2">
          <Button 
            variant="outline-secondary" 
            size="sm"
            className="me-2"
            onClick={() => setSourceInput('rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4')}
          >
            Use Test RTSP
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => setSourceInput('file:///path/to/sample.mp4')}
          >
            Use Sample File
          </Button>
        </div>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h3 className="m-0">Stream Monitoring</h3>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading streams...</p>
                </div>
              ) : (
                <StreamMonitor 
                  streams={streams} 
                  onRemove={handleRemoveStream} 
                  onRunInference={handleRunInference}
                  onSelect={setActiveStream}
                  activeStream={activeStream}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h3 className="m-0">Alerts <FaExclamationTriangle /></h3>
            </Card.Header>
            <Card.Body>
              <AlertPanel alerts={alerts} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {activeStream && (
        <Card className="mb-4">
          <Card.Header>
            <h3 className="m-0">Stream Preview: {activeStream}</h3>
          </Card.Header>
          <Card.Body>
            <VideoPlayer streamId={activeStream} />
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;