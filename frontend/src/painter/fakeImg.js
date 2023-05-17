import React from "react"
import { Link, useNavigate } from "react-router-dom"
import * as AiIcons from "react-icons/ai"
import {MdCloudUpload, MdDelete} from "react-icons/md"

export default function AddImage(props){
    const [image, setImg] = React.useState("")
    const [fileName, setFileName] = React.useState("No Selected File")
    const [emptyFields, setEmpty] = React.useState([])
    const [submittedEmpty, setSubmittedEmpty] = React.useState([])
    const [correctEntry, setCorrectEntry] = React.useState(false)
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const navigate = useNavigate()

    const styles = {
        border : "1px",
        borderColor: "red",
        borderStyle: "solid",
        marginBottom: "-1px"
    }

    function checkEmpty() {
        let empty = [] 
        if (image === "") {
            empty.push("image")
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
            alert("Cannot submit 0 images!")
        }
    }

    function completeImgForm() {
        setImg ()
        setCorrectEntry(false)
    }

    React.useEffect(
        () => {
            checkEmpty()
        }, [image]
    )

    const [files, setFiles] = React.useState()
    function updateValues(event) {
        const {files}= event.target
        setFiles(files)

        files[0] && setFileName(files[0].name)

        if (files && files[0]) {
            setImg(
                URL.createObjectURL(files[0])
            )
        }
        else {
            setImg()
        }
        
    }

    function removeImg () {
        setFileName("No Selected File.")
        setImg(null)
    }

    function handleSubmit(event) {
        event.preventDefault()
        let alerts
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append(`images[${i}]`, files[0])
        }
        console.log(formData)
        if (correctEntry) {
            for (let i = 0; i < files.length; i++) {
                const body = {
                    img : files[i]
                }

                const requestOptions = {
                    method: "POST",
                    headers: {
                    "content-type": "application/json", //Gives description of the data I'll send
                    'Authorization' : `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                }
                
                fetch(`/images/portfolio/${props.code}/image`, requestOptions)
                .then(res => res.json())
                .then(data => {
                        console.log(data)
                        alerts = data.message
                })
                .catch((err) => console.log(err));
            }
            alert(alerts)
            completeImgForm()
        }
    }

    return (
        <div className="job">
            <div className="side">
                <AiIcons.AiOutlineClose className="close" onClick={props.switchPortfolio}/>
            </div>
            <div className="job_display">
                <div className="header">
                    <h2>Add Portfolio Image</h2>
                </div>
                <div>
                    <form onSubmit={handleSubmit}
                        style = {(submittedEmpty.includes("image")) ? styles : null}
                        onClick={() => {
                            const inputField = document.querySelector(".input-fields");
                            if (inputField) {
                                inputField.click();
                            }
                        }}
                    >
                        <div className="add_image">
                            {/* <input 
                                id = "image"
                                type = "file"
                                name = "image"
                                accept = "image/*"
                                onChange={updateValues}
                                className="input-fields"
                                hidden
                                multiple
                            /> */}
                            <input 
                                id = "image"
                                type = "file"
                                accept = "image/*"
                                onChange={updateValues}
                                className="input-fields"
                                hidden
                                multiple
                            />
                            {
                                files ?
                                <img src = {files[0]} className = "upload_image" alt = {fileName}/> 
                                :
                                <div className="browse">
                                    <MdCloudUpload color = "#4A4E74" size = {100} />
                                    <p>Browse Files to Upload</p>
                                </div>
                            }
                        </div>
                        <br />
                        
                        <div className="submit">
                            <button className="home-link2" onClick={checkCred}>Submit</button>
                        </div>
                    </form>

                    <section className="browse-uploaded">
                        <AiIcons.AiFillFileImage color="#4A4E74" />
                        {
                            files &&
                            <div>
                                {files.length} files.
                            </div>
                        
                        } 
                        <MdDelete className = "delete_uploaded" onClick={removeImg}/>
                    </section>
                </div>
            </div>
        </div>
    )
}