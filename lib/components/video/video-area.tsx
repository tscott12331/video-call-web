"use client";
import styles from './video-area.module.css';
import UserInfoTopBar from '@/lib/components/user-info/user-info-top-bar';
import CallControls from './call-controls';

import { useEffect, useState } from 'react';
export default function VideoArea() {
    const [shouldShowInfo, setShouldShowInfo] = useState<boolean>(false);
    const [shouldFlash, setShouldFlash] = useState<boolean>(false);
    const [shouldMaintain, setShouldMaintain] = useState<boolean>(false);
    
    const FLASH_TIMEOUT = 2000;

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
            <video controls={true} autoPlay={true}>cannot display video</video>
            <CallControls 
            onMouseEnter={maintainControls}
            onMouseLeave={resetFlash}
            visible={shouldShowInfo}
            />
        </section>
    )
}
