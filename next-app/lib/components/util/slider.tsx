import styles from './slider.module.css';
import { useRef, useState } from 'react';

interface SliderProps {
    iconSrc?: string;
    onSliderChange?: (percent: number) => void;
}
export default function Slider({
    iconSrc,
    onSliderChange,
}: SliderProps) {
    const [percent, setPercent] = useState<number>(0);
    const [dragging, setDragging] = useState<boolean>(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const sliderHandleRef = useRef<HTMLDivElement>(null);

    const onSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if(e.type === 'mousedown') {
            setDragging(true);
        } else if (e.type === 'mouseup') {
            setDragging(false);
        } else if(e.type === 'mousemove' && !dragging) {
            return;
        }
        if(!sliderRef.current || !sliderHandleRef.current) return;

        const { width, left } = sliderRef.current.getBoundingClientRect();
        const { clientX } = e;
        const handleWidth = sliderHandleRef.current.clientWidth;

        let p = (clientX - left - (handleWidth / 2)) / (width - handleWidth);
        if(p > 1) p = 1;
        if(p < 0) p = 0;
        if(onSliderChange) onSliderChange(p);
        setPercent(p);
    }

    return (
        <div className={styles.sliderWrapper}
            onMouseDown={onSliderMouseDown}
            onMouseMove={onSliderMouseDown}
            onMouseUp={onSliderMouseDown}
            ref={sliderRef}
        >
            {iconSrc && <img className={styles.sliderIcon} src={iconSrc}/>}
            <div className={styles.sliderBar}>
                <div className={styles.sliderProgress}
                style={{
                    width: sliderRef.current && sliderHandleRef.current ?
                        `${Math.floor(percent * (sliderRef.current.clientWidth - sliderHandleRef.current.clientWidth) +
                                     + sliderHandleRef.current.clientWidth / 2)}px`
                            : `0%`,
                }}
                ></div>
                <div className={styles.sliderHandle}
                    style={{
                        left: sliderRef.current && sliderHandleRef.current ?
                            `${Math.floor(percent * (sliderRef.current.clientWidth - sliderHandleRef.current.clientWidth))}px`
                            : `0%`,
                    }}
                    ref={sliderHandleRef}
                ></div>
            </div>
        </div>
    )
}
