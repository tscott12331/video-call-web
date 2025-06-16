import styles from './call-controls.module.css';
import Slider from '../util/slider';
import Button from '../util/button';
import MicToggleDropdown from './mic-toggle-dropdown';
import VideoToggleDropdown from './video-toggle-dropdown';

interface CallControlsProps {
    onAudioInputChange?: (dev: MediaDeviceInfo) => Promise<void> | void;
    onAudioOutputChange?: (dev: MediaDeviceInfo) => Promise<void> | void; // not entirely sure
    onVideoInputChange?: (dev: MediaDeviceInfo) => Promise<void> | void;
    onVideoToggle?: (enabled: boolean) => Promise<void> | void;
    onMicToggle?: (enabled: boolean) => Promise<void> | void;
    visible?: boolean;
}

export default function CallControls(
    {
        onAudioInputChange,
        onVideoInputChange,
        onVideoToggle,
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
            <div className={styles.toggleDropdownsWrapper}>
                <MicToggleDropdown 
                    onAudioInputChange={(dev) => onAudioInputChange?.(dev)}
                    onMicToggle={(enabled) => onMicToggle?.(enabled)}
                    width="50%"
                />
                <VideoToggleDropdown
                    width="50%"
                    onVideoInputChange={(dev) => onVideoInputChange?.(dev)}
                    onVideoToggle={(enabled) => onVideoToggle?.(enabled)}
                />
            </div>
            <div className={styles.hangupWrapper}>
                <Button>
                    <img src='/favicon.ico' />
                </Button>
            </div>
        </div>
    )
}
