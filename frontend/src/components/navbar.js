import React from "react"
import {Link} from "react-router-dom"
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"
import * as RiIcons from "react-icons/ri"
import * as GrIcons from "react-icons/gr"
import * as GiIcons from "react-icons/gi"

export default function Navbar(props) {
    return (
        <nav className="nav">            
            <div className="nav-logo">
                <div className="img">
                    <Link to="/home" onClick={!props.setNav && props.handleClick}><img src = {require("../images/logo.png")} width = "90px" /></Link>
                    <h2>MaRangi</h2>
                </div>
            </div>
            {props.setNav && 
            <div>
                <Link to="/login" className="check-jobs" onClick={props.handleClick}>Login</Link>
                <Link to="/signup" className="check-jobs" onClick={props.handleClick}>Sign Up</Link>
            </div>}
        </nav>
    
    )
}