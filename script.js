const contractAddress = "0x9A3209d94B909682BB1F936c5f7CC334Edf76077";
const contractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        internalType: "string",
        name: "message",
        type: "string"
      }
    ],
    name: "sendMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getMessage",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "getMessageFrom",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

let signer;
// const signer = provider.getSigner();
let contract;

async function connectMetamask() {
  // console.log("Attempting to connect Metamask");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  // console.log("Awaiting provider");
  signer = await provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);

  if (signer) {
    let connectBtn = document.getElementById("connectMetamask");
    let address = await signer.getAddress();
    let truncAddress = address.slice(0, 5) + "..." + address.slice(-4);
    connectBtn.innerHTML = truncAddress;
    connectBtn.classList.remove("btn-warning");
    connectBtn.classList.add("btn-dark");
  } else {
    connectBtn.innerHTML = "Connect MetaMask";
    connectBtn.classList.remove("btn-dark");
    connectBtn.classList.add("btn-warning");

  }

  // Load last msg immediately after connecting metamask
  await getMessage();
}

let lastSentMessage = "";

async function sendMessage() {
  const recipientAddress = document.getElementById("recipientAddress").value;
  const message = document.getElementById("message").value;

  // send the transaction and wait for confirmation
  const tx = await contract.sendMessage(recipientAddress, message);
  await tx.wait();

  // load the last message that was sent
  let sentMessage = await contract.getMessageFrom(signer.getAddress());
  let messagesDiv = document.getElementById("messages");

    // compare the new message to the last loaded message
    if (sentMessage !== lastSentMessage) {
      let messageNode = document.createElement("p");
      messageNode.classList.add(
        "lead",
        "bg-success",
        "text-light",
        "py-2",
        "px-3",
        "my-3",
        "mx-0",
        "rounded-pill",
        "w-50"
      );
      messageNode.innerText = sentMessage;
      messagesDiv.appendChild(messageNode);
  
      // update the last loaded message
      lastLoadedMessage = newMessage;
      // console.log(`Last message received: ${newMessage}`);
    }
}

let lastLoadedMessage = "";

async function getMessage() {
  let newMessage = await contract.getMessage();
  let messagesDiv = document.getElementById("messages");

  // compare the new message to the last loaded message
  if (newMessage !== lastLoadedMessage) {
    let messageNode = document.createElement("p");
    messageNode.classList.add(
      "lead",
      "bg-primary",
      "text-light",
      "py-2",
      "px-3",
      "my-3",
      "mx-0",
      "rounded-pill",
      "w-50"
    );
    messageNode.innerText = newMessage;
    messagesDiv.appendChild(messageNode);

    // update the last loaded message
    lastLoadedMessage = newMessage;
    // console.log(`Last message received: ${newMessage}`);
  } else {
    alert("All messages loaded.");
  }
}
