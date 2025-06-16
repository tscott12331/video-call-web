import styles from './call-controls.module.css';
import Slider from '../util/slider';
import Button from '../util/button';
import MicToggleDropdown from './mic-toggle-dropdown';

interface CallControlsProps {
    onAudioInputChange?: (dev: MediaDeviceInfo) => void;
    onAudioOutputChange?: (dev: MediaDeviceInfo) => void; // not entirely sure
    onVideoInputChange?: (dev: MediaDeviceInfo) => void;
    visible?: boolean;
}

export default function CallControls(
    {
        onAudioInputChange,
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
            />
            <div className={styles.hangupWrapper}>
                <Button>
                    <img src='/favicon.ico' />
                </Button>
            </div>
        </div>
    )
}
