import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="flex items-center">
            <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:border-blue-500"
                value={searchTerm}
                onChange={handleChange}
            />
            <button
                className="px-4 py-2 shadow-md bg-green-600 hover:bg-teal-700 text-white rounded-r-md hover:bg-green-600 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:scale-110 hover:shadow-xl"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
