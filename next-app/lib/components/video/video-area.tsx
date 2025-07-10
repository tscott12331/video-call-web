"use client";
import styles from './video-area.module.css';
import { io } from 'socket.io-client';
import CallControls from './call-controls';
import { useEffect, useRef, useState } from 'react';
import { getCookie } from '@/lib/util/cookie';
import { SIGNALING_URL } from '@/endpoints';
import { TRoom } from '@/app/page';
import RoomInfoTopBar from '@/lib/components/user-info/user-info-top-bar';

type TMediaConstraint = {
    audio: boolean | MediaTrackConstraints;
    video: boolean | MediaTrackConstraints;
}

interface VideoAreaProps {
    room: TRoom;
    onMessageClick?: () => void;
}

export default function VideoArea({
    room,
    onMessageClick,
}: VideoAreaProps) {
    const [shouldShowInfo, setShouldShowInfo] = useState<boolean>(false);
    const [shouldFlash, setShouldFlash] = useState<boolean>(false);
    const [shouldMaintain, setShouldMaintain] = useState<boolean>(false);
    const [myStream, setMyStream] = useState<MediaStream|null>(null);
    const [mediaConstraints, setMediaConstraints] = useState<TMediaConstraint>({ video: true, audio: true });
    const [micIsEnabled, setMicIsEnabled] = useState<boolean>(true);
    const [videoIsEnabled, setVideoIsEnabled] = useState<boolean>(true);
    const myVideoFeed = useRef<HTMLVideoElement>(null);

    const FLASH_TIMEOUT = 3000;

    const flashControls = (e: React.SyntheticEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        setShouldFlash(true);
    }

    const maintainControls = () => {
        setShouldFlash(false);
        setShouldMaintain(true);
    }

    const resetFlash = () => {
        setShouldMaintain(false);
        setShouldFlash(true);
    }

    const setupUserFeed = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
            setMyStream(stream);

        } catch(err) {
            // DEVICE NOT FOUND
            console.error(err);
        }
    }

    const handleAudioInputChange = async (dev: MediaDeviceInfo) => {
        let newConstraints = {...mediaConstraints};
        newConstraints.audio = {deviceId: { exact: dev.deviceId }};
        setMediaConstraints({...newConstraints});
    }

    const handleMicToggle = (enabled: boolean) => {
        myStream?.getAudioTracks().forEach(track => {
            track.enabled = enabled;
        })
        setMicIsEnabled(enabled);
    }

    const handleVideoToggle = (enabled: boolean) => {
        myStream?.getVideoTracks().forEach(track => {
            track.enabled = enabled;
        })
        setVideoIsEnabled(enabled);
    }

    const handleVideoInputChange = async (dev: MediaDeviceInfo) => {
        let newConstraints = {...mediaConstraints};
        newConstraints.video = {deviceId: { exact: dev.deviceId }};
        setMediaConstraints({...newConstraints});

    }

    useEffect(() => {
        if(shouldFlash) {
            setShouldShowInfo(true);
            const timeout = setTimeout(() => {
                setShouldShowInfo(false);
                setShouldFlash(false);
            }, FLASH_TIMEOUT);

            return () => clearTimeout(timeout);
        } else if(shouldMaintain) {
            setShouldShowInfo(true);
        }
    }, [shouldFlash])

    useEffect(() => {
        setupUserFeed();
    },[mediaConstraints]);

    useEffect(() => {
        if(myVideoFeed.current) myVideoFeed.current.srcObject = myStream;
        handleMicToggle(micIsEnabled);
        handleVideoToggle(videoIsEnabled);
    }, [myStream])

    useEffect(() => {
        const socket = io(SIGNALING_URL, {
            auth: {
                token: getCookie('token'),
            }
        });

        return () => { socket.disconnect() }
    }, [])

    return (
        <section className={styles.vaSection}
            onMouseMove={flashControls}
        >
            <RoomInfoTopBar 
            absolutePosition='top' 
            onMouseEnter={maintainControls}
            onMouseLeave={resetFlash}
            visible={shouldShowInfo}
            roomName={room.name}
            onControlClick={onMessageClick}
            />
            <video ref={myVideoFeed} autoPlay={true}>cannot display video</video>
            <CallControls 
            onMouseEnter={maintainControls}
            onMouseLeave={resetFlash}
            onAudioInputChange={handleAudioInputChange}
            onMicToggle={handleMicToggle}
            onVideoInputChange={handleVideoInputChange}
            onVideoToggle={handleVideoToggle}
            visible={shouldShowInfo}
            />
        </section>
    )
}
