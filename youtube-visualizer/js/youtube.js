/********************************* 
	GENERAL YOUTUBE STUFF
**********************************/

function getVideoUrl() {
	return videoUrl = document.getElementById('videoUrl').value;	// get video url
}

function getVideoId() {
	const videoUrl = getVideoUrl();	// get video url
	const videoId = getYoutubeIdFromUrl(videoUrl);				// get video id from url
	
	return videoId;
}

/*
 * Get video id from YouTube video URL
 * Sample URL: https://www.youtube.com/watch?v=YV9gP5xp7OE
 * ... video id = YV9gP5xp7OE
 * ... (ie 11 character alphaneumeric string following "v=")
 */
function getYoutubeIdFromUrl(url) {
	
	// CREDIT: https://ctrlq.org/code/19797-regex-youtube-id
	
	const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/; 
	const match = url.match(regExp); // match url string with regular expression
	
	// note: video ID = match[7], the 7th saved string in the returned regex match
	if (match && match[7].length == 11) { // YouTube video ID's are 11 characters long
	
		return match[7];
		
	} else {
		console.log("Could not extract video ID from URL");
		
		return false; 
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
	
	let apiUrl = "https://www.googleapis.com/youtube/v3/videos?" 
	+ "id=" + videoId
	+ "&key=" + YOUTUBE_API_KEY 	
	+ "&fields=items(snippet(title))"
	// + "&fields=items(snippet(title), statistics(commentCount))" 
	+ "&part=snippet" 
	// + "&part=snippet,statistics" // for total number of comments (without having to grab them) 
	
	return apiUrl;
}

function updateVideoTitle(videoId) {
	const apiUrl = buildVideoApiRequestUrl(videoId);
	
	fetchJsonWrapper(apiUrl, getAndSetTitle);
}

function getAndSetTitle(jsonResponse) {
	const title =  jsonResponse.items[0].snippet.title;
	setVideoTitle(title);
	
	// logJsonAsText(jsonResponse);
	// console.log("total number of comments: " + jsonResponse.items[0].statistics.commentCount)
	// console.log("GETTING TITLE");
	// console.log("Title = ",title);
}

function setVideoTitle(title) {
	// $('#videoTitle').html(title);
	// document.getElementById('videoTitle').innerHTML = title;
	let videoUrl = getVideoUrl();
	let titleHtml = "<a href=" + videoUrl + ">"+title+"</a>"
	document.querySelector('#videoTitle span').innerHTML = titleHtml;
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

	let apiUrl = "https://www.googleapis.com/youtube/v3/commentThreads?"
	+ "videoId=" + videoId 
	+ "&key=" + YOUTUBE_API_KEY 
	+ "&maxResults=" + MAX_COMMENTS_PER_PAGE
	+ "&part=snippet" // get top level comments only (no replies)
	// quota (max number of comments = 1000, video with > 28,000 comments --- so 10 api calls for comments, 1 for title)
	// 1480 -> 1513 -> 1534(FAILED AT 5 API CALLS FOR SOME REASON) -> 1558(FAILED AT 5 API CALLS FOR SOME REASON) -> 1591 -> 1624
	//     (33)    (21)                                            (24)                                          (33)     (33)
	
	// quota (max number of comments = 500, video with > 28,000 comments)
	// 1388 -> 1406 -> 1424 
	//     (18)    (18)
	
	// + "&part=snippet,replies" // also get replies (not just top level comments)
	// quota (max number of comments = 500, video with > 28,000 comments):
	// 1424 -> 1452 -> 1480
	//     (28)    (28)
	
	if (nextPageToken) {
		apiUrl += "&pageToken=" + nextPageToken 
	}
	
	// console.log("api call = " + apiUrl);
	
	return apiUrl;
}

/*
 * Get a list of the LENGTHS 
 * of each top-level comment for a given YouTube video
 * by parsing the JSON response from the YouTube API 
 */
function parseComments(jsonResponse) {

	// logJsonAsText(jsonResponse);
	
	// const commentThreadList = jsonResponse.items;
	let commentLengths = [];
	for (let i = 0; i < jsonResponse.items.length; i++) {
		let commentText = jsonResponse.items[i].snippet.topLevelComment.snippet.textOriginal;
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

	// logJsonAsText(jsonResponse);
	
	const commentThreadList = jsonResponse.items;
	let commentLengthsTimes = [];
	for (let i = 0; i < commentThreadList.length; i++) {
		let commentText = commentThreadList[i].snippet.topLevelComment.snippet.textOriginal;
		let length = commentText.length;
		let datetime = commentThreadList[i].snippet.topLevelComment.snippet.publishedAt;
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