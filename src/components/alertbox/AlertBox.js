import React, { useState, useEffect } from 'react';

export function AlertBox({ message, trigger }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!visible) return null;

  return (
    <div className="alert alert-danger" role="alert">
      {message}
    </div>
  );
}