import React from "react";
import DisplayJobs from "./displayJobs"
import SpecificJob from "./specificJob"

export default function AllJobs(props) {
    let left = props.sidebar ? "250px" : "auto"
    const styles = {
        marginLeft: left,
        backgroundColor: "#f1f1f1",
        height: "100vh",
        overflow: "auto"
    }

    const [showJob, setShowJob] = React.useState(false)

    //Display 1 job
    const [jobShortCode, setJShortCode] = React.useState("")

    function dispJob(jsc) {
        setShowJob(true)
        setJShortCode(jsc)
        console.log(props.user, props.sidebar)
    }

    function hideJob() {
        setShowJob(false)
        setJShortCode()
        
    }
    const [openModal, setOpenModal] = React.useState(false)

    function showModal() {
        setOpenModal(true)
    }

    const newlocation = "jobs"

    return (
        <div style={styles} >
        {
            !showJob ?
            <div className="alljobs">
                {
                props.location !== "confirmed" && props.location !== "completed" ?
                props.user === "Client" ?
                <h2 className="component-heading">Your Jobs</h2>
                :
                <h2 className="component-heading">Bid Jobs</h2>
                :
                props.location === "confirmed" ?
                <h2 className="component-heading">Ongoing Jobs</h2> :
                <h2 className="component-heading">Completed Jobs</h2>
                }   
                {
                    props.jobs && props.jobs.map((job) => {
                        return(
                            <DisplayJobs 
                                name={job.job_name} description={job.job_description} handleClick={() => dispJob(job.job_short_code)} 
                                start={job.start_date} end ={job.end_date} created_at = {job.job_created_at}
                            />
                        )
                    })
                }
            </div>
            :
            <SpecificJob handleClick={hideJob} jsc={jobShortCode} user = {props.user} showModal = {showModal} 
                closeModal = {setOpenModal} openModal = {openModal} className="alljobs" 
                onRefresh = {props.onRefresh} offRefresh = {props.offRefresh}
                location = {newlocation} sourceLocation = {props.location}
                getRatedJob = {props.getRatedJob}
            />
        }
        </div>
    )
}