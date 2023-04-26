import React from "react"
import { Link } from "react-router-dom"

export default function PainterSignUp() {

    const [painterForm, setPainterForm] = React.useState({
        first_name: "",
        last_name: "",
        gender: "",
        email: "",
        password: "",
        confirm_password: "",
        nationality: "",
        country: "",
        county: ""

    })

    const [passwordType, setPType] = React.useState("password")

    function togglePass() {
        if (passwordType === "password") {
            setPType("text")
        }
        else {
            setPType("password")
        }
    }

    const [emptyFields, setEmpty] = React.useState([])
    const [checkKenyan, setCheckKenyan] = React.useState(true)
    const [checkPass, setCheckPass] = React.useState(true)
    const [submittedEmpty, setSubmittedEmpty] = React.useState([])
    const [lenPass, setLenPass] = React.useState(true)
    const [lenEmail, setLenEmail] = React.useState(true)
    const [lenCountry, setLenCountry] = React.useState(true)
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
        if (painterForm.first_name === "") {
            empty.push("first_name")
        } 
        if (painterForm.last_name === "") {
            empty.push("last_name")
        } 
        if (painterForm.gender === "") {
            empty.push("gender")
        } 
        if (painterForm.email === "") {
            empty.push("email")
        } 
        if (painterForm.password === "") {
            empty.push("password")
        } 
        if (painterForm.confirm_password === "") {
            empty.push("confirm_password")
        } 
        if (painterForm.country === "") {
            empty.push("country")
        } 
        if (painterForm.county === "" && painterForm.country === "Kenya" && painterForm.nationality === "Kenyan") {
            empty.push("county")
        } 
        if (painterForm.nationality === "") {
            empty.push("nationality")
        } 
        setEmpty(empty)
    }

    function checkCred() {
        setSubmittedEmpty(emptyFields)
        if (emptyFields.length === 0)
        {
            if (painterForm.first_name.length <= 25) 
            {
                if (painterForm.last_name.length <= 25) 
                {
                    if (painterForm.email.length <= 80) 
                    {
                        if (painterForm.country.length <= 60) 
                        {
                            if (painterForm.password.length >= 8) 
                            {
                                if (painterForm.password === painterForm.confirm_password) 
                                {
                                    if (painterForm.nationality === "notKenyan" && painterForm.country === "Kenya") 
                                    {
                                        alert("Do not enter Kenya in country if you are not Kenyan!")
                                        setCheckKenyan (false)
                                    }
                                    else {
                                        setCorrectEntry(true)
                                    }
                                    
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
                            alert("Country has more than 60 characters!")
                            setLenCountry(false)
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
            alert("Fill in all required fields!")
        }

    }

    React.useEffect(
        () => {
            checkEmpty()
            if (painterForm.password.length >= 8) {
                setLenPass(true)
            }
            if (painterForm.first_name.length <= 25) {
                setLenFName(true)
            }
            if (painterForm.last_name.length <= 25) {
                setLenLName(true)
            }
            if (painterForm.email.length <= 80) {
                setLenEmail(true)
            }
            if (painterForm.country.length <= 60) {
                setLenCountry(true)
            }
            if (painterForm.password === painterForm.confirm_password) {
                setCheckPass(true)
            }
            if (painterForm.nationality === "Kenyan" && painterForm.country !== "Kenya") {
                setPainterForm (
                    prevData => {
                        return {
                            ...prevData,
                            country : "Kenya"
                        }
                    }
                )
            }
        }, [painterForm]
    )

    function updateValues(event) {
        const {name, value, type, checked} = event.target
        setPainterForm(
            prevData => {
                return {
                    ...prevData,
                    [name] : type === "checkbox" ? checked : value
                }
            }

        )
        
    }


    function handleSubmit(event) {
        event.preventDefault();
        console.log(painterForm);
        // checkCred();
        if (correctEntry) {
          const body = {
            first_name: painterForm.first_name,
            last_name: painterForm.last_name,
            gender: painterForm.gender,
            email: painterForm.email,
            password: painterForm.password,
            country: painterForm.country,
            county: painterForm.county,
          }
          const requestOptions = {
            method: "POST",
            headers: {
              "content-type": "application/json", //Gives description of the data I'll send
            },
            body: JSON.stringify(body),
          }
      
          fetch("/painter_auth/painter-signup", requestOptions)
            .then((res) => {
              if (res.ok) {
                return res.json();
              } else {
                throw new Error("Network response was not ok.");
              }
            })
            .then((data) => {
              console.log(data);
              const alerts = data.message
              alert(alerts)
              setPainterForm({
                first_name: "",
                last_name: "",
                gender: "",
                email: "",
                password: "",
                confirm_password: "",
                nationality: "",
                country: "",
                county: "",
              });
              setCorrectEntry(false);
            })
            .catch((err) => console.log(err));
        }
      }

    return (
        <div className="home">
            <div className="empty-home">
            <div className="signup-login">
                <form onSubmit={handleSubmit} className="form">
                    <h2 className="form-title">Painter Sign Up</h2>
                    <div className="names-pass">
                        <div className = "name1">
                            <input 
                                id="first_name" 
                                type="text" 
                                placeholder="First Name" 
                                name="first_name" 
                                value = {painterForm.first_name}
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
                                value = {painterForm.last_name}
                                onChange={updateValues}
                                className = "name"
                                style = {(submittedEmpty.includes("last_name")) ? styles : null}
                            />
                        </div>
                    </div>
                    {
                        (submittedEmpty.includes("first_name") || submittedEmpty.includes("last_name")) &&
                        <div>
                            <span style={{color: "red"}}>First name and Last name fields are required!</span>
                        </div>
                    }
                    {
                        (!lenFName || !lenLName) &&
                        <div>
                            <span style={{color: "red"}}>First name or Last name field has more than 25 characters!</span>
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
                            checked={painterForm.gender === "Male"}
                            onChange={updateValues}
                            className="in-field1"
                        />
                        <label htmlFor="Male" className="in-field2">Male</label> 
                        <input 
                            id="Female" 
                            type="radio" 
                            name="gender" 
                            value="Female" 
                            checked={painterForm.gender === "Female"}
                            onChange={updateValues}
                            className="in-field3"
                        />
                        <label htmlFor="Female" className="in-field4">Female</label>  
                        <input 
                            id="Other" 
                            type="radio" 
                            name="gender" 
                            value="Other" 
                            checked={painterForm.gender === "Other"}
                            onChange={updateValues}
                            className="in-field5"
                        />
                        <label htmlFor="Other" className="in-field6">Other</label> 
                        </div>
                    </fieldset>

                    {
                        (submittedEmpty.includes("gender")) && 
                        <div>
                            <span style={{color: "red"}}>Gender is required!</span>
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
                        value = {painterForm.email}
                        onChange={updateValues}
                        style = {(submittedEmpty.includes("email")) ? styles : null}
                    />

                    {
                        (submittedEmpty.includes("email")) && 
                        <div>
                            <span style={{color: "red"}}>Email is required!</span>
                        </div>
                    }
                    {
                        (!lenEmail) &&
                        <div>
                            <span style={{color: "red"}}>Email field has more than 80 characters!</span>
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
                                value = {painterForm.password}
                                onChange={updateValues}
                                className="pass-input"
                                style = {(submittedEmpty.includes("password")) ? styles : null}
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
                            <span style={{color: "red"}}>Password is required!</span> 
                        </div>
                    }
                    
                    {
                        !lenPass && 
                        <div>
                            <span style={{color: "red"}}>Password has to be 8 or more characters!</span>
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
                        value = {painterForm.confirm_password}
                        onChange={updateValues}
                        style = {(submittedEmpty.includes("confirm_password") || !checkPass) ? styles : null}
                    />

                    {
                        (submittedEmpty.includes("confirm_password")) && 
                        <div>
                            <span style={{color: "red"}}>Confirm your password!</span>
                        </div>
                    }
                    {
                        !checkPass && 
                        <div>
                            <span style={{color: "red"}}>Passwords do not match!</span>
                        </div>                    
                    }  
                    {
                        (submittedEmpty.includes("confirm_password") || !checkPass) && 
                        <br/>
                    }  
                    
                    <fieldset
                        style = {(submittedEmpty.includes("nationality")) ? styles : null}
                    >
                        <legend>Do you live in Kenya?</legend>
                        <div className="in-field">
                            <input 
                                id="Kenyan" 
                                type="radio" 
                                name="nationality" 
                                value = "Kenyan"
                                checked={painterForm.nationality === "Kenyan"}
                                onChange={updateValues}
                                className="in-field1"
                            />
                            <label htmlFor="Kenyan" className="in-field2">Yes, I do</label>
                        </div>
                        <div className="in-field">
                            <input 
                                id="notKenyan" 
                                type="radio" 
                                name="nationality" 
                                value = "notKenyan"
                                checked={painterForm.nationality === "notKenyan"}
                                onChange={updateValues}
                                className="in-field3"
                            />
                            <label htmlFor="notKenyan" className="in-field4">Another country</label>
                        </div>

                    </fieldset>
                    {
                        (submittedEmpty.includes("nationality")) && 
                        <div>
                            <span style={{color: "red"}}>Choose your nationality!</span>
                        </div>
                    }
                    {
                        (submittedEmpty.includes("nationality") || !checkPass) && 
                        <br/>
                    }  
                    
                    {
                        painterForm.nationality === "Kenyan" &&
                        <div>
                        <fieldset
                            style = {(submittedEmpty.includes("county")) ? styles : null}
                        >
                            <legend>County</legend>
                            <select 
                                id = "county" 
                                name="county" 
                                value={painterForm.county} 
                                onChange= {updateValues}
                                className="county">
                                <option value = "">-- Choose --</option>
                                <option value="Baringo">Baringo</option>
                                <option value="Bomet">Bomet</option>
                                <option value="Bungoma">Bungoma</option>
                                <option value="Busia">Busia</option>
                                <option value="ElgeyoMarakwet">ElgeyoMarakwet</option>
                                <option value="Embu">Embu</option>
                                <option value="Garissa">Garissa</option>
                                <option value="HomaBay">HomaBay</option>
                                <option value="Isiolo">Isiolo</option>
                                <option value="Kajiado">Kajiado</option>
                                <option value="Kakamega">Kakamega</option>
                                <option value="Kericho">Kericho</option>
                                <option value="Kiambu">Kiambu</option>
                                <option value="Kilifi">Kilifi</option>
                                <option value="Kirinyaga">Kirinyaga</option>
                                <option value="Kisii">Kisii</option>
                                <option value="Kisumu">Kisumu</option>
                                <option value="Kitui">Kitui</option>
                                <option value="Kwale">Kwale</option>
                                <option value="Laikipia">Laikipia</option>
                                <option value="Lamu">Lamu</option>
                                <option value="Machakos">Machakos</option>
                                <option value="Makueni">Makueni</option>
                                <option value="Mandera">Mandera</option>
                                <option value="Marsabit">Marsabit</option>
                                <option value="Meru">Meru</option>
                                <option value="Migori">Migori</option>
                                <option value="Mombasa">Mombasa</option>
                                <option value="Muranga">Muranga</option>
                                <option value="Nairobi">Nairobi</option>
                                <option value="Nakuru">Nakuru</option>
                                <option value="Nandi">Nandi</option>
                                <option value="Narok">Narok</option>
                                <option value="Nyamira">Nyamira</option>
                                <option value="Nyandarua">Nyandarua</option>
                                <option value="Nyeri">Nyeri</option>
                                <option value="Samburu">Samburu</option>
                                <option value="Siaya">Siaya</option>
                                <option value="TaitaTaveta">TaitaTaveta</option>
                                <option value="TanaRiver">TanaRiver</option>
                                <option value="TharakaNithi">TharakaNithi</option>
                                <option value="TransNzoia">TransNzoia</option>
                                <option value="Turkana">Turkana</option>
                                <option value="UasinGishu">UasinGishu</option>
                                <option value="Vihiga">Vihiga</option>
                                <option value="Wajir">Wajir</option>
                                <option value="WestPokot">WestPokot</option>

                            </select>
                        </fieldset> 
                        {
                            (submittedEmpty.includes("county")) && 
                            <div>
                                <span style={{color: "red"}}>Choose your county!</span>
                            </div>
                        }
                        {
                            (submittedEmpty.includes("county") || !checkPass) && 
                            <br/>
                        }  
                        </div>
                        
                    }
                    {
                        painterForm.nationality === "notKenyan" &&
                        <div>
                            <input  
                                id="country" 
                                type="text" 
                                placeholder="Country" 
                                name="country" 
                                value = {painterForm.country}
                                onChange={updateValues}
                                style = {(submittedEmpty.includes("country") || !checkKenyan) ? styles : null}
                            />
                            {
                                (submittedEmpty.includes("country")) && 
                                <div>
                                    <span style={{color: "red"}}>Choose your county!</span>
                                </div>
                            }
                            {
                                (!lenCountry) &&
                                <div>
                                    <span style={{color: "red"}}>Country field has more than 60 characters!</span>
                                </div>
                            }
                            {
                                (submittedEmpty.includes("country") || !checkPass || !lenCountry) && 
                                <br/>
                            }  
                        </div>

                    }
                    <div className="submit">
                        <button className="home-link2" onClick={checkCred}>Submit</button>
                    </div>
                </form>
                <br/>
            </div>
            </div>
        </div>
    )
}

//Htmlfor - id