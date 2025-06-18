import { useEffect, useState } from 'react';
import ToggleDropdown from '../util/toggle-dropdown';
import { setDevicesOfType } from '@/lib/webRTC/devices';

interface MicToggleDropdownProps {
    onMicToggle?: (enabled: boolean) => Promise<void> | void;
    onAudioInputChange?: (dev: MediaDeviceInfo) => Promise<void> | void;
    width?: string;
}

export default function MicToggleDropdown({
    onMicToggle,
    onAudioInputChange,
    width = "20%",
}: MicToggleDropdownProps) {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        setDevicesOfType('audioinput', setDevices);
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
