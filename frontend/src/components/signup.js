import React from "react"
import { Link } from "react-router-dom"

export default function SignupPage(props) {
    return (
        <div className="home">
            <div className="empty-home">
                <h1>Join as a Client or a Painter</h1>
                <div className="page-link">
                    <Link className="home-link1" to="/client-signup" onClick={props.clientSignup}>Join as Client</Link>
                    <Link className="home-link2" to="/painter-signup" onClick={props.painterSignup}>Join as Painter</Link>
                </div>
                <div>
                    <h3>Already have an account? <Link to="/login"className="login-link" onClick={props.userLogin}>Login</Link></h3>
                </div>
            </div>
        </div>
    )
}