// JavaScript Document
(function($){

	$.fn.NewProspect = function($url){
		
		//console.group("NewProspect");
		//console.log("url: " + $url);
	
		
		var $self = $(this),
			tagsField = $self.find("#tagValues"),
			tags = [],
			url = $url;
			
		var	formData;

		var jQueryLocal = $;
		
		var submitted = false;
			
		function construct(){
			
			initTagClicks();
			clearFields();
			initForm();
			
		}
		
		function initForm(){
			
			var filedrag = $self.find("#filedrag");  
			var submitbutton = $self.find("input[type='submit']");
			
			filedrag.bind("dragover", 	fileDragHover);  
			filedrag.bind("dragleave", 	fileDragHover);  
			filedrag.bind("drop", 		dropHandler);
			
			var acOpts = {
				appendTo:"#autoComplete",
				delay:100,
				minLength:2,
				source:"/prospects/tags-ajax/",
				select:jQuery.scope(onTagChange,this),
				//search:jQuery.scope(onTagSearch,this)	
			};
			
			$self.find("#addProspectTag").button({text:true,label:"Add New Tag"}).click(jQuery.scope(onAddTagButton,this)); 
			
			$self.find("#prospectTags").autocomplete(acOpts);
			
			$self.submit(jQuery.scope(submitForm,this));
			
		}
		
		function dropHandler($event){
			
			if(formData === undefined){
				formData = new FormData($self[0]);
			}
			
			var evnt = $event.originalEvent;
			fileDragHover(evnt);
			var files = evnt.dataTransfer.files;
			var count = files.length;

			for(var i=0,tick=0;i<count;i++){
				var file = files[i];
				
				if(testFileType(file.name)){
					formData.append("fileToUpload", files[i]);
					$("#filedrag").text(file.name);
					tick++;
				} 
			}
		}
		
		function testFileType($fileName){
			var arr = $fileName.split(".");
						
			if(arr[arr.length-1] == "pdf" || arr[arr.length-1] == "doc"){
				return true;
			} else {
				alert("Only Word or PDF files are allowed.");
				return false;
			}
		}
		
		function sendData($form){
			console.log("sendData");
			var xhr = new XMLHttpRequest();  
			xhr.upload.addEventListener("progress", uploadProgress, false);  
			xhr.addEventListener("load", uploadComplete, false);
			xhr.addEventListener("error", uploadFailed, false);  
			xhr.open("POST", url);
			xhr.send($form);
		}
		
		function uploadProgress($e){
		
		}
		
		function uploadComplete($e){
			var json = eval('(' + $e.target.responseText + ')');
			console.log("uploadComplete");
			console.dir(json);
			var htmlStr = "<h3>Your Prospect was successfully added.</h3><a href=\"javascript:window.location.reload();\">Click here to add another</a>";
			$self.replaceWith(htmlStr);
		}
		
		function uploadFailed($e){
			alert("Upload Failed");
		}
		
		function fileDragHover(e) {
			e.stopPropagation();
			e.preventDefault();
			e.target.className = (e.type == "dragover" ? "hover" : "");
		}
		
		/*
		Initialize the tag clock buttons
		*/
		function initTagClicks(){
			console.log("initTagClicks");
			$("ul.tags li").click(jQuery.scope(onTagClick,this));
		}
		
		/*
		click handler for "Add Tag" button.
		*/
		function onAddTagButton($e,$ui){
			$e.preventDefault();
			var str = $("#prospectTags").val();
			$("#prospectTags").val("");
			addTag(str);
		}
		
		/*
		click handler Tag clock buttons
		*/
		function onTagClick($e){
			var el = $($e.currentTarget);
			var str = el.text();
			
			addTag(str);
		}
		
		
		/*
		click handler for auto complete menu primarily.
		*/
		function onTagChange($e,$data){
			addTag($data.item.value);
		}
		
		
		/*
		Add a tag for submission.
		*/
		function addTag($str){
			console.log("addTag:" + $str);
			
			var arr = $str.split(" ");
			
			if(arr.length > 1){
				$str = "\"" + $str + "\"";
			}
			
			var i,
				l=tags.length,
				found = false;
			for(i = 0;i<l;i++){
				var val = tags[i];
				if(val === $str){
					found = true;
					break;
				}
			}
			
			if(!found){
				tags.push($str);
				addTagButton($str);
				//addTagValue($str);
				writeTagsToField();
			}
		}
		
		/*
		Remove a tag for submission.
		*/
		function removeTag($str){
			console.log("removeTag:" + $str);
						
			var i,
				l=tags.length,
				found = false;
			for(i = 0;i<l;i++){
				var val = tags[i];
				if(val === $str){
					found = true;
					tags.splice(i,1);
					break;
				}
			}
			if(found){
				writeTagsToField();
			}
		}
		
		function writeTagsToField(){
			var hidden = $self.find("#addedTags"),
				i = 0,
				str = "",
				l=tags.length,
				found = false;
			for(i = 0;i<l;i++){
				var val = tags[i];
				str += addSlashes(val);
				if(i < l-1){
					str += ",";
				}
			}
			
			hidden.val(str);
		}
		
		/*
		Add a tag value to hidden field that will be used for submission.
		
		function addTagValue($str){
			var hidden = $self.find("#addedTags");

			var currentVal = hidden.val();
			
			if(currentVal.length > 0){
				hidden.val(currentVal + "," + $str);
			} else {
				hidden.val($str);
			}
		}
		*/
		
		/*
		Add a tag button to show which tags have been added.  
		*/
		function addTagButton($str){
			var holder = $self.find("#tagButtons");
			
			holder.append("<button data-val=\"" + $str + "\"></button>");
			
			holder.find("button:last-child").button({text:true,label:$str,icons:{primary:"ui-icon-close"}}).click(jQuery.scope(onRemoveTag,this)); 
		}
		
		/*
		Remove tag handler
		*/
		function onRemoveTag($e,$ui){
			$e.preventDefault();
			console.log("removeTag:");
			console.dir($e);
			var el = $($e.currentTarget);
			var val = el.find("span").text();
			console.log("value:" + val);
			removeTag(val);
			el.remove();
		}
		
		/**
		
		Submit the form
		
		*/
		function submitForm(e){
			e.preventDefault();
			if(formData === undefined){
				formData = new FormData($self[0]);
			}
			console.log("submitForm");
			console.dir(e);
			var validation = validate();
			if(!validation.success){
				alert(validation.error);
			} else {
				if(!submitted){
					submitted = true;
					sendData(formData);
				} else {
					alert("Prospect already submitted. Please Wait.");
				}
			}
		}
		
		function validate(){
			var result = {};
			result.success = false;
			
			var prospectName = $self.find("#prospectName").val();
			if(prospectName.length == 0){
				result.error = "Please enter a name for prospect.";
				return result;
			}
			var prospectInfo = $self.find("#prospectContact").val();
			if(prospectInfo.length == 0){
				result.error = "Please enter contact information for contact.";
				return result;
			}
			
			var prospectTags = $self.find("#addedTags").val();
			if(prospectTags.length == 0){
				result.error = "Please enter type of work for prospect.";
				return result;
			}
			
			result.success = true;
			return result;
		}
		
		
		function clearFields(){
			$self.find("input[type!='submit'],textarea").val("");
		}
		
		function addSlashes(str) {
			str=str.replace(/\\/g,'\\\\');
			str=str.replace(/\'/g,'\\\'');
			str=str.replace(/\"/g,'\\"');
			str=str.replace(/\0/g,'\\0');
			return str;
		}
		
		function stripSlashes(str) {
			str=str.replace(/\\'/g,'\'');
			str=str.replace(/\\"/g,'"');
			str=str.replace(/\\0/g,'\0');
			str=str.replace(/\\\\/g,'\\');
			return str;
		}
		
		
		construct();
		console.groupEnd();
	};// end NewProspect 
})(jQuery);