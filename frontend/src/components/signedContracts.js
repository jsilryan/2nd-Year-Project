import React from "react"
import AllContracts from "./allContracts"

export default function SignedContracts(props) {
    const [signedContracts, setSignedContracts] = React.useState()
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))

    let left = props.sidebar ? "250px" : "auto"

    const styles = {
        marginLeft: left,
        backgroundColor: "#f1f1f1",
        height: "100vh",
        overflow: "auto"
    }

    const requestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    let url = "/contract/signed"

    const [sContractNumber, setSContractNumber] = React.useState()
    const [refreshContracts, setRefreshContracts] = React.useState(false)

    function refContractsOn() {
        setRefreshContracts(true)
    }

    function refContractsOff() {
        setRefreshContracts(false)
    }

    React.useEffect (
        () => {
            fetch("/contract/signed", requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setSContractNumber(data.length)
                    setSignedContracts(data)
                })
                .catch(err => console.log(err))
            
            if (refreshContracts === true) {
                refContractsOff()
            }
                

        }, [refreshContracts]
    )

    let location = "Signed"

    return (
        <div style={styles}>
        {
            sContractNumber === 0 ?
            <main className="empty-main" >
                <h2 className="empty-h2">You have 0 Signed Contracts.</h2>
            </main>
            :
            <AllContracts signedContracts = {signedContracts} sidebar = {props.sidebar} user = {props.getUser} onRefresh = {refContractsOn} 
                location = {location}
            />
        }
        </div>

    )

}
