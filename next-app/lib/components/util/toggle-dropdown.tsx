import { useEffect, useState } from 'react';
import styles from './toggle-dropdown.module.css';

interface ToggleDropdownProps<T> {
    onToggle?: (state: boolean) => Promise<void> | void;
    onSelect?: (item: T) => Promise<void> | void;
    toString: (item: T) => string;
    toId: (item: T) => string | number;
    initialSelectId: string;
    width?: string;
    items: T[];
    toggleOnRender?: React.ReactNode;
    toggleOffRender?: React.ReactNode;
}

export default function ToggleDropdown<T>({
    onToggle,
    onSelect,
    toString,
    toId,
    initialSelectId,
    toggleOnRender,
    toggleOffRender,
    width = "20%",
    items,
}: ToggleDropdownProps<T>) {
    const [shouldShowDd, setShouldShowDd] = useState<boolean>(false);
    const [selItem, setSelItem] = useState<string|number>(initialSelectId);
    const [isEnabled, setIsEnabled] = useState<boolean>(true);

    const onGlobalClick = () => {
        if(shouldShowDd) setShouldShowDd(false);
    }

    const handleDropdownSelect = (item: T) => {
        setSelItem(toId(item));
        onSelect?.(item);
    }

    const toggle = () => {
        onToggle?.(!isEnabled);
        setIsEnabled(!isEnabled);
    }

    useEffect(() => {
        document.addEventListener('click', onGlobalClick);

        return () => document.removeEventListener('click', onGlobalClick);
    }, [shouldShowDd])

    useEffect(() => {
        if(items.length === 0 || selItem !== initialSelectId) return;
        if(!items.find((item) => toId(item) === initialSelectId)) {
            setSelItem(toId(items[0]));
        }
    }, [items])

    return (
        <div className={styles.wrapper}
            style={{
                width: `min(80px, max(${width}, 50px))`,
                paddingBottom: `min(80px, max(${width}, 50px))`,
            }}
        >
            <button className={styles.toggleButton}
            onClick={toggle}
            >
                {isEnabled ?
                    toggleOnRender ?? "on"
                :
                    toggleOffRender ?? "off"
                }
            </button>
            <div className={styles.dropdownToggle}
            onClick={() => setShouldShowDd(!shouldShowDd)}
            ></div>
            { shouldShowDd &&
            <div className={styles.dropdownWrapper}>
                {
                    items.length === 0 ?
                    <div className={styles.dropdownItem}>No items</div>
                    :
                    items.map(item => 
                    <div className={styles.dropdownItem}
                        data-selected={selItem === toId(item) ? "true" : "false"}
                        onClick={() => handleDropdownSelect(item)}
                        key={toId(item)}
                    >{toString(item)}</div>
                    )
                }
            </div>
            }
        </div>
    )
}
