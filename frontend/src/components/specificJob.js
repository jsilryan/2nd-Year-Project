import React from "react"
import * as AiIcons from "react-icons/ai"
import UpdateJob from "../client/updateJob"
import DeleteJob from "../client/deleteJob"
import { Link } from "react-router-dom"
import CreateProposal from "../painter/createProposal"

export default function SpecificJob(props) {
    const [job, setJob] = React.useState(null)
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const requestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    const refreshRequestOptions = {
        method: "POST",
        headers: {
            'Authorization' : `Bearer ${token}`
        }
      }
    let link = "/job/job/"
    let code = props.jsc
    let url = link + code
    let message
    
    const [refreshJob, setRefreshJob] = React.useState(false)

    function refJobOn() {
        setRefreshJob(true)
    }

    function refJobOff() {
        setRefreshJob(false)
    }
    React.useEffect (
        () => {
            fetch(url, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setJob(data)
                })
                .catch(err => console.log(err))

            if (refreshJob === true) {
                refJobOff()
            }
        }, [refreshJob]
    )
    
    const Prop_Location = job && job.property_location
    const Property_Type = job && job.property_type
    const Job_Type = job && job.job_type
    const confirmed = job && job.job_confirmed
    const completed = job && job.job_completed
    
    let bgcolor = confirmed ? "green" : "red"
    let bgcolor1 = completed ? "green" : "red"

    const conf_styles = {
        backgroundColor : bgcolor,
        color : "white"
    }
    
    const comp_styles = {
        backgroundColor : bgcolor1,
        color : "white"
    }

    function showMod(){
        console.log(job)
        props.showModal()
    }

    const propLoc = job && Prop_Location ? Prop_Location.replace("Prop_Location.", "") : ''
    const propType = job && Property_Type ? Property_Type.replace("Property_Type.", "") : ''
    const jobType = job && Job_Type ? Job_Type.replace("Job_Type.", "") : ''

    const [onDelete, setOnDelete] = React.useState(false)

    function openDelete() {
        setOnDelete(true)
    }

    function closeDelete() {
        setOnDelete(false)
    }

    const jobStyle = !onDelete ? "job" : "job-opaque"

    return (
        <div className="show-update">
            {
            !props.openModal ?
            <div className={jobStyle}>
                <div className="side">
                    <AiIcons.AiOutlineClose className="close" onClick={props.handleClick}/>
                    {
                    props.user === "Client" ?
                    <div className="updateJob">
                        <div className="delete">
                            <button onClick = {showMod} className="home-link2">Update Job</button>
                        </div>
                        <div className="delete">
                            <button onClick = {openDelete} className="home-link2">Delete Job</button>
                        </div>
                    </div>
                    :
                    props.location === "jobs" &&
                    <div className="delete">
                        <button onClick = {showMod} className="home-link2">Create a Proposal</button>
                    </div>
                    }
                </div>
                <div className='job_display'>
                    <div className="header">
                        <h2>Job Details</h2>
                    </div>
                    <div className='job_interior'>
                        {job && (
                            <>
                                <div className="job-details">
                                    <div className="job-info">
                                        <h3>Job Name: </h3>
                                        <p>{job.job_name}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Job Description: </h3>
                                        <p>{job.job_description}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Property Location: </h3>
                                        <p>{propLoc}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Property Type: </h3>
                                        <p>{propType}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Job Type: </h3>
                                        <p>{jobType}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Total Floors: </h3>
                                        <p>{job.total_floors}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Start Date: </h3>
                                        <p>{job.start_date}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>End Date: </h3>
                                        <p>{job.end_date}</p>
                                    </div>
                                    {
                                        props.user === "Client" &&
                                        <div className="job-info">
                                            <h3>Maximum Proposals: </h3>
                                            <p>{job.max_proposals}</p>
                                        </div>
                                    }
                                </div>
                                
                            </>
                        )}
                    </div>
                    {
                        props.user === "Client" &&
                        <div className="page-link">
                            <h4 className="conf" style={conf_styles}>Confirmed</h4>
                            {
                                !confirmed  ?
                                <h4 className="comp" style={comp_styles}>Completed</h4>
                                :
                                !completed ?
                                <h4 className="comp" style={comp_styles}>Click if Job has been Completed</h4>
                                :
                                <h4 className="comp" style={comp_styles}>Completed</h4>
                            }
                        </div> 
                    }
                </div>
                {
                    onDelete &&
                    <DeleteJob code = {code} back = {closeDelete} token = {token} handleClick = {props.handleClick} 
                        onRefresh = {props.onRefresh} 
                    />
                }

            </div>
            :
            <div>
                <div>
                {
                    props.openModal && 
                    props.user === "Client" ?
                    <UpdateJob closeModal = {props.closeModal} job = {job} code = {code} onJobRefresh ={refJobOn} onRefresh = {props.onRefresh}/>
                    :
                    <CreateProposal closeModal = {props.closeModal} job = {job} code = {code}/>
                }
                </div>
            </div>
            }
        </div>
    )
}

