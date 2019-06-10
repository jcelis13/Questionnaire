
function update_date(){
      timestamp = $("#timestamp").val();
      var date = new Date(timestamp*1000);    
      
      var data = getHourAndMeridian(date.getHours());
      
      var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        var mon = month[date.getMonth()];
        
        var weekday = new Array(7);
        weekday[0]=  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var weekday = weekday[date.getDay()];
        
        min = date.getMinutes();
        if(date.getMinutes() < 10)  {
            min = "0" + date.getMinutes();
        }
        
        sec = date.getSeconds()
        if(sec < 10){
            sec = "0" + date.getSeconds()
        }
      
      $(".weekday").html( weekday );
      $(".month").html( mon );
      $(".day").html( date.getDate() );
      $(".year").html( date.getFullYear() );
      $(".hours").html( data.hour );
      $(".minutes").html( min );
      $(".seconds").html( sec );
      $(".meridian").html( data.mer );
      
      $("#timestamp").val(parseInt( timestamp ) + 1);
      
  }
  
  function getHourAndMeridian( num ){
      data = new Array({"mer":"AM", "hour":num});
      if( num > 12){
          data.mer = "PM";
          data.hour = num - 12;
      }
      if(data.hour < 10){
          data.hour = "0" + data.hour;
      }
      
      return data;
  }
$(document).ready(function() {
	
	var timer = setInterval( function(){ update_date() }, 1000);
    //Initialize WYSIHTML5 - text editor
 //    $("#announcement_message").wysihtml5();
	
	// $("#edit_announcement_message").wysihtml5();
    
    //Date range picker
    $('#announcement-duration').daterangepicker();
	
    $('#edit_announcement-duration').daterangepicker();
    
    $('.event_date').daterangepicker();
	
	/*
		Branch: JEFFREY-announcements_table_db_change_07/11/2014
		Added:  click function announcement_list, save_announcement_btn
		  
		*/  
	
	
	$('.announcement_list').click(function(){
		var rowid = $(this).data('id');
			
		$.ajax({
			type: "POST", 
			url: site_url + 'ajax/announcement_ajax/view', 
			data: {rowid:rowid}, 
			success:function(data){ 
				$("#ann_div").html(data); 
				$('#edit_announcement_btn').data('id', rowid); 
				$('#announcement-item-modal').modal('show'); 
			} 
		}); 
	}); 
		
		
	$('#save_announcement_btn').click(function(){
		
		var title = $.trim( $('#announcement_title').val());
		var duration = $.trim( $('#announcement-duration').val());
		var message = $.trim( $('#announcement_message').val());
		var team_count = $("select[name='teams[]'] option:selected").length;							
		var err = "";
		var visibility_flag = true;
		
		if (!title) 	err += 'Title Required<br/>';
		if (!duration) 	err += 'Duration Required<br/>';
		if (!message) 	err += 'Message Required<br/>';
		if (team_count == 0 && $('#visible_selected').is(':checked')){
			err += 'You must select team(s)<br/>';
			visibility_flag = false;
		}
		
		if (title && duration && message && visibility_flag){
			$("#add_announcement_errors").hide();
			if ($('#visible_all').is(':checked'))
				var visibility_to = "all";
			else if ($('#visible_selected').is(':checked'))
				var visibility_to = $('#select_teams').val();
			$.ajax({
				type: "POST",
				url: site_url + 'ajax/announcement_ajax/add',
				data: {title:title, duration:duration, message:message, visibility_to:visibility_to}, 
				success:function(data) {
					window.location.href = site_url;
				}
			});
		}
		else{
			$("#add_announcement_errors").html(err.replace(/\n/g, '<br />'));
			$("#add_announcement_errors").show();
		}
			
	});
		
		
	$('#saveedit_announcement_btn').click(function(){
		var title = $.trim( $('#edit_announcement_title').val());
		var duration = $.trim( $('#edit_announcement-duration').val());
		var message = $.trim( $('#edit_announcement_message').val());
		var team_count = $("select[name='teams_edit[]'] option:selected").length;
		var id = $('#edit_announcement_btn').data('id');
		
		var err = "";
		var visibility_flag = true;
		
		if (!title) 	err += 'Title Required<br/>';
		if (!duration) 	err += 'Duration Required<br/>';
		if (!message) 	err += 'Message Required<br/>';
		if (team_count == 0 && $('#visible_selected_edit').is(':checked')){
			err += 'You must select team(s)<br/>';
			visibility_flag = false;
		}
			
		if(title && duration && message && visibility_flag){
			$("#add_announcement_errors").hide();
			if ($('#visible_all_edit').is(':checked'))
				var visibility_to = "all";
			else if ($('#visible_selected_edit').is(':checked'))
				var visibility_to = $('#select_teams_edit').val();
			$.ajax({
				type: "POST",
				url: site_url + 'ajax/announcement_ajax/add',
				data: {title:title, duration:duration, message:message, id:id, visibility_to:visibility_to}, 
				success:function(data) {
					window.location.href= site_url;
				}
			});
		}
		else{
			$("#edit_announcement_errors").html(err.replace(/\n/g, '<br />'));
			$("#edit_announcement_errors").show();
		}
	});
	
	
	$('#edit_announcement_btn').click(function(){
		$('#announcement-item-modal').modal('hide');
		var rowid = $('#edit_announcement_btn').data('id');
		
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/announcement_ajax/edit',
			data: {row_id:rowid}, 
			success:function(data) { 
				var parsedata = jQuery.parseJSON( data ); 
				
				if (parsedata.visibility == "all"){
					$("#visible_all_edit").iCheck("check");
					$("#announcement_teams_edit").hide();
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
				
				$("#edit_announcement_title") . val (parsedata.announcement_title);
				$("#edit_announcement-duration") . val (parsedata.announcement_duration);
				$("#posted_by") . text (parsedata.posted_by);
				editor.setValue(parsedata.announcement_message);
				
				$('#edit-announcement-modal').modal('show');
			}
		});
		
	});
	
	
	$('#delete_announcement_btn').click(function(){
		var rowid = $('#edit_announcement_btn').data('id');
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/announcement_ajax/delete',
			data: {row_id:rowid}, 
			success:function(data) {
				window.location.href= site_url;
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
	
  
   $('#add-event-modal .btn-danger').click(function(){
   
    $('#add-event-modal .event_title').val("");
    $('#add-event-modal .event_date').val("");
    $('#add-event-modal .event_url').val("");
   
   });
   
  
  $('#add-event-modal .save_event').click(function(){
  
    var title = $('#add-event-modal .event_title').val();
    var duration = $('#add-event-modal .event_date').val();
    var url = $('#add-event-modal .event_url').val();
    
    var err = "";
		if (!title) 			err += '<p>Title Required</p>';
		if (!duration) 	err += '<p>Duration Required</p>';
		$(".event_error").html(err);
    if(title && duration){
      $.ajax({
        type: "POST",
        url: site_url + 'ajax/calendar_ajax/add_event',
        data: {title:title, duration:duration, url:url}, 
        success:function(data) {
          window.location.href= site_url;
        }
      });
    }
  
  });
  
	
	

  $('#calendar').fullCalendar({ 
  
     eventSources:  [
                      {
    
                        type: "POST",
                        url: site_url + 'index.php/ajax/calendar_ajax/load_calendar_data',
                        data: {}

                      }
                   ]
  });
  
  $("#time-in").click(function(){
	    if($(this).hasClass("active")){
	        timestamp =  $("#timestamp").val();
	        $.ajax({
	            type: "POST",
	            url: site_url + 'ajax/time_tracker_ajax/add',
	            data: {timestamp:timestamp}, 
	            success:function(data) {
	                $("#time_tracker_modal .modal-body p").html(data.message);
	                $("#time_tracker_modal").modal("show");
	                
	                if(data.status == 1){
	                    $("#time-in").removeClass("active");
	                    $("#time-in").addClass("inactive");
	                    $("#time-out").removeClass("inactive");
	                    $("#time-out").addClass("active");
	                }
	            }
	        });
	    }    
	  });
	  
	  $("#time-out").click(function(){
	    if($(this).hasClass("active")){
	        timestamp =  $("#timestamp").val();
	        timestamp_logout = $("#timestamp_time_out").val();
	        submit = false;
	        if(timestamp_logout > timestamp){
	            $("#time_tracker_undertime_modal").modal("show");
	        }else{
	            submit_timeout(timestamp, ""); 
	        }
	    }    
	  });
	  
	  $("#submit_undertime").click(function(){
	      $("#time_tracker_undertime_modal").modal("hide");
	      $("#time_tracker_undertime_form_modal").modal("show");
	  });
	  
	  $("#submit_undertime_reason").click(function(){
	      
	      console.log("asdasdas");
	      reason = $("#undertime_reason").val();
	      timestamp =  $("#timestamp").val();
	      submit_timeout(timestamp, reason);
	  });
	  
	  function submit_timeout(timestamp, reason){
	      $.ajax({
	                type: "POST",
	                url: site_url + 'ajax/time_tracker_ajax/update',
	                data: {"timestamp":timestamp, "reason":reason},
	                success:function(data) {
	                	if(data.status == 1){
		                    $("#time-out").removeClass("active");
		                    $("#time-out").addClass("inactive");
		                    location.reload();
	                	}else{
	                		$("#time_tracker_modal .modal-body p").html(data.message);
	    	                $("#time_tracker_modal").modal("show");
	                	}
	                },
	                error: function( jqXHR, textStatus ) {
	                    console.log(jqXHR);
	                  alert( "Request failed: " + textStatus );
	                }
	            });
	  }
	  
	  
	      if($("#time-in").hasClass("active")){
	          //message = $("#time_tracker_warning").html();
//	          
//	          if(message.length > 0){
//	              $("#time_tracker_modal .modal-body p").html(message);
//	          }else{
//	              $("#time_tracker_modal .modal-body p").html("Please do not forget to Time-in!");
//	          }
	          $("#time_tracker_modal").modal("show");//alert("");
	      }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		
});