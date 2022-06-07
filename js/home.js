window.userWalletAccount = null
const button = document.querySelector('#loginButton')
const address = document.querySelector('#walletAddress')
const balance = document.querySelector('#balance')
const url_1 = document.querySelector('#url_1')
const url_2 = document.querySelector('#url_2')
const currentNetwork = document.querySelector('#network')
const network = {
	'1' : 'Mainnet',
	'42' : 'Kovan',
	'3' : 'Ropsten',
	'4' : 'Rinkeby',
	'5' : 'Goerli'
}

async function Login() {
	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
	.catch((e) => { console.error(e.message) })
	if (!accounts) { return }

	window.userWalletAccount = accounts[0]
	address.innerText = 'Your account address : ' + window.userWalletAccount

	window.ethereum.request({method: 'eth_getBalance', params: [window.userWalletAccount, 'latest']})
	.then((bal) => { 
		balance.innerText = 'Your account balance : ' + Web3.utils.fromWei(Web3.utils.hexToNumberString(bal),'ether') 
	})
	.catch((error) => { 
		console.error(error.message) 
	})
	console.log('check')
	currentNetwork.innerText = 'Your current network : ' + network[window.ethereum.networkVersion]	
	url_1.style.display = 'block'
	url_2.style.display = 'block'
	console.log(window.ethereum.selectedAddress)

}

function triggerLogin(){
	if(typeof window.ethereum !== 'undefined'){
		document.addEventListener('DOMContentLoaded',Login())
	}
	else{
		address.innerText = 'MetaMask not installed'
	}
}

triggerLogin()

window.ethereum.on('accountsChanged',function(){window.location.reload()})
window.ethereum.on('chainChanged',function(){window.location.reload()})
