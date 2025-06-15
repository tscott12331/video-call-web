import { useEffect, useState } from 'react';
import styles from './mic-toggle-dropdown.module.css';

interface MicToggleDropdownProps {
    width?: string;
    onDeviceSelect?: (dev: device) => void;
}

type device = {
    id: string;
    name: string;
}

export default function MicToggleDropdown({
    width = "20%",
    onDeviceSelect,
}: MicToggleDropdownProps) {
    const [shouldShowDd, setShouldShowDd] = useState<boolean>(false);
    const [devices, setDevices] = useState<device[]>([]);
    const [selDevice, setSelDevice] = useState<string>("default");
    const [isMuted, setIsMuted] = useState<boolean>(false);

    const onGlobalClick = () => {
        if(shouldShowDd) setShouldShowDd(false);
    }

    const handleDropdownSelect = (dev: device) => {
        setSelDevice(dev.id)
        if(onDeviceSelect) onDeviceSelect(dev);
    }

    useEffect(() => {
        document.addEventListener('click', onGlobalClick);

        return () => document.removeEventListener('click', onGlobalClick);
    }, [shouldShowDd])

    return (
        <div className={styles.wrapper}
            style={{
                width: `min(80px, max(${width}, 50px))`,
                paddingBottom: `min(80px, max(${width}, 50px))`,
            }}
        >
            <button className={styles.muteButton}
            onClick={() => setIsMuted(!isMuted)}
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
                        data-selected={selDevice === dev.id ? "true" : "false"}
                        onClick={() => handleDropdownSelect(dev)}
                        key={dev.id}
                    >{dev.name}</div>
                    )
                }
            </div>
            }
        </div>
    )
}
