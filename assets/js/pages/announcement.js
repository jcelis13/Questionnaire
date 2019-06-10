$(document).ready(function() {
    /*$('#calendar').fullCalendar({
        events:"https://www.google.com/calendar/feeds/en.philippines%23holiday%40group.v.calendar.google.com/public/basic"
    });*/
    
    //Initialize WYSIHTML5 - text editor
 	// $("#announcement_message").wysihtml5();
	
	// $("#edit_announcement_message").wysihtml5();

	$("#announcement_message").summernote({
      height: 300,                 // set editor height
      minHeight: null,             // set minimum height of editor
      maxHeight: null,             // set maximum height of editor
    });

    $("#edit_announcement_message").summernote({
      height: 300,                 // set editor height
      minHeight: null,             // set minimum height of editor
      maxHeight: null,             // set maximum height of editor
    });
    
    //Date range picker
    $('#announcement-duration').daterangepicker();
	
    $('#edit_announcement-duration').daterangepicker();
	
    $('#search_announcement-duration').daterangepicker();
	
	/*
		Branch: JEFFREY-announcements_table_db_change_07/11/2014
		Added:  click function announcement_list, save_announcement_btn
		*/    

	var GLOBAL_BROWSER_URL = document.URL;

	
	$('#edit_announcement_btn').click (function(){
		var title 		= $.trim( $('#edit_announcement_title').val());
		var duration 	= $.trim( $('#edit_announcement-duration').val());
		var message 	= $.trim( $('#edit_announcement_message').code());
		var team_count = $("select[name='teams_edit[]'] option:selected").length;
		var id 			= $('#edit_announcement_btn').data('id');

		var err = "";
		var visibility_flag = true;
		
		if (!title) 	err += '<p>Title Required</p>';
		if (!duration) 	err += '<p>Duration Required</p>';
		if (!message) 	err += '<p>Message Required</p>';
		if (team_count == 0 && $('#visible_selected_edit').is(':checked')){
			err += 'You must select team(s)<br/>';
			visibility_flag = false;
		}
		
		if(title && duration && message && visibility_flag){
			$("#edit_announcement_errors").hide();
			if ($('#visible_all_edit').is(':checked'))
				var visibility_to = "all";
			else if ($('#visible_selected_edit').is(':checked'))
				var visibility_to = $('#select_teams_edit').val();
			$.ajax({
				type: "POST",
				url: site_url + 'ajax/announcement_ajax/add',
				data: {title:title, duration:duration, message:message, id:id, visibility_to:visibility_to}, 
				success:function(data) {

					if(GLOBAL_BROWSER_URL.indexOf('announcement/admin_lte_announcement_manager') > -1) {
						window.location.href= site_url + 'announcement/admin_lte_announcement_manager';
					} else {
						window.location.href= site_url + 'announcement/announcement_manager';
					}

				}
			});
		}
		else{
			$("#edit_announcement_errors").html(err.replace(/\n/g, '<br />'));
			$("#edit_announcement_errors").show();
		}
	});
	
	
	$('.btn_view_announcement').click(function(){
		var rowid = $(this).data('id');
		$('#edit_announcement_btn').data('id', rowid);
		$.ajax({
			type: "POST", 
			url: site_url + 'ajax/announcement_ajax/edit',
			data: {row_id:rowid}, 
			success:function(data) {
				var parsedata = jQuery.parseJSON( data );
				
				if (parsedata.visibility == "all"){
					$('#select_teams_edit option').attr("selected", false);
					$("#visible_all_edit").iCheck("check");
					$("#announcement_teams_edit").hide();
					console.log("checked: " + $("#visible_all_edit").iCheck("check"));
				}
				else{
					$('#select_teams_edit option').attr("selected", false);
					$("#visible_selected_edit").iCheck("check");
					$("#announcement_teams_edit").show();
					var visibility = parsedata.visibility;
					$.each( visibility, function( key, value ) {
						$.each( value, function( key2, value2 ) {
							$("#select_teams_edit option[value='"+value2+"']").prop("selected", true);
						});
					});
				}
				
				$("#edit_announcement_title").val(parsedata.announcement_title);
				$("#edit_announcement-duration").val(parsedata.announcement_duration);
				$("#posted_by").text(parsedata.posted_by);
				
				$("#edit_announcement_message").code(parsedata.announcement_message);
				// editor.setValue(parsedata.announcement_message);
				$('#edit-announcement-modal').modal('show');
			}
		});
	});
	
	
	$('input[name=visibleto]:radio').on("ifClicked", function(){
		var selected = $(this).val();
		if (selected == "all")
			$('#announcement_teams').hide();
		else if(selected == "selected")
			$('#announcement_teams').show();
	});
	
	
	$('input[name=visibleto_edit]:radio').on("ifClicked", function(){
		var selected = $(this).val();
		if (selected == "all")
			$('#announcement_teams_edit').hide();
		else if(selected == "selected")
			$('#announcement_teams_edit').show();
	});
	
	
	$('.btn_delete_announcement').click(function(){
		var rowid = $(this).data('id');
		$('#delete_announcement_btn').data('id', rowid);
		$.ajax({
			type: "POST", 
			url: site_url + 'ajax/announcement_ajax/delete_view',
			data: {row_id:rowid}, 
			success:function(data){
				$("#delete_announcement_title").html(data);
				$('#delete-announcement-modal').modal('show');
			}
		});
	});

	
	$('#delete_announcement_btn').click(function(){
		var rowid = $('#delete_announcement_btn').data('id');
		$.ajax({
			type: "POST", 
			url: site_url + 'ajax/announcement_ajax/delete',
			data: {row_id:rowid}, 
			success:function(data) {

				if(GLOBAL_BROWSER_URL.indexOf('announcement/admin_lte_announcement_manager') > -1) {
					window.location.href= site_url + 'announcement/admin_lte_announcement_manager';
				} else {
					window.location.href= site_url + 'announcement/announcement_manager';
				}
			}
		});
	});
	
	
	$('.applyBtn').blur(function() {
		var duration = $('#search_announcement-duration').val();
		duration = duration.replace(/\//g, ".");
		
		if(!$('#edit-announcement-modal').hasClass('in'))
			if(GLOBAL_BROWSER_URL.indexOf('announcement/admin_lte_announcement_manager') > -1) {
				window.location.href= site_url +  'announcement/admin_lte_announcement_manager/' + duration + '/';
			} else {
				window.location.href= site_url +  'announcement/announcement_manager/' + duration + '/';
			}
			
	});
	
	
	$('#archive_announcement').bind('submit', function(event) {
		return false;
	});
	
	
	$('#archive_announcement_mul').click(function() {
		$("#delete_selected_announcement_btn").show();
		var form = document.getElementById('archive_announcement');
		var chks = form.querySelectorAll('input[type="checkbox"]');
		var count = 0;
		for(var i = 0; i < chks.length; i++){
			if(chks[i].checked)
				count++;
		}
		if(count == 0){
			$("#archive_count").text("No announcement selected");
			$("#delete_selected_announcement_btn").hide();
		}
		else
			$("#archive_count").text(count + " announcement(s) selected");
	});
	
	
	$('#delete_selected_announcement_btn').click(function() {
		var form = document.getElementById('archive_announcement');
		var chks = form.querySelectorAll('input[type="checkbox"]');
		var checked = [];
		for(var i = 0; i < chks.length; i++){
			if(chks[i].checked){
				checked.push(chks[i].value);
			}
		}

		$.ajax({
			type: "POST",
			url: site_url + 'ajax/announcement_ajax/multiple_delete',
			data: {checked:checked}, 
			success:function(data) {
				if(GLOBAL_BROWSER_URL.indexOf('announcement/admin_lte_announcement_manager') > -1) {
					window.location.href= site_url + 'announcement/admin_lte_announcement_manager';
				} else {
					window.location.href= site_url + 'announcement/announcement_manager';
				}
			}
		});
		
	});
	
	
	$('.view_teams').click(function() {
		var id = $(this).data('id');
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/announcement_ajax/view_teams',
			data: {id:id}, 
			success:function(data) {
				$("#view-teams-wrapper").html(data);
				$('#view-teams-modal').modal('show');
			}
		});
	});
		
});



