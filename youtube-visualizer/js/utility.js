/********************************* 
	Math Stuff
**********************************/
/* 
 * f(x,y) = sum_i { sin(x / p_i) * cos(y / p_i) * p_i + p_i }
 * 
 * Function defining a surface
 * Returns the z-value of surface at a given x and y
 * ... using a given list of input parameters [p_i]
 */
function surface_1(x, y, parameters) {
	let z = 0;
	// let z = 1;
	for (i=0; i < parameters.length; i++) {
		let p = parameters[i]
		z += Math.sin(x/p)*Math.cos(y/p)*p + p
		// z *= Math.sin(x/p)*Math.cos(y/p)
	}
	return z;
}

/* 
 * f(x,y) = sum_i { sin(x / q_i) * cos(y / q_i) * q_i + q_i }
 * ... where q_i = p_i mod (pRand)
 * ... and pRand = a randomly chosen p_i 
 * ... (but SAME random p_i for all q_i in a given execution of this function)
 * 
 * Function defining a surface
 * Returns the z-value of surface at a given x and y
 * ... using a given list of input parameters [p_i]
 */
function surface_2(x, y, parameters, randomIndex) {
	let z = 0;
	const randomP = parameters[randomIndex];
	
	for (i=0; i < parameters.length; i++) {
		let p = parameters[i]
		q_i = mod(p, parameters[randomIndex]) + 1; 
		z += Math.sin(x/q_i + randomP)*Math.cos(y/q_i + randomP)*q_i + q_i
	}
	return z;
}

/* 
 * f(x,y) = product_i { sin(x / p_i) * cos(y / p_i) * p_i + p_i }
 * 
 * Function defining a surface
 * Returns the z-value of surface at a given x and y
 * ... using a given list of input parameters [p_i]
 */
function surface_3(x, y, parameters) {
	let z = 1;
	for (i=0; i < parameters.length; i++) {
		let p = parameters[i]
		z *= Math.sin(x/p)*Math.cos(y/p)
	}
	return z;
}

/*
 * Random number generator:
 * Return a random integer in [1, max]
 */
const randomNumBelow = (max) => ( Math.floor(Math.random() * max) + 1 )

/* 
 * Random number list generator:
 * Returns a list of random integers 
 * maxValue = maximum value of any entry in the list
 * ... default = 100
 * maxListSize = maximum number of entries in the list
 * ... default = 50
 */
function randomNumList(maxValue = 100, maxListSize = 50) {
	listSize = randomNumBelow(maxListSize);
	const numList = [];
	for (let i=0; i < listSize; i++) {
		numList.push( randomNumBelow(maxValue) );
	}
	
	return numList
}

/*
 * Computes x mod n
 * for arbitrary integer x and natural number n
 * 
 * TODO: implement warning for bad input?
 */
const mod = (x, n) => (x % n + n) % n

/* Return average of array values */
const arrAvg = arr => arr.reduce((accumulator, value) => accumulator + value, 0) / arr.length

/********************************* 
	Console Logging Helpers
**********************************/
		
// Log formatted JSON to console
function logJsonAsText(jsonJSON) {
	console.log(JSON.stringify(jsonJSON, null, '\t'));
}

// Log formatted array to console
function logArray(array) {
	let loggedArray = "["
	for (i = 0; i < array.length; i++) {
		let entry = array[i];
		loggedArray += entry + ", "
	}	
	loggedArray = loggedArray.slice(0,-2) // cut off final ", "
	loggedArray += "]"
	console.log(loggedArray);
}


/********************************* 
	Fetch API Stuff
**********************************/

function fetchJsonWrapper(requestUrl, handleResponse, handleError=logError) {
	const fetchExists = isFetchApiAvailable();
	
	// let options = 
	
	if (fetchExists) {
		
		fetch(requestUrl, )
			.then(validateResponse)
			.then(readResponseAsJson)
			.then(handleResponse)
			.catch(handleError);
	} else {
		console.log("Fetch doesn't exist, update browser");
	}
}

function validateResponse(response) {
	if (!response.ok) {
		console.log("Fetch error!\n");
		
		console.log("response text:\n");
		logJsonAsText(response.json());
		
		console.log("status text: \n" + response.statusText);
		
		console.log("status: \n" + response.status);
		
		console.log("response url: \n" + response.url);
		
		console.log("response type: \n"+ response.type);
		
		throw Error(response.statusText);
	}
	
	/*	
	else {
		
		console.log("status text: \n" + response.statusText);
		
		console.log("status: \n" + response.status);
		
		console.log("response url: \n" + response.url);
		
		console.log("response type: \n"+ response.type);
	}
	*/
	
	return response;
}

function readResponseAsJson(response) {
	return response.json();
}

// TODO: fill this error handling out a bit more
function logError(error) {
	console.log('Error fetching YouTube data: \n', error);
}
	
function isFetchApiAvailable() {
	if (!('fetch' in window)) {
		console.log('Fetch API not found, try including the polyfill');
		alert('Fetch API not found, try updating your browser');
		return false;
	} else {
		return true;
		// We can safely use fetch from now on
	}
}

/********************************* 
	Loading Screen Functions
**********************************/

function startLoadingMessage() {
	document.querySelector('#videoTitle h3').innerHTML = "Loading ...";
}

function stopLoadingMessage(error=false) {
	if (error) {
		document.querySelector('#videoTitle h3').innerHTML = "Error: " + error;
	} else {
		document.querySelector('#videoTitle h3').innerHTML = "Video Title: <span></span>";
	}
}

function startLoadingScreen() {
	// $('#visualization').addClass("visualizationLoading");
	console.log("visualization loading");
	document.getElementById('visualization').classList.add("visualizationLoading");
	document.getElementById('visualization').classList.add("spinner");
	document.getElementById("updateButton").disabled = true; // stop people from reloading the plot while reload is already in progress
}

function stopLoadingScreen() {
	// $('#visualization').addClass("visualizationLoading");
	document.getElementById('visualization').classList.remove("visualizationLoading");
	document.getElementById('visualization').classList.remove("spinner");
	document.getElementById("updateButton").disabled = false;
	// console.log("visualization ready");
}

/********************************* 
	OTHER FUNCTIONS
**********************************/

function outlineDiv(source,targetId) {
	target = document.getElementById(targetId);
	target.classList.add("outlineBox");
	source.classList.add("highlightText");
	source.addEventListener("mouseleave", function() {
		target.classList.remove("outlineBox");
		source.classList.remove("highlightText");
	});
}