import React from "react"
import DisplayJobs from "./clientJobs"
import SpecificJob from "./specificJob"

export default function Main(props) {
    let left = props.sidebar ? "250px" : "auto"
    const [jobs, setJobs] = React.useState([])
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    console.log(token)
    const requestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    const styles = {
        marginLeft: left
    }
    const [showJob, setShowJob] = React.useState(false)

    //Display 1 job
    const [jobShortCode, setJShortCode] = React.useState("")

    function dispJob(jsc) {
        setShowJob(true)
        setJShortCode(jsc)
    }

    function hideJob() {
        setShowJob(false)
        setJShortCode()
        
    }

    //Get data that is not within the scope of React: Jobs from the SQLAlchemy Database
    let jobNumber, message
    React.useEffect(
        () => {
            fetch('/job/client/jobs', requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.msg){
                        message = data.msg
                    }
                    setJobs(data)
                    jobNumber = data.length
                })
                .catch(err => console.log(err))
            
            if (message && message === "Token has expired"){
                fetch('/user_auth/refresh', requestOptions)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        setToken(data.access_token)
                    })
                    .catch(err => console.log(err))
            }
        }, [message]
    )

    // React.useEffect(
    //     () => {
    //         fetch('/job/client/jobs', requestOptions)
    //             .then(res => res.json())
    //             .then(data => {
    //                 console.log(data)
    //                 if (data.message){
    //                     message = data.message
    //                 }
    //             })
    //             .catch(err => console.log(err))
            
    //         if (message && message === "Token has expired"){
    //             fetch('/user_auth/refresh', requestOptions)
    //                 .then(res => res.json())
    //                 .then(data => {
    //                     console.log(data)
    //                     setToken(data.access_token)
    //                 })
    //                 .catch(err => console.log(err))
    //         }
    //     }, [message]
    // )


    return (
        <div>
            {
                jobNumber === 0 ?
                <main className="empty-main" style={styles}>
                    <h2 className="empty-h2">You have not registered any job.</h2>
                    <button className="empty-button">Register one now</button>
                </main>
                :
                <div style={styles} >
                {
                    !showJob ?
                    <div className="alljobs">
                        <h2 className="component-heading">Your Jobs:</h2>
                        {
                            jobs.map((job) => {
                                return(
                                    <DisplayJobs name={job.job_name} description={job.job_description} handleClick={() => dispJob(job.job_short_code)} />
                                )
                            })
                        }
                    </div>
                    :
                    <SpecificJob handleClick={hideJob} jsc={jobShortCode} className="alljobs" />
                }
                </div>

            }
        </div>


        
    )

}
