import React from 'react';
import { Card, Button, Badge, Dropdown } from 'react-bootstrap';
import { FaTrash, FaPlay, FaStop, FaCog } from 'react-icons/fa';

const StreamMonitor = ({ streams, onRemove, onRunInference, onSelect, activeStream }) => {
  if (!streams || streams.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>No active streams</h4>
        <p className="text-muted">Add a video source to get started</p>
      </div>
    );
  }

  return (
    <div className="stream-grid">
      {streams.map(stream => (
        <Card key={stream.stream_id} className="stream-card">
          <div className="stream-card-header">
            <div>
              <strong>Stream #{stream.stream_id}</strong>
              <Badge bg={stream.active ? 'success' : 'secondary'} className="ms-2">
                {stream.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-1"
                onClick={() => onSelect(stream.stream_id)}
                active={activeStream === stream.stream_id}
              >
                {activeStream === stream.stream_id ? 'Viewing' : 'View'}
              </Button>
              
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  <FaCog />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item 
                    onClick={() => onRunInference(stream.stream_id, 'asset_detection')}
                  >
                    Run Asset Detection
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => onRunInference(stream.stream_id, 'defect_analysis')}
                  >
                    Run Defect Analysis
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="ms-1"
                onClick={() => onRemove(stream.stream_id)}
              >
                <FaTrash />
              </Button>
            </div>
          </div>
          <div className="stream-card-content">
            <div className="video-placeholder">
              {stream.active ? 'Live Video Feed' : 'Stream Inactive'}
            </div>
            <div className="mt-3">
              <p className="mb-1"><strong>Source:</strong> {stream.source}</p>
              <p className="mb-1"><strong>Queue Size:</strong> {stream.queue_size}</p>
              <p className="mb-0"><strong>Last Active:</strong> {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StreamMonitor;