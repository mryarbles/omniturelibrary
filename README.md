Omniture Library 
===============

This is a utility to make the implementation of omniture easier. 
---------------

Basic Usage
---------------

*1) Include the library js file, analytics library, and omniture s_code.js.*

  [script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
  [script src="analytics.js"></script>
  [script src="omniture.library.example.js"></script>
  [script src="s_code.js"></script>
  
*2) Instantiate the tracking object.*
*library* is object from the omniture.library.example.js file.
*s* is the Omniture object.

  var omni = new ssla.analytics.Omniture(library,s);

*3) Send event*

omni.sendId(<eventId String>);

*4) To send a "custom" event.*

  var obj = omni.*getItem*("custom");
  var section = "Game";
  var p46 = obj.prop46;
  // split the prop46 string and join it with the custom section name.
  obj.prop46 = prop46.split("[section]").join(section);
  var n = obj.name;
  obj.name = n.split("[section]").join(section.toLowerCase());
  omni.*send*(obj);


<script src="jquery.omniturecontroller.js"></script>


