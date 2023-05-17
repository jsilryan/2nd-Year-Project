import React from "react"
import * as AiIcons from "react-icons/ai"

export default function DisplayImage(props) {

    const [newImage, setNewImage] = React.useState({
        name: "",
        type: "",
        imageData: ""
      });
      
      React.useEffect(() => {
        setNewImage({
          name: props.image.name,
          type: props.image.mimetype, 
          imageData: props.image.img,
        });
      }, [props.image.name, props.image.mimetype, props.image.img]);
      
      const { name, type, imageData } = newImage;
      console.log(type)
    //   const imageUrl = `data:${type};base64,${imageData}`;
    const imageUrl = "http://127.0.0.1:5000/static/uploads/" + props.image.name 



    return (
      <div onClick={props.handleClick} >
        <div className="display_image" key = {props.key} >
          <img src={imageUrl} className="upload_display_image" alt={name} />
        </div>
        <br />
      </div>
    );
}
