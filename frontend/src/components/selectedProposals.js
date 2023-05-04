import React from "react";
import DispProposal from "./displayProposal";
import SpecificProposal from "./specificProposal";
import * as AiIcons from "react-icons/ai"

export default function SelectedProposals(props) {
    let left = props.sidebar ? "250px" : "auto"

    const styles = 
    {
        marginLeft: left
    }

    const [proposals, setProposals] = React.useState([])
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    console.log(token)
    const requestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }

    const [refreshProposals, setRefreshProposals] = React.useState(false)

    function refProposalsOn() {
        setRefreshProposals(true)
    }

    function refProposalsOff() {
        setRefreshProposals(false)
    }
    let url

    url = "/proposal/selected"

    console.log(url)
    
    const [proposalNumber, setPropNumber] = React.useState()
    React.useEffect(
        () => {    
            fetch(url, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setPropNumber(data.length)
                    setProposals(data)
                
                })
                .catch(err => console.log(err))

            if (refreshProposals === true) {
                refProposalsOff()
            }
            
        }, [refreshProposals]
    )

    const [showProposal, setShowProposal] = React.useState(false)

    //Display 1 proposal
    const [proposalShortCode, setPShortCode] = React.useState("")

    function dispProposal(psc) {
        setShowProposal(true)
        setPShortCode(psc)
    }

    function hideProposal() {
        setShowProposal(false)
        setPShortCode()
        
    }

    const [openModal, setOpenModal] = React.useState(false)

    function showModal() {
        setOpenModal(true)
    }

    const location = "selectedProposal"

    return (
        <div style={styles}>
            {
                proposalNumber === 0 ?
                <main className="empty-main" style={styles}>
                    <h2 className="empty-h2">You have 0 Selected Proposals.</h2>
                </main>
                :
                <div >
                {
                    !showProposal ?                    
                    <div className="alljobs">
                        <div className="proposal-header">
                            <h2 className="component-heading">Selected Proposals</h2>
                        </div>
                        {
                            proposals && proposals.map((proposal) => {
                                return(
                                    <DispProposal
                                        name={proposal.proposal_name} description={proposal.proposal_description}
                                        proposalDate = {proposal.proposal_date} 
                                        handleClick={() => dispProposal(proposal.proposal_short_code)} 
                                    />
                                )
                            })
                        }
                    </div>
                    :
                    <SpecificProposal psc = {proposalShortCode} user = {props.getUser} closeProposal = {hideProposal} className="alljobs"
                        showModal = {showModal} closeModal = {setOpenModal} openModal = {openModal}
                        onRefresh = {refProposalsOn} location = {location}
                    />
                }
                </div>
            }
        </div>
    )
}