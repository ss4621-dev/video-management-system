import React from 'react';
import { FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const AlertPanel = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="alert-panel">
        <p className="text-center text-muted">No alerts to display</p>
      </div>
    );
  }

  const getIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <FaExclamationCircle className="me-2" />;
      case 'medium':
        return <FaExclamationTriangle className="me-2" />;
      default:
        return <FaInfoCircle className="me-2" />;
    }
  };

  return (
    <div className="alert-panel">
      <ul className="alert-list">
        {alerts.map(alert => (
          <li key={alert.id} className={`alert-item alert-${alert.severity}`}>
            <div className="d-flex align-items-start">
              <div className="flex-shrink-0">
                {getIcon(alert.severity)}
              </div>
              <div>
                <div className="small text-muted">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
                <div>{alert.message}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertPanel;