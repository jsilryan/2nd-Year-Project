import React from "react";
import * as AiIcons from "react-icons/ai"
import DeleteImage from "./deleteImage";

export default function SpecificImage(props){
    const [image, setImage] = React.useState(null)
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const requestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    let url = "/images/image/" + props.isc
    console.log(url)
    React.useEffect(() => {
        fetch(url, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setImage(data);
        })
        .catch(err => console.log(err));
    
      }, []);
    console.log(image)
    const imageUrl = "http://127.0.0.1:5000/static/uploads/" + (image && image.name )

    const [onDelete, setOnDelete] = React.useState(false)

    function openDelete() {
        setOnDelete(true)
    }

    function closeDelete() {
        setOnDelete(false) 
    }
    const jobStyle = !onDelete ? "job" : "job-opaque"
    const jobDisplay = !onDelete  ? "job_display" : "job_display_opaque"
    const sideDisplay = !onDelete  ? "side" : "side_opaque"
    const imgDisplay = !onDelete  ? "disp_image" : "disp_image_opaque"
    const uploadDisplay = !onDelete  ? "upload_image" : "upload_image_opaque"

    const slider = {
        height: "100%",
        width: "100%",
        position : "relative",
    }
    
    const slide = {
        borderRadius: "5px",
        maxHeight: "600px"
    }

    return (
        <div className={jobStyle}>
            <div className={sideDisplay}>
                <AiIcons.AiOutlineClose className="close" onClick={props.handleClick}/>
                {
                !props.user &&
                <div className="delete">
                    <button className="home-link2" onClick ={openDelete}>Delete Image</button>
                </div>
                }   
            </div>
            <div className={jobDisplay}>
                <h3>Image:</h3>
                <div className={imgDisplay} style = {slider}>
                    {/* <div
                        className="image-overlay"
                        style =
                        {{
                            opacity: onDelete ? 0.7 : 0,
                            zIndex: onDelete ? 1 : -1,
                        }}
                    >
                    </div> */}
                    {
                    onDelete ?
                    <div className={uploadDisplay}>
                        <img className={uploadDisplay} src={imageUrl} alt={image && image.name} />
                        <div className="image-overlay"></div>
                    </div> 
                    :
                    <img src={imageUrl} className={uploadDisplay} alt={image && image.name} style = {slide}/>
                    }
                </div>
            </div>
            {
                onDelete &&
                <DeleteImage back = {closeDelete} code = {props.isc} url = {url} token = {token} handleClick = {props.handleClick} onRefresh = {props.newPort}/>
            }
        </div>
    )
}