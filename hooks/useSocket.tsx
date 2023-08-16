import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : apiUrl;

const socket = io(baseUrl);
const SocketContext = createContext<Socket>(socket);

socket.on('connect', () => {
  console.log('connected')
});

const SocketProvider = ({ children }: any) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export { SocketContext, SocketProvider };
