import React from "react";

interface SearchBarProps {
    searchText: string;
    styleClass?: string;
    placeholderText?: string;
    setSearchText: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
                                                 searchText,
                                                 styleClass,
                                                 placeholderText,
                                                 setSearchText,
                                             }) => {
    const updateSearchInput = (value: string) => {
        setSearchText(value);
    };

    return (
        <div className={"inline-block " + styleClass}>
            <div className="input-group relative flex w-full flex-wrap items-stretch">
                <input
                    type="search"
                    value={searchText}
                    placeholder={placeholderText || "Search"}
                    onChange={(e) => updateSearchInput(e.target.value)}
                    className="input input-sm input-bordered w-full max-w-xs"
                />
            </div>
        </div>
    );
};

export default SearchBar;