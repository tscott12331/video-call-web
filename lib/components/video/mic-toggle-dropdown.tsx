import { useEffect, useState } from 'react';
import ToggleDropdown from '../util/toggle-dropdown';

interface MicToggleDropdownProps {
    onMicToggle?: (muted: boolean) => Promise<void> | void;
    onAudioInputChange?: (dev: MediaDeviceInfo) => Promise<void> | void;
    width?: string;
}

export default function MicToggleDropdown({
    onMicToggle,
    onAudioInputChange,
    width = "20%",
}: MicToggleDropdownProps) {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

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
        populateDropdown();
    }, [])
    return (
        <ToggleDropdown<MediaDeviceInfo>
            width={width}
            onToggle={onMicToggle}
            onSelect={onAudioInputChange}
            toString={(dev: MediaDeviceInfo) => dev.label}
            toId={(dev: MediaDeviceInfo) => dev.deviceId}
            initialSelectId="default"
            items={devices}
        />
    );
}
