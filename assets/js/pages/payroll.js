$(document).ready(function() {
    
    //Initialize WYSIHTML5 - text editor
 //    $("#announcement_message").wysihtml5();
	
	// $("#edit_announcement_message").wysihtml5();
    
    //Date range picker
    $('#payperiod_duration').daterangepicker();
	
	$('#apply_button').click(function() {
		//$("#apply_button").attr("disabled", "disabled");
	});
	
	
	$('.applyBtn').blur(function() {
		var duration = $('#leave_duration').val();
		var duration_tok = duration.split(' ');
		var duration_from = duration_tok[0].split("/");
		var duration_to = duration_tok[2].split("/");
		
		duration_from =  new Date(duration_from[2], duration_from[0] - 1, duration_from[1]);
		duration_to =  new Date(duration_to[2], duration_to[0] - 1, duration_to[1]);
		
		var oneDay  = 24*60*60*1000;
		var diffDays = Math.abs((duration_from - duration_to) / oneDay) + 1;
		$('#leave_total_days').val(diffDays);
	});
	
	
});