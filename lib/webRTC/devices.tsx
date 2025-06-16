import { Dispatch, SetStateAction } from "react";

export const getDevicesOfType = async (kind: MediaDeviceKind) => {
    try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        //let newDevices: MediaDeviceInfo[] = [];
        //deviceList.forEach(dev => {
        //    if(dev.kind !== kind) return;
        //    newDevices.push(dev)
        //})
        return deviceList.filter((device) => device.kind === kind);

    } catch(err) {
        console.error(err);
        return [];
    }
}

export const setDevicesOfType = async (kind: MediaDeviceKind, setDevices: Dispatch<SetStateAction<MediaDeviceInfo[]>>) => {
    try {
        setDevices(await getDevicesOfType(kind));
    } catch(err) {
        console.error(err);
        setDevices([]);
    }
}
