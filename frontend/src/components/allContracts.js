import React from "react";
import DisplayContracts from "./displayContracts";
import SpecificContract from "./specificContract";
import SearchBar from "./searchbar";

export default function AllContracts(props) {
    let left = props.sidebar ? "250px" : "auto"
    const styles = {
        marginLeft: left
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

    const [filteredData, setFilteredData] = React.useState()
    const [searchWord, setSearchWord] = React.useState("")
    console.log(searchWord, filteredData)

    return (
        <div style={styles} >
        {
            !showContract ?
            props.location === "Pending" ?
            <div className="alljobs">
                <div className="title-header">
                    <h2 className="component-heading">Your Pending Contracts</h2>
                    <SearchBar placeholder = "Search Contracts" 
                                data = {props.pendingContracts}
                                setData = {setFilteredData}
                                setSearchWord = {setSearchWord}
                                searchWord = {searchWord}
                                type = "contracts"
                            />
                </div>
                {
                    !searchWord ?
                    props.pendingContracts && props.pendingContracts.map((contract) => {
                        return(
                            <DisplayContracts amount = {contract.payment_amount} signed = {contract.signed} jsc = {contract.job_short_code} csc = {contract.contract_short_code}
                                handleClick = {() => dispContract(contract.contract_short_code)}
                            />
                        )
                    })
                    :
                    <div className="searchjobs">
                    {
                        filteredData && filteredData.length > 0 ?
                        filteredData.map((contract) => {
                            return(
                                <DisplayContracts amount = {contract.payment_amount} signed = {contract.signed} jsc = {contract.job_short_code} csc = {contract.contract_short_code}
                                    handleClick = {() => dispContract(contract.contract_short_code)}
                                />
                            )
                        })
                        :
                        <main className='jobs_display'>
                            <h2 className="empty-h2">Contract does not exist.</h2>
                        </main>
                    }
                    </div>
                }
            </div>
            :
            <div className="alljobs">
                <div className="title-header">
                    <h2 className="component-heading">Your Signed Contracts</h2>
                    <SearchBar placeholder = "Search Contracts" 
                                data = {props.signedContracts}
                                setData = {setFilteredData}
                                setSearchWord = {setSearchWord}
                                searchWord = {searchWord}
                                type = "contracts"
                            />
                </div>
                {
                    !searchWord ?
                    props.signedContracts && props.signedContracts.map((contract) => {
                        return(
                            <DisplayContracts amount = {contract.payment_amount} signed = {contract.signed} jsc = {contract.job_short_code} csc = {contract.contract_short_code}
                                handleClick = {() => dispContract(contract.contract_short_code)}
                            />
                        )
                    })
                    :
                    <div className="searchjobs">
                    {
                        filteredData && filteredData.length > 0 ?
                        filteredData.map((contract) => {
                            return(
                                <DisplayContracts amount = {contract.payment_amount} signed = {contract.signed} jsc = {contract.job_short_code} csc = {contract.contract_short_code}
                                    handleClick = {() => dispContract(contract.contract_short_code)}
                                />
                            )
                        })
                        :
                        <main className='jobs_display'>
                            <h2 className="empty-h2">Contract does not exist.</h2>
                        </main>
                    }
                    </div>
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