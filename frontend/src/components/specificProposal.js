import React from "react"
import * as AiIcons from "react-icons/ai"
import SpecificJob from "./specificJob"
import UpdateProposal from "../painter/updateProposal"
import DeleteProposal from "../painter/deleteProposal"
import SelectProposal from "../client/selectProposal"
import CreateContract from "../client/createContract"

export default function SpecificProposal(props) {
    const [proposal, setProposal] = React.useState()
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const requestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }

    let link = "/proposal/proposals/"
    let code = props.psc
    let url = link + code
    console.log(url)
    let message

    const [refreshProposal, setRefreshProposal] = React.useState(false)

    function refProposalOn() {
        setRefreshProposal(true)
    }

    function refProposalOff() {
        setRefreshProposal(false)
    }

    React.useEffect (
        () => {
            fetch(url, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setProposal(data)
                })
                .catch(err => console.log(err))

            if (refreshProposal === true) {
                refProposalOff()
            }
            
        }, [refreshProposal]
    )

    const selected = proposal && proposal.proposal_selection
    const confirmed = proposal && proposal.proposal_confirmed

    let bgcolor = selected ? "green" : "red"
    let bgcolor1 = confirmed ? "green" : "red"

    const conf_styles = {
        backgroundColor : bgcolor,
        color : "white"
    }
    
    const comp_styles = {
        backgroundColor : bgcolor1,
        color : "white"
    }

    const location = "proposal"
    const [showJob, setShowJob] = React.useState(false)
    const [jobShortCode, setJShortCode] = React.useState("")
    const [showContract, setShowContract] = React.useState(false)

    function dispContract(jsc) {
        setShowContract(true)
        setJShortCode(jsc)
    }

    function hideContract() {
        setShowContract(false)
        setJShortCode()
    }

    function showMod(){
        setShowJob(true)
        props.showModal()
    }
    function closeModal() {
        props.closeModal(false)
        setShowJob(false)
    }

    function dispJob(jsc) {
        setShowJob(true)
        setJShortCode(jsc)
        console.log(props.user, props.sidebar)
    }

    function hideJob() {
        setShowJob(false)
        setJShortCode()
        
    }

    const [onDelete, setOnDelete] = React.useState(false)

    function openDelete() {
        setOnDelete(true)
    }

    function closeDelete() {
        setOnDelete(false)
    }

    const [onSelect, setOnSelect] = React.useState(false)

    function openSelect() {
        setOnSelect(true)
    }

    function closeSelect() {
        setOnSelect(false)
    }

    const jobStyle = (!onDelete && !onSelect) ? "job" : "job-opaque"

    return (
        <div>
        {
        !showJob && !showContract ?
        <div className="show-update">
            <div className={jobStyle}>
                <div className="side">
                    <AiIcons.AiOutlineClose className="close" onClick ={props.closeProposal}/>
                    {
                    props.user === "Painter" ? 
                    <div className="updateJob">
                        <div className="delete">
                            <button onClick = {showMod} className="home-link2">Update Proposal</button>
                        </div>
                        <div className="delete">
                            <button onClick = {openDelete} className="home-link2">Delete Proposal</button>
                        </div>
                        <div className="delete" onClick={() => dispJob(proposal.job_short_code)}>
                            <button className="home-link2">Job Details</button>
                        </div>
                    </div>
                    :
                    <div className="updateJob">
                        {
                        !selected ?
                        <div className="delete">
                            <button onClick = {openSelect} className="home-link2">Select Proposal</button>
                        </div>
                        :
                        <div>
                            <div className="delete" onClick={() => dispContract(proposal.job_short_code)}>
                                <button className="home-link2">Create Contract</button>
                            </div>
                            <div className="delete">
                                <button onClick = {openSelect} className="home-link2">Deselect Proposal</button>
                            </div>
                            {
                                props.location && props.location === "selectedProposal" &&
                                <div className="delete" onClick={() => dispJob(proposal.job_short_code)}>
                                    <button className="home-link2">Job Details</button>
                                </div>
                            }
                        </div>
                        }
                        {
                        !props.location &&
                        <div className="delete">
                            <button className="home-link2">Painter Profile</button>
                        </div>
                        }
                    </div>

                    }
                </div>
                {
                proposal &&
                <div className='job_display'>
                    <div className="header">
                        <h2>Proposal Details</h2>
                    </div>
                    <div className='job_interior'>
                        <div className="job-details">
                            <div className="job-info">
                                <h3>Proposal Name: </h3>
                                <p>{proposal.proposal_name}</p>
                            </div>
                            <div className="job-info">
                                <h3>Proposal Description: </h3>
                                <p>{proposal.proposal_description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="page-link">
                        <h4 className="conf" style={conf_styles}>Selected</h4>
                        <h4 className="comp" style={comp_styles}>Confirmed</h4>
                    </div> 
                </div>
                }
                {
                    onSelect &&
                    <SelectProposal code = {code} back = {closeSelect} token = {token} handleClick = {props.closeProposal}
                        onRefresh = {props.onRefresh} selected = {selected}
                    />
                }
                {
                    onDelete &&
                    <DeleteProposal code = {code} back = {closeDelete} token = {token} handleClick = {props.closeProposal} 
                        onRefresh = {props.onRefresh} 
                    />
                }
            </div>
        </div>
        :
        showContract ?
        <CreateContract handleClick = {hideContract} jsc = {jobShortCode}/> 
        :
        props.openModal ?
        <UpdateProposal closeModal = {closeModal} onProposalRefresh ={refProposalOn} code = {code} proposal = {proposal} onRefresh = {props.onRefresh}/> 
        :
        <SpecificJob handleClick={hideJob} jsc={jobShortCode} user = {props.user} location = {location}/>
        }
        </div>
    )
}