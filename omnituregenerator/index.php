<?php 
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type:  text/html');

error_reporting(E_ALL ^ E_NOTICE);

?>

<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
<title>Omniture Library Generator</title>
<meta charset="utf-8">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet/less" type="text/css" href="css/me.less">
<script src="js/libs/modernizr-2.5.3.min.js"></script>
<script src="js/libs/less-1.3.0.min.js"></script>
</head>
<body>
<h1>Omniture Library Generator</h1>
<?php

$excelFile = $_FILES["excel"];

if(isset($excelFile)):
	require_once("settings.php");
	require_once("OmnitureItem.php");
	require_once("OmnitureLibrary.php");
	require_once("excel_reader2.php");
	include_once("includes.php");
	
	$indexLineNumber = intval($_POST["startLine"]);
	
	//$excelData = new Spreadsheet_Excel_Reader($fileName);
	$data = new Spreadsheet_Excel_Reader($targetPath);

	$omnitureLibrary = new OmnitureLibrary($data,$indexLineNumber);
	
	$devHost = $_POST["devhost"];
	$devAccount = $_POST["devaccount"];
	
	$prodHost = $_POST["prodhost"];
	$prodAccount = $_POST["prodaccount"];
	
	?>
    
    <pre>
//*****************************************************************
//
// Add Required Account suites and associated hosts. 
//
//*****************************************************************

ssla.analytics.Omniture.addAccount(<em>"<?php echo $devAccount; ?>"</em>,<em>"<?php echo $devHost; ?>"</em>);
ssla.analytics.Omniture.addAccount(<em>"<?php echo $prodAccount; ?>"</em>,<em>"<?php echo $prodHost; ?>"</em>);


//*****************************************************************
//
// Omniture Library
//
//*****************************************************************

// Library object to pass into instance of Omniture.
var omniturelibrary = {};
    
// temporary holder
var obj;
    <?php echo $omnitureLibrary->toString(); ?>
    </pre>
    
    <?
	
else:
	?>
    <form action="index.php" enctype="multipart/form-data" method="post" name="excelForm">
    	<label for="devaccount">Enter Dev Account:</label>
        <input name="devaccount" type="text" value="tmsdevtoyota" />
        <label for="devhost">Enter Dev Host:</label>
        <input name="devhost" type="text" value="staging.toyota.com" />
        <label for="prodaccount">Enter Live Account:</label>
        <input name="prodaccount" type="text" value="tmstoyota" />
        <label for="prodhost">Enter Live Host:</label>
        <input name="prodhost" type="text" value="toyota.com" />
    	<label for="startLine">Enter Index Name Line Number:</label>
        <input name="startLine" type="text" size="2" maxlength="2" value="9" />
        <input name="excel" type="file" />
        <input type="hidden" name="MAX_FILE_SIZE" value="100000" />
        <input name="submit" type="submit" value="Upload File" />
    </form>
    <br />
    <div class="instructions">
    	<h2>Instructions</h2>
        <p><h3>1.</h3>
        The Excel document MUST be a xls file, not the newer xlsx type. If it is the newer type, do a "save as" and choose older version.</p>
        <p><h3>2.</h3>Your tagging document should contain "account" information. Enter the details in the form, with corresponding "host" name. An account and host needs to be added for both your development environment and the live site.<img src="images/1.jpg" /></p>
        <p><h3>3.</h3> After the account information is the "index" row. This row contains the different property names that will be sent with each of the different omniture events. These values must be spelled properly and capitalization has to be exact. The first column should be either "page" or "section". The second column "id"s, will serve as the object name for each event within the final library file. <em>Note these "id"s can't have a period in them. I usually replace all periods with an underscore.</em><img src="images/2.jpg" /></p>
         <p><h3>4.</h3>The first column should used to delineate the different pages and/or sections of the site. This value will be concatenated with the "id" column values to create unique ids for events.<img src="images/3.jpg" /></p>
         <p><h3>5.</h3>Each event should have ad id associated to it.  This id is concatenated with the page identifier, so each id only needs to be unique to it's page.<img src="images/4.jpg" /></p>
          <p><h3>6.</h3>Each of the event properties then should be added with appropriate capitalization.<img src="images/5.jpg" /></p>
          <p><h3>7.</h3>Toyota should provide you with account information. The accounts for your dev and production servers should be added. Then add the line number, where the column indices are written.<img src="images/form.png" /></p>
    </div>
    <?php
endif;


?>
</body>
</html>