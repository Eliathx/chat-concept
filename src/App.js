import React, { useEffect, useState } from 'react';

const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Conectar al WebSocket
        const ws = new WebSocket('ws://localhost:8080/chat');
        
        ws.onopen = () => {
            console.log('Conectado al servidor WebSocket');
        };

        ws.onmessage = (event) => {
            console.log('Mensaje recibido:', event.data);
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        ws.onerror = (error) => {
            console.error('Error en WebSocket:', error);
        };

        ws.onclose = () => {
            console.log('Conexión WebSocket cerrada');
        };

        setSocket(ws);

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    const handleSendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN && input) {
            socket.send(input);
            setInput('');
        } else {
            console.error('WebSocket no está abierto o no hay mensaje para enviar');
        }
    };

    return (
        <div>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje"
            />
            <button onClick={handleSendMessage}>Enviar</button>
        </div>
    );
};

export default ChatApp;
