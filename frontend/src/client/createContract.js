import React from "react";
import { useNavigate } from "react-router-dom";
import * as AiIcons from "react-icons/ai"

export default function CreateContract(props) {
    const [contractForm, setContractForm] = React.useState({
        paymentAmount : "",
        clientSign: false
    })
    const [job, setJob] = React.useState(null)

    let left = props.sidebar ? "250px" : "auto"

    const styles1 = {
        marginLeft: left
    }

    const navigate = useNavigate() 
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const [emptyFields, setEmpty] = React.useState([])
    const [submittedEmpty, setSubmittedEmpty] = React.useState([])
    const [correctEntry, setCorrectEntry] = React.useState(false)
    const now = new Date()

    const jobRequestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    let link = "/job/job/"
    let code = props.jsc
    let url = link + code

    React.useEffect (
        () => {
            fetch(url, jobRequestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setJob(data)
                })
                .catch(err => console.log(err))
        }, []
    )
    const Prop_Location = job && job.property_location
    const Property_Type = job && job.property_type
    const Job_Type = job && job.job_type

    const propLoc = job && Prop_Location ? Prop_Location.replace("Prop_Location.", "") : ''
    const propType = job && Property_Type ? Property_Type.replace("Property_Type.", "") : ''
    const jobType = job && Job_Type ? Job_Type.replace("Job_Type.", "") : '' 

    const styles = {
        border : "1px",
        borderColor: "red",
        borderStyle: "solid",
        marginBottom: "-1px"
    }

    function checkEmpty() {
        let empty = [] 
        if (contractForm.paymentAmount === "") {
            empty.push("paymentAmount")
        }
        if (contractForm.clientSign === "") {
            empty.push("clientSign")
        }
        setEmpty(empty)
    }

    function checkCred() {
        setSubmittedEmpty(emptyFields)
        if (emptyFields.length === 0)
        {
            setCorrectEntry(true)
        }
        else {
            console.log("The following fields are empty: ", emptyFields)
            alert("Fill in all required fields!")
        }
    }

    function completeContractForm() {
        setContractForm ({
            paymentAmount : "",
            clientSign : false
        })
        setCorrectEntry(false)
    }

    React.useEffect (
        () => {
            checkEmpty()
        }, [contractForm]
    )

    function updateValues(event) {
        const {name, value, type, checked} = event.target
        setContractForm(
            prevData => {
                return {
                    ...prevData,
                    [name] : type === "checkbox" ? checked : value
                }
            }

        )
    }

    function handleSubmit(event) {
        event.preventDefault()
        console.log(contractForm)

        if (correctEntry) {
            const body = {
                payment_amount: contractForm.paymentAmount,
                client_sign: contractForm.clientSign
            }

            const requestOptions = {
                method: "POST",
                headers: {
                  "content-type": "application/json", //Gives description of the data I'll send
                  'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(body)
              }
            
            fetch(`/contract/client/job/${props.jsc}/contract`, requestOptions)
              .then(res => res.json())
              .then(data => {
                    console.log(data)
                    const alerts = data.message
                    alert(alerts)
                    completeContractForm()
                    navigate("/client/contracts/pending")
              })
              .catch((err) => console.log(err));
        }
    }

    return(
        <div style = {styles1} className="job">
            <div className="side">
                <AiIcons.AiOutlineClose className="close" onClick={props.handleClick}/>
            </div>
            <div className='job_display'>
                <div className="header">
                    <h1>Contract:</h1>
                </div>
                <div className="job_interior">
                    <p>The Painting Contract is made on {now.toLocaleString()} by and between {} (Property Owner) and {} (Painter). 
                    The conditions bind both Property Owner and Painter, jointly and severally.</p>
                    <p>The Contract is for Job {props.jsc} with the following details:</p>
                    <p>Job Name: {job && job.job_name}</p>
                    <p>Job Description: {job && job.job_description}</p>
                    <p>Property Location: {propLoc}</p>
                    <p>Property Type: {propType}</p>
                    <p>Job Type: {jobType}</p>            
                    <p>Total Floors: {job && job.total_floors}</p>
                    <p>Start Date: {job && job.start_date}</p>
                    <p>End Date: {job && job.end_date}</p>       
                </div>
                <div>
                    <h4>Enter Payment Amount: (Can be edited before the proposal is signed):</h4>
                    <form className="form" onSubmit={handleSubmit}>
                        <input 
                            id = "paymentAmount"
                            type = "number"
                            placeholder="Payment Amount"
                            name = "paymentAmount"
                            value = {contractForm.paymentAmount}
                            onChange={updateValues}
                            style = {(submittedEmpty.includes("paymentAmount")) ? styles : null}

                        />
                        {
                            (submittedEmpty.includes("paymentAmount")) && 
                            <div>
                                <span style={{color: "red"}}>Temporary Payment Amount is required!</span>
                            </div>
                        }
                        {
                            (submittedEmpty.includes("paymentAmount")) && 
                            <br/>
                        }
                        <fieldset
                            style = {(submittedEmpty.includes("clientSign")) ? styles : null}
                            className="checkbox"
                        >
                            <legend><h4>Do you agree to the Terms and Conditions of the Contract?</h4></legend>
                            <input 
                                id = "clientSign"
                                type = "checkbox"
                                name = "clientSign"
                                checked = {contractForm.clientSign}
                                onChange={updateValues}
                            />
                            <label htmlFor="clientSign">Yes, I agree</label>
                        </fieldset>
                        <div className="submit">
                            <button className="home-link2" onClick={checkCred}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}