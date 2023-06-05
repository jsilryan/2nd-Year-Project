
import React from "react";
import DisplayJobs from "./displayJobs"
import SpecificJob from "./specificJob"
import SearchBar from "./searchbar";

export default function AllJobs(props) {
    let left = props.sidebar ? "250px" : "auto"
    const styles = {
        marginLeft: left
    }

    const [showJob, setShowJob] = React.useState(false)
    const [confirmedJobs, setConfirmedJobs] = React.useState()
    const [completedJobs, setCompletedJobs] = React.useState()
    const [noContract, setNoContract] = React.useState()
    const [noContLength, setNCLength] = React.useState()
    const [confLength, setConfLength] = React.useState()
    const [compLength, setCompLength] = React.useState()
    const [confirmed, setConfirmed] = React.useState(false)
    const [completed, setCompleted] = React.useState(false)
    const [notContracted, setNotContracted] = React.useState(true)

    function openConfirmed () {
        setConfirmed(true)
        setCompleted(false)
        setNotContracted(false)
        setSearchWord("")
        setFilteredData()
    }

    function openCompleted() {
        setCompleted(true)
        setConfirmed(false)
        setNotContracted(false)
        setSearchWord("")
        setFilteredData()
    }

    function openNotContracted(){
        setNotContracted(true)
        setConfirmed(false)
        setCompleted(false)
        setSearchWord("")
        setFilteredData()
    }

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

    React.useEffect(
        () => {
            if (props.jobs){
                let allConfirmed = []
                for (let i = 0; i < props.jobs.length; i++) {
                    if (props.jobs[i].job_confirmed && !props.jobs[i].job_completed) {
                        let newJob = props.jobs[i]
                        allConfirmed.push(newJob)
                        console.log(newJob)
                    }
                }
                
                setConfirmedJobs (allConfirmed)
                confirmedJobs && setConfLength (confirmedJobs.length)
            }            
            if (props.jobs){
                let allCompleted = []
                for (let i = 0; i < props.jobs.length; i++) {
                    if (props.jobs[i].job_confirmed && props.jobs[i].job_completed) {
                        let newJob = props.jobs[i]
                        allCompleted.push(newJob)
                    }
                }
                setCompletedJobs (allCompleted)
                completedJobs && setCompLength(completedJobs.length)
            }
            if (props.jobs){
                let zeroContract = []
                for (let i = 0; i < props.jobs.length; i++) {
                    if (!props.jobs[i].job_confirmed && !props.jobs[i].job_completed) {
                        let newJob = props.jobs[i]
                        zeroContract.push(newJob)
                    }
                }
                console.log(zeroContract.length)
                setNoContract (zeroContract)
                noContract && setNCLength(noContract.length)
            }
        },[props.jobs]
    )

    console.log(noContract)
    console.log(confirmedJobs)
    console.log(completedJobs)
    const newlocation = "jobs"
    console.log(props.jobs)

    const styles1 = {
        fontWeight : "bold",
        color: "#08927E",
        fontSize: "24px" 
    }

    const [filteredData, setFilteredData] = React.useState()
    const [searchWord, setSearchWord] = React.useState("")
    
    console.log(filteredData, searchWord)
    return (
        <div style={styles} >
        {
            !showJob ?
            <div className="alljobs">
                {
                props.location !== "confirmed" && props.location !== "completed" ?
                props.user === "Client" ?
                <div className="group">
                    <div className="title-header">
                        <h2 className="component-heading">Your Jobs</h2>
                        <SearchBar placeholder = "Search Jobs" 
                            data = {
                                confirmed ? confirmedJobs :
                                completed ? completedJobs :
                                noContract
                            }
                            setData = {setFilteredData}
                            setSearchWord = {setSearchWord}
                            searchWord = {searchWord}
                            type = "jobs"
                        />
                    </div>
                    <div className="yourjobs-header">
                        <h3 style = {notContracted ? styles1 : null} onClick = {openNotContracted} className = "alljobs-header">Without Contracts</h3>
                        <h3 style = {confirmed ? styles1 : null} onClick = {openConfirmed} className = "alljobs-header">Ongoing</h3>
                        <h3 style = {completed ? styles1 : null} onClick = {openCompleted} className = "alljobs-header">Completed</h3>
                    </div>

                 </div> 
                :
                <div className="title-header">
                    <h2 className="component-heading">Bid Jobs</h2>
                    <SearchBar placeholder = "Search Jobs" 
                        data = {props.jobs}
                        setData = {setFilteredData}
                        setSearchWord = {setSearchWord}
                        searchWord = {searchWord}
                        type = "jobs"
                    />
                </div>
                :
                props.location === "confirmed" ?
                <div className="title-header">
                    <h2 className="component-heading">Ongoing Jobs</h2> 
                    <SearchBar placeholder = "Search Jobs" 
                        data = {props.jobs}
                        setData = {setFilteredData}
                        setSearchWord = {setSearchWord}
                        searchWord = {searchWord}
                        type = "jobs"
                    />
                </div>
                :
                <div className="title-header">
                    <h2 className="component-heading">Completed Jobs</h2>
                    <SearchBar placeholder = "Search Jobs" 
                        data = {props.jobs}
                        setData = {setFilteredData}
                        setSearchWord = {setSearchWord}
                        searchWord = {searchWord}
                        type = "jobs"
                    />
                </div>
                
                }   

                {
                    !searchWord ?
                    props.location !== "confirmed" && props.location !== "completed" ?
                    completed ?
                    completedJobs && completedJobs.length > 0 ?
                    completedJobs.map((job) => {
                        return(
                            <DisplayJobs 
                                name={job.job_name} description={job.job_description} handleClick={() => dispJob(job.job_short_code)} 
                                start={job.start_date} end ={job.end_date} created_at = {job.job_created_at}
                            />
                        )
                    })
                    :
                    <main className='jobs_display'>
                        <h2 className="empty-h2">You have 0 completed jobs.</h2>
                    </main>
                    :
                    notContracted ?
                    noContract && noContract.length > 0 ?
                    noContract.map((job) => {
                        return(
                            <DisplayJobs 
                                name={job.job_name} description={job.job_description} handleClick={() => dispJob(job.job_short_code)} 
                                start={job.start_date} end ={job.end_date} created_at = {job.job_created_at}
                            />
                        )
                    })
                    :
                    <main className='jobs_display'>
                        <h2 className="empty-h2">You have 0 jobs that are not contracted.</h2>
                    </main>
                    :
                    confirmedJobs && confirmedJobs.length > 0 ?
                    confirmedJobs.map((job) => {
                        return(
                            <DisplayJobs 
                                name={job.job_name} description={job.job_description} handleClick={() => dispJob(job.job_short_code)} 
                                start={job.start_date} end ={job.end_date} created_at = {job.job_created_at}
                            />
                        )
                    })
                    :
                    <main className='jobs_display'>
                        <h2 className="empty-h2">You have 0 ongoing jobs.</h2>
                    </main>
                    :
                    props.jobs && props.jobs.map((job) => {
                        return(
                            <DisplayJobs 
                                name={job.job_name} description={job.job_description} handleClick={() => dispJob(job.job_short_code)} 
                                start={job.start_date} end ={job.end_date} created_at = {job.job_created_at}
                            />
                        )
                    })
                    :
                    <div className="searchjobs">
                    {
                        filteredData && filteredData.length > 0 ? 
                        filteredData.slice(0, 15).map((job) => {
                            return(
                                <DisplayJobs 
                                    name={job.job_name} description={job.job_description} handleClick={() => dispJob(job.job_short_code)} 
                                    start={job.start_date} end ={job.end_date} created_at = {job.job_created_at}
                                />
                            )
                        })
                        :
                        <main className='jobs_display'>
                            <h2 className="empty-h2">Job does not exist.</h2>
                        </main>
                    }
                    </div>
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