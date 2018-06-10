/********************************* 
	GENERAL YOUTUBE STUFF
**********************************/

/*
 * Get video id from YouTube video URL
 * Sample URL: https://www.youtube.com/watch?v=YV9gP5xp7OE
 * ... video id = YV9gP5xp7OE
 * ... (ie 11 character alphaneumeric string following "v=")
 */
function getYoutubeIdFromUrl(url) {
	
	// CREDIT: https://ctrlq.org/code/19797-regex-youtube-id
	
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/; 
	var match = url.match(regExp); // match url string with regular expression
	
	// note: video ID = match[7], the 7th saved string in the returned regex match
	if (match && match[7].length == 11) { // YouTube video ID's are 11 characters long
	
		return match[7];
		
	} else {
		console.log("Could not extract video ID from URL");
		alert("Could not extract video ID from URL:\n\n" + url);
	}
}


/********************************* 
	VIDEO TITLE UPDATING
**********************************/

/*
 * Build YouTube API request URL for a video 
 * (DOESNT return comment results -- see "buildCommentsApiRequestUrl()")
 * using the YouTube video id and "nextPageToken"
 * to get that page of top level comments for that video
 */
function buildVideoApiRequestUrl(videoId) {
	
	var apiUrl = "https://www.googleapis.com/youtube/v3/videos?" 
	+ "id=" + videoId
	+ "&key=" + YOUTUBE_API_KEY 	
	+ "&fields=items(snippet(title))"
	// + "&fields=items(snippet(title), statistics(commentCount))" 
	+ "&part=snippet" 
	// + "&part=snippet,statistics" // for total number of comments (without having to grab them) 
	
	return apiUrl;
}

function updateVideoTitle(videoId) {
	var apiUrl = buildVideoApiRequestUrl(videoId);
	
	fetchJsonWrapper(apiUrl, getAndSetTitle);
}

function getAndSetTitle(jsonResponse) {
	var title =  jsonResponse.items[0].snippet.title;
	setVideoTitle(title);
	
	// logJsonAsText(jsonResponse);
	// console.log("GETTING TITLE");
	// console.log("Title = ",title);
}

function setVideoTitle(title) {
	$('#videoTitle').html(title);
}


/********************************* 
	COMMENTS STUFF
**********************************/

/*
 * Build YouTube API request URL for the comments of a video
 * using the YouTube video id and "nextPageToken"
 * to get that page of top level comments for that video
 */
function buildCommentsApiRequestUrl(videoId, nextPageToken="") {
	if (videoId === undefined) {
		console.log("Video ID required!")
		return;
	}

	var apiUrl = "https://www.googleapis.com/youtube/v3/commentThreads?"
	+ "videoId=" + videoId 
	+ "&key=" + YOUTUBE_API_KEY 
	+ "&maxResults=" + MAX_COMMENTS_PER_PAGE

	// + "&fields=items(snippet(topLevelComment))" 
	// Quota usage (repeated calls with "fields=items(snippet(topLevelComment))"):
	// with title call disabled (so only getting comments -- and video has 89 comments, so only 1 API call!):
	// 1244 -> 1247 -> 1250 -> 1253
	//     (3)    (3)    (3)	
	
	// + "&fields=nextPageToken" 
	// + "&fields=(items(nextPageToken,snippet(topLevelComment)))" 
	// Quota usage (repeated calls with "fields=items(nextPageToken, snippet(topLevelComment))"):
	// with title call disabled (so only getting comments -- and video has 89 comments, so only 1 API call!):
	// 1244 -> 1247 -> 1250 -> 1253
	//     (3)    (3)    (3)	

	// with title call:
	// 1226 -> 1232 -> 1238 -> 1244
	//     (6)    (6)    (6)	
	
	+ "&part=snippet" // get top level comments only (no replies)
	// Quota usage (repeated calls with "part = snippet"):
	// 1190 -> 1202 -> 1214 -> 1226
	//     (12)    (12)    (12)
	
	// + "&part=snippet,replies" // to get replies (not just top level comments)
	// Quota usage (repeated calls with "part = snippet,replies"):
	// 1136 -> 1154 -> 1172 -> 1190
	//     (18)    (18)    (18)
	
	if (nextPageToken) {
		apiUrl += "&pageToken=" + nextPageToken 
	}
	
	return apiUrl;
}

/*
 * Get a list of the LENGTHS 
 * of each top-level comment for a given YouTube video
 * by parsing the JSON response from the YouTube API for the requested video
 */
function parseComments(jsonResponse) {

	// logJsonAsText(jsonResponse);
	
	// var commentThreadList = jsonResponse.items;
	var commentLengths = [];
	var i;
	for (i = 0; i < jsonResponse.items.length; i++) {
		var commentText = jsonResponse.items[i].snippet.topLevelComment.snippet.textOriginal;
		commentLengths.push(commentText.length);
	}

	return commentLengths;
}

/*
 * Get a list of pairs of LENGTHS and DATETIMES WHEN POSTED 
 * of each top-level comment for a given YouTube video
 * by parsing the JSON response from the YouTube API for the requested video
 */
function parseComments_TimeLength(jsonResponse) {

	logJsonAsText(jsonResponse);
	
	var commentThreadList = jsonResponse.items;
	var commentLengthsTimes = [];
	var i;
	for (i = 0; i < commentThreadList.length; i++) {
		var commentText = commentThreadList[i].snippet.topLevelComment.snippet.textOriginal;
		var length = commentText.length;
		var datetime = commentThreadList[i].snippet.topLevelComment.snippet.publishedAt;
		commentLengthsTimes.push( [datetime, length] );
	}

	return commentLengthsTimes;
}


/********************************* 
	OTHER
**********************************/

/*
 * Get a "random" YouTube video
 * NOT YET IMPLEMENTED
 */
function randomVideo() {
	// TODO: 
	// 1. get a random word (ie with the wordnik API)
	// 2. search for that word with the YouTube API
	// 3. pick a random result (ie random number out of 1000, possibly weighted toward earlier results)
	// inspiration: https://stackoverflow.com/questions/11315416/how-do-i-get-a-random-youtube-video-with-the-youtube-api
}