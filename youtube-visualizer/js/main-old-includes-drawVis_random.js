// TODO: make these non-global? but also i think its honestly fine
const YOUTUBE_API_KEY = "AIzaSyBW67fshbZ-BAzrgXUtRVd8jo94atDf0cs" // TODO: move this onto server
const MAX_COMMENTS_PER_PAGE = 100; // maximum number of comments you're allowed to get in one API call
const MAX_COMMENTS_TO_PROCESS = 300;


function drawVisualization(inputDataType="YouTube", inputData) {
	// Input validation 
	inputDataType = inputDataType.toLowerCase();
	/*
	 * valid inputDataType options:
	 * "youtube" - generate data from comments section of youtube video 
	 * "random" - generate a list of random positive integers 
	 * "manual" - start creating the actual visualization using data generated from "youtube" or "random"
	 */
	 
	var inputDataExists = true;
	if (inputData === undefined) {
		inputDataExists = false;
	}
	

	
	// TODO: validate input data is correct for type "random" 
	// ... should be: inputData = [maxValue, maxListSize]
	
	
	
	
	/************************************* 
		WHAT KIND OF VISUALIZATION? 
	**************************************/
	// Input parameters = lengths of comments for given YouTube video as 
	if (inputDataType === "youtube") { 
		if (inputDataExists) {
			console.log("Cannot call \'drawVisualization()\' with input data if inputDataType = \'youtube\'");
		} else {
			const videoUrl = document.getElementById('videoUrl').value;	// get video url
			console.log("video URL = "+ videoUrl);
			const videoId = getYoutubeIdFromUrl(videoUrl);				// get video id from url
			getYoutubeDataThenDrawVisualization(videoId)		// get comments info for video and do something with it
		}
	
	// Input parameters = list of random positive integers
	} else if (inputDataType === "random") {
		drawVisualization("manual", generateRandomInputData(inputData) );
	
	// Input parameters = "manually" chosen
	// EVERYTHING SHOULD END UP HERE EVENTUALLY!
	} else if (inputDataType === "manual") { 
		console.log("starting visualization!");
		
		var data = createPlotData(inputData); 						// Create and populate plot data table
		var options = getVisOptions(); 								// Set plot options
		var container = document.getElementById('visualization');	// Set DOM location of plot
		// var container = $('#visualization');						// Set DOM location of plot -- TODO: breaks using JQuery for some reason!
		var graph3d = new vis.Graph3d(container, data, options);	// Create visualization (plot)!
		// var graph2d = new vis.Graph2d(container, data, options);	// Create visualization (plot)!
		
	} else {
		console.log("inputDataType = " + inputDataType + " is invalid for function \'drawVisualization(inputDataType)\'")
	}
}

function getYoutubeDataThenDrawVisualization(videoId) {
	
	
	

	waitingDisplay(); //TODO: make work
	
	
	
	
	
	updateVideoTitle(videoId)
	
	// TODO: choose whether we're getting comment lengths OR comment lengths and times
	// (so we don't get data we don't need)
	
	const MAX_COMMENTS_PER_PAGE = 100;
	
	var apiUrl = buildCommentsApiRequestUrl(videoId);
	var commentPageNumber = 1;
	var commentsTimesLengths = []; 
	makeApiCommentRequest(apiUrl, commentPageNumber, commentsTimesLengths ); // make first api request (ie get the first page of comments)
	
	// TODO: make this function stand alone? (right now it needs to be nested in the outer "getCommentSectionDataAndDrawVisualization"
	/*
	 * Recursively make API call and accrue comment data 
	 * until all comment pages for the video have been checked or comment limit has been reached,
	 * then draw with the results
	 */
	function makeApiCommentRequest(apiUrl, commentPageNumber, commentsTimesLengths) {
		
		
		
		
		//TODO: what if the video has no comments? 
		// example: https://www.youtube.com/watch?v=KTkCPqBY7Gs
		// do all live videos have no comments?
		
		
		
		
		
		
		fetchJsonWrapper(apiUrl, recurseOrDraw);
		
		// Parse results of YouTube API call, then either:
		// ... recurse (call "makeApiCommentRequest" again for next page of comments) 
		// ... or draw (call "drawVisualization" if we're on the last page of comments or reached max number of comments to process)
		function recurseOrDraw(jsonResponse) { 
			// var commentsThisPage = parseComments(jsonResponse);
			var commentsThisPage = parseComments_TimeLength(jsonResponse);
			var i;
			for (i = 0; i < commentsThisPage.length; i++) {
				commentsTimesLengths.push(commentsThisPage[i]);
			}
			var commentsProcessed = i + MAX_COMMENTS_PER_PAGE*(commentPageNumber-1);
			// console.log("comment page = " + page);
			console.log("comments processed = " + commentsProcessed);
			commentPageNumber++;
			
			var nextPageToken = jsonResponse.nextPageToken; // if there's another page of comments, this is the token to get it with the api call. Otherwise this is empty
			if ( commentsProcessed >= MAX_COMMENTS_TO_PROCESS) {
				console.log("Maximum number of comments (" + MAX_COMMENTS_TO_PROCESS + ") reached. Halting API calls");
				nextPageToken = false; // if we've processed too many comments, time to stop
			}
			if (nextPageToken) { // if another page of results exists ...
				apiUrl = buildCommentsApiRequestUrl(videoId, nextPageToken); 	// ... build api url for that page
				makeApiCommentRequest(apiUrl, commentPageNumber, commentsTimesLengths); 				// ... and request that page (recursively)
			} else { // if this is the last page of results ...
				
				// var sortedArray = commentsTimesLengths.sort(function(a,b){return b-a});
				// logArray(sortedArray); // Log the list of comment lengths
				
				console.log("comments processed at draw time = "+ commentsProcessed);
				drawVisualization("manual", commentsTimesLengths); 			//... draw with the results!
			}
		}
	}
}

// Create random input data (list of random positive integers)
function generateRandomInputData(parameters=[100, 100]) { 
	/* 	
	 * parameters[0] = max value in the list (default 100)
	 * parameters[1] max size of the list (default 100)
	 */
	return randomNumList(parameters[0], parameters[1]);
}

/*
 * Create vis.js plot data
 * using previously generated input data
 */
function createPlotData(inputData=[1]) { 
	// Create and populate data table
	// var vis = require('vis'); // TODO: need to stop using cdn for vis.js and build with npm
	var data = new vis.DataSet(); // output data to plot (x,y,z)
	
	// z-functions: z = f(x,y)
	var counter = 0
	var steps=50
	var xMin=-500
	var xMax=500
	var yMin=-500
	var yMax=500
	var xStep = (xMax - xMin) / steps;
	var yStep = (yMax - yMin) / steps;
	
	// for random mod (surface_2) approach:
	var randomIndex = randomNumBelow(inputData.length);
	console.log("random index = " + randomIndex);
	console.log("randomly indexed parameter = " + inputData[randomIndex]);

	
	//	// Plot comment length vs time
	//	// IT NO WORK
	//	commentLengths = [];
	//	dates = [];
	//	function convertDatetimeToInt(date) {
	//		// convert datetime to number of milliseconds elapsed since midnight January 1, 1970
	//		var date = new Date(date);
	//		return date.getTime();
	//	}
	//	var startTimeInt = convertDatetimeToInt(inputData[inputData.length-1][0]);
	//	for (var i = 0; i < inputData.length; i++) {
	//		var x = convertDatetimeToInt(inputData[i][0]) - startTimeInt;
	//		// var x = inputData[i][0];
	//		var y = inputData[i][1];
	//		console.log(x,y);
	//		data.add({x:x, y:y});
	//	}
	
	// Static surface plot
	commentLengths = [];
	dates = [];
	for (var i = 0; i < inputData.length; i++) {
		commentLengths.push(inputData[i][1]);
		dates.push(inputData[i][0]);
	}
	for (var x = xMin; x < xMax; x+=xStep) {
		for (var y = yMin; y < yMax; y+=yStep) {
			// var z = surface_1(x,y,inputData);
			var z = surface_2(x,y,commentLengths, randomIndex);
			
			// console.log(x,y,z);
			
			data.add({id:counter++, x:x, y:y, z:z, style:z});
		}
	}
	
	//// Animation
	//var data = new vis.DataSet(); // output data to plot (x,y,z)
	//
	//commentLengths = [];
	//for (var i = 0; i < inputData.length; i++) {
	//	commentLengths.push(inputData[i][1]);
	//	for (var x = xMin; x < xMax; x+=xStep) {
	//		for (var y = yMin; y < yMax; y+=yStep) {
	//			// if (i===3) {console.log("x = " + x + ", y = " + y + ", commentLengths = " + commentLengths )} 
	//			var z = surface_1(x,y,commentLengths);
	//			
	//			// console.log(x,y,z);
	//			
	//			//if (isNaN(z)) {
	//			//	console.log("z = "+ z + ", is NaN");
	//			//	z = 0;
	//			//}
	//			
	//			data.add({id:counter++, x:x, y:y, z:z, filter:i, style:z});
	//			// data.add({id:counter++, x:x, y:y, z:z, style:z});
	//		}
	//	}
	//	// console.log("last z = " +z);
	//	if (i === MAX_COMMENTS_TO_PROCESS) {
	//		console.log("Truncating to first " + MAX_COMMENTS_TO_PROCESS + " comments");
	//		break;
	//	}
	//}
/*	
	// parametric functions: f(t) = g(x,y,z)
	var counter = 0;
	var uMax = 10;
	var uSteps = 100;
	var uStep = uMax / uSteps;
	
	var vMax = 4 * uMax;
	var vSteps = 100;
	var vStep = vMax / vSteps;
	
	p = 1;
	
	for (var u = 0; u < uMax; u += uStep) {
		for (var v = 0; v < vMax; v += vStep) {
			var x = u * Math.cos(v);
			var y = u * Math.sin(v);
			var z = p * v;
			console.log(x,y,z)
			data.add({id:counter++, x:x, y:y, z:z, style:z});
		}
	}
*/	
	// How many points were generated? (for figuring out what a reasonable max is):
	console.log("Number of points generated = " + counter) 
	
	return data;
}

/* 
 * Get options for vis.js 3d plotting
 * from user input or defaults
 */
function getVisOptions() {
	if ($('#showAxes').is(':checked')) { 	// show axes?
		var showAxis = true; 				// do show axes
	} else {
		var showAxis = false; 				// don't show axes
	}
	
	console.log("plot style = "+$('#plotStyle').val());
	
	var options = {
		width: '100%', 		//TODO: Fix (need to set up CSS so this doesnt overflow)
		height: '100%',
		// width: '600px',
		// height: '600px',
		style: $('#plotStyle').val(),
		// backgroundColor: {fill: "#f4f4d9", stroke: "#DED8BF", strokeWidth: 1},
		showPerspective: true,
		showGrid: showAxis, // if we don't show axes, don't show grid
		showShadow: false,
		keepAspectRatio: true,
		verticalRatio: 0.5,
		showXAxis: showAxis,
		showYAxis: showAxis,
		showZAxis: showAxis,
		animationInterval: 100, // milliseconds
		animationPreload: true
	// start: '2018-02-16T20:19:07.000Z',
	// end: '2018-03-21T09:29:55.000Z'
	}	
	
	return options;
}