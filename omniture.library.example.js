/****************************************************************

Omniture Library

*****************************************************************/

/****************************************************************
Make sure that the omniture instance is being initialized using

ssla.analytics.Omniture.getAccount()

Like this:

var s=s_gi(ssla.analytics.Omniture.getAccount())

Set the Account that events need to be sent to using 

ssla.analytics.Omniture.addAccount(<account>,<host>);

If the site is going on toyota's servers you can just use Accounts.getAccount() without
needing to add anything.

If site is not being hosted on t.com. It will likely have two accounts that 
are not the t.com defaults - one for dev and one for production. Accounts
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
obj.name = "tcom_yaris_its_a_car_nav_toyota_logo";
 
// Additional properties are set according to the omniture deck.
// props should be all lower case with a number. eVars should be camel case with a number. 
obj.prop22 = "value";
obj.prop46 = "value";
obj.eVar37 = "value";

****************************************************************/

//*****************************************************************
//
// Add Required Account suites and associated hosts. 
//
//*****************************************************************

ssla.analytics.Omniture.addAccount("prod","saatchila.com");
ssla.analytics.Omniture.addAccount("dev","localhost");

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
obj.prop22 = "GM:Yaris:Its_A_Car:Nav:Toyota_Logo";
obj.prop46 = "GM:Yaris:Its_A_Car:Nav:CTA:Toyota_Logo";
obj.eVar46 = "eVar46";
obj.method = "trackLink";
obj.type = "o";
obj.name = "tcom_yaris_its_a_car_nav_toyota_logo";

// learn more
obj = library.trackLink2 = {};
obj.type = "o";
obj.pev2 = "tcom_yaris_its_a_car_nav_yaris_learn_more";
obj.prop22 = "GM:Yaris:Its_A_Car:Nav:Yaris_Learn_More";
obj.prop51 = "GM:Yaris:Its_A_Car:Nav:CTA:Yaris_Learn_More";
obj.eVar51 = "eVar46";



//---------------------------------- 
// Feature pages
//---------------------------------- 
// this node will have to be customized per section by concatenating the 
// current feature to the pageName and changing the current color on
// prop38

obj = library.track = {};
obj.pageName = "GM:YarisBro:Feature:";
obj.prop14 = "GM:Yaris:Its a Car:Feature";
obj.eVar37 = "GM:YarisBro:Feature:";
obj.events = "event30"
obj.channel = "GM:Yaris";
obj.method = "track";

// game interaction
obj = library.custom = {};
obj.prop22 = "GM:Yaris:Its_A_Car:Feature";
obj.prop46 = "GM:Yaris:Its_A_Car:Feature:[1]:Game_Interaction";
obj.eVar46 = "GM:Yaris:Its_A_Car:Feature:[1]:CTA:[2]";
obj.method = "trackLink";
obj.type = "o";
obj.name = "tcom_yaris_its_a_car_feature_[1]_game_interaction";
