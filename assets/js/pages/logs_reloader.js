$(document).ready(function(){
	var limit = 100;
	var total = parseInt($("#count").html());
	var start = 0;
	var left = total;

	while(left > 0){
		if(left < limit)
			limit = left;
		$("#status").val($("#status").val() + "\n" + "Reloading logs from" + start + "to" + (parseInt(start) + parseInt(limit)) );

		$.ajax({
	            type: "POST",
	            async: false,
	            url: site_url + 'ajax/teams_ajax/reloadEmployeeLogs',
	            data: {limit: limit, start:start}, 
	            success:function(data) {
	                $("#status").val($("#status").val() + "\n" + "Logs reloaded:" + data.count + ".");
	            },
	            error: function(jqXHR, textStatus){
	            	
	            }
	        });
		start = parseInt(start) + parseInt(limit);
		left = parseInt(left) - parseInt(limit);
	}
});