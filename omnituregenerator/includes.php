<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
	
	if(!defined('__DIR__')) {
		$iPos = strrpos(__FILE__, "/");
		define("__DIR__", substr(__FILE__, 0, $iPos) . "/");
	} 
	
	//$folder = "http://". $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
	//$folder = "http://". $_SERVER['HTTP_HOST'] . __DIR__;
	$folder = "http://". $_SERVER['HTTP_HOST'] . dirname( $_SERVER['REQUEST_URI']);
	
	$today = date("Ymd-His-");   
	
	$error = "";
	$msg = "";
	$process = "";
	$fileElementName = 'excel';
	$errorType = $_FILES[$fileElementName]['error'];
	if(!empty($errorType)):
	
		$process .= "| fileElementName error";
		switch($errorType):
			case '1':
				$error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
				break;
			case '2':
				$error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
				break;
			case '3':
				$error = 'The uploaded file was only partially uploaded';
				break;
			case '4':
				$error = 'No file was uploaded.';
				break;
			case '6':
				$error = 'Missing a temporary folder';
				break;
			case '7':
				$error = 'Failed to write file to disk';
				break;
			case '8':
				$error = 'File upload stopped by extension';
				break;
			case '999':
			default:
				$error = 'No error code available';
		endswitch;
	elseif(empty($_FILES[$fileElementName]['tmp_name']) || $_FILES[$fileElementName]['tmp_name'] == 'none'):
		$error = 'No file was uploaded..';
	else: 
			$process .= "| try to move file ";
			// Where the file is going to be placed 
			//$targetPath = "/clicktags/uploads/";
			$targetPath = ROOT . "uploads/";
			
			/* Add the original filename to our target path.  
			Result is "uploads/filename.extension" */
			$fileName = $today .  basename( $_FILES[$fileElementName]['name']); 
			
			$targetPath = $targetPath . $fileName;
			
			
			if(move_uploaded_file($_FILES[$fileElementName]['tmp_name'], $targetPath)) {
				$msg .= " File Name: " . $_FILES[$fileElementName]['name'];
				//$file = "uploads/" . $fileName;
			} else{
				$process .= "| move failed ";
				$error =  "There was an error uploading the file, please try again!";
			}

			//$msg .= " File Size: " . @filesize($_FILES['fileToUpload']['tmp_name']);
			//for security reason, we force to remove all uploaded file
			@unlink($_FILES['fileToUpload']);		
	endif;		

?>