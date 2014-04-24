(function($){
	
	// extends jquery to delegate callbacks to objects.
	$.extend({
		scope: function(fn, scope)
		{
			return function(){
				return fn.apply(scope, arguments);
			}
		}
	});

	
	$.fn.OmnitureController = function($library,$scode){
		var $self = $(this),
		$jq = $,
		tracker,
		_library,
		_s;

		$library ? _library = $library : _library = window.library;
		$scode ? _s = $scode: _s = window.s;
		
		function init(){
			
			alert("controller init");
		
			// instantiate tracker
			tracker = new mry.analytics.Omniture(_library,_s);
	
			// get the page load item and send it
			var b = $self.find("[data-omni-page]");
			var oid = b.attr("data-omni-page");
			if(oid !== undefined){
				var params = b.attr("data-omni-params");
				if(params !== undefined){
					var obj = createCustomEvent(oid,params);
					tracker.send(obj);		
				} else {
					tracker.sendId(oid);
				}
			}
			
			// set up clicks
			$self.find("[data-omni]").click(jQuery.scope(onItemClick,this));
			
			//$self.click(jQuery.scope(onItemClick,this));
		}
		
		function onItemClick($e){			
			var $this = $($e.currentTarget),
				oid = $this.attr("data-omni"),
				params = $this.attr("data-omni-params"),
				href = $this.attr("href");
				
				console.log("oid:" + oid);
			
			// if it's an <a> tag override the click
			// to make sure the event fires	
			if(href !== undefined){
				var targ = $this.attr("target");
				$e.preventDefault();
				setTimeout(function(){
					if (targ !== undefined && targ === "_blank") {
						window.open(href);
					} else {
						window.location = href;
					} 		
				},100);
			}
			
			if(params !== undefined){
				var obj = createCustomEvent(oid,params);
				tracker.send(obj);		
			} else {
				tracker.sendId(oid);
			}
		}
		
		function writeParams($str,$paramsArray){
			var x,
				params = $paramsArray,
				l = params.length,
				param;
				
				for(x=0;x<l;x++){
					param = params[x];
					$str = $str.split("[" + (x + 1) + "]").join(param);
				}
				
				return $str;
		}
		
		// add custom parameters to event before sending
		function createCustomEvent($id,$paramsString){
			var obj = tracker.getItem($id);
			var params = $paramsString.split(",");
			
			for(var i in obj){
				obj[i] = writeParams(obj[i],params);
			}
			
			return obj;
			
		}
		
		init();
	}

})(jQuery);

