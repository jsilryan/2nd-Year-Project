import React from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function ClientSignup(props) {

    const [clientForm, setClientForm] = React.useState({
        first_name: "",
        last_name: "",
        gender: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    const [passwordType, setPType] = React.useState("password")

    const navigate = useNavigate() 

    function togglePass() {
        if (passwordType === "password") {
            setPType("text")
        }
        else {
            setPType("password")
        }
    }

    const [emptyFields, setEmpty] = React.useState([])
    const [checkPass, setCheckPass] = React.useState(true)
    const [submittedEmpty, setSubmittedEmpty] = React.useState([])
    const [lenPass, setLenPass] = React.useState(true)
    const [lenEmail, setLenEmail] = React.useState(true)
    const [lenFName, setLenFName] = React.useState(true)
    const [lenLName, setLenLName] = React.useState(true)
    const [correctEntry, setCorrectEntry] = React.useState(false)

    const styles = {
        border : "1px",
        borderColor: "red",
        borderStyle: "solid",
        marginBottom: "-1px"
    }

    function checkEmpty() {
        let empty = [] 
        if (clientForm.first_name === "") {
            empty.push("first_name")
        } 
        if (clientForm.last_name === "") {
            empty.push("last_name")
        } 
        if (clientForm.gender === "") {
            empty.push("gender")
        } 
        if (clientForm.email === "") {
            empty.push("email")
        } 
        if (clientForm.password === "") {
            empty.push("password")
        } 
        if (clientForm.confirm_password === "") {
            empty.push("confirm_password")
        } 
        setEmpty(empty)
    }

    React.useEffect(
        () => {
            checkEmpty()
            if (clientForm.password.length >= 8) {
                setLenPass(true)
            }
            if (clientForm.first_name.length <= 25) {
                setLenFName(true)
            }
            if (clientForm.last_name.length <= 25) {
                setLenLName(true)
            }
            if (clientForm.email.length <= 80) {
                setLenEmail(true)
            }
            if (clientForm.password === clientForm.confirm_password) {
                setCheckPass(true)
            }
        }, [clientForm]
    )

    function checkCred() {
        setSubmittedEmpty(emptyFields)
        if (emptyFields.length === 0)
        {
            if (clientForm.first_name.length <= 25) 
            {
                if (clientForm.last_name.length <= 25) 
                {
                    if (clientForm.email.length <= 80) 
                    {
                        if (clientForm.password.length >= 8) 
                        {
                            if (clientForm.password === clientForm.confirm_password) 
                            {         
                                setCorrectEntry(true)
                            }
                            else {
                                alert("Passwords do not match!")
                                setCheckPass(false)
                            }
                        } else {
                            alert("Password has to have 8 or more characters!")
                            setLenPass(false)
                        }  
                    } else {
                        alert("Email has more than 80 characters!")
                        setLenEmail(false)
                    } 
                } else {
                    alert("Last name has more than 25 characters!")
                    setLenLName(false)
                }
            } else {
                alert("First name has more than 25 characters!")
                setLenFName(false)
            }

        } else {
                console.log("The following fields are empty: ", emptyFields)
        }

    }

    function updateValues(event) {
        const {name, value, type, checked} = event.target
        setClientForm(
            prevData => {
                return {
                    ...prevData,
                    [name] : type === "checkbox" ? checked : value
                }
            }

        )
        
    }

    function completeCSignup() {
        setClientForm({
            first_name: "",
            last_name: "",
            gender: "",
            email: "",
            password: "",
            confirm_password: ""
        });
        setCorrectEntry(false);
    }

    function handleSubmit(event) {
        event.preventDefault()
        // checkCred()
        console.log(clientForm)
        if (correctEntry) {
            const body = {
                first_name : clientForm.first_name,
                last_name : clientForm.last_name,
                gender : clientForm.gender,
                email : clientForm.email,
                password : clientForm.password
            }
            //Stringify the data from object to json
            //Data to be sent will be of type json
            const requestOptions =
            {
                method: "POST",
                headers: {
                    "content-type" : "application/json" 
                },                    
                body : JSON.stringify(body)
            }
            
            fetch('/client_auth/client-signup', requestOptions)
                .then((res) => {
                    if (res.ok) {
                    return res.json();
                    } else {
                    throw new Error("Network response was not ok.");
                    }
                })
                .then((data) => {
                    const alerts = data.message
                    alert(alerts)
                    if (data.message == "Client created successfully!") {
                        navigate("/client/my-jobs")
                        completeCSignup()
                        props.switchClient()
                        props.handleClick()
                    }

                })
                .catch((err) => console.log(err));
          }
    }

    

    return (
        <div className="client-home">
            <div className="signup-login">
                <form onSubmit={handleSubmit} className="form">
                    <h2 className="form-title">Client Sign Up</h2>
                    <div className="names-pass">
                        <div className = "name1">
                            <input 
                                id="first_name" 
                                type="text" 
                                placeholder="First Name" 
                                name="first_name" 
                                value = {clientForm.first_name}
                                onChange={updateValues}
                                className = "name"
                                style = {(submittedEmpty.includes("first_name")) ? styles : null}
                            />
                        </div>
                        <div className = "name2">
                            <input 
                                id="last_name" 
                                type="text" 
                                placeholder="Last Name" 
                                name="last_name" 
                                value = {clientForm.last_name}
                                onChange={updateValues}
                                className = "name"
                                style = {(submittedEmpty.includes("last_name")) ? styles : null}
                            />
                        </div>
                    </div>
                    {
                        (submittedEmpty.includes("first_name") || submittedEmpty.includes("last_name")) &&
                        <div>
                            <small style={{color: "red" }}>First name and Last name fields are required!</small>
                        </div>
                    }
                    {
                        (!lenFName || !lenLName) &&
                        <div>
                            <small style={{color: "red"}}>First name or Last name field has more than 25 characters!</small>
                        </div>
                    }
                    {
                        (submittedEmpty.includes("first_name") || submittedEmpty.includes("last_name") || !lenFName || !lenLName) &&
                        <br/>
                    }
                    <fieldset
                        style = {(submittedEmpty.includes("gender")) ? styles : null}
                    >
                        <legend>Gender</legend>
                        <div className="in-field">
                        <input 
                            id="Male" 
                            type="radio" 
                            name="gender" 
                            value="Male" 
                            checked={clientForm.gender === "Male"}
                            onChange={updateValues}
                            className="in-field1"
                        />
                        <label htmlFor="Male" className="in-field2">Male</label> 
                        <input 
                            id="Female" 
                            type="radio" 
                            name="gender" 
                            value="Female" 
                            checked={clientForm.gender === "Female"}
                            onChange={updateValues}
                            className="in-field3"
                        />
                        <label htmlFor="Female" className="in-field4">Female</label>  
                        <input 
                            id="Other" 
                            type="radio" 
                            name="gender" 
                            value="Other" 
                            checked={clientForm.gender === "Other"}
                            onChange={updateValues}
                            className="in-field5"
                        />
                        <label htmlFor="Other" className="in-field6">Other</label> 
                        </div>
                    </fieldset>
                    {
                        (submittedEmpty.includes("gender")) && 
                        <div>
                            <small style={{color: "red"}}>Gender is required!</small>
                        </div>
                    }

                    {
                        (submittedEmpty.includes("gender")) && 
                        <br/>
                    }
                    
                    <input 
                        id="email" 
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        value = {clientForm.email}
                        onChange={updateValues}
                        style = {(submittedEmpty.includes("email")) ? styles : null}
                    />
                    {
                        (submittedEmpty.includes("email")) && 
                        <div>
                            <small style={{color: "red"}}>Email is required!</small>
                        </div>
                    }
                    {
                        (!lenEmail) &&
                        <div>
                            <small style={{color: "red"}}>Email field has more than 80 characters!</small>
                        </div>
                    }
                    {
                        (submittedEmpty.includes("email") || !lenEmail) && 
                        <br/>
                    }

                    <div className="names-pass">
                        <div>
                            <input 
                                id="password" 
                                type={passwordType} 
                                placeholder="Password" 
                                name="password" 
                                value = {clientForm.password}
                                onChange={updateValues}
                                className="pass-input"
                                style = {(submittedEmpty.includes("password") || !lenPass) ? styles : null}
                            />
                        </div>
                        <div>
                            <button type="button" className="pass-button" onClick={togglePass}>
                                {
                                    passwordType === "password" ?
                                    <img src={require("../images/show.png")} /> :
                                    <img src={require("../images/private.png")} />
                                }
                            </button>
                        </div>
                    </div>

                    {
                        (submittedEmpty.includes("password")) && 
                        <div>
                            <small style={{color: "red"}}>Password is required!</small> 
                        </div>
                    }

                    {
                        !lenPass && 
                        <div>
                            <small style={{color: "red"}}>Password has to be 8 or more characters!</small>
                        </div>
                    
                    }

                    {
                        (submittedEmpty.includes("password") || !lenPass) && 
                        <br/>
                    }                    

                    <input 
                        id="confirm_password" 
                        type="password" 
                        placeholder="Confirm Password" 
                        name="confirm_password" 
                        value = {clientForm.confirm_password}
                        onChange={updateValues}
                        style = {(submittedEmpty.includes("confirm_password") || !checkPass) ? styles : null}
                    />
                    {
                        (submittedEmpty.includes("confirm_password")) && 
                        <div>
                            <small style={{color: "red"}}>Confirm your password!</small>
                        </div>
                    }
                    {
                        !checkPass && 
                        <div>
                            <small style={{color: "red"}}>Passwords do not match!</small>
                        </div>                    
                    }     
                    <br />
                    <div className="submit">
                        <button className="home-link2" onClick={checkCred}>Submit</button>
                    </div>
                </form>
                <br/>
            </div>
        </div>
    )
}