import { useEffect, useState } from 'react';
import ToggleDropdown from '../util/toggle-dropdown';
import { setDevicesOfType } from '@/lib/webRTC/devices';

interface VideoToggleDropdownProps {
    onVideoToggle?: (enabled: boolean) => Promise<void> | void;
    onVideoInputChange?: (dev: MediaDeviceInfo) => Promise<void> | void;
    width?: string;
}

export default function VideoToggleDropdown({
    onVideoToggle,
    onVideoInputChange,
    width = "20%",
}: VideoToggleDropdownProps) {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        setDevicesOfType('videoinput', setDevices);
    }, [])
    return (
        <ToggleDropdown<MediaDeviceInfo>
            width={width}
            onToggle={onVideoToggle}
            onSelect={onVideoInputChange}
            toString={(dev: MediaDeviceInfo) => dev.label}
            toId={(dev: MediaDeviceInfo) => dev.deviceId}
            initialSelectId="default"
            items={devices}
        />
    );
}
