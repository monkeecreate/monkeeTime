/*
 *
 * monkeeTime App
 * 
 * A simple web app for time tracking on projects. Uses
 * html5 localStorage. Compatiable with modern web browsers
 * as well as the iPhone/iPad.
 *
 * Developed by James Fleeting <twofivethreetwo@gmail.com>
 * Another project from monkeeCreate <http://monkeecreate.com>
 *
 * Version 1.0 - Last updated: May 1 2010
 *
 * Inspired by Checklist from http://miniapps.co.uk/
 */

$(document).ready(function() {
	if (typeof(localStorage) == 'undefined' ) {
		alert('Your browser does not support HTML5 localStorage. Try upgrading.');
	} 
	else {
		getAllItems();
		
		$(".delete").click(function() {
			$(this.nodeName + " span").dialog({
				resizable: false,
				height: 140,
				modal: true,
				show: 'fold',
				buttons: {
					'Delete Time': function() {
						localStorage.removeItem($(this).attr("rel"));
						getAllItems();
						$(this).dialog('close');
					},
					Cancel: function() {
						$(this).dialog('close');
					}
				}
			});
		});
		
		$("#logTime").click(function(){
			var values = new Array();

			var name = $("#name").val();
			var hours = $("#hours").val();
			var date = $("#date").val();

			//strip html tags.
			name = name.replace(/(<([^>]+)>)/ig, "");

			//encode special characters.
			name = name.replace(/&/,"&amp;");
			name = name.replace(/</,"&lt;");
			name = name.replace(/>/,"&gt;");

			values.push(hours);
			values.push(date);

			if (name != "" && hours != "" && date != "") {

				try {
					localStorage.setItem(name, values.join(';'));
				} catch (e) {
					if (e == QUOTA_EXCEEDED_ERR) {
						alert('Quota exceeded!');
					}
				}

				//clear input values
		   		$("#name").val("");
				$("#hours").val("");
				$("#date").val("");
		   		getAllItems();
		   }
		   else {
				$("#emptyFields-message").dialog({
					resizable: false,
					height:140,
					modal: true,
					show: 'fold',
					buttons: {
						Ok: function() {
							$(this).dialog('close');
						}
					}
				});
			
		   		//alert('Nothing to add!');
		   }
		});
		
		$("#clearLog").click(function() {
			$("#clearLog-message").dialog({
				resizable: false,
				height:140,
				modal: true,
				show: 'fold',
				buttons: {
					'Delete all items': function() {
						localStorage.clear();
						getAllItems();
						$(this).dialog('close');
					},
					Cancel: function() {
						$(this).dialog('close');
					}
				}
			});
		});
		
		$("#aboutButton").click(function() {
			$("#about").slideDown("slow");
		});
		
		$("#closeButton").click(function() {
			$("#about").slideUp("slow");
		});
	}
});

/**
 * getAllItems
 *
 * Retrieves all list items from localStorage
 * and displays as list items.
 */
function getAllItems() {
   	var timeLog = "";
  	var myArray = [];
   	var i = 0;
   	var j = 0;
	var logLength = localStorage.length-1;
	var totalHours = 0.0;
	
   	//push each item into an array
   	for (i = 0; i <= logLength; i++) {

    	var item = localStorage.key(i);
    	myArray.push(item);
    }

    //process each item and create a list item
    for (j = 0; j <= logLength; j++) {

    	var logitem = myArray[j];
		var values = localStorage.getItem(logitem);
		values = values.split(";");
		var hours = values[0];
		var date = values[1];
	
		timeLog += '<li><strong>' + logitem + '</strong>: ' + hours + ' hours <span class="delete">&times;<span class="hidden" title="Delete Time" rel="' + logitem + '">Are you sure you want to delete ' + logitem + ' from the log?</span></span> <span class="date">' + date + '</span></li>'
		
		totalHours = totalHours + parseInt(hours);
   	}

   	if (timeLog == "") {
   		timeLog = '<li class="empty">Log Currently Empty</li>';
   	}

	//display the total number of hours
	$("section header p span").html(totalHours);

	//update the log with all items
	$("#theLog").html(timeLog);

	//remove bottom border of last li
	$("ul li:last-child").css("border", 0);
}

$(function() {
	$('#date').datepicker({
		showButtonPanel: true,
		showAnim: 'fold',
		dateFormat: 'm/dd/yy'
	});
});