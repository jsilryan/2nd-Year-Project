import React from "react"
import {Link} from "react-router-dom"
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"
import * as RiIcons from "react-icons/ri"
import * as GrIcons from "react-icons/gr"
import * as GiIcons from "react-icons/gi"
import Sidebar from "./Sidebar"

export default function ClientNavbar(props) {
    return (
        <nav className="nav">
            <div className="nav-logo">
                <Sidebar handleClick = {props.handleClick} sidebar = {props.sidebar} goToLogin = {props.goToLogin} getPage = {props.getPage}/>
                <div className="img">
                    <img src = {require("../images/logo.png")} width = "60px" />
                    <h2>MaRangi</h2>
                </div>
            </div>
            <Link to="/client/create-job" className="check-jobs"><h4>Create a Job</h4></Link>
        </nav>
    )
}