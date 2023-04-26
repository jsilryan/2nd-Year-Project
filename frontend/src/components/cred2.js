import React from "react"
import SignupPage from "./signup"
import Navbar from "./navbar"
import ClientNavbar from "../client/clientNavbar"
import { Link } from "react-router-dom"
import { useLocation } from 'react-router-dom'
import {
    BrowserRouter as Router, //Helps app use react router
    Routes, //Create links and attach them to components
    Route //Attach routes to the components
  } from "react-router-dom"  
import PainterSignUp from "./painter_signup"
import ClientSignup from "./client_signup"
import Login from "./login"
import HomePage from "./home"
import ClientApp from "../client/clientApp"
import Proposal from "../client/proposals"
import Contracts from "../client/contracts"
import ConfirmedJobs from "../client/confirmed"
import CompletedJobs from "../client/completed"
import SelectedProposals from "../client/selectedProp"
import SignedContracts from "../client/signedContracts"
import PendingContracts from "../client/pendingContracts"
import Main from "../client/main"
import PainterNav from "../painter/painterNavbar"
import PainterMain from "../painter/painter-main"
import SpecificJob from "../client/specificJob"
import CreateJob from "../client/createJob"

export default function CredentialsApp2() {

    const [homeNav, setHomeNav] = React.useState(true)

    const [sidebar, setSidebar] = React.useState(false)
    const [dispMain, setDispMain] = React.useState(true)

    const [userNavig, setUserNavig] = React.useState(false) //Does same purpose as useAuth from ../auth

    const [getUser, setGetUser] = React.useState("")

    function getPainter() {
        setGetUser("Painter")
    }
    function getClient() {
        setGetUser("Client")
        console.log(getUser)
    }
    function emptyUser() {
        setGetUser("")
    }
  
    function showSidebar() {
      setSidebar(!sidebar)
      dispMain && setDispMain(!dispMain)
    }

    function goToLogin() {
        showSidebar()
        userNav()
        emptyUser()
    }
    
    function userNav(){
        setUserNavig(!userNavig)
    }

    function changeNav() {
        setHomeNav(!homeNav)
    }

    return (
        <Router>
            <div>
                {   !userNavig ?
                    <div>
                        <Navbar handleClick={changeNav} setNav = {homeNav}/> 
                        {
                            (homeNav) &&
                            <HomePage handleClick={changeNav} setNav = {homeNav}/> 
                        }
                        <Routes>
                            <Route path="/client-signup" element = { <ClientSignup handleClick = {userNav} switchClient = {getClient} userNavig = {userNavig}/>} />
                            <Route path="/painter-signup" element = { <PainterSignUp handleClick = {userNav} switchPainter = {getPainter} userNavig = {userNavig}/>} />
                            <Route path="/login" element = { <Login handleClick = {userNav} switchClient = {getClient} switchPainter = {getPainter} userNavig = {userNavig}/>} />
                            <Route path="/signup" element = {<SignupPage />}/>
                            <Route path="/home" element = {(!homeNav) &&<HomePage handleClick={changeNav} setNav = {homeNav}/> }/>
                            <Route path="/client/my-jobs" element = {!dispMain && <Main sidebar = {sidebar}/>} />
                            <Route path="/painter/my-jobs" element = {!dispMain && <PainterMain sidebar = {sidebar}/>} />
                        </Routes>
                    </div> :
                    <div className="app-div">
                        {!userNavig ?
                        <Navbar handleClick={changeNav} setNav = {homeNav}/> :
                        getUser === "Client" ?
                        <ClientNavbar sidebar = {sidebar} handleClick = {showSidebar} goToLogin = {goToLogin} getPage = {userNavig} /> :
                        <PainterNav sidebar = {sidebar} handleClick = {showSidebar} goToLogin = {goToLogin} getPage = {userNavig}/>}
                        {
                            getUser === "Client" ?
                            dispMain && <Main sidebar = {sidebar}/> :
                            dispMain && <PainterMain sidebar = {sidebar}/>
                        }
                        <Routes>
                            <Route path="/login" element = { <Login handleClick = {userNav} switchClient = {getClient} switchPainter = {getPainter} userNavig = {userNavig}/> } />
                            <Route path="/client/my-jobs" element = {!dispMain && <Main sidebar = {sidebar} />} />
                            <Route path="/client/my-jobs/all-jobs" element = {!dispMain && <Main sidebar = {sidebar} />} />
                            <Route path="/client/my-jobs/confirmed" element = {!dispMain && <ConfirmedJobs sidebar = {sidebar}/>} />
                            <Route path="/client/my-jobs/completed" element = {!dispMain && <CompletedJobs sidebar = {sidebar}/>} />
                            <Route path="/client/proposals" element = {!dispMain && <Proposal sidebar = {sidebar}/>} />
                            <Route path="/client/proposals/all" element = {!dispMain && <Proposal sidebar = {sidebar}/>} />
                            <Route path="/client/proposals/selected" element = {!dispMain && <SelectedProposals sidebar = {sidebar}/>} />
                            <Route path="/client/contracts" element = {!dispMain && <Contracts sidebar = {sidebar}/>} />
                            <Route path="/client/contracts/signed" element = {!dispMain && <SignedContracts sidebar = {sidebar}/>} />
                            <Route path="/client/contracts/pending" element = {!dispMain && <PendingContracts sidebar = {sidebar}/>} />
                            <Route path="/signup" element = {<SignupPage />}/>  
                            <Route path="/painter/my-jobs" element = {!dispMain && <PainterMain sidebar = {sidebar}/>} />
                            <Route path="/client/create-job" element= {<CreateJob sidebar = {sidebar}/>} />
                        </Routes>
                    </div>
                }

            </div>

        </Router>
    )
}