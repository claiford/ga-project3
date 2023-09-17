import { useState, useEffect } from 'react'
import { Button, Box, Modal } from '@mui/material';
import { socket } from '../socket';

import Swiper from './Swiper';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
};

const SessionIncomplete = ({ ongoingSession }) => {
    const [showSwiper, setShowSwiper] = useState(false)
    const [isConnected, setIsConnected] = useState(socket.connected);

    const handleJoinOngoing = () => {
        setShowSwiper(true);
        socket.connect();
    };

    const handleLeaveOngoing = () => {
        setShowSwiper(false);
        socket.disconnect();
    };

    const handleComplete = () => {
        handleLeaveOngoing()
    };

    useEffect(() => {
        function onConnect() {
            console.log(`connected as ${socket.id}`)
            setIsConnected(true);
        }

        function onDisconnect() {
            console.log(`disconnecting as ${socket.id}`)
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [])

    return (
        <>
            <Button onClick={handleJoinOngoing}>
                Join Ongoing Session
            </Button>
            <Modal
                open={showSwiper}
                onClose={handleLeaveOngoing}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={modalStyle}>
                    <h4>New Session - {socket.id}</h4>
                    <Swiper candidates={ongoingSession.candidates} />
                </Box>
            </Modal>
        </>
    )
};

export default SessionIncomplete;