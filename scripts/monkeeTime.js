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
		
		$("#logTime").click(function(){
			var itemId = localStorage.length+1;
			
			var values = new Array();
			var name = $("#name").val();
			var hours = $("#hours").val();
			var date = $("#date").val();

			//strip html tags.
			name = name.replace(/(<([^>]+)>)/ig, "");

			//encode special characters.
			// name = name.replace(/&/,"&amp;");
			// name = name.replace(/</,"&lt;");
			// name = name.replace(/>/,"&gt;");
			
			values.push(name);
			values.push(hours);
			values.push(date);

			if (name != "" && hours != "" && date != "") {

				try {
					localStorage.setItem(itemId, values.join(';'));
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
		var project = values[0];
		var hours = values[1];
		var date = values[2];
	
		timeLog += '<li><strong>' + project + '</strong>: ' + hours + ' hours <span class="delete">&times;<span class="hidden" title="Delete Time" id="' + logitem + '">Are you sure you want to delete ' + project + ' from the log?</span></span> <span class="date">' + date + '</span></li>';
		
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
	
	deleteItem(); //bind the dialogs to each item in the updated list.
}

/**
 * deleteItem
 *
 * Displays the dialog to delete a single item
 * and deletes it if successfull.
 */
function deleteItem() {
	var deleteItemDialog = new Array();
	$(".delete").each(function() {
		var id = $(this).find("span").attr("id");
		deleteItemDialog[id] = $("#"+id).dialog({
			autoOpen: false,
			resizable: false,
			height: 140,
			modal: true,
			show: 'fold',
			buttons: {
				'Delete Time': function() {
					localStorage.removeItem(id);
					getAllItems();
					$(this).dialog("close");
				},
				Cancel: function() {
					$(this).dialog("close");
				}
			}
		});

		$(this).click(function(){
			deleteItemDialog[id].dialog("open");
			return false;
		});
	});
}

$(function() {
	$('#date').datepicker({
		showButtonPanel: true,
		showAnim: 'fold',
		dateFormat: 'm/dd/yy'
	});
});