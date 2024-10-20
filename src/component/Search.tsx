"use client"

import { useState } from "react";

const Search = () => {
    const [isSelect, setIsSelect] = useState();
    return (
        <select className="p-2 border rounded">
            <option value="">All Types</option>
        </select>
    )
}

export default Search;
