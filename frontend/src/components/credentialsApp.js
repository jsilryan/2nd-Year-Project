import React from "react"
import SignupPage from "./signup"
import Navbar from "./navbar"
import { Link } from "react-router-dom"
import {
    BrowserRouter as Router, //Helps app use react router
    Routes, 
    Route 
} from "react-router-dom"
import PainterSignUp from "./painter_signup"
import ClientSignup from "./client_signup"
import Login from "./login"
import HomePage from "./home"
import SignedContracts from "./signedContracts"

export default function CredentialsApp() {

    const [homeNav, setHomeNav] = React.useState(true)
    const [cSignup, setCSignup] = React.useState(false) //Client Signup
    const [pSignup, setPSignup] = React.useState(false) //Painter Signup
    const [cpLogin, setCPLogin] = React.useState(false) //Client-Painter Login
    const [cpSignup, setCPSignup] = React.useState(false) //Client-Painter Signup


    function changeNav() {
        setHomeNav(!homeNav)
        setCPSignup(false)
        setCPLogin(false)
        setCSignup(false)
        setPSignup(false)
    }
    function navbarSignUp() {
        setHomeNav(!homeNav)
        setCPSignup(!cpSignup)
    }
    function navbarLogin() {
        setHomeNav(!homeNav)
        setCPLogin(!cpLogin)
    }
    function goToCPSignup() {
        setHomeNav(!homeNav)
        setCPSignup(!cpSignup)
    }

    function loginToSignup () {
        setCPLogin(!cpLogin)
        setCPSignup(!cpSignup)
    }

    function goToCSignup() {
        setCPSignup(!cpSignup)
        setCSignup(!cSignup)
    }

    function goToPSignup() {
        setCPSignup(!cpSignup)
        setPSignup(!pSignup)
    }

    function goToCPLogin() {
        setCPSignup(!cpSignup)
        setCPLogin(!cpLogin)
    }

    return (
        <Router>
            <div>
                <Navbar handleClick={changeNav} signup = {navbarSignUp} login = {navbarLogin} setNav = {homeNav}/> 
                {/*These are properties passed into the navbar component that toggle the states of the homeNav, cpSignup and cpLogin*/}
                {
                    (homeNav && !cpSignup && !cpLogin && !pSignup && !cSignup) &&
                    <HomePage handleClick={goToCPSignup} setNav = {homeNav}/> 
                }
                {
                    (!homeNav && !cpSignup && !cpLogin && !pSignup && cSignup) &&
                    <ClientSignup />
                }
                {
                    (!homeNav && !cpSignup && !cpLogin && pSignup && !cSignup) &&
                    <PainterSignUp />
                }
                {
                    (!homeNav && !cpSignup && cpLogin && !pSignup && !cSignup) &&
                    <Login handleClick={loginToSignup}/>
                }
                {
                    (!homeNav && cpSignup && !cpLogin && !pSignup && !cSignup) &&
                    <SignupPage clientSignup={goToCSignup} painterSignup = {goToPSignup} userLogin={goToCPLogin}/>
                }
            </div>
            <Routes>
                <Route path="/client-signup" element = {(!homeNav && !cpSignup && !cpLogin && !pSignup && !cSignup) && <ClientSignup />} />
                <Route path="/painter-signup" element = {(!homeNav && !cpSignup && !cpLogin && !pSignup && !cSignup) &&  <PainterSignUp />} />
                <Route path="/login" element = {(!homeNav && !cpSignup && !cpLogin && !pSignup && !cSignup) &&  <Login handleClick={loginToSignup}/>} />
                <Route path="/signup" element = {(!homeNav && !cpSignup && !cpLogin && !pSignup && !cSignup) && <SignupPage clientSignup={goToCSignup} painterSignup = {goToPSignup} userLogin={goToCPLogin}/>}/>
                <Route path="/home" element = {(!homeNav && !cpSignup && !cpLogin && !pSignup && !cSignup) &&  <HomePage handleClick={goToCPSignup} setNav = {homeNav}/> }/>
            </Routes>
        </Router>
    )
}