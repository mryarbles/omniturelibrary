/****************************************************************

Omniture Library

*****************************************************************/

/****************************************************************
Make sure that the omniture instance is being initialized using

mry.analytics.Omniture.getAccount()

Like this:

var s=s_gi(mry.analytics.Omniture.getAccount())

Set the Account that events need to be sent to using 

mry.analytics.Omniture.addAccount(<account>,<host>);

Accounts
will accept any amount of accounts.

Library Object Description
// This creates the name value pair for a trackLink event. 
// The name is used in Omniture.sendId(id) calls
obj = library.trackLink1 = {};

// Certain properties are not attached to the omniture object
// but are used by the library or are parameters in a trackLink event

// "method" is optional.  possible values are "trackLink" or "track". 
// It is suggested that this property be set to make this very transparent.
obj.method = "trackLink"; 

// "o" is only used by "trackLink" events.  It is required. An error will be thrown if it isn't set.
obj.type = "o";

// "name" is only used by "trackLink" events.  It is required, but "pev2" is acceptable in it's place. An error will be thrown if it isn't set.
obj.name = "nav_logo";
 
// Additional properties are set according to the omniture deck.
// props should be all lower case with a number. eVars should be camel case with a number. 
obj.prop22 = "value";
obj.prop46 = "value";
obj.eVar37 = "value";

****************************************************************/

//*****************************************************************
//
// Add Required Account suites and associated hosts. 
// Put most specific urls first. So staging.mry.com should come before mry.com.
//
//*****************************************************************
mry.analytics.Omniture.addAccount("staging","staging.mry.com");
mry.analytics.Omniture.addAccount("prod","mry.com");
mry.analytics.Omniture.addAccount("dev","localhost");

//*****************************************************************
//
// Omniture Library
//
//*****************************************************************

// Library object to pass into instance of Omniture.
var library = {};

// temporary holder
var obj;

//---------------------------------- 
// Global Nav 
// ---------------------------------

// Toyota Logo
obj = library.trackLink1 = {};
obj.prop22 = "GM:Its_A_Car:Nav:_Logo";
obj.prop46 = "GM:Its_A_Car:Nav:CTA:_Logo";
obj.eVar46 = "eVar46";
obj.method = "trackLink";
obj.type = "o";
obj.name = "nav_logo";

// learn more
obj = library.trackLink2 = {};
obj.type = "o";
obj.pev2 = "learn_more"; // this is using actual variable being used in s code. Probably best method.
obj.prop22 = "GM:Learn_More";
obj.prop51 = "GM:CTA:Learn_More";
obj.eVar51 = "eVar46";



//---------------------------------- 
// Feature pages
//---------------------------------- 
// this node will have to be customized per section by concatenating the 
// current feature to the pageName and changing the current color on
// prop38

obj = library.track = {};
obj.pageName = "GM:Feature:";
obj.prop14 = "GM:Its a Car:Feature";
obj.eVar37 = "GM:Feature:";
obj.events = "event30"
obj.channel = "GM";
obj.method = "track";

// game interaction
obj = library.custom = {};
obj.prop22 = "GM:Its_A_Car:Feature";
obj.prop46 = "GM:Its_A_Car:Feature:[1]:Game_Interaction";
obj.eVar46 = "GM:Its_A_Car:Feature:[1]:CTA:[2]";
obj.method = "trackLink";
obj.type = "o";
obj.name = "feature_[1]_game_interaction";
