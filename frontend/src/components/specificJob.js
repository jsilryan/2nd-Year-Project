import React from "react"
import * as AiIcons from "react-icons/ai"
import UpdateJob from "../client/updateJob"
import DeleteJob from "../client/deleteJob"
import { Link } from "react-router-dom"
import CreateProposal from "../painter/createProposal"
import CompleteJob from "../client/completeJob"
import RatePainter from "../client/ratePainter"

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
    const [onComplete, setOnComplete] = React.useState(false)

    function openComplete() {
        setOnComplete(true)
    }

    function closeComplete() {
        setOnComplete(false)
    }

    const jobStyle = !onDelete && !onComplete ? "job" : "job-opaque"

    const [posted, setPosted] = React.useState()
    const [postedUnit, setPostedUnit] = React.useState()
    const now = new Date()
    const endDate = new Date(job && job.end_date)
    const createdMsDiff = Math.abs(endDate - now)
    const createdSecDiff = Math.ceil(createdMsDiff / (1000));
    const createdMinDiff = Math.ceil(createdMsDiff / (1000 * 60));
    const createdHoursDiff = Math.ceil(createdMsDiff / (1000 * 60 * 60));
    const createdDaysDiff = Math.ceil(createdMsDiff / (1000 * 60 * 60 * 24)); 

    React.useEffect(
        () => {
            if(createdDaysDiff > 0) {
                setPosted(createdDaysDiff)
                if (createdDaysDiff === 1)
                {
                    setPostedUnit("Day")
                }
                else {
                    setPostedUnit("Days")
                }
            } 
            else if (createdHoursDiff > 0) {
                setPosted(createdHoursDiff)
                if (createdHoursDiff === 1)
                {
                    setPostedUnit("Hour")
                }
                else {
                    setPostedUnit("Hours")
                }
            }
            else if (createdMinDiff > 0) {
                setPosted(createdMinDiff)
                if (createdMinDiff === 1)
                {
                    setPostedUnit("Minute")
                }
                else {
                    setPostedUnit("Minutes")
                }
            }
            else if (createdSecDiff > 0) {
                setPosted(createdSecDiff)
                if (createdSecDiff === 1)
                {
                    setPostedUnit("Second")
                }
                else {
                    setPostedUnit("Seconds")
                }
            }
            else {
                setPosted(createdMsDiff)
                if (createdMsDiff === 1)
                {
                    setPostedUnit("Millisecond")
                }
                else {
                    setPostedUnit("Milliseconds")
                }
            } 
        
        }, [now]
    )

    return (
        <div className="show-update">
            {
            !props.openModal ?
            <div className={jobStyle}>
                <div className="side">
                    <AiIcons.AiOutlineClose className="close" onClick={props.handleClick}/>
                    {
                    props.user === "Client" ?
                    !confirmed ?
                    <div className="updateJob">
                        <div className="delete">
                            <button onClick = {showMod} className="home-link2">Update Job</button>
                        </div>
                        <div className="delete">
                            <button onClick = {openDelete} className="home-link2">Delete Job</button>
                        </div>
                    </div>
                    :
                    props.sourceLocation !== "completed" && !completed &&
                    <div className="delete">
                        <button onClick = {openComplete} className="home-link4">Click if Job is Complete</button>
                    </div>
                    :
                    job && !job.bidded ?
                    props.location === "jobs" &&
                    <div className="delete">
                        <button onClick = {showMod} className="home-link2">Create a Proposal</button>
                    </div>
                    : 
                    props.sourceLocation !== "confirmed" && props.sourceLocation !== "completed" ?
                    <div className="delete">
                        <h4 className="home-link3">Bidded</h4>
                    </div>
                    :
                    props.sourceLocation === "confirmed" && !completed &&
                    <div className="time-left">
                        <h4>{posted} {postedUnit} Remaining.</h4>
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
                   
                    <div className="page-link">
                        {
                        confirmed ? 
                        <h4 className="conf" style={conf_styles}>Confirmed</h4>
                        :
                        <h4 className="conf" style={conf_styles}>Not Confirmed</h4>
                        }
                        {
                        completed ?
                        <h4 className="comp" style={comp_styles}>Completed</h4>
                        :
                        <h4 className="conf" style={comp_styles}>Not Completed</h4>
                        }
                    </div> 
                    
                </div>
                {
                    onDelete &&
                    <DeleteJob code = {code} back = {closeDelete} token = {token} handleClick = {props.handleClick} 
                        onRefresh = {props.onRefresh} 
                    />
                }
                {
                    onComplete &&
                    <CompleteJob code = {code} back = {closeComplete} token = {token} handleClick = {props.handleClick} 
                    onRefresh = {props.onRefresh} completed = {completed} 
                    getRatedJob = {props.getRatedJob}
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

