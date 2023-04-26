import React from "react"
import { Link } from "react-router-dom"

export default function HomePage(props) {
    return (
        <div className="empty-home">
            <h1>Welcome to MaRangi!</h1>
            <h2>Your hub to get painters around your locality with ease.</h2>
            <Link to="/signup" className="home-link2" onClick={props.setNav && props.handleClick}>Get Started</Link>
        </div>
    )
}