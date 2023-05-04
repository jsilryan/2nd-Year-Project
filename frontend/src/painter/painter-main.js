import React from "react"
import AllJobs from "../components/allJobs"

export default function PainterMain(props) {
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
    const [refreshProposals, setRefreshProposals] = React.useState(false)

    function refProposalsOn() {
        setRefreshProposals(true)
    }

    function refProposalsOff() {
        setRefreshProposals(false)
    }
    //Get data that is not within the scope of React: Jobs from the SQLAlchemy Database
    const [jobNumber, setJobNumber] = React.useState()
    let message
    React.useEffect(
        () => {
            fetch('/job/painter/jobs', requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.msg){
                        message = data.msg
                    }
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
                    <h2 className="empty-h2">There are no jobs to bid at the moment.</h2>
                </main>
                :
                <AllJobs jobs = {jobs} sidebar = {props.sidebar} user = {props.getUser}/>
            }
        </div>
    )

}
