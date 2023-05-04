import React from "react"
import AllJobs from "../components/allJobs"
import { useNavigate } from "react-router-dom"

export default function CompletedJobs(props) {
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
    const navigate = useNavigate() 

    const [refreshJobs, setRefreshJobs] = React.useState(false)

    function refJobsOn() {
        setRefreshJobs(true)
    }

    function refJobsOff() {
        setRefreshJobs(false)
    }

    //Get data that is not within the scope of React: Jobs from the SQLAlchemy Database
    const [jobNumber, setJobNumber] = React.useState()
    let message
    React.useEffect(
        () => {
            fetch('/job/job/completed', requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    console.log(data.length)
                    data && setJobNumber(data.length)
                    if (data.msg){
                        message = data.msg
                    }
                    setJobs(data)
                })
                .catch(err => console.log(err))

            if (refreshJobs === true) {
                refJobsOff()
            }
            
        }, [refreshJobs]
    )
    
    console.log(jobNumber)

    let location = "completed"

    return (
        <div>
            {
                jobNumber === 0 ?
                <main className="empty-main" style={styles}>
                    <h2 className="empty-h2">You have 0 completed jobs.</h2>
                </main>
                :
                <AllJobs jobs = {jobs} sidebar = {props.sidebar} user = {props.getUser} onRefresh = {refJobsOn} location = {location}/>
            }
        </div>        
    )
}
