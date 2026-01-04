import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io.connect("https://ctech-back.onrender.com");

function ChatInterface() {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const messagesEndRef = useRef(null);

    const joinRoom = () => {
        if (username !== "" && room !== "") {
            socket.emit("join_room", room);
            setShowChat(true);
        }
    };

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + (new Date(Date.now()).getMinutes() < 10 ? '0' : '') + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on("receive_message", handleReceiveMessage);

        // Cleanup listener on unmount
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    const inputStyle = {
        padding: '12px 16px',
        borderRadius: '8px',
        border: 'none',
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        outline: 'none',
        fontSize: '1rem',
        width: '100%',
        marginBottom: '1rem'
    };

    const buttonStyle = {
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        background: 'var(--accent-gradient)',
        color: 'white',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        transition: 'transform 0.1s'
    };

    if (!showChat) {
        return (
            <div className="join-chat-container">
                <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontWeight: '800' }}>Welcome Back</h2>
                <input
                    type="text"
                    placeholder="Username"
                    style={inputStyle}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Room ID"
                    style={inputStyle}
                    onChange={(event) => setRoom(event.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                />
                <button style={buttonStyle} onClick={joinRoom}>Join Chat</button>
            </div>
        );
    }

    return (
        <div className="chat-interface">
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>LIVE CHAT</span>
                    <h3 style={{ margin: 0 }}>{room}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '0.9rem' }}>{username}</span>
                </div>
            </div>

            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                {messageList.map((messageContent, index) => {
                    const isMe = username === messageContent.author;
                    return (
                        <div key={index} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                maxWidth: '70%',
                                padding: '12px 18px',
                                borderRadius: '12px',
                                background: isMe ? 'var(--message-sent-bg)' : 'var(--message-received-bg)',
                                borderTopRightRadius: isMe ? '2px' : '12px',
                                borderTopLeftRadius: isMe ? '12px' : '2px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <p style={{ margin: 0 }}>{messageContent.message}</p>
                            </div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '4px', padding: '0 4px' }}>
                                {messageContent.time} • {messageContent.author}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.1)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Type a message..."
                    style={{ ...inputStyle, marginBottom: 0 }}
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={sendMessage} style={{ ...buttonStyle, width: 'auto', padding: '0 24px' }}>
                    &#9658;
                </button>
            </div>
        </div>
    );
}

export default ChatInterface;
