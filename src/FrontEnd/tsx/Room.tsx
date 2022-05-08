import { Button, Container, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const Room = ()=>{
    const [message,setMessage] = useState('');
    const [socket,setSocket] = useState<any>();
    const [content,setContent] = useState('');
    useEffect(()=>{
        const ws = new WebSocket('ws://localhost:8080/examRoom')
        if(ws !== null){
            ws.onmessage = ev => {
                setContent(ev.data);
            }
            setSocket(ws);
        }

    },[])
    return (
        <Container>
            <TextField onChange={e => setMessage(e.target.value)}>
            </TextField>
            <Button onClick={e=>{
                socket.send(message);
            }}>
                Send
            </Button>
            <Typography>
                {content}
            </Typography>
        </Container>
    )
}

export default Room;