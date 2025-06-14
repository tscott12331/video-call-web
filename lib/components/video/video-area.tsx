"use client";
import styles from './video-area.module.css';
import UserInfoTopBar from '@/lib/components/user-info/user-info-top-bar';
import CallControls from './call-controls';

type TMediaConstraint = {
    audio: boolean | MediaTrackConstraints;
    video: boolean | MediaTrackConstraints;
}

import { useEffect, useRef, useState } from 'react';
export default function VideoArea() {
    const [shouldShowInfo, setShouldShowInfo] = useState<boolean>(false);
    const [shouldFlash, setShouldFlash] = useState<boolean>(false);
    const [shouldMaintain, setShouldMaintain] = useState<boolean>(false);
    const [myStream, setMyStream] = useState<MediaStream|null>(null);
    const [mediaConstraints, setMediaConstraints] = useState<TMediaConstraint>({ video: true, audio: true });
    const [isMuted, setIsMuted] = useState<boolean>(false);
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

    const handleMicToggle = (muted: boolean) => {
        myStream?.getAudioTracks().forEach(track => {
            track.enabled = !muted;
        })
        setIsMuted(muted);
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
        handleMicToggle(isMuted);
    }, [myStream])

    return (
        <section className={styles.vaSection}
            onMouseMove={flashControls}
        >
            <UserInfoTopBar 
            absolutePosition='top' 
            onMouseEnter={maintainControls}
            onMouseLeave={resetFlash}
            visible={shouldShowInfo}
            />
            <video ref={myVideoFeed} autoPlay={true}>cannot display video</video>
            <CallControls 
            onMouseEnter={maintainControls}
            onMouseLeave={resetFlash}
            onAudioInputChange={handleAudioInputChange}
            onMicToggle={handleMicToggle}
            visible={shouldShowInfo}
            />
        </section>
    )
}
