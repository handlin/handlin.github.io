//TODO: PUT THIS GOD DAMN KEY ON THE SERVER
// so that its not exposed in the client
const YOUTUBE_API_KEY = "AIzaSyATXiCXli4NL5nCbXG7HEctzXAhnkxtOgU" // TODO: move this onto server


const MAX_COMMENTS_PER_PAGE = 100; // maximum number of comments you're allowed to get in one API call
const NUM_STEPS_PER_AXIS = 60;
const MAX_COMMENTS_SUGGESTED = 1500;
const MAX_COMMENTS_HARD_LIMIT = 10000;





function drawVisualization() {

	let userInput = getUserInput();
	
	// get comments info for video and draw visualization with it
	getYoutubeDataThenUpdateVisualization(userInput);	
	
	// draw visualization with random inputs 
	// updateVisualization(generateRandomInputData(300, 200)) 
}

function getYoutubeDataThenUpdateVisualization(userInput) {
	
	startLoadingMessage();
	startLoadingScreen(); 

	const maxCommentsToProcess = userInput.maxComments;
	const videoId = userInput.videoId;
	
	// TODO: choose whether we're getting comment lengths OR comment lengths and times
	// (so we don't get data we don't need)
	
	const apiUrl = buildCommentsApiRequestUrl(videoId);
	let commentPageNumber = 1;
	let commentsLengths = [];

	// make initial api request (ie get the first page of comments):
	makeApiCommentRequest(apiUrl, commentPageNumber, commentsLengths ); 
	
	// TODO: make this function stand alone? 
	/*
	* Recursively make API call and accrue comment data 
	* ... until all comment pages for the video have been checked 
	* ... or comment limit has been reached,
	* ... then draw with the results
	*/
	function makeApiCommentRequest(apiUrl, commentPageNumber, commentsLengths) {
		
		
		
		
		//TODO: what if the video has no comments? 
		// example: https://www.youtube.com/watch?v=KTkCPqBY7Gs
		
		
		
		
		
		
		fetchJsonWrapper(apiUrl, recurseOrDraw, displayError);
		
		
		
		
		
		//PROBLEM WITH THIS APPROACH: each comment-page call is made CONSECUTIVELY (synchronously), and each one takes ~400ms (at leas twhen testing at work), most of which is just waiting for response from YouTube (~398ms -- only about 0.25 percent of the time is actually sending and receiving the request). So if we grab the first 10,000 comments, it only uses ~300 YouTube API quota, and only ~1.9MB of data, but takes ~40 seconds to load!
		
		
		
		
		
		/*
		* Parse results of YouTube API call, then either:
		* ... recurse (call "makeApiCommentRequest" again for next page of comments) 
		* ... or draw (call "drawVisualization")
		*/
		function recurseOrDraw(jsonResponse) { 
			const commentsThisPage = parseComments(jsonResponse);
			let i;
			for (i = 0; i < commentsThisPage.length; i++) {
				commentsLengths.push(commentsThisPage[i]);
			}
			const commentsProcessed = i + MAX_COMMENTS_PER_PAGE*(commentPageNumber-1);
			commentPageNumber++;
			
			
			console.log("comment page = " + commentPageNumber);
			// console.log("comments processed = " + commentsProcessed);
			
			
			let nextPageToken = jsonResponse.nextPageToken; // if there's another page of comments, this is the token to get it with the api call. Otherwise this is empty
			if ( commentsProcessed >= maxCommentsToProcess) {
				console.log("Maximum number of comments (" + maxCommentsToProcess + ") reached. Halting API calls");
				nextPageToken = false; // if we've processed too many comments, time to stop. KINDA HACKY (shouldn't rely on changing "nextPageToken")
			}
			if (nextPageToken) { // if another page of results exists ...
				
				// console.log("time to recurse and make another API call");
				
				apiUrl = buildCommentsApiRequestUrl(videoId, nextPageToken); 	// ... build api url for that page
				
				makeApiCommentRequest(apiUrl, commentPageNumber, commentsLengths); 	
				
			} else { // if this is the last page of results ...
				
				// var sortedArray = commentsLengths.sort(function(a,b){return b-a});
				// logArray(sortedArray); // Log the list of comment lengths
				// logArray(commentsLengths); // Log the list of comment lengths
				
				console.log("comments processed at draw time = "+ commentsProcessed);
				
				updateVisualization(userInput, commentsLengths); // ... draw with the results!
			}
		}
	}
}

function displayError(error) {
	logError(error);
	stopLoadingMessage(error)
	stopLoadingScreen();
}

function updateVisualization(userInput, inputData) {
	
	console.log("starting visualization!");

	const data = createPlotData(userInput.plotType, inputData); // Create and populate plot data table
	const options = getVisOptions(); 							// Set plot options
	// const container = $('#visualization');	// Set DOM location of plot -- TODO: breaks using JQuery for some reason!
	const container = document.getElementById('visualization');	// Set DOM location of plot
	
	stopLoadingMessage();
	updateVideoTitle(userInput.videoId) // get and display video title
	updateCommentStatistics(inputData);
	stopLoadingScreen();
	
	const graph3d = new vis.Graph3d(container, data, options);		// Create plot! (ie the visualization)
	// const graph2d = new vis.Graph2d(container, data, options);	// Create plot! (ie the visualization)	
}

function updateCommentStatistics(commentLengths) {
	let totalComments = commentLengths.length;
	let longestComment = Math.max(...commentLengths);
	let averageCommentLength = Math.round(arrAvg(commentLengths));
	
	// console.log(totalComments, longestComment, averageCommentLength);
	
	document.querySelector('#totalCommentsRetrieved').innerHTML = totalComments;
	document.querySelector('#longestCommentRetrieved').innerHTML = longestComment + " characters";
	document.querySelector('#averageCommentLength').innerHTML = averageCommentLength + " characters";
}


function getYoutubeDataThenUpdateVisualizationWithAnimation(videoId) {
	// use getYoutubeDataThenUpdateVisualization,
	// ... but instead of "parseComments" use "parseComments_TimeLength"
	// ... to get comments lengths AND times instead of just lengths
}

// Create random input data (list of random positive integers)
function generateRandomInputData(maxValue = 100, maxListSize = 200) { 
	// maxValue = max value in the list (default 100)
	// maxListSize = max size of the list (default 200)
	let randomList = randomNumList(maxValue, maxListSize);
	
	logArray(randomList);
	
	return randomList;
}

function getUserInput() {

	const videoUrl = document.getElementById('videoUrl').value;	// get video url
	const videoId = getYoutubeIdFromUrl(videoUrl);	// get video id from url
	let maxComments = document.getElementById("maxCommentsToRetrieve").value;
	let plotType =  document.getElementById("plotType").value;

	try  {
		if (!videoId) throw ("Invalid URL \nCould not extract video ID from URL");
		if (MAX_COMMENTS_SUGGESTED < maxComments && maxComments <= MAX_COMMENTS_HARD_LIMIT) throw (`Recommended number of comments is less than ${MAX_COMMENTS_SUGGESTED}. \n\nThis may take a minute (see 'How Does It Work > Next Page and Asynchronous Calls'). \n\nAre you sure?`);
		if (maxComments > MAX_COMMENTS_HARD_LIMIT) throw(`Maximum number of comments to retrieve is ${MAX_COMMENTS_HARD_LIMIT}.\nThis avoids issues with the YouTube API quota\nTry fewer comments.`)
		
	}
	
	catch(err) {
		alert(err);
	}

	let userInput = {
		videoId: videoId,
		maxComments: maxComments,
		plotType: plotType
	}
	
	return userInput;
}