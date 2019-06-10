$(document).ready(function() {

	var GLOBAL_DOC_URL = document.URL;

	$('#activate_users_department').change( function() {
		var department_selected = $('#activate_users_department').val();
		department_selected = department_selected.replace(/[^A-Z0-9]/ig, "");

		if (GLOBAL_DOC_URL.indexOf('os_login_account_manager') > -1) {
			window.location.href= site_url + 'employee/os_login_account_manager/' + department_selected;
		} else {
			window.location.href= site_url + 'employee/activate_users/' + department_selected;
		}
		
	});
	
	
	$('#activate_users_table').on("click", ".activate_wrapper", function() {
		$("#select_users_error").hide();
		$("#select_users_error2").hide();
		var id = $(this).data('id');
		var team = $(this).data('team');
		var tl_id = $(this).data('tl'); 
		console.log(tl_id);
		$('#confirmation_cancel').data('id', id);
		$('#confirmation_cancel').data('team', team);
		$('#confirmation_cancel').data('tl', tl_id);
		$.ajax({
			type: "POST",
			url:  site_url + "ajax/activate_users_ajax/view_teams",
			data: {id:id, tl_id:tl_id}, 
			success:function (data){
				$("#activate_users_team_name").text(" " + team);
				$("#view_teams_table").html("");
				$("#view_teams_table").append(data);
				$('#view-team-modal').modal('show');
			}
		});
	});


	var delayTimer;

	$("#activate_users_search").on("keyup", function() {
		var search_key = $.trim($("#activate_users_search").val());

		if(search_key.length > 0) {
			clearTimeout(delayTimer);
			delayTimer = setTimeout(function() {
				$("#activate_users_search_employee").val("");
				$.ajax({
					type: "POST",
					url:  site_url + "ajax/activate_users_ajax/search",
					data: {search_key:search_key},
					success:function (data){
						$(".table").html("");
						$(".table").append(data);
					}
				});
			}, 500);
		}
	});
	
	
	$("#activate_users_search_employee").on("keyup", function() {
		var search_key = $.trim($("#activate_users_search_employee").val());
		
		if(search_key.length > 0){
			clearTimeout(delayTimer);
			delayTimer = setTimeout(function() {
				$("#activate_users_search").val("");
				$.ajax({
					type: "POST",
					url:  site_url + "ajax/activate_users_ajax/search_employee",
					data: {search_key:search_key},
					success:function (data){
						$(".table").html("");
						$(".table").append(data);
					}
				});
			}, 500);
		}
	});
	
	
	$("#activate_floor_managers_search").on("keyup", function() {
		var search_key = $.trim($("#activate_floor_managers_search").val());
		
		if(search_key.length > 0){
			$.ajax({
				type: "POST",
				url:  site_url + "ajax/activate_users_ajax/search_floor_managers",
				data: {search_key:search_key}, 
				success:function (data){
					$(".table").html("");
					$(".table").append(data);
				}
			});
		}
		// else
			// window.location.href = site_url + 'employee/activate_floor_managers';
	});
	
	
	$("#view-team-modal, #activate_users_table").on("click", ".send_email_activate_user, .send_email_reset_password", function() {
		$("#confirm_button").prop('disabled', false);
		var id = $(this).data('id');
		var type = $(this).data('type');
		if(type == "activate_users_send_employee"){
			$('#confirmation_cancel').data('id', "NULL");
			type = "activate_users_send";
		}
		else if(type == "reset_password_send_employee"){
			$('#confirmation_cancel').data('id', "NULL");
			type = "reset_password_send";  
		} else {
			type = 'this';
		}
		$('#confirm_button').data('type', type);
		$("#loading_ni").removeClass("fa-spin fa-spinner fa-pulse");
		$("#loading_ni").addClass("fa-thumbs-o-up");
		$("#hidden_input").val(id); 
		$.ajax({
			type: "POST",
			url:  site_url + "ajax/activate_users_ajax/confirmation",
			data: {id:id, type:type}, 
			success:function (data){
				$("#confirmation_wrapper").html("");
				$("#confirmation_wrapper").append(data);
				$('#view-team-modal').modal('hide');
				$('#confirmation-modal').modal('show');
			}
		});
	});
	
	
	$("#activate_users_send, #reset_password_send").click(function(){
		var button_clicked = $(this).attr('id');
		var form = document.getElementById('activate_email_form');
		var checked = [];

		if (button_clicked == 'activate_users_send')
			var chks = form.querySelectorAll('input.activate_users_checkbox[type="checkbox"]');
		else if(button_clicked == 'reset_password_send')
			var chks = form.querySelectorAll('input.reset_password_checkbox[type="checkbox"]');
		
		for(var i = 0; i < chks.length; i++){
			if(chks[i].checked){
				checked.push(chks[i].value);
			}
		}
		//alert(checked);
		
		if(checked.length != 0){
			$("#hidden_input").val(checked);
			$("#loading_ni").removeClass("fa-spin fa-spinner fa-pulse");
			$("#loading_ni").addClass("fa-thumbs-o-up");
			$("#confirm_button").prop('disabled', false);
			$('#confirm_button').data('type', button_clicked);
			$.ajax({
				type: "POST", 
				url:  site_url + "ajax/activate_users_ajax/confirmation",
				data: {id:checked, type:button_clicked}, 
				success:function (data){ 
					$("#select_users_error").hide(); 
					$("#select_users_error2").hide(); 
					$("#confirmation_wrapper").html(""); 
					$("#confirmation_wrapper").append(data); 
					$('#view-team-modal').modal('hide'); 
					$('#confirmation-modal').modal('show'); 
				}
			});
		}
		else{
			if (button_clicked == 'activate_users_send'){
				$("#select_users_error").show();
				$("#select_users_error2").hide();
			}
			else{
				$("#select_users_error2").show();
				$("#select_users_error").hide();
			}
		}
	});
	
	
	//deselect buttons
	$("#activate_users_deselect, #reset_password_deselect").click(function(){
		var button_clicked = $(this).attr('id');
		if(button_clicked == 'activate_users_deselect'){
			var checkBoxes = $(".activate_users_checkbox");  
			checkBoxes.prop("checked", !checkBoxes.prop("checked"));
		}
		else if(button_clicked == 'reset_password_deselect'){
			var checkBoxes = $(".reset_password_checkbox"); 
			checkBoxes.prop("checked", !checkBoxes.prop("checked"));
		}
	});
	
	
	$("#confirmation-modal").on("click", "#confirmation_cancel", function(){
		var id = $(this).data('id');
		var team = $(this).data('team');
		var tl_id = $(this).data('tl'); 
		if(id != "NULL"){
			$.ajax({
				type: "POST",
				url:  site_url + "ajax/activate_users_ajax/view_teams",
				data: {id:id, tl_id:tl_id}, 
				success:function (data){
					$("#select_users_error").hide();
					$("#activate_users_team_name").text(" " + team);
					$("#view_teams_table").html("");
					$("#view_teams_table").append(data);
					$('#view-team-modal').modal('show');
				}
			});
		}
	});
	
	
	$("#confirm_button").click(function (){
		var type = $(this).data('type');
		var tmp_ids = $("#hidden_input").val();
		var id = tmp_ids.split(',');
		$.ajax({
			type: "POST",
			url:  site_url + "ajax/activate_users_ajax/get_emails",
			data: {id:id}, 
			success:function (data){
				var parsedata = jQuery.parseJSON( data );
				var no_email = parsedata.email;
				if(no_email.length == 0){ 
					$("#confirm_button").prop('disabled', true);
					$("#loading_ni").addClass("fa-spin fa-spinner fa-pulse");
					$("#loading_ni").removeClass("fa-thumbs-o-up");
					
					if(type == 'activate_users_send')
						var type_email = 'send_email';
					else if(type == 'reset_password_send')
						var type_email = 'send_password_reset_email';
					
					$.ajax({
						type: "POST", 
						url:  site_url + "ajax/activate_users_ajax/" + type_email,  
						data: {id:id}, 
						success:function (data){ 
							var pdata = jQuery.parseJSON( data );
							var failed = pdata.failed_email;
							$('#confirmation-modal').modal('hide');
							if(failed.length == 0){ 
								$('#email-sent-modal').modal('show'); 
								setTimeout(function() { 
									$('#email-sent-modal').modal('hide'); 
								}, 3000);
							}
							else{
								$('#failed-email-modal').modal('show');
								$("#failed_email_wrapper").html("");
								for(var i = 0; i < failed.length; i++){
									$("#failed_email_wrapper").append((i+1) + ". " + failed[i] + "<br/>");
								}
							}
						}
					});
				}
				else if(no_email.length == 1){
					$("#warning_wrapper").html("");
					$("#warning_wrapper").append("There was no email address found for <b>" + no_email[0][0] + "</b>. <br/>Please <a href='javascript:void(0)' id='click_here' data-id='" + no_email[0][1] + "'><b> CLICK HERE </b></a> to add an email add.");
					$("#warning-modal").modal('show');
				}
				else if(no_email.length > 1){
					$("#warning_wrapper").html("");
					$("#warning_wrapper").append("There were no email addresses found for the following users: </br>");
					for(var i = 0; i < no_email.length; i++){
						$("#warning_wrapper").append((i+1) + ". " + no_email[i][0] + "<br/>");
					}
					$("#warning_wrapper").append("<br/>Please go to the Employee List page to add their email addresses.");
					$("#warning-modal").modal('show');
				}
				
			}	
		});
	});
	
	
	$("#warning-modal").on("click", "#click_here", function(){
		var id = $(this).data('id');
		$("#add_email_error").hide();		
		$("#email_input").val("");
		$.ajax({ 
			type: "POST", 
			url:  site_url + "ajax/activate_users_ajax/get_name_add_email", 
			data: {id:id}, 
			success:function (data){ 
				$('#add_email_button').data('id', id);
				var parsedata = jQuery.parseJSON( data ); 
				$("#add_email_name").text(parsedata.name); 
				$("#add-email-modal").modal('show'); 
			} 
		}); 
	}); 
	
	
	$("#add_email_button").click(function(){
		var id 		= $(this).data('id');
		var email 	= $("#email_input").val();
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		
		if(!regex.test(email))
			$("#add_email_error").show();
		else{
			$("#add_email_error").hide();
			$.ajax({ 
				type: "POST", 
				url:  site_url + "ajax/activate_users_ajax/add_email", 
				data: {id:id, email:email}, 
				success:function (data){ 
					$("#add-email-modal").modal('hide'); 
					$("#warning-modal").modal('hide');
					$("#success-email-modal").modal('show');
					setTimeout(function() { 
						$('#success-email-modal').modal('hide'); 
					}, 2000);
				} 
			}); 
		}
		
	});
	

	
});







