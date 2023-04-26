import React from "react"
import ClientApp from "./client/clientApp"
import CredentialsApp from "./components/credentialsApp"
import CredentialsApp2 from "./components/cred2"

export default function App() {
    //Checking if the server works
    const [message, setMesasge] = React.useState("")
    React.useEffect (
        () => {
            // fetch('/painter_auth/hello')
            //     .then(res => res.json())
            //     .then(data=>setMesasge(data.message))
            var responseClone;
            fetch('/painter_auth/hello')
                .then(function (response) {
                    responseClone = response.clone(); // 2
                    return response.json();
                })
                .then(function (data) {
                    setMesasge(data.message)
                }, function (rejectionReason) { // 3
                    console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
                    responseClone.text() // 5
                    .then(function (bodyText) {
                        console.log('Received the following instead of valid JSON:', bodyText); // 6
                    });
                });
        }, []
    )
    
    return (
        <div>
            <CredentialsApp2 />
            {/* {message} */}
        </div>
    )
}