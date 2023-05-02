import React from "react";
import { useNavigate } from "react-router-dom";
import * as AiIcons from "react-icons/ai"

export default function CreateContract(props) {
    const [contractForm, setContractForm] = React.useState({
        paymentAmount : "",
        clientSign: false
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
    const now = new Date()

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
            
            fetch(`/contract/client/job/${props.code}/contract`, requestOptions)
              .then(res => res.json())
              .then(data => {
                    console.log(data)
                    const alerts = data.message
                    alert(alerts)
                    completeContractForm()
                    navigate("/painter/bid-jobs")
              })
              .catch((err) => console.log(err));
        }
    }

    return(
        <div style = {styles1} className="job">
            <div className="side">
                <AiIcons.AiOutlineClose className="close" onClick={props.handleClick}/>
            </div>
            <div className="job_display">
                <h1>Contract:</h1>
                <p>The Painting Contract is made on {now.toLocaleString()} by and between {} (Property Owner) and {} (Painter).</p>
                <p>The conditions bind both Property Owner and Painter, jointly and severally.</p>
                <p>The Contract is for Job {props.jsc} with the following details:</p>
                <p>Enter Payment Amount: (Can be edited before the proposal is signed):</p>
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
                        <legend>Do you agree to the Terms and Conditions of the Contract?</legend>
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
    )
}