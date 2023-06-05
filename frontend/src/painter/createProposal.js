import React from "react";
import { Link, useNavigate } from "react-router-dom"
import * as AiIcons from "react-icons/ai"

export default function CreateProposal(props) {
    const [proposalForm, setProposalForm] = React.useState({
        proposalName : "",
        proposalDescription : ""
    })

    let left = props.sidebar ? "250px" : "auto"

    const styles1 = {
        marginLeft: left
    }


    const navigate = useNavigate() 
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const [emptyFields, setEmpty] = React.useState([])
    const [submittedEmpty, setSubmittedEmpty] = React.useState([])
    const [correctEntry, setCorrectEntry] = React.useState(false)
    const [lenName, setLenName] = React.useState(true)
    const [lenDesc, setLenDesc] = React.useState(true)
    const [disabled, setDisabled] = React.useState(false)

    const styles = {
        border : "1px",
        borderColor: "red",
        borderStyle: "solid",
        marginBottom: "-1px"
    }

    function checkEmpty() {
        let empty = [] 
        if (proposalForm.proposalName === "") {
            empty.push("proposalName")
        }
        if (proposalForm.proposalDescription === "") {
            empty.push("proposalDescription")
        }
        setEmpty(empty)
    }

    function checkCred() {
        setSubmittedEmpty(emptyFields)
        if (emptyFields.length === 0)
        {
            if (proposalForm.proposalName.length <= 100)
            {
                if (proposalForm.proposalDescription.length <= 2500)
                {
                    setCorrectEntry(true)
                }
                else {
                    alert("Proposal Description has to be below 2500 characters")
                    setLenDesc(false)
                }
            } else {
                alert("Proposal Name has to be below 100 characters!")
                setLenName(false)
            }
        } else {
            console.log("The following fields are empty: ", emptyFields)
            alert("Fill in all required fields!")
        }
    }

    function completeProposalForm() {
        setProposalForm ({
            proposalName : "",
            proposalDescription : ""
        })
        setCorrectEntry(false)
    }

    React.useEffect(
        () => {
            checkEmpty()
            if (proposalForm.proposalName.length <= 100)
            {
                setLenName(true)
            }
            if (proposalForm.proposalDescription.length <= 2500)
            {
                setLenDesc(true)
            }
        }, [proposalForm]
    )

    function updateValues(event) {
        const {name, value}= event.target
        setProposalForm (
            prevData => {
                return {
                    ...prevData,
                    [name] : value
                }
            }
        )
    }

    function handleSubmit(event) { 
        event.preventDefault()
        console.log(proposalForm)

        if (correctEntry) {
            setDisabled(true)
            const body = {
                proposal_name: proposalForm.proposalName,
                proposal_description: proposalForm.proposalDescription
            }

            const requestOptions = {
                method: "POST",
                headers: {
                  "content-type": "application/json", //Gives description of the data I'll send
                  'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(body)
              }
            
            fetch(`/proposal/painter/job/${props.code}/proposals`, requestOptions)
              .then(res => res.json())
              .then(data => {
                    console.log(data)
                    const alerts = data.message
                    alert(alerts)
                    if (alerts === `You cannot have more than 1 proposal for the same job ${props.code}`) {
                        navigate("/painter/bid-jobs")
                    }
                    else {
                        navigate("/painter/proposals")
                    }
                    completeProposalForm()
                    closeModal()
              })
              .catch((err) => console.log(err));
        }
    }
    function closeModal() {
        props.closeModal(false)
    }
    return (
        <div style = {styles1} className="job">
            <div className="side">
                <Link to="/painter/bid-jobs"><AiIcons.AiOutlineClose className="close" onClick={closeModal}/></Link>
            </div>
            <div className="form_display">
                <form className="form" onSubmit={handleSubmit}>
                    <h2 className="form-title">Enter Proposal Details:</h2>
                    <input
                        id = "proposalName"
                        type = "text"
                        placeholder = "Proposal Name"
                        name = "proposalName"
                        value = {proposalForm.proposalName}
                        onChange={updateValues}
                        style = {(submittedEmpty.includes("proposalName")) ? styles : null}
                    />
                    {
                        (submittedEmpty.includes("proposalName")) && 
                        <div>
                            <span style={{color: "red"}}>Proposal Name is required!</span>
                        </div>
                    }
                    {
                        (!lenName) &&
                        <div>
                            <span style={{color: "red"}}>Proposal name field has more than 100 characters!</span>
                        </div>
                    }
                    {
                        (submittedEmpty.includes("proposalName") || !lenName) && 
                        <br/>
                    }
                    <fieldset
                        style = {(submittedEmpty.includes("proposalDescription")) ? styles : null}
                    >
                        <legend>Proposal Description</legend>
                        <textarea 
                            id = "proposalDescription"
                            type = "text"
                            placeholder="Proposal Description"
                            name="proposalDescription"
                            value={proposalForm.proposalDescription}
                            onChange={updateValues}
                            style = {(submittedEmpty.includes("proposalDescription")) ? styles : null}
                            className="proposal_desc"
                        />
                    </fieldset>
                    {
                        (submittedEmpty.includes("proposalDescription")) && 
                        <div>
                            <span style={{color: "red"}}>Proposal Description is required!</span>
                        </div>
                    }
                    {
                        (!lenDesc) &&
                        <div>
                            <span style={{color: "red"}}>Proposal Description field has more than 2500 characters!</span>
                        </div>
                    }
                    {
                        (submittedEmpty.includes("proposalDescription") || !lenDesc) && 
                        <br/>
                    }
                
                    <div className="submit">
                        <button className="home-link2" onClick={checkCred} disabled = {disabled}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}