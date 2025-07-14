import { useState } from "react";
import Button from "./button";
import styles from './search-bar.module.css';

interface SearchBarProps {
    onSearch?: (phrase: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    onSearch,
    placeholder = 'search',
    ...rest
}: SearchBarProps & React.HTMLAttributes<HTMLDivElement>) {
    const [searchPhrase, setSearchPhrase] = useState<string>('');
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchPhrase(e.target.value);
    }

    const handleSearchKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = () => {
        const trimmedPhrase = searchPhrase.trim();
        if(trimmedPhrase.length === 0) return;
        onSearch?.(trimmedPhrase);
    }
    return (
        <div 
        className={styles.searchWrapper}
        {...rest}
        >
            <input placeholder={placeholder}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeydown}
            />
            <Button
                onClick={handleSearch}
            >
                <img src='/search-symbol.svg' />
            </Button>
        </div>
    )
}
