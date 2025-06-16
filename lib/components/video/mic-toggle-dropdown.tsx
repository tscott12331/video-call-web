import { useEffect, useState } from 'react';
import styles from './mic-toggle-dropdown.module.css';

interface MicToggleDropdownProps {
    onMicToggle?: (muted: boolean) => void;
    onAudioInputChange?: (dev: MediaDeviceInfo) => void;
    width?: string;
}

export default function MicToggleDropdown({
    onMicToggle,
    onAudioInputChange,
    width = "20%",
}: MicToggleDropdownProps) {
    const [shouldShowDd, setShouldShowDd] = useState<boolean>(false);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selDevice, setSelDevice] = useState<string>("default");
    const [isMuted, setIsMuted] = useState<boolean>(false);

    const onGlobalClick = () => {
        if(shouldShowDd) setShouldShowDd(false);
    }

    const handleDropdownSelect = (dev: MediaDeviceInfo) => {
        setSelDevice(dev.deviceId)
        onAudioInputChange?.(dev);
    }

    const toggleMute = () => {
        onMicToggle?.(!isMuted);
        setIsMuted(!isMuted);
    }

    const populateDropdown = async () => {
        try {
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            let newDevices: MediaDeviceInfo[] = [];
            deviceList.forEach(dev => {
                if(dev.kind !== 'audioinput') return;
                newDevices.push(dev)
            })

            setDevices(newDevices);
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        document.addEventListener('click', onGlobalClick);

        return () => document.removeEventListener('click', onGlobalClick);
    }, [shouldShowDd])


    useEffect(() => {
        populateDropdown();
    }, []);

    return (
        <div className={styles.wrapper}
            style={{
                width: `min(80px, max(${width}, 50px))`,
                paddingBottom: `min(80px, max(${width}, 50px))`,
            }}
        >
            <button className={styles.muteButton}
            onClick={toggleMute}
            >
                {isMuted ?
                <img className={styles.muteIcon} 
                    src="/muted.ico"
                    alt="muted"
                />
                :
                <img className={styles.muteIcon}
                    src="/favicon.ico"
                    alt="open"
                />
                }
            </button>
            <div className={styles.dropdownToggle}
            onClick={() => setShouldShowDd(!shouldShowDd)}
            ></div>
            { shouldShowDd &&
            <div className={styles.dropdownWrapper}>
                {
                    devices.length === 0 ?
                    <div className={styles.dropdownItem}>No devices</div>
                    :
                    devices.map(dev => 
                    <div className={styles.dropdownItem}
                        data-selected={selDevice === dev.deviceId ? "true" : "false"}
                        onClick={() => handleDropdownSelect(dev)}
                        key={dev.deviceId}
                    >{dev.label}</div>
                    )
                }
            </div>
            }
        </div>
    )
}
