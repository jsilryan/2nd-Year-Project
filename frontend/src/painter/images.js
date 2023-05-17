import React from "react"
import { Link, useNavigate } from "react-router-dom"
import * as AiIcons from "react-icons/ai"
import {MdCloudUpload, MdDelete} from "react-icons/md"

export default function AddImage(props){
    const [images, setImages] = React.useState("")
    const [sendImages, setSendImages] = React.useState("")
    const [fileNames, setFileNames] = React.useState([])
    const [emptyFields, setEmpty] = React.useState([])
    const [submittedEmpty, setSubmittedEmpty] = React.useState([])
    const [correctEntry, setCorrectEntry] = React.useState(false)
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const navigate = useNavigate()
    const [checkFileType, setCheckFileType] = React.useState(true)
    const [checkFileNumber, setCheckFileNumber] = React.useState(true)
    const maxNum = 10 - props.numImages
    console.log(maxNum)

    const styles = {
        border : "1px",
        borderColor: "red",
        borderStyle: "solid",
        marginBottom: "-1px"
    }

    function checkEmpty() {
        let empty = [] 
        if (sendImages === "") {
            empty.push("images")
        }
        setEmpty(empty)
    }

    function checkLength() {
        if (images && images.length > maxNum) {
            setCheckFileNumber(false)
        } else {
            setCheckFileNumber(true)
        }
    }
    function checkCred() {
        setSubmittedEmpty(emptyFields)
        if (emptyFields.length === 0)
        {
            for (let i = 0; i < sendImages.length; i++) {
                if (!sendImages[i].type === "image/png" || !sendImages[i].type === "image/jpeg" || !sendImages[i].type === "image/jpg") {
                    setCheckFileType(false)
                    alert(`File ${files[i].name} is not of the correct format!`)
                }
            }
            if (checkFileType) {
                if (images.length <= maxNum) {
                    setCorrectEntry(true)
                }
                else {
                    setCheckFileNumber(false)
                    alert("You cannot have more than 10 images in your portfolio.")
                }
                
            }
        } 
        else {
            console.log("The following fields are empty: ", emptyFields)
            alert("Cannot submit 0 images!")
        }

    }

    function handleClick (event) {
        const inputField = document.querySelector(".input-fields");
        if (inputField) {
            inputField.click();
        }
        event.stopPropagation();
    }

    function completeImgForm() {
        setFileNames();
        setImages();
        setCorrectEntry(false)
        setSendImages()
    }

    React.useEffect(
        () => {
            checkEmpty()
            checkLength()
        }, [images]
    )
    const [files, setFiles] = React.useState()
    function updateValues(event) {
        const {files} = event.target
        console.log(files)
        setFiles(files)
        if (files && files[0])
        {
            let newImages = [...(images || [])];
            let newNames = [...(fileNames || [])];
            let newSendImages = [...(sendImages || [])];
            console.log(newNames)
            for (let i = 0; i < files.length; i++) {
                let newImage, newName, newSendImage;
                newSendImage = files[i]
                newImage = URL.createObjectURL(files[i]);
                newName = files[i].name;
                console.log(newName)
                if (!newNames.includes(newName)) {
                    newNames.push(newName);
                    newImages.push({ name: newName, object: newImage });
                    newSendImages.push(newSendImage)
                }
            }
            setSendImages(newSendImages)
            setFileNames(newNames);
            setImages(newImages);
            
        }
    }
    console.log(images)
    console.log(fileNames)

    const [imgDisplayed, setImgDisplayed] = React.useState()
    function dispImg(index) {
        setImgDisplayed(images[index])
    }

    function removeImg(fileName) {
        console.log(fileName)
        setFileNames(fileNames.filter(file => file !== fileName))
        setImages(images.filter(image => image.name !== fileName))
        if (imgDisplayed && imgDisplayed.name === fileName && images.length > 1) {
            const indexToRemove = images.findIndex(image => image.name === fileName);
            const nextIndex = (indexToRemove + 1) % images.length;
            setImgDisplayed(images[nextIndex]);
        }
        else if (imgDisplayed && imgDisplayed.name === fileName && images.length <= 1) {
            setImgDisplayed(null)
            console.log(imgDisplayed)
        }
    }

    function handleSubmit(event) {
        event.preventDefault()
        let alerts
        
        if (correctEntry) {
            const formData = new FormData()
            console.log(sendImages)
            if (sendImages.length > 0) {
                for (let i = 0; i < sendImages.length; i++) {
                    console.log(sendImages[i])
                    formData.append("img", sendImages[i]);
                }
            }
            console.log(formData.get("img"))
    
            const requestOptions = {
                method: "POST",
                headers: {
                'Authorization' : `Bearer ${token}`
                },
                body: formData
            }
            
            fetch(`/images/portfolio/${props.code}/image`, requestOptions)
            .then(res => res.json())
            .then(data => {
                    console.log(data)
                    alerts = data.message
                    alert(alerts)
            })
            .catch((err) => console.log(err));
            completeImgForm()
            props.newPort()
        }
    }

    React.useEffect(
        () => {
            if (images && images[0]) {
                // if (!imgDisplayed) {
                //     setImgDisplayed(images[0])
                // }
                let len = images.length
                setImgDisplayed(images[len-1])
            } else {
                setImgDisplayed()
            }  
        }, [images]
    )
    console.log(imgDisplayed && imgDisplayed.object)

    return (
        <div className="job">
            <div className="side">
                <AiIcons.AiOutlineClose className="close" onClick={props.switchPortfolio}/>
            </div>
            <div className="job_display">
                <div className="header">
                    <h2>Add Portfolio Images</h2>
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="add_image" onClick={handleClick}
                            style = {(submittedEmpty.includes("images") || !checkFileType || !checkFileNumber) ? styles : null}
                        >
                            <input 
                                id = "images"
                                type = "file"
                                name = "images"
                                accept = "images/*"
                                onChange={updateValues}
                                className="input-fields"
                                hidden
                                multiple
                            />
                            {
                                imgDisplayed ?
                                <img src = {imgDisplayed && imgDisplayed.object} className = "upload_image" alt = {fileNames}/> :
                                <div className="browse">
                                    <MdCloudUpload color = "#4A4E74" size = {100} />
                                    <p>Browse Files to Upload</p>
                                </div>
                            }
                        </div>
                        <br />

                        {
                            (!checkFileNumber) &&
                            <div>
                                <span style={{color: "red"}}>Cannot have more than 10 files in your portfolio!</span>
                            </div>
                        }
                        {
                            (!checkFileNumber) && 
                            <br/>
                        }
                        
                        <div className="submit">
                            <button className="home-link2" onClick={checkCred}>Submit</button>
                        </div>
                    </form>
                    {
                        images && fileNames && fileNames.map((file, index) => {
                            return (
                                <section className="browse-uploaded">
                                    <AiIcons.AiFillFileImage color="#4A4E74" />
                                    <span onClick={() => {dispImg(index)}} className="img_display">{file}</span>
                                    <MdDelete className = "delete_uploaded" onClick={() => {removeImg(file)}}/>
                                </section>
                            )
                        })
                    } 
                </div>
            </div>
        </div>
    )
}