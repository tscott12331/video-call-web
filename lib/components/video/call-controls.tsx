import styles from './call-controls.module.css';
import Slider from '../util/slider';
import Button from '../util/button';
import MicToggleDropdown from './mic-toggle-dropdown';

interface CallControlsProps {
    onAudioInputChange?: (dev: MediaDeviceInfo) => Promise<void> | void;
    onAudioOutputChange?: (dev: MediaDeviceInfo) => Promise<void> | void; // not entirely sure
    onVideoInputChange?: (dev: MediaDeviceInfo) => Promise<void> | void;
    onMicToggle?: (muted: boolean) => Promise<void> | void;
    visible?: boolean;
}

export default function CallControls(
    {
        onAudioInputChange,
        onMicToggle,
        visible = true,
        ...rest
    }: CallControlsProps & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={styles.callControls} 
        style={{
            visibility: visible ? 'visible' : 'hidden'
        }}
        {...rest}>
            <div className={styles.sliderWrapper}>
                <Slider />
            </div>
            <MicToggleDropdown 
            onAudioInputChange={(dev) => onAudioInputChange?.(dev)}
            onMicToggle={(muted) => onMicToggle?.(muted)}
            />
            <div className={styles.hangupWrapper}>
                <Button>
                    <img src='/favicon.ico' />
                </Button>
            </div>
        </div>
    )
}
