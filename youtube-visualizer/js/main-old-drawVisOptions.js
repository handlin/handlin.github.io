// TODO: make these non-global? but also i think its honestly fine
const YOUTUBE_API_KEY = "AIzaSyBW67fshbZ-BAzrgXUtRVd8jo94atDf0cs" // TODO: move this onto server
const MAX_COMMENTS_PER_PAGE = 100; // maximum number of comments you're allowed to get in one API call

const NUM_STEPS_PER_AXIS = 60;


const VISUALIZATION_TYPE = "youtube"; // IF WE GO THIS ROUTE, SHOULD BE DEFINED IN USER INPUT


function drawVisualization() {
	
	/************************************* 
		WHAT KIND OF VISUALIZATION? 
	**************************************/

	if (VISUALIZATION_TYPE === "youtube") {
	
		// Input parameters = list of lengths of YouTube comments for given video
		
		const videoId = getVideoId();
		
		getYoutubeDataThenUpdateVisualization(videoId)	// get comments info for video and do something with it
		
	} else if (VISUALIZATION_TYPE === "random") {
		
		// Input parameters = list of random positive integers
		updateVisualization(generateRandomInputData());
		
	} else if (VISUALIZATION_TYPE === "animation") {
		
		console.log("NEED TO SET UP ANIMATION STUFF");
		// getYoutubeDataThenUpdateVisualizationWtihAnimation(videoId)
		
	}
}

function updateVisualization(inputData) {
	
	console.log("starting visualization!");
	
	const data = createPlotData(inputData); 						// Create and populate plot data table
	const options = getVisOptions(); 								// Set plot options
	// const container = $('#visualization');	// Set DOM location of plot -- TODO: breaks using JQuery for some reason!
	const container = document.getElementById('visualization');		// Set DOM location of plot
	
	
	
	stopLoadingMessage();
	updateVideoTitle(getVideoId()) // get and display video title
	stopLoadingScreen();
	
	const graph3d = new vis.Graph3d(container, data, options);		// Create plot! (ie the visualization)
	// const graph2d = new vis.Graph2d(container, data, options);	// Create plot! (ie the visualization)	
}


function getYoutubeDataThenUpdateVisualization(videoId) {
	
	const MAX_COMMENTS_TO_PROCESS = document.getElementById("maxCommentsToRetrieve").value;
	// TODO: define this globally? 
	
	startLoadingMessage();
	startLoadingScreen(); 
	
	
	
	
	
	//TODO: If visualization fails, display error message in plot window
	
	
	
	
	
	
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
		
		
		
		
		
		
		fetchJsonWrapper(apiUrl, recurseOrDraw);
		
		
		
		
		
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
			if ( commentsProcessed >= MAX_COMMENTS_TO_PROCESS) {
				console.log("Maximum number of comments (" + MAX_COMMENTS_TO_PROCESS + ") reached. Halting API calls");
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
				
				updateVisualization(commentsLengths); // ... draw with the results!
			}
		}
	}
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
	
	return randomNumList(maxValue, maxListSize);
}