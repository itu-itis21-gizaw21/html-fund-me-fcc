import {Contract, ethers } from "./ethers.min.js"
import {abi, contractAddress} from "./constants.js"


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const inputed = document.getElementById("ethAmount");
const balanceButton = document.getElementById("getBalance");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect(){
    if(window.ethereum != undefined){
        await window.ethereum.request({method:"eth_requestAccounts"})
        connectButton.innerHTML = "Connected";
    }else{
        connectButton.innerHTML = "Please install Metamask";
    }
}

async function getBalance(){
    if(window.ethereum !== undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}

async function withdraw(){
    if(window.ethereum !== undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,abi,signer);
        try{
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMine(transactionResponse, provider);

        }catch(error){
            console.log(error);
        }
    }
}
async function fund(ethAmount){
    ethAmount = inputed.value;
    console.log(`Funding me with ${ethAmount}....`);

    
    if(window.ethereum !== undefined){
        // 1 provideer / connection to the blockchain
        // 2 signer / wallet / someone with some gas
        // contract that we are interacting with ABI and address
       // await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try{        
            const transactionResponse = await contract.fund({value : ethers.utils.parseEther(ethAmount)})
            await listenForTransactionMine(transactionResponse, provider);
            console.log('Done!')
        }
        catch(err){
            console.log(err);
        }
    }
}

function listenForTransactionMine(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}.......`);
    return new Promise( (resolve,reject)=>{
        provider.once(transactionResponse.hash, (transactionReceipt)=>{
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
        resolve();
        })
    })
}

// withdraw