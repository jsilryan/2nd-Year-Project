import React from "react"
import Navbar from "./clientNavbar"
import Main from "./main"
import PMain from "../painter/painter-main"
import Sidebar from "./Sidebar"
import {
  BrowserRouter as Router, //Helps app use react router
  Routes, //Create links and attach them to components
  Route //Attach routes to the components
} from "react-router-dom"
import Proposal from "./proposals"
import Contracts from "./contracts"
import ConfirmedJobs from "./confirmed"
import CompletedJobs from "./completed"
import SelectedProposals from "./selectedProp"
import SignedContracts from "./signedContracts"
import PendingContracts from "./pendingContracts"

export default function ClientApp() {

  const [sidebar, setSidebar] = React.useState(false)
  const [dispMain, setDispMain] = React.useState(true)

  function showSidebar() {
    setSidebar(!sidebar)
    dispMain && setDispMain(!dispMain)
  }

  return (
    <Router>
      <div className="app-div"> 
        <Navbar sidebar = {sidebar} handleClick = {showSidebar}/>
        {
          dispMain && <Main sidebar = {sidebar}/>
        }
        <Routes>
          <Route path="/client/my-jobs" element = {!dispMain && <Main sidebar = {sidebar}/>} />
          <Route path="/client/my-jobs/all-jobs" element = {!dispMain && <Main sidebar = {sidebar}/>} />
          <Route path="/client/my-jobs/confirmed" element = {!dispMain && <ConfirmedJobs sidebar = {sidebar}/>} />
          <Route path="/client/my-jobs/completed" element = {!dispMain && <CompletedJobs sidebar = {sidebar}/>} />
          <Route path="/client/proposals" element = {!dispMain && <Proposal sidebar = {sidebar}/>} />
          <Route path="/client/proposals/all" element = {!dispMain && <Proposal sidebar = {sidebar}/>} />
          <Route path="/client/proposals/selected" element = {!dispMain && <SelectedProposals sidebar = {sidebar}/>} />
          <Route path="/client/contracts" element = {!dispMain && <Contracts sidebar = {sidebar}/>} />
          <Route path="/client/contracts/signed" element = {!dispMain && <SignedContracts sidebar = {sidebar}/>} />
          <Route path="/client/contracts/pending" element = {!dispMain && <PendingContracts sidebar = {sidebar}/>} />
        </Routes>
        
      </div>
    </Router>
  )
}