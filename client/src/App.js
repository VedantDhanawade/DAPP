import Upload from "./artifacts/contracts/upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account,setAccount]=useState("");
  const [contract,setContract]=useState(null);
  const [provider,setProvider]=useState(null);
  const [modalOpen,setModalOpen]=useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress, 
          Upload.abi, 
          signer
        );
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not isntalled")
      }
    };
    provider && loadProvider()
  }, []);
  return <div className="App">
    <>
    
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
    <h1 style={{color:"black"}}>Decentralized file system</h1>
    <div class="bg"></div>
    <div class="bg2"></div>
    <div class="bg3"></div>
    
    <p style={{color:"red"}}>Account : {account ? account:"not connected"}</p>
    <FileUpload account={account} provider={provider} contract={contract}></FileUpload> 
    <Display contract={contract} account={account}></Display>
    {!modalOpen && (
        <button className="center button" onClick={() => setModalOpen(true)}>
          
          <h4 style={{color:'white'}}>Share</h4>
        </button>
      )}
    </>
  </div>;

}

export default App;
