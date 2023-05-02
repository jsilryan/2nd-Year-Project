import React from "react"
import AllProposals from "../components/allProposals"
import JobsWithProposals from "./jobsWithProposals"

export default function Proposal(props) {
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

    //Get data that is not within the scope of React: Jobs from the SQLAlchemy Database
    const [jobNumber, setJobNumber] = React.useState()
    let message
    React.useEffect(
        () => {
            fetch('/job/client/job/job_proposals', requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setJobNumber(data.length)
                    setJobs(data)
                })
                .catch(err => console.log(err))
            
        }, []
    )

    const styles = {
        marginLeft: left
    }

    return (
        <div>
        {
            jobNumber === 0 ?
            <main className="empty-main" style={styles}>
                <h2 className="empty-h2">You have 0 proposals.</h2>
            </main>
            :
            <JobsWithProposals jobs = {jobs} sidebar = {props.sidebar} user = {props.getUser}/>
        }
        </div>
    )

}


