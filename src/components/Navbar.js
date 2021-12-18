import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import React from "react";

function Navbar() {
    return (
        <div className="navbar">
            <Link to="/">Home</Link>
            <Link to="/journal">Journal simulator</Link>
        </div>
    )
}

export default Navbar