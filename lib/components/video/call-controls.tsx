import styles from './call-controls.module.css';
import Slider from '../util/slider';
import Button from '../util/button';
import MicToggleDropdown from './mic-toggle-dropdown';

interface CallControlsProps {
    visible?: boolean;
}

export default function CallControls(
    {
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
            <MicToggleDropdown />
            <div className={styles.hangupWrapper}>
                <Button>
                    <img src='/favicon.ico' />
                </Button>
            </div>
        </div>
    )
}
