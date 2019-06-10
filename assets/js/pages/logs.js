$(document).ready(function() {

    //Date range picker
    $('#logs_duration').daterangepicker();
	
	
	$('.applyBtn').blur(function() {
		var duration = $('#logs_duration').val();
		duration = duration.replace(/\//g, ".");
			window.location.href= site_url +  'profile_editor_logs/index/' + duration;
	});
	
});