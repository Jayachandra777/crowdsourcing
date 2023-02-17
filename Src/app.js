// Get the contract instance

const contractAddress = "YOUR_CONTRACT_ADDRESS";

const contractABI = "YOUR_CONTRACT_ABI";

const web3 = new Web3(window.celo);

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to donate to a project

async function donate(projectId, amount) {

  const accounts = await web3.eth.getAccounts();

  const cUSDAddress = "YOUR_CUSD_CONTRACT_ADDRESS";

  const decimals = 18;

  // Approve the transfer of cUSD

  const cUSDContract = new web3.eth.Contract(ERC20ABI, cUSDAddress);

  const approveAmount = web3.utils.toBN(amount).mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));

  await cUSDContract.methods.approve(contractAddress, approveAmount).send({from: accounts[0]});

  // Donate to the project

  const weiAmount = web3.utils.toWei(amount);

  await contract.methods.donate(projectId).send({from: accounts[0], value: weiAmount});

  // Update the UI

  refreshUI();

}

// Function to create a new project

async function createProject(name, targetAmount) {

  const accounts = await web3.eth.getAccounts();

  const weiTargetAmount = web3.utils.toWei(targetAmount);

  await contract.methods.createProject(name, weiTargetAmount).send({from: accounts[0]});

  // Update the UI

  refreshUI();

}

// Function to get the list of projects

async function getProjects() {

  const totalProjects = await contract.methods.getTotalProjects().call();

  const projects = [];

  for (let i = 0; i < totalProjects; i++) {

    const project = await contract.methods.projects(i).call();

    const balance = web3.utils.fromWei(project.balance);

    const targetAmount = web3.utils.fromWei(project.targetAmount);

    projects.push({

      id: project.id,

      name: project.name,

      balance: balance,

      targetAmount: targetAmount,

      isOpen: project.isOpen

    });

  }

  return projects;

}

// Function to refresh the UI

async function refreshUI() {

  // Get the list of projects and update the UI

  const projects = await getProjects();

  // ...

  // Update the project details when clicked

  const projectLinks = document.querySelectorAll(".project-link");

  projectLinks.forEach(link => {

    link.addEventListener("click", async event => {

      event.preventDefault();

      const projectId = event.target.dataset.projectId;

      const project = await contract.methods.projects(projectId).call();

      // ...

      // Update the donate button

      const donateButton = document.querySelector("#donate-button");

      donateButton.dataset.projectId = projectId;

      donateButton.disabled = !project.isOpen;

    });

  });

  // Handle the donate button click

  const donateButton = document.querySelector("#donate-button");

  donateButton.addEventListener("click", async event => {

    event.preventDefault();

    const projectId = event.target.dataset.projectId;

    const amount = document.querySelector("#donation-amount").value;

    await donate(projectId, amount);

  });

  // Handle the create project form submission

  const createProjectForm = document.querySelector("#create-project-form");

  createProjectForm.addEventListener("submit", async event => {

    event.preventDefault();

    const name = document.querySelector("#project-name").value;

    const targetAmount = document.querySelector("#project-target-amount").value;

    await createProject(name, targetAmount);

  });

}

// Initialize the UI

refreshUI();

