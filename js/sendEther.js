window.userWalletAccount = null
const errorMessage = document.querySelector('#errorMessage')
const sentAddress = document.querySelector('#sentAddress')
const sentAmount = document.querySelector('#sentAmount')
const transactionMessage = document.querySelector('#transactionMessage')
const accountAlert = document.querySelector('#accountAlert')
const amountAlert = document.querySelector('#amountAlert')
const sendButton = document.querySelector('#sendButton')

const web3 = new Web3(Web3.givenProvider)
contract = new web3.eth.Contract(contractABI,contractAddress);


// send transaction
async function sendTransaction(){
	if(sentAddress.value.toLowerCase() == window.userWalletAccount.toLowerCase()){
		alert('You cant send ether to yourself')
	}
	const txObject = {
		gasLimit: Web3.utils.toHex(80000),
		gasPrice: Web3.utils.toHex(Web3.utils.toWei('10', 'gwei')), 
		from : window.userWalletAccount,
		to : sentAddress.value,
		value : Web3.utils.toHex(Web3.utils.toWei(sentAmount.value))	
	}
	window.ethereum.request({ method:'eth_sendTransaction', params: [txObject] })
	.then((txHash) => {
		console.log(txHash)
		transactionMessage.innerText = 'Transaction success ! Your transaction hash is : ' + txHash
		transactionMessage.href = "https://kovan.etherscan.io/tx/"+txHash
	})
	.catch((error) => {
		console.log(error.message)
		alert(error.message)
	})
	.finally(() => {
		sendButton.disabled = false
		sendButton.innerText = 'Send !'
	})
	sendButton.disabled = true
	sendButton.innerHTML = 'sending transaction ...<br> please wait for transaction hash'
}


// check valid format
function enableTransactionButton(){
	if(sentAddress.value !='' && web3.utils.isAddress(sentAddress.value) && sentAmount.value!='' && parseFloat(sentAmount.value)==sentAmount.value && parseFloat(sentAmount.value)>0){	
		sendButton.disabled = false
	}
}

function restrictAddress(){
	if(! web3.utils.isAddress(sentAddress.value)){
		accountAlert.style.display = 'block'
		sendButton.disabled = true
	}
	else{
		accountAlert.style.display = 'none'
		enableTransactionButton()
	}
}

function restrictAmount(){
	if(parseFloat(sentAmount.value)!=sentAmount.value || parseFloat(sentAmount.value)<=0){
		amountAlert.style.display = 'block'
		sendButton.disabled = true
	}
	else{
		amountAlert.style.display = 'none'
		enableTransactionButton()
	}
}


// log in 
function countdown(second, to){
	var beginTime = new Date().getTime()
	setInterval( function(){
		var now = new Date().getTime()
		errorMessage.innerText = 'You have not been logged in, redirecting to login page in ' + Math.floor((5000-(now-beginTime))/1000).toString() + ' second'
		if(now-begin>=5000){
			clearInterval()
		}
	}, 0)
	setTimeout(function(){window.location.replace(to)}, second*1000)
}

document.addEventListener('DOMContentLoaded', async function (){
	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
	.then( (accounts) => {
		window.userWalletAccount = accounts[0]
		window.ethereum.request({method: 'eth_getBalance', params: [window.userWalletAccount, 'latest']})
		.then((bal) => { 
			balance.style.display = 'block'
			balance.innerText = 'Your account balance : ' + Web3.utils.fromWei(Web3.utils.hexToNumberString(bal),'ether') 
		})
		.catch((error) => { 
			console.error(error.message) 
		})
	})
	.catch((e) => {
		console.error(e.message)
		countdown(5,'/')
	})
})


window.ethereum.on('accountsChanged',function(){window.location.reload()})
window.ethereum.on('chainChanged',function(){window.location.reload()})
