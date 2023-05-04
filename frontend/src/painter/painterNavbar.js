import React from "react"
import PainterSidebar from "./painterSidebar"
import { Link } from "react-router-dom"

export default function PainterNav(props) {
    return (
        <nav className="nav">
            <div className="nav-logo">
                <PainterSidebar handleClick = {props.handleClick} sidebar = {props.sidebar} goToLogin = {props.goToLogin} getPage = {props.getPage}/>
                <div className="img">
                    <img src = {require("../images/logo.png")} width = "60px" />
                    <h2>MaRangi</h2>
                </div>
            </div>
            <Link to="/painter/my-jobs/ongoing" className="check-jobs"><h4>My jobs</h4></Link>
        </nav>
    )
}