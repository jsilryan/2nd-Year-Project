import React from "react";
import * as AiIcons from "react-icons/ai"
import UpdateContract from "../client/clientUpdateContract";
import DeleteContract from "../client/deleteContract";
import ClientUpdateContract from "../client/clientUpdateContract";
import PainterSignContract from "../painter/painterSignContract";
import ReactToPrint from "react-to-print"
import { useRef } from "react";

export default function SpecificContract (props) {
    const [contract, setContract] = React.useState(null)
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const [time, setTime] = React.useState() //Contract Time
    const componentRef = useRef()
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
    const Contract_Type = job && job.contract_type
    const now = new Date()

    const propLoc = job && Prop_Location ? Prop_Location.replace("Prop_Location.", "") : ''
    const propType = job && Property_Type ? Property_Type.replace("Property_Type.", "") : ''
    const jobType = job && Job_Type ? Job_Type.replace("Job_Type.", "") : '' 
    const contractType = Contract_Type ? Contract_Type.replace("Contract_Type.", "") : ''

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
    const jobDisplay = (!onDelete && !onSelect) ? "contract_display" : "job_display_opaque"
    const sideDisplay = (!onDelete && !onSelect) ? "side" : "side_opaque"
    const tryStyle = (!onDelete && !onSelect) ? "try" : "try-opaque"

    function handlePrint() {
        window.print()
    }
    // const border = {
    //     borderBottom: '1px solid gray',
    //     width: '100%'
    // };

    // const pad = {
    //     padding : "5px"
    // }


    return(
        <div className={tryStyle}>
        {
        !showContract ?
        <div className={jobStyle}>
            <div className={sideDisplay}>
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
                <div className="updateJob">
                    {/* <div className="delete">
                        <button onClick = {openDelete} className="home-link2">Terminate Contract</button>
                    </div> */}
                    <div className="delete">
                        <ReactToPrint trigger = {() => <button className="home-link2">Print / Download</button>}
                        content = {() => componentRef.current}
                        />
                    </div>
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
                <div className="updateJob">
                    {/* <div className="delete">
                        <button onClick = {openDelete} className="home-link2">Terminate Contract</button>
                    </div> */}
                    <div className="delete">
                        <ReactToPrint trigger ={() => <button className="home-link2">Print / Download</button>}
                        content = {() => componentRef.current}
                        />
                    </div>
                </div>
                }
            </div>
            
            <div className={jobDisplay} >
                <div className= "component-ref" ref = {componentRef}>
                    <div className="contract-header">
                        <div>
                            <h2>CONTRACT:</h2>
                        </div>
                    </div>
                    <div className="job_interior" >
                        <p className="first-line-contract">The Painting Contract is made on <span className="font-bold">{signedAt.toLocaleString()}</span> by and between: </p>
                        <div className="job_interior" >
                            <p className="job_det">Names: <span className="real_info"><span className="font-bold"> {contract && contract.client_first_name} {contract && contract.client_last_name}</span> (Property Owner) and <span className="font-bold">{contract && contract.painter_first_name} {contract && contract.painter_last_name}</span> (Painter). </span></p>
                            <p className="job_det">Phone Numbers: <span className="real_info"><span className="font-bold">{contract && contract.client_number}</span> (Property Owner) and <span className="font-bold">{contract && contract.painter_number}</span> (Painter). </span></p>
                        </div>
                        <p>The conditions bind both Property Owner and Painter, jointly and severally.</p>
                    </div>
                    <div className="header">
                        <h3>Contract Details for Job {contract && contract.job_short_code}:</h3>
                    </div>
                    <div className="job_interior" >
                        <p className="job_det"><span className="font-bold">Job Name:</span> <span className="real_info">{job && job.job_name}</span></p>
                        <p className="job_det"><span className="font-bold">Job Description:</span> <span className="real_info">{job && job.job_description}</span></p>
                        <p className="job_det"><span className="font-bold">Property Location:</span> <span className="real_info">{propLoc}</span></p>
                        <p className="job_det"><span className="font-bold">Property Type:</span> <span className="real_info">{propType}</span></p>
                        <p className="job_det"><span className="font-bold">Job Type:</span> <span className="real_info">{jobType}</span></p>           
                        <p className="job_det"><span className="font-bold">Contract Type:</span> <span className="real_info">{contractType}</span></p>
                        <p className="job_det"><span className="font-bold">Total Rooms:</span> <span className="real_info">{job && job.total_rooms} Units</span></p> 
                        <p className="job_det"><span className="font-bold">Total Floors:</span> <span className="real_info">{job && job.total_floors}</span></p>
                        <p className="job_det"><span className="font-bold">Start Date:</span> <span className="real_info">{job && job.start_date}</span></p>
                        <p className="job_det"><span className="font-bold">End Date:</span> <span className="real_info">{job && job.end_date}</span></p>   
                        {
                            (job && job.contract_type === "Contract_Type.Material") &&
                            <p className="job_det"><span className="font-bold">Materials </span> <span className="real_info">{contract && contract.materials} </span></p>
                        }

                        {
                            (job && job.job_type === "Job_Type.Exterior" || job && job.job_type === "Job_Type.Both") &&
                            <p className="job_det"><span className="font-bold">Exterior Lumpsum(Total): </span> <span className="real_info">Kshs. {contract && contract.exterior_lumpsum} </span></p>
                        }

                        {
                        (job && job.job_type === "Job_Type.Interior" || job && job.job_type === "Job_Type.Both") &&
                        <div>
                            <p className="job_det"><span className="font-bold">Interior Preparation per unit: </span> <span className="real_info">Kshs. {contract && contract.interior_preparation} </span></p>
                            <p className="job_det"><span className="font-bold">Interior Finishing per unit: </span> <span className="real_info">Kshs. {contract && contract.interior_finishing} </span></p>
                        </div>
                        }
                        <p className="job_det"><span className="font-bold">Total Payment Amount: </span> <span className="real_info">Kshs. {contract && contract.total_payment_amount} </span></p>    
                        {
                            signed &&
                            <div>
                                <p className="job_det"><span className="font-bold">Signed At:</span> <span className="real_info">{signedAt.toLocaleString()}</span></p>
                            </div>
                        }
                    </div>
                    {
                        signed && 
                        <div>
                            <div className="header">
                                <h3>Signatures:</h3>
                            </div>
                            <div className="job_interior" >
                                <p className="job_det"><span className="font-bold">Client:</span> <span className="real_info">_______________________</span> </p>
                                <p className="job_det"><span className="font-bold">Painter:</span> <span className="real_info">_______________________</span> </p>
                                <p className="job_det"><span className="font-bold">Magistrate:</span> <span className="real_info">_______________________</span> </p>
                            </div>
                        </div>
                    }
                </div>
                {
                !signed ?
                <div>
                    <div>
                        <h3 style = {{color : "red"}}>DISCLAIMER:</h3>
                        <h4 >The Contract is bound to be edited once the client deliberates with the painter before or after the painter does a site visit to the property, <span style = {{color : "red"}}>BUT before</span> it is signed.</h4>
                        <h4 >Only the Client can edit the contract based on the deliberations between the Client and the Painter.</h4>
                        <h4 >Any change by the client automatically unsigns the contract for the Painter to allow the Painter to see the new changes, and to confirm whether they appeal to him/her.</h4>
                        <h4 >To edit the contract after contract creation, you will click the <span style = {{color : "red"}}>Update Contract</span> button and it will allow you to make changes to the contract as discussed with the painter.</h4>
                        <h4 >The Contract can be deleted by the Client before it is signed once the <span style = {{color : "red"}}>Delete Contract</span> button is clicked and confirmed.</h4>
                        <h4 >Once signed by both the Client and the Painter, the contract can only be terminated via proper <span style = {{color : "red"}}>judicial action</span>. Therefore pay attention to detail before signing.</h4>
                    </div>
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
            onContractRefresh = {refContractOn} onRefresh = {props.onRefresh} jsc = {jobCode}
        />
        }
        </div>
    )
}