import React from "react"
import AllContracts from "./allContracts"

export default function PendingContracts(props) {
    const [pendingContracts, setPendingContracts] = React.useState()
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
    let url 

    if (props.getUser === "Client"){
        url = "/contract/client/pending-contracts"
    } else {
        url = "/contract/painter/pending-contracts"
    }

    const [pContractNumber, setPContractNumber] = React.useState()
    const [refreshContracts, setRefreshContracts] = React.useState(false)

    function refContractsOn() {
        setRefreshContracts(true)
    }

    function refContractsOff() {
        setRefreshContracts(false)
    }

    React.useEffect (
        () => {
            fetch(url, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setPContractNumber(data.length)
                    setPendingContracts(data)
                })
                .catch(err => console.log(err))
            
            if (refreshContracts === true) {
                refContractsOff()
            }
                

        }, [refreshContracts]
    )

    let location = "Pending"

    return (
        <div style={styles}>
        {
            pContractNumber === 0 ?
            <main className="empty-main">
                <h2 className="empty-h2">You have 0 Pending Contracts.</h2>
            </main>
            :
            <AllContracts pendingContracts = {pendingContracts} sidebar = {props.sidebar} user = {props.getUser} onRefresh = {refContractsOn} 
                location = {location}
            />
        }
        </div>

    )

}