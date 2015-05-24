//==============================================================================  
// Contents
//
// ssla.analytics.Omniture
// ssla.net.NetInfo
// ssla.analytics.omniture.Accounts
// ssla.analytics.omniture.Account
//
//==============================================================================

(function ($global) {

/*********************************************************

Create Packages

**********************************************************/

if (typeof $global.ssla == "undefined") {
  $global.ssla = {};
}

// mry
// mry.analytics
// mry.net
// mry.analytics.omniture

var mry = $global.ssla;
mry.net = mry.net ? mry.net : {};
mry.analytics = mry.analytics ? mry.analytics : {};
mry.analytics.omniture = mry.analytics.omniture ? mry.analytics.omniture : {};


/*********************************************************

NetInfo

**********************************************************/


mry.net.NetInfo = {}

/**
* Retrieve the current host. This can be used to set the reporting
* account to use.
* @return String - Host portion of url.
*/
mry.net.NetInfo.getUrl = function()
{
    return document.domain;
}

/**
* Retrieve hash postion of url.
* @return String
*/
mry.net.NetInfo.getHash = function()
{
    return window.location.hash;
}

/**
* Retrieve "siteid" variable from query string.
* @return
*/
mry.net.NetInfo.getSiteId = function()
{
    var id;
    var query = window.location.search;
    
    if (query == null || query == "" ) {
        id = "";
    } else {
        id = mry.net.NetInfo.getQueryVariable(query, "siteid");
    }
    return id;
}

/**
 * Retrieve a variable from the query string.
 */
mry.net.NetInfo.getQueryVariable = function($query,$varName)
{
    $query = $query.substring(1);
    var vars = $query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (pair[0] == $varName) {
              return pair[1];
            }
    }
    return "";
}

/*********************************************************

Accounts

**********************************************************/
mry.analytics.omniture.Accounts = function($arr){
	this._data = [];
	this._count = 0;
	if($arr instanceof Array){
		// validata that the data is valid
		for(var i in $arr){
			var o = $arr[i];
			if(o.account == undefined || o.address == undefined || o.account == "" || o.account == ""){
				throw new Error("Accounts data is invalid");
				return false;
			}
		}
		this._data = $arr;
	}
}

mry.analytics.omniture.Accounts.prototype.next = function(){
	var o = this._data[this._count];
	this._count++;
	return o;
}

mry.analytics.omniture.Accounts.prototype.hasNext = function(){
	if(this._count < this._data.length){
		return true;
	} 
	return false;
}

mry.analytics.omniture.Accounts.prototype.addAccount = function($accountName,$address){
	this._data.push(new mry.analytics.omniture.Account($accountName,$address));
}

/**
* Static method to get account to be tracked to.
*/
mry.analytics.omniture.Accounts.prototype.getAccount = function()
{
  var account;
  var host = mry.net.NetInfo.getUrl();

		while(this.hasNext()){
			var a = this.next();
			var regex = new RegExp(a.address,"i");
			if(regex.test(host)){
				account = a.account;
				break;
			}
		}

  return account;
}

/*********************************************************

Account

**********************************************************/
mry.analytics.omniture.Account = function($account,$address){
	this.account = $account;
	this.address = $address;
}


/*********************************************************

Tracker

**********************************************************/

/** 
Tracker
@param $library - library object
@param $s - omniture s_code object 
*/
mry.analytics.Omniture = function($library,$s){
	// on objects containing key value pairs of object to be sent to omniture
	this.library = $library;
	this.s = $s;
	this.s.campaign = mry.net.NetInfo.getSiteId();
}

mry.analytics.Omniture.prototype.constructor = mry.analytics.Omniture;


/** 
Clear the s_code object. 
*/
mry.analytics.Omniture.prototype.clear = function()
{
	for (var i = 1; i <= 75; i++) {
        this.s['prop' + i] = "";
        this.s['eVar' + i] = "";
    }
    
    this.s['pageName'] = "";

    this.s['channel'] = "";

    this.s['events'] = "";

    this.s["campaign"] = "";
    this.s["linkTrackVars"] = "";
}

/**
* Send object from library based upon its library id
*/
mry.analytics.Omniture.prototype.sendId = function($id){
	try {
		var obj = this.getItem($id);
	} catch($e){
		return false;
	}
	this.send(obj);
	return true;
}

/**
* Retrieve item from item array
*/ 
mry.analytics.Omniture.prototype.getItem = function($id){
	 
	 var obj = this.library[$id];
	 if(obj == undefined){
	 	throw new Error("[Omniture] Item doesn't exist");
	 } else {
		 var clone = {};
		for(var i in obj){
			clone[i] = obj[i];
		}
	 	return clone;
	 }
	 
}

/**
 * Send a library object to Omniture.
 * @param $obj - object to send
 */
mry.analytics.Omniture.prototype.send = function($obj)
{
	this.clear();
	var func = this._getJSFunction($obj);
	
	
	
	func();
	
	if ($obj.method.toLowerCase() == "tracklink") {
		// find the pev2 value to be passed as trackLink parameter
		var n = "";
		typeof($obj.pev2) == String ? n = $obj.pev2 : n = $obj.name;
		this._trackLink(document.location, $obj.type, n);
	} else {
		this._track();
	}
	
	// clear values from this.s
	this.clear();
}


/**
 * Generates javascript function to set omniture params
 * prior to tracking.
 * @param	$obj - instance of one of the library objects
 * @return Function
 * @private
 */
mry.analytics.Omniture.prototype._getJSFunction=function($obj)
{
	var func = "";
	var ltv = ""; // linkTrackVars string
	
	var method = this._getMethod($obj);
	
	// attach all the properties
	for (var i in $obj) {

        if($obj.hasOwnProperty(i)){
            // skip pev2|name|type|method properties
            if(!i.match(/(pev2|type|method)/i) && i !== "name"){

                func = func.concat("s.").concat(i).concat("='").concat($obj[i]).concat("';");

                // add all property names for linkTrackVars
                ltv += i + ",";
            }
        }
		

	}
	
	// create the linkTrackVars string if it's a trackLink event
	if(ltv.length > 0 && method.toLowerCase() == "tracklink" ){
		ltv = ltv.substring(0,ltv.length-1);
		func = func.concat("s.linkTrackVars='" + ltv + "';");
	}
		
	var fn = new Function(func);
	
	return fn;
}
/**
* @private
* Gets the event method to use.
*/

mry.analytics.Omniture.prototype._getMethod = function($obj){
	var method = "";
	
	// get the method
	if($obj.method == undefined){
		if($obj.pageName != undefined){
			method = "track";
		} else {
			// we default to trackLink
			// but determine that the require properties are set
			// if not throw an error.
			if($obj.pev2 == undefined && $obj.name == undefined){
				throw new Error("[Omniture] trackLink is assumed, a \"name\" or \"pev2\" must be added to library item.");
			}
			
			if($obj.type == undefined){
				throw new Error("[Omniture] trackLink is assumed, a \"type\" must be added to library item.");
			}
			method = "trackLink";
		}
		$obj.method = method;
	} else {
		method = $obj.method;
	}
	return method
}

/**
* @private
* Wraps omniture's track call.
*/
mry.analytics.Omniture.prototype._track = function(){
	this.s.t();
}

/**
* @private
* Wraps omniture's trackLink call.
* @param $url - this can be this.s or the current url
* @param $type - tracking link type. usually "o"
* @param $name - this a string identifying the link
*/
mry.analytics.Omniture.prototype._trackLink = function($url, $type, $name)
{
	
	if($url == undefined || $type == undefined || $name == undefined){
		throw new Error("[Omniture] trackLink parameter(s) are missing");
		return false;
	}
	
	
	
	this.s.tl($url,$type,$name);
}

/**
* @private
* It automatically creates an Accounts object on the constructor.
*/
mry.analytics.Omniture.constructor.accounts = new mry.analytics.omniture.Accounts();


/**
* Adds an Account object to the internal Accounts object.
* @param $account - This is the account suite Toyota requires for a particular host.
* @param $host - host address that is associate with the account.
*/
mry.analytics.Omniture.addAccount = function($account,$host){
	mry.analytics.Omniture.constructor.accounts.addAccount($account,$host);
}

/**
* Returns and account based on defaults or accounds that were added.
* @return String - Account needed for s_code.
*/
mry.analytics.Omniture.getAccount = function(){
	var a = mry.analytics.Omniture.constructor.accounts.getAccount();
	// clear accounts.
	mry.analytics.Omniture.constructor.accounts = new mry.analytics.omniture.Accounts();
	return a;
}



})((typeof window == "undefined") ? this : window);