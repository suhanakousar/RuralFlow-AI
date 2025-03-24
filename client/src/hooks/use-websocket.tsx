import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketHookReturn {
  data: any | null;
  isConnected: boolean;
  sendMessage: (message: string) => void;
  error: Error | null;
}

export function useWebSocket(path: string): WebSocketHookReturn {
  const [data, setData] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Create WebSocket connection
  useEffect(() => {
    // Clean up existing connection
    if (socketRef.current) {
      socketRef.current.close();
    }

    try {
      // Create WebSocket connection
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}${path}`;
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      // Connection opened
      socket.addEventListener('open', () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        setError(null);
      });

      // Listen for messages
      socket.addEventListener('message', (event) => {
        try {
          const receivedData = JSON.parse(event.data);
          setData(receivedData);
        } catch (err) {
          // If the data isn't JSON, just set it as is
          setData(event.data);
        }
      });

      // Listen for errors
      socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      });

      // Connection closed
      socket.addEventListener('close', () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
      });

      // Clean up on unmount
      return () => {
        socket.close();
        socketRef.current = null;
      };
    } catch (err: any) {
      console.error('Error creating WebSocket:', err);
      setError(err);
      return () => {}; // Empty cleanup function
    }
  }, [path]);

  // Send message function
  const sendMessage = useCallback((message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.warn('WebSocket is not connected, cannot send message');
    }
  }, []);

  return { data, isConnected, sendMessage, error };
}