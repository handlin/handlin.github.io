/*
 * Create vis.js plot data
 * using previously generated input data
 */
function createPlotData(PLOT_TYPE="surface_1", inputData=[1]) { 
	// Create and populate data table
	// const vis = require('vis'); // TODO: need to stop using cdn for vis.js and build with npm
	let data = new vis.DataSet(); // output data to plot (x,y,z)
	
	// z-functions: z = f(x,y)
	let counter	= 0
	const steps	= NUM_STEPS_PER_AXIS
	const xMin	= -500
	const xMax	= 500
	const yMin	= -500
	const yMax	= 500
	const xStep	= (xMax - xMin) / steps;
	const yStep	= (yMax - yMin) / steps;
	
	
	
	
	// TODO: Save input data so user can just call different plot types on it without calling YouTube API again
	


	
	if (PLOT_TYPE === "surface_1") {
		
		// Always returns the same surface for a given video and number of comments
		
		console.log("using \'surface_1\' plot");
				
		for (let x = xMin; x < xMax; x+=xStep) {
			for (var y = yMin; y < yMax; y+=yStep) {
				var z = surface_1(x,y,inputData);
				
				// console.log(x,y,z);
				
				data.add({id:counter++, x:x, y:y, z:z, style:z});
			}
		}		
		
		// How many points were generated? (for figuring out what a reasonable max is):
		console.log("Number of points generated = " + counter)  
		
	} else if (PLOT_TYPE === "surface_2") {
		
		// Returns a different surface every time its run, even for the same video
		// uses random mod (surface_2) approach
		
		const randomIndex = randomNumBelow(inputData.length);
		
		console.log("random index = " + randomIndex);
		console.log("randomly indexed parameter = " + inputData[randomIndex]);	
		console.log("using \'surface_2\' plot");
				
		for (let x = xMin; x < xMax; x+=xStep) {
			for (let y = yMin; y < yMax; y+=yStep) {
				let z = surface_2(x,y,inputData, randomIndex);
				
				// console.log(x,y,z);
				
				data.add({id:counter++, x:x, y:y, z:z, style:z});
			}
		}		
	
		// How many points were generated? (for figuring out what a reasonable max is):
		console.log("Number of points generated = " + counter)  
		
	} else if (PLOT_TYPE === "commentLengthsVsTime") {

		/*
		// Plot comment length vs time
		// IT NO WORK
		commentLengths = [];
		dates = [];
		function convertDatetimeToInt(date) {
			// convert datetime to number of milliseconds elapsed since midnight January 1, 1970
			var date = new Date(date);
			return date.getTime();
		}
		var startTimeInt = convertDatetimeToInt(inputData[inputData.length-1][0]);
		for (var i = 0; i < inputData.length; i++) {
			var x = convertDatetimeToInt(inputData[i][0]) - startTimeInt;
			// var x = inputData[i][0];
			var y = inputData[i][1];
			console.log(x,y);
			data.add({x:x, y:y});
		}
	
		commentLengths = [];
		dates = [];
		for (var i = 0; i < inputData.length; i++) {
			commentLengths.push(inputData[i][1]);
			dates.push(inputData[i][0]);
		}
		*/
	
	} else if (PLOT_TYPE === "animation") {
		
		console.log("NEED TO SET UP ANIMATION STUFF");
		
		/*
		// Animation
		var data = new vis.DataSet(); // output data to plot (x,y,z)
		
		commentLengths = [];
		for (var i = 0; i < inputData.length; i++) {
			commentLengths.push(inputData[i][1]);
			for (var x = xMin; x < xMax; x+=xStep) {
				for (var y = yMin; y < yMax; y+=yStep) {
					// if (i===3) {console.log("x = " + x + ", y = " + y + ", commentLengths = " + commentLengths )} 
					var z = surface_1(x,y,commentLengths);
					
					// console.log(x,y,z);
					
					//if (isNaN(z)) {
					//	console.log("z = "+ z + ", is NaN");
					//	z = 0;
					//}
					
					data.add({id:counter++, x:x, y:y, z:z, filter:i, style:z});
					// data.add({id:counter++, x:x, y:y, z:z, style:z});
				}
			}
		}	
		*/
		
	}
	
	return data;
}

/* 
 * Get options for vis.js 3d plotting
 * from user input or defaults
 */
function getVisOptions() {
	// if ($('#showAxes').is(':checked')) { 	// show axes?
	if (document.getElementById('showAxes').checked === true) { 	// show axes?
		var showAxis = true; 				// do show axes
	} else {
		var showAxis = false; 				// don't show axes
	}
	
	// console.log("plot style = "+document.getElementById('plotStyle').val());
	
	var options = {
		width: '100%', 		//TODO: Fix (need to set up CSS so this doesnt overflow)
		height: '100%',
		// width: '600px',
		// height: '600px',
		// style: $('#plotType').val(),
		// style: document.getElementById('plotStyle').value,
		// style: "line", // need to change background to white or figure out how to make line color white 
		// style: "grid",
		style: "surface",
		showPerspective: true,
		showGrid: showAxis, // if we don't show axes, don't show grid
		// showGrid: true, // if we don't show axes, don't show grid
		showShadow: false,
		keepAspectRatio: true,
		verticalRatio: 0.5,
		showXAxis: showAxis,
		showYAxis: showAxis,
		showZAxis: showAxis,
		// cameraPosition.vertical: 1.0, // doesn't work??
		xCenter: "52%",
		yCenter: "38%",
		// animationInterval: 100, // milliseconds
		// animationPreload: true
		// start: '2018-02-16T20:19:07.000Z',
		// end: '2018-03-21T09:29:55.000Z'
	}	
	
	return options;
}