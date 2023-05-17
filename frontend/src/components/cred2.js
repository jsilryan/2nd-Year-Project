import React from "react"
import SignupPage from "./signup"
import Navbar from "./navbar"
import ClientNavbar from "../client/clientNavbar"
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
import SelectedProposals from "./selectedProposals"
import PendingContracts from "./pendingContracts"
import Main from "../client/main"
import PainterNav from "../painter/painterNavbar"
import PainterMain from "../painter/painter-main"
import CreateJob from "../client/createJob"
import AllProposals from "./allProposals"
import SignedContracts from "./signedContracts"
import RatePainter from "../client/ratePainter"
import PainterProfile from "../painter/painterProfile"
import ClientProfile from "../client/clientProfile"

export default function CredentialsApp2() {
    const [locality, setLocality] = React.useState(window.location.href)

    console.log(locality)

    React.useEffect(
        () => {
            setLocality(window.location.href)
            if (locality !== "http://localhost:3000/home" && homeNav) {
                setHomeNav(false)
            } 
            else {
                setHomeNav(true)
            }
            if (!userNavig) {
                if (
                    locality !== "http://localhost:3000/home" || locality !== "http://localhost:3000/signup" ||
                    locality !== "http://localhost:3000/login" || locality !== "http://localhost:3000/client-signup" ||
                    locality !== "http://localhost:3000/painter-signup"
                ) 
                {
                    setHomeNav(true)
                }    
            }
            else {
                if (
                    locality !== "http://localhost:3000/home" || locality !== "http://localhost:3000/signup" ||
                    locality !== "http://localhost:3000/login" || locality !== "http://localhost:3000/client-signup" ||
                    locality !== "http://localhost:3000/painter-signup"
                ) 
                {
                    setHomeNav(false)
                }    
            }

        }, [locality]
    )

    const [homeNav, setHomeNav] = React.useState(true)

    const [sidebar, setSidebar] = React.useState(false)
    const [dispMain, setDispMain] = React.useState(true)

    const [userNavig, setUserNavig] = React.useState(false) //Does same purpose as useAuth from ../auth

    const [getUser, setGetUser] = React.useState("")

    const [createJobs, setCreateJobs] = React.useState(false)

    function createJobsOn() {
        setCreateJobs(true)
    }

    function createJobsOff(){
        setCreateJobs(false)
    }

    function getPainter() {
        setGetUser("Painter")
    }
    function getClient() {
        setGetUser("Client")
    }
    function emptyUser() {
        console.log(getUser)
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

    const [ratedJob, setRatedJob] = React.useState("")
    function getRatedJob(jsc) {
        setRatedJob(jsc)
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
                            <Route path="/signup" element = {<SignupPage handleClick = {userNav} userNavig = {userNavig}/>}/>
                            <Route path="/home" element = {(!homeNav) &&<HomePage handleClick={changeNav} setNav = {homeNav}/> }/>
                            {/*<Route path="/painter/my-jobs/confirmed" element = {!dispMain && <ConfirmedJobs sidebar = {sidebar} getUser = {getUser}/>}/>
                            <Route path="/client/my-jobs" element = {!dispMain && <Main sidebar = {sidebar} getUser = {getUser}/>} />
                            <Route path="/painter/bid-jobs" element = {!dispMain && <PainterMain sidebar = {sidebar} getUser = {getUser}/>} /> */}
                        </Routes>
                    </div> 
                    :
                    <div className="app-div">
                        {!userNavig ?
                        <Navbar handleClick={changeNav} setNav = {homeNav}/> :
                        getUser === "Client" ?
                        <ClientNavbar sidebar = {sidebar} handleClick = {showSidebar} goToLogin = {goToLogin} getPage = {userNavig} jobsOn={createJobsOn}/> :
                        <PainterNav sidebar = {sidebar} handleClick = {showSidebar} goToLogin = {goToLogin} getPage = {userNavig}/>}
                        {
                            getUser === "Client" ?
                            dispMain && !createJobs && <Main sidebar = {sidebar} getUser = {getUser} jobsOn={createJobsOn}/> :
                            dispMain && <PainterMain sidebar = {sidebar} getUser = {getUser} />
                        }
                        <Routes>
                            <Route path="/client/my-jobs" element = {!dispMain && !createJobs && <Main sidebar = {sidebar} getUser = {getUser} jobsOn={createJobsOn} getRatedJob = {getRatedJob}/> } />
                            <Route path="/client/my-jobs/ongoing" element = {!dispMain && <ConfirmedJobs sidebar = {sidebar} getUser = {getUser} getRatedJob = {getRatedJob}/>} />
                            <Route path="/client/my-jobs/completed" element = {!dispMain && <CompletedJobs sidebar = {sidebar} getUser = {getUser}/>} />
                            <Route path="/client/proposals" element = {!dispMain && <Proposal sidebar = {sidebar} getUser = {getUser}/>} />
                            <Route path="/client/proposals/selected" element = {!dispMain && <SelectedProposals sidebar = {sidebar} getUser = {getUser}/>} />
                            <Route path="/client/contracts/signed" element = {!dispMain && <SignedContracts sidebar = {sidebar} getUser = {getUser}/>} />
                            <Route path="/client/contracts/pending" element = {!dispMain && <PendingContracts sidebar = {sidebar} getUser = {getUser}/>} />
                            <Route path="/signup" element = {<SignupPage />}/>  
                            <Route path="/painter/bid-jobs" element = {!dispMain && <PainterMain sidebar = {sidebar} getUser = {getUser}/>} />
                            <Route path="/client/create-job" element= {createJobs && <CreateJob sidebar = {sidebar} jobsOff = {createJobsOff}/>} />
                            <Route path="/painter/proposals" element = {!dispMain && <AllProposals sidebar = {sidebar} user = {getUser}/>}/>
                            <Route path="/painter/proposals/selected" element = {!dispMain && <SelectedProposals sidebar = {sidebar} getUser = {getUser}/>} />
                            <Route path="/painter/contracts/pending" element = {!dispMain && <PendingContracts sidebar = {sidebar} getUser = {getUser}/>} />
                            <Route path="/painter/contracts/signed" element={!dispMain && <SignedContracts sidebar = {sidebar} getUser = {getUser}/>}/>
                            <Route path="/painter/my-jobs/ongoing" element = {!dispMain && <ConfirmedJobs sidebar = {sidebar} getUser = {getUser}/>}/>
                            <Route path="/painter/my-jobs/completed" element = {!dispMain && <CompletedJobs sidebar = {sidebar} getUser = {getUser}/>}/>
                            <Route path="/ratings" element = {!dispMain && <RatePainter sidebar = {sidebar} ratedJob = {ratedJob}/>} />
                            <Route path="/painter/portfolio" element = {!dispMain && <PainterProfile sidebar = {sidebar}/>} />
                            <Route path="/client/profile" element = {!dispMain && <ClientProfile sidebar = {sidebar}/>} />
                        </Routes>
                    </div>
                }

            </div>

        </Router>
    )
}