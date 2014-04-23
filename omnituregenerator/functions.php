<?php
function writeHeader(){
	?>
<!DOCTYPE html >
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>YouTube Uploader</title>
<link rel="stylesheet" type="text/css" href="styles.css" /> 
<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js?ver=3.1.2'></script>
<script type='text/javascript' src='js/library.js'></script>
<script type='text/javascript' src='js/Delegate.js'></script>
<script type='text/javascript' src='js/Debug.js'></script>
<script type='text/javascript' src='js/Application.js'></script>
<script type='text/javascript' src='js/Controller.js'></script>
<script type='text/javascript' src='js/View.js'></script>
<script type='text/javascript' src='js/Token.js'></script>
</head>
<body>

    <?php
}


function getRelativeFilePath($directory,$fileName){
	

	
	/*add first slash to directory if it doesn't exist.
	if(strpos($d,"/") > 0){
		$d = "/" . $d;
	}
	
	// add trailing slash to directory if it doesn't exist.
	if(strrpos($d,"/") < $length - 1){
		$d .= "/";
	}
	*/
	
	$p = "videos" . $directory . $fileName;
	
	return $p;
}


function getContentType($videoName){
	//'video/quicktime';
	//'video/avi'
	//'video/x-flv'
	$arr = explode(".",$videoName);
	$s = $arr[count($arr) - 1];
	$r = "";
	switch($s){
		case "avi":
		$r = 'video/x-msvideo';
		//$r = 'video/quicktime';
		break;
		case "mov":
		$r = 'video/quicktime';
		break;
		case "flv":
		$r = 'video/x-flv';
		break;
	}
	return $r;
}

function writeLog($res){
	$file = "log.html";
	$open = fopen($file, "a+"); //open the file, (log.htm).
	$str = "";
	if($response["success"]){
		$str .= $response["id"] . "    " . $response["youtubeId"] . "<br />";
	} else {
		if(isset($response["http_error"])){
			$str .= "[ERROR] " . $response["http_error"];
		} else if (isset($response["error"])){
			$str .= "[ERROR] " . $response["error"];
		} 
	}
	fwrite($str);
	fclose($open); // you must ALWAYS close the opened file once you have finished.
}

function getTags($str){
	$arr = explode(",",$str);
	$res = array();
	foreach($arr as $i){
		if(strlen($i) < 28){
			$res[] = $i;
		}
	}
	return implode(",",$res);
}

//<?xml version='1.0' encoding='UTF-8'<errors><error><domain>yt:quota</domain><code>too_many_recent_calls</code></error></errors>
function testTooManyError($str){
	$needle = "<code>too_many_recent_calls</code>";
	$pos = strpos($str,$needle);
	if($pos == 0){
		return false;
	} else {
		return true;
	}
}

?>