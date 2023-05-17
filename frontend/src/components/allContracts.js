import React from "react";
import DisplayContracts from "./displayContracts";
import SpecificContract from "./specificContract";

export default function AllContracts(props) {
    let left = props.sidebar ? "250px" : "auto"
    const styles = {
        marginLeft: left,
        backgroundColor: "#f1f1f1",
        height: "100vh",
        overflow: "auto"
    }

    const [showContract, setShowContract] = React.useState(false)

    //Display 1 contract
    const [contractShortCode, setCShortCode] = React.useState("")
    function dispContract(csc) {
        setShowContract(true)
        setCShortCode(csc)
        console.log(props.user, props.sidebar)
    }

    function hideContract() {
        setShowContract(false)
        setCShortCode()
        
    }
    const [openModal, setOpenModal] = React.useState(false)

    function showModal() {
        setOpenModal(true)
    }

    const location = "contracts"

    return (
        <div style={styles} >
        {
            !showContract ?
            props.location === "Pending" ?
            <div className="alljobs">
                <div className="title-header">
                    <h2 className="component-heading">Your Pending Contracts</h2>
                    <button className="job-button">Search</button>
                </div>
                {
                    props.pendingContracts && props.pendingContracts.map((contract) => {
                        return(
                            <DisplayContracts amount = {contract.payment_amount} signed = {contract.signed} jsc = {contract.job_short_code}
                                handleClick = {() => dispContract(contract.contract_short_code)}
                            />
                        )
                    })
                }
            </div>
            :
            <div className="alljobs">
                <div className="title-header">
                    <h2 className="component-heading">Your Signed Contracts</h2>
                    <button className="job-button">Search</button>
                </div>
                {
                    props.signedContracts && props.signedContracts.map((contract) => {
                        return(
                            <DisplayContracts amount = {contract.payment_amount} signed = {contract.signed} jsc = {contract.job_short_code}
                                handleClick = {() => dispContract(contract.contract_short_code)}
                            />
                        )
                    })
                }
            </div>
            :
            <SpecificContract handleClick={hideContract} csc = {contractShortCode} user = {props.user} showModal = {showModal} 
                closeModal = {setOpenModal} onRefresh = {props.onRefresh} 
                openModal = {openModal}
            />
        }
        </div>
    )
}