(function($) {
	
	$.Body = $('body');   
    $.Window = $(window);
	$.Mobile 	= navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i);
	$.IPad 		= navigator.userAgent.match(/(iPad)/i);
 
 	$.Window.resize(function($event){
		$.Body.triggerHandler($.Events.RESIZE,$event);
	});
	
	$.Window.scroll(
		function($event){
			$.Body.triggerHandler($.Events.SCROLL,$event);
		}
	);
	
	$.Events = {
		VENDOR_FILTER: 				'onVendorFilter',
		VENDOR_LOAD: 				'onVendorLoad',
		SCROLL:						'onScroll',
		RESIZE:						'onWindowResize',
		CONTACT_COMPLETE:			'onContactComplete'
	} // end Events  
	
	// extends jquery to delegate callbacks to objects.
	$.extend({
		scope: function(fn, scope)
		{
			return function(){
				return fn.apply(scope, arguments);
			}
		}
	});

})(jQuery);
