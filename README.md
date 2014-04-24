Omniture Library 
===============

This is a utility library to make the implementation of omniture tracking easier. 
---------------

Basic Usage
---------------

Tutorial: http://tmspreview.com/tmslibrary/tutorial/

*1) Include a "library" js file, analytics library, and omniture s_code.js.*

  [script src="analytics.min.js"></script>
  [script src="omniture.library.example.js"></script>
  [script src="s_code.js"></script>
  
*2) Instantiate the tracking object.*
*library* is object from the omniture.library.example.js file.
*s* is the Omniture object.

  var omni = new ssla.analytics.Omniture(library,s);

*3) Send events by their library id*

omni.sendId(<eventId String>);

*4) Or  send "customized" events.*
Costomized events will, in general be library items whose properties need to be modified in a small way.
For instance, a photo gallery can have a single library item which you update the name based on position in photo gallery.

  // In this section we're updating the prop46 property to insert "Game" into its value.
  var obj = omni.*getItem*("custom");
  var section = "Game";
  var p46 = obj.prop46;
  // split the prop46 string and join it with the custom section name.
  obj.prop46 = prop46.split("[section]").join(section);
  var n = obj.name;
  obj.name = n.split("[section]").join(section.toLowerCase());
  omni.*send*(obj);
  
The library File
---------------  

Make sure that the omniture instance is being initialized using

mry.analytics.Omniture.getAccount()

Like this:

var s=s_gi(mry.analytics.Omniture.getAccount())

Accounts
Will accept any amount of accounts.

Add Required Account "suites" and their associated hosts using static *Omniture.addAccount" method.

  mry.analytics.Omniture.addAccount(<account>,<host>);
  
Add the most specific urls first. So staging.mry.com should come before mry.com.
If you don't mry.com would be found first and assumed to be correct. This should be fixed, but I'm terrible with regex!

Next create your library, then add your libary items. See omniture.library.example.js

  var library = {};

You can name your libary whatever you want to put it in any namespace that you want. When you instantiate the tracker, you just have to pass your library into the constructor.


Library Object Description
This creates the name value pair for a trackLink event. 
The name is used in Omniture.sendId(id) calls

  obj = *library.trackLink1* = {};

Certain properties are not attached to the omniture object, but are used by the library or are parameters in a trackLink events. "method" is optional.  possible values are "trackLink" or "track". 
I suggested using this property to avoid confusion or possible conflicts.
  
  obj.method = "trackLink"; 

"type" is only used by "trackLink" events.  It is required. An error will be thrown if it isn't set for trackLink events.

  obj.type = "o";

"name" is also only used by "trackLink" events. It's synonymous, and is actually replaced with "pev2" when the Omniture object is populated.  One or the other is required. An error will be thrown if it isn't set.

  obj.name = "nav_logo";
 
Additional properties are set according to the omniture deck.
"props" should be all lower case with a number. "eVars" should be camel case with a number. 

  obj.prop22 = "value";
  obj.prop46 = "value";
  obj.eVar37 = "value";

The JQuery Controller
jquery.omniturecontroller.js
---------------  

To make things easier, I created a jquery plugin to hookup all of the events on the page based on dom attributes.

*data-omni-page* 

Place *data-omni-page* on a sub element to the element on which you create the OmnitureController plugin. It should be the pageLoad event id from the library.

*data-omni* 

Place a *data-omni* on any click events on the page with associated id value. When that item is clicked the trackLink event will be fired.


*data-omni-params* 

Any DOM element with at *date-omni-page* or *data-omni* attribute can also contain a *data-omni-params* attribute, which outlines any customization that needs to take place within the specified library item. Params should be a comma separated string of strings to inject into a library item's properties where a "[1]" param was specified. In the following example prop46 will use the first parameter in the string, and eVar46 will require both parameters.


obj = library.custom = {};
obj.prop22 = "GM:Its_A_Car:Feature";
obj.prop46 = "GM:Its_A_Car:Feature:[1]:Game_Interaction";
obj.eVar46 = "GM:Its_A_Car:Feature:[1]:CTA:[2]";
obj.method = "trackLink";
obj.type = "o";
obj.name = "feature_[1]_game_interaction";





