import React from "react";
import * as AiIcons from "react-icons/ai"
import UpdateContract from "../client/clientUpdateContract";
import DeleteContract from "../client/deleteContract";
import ClientUpdateContract from "../client/clientUpdateContract";
import PainterSignContract from "../painter/painterSignContract";

export default function SpecificContract (props) {
    const [contract, setContract] = React.useState(null)
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const [time, setTime] = React.useState() //Contract Time
    const requestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    let link = "/contract/contract/"
    let code = props.csc
    let url = link + code
    console.log(url)
    let message

    const [refreshContract, setRefreshContract] = React.useState(false)

    function refContractOn() {
        setRefreshContract(true)
    }

    function refContractOff() {
        setRefreshContract(false)
    }

    React.useEffect (
        () => {
            fetch(url, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setContract(data)
                })
                .catch(err => console.log(err))

            if (refreshContract === true) {
                refContractOff()
            }
            
        }, [refreshContract]
    )
    console.log(contract)

    //Get job
    const [job, setJob] = React.useState(null)
    let jobLink = "/job/job/"
    let jobCode = contract && contract.job_short_code
    let jobUrl = jobLink + jobCode

    React.useEffect (
        () => {
            fetch(jobUrl, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setJob(data)
                    setTime(contract && contract.signed_at)
                })
                .catch(err => console.log(err))
        }, [contract]
    )
    //Convert Time into Readable JSON
    const signedAt = new Date(time)
    console.log(signedAt)

    const Prop_Location = job && job.property_location
    const Property_Type = job && job.property_type
    const Job_Type = job && job.job_type
    const now = new Date()

    const propLoc = job && Prop_Location ? Prop_Location.replace("Prop_Location.", "") : ''
    const propType = job && Property_Type ? Property_Type.replace("Property_Type.", "") : ''
    const jobType = job && Job_Type ? Job_Type.replace("Job_Type.", "") : '' 

    const signed = contract && contract.signed
    let bgcolor = signed ? "green" : "red"

    const signedStyle = {
        backgroundColor: bgcolor,
        color : "white"
    }

    const clientSign = contract && contract.client_sign
    const painterSign = contract && contract.painter_sign
    let bgcolor1 = clientSign ? "green" : "red"
    let bgcolor2 = painterSign ? "green" : "red"

    const client_styles = {
        backgroundColor : bgcolor1,
        color : "white"
    }
    
    const painter_styles = {
        backgroundColor : bgcolor2,
        color : "white"
    }

    const [showContract, setShowContract] = React.useState(false)

    function dispContract() {
        setShowContract(true)
    }

    function hideContract() {
        setShowContract(false)
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

    return(
        <div>
        {
        !showContract ?
        <div className={jobStyle}>
            <div className="side">
                <AiIcons.AiOutlineClose className="close" onClick={props.handleClick}/>
                {
                props.user === "Client" ?
                !signed ?
                <div className="updateJob">
                    <div className="delete">
                        <button onClick = {dispContract} className="home-link2">Update Contract</button>
                    </div> 
                    <div className="delete">
                        <button onClick = {openDelete} className="home-link2">Delete Contract</button>
                    </div>
                </div> 
                :
                <div className="delete">
                    <button onClick = {openDelete} className="home-link2">Terminate Contract</button>
                </div>
                : !signed ?
                !painterSign ?
                <div className="delete">
                    <button onClick = {openSelect} className="home-link2">Sign Contract</button>
                </div>
                :
                <div className="delete">
                    <button onClick = {openSelect} className="home-link2">Unsign Contract</button>
                </div>
                :
                <div className="delete">
                    <button onClick = {openDelete} className="home-link2">Terminate Contract</button>
                </div>
                }
            </div>
            <div className='job_display'>
                <div className="header">
                    <h1>Contract:</h1>
                </div>
                <div className="job_interior">
                    <p>The Painting Contract is made on {signedAt.toLocaleString()} by and between {} (Property Owner) and {} (Painter). 
                    The conditions bind both Property Owner and Painter, jointly and severally.</p>
                    <p>The Contract is for Job {contract && contract.job_short_code} with the following details:</p>
                    <p>Job Name: {job && job.job_name}</p>
                    <p>Job Description: {job && job.job_description}</p>
                    <p>Property Location: {propLoc}</p>
                    <p>Property Type: {propType}</p>
                    <p>Job Type: {jobType}</p>            
                    <p>Total Floors: {job && job.total_floors}</p>
                    <p>Start Date: {job && job.start_date}</p>
                    <p>End Date: {job && job.end_date}</p>   
                    <p>Payment Amount: Kshs. {contract && contract.payment_amount}</p>    
                    {
                        signed &&
                        <div>
                            <p>Signed At: {signedAt.toLocaleString()}</p>
                        </div>
                    }
                </div>
                {
                !signed ?
                <div className="page-link">
                    {
                    painterSign ?
                    <h4 className="conf" style={painter_styles}>Painter has Signed</h4>
                    :
                    <h4 className="conf" style={painter_styles}>Painter not Signed</h4>
                    }
                    {
                    clientSign ?
                    <h4 className="comp" style={client_styles}>Client has Signed</h4> 
                    :
                    <h4 className="comp" style={client_styles}>Client not Signed</h4> 
                    }
                </div> 
                :
                <div className="page-link">
                    <h4 className="conf" style={signedStyle}>Contract Signed</h4>
                </div> 
                }
            </div>
            {
                onSelect &&
                <PainterSignContract code = {contract && contract.contract_short_code} back = {closeSelect} token = {token} 
                onRefresh = {props.onRefresh} painterSign = {painterSign} onContractRefresh = {refContractOn}
                />
            }
            {
                onDelete &&
                <DeleteContract code = {contract && contract.contract_short_code} back = {closeDelete} token = {token} 
                onRefresh = {props.onRefresh} />
            }
        </div>
        :
        <ClientUpdateContract handleClick = {hideContract} contract = {contract} csc = {contract && contract.contract_short_code}
            onContractRefresh = {refContractOn} onRefresh = {props.onRefresh} jsc = {props.jsc}
        />
        }
        </div>
    )
}