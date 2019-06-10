$(document).ready(function() {
  
    $('.team_schedule_start').timepicker({minuteStep: 1, showMeridian: false}); 
    $('.team_schedule_end').timepicker({minuteStep: 1, showMeridian: false});
    
    $( window ).load(function() {
      
      var team_id = $('.team_id').val();
      
      $.ajax({
        type: "POST",
        url: site_url + 'index.php/ajax/attendance_ajax/get_team_schedule',
        data: {team_id:team_id}, 
        success:function(data) {
          var team_schedule_data = $.parseJSON(data);
          var start;
          var end;
          var night_diff_array_start;
          var night_diff_array_end;
          var night_diff;
          
          if(team_schedule_data == null||team_schedule_data == ''){
            
            $('.schedule-group').addClass('border-warning');
            $('.set_schedule').addClass('btn-danger');
            $('.set_schedule').removeClass('btn-primary');
            $('.notification-schedule').html('<p class="warning">Set your team schedule.</p>');
            $('.save_attendance_tracker').addClass('hidden');
            $('.send_attendance_tracker').addClass('hidden');
            
          } else {
          
            start = team_schedule_data[0].start;
            end = team_schedule_data[0].end;
            
            //compute night diff
            night_diff_array_start = start.split(":");
            night_diff_array_end = end.split(":");
            
            night_diff_array_start = parseInt(night_diff_array_start[0]);
            night_diff_array_end = parseInt(night_diff_array_end[0]);
            
            /*if(parseInt(night_diff_array_start[0]) >= 22 && parseInt(night_diff_array_end[0]) <= 6 ){
              
            }*/
            $.ajax({
              type: "POST",
              url: site_url + 'index.php/ajax/attendance_ajax/get_team_night_diff',
              data: {team_id:team_id, start:night_diff_array_start, end:night_diff_array_end}, 
              success:function(data) {
              
                var nightdiff_total = $.parseJSON(data);
                $('.night_diff_total').val(nightdiff_total[0].nightdiff_min);
              
              }
            });
          
            $('input.team_schedule_start').val(start);
            $('input.team_schedule_end').val(end);
            
            console.log(night_diff_array_start);
            console.log(night_diff_array_end);

          }

        }
      });
    });

    /*$( window ).load(function() {
      var payperiod_id = $('select.payperiod').val();
      $.ajax({
      type: "POST",
			url: site_url + 'index.php/ajax/attendance_ajax/get_unread_count',
			data: {payperiod_id:payperiod_id}, 
			success:function(data) {
        var count = $.parseJSON(data);
        alert('load: '+ count);
				$('.notification').html('There are <b>' + count + '</b> newly submitted attendance sheets since your last login. Please see highlighted fields below.');
        if(count == 0){
        $('.notification').html('');
        }
			}
    });*/
      
      //<span class="notification">There are <span class="unread_count"></span> newly submitted attendance sheets since your last login. Please see highlighted fields below.</span>
    //});

   $('button.save_attendance_tracker').click(function(){
   
      var function_data = [];
      function_data.push("attendance/tracker"); //page name
      function_data.push("index.php/ajax/attendance_ajax/update_tracker_data"); //ajax function
      
      update_tracker(function_data);

   });

   $('button.send_attendance_tracker').click(function(){
   
    var function_data = [];
    function_data.push("attendance/tracker"); //page name
    function_data.push("index.php/ajax/attendance_ajax/send_tracker_data"); //ajax function
    
    update_tracker(function_data);
   });

   $( "select.payperiod" ).change(function () {
    var current_payperiod = "";
    var payperiod_id = $('select.payperiod').val();
    var per_page = 10;
    $( "select.payperiod option:selected" ).each(function() {
      current_payperiod += $( this ).text() + " ";
    });
    $( "span.selected_pay_period" ).text( current_payperiod );
    
    
    $.ajax({
      type: "POST",
			url: site_url + 'index.php/ajax/attendance_ajax/get_admin_attendance_tracker_records',
			data: {payperiod_id:payperiod_id, per_page:per_page}, 
			success:function(data) {
        var list_data = $.parseJSON(data);
        var result = '';
        $('table.admin_attendance_tracker_data tbody').empty();

          for(var i = 0; i<list_data.length; i++){
          result = result + '<tr class="status' + list_data[i].status + '">' +
                            '<td>' + list_data[i].team_name + '<input class="team_id" type="hidden" value="'+ list_data[i].team_id +'" /></td>' +
                            '<td>' + list_data[i].full_name + '</td>' +
                            '<td>' + list_data[i].department_name + '</td>' +
                            '<td>' + list_data[i].date_submitted + '</td>' +
                            '<td>' +
                            '<button id="unlock" class="' + list_data[i].team_name + '" data-target="#confirmation-dialog" data-toggle="modal">Unlock</button>' +
                            '<button id="view-data" class="' + list_data[i].team_name + '" data-target="#view-attendance-stats-dialog" data-toggle="modal">View</button></td>' +
                          '</tr>';
          }
          $('table.admin_attendance_tracker_data thead').after('<tbody>' + result + '</tbody>');

			}
    });
    
    $.ajax({
      type: "POST",
			url: site_url + 'index.php/ajax/attendance_ajax/get_unread_count',
			data: {payperiod_id:payperiod_id}, 
			success:function(data) {
        var count = $.parseJSON(data);
				$('.notification').html('There are <b>' + count + '</b> newly submitted attendance sheets since your last login. Please see highlighted fields below.');
        
        if(count == 0){
        $('.notification').html('');
        }
			}
    });
    
     
    
  }).change();
  
  $("table.admin_attendance_tracker_data").on("click", "button#unlock", function(){

    var team_name = $(this).prop('class');
    var team_id = $(this).parents().find('.team_id').val();
    console.log("orig team_id: " + team_id);  
    console.log("orig team_name: " + team_name);
    $('#confirmation-dialog input.team_id').val(team_id);
    $('#confirmation-dialog input.team_name').val(team_name);
    
  });
  
  $('#confirmation-dialog button.yes').click(function(){
  
    var team_name = $('#confirmation-dialog input.team_name').val();
    var team_id = $('#confirmation-dialog input.team_id').val();
    console.log("team_id: " + team_id);
    console.log("team_name: " + team_name);
    var payperiod_id = "";
     $( "select.payperiod option:selected" ).each(function() {
      payperiod_id += $( this ).val();
    });

    $.ajax({
        type: "POST",
				url: site_url + 'index.php/ajax/attendance_ajax/tracker_data_unseen',
				data: {team_name:team_name, payperiod_id:payperiod_id}, 
				success:function(data){}
    });
    $.ajax({
				type: "POST",
				url: site_url + 'index.php/ajax/attendance_ajax/unlock_tracker_record',
				data: {team_name:team_name, payperiod_id:payperiod_id, team_id:team_id}, 
				success:function(data) {
					window.location.href= site_url + 'attendance/admin';
				}
		});
  
  });

  $('button#view-data').click(function(e){
    var this_button = this;
    var team_name = $(this).prop('class');
    var payperiod_id = "";
     $( "select.payperiod option:selected" ).each(function() {
      payperiod_id += $( this ).val();
    });
    $.ajax({
        type: "POST",
				url: site_url + 'index.php/ajax/attendance_ajax/tracker_data_seen',
				data: {team_name:team_name, payperiod_id:payperiod_id}, 
				success:function(data){}
    });
    
    $.ajax({
      type: "POST",
			url: site_url + 'index.php/ajax/attendance_ajax/get_unread_count',
			data: {payperiod_id:payperiod_id}, 
			success:function(data) {
        var count = $.parseJSON(data);
				$('.notification').html('There are <b>' + count + '</b> newly submitted attendance sheets since your last login. Please see highlighted fields below.');
        if(count == 0){
        $(this_button).parent().closest('tr').removeClass('status1');
        $('.notification').html('');
        }
			}
    });
    
    $.ajax({
    
        type: "POST",
				url: site_url + 'index.php/ajax/attendance_ajax/display_tracker_data_to_admin',
				data: {team_name:team_name, payperiod_id:payperiod_id}, 
				success:function(data) {
          
          var tracker_data = $.parseJSON(data);
          var res = '';
          var res_late = '';
          var res_night_diff_ot = '';
          var res_reg_hol = '';
          var res_spec_hol = '';
          var res_reg_ot = '';
          var res_reg_rd_ot = '';
          var res_hol_ot = '';
          var res_spec_hol_ot = '';
          var res_hol_rd_ot = '';
          var res_spec_rd_hol_ot = '';
          //var res_spec_hol_ot = '';
         
      


          if(typeof tracker_data != 'undefined'){
         

            for(var i = 0; i<tracker_data.length; i++){
              //need to do this to get st
              var att1 = tracker_data[i].attendance_day_1;
              if(att1 == 1){
                att1 = "OFF";
              } else if(att1 == 2){
                att1 = "Present";
              } else if(att1 == 3){
                att1 = "Absent";
              } else if(att1 == 4){
                att1 = "Paid Leave";
              } 
              
              var att2 = tracker_data[i].attendance_day_2;
              if(att2 == 1){
                att2 = "OFF";
              } else if(att2 == 2){
                att2 = "Present";
              } else if(att2 == 3){
                att2 = "Absent";
              } else if(att2 == 4){
                att2 = "Paid Leave";
              }
              
              var att3 = tracker_data[i].attendance_day_3;
              if(att3 == 1){
                att3 = "OFF";
              } else if(att3 == 2){
                att3 = "Present";
              } else if(att3 == 3){
                att3 = "Absent";
              } else if(att3 == 4){
                att3 = "Paid Leave";
              }
              
              var att4 = tracker_data[i].attendance_day_4;
              if(att4 == 1){
                att4 = "OFF";
              } else if(att4 == 2){
                att4 = "Present";
              } else if(att4 == 3){
                att4 = "Absent";
              } else if(att4 == 4){
                att4 = "Paid Leave";
              }
              
              var att5 = tracker_data[i].attendance_day_5;
              if(att5 == 1){
                att5 = "OFF";
              } else if(att5 == 2){
                att5 = "Present";
              } else if(att5 == 3){
                att5 = "Absent";
              } else if(att5 == 4){
                att5 = "Paid Leave";
              } 
              
              var att6 = tracker_data[i].attendance_day_6;
              if(att6 == 1){
                att6 = "OFF";
              } else if(att6 == 2){
                att6 = "Present";
              } else if(att6 == 3){
                att6 = "Absent";
              } else if(att6 == 4){
                att6 = "Paid Leave";
              }
              
              var att7 = tracker_data[i].attendance_day_7;
              if(att7 == 1){
                att7 = "OFF";
              } else if(att7 == 2){
                att7 = "Present";
              } else if(att7 == 3){
                att7 = "Absent";
              } else if(att7 == 4){
                att7 = "Paid Leave";
              }
              
              var att8 = tracker_data[i].attendance_day_8;
              if(att8 == 1){
                att8 = "OFF";
              } else if(att8 == 2){
                att8 = "Present";
              } else if(att8 == 3){
                att8 = "Absent";
              } else if(att8 == 4){
                att8 = "Paid Leave";
              }
              
              var att9 = tracker_data[i].attendance_day_9;
              if(att9 == 1){
                att9 = "OFF";
              } else if(att9 == 2){
                att9 = "Present";
              } else if(att9 == 3){
                att9 = "Absent";
              } else if(att9 == 4){
                att9 = "Paid Leave";
              } 
              
              var att10 = tracker_data[i].attendance_day_10;
              if(att10 == 1){
                att10 = "OFF";
              } else if(att10 == 2){
                att10 = "Present";
              } else if(att10 == 3){
                att10 = "Absent";
              } else if(att10 == 4){
                att10 = "Paid Leave";
              }
              
              var att11 = tracker_data[i].attendance_day_11;
              if(att11 == 1){
                att11 = "OFF";
              } else if(att11 == 2){
                att11 = "Present";
              } else if(att11 == 3){
                att11 = "Absent";
              } else if(att11 == 4){
                att11 = "Paid Leave";
              }
              
              var att12 = tracker_data[i].attendance_day_12;
              if(att12 == 1){
                att12 = "OFF";
              } else if(att12 == 2){
                att12 = "Present";
              } else if(att12 == 3){
                att12 = "Absent";
              } else if(att12 == 4){
                att12 = "Paid Leave";
              }
              
              var att13 = tracker_data[i].attendance_day_13;
              if(att13 == 1){
                att13 = "OFF";
              } else if(att13 == 2){
                att13 = "Present";
              } else if(att13 == 3){
                att13 = "Absent";
              } else if(att13 == 4){
                att13 = "Paid Leave";
              } 
              
              var att14 = tracker_data[i].attendance_day_14;
              if(att14 == 1){
                att14 = "OFF";
              } else if(att14 == 2){
                att14 = "Present";
              } else if(att14 == 3){
                att14 = "Absent";
              } else if(att14 == 4){
                att14 = "Paid Leave";
              }
              
              var att15 = tracker_data[i].attendance_day_15;
              if(att15 == 1){
                att15 = "OFF";
              } else if(att15 == 2){
                att15 = "Present";
              } else if(att15 == 3){
                att15 = "Absent";
              } else if(att15 == 4){
                att15 = "Paid Leave";
              }
              
              var att16 = tracker_data[i].attendance_day_16;
              if(att16 == 1){
                att16 = "OFF";
              } else if(att16 == 2){
                att16 = "Present";
              } else if(att16 == 3){
                att16 = "Absent";
              } else if(att16 == 4){
                att16 = "Paid Leave";
              }
            
            
              res = res + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td>' + att1 +'</td>' +
                            '<td>' + att2 +'</td>' +
                            '<td>' + att3 +'</td>' +
                            '<td>' + att4 +'</td>' +
                            '<td>' + att5 +'</td>' +
                            '<td>' + att6 +'</td>' +
                            '<td>' + att7 +'</td>' +
                            '<td>' + att8 +'</td>' +
                            '<td>' + att9 +'</td>' +
                            '<td>' + att10 +'</td>' +
                            '<td>' + att11 +'</td>' +
                            '<td>' + att12 +'</td>' +
                            '<td>' + att13 +'</td>' +
                            '<td>' + att14 +'</td>' +
                            '<td>' + att15 +'</td>' +
                            '<td>' + att16 +'</td>' +
                            '<td>' + tracker_data[i].attendance_working_days +'</td>' +
                            '<td>' + tracker_data[i].attendance_days_worked +'</td>' 
                          '</tr>';
                          
              res_late = res_late + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_1 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_1 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_2 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_2 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_3 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_3 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_4 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_4 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_5 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_5 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_6 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_6 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_7 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_7 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_8 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_8 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_9 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_9 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_10 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_10 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_11 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_11 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_12 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_12 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_13 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_13 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_14 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_14 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_15 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_15 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_day_16 +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_day_16 +'</td>' +
                            '<td style="color: red">' + tracker_data[i].late_total +'</td>' +
                            '<td style="color: blue">' + tracker_data[i].late_undertime_total +'</td>' 
                          '</tr>';
              res_reg_hol = res_reg_hol + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_1 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_2 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_3 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_4 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_5 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_6 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_7 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_8 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_9 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_10 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_11 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_12 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_13 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_14 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_15 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday_day_16 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_holiday +'</td>' 
                          '</tr>';
              res_spec_hol = res_spec_hol + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_1 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_2 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_3 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_4 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_5 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_6 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_7 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_8 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_9 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_10 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_11 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_12 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_13 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_14 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_15 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_day_16 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday +'</td>' 
                          '</tr>';
              res_reg_ot = res_reg_ot + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_1 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_2 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_3 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_4 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_5 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_6 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_7 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_8 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_9 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_10 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_11 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_12 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_13 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_14 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_15 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime_day_16 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_overtime +'</td>' 
                          '</tr>';
              res_reg_rd_ot = res_reg_rd_ot + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_1 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_2 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_3 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_4 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_5 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_6 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_7 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_8 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_9 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_10 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_11 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_12 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_13 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_14 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_15 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime_day_16 +'</td>' +
                            '<td>' + tracker_data[i].overtime_regular_rest_day_overtime +'</td>' 
                          '</tr>';
              res_hol_ot = res_hol_ot + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_1 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_2 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_3 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_4 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_5 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_6 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_7 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_8 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_9 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_10 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_11 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_12 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_13 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_14 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_15 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime_day_16 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_overtime +'</td>' 
                          '</tr>';
              res_spec_hol_ot = res_spec_hol_ot + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_1 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_2 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_3 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_4 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_5 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_6 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_7 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_8 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_9 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_10 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_11 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_12 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_13 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_14 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_15 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime_day_16 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_holiday_overtime +'</td>' 
                          '</tr>';
              res_hol_rd_ot = res_hol_rd_ot + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_1 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_2 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_3 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_4 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_5 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_6 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_7 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_8 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_9 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_10 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_11 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_12 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_13 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_14 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_15 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime_day_16 +'</td>' +
                            '<td>' + tracker_data[i].overtime_holiday_rest_day_overtime +'</td>' 
                          '</tr>';
              res_spec_rd_hol_ot = res_spec_rd_hol_ot + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_1 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_2 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_3 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_4 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_5 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_6 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_7 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_8 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_9 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_10 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_11 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_12 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_13 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_14 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_15 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime_day_16 +'</td>' +
                            '<td>' + tracker_data[i].overtime_special_rest_day_holiday_overtime +'</td>' 
                          '</tr>';
              res_night_diff_ot = res_night_diff_ot + '<tr>' +
                            '<td>' + tracker_data[i].full_name +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_1 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_2 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_3 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_4 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_5 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_6 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_7 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_8 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_9 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_10 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_11 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_12 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_13 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_14 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_15 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime_day_16 +'</td>' +
                            '<td>' + tracker_data[i].overtime_night_differential_overtime +'</td>' 
                          '</tr>';
            }
            
            $('table.attendance-table tr').after(res);
            $('table.late-table tr').after(res_late);
            $('table.overtime-night-diff-table tr').after(res_night_diff_ot);
            $('table.overtime-reg-holiday-table tr').after(res_reg_hol);
            $('table.overtime-special-holiday-table tr').after(res_spec_hol);
            $('table.overtime-regular-overtime-table tr').after(res_reg_ot);
            $('table.overtime-reg-rd-ot-table tr').after(res_reg_rd_ot);
            $('table.overtime-hol-ot-table tr').after(res_hol_ot);
            $('table.overtime-spec-hol-ot-table tr').after(res_spec_hol_ot);
            $('table.overtime-hol-rd-ot-table tr').after(res_hol_rd_ot);
            $('table.overtime-spec-rd-hol-ot-table tr').after(res_spec_rd_hol_ot);
            
            
          } else {
          
            
          
            
  
            $('table.attendance-table').empty();
            

            $('table.late-table').empty();
            //
            $('table.overtime-reg-holiday-table tr').empty();
            $('table.overtime-special-holiday-table').empty();
            $('table.overtime-regular-overtime-table').empty();
            $('table.overtime-reg-rd-ot-table').empty();
            $('table.overtime-hol-ot-table').empty();
            $('table.overtime-spec-hol-ot-table').empty();
            $('table.overtime-hol-rd-ot-table').empty();
            $('table.overtime-spec-rd-hol-ot-table').empty();
            //


          
          }
          
        }
        
    
    });
     
  });
  
  $('button[data-dismiss="modal"]').click(function(e){
      e.preventDefault();
      var res_att = '<tr><th>Name</th><th>Day 1</th><th>Day 2</th><th>Day 3</th><th>Day 4</th><th>Day 5</th><th>Day 6</th><th>Day 7</th><th>Day 8</th><th>Day 9</th><th>Day 10</th><th>Day 11</th><th>Day 12</th><th>Day 13</th><th>Day 14</th><th>Day 15</th><th>Day 16</th><th>Working Days</th><th>Days Worked</th></tr>';
      var res_late = '<tr><th>Name</th><th colspan="2">Day 1</th><th colspan="2">Day 2</th><th colspan="2">Day 3</th><th colspan="2">Day 4</th><th colspan="2">Day 5</th><th colspan="2">Day 6</th><th colspan="2">Day 7</th><th colspan="2">Day 8</th><th colspan="2">Day 9</th><th colspan="2">Day 10</th><th colspan="2">Day 11</th><th colspan="2">Day 12</th><th colspan="2">Day 13</th><th colspan="2">Day 14</th><th colspan="2">Day 15</th><th colspan="2">Day 16</th><th>Late Total Mins.</th><th>Undetime Total Mins.</th></tr>';
      var res_ot = '<tr><th>Name</th><th >Day 1</th><th >Day 2</th><th >Day 3</th><th >Day 4</th><th >Day 5</th><th >Day 6</th><th >Day 7</th><th >Day 8</th><th >Day 9</th><th >Day 10</th><th >Day 11</th><th >Day 12</th><th >Day 13</th><th >Day 14</th><th >Day 15</th><th >Day 16</th><th>Total</th></tr>';
      
        $('table.attendance-table').empty();
        $('table.attendance-table').append(res_att);
        $('table.late-table').empty();
        $('table.late-table').append(res_late);
        $('table.overtime-night-diff-table').empty();
        $('table.overtime-night-diff-table').append(res_ot);
        $('table.overtime-reg-holiday-table').empty();
        $('table.overtime-reg-holiday-table').append(res_ot);
        $('table.overtime-special-holiday-table').empty();
        $('table.overtime-special-holiday-table').append(res_ot);
        $('table.overtime-regular-overtime-table').empty();
        $('table.overtime-regular-overtime-table').append(res_ot);
        $('table.overtime-reg-rd-ot-table').empty();
        $('table.overtime-reg-rd-ot-table').append(res_ot);
        $('table.overtime-hol-ot-table').empty();
        $('table.overtime-hol-ot-table').append(res_ot);
        $('table.overtime-spec-hol-ot-table').empty();
        $('table.overtime-spec-hol-ot-table').append(res_ot);
        $('table.overtime-hol-rd-ot-table').empty();
        $('table.overtime-hol-rd-ot-table').append(res_ot);
        $('table.overtime-spec-rd-hol-ot-table').empty();
        $('table.overtime-spec-rd-hol-ot-table').append(res_ot);

  });
  
  function update_tracker(function_data){
  
      var user = [];

      var pay_period = $('input.payperiod_id').val();
      var working_days = [];
      var days_worked = [];
   
      var attendance_day_1_data = [];
      var attendance_day_2_data = [];
      var attendance_day_3_data = [];
      var attendance_day_4_data = [];
      var attendance_day_5_data = [];
      var attendance_day_6_data = [];
      var attendance_day_7_data = [];
      var attendance_day_8_data = [];
      var attendance_day_9_data = [];
      var attendance_day_10_data = [];
      var attendance_day_11_data = [];
      var attendance_day_12_data = [];
      var attendance_day_13_data = [];
      var attendance_day_14_data = [];
      var attendance_day_15_data = [];
      var attendance_day_16_data = [];
      
      var late_day_1_data = [];
      var late_day_2_data = [];
      var late_day_3_data = [];
      var late_day_4_data = [];
      var late_day_5_data = [];
      var late_day_6_data = [];
      var late_day_7_data = [];
      var late_day_8_data = [];
      var late_day_9_data = [];
      var late_day_10_data = [];
      var late_day_11_data = [];
      var late_day_12_data = [];
      var late_day_13_data = [];
      var late_day_14_data = [];
      var late_day_15_data = [];
      var late_day_16_data = [];
      
      var undertime_day_1_data = [];
      var undertime_day_2_data = [];
      var undertime_day_3_data = [];
      var undertime_day_4_data = [];
      var undertime_day_5_data = [];
      var undertime_day_6_data = [];
      var undertime_day_7_data = [];
      var undertime_day_8_data = [];
      var undertime_day_9_data = [];
      var undertime_day_10_data = [];
      var undertime_day_11_data = [];
      var undertime_day_12_data = [];
      var undertime_day_13_data = [];
      var undertime_day_14_data = [];
      var undertime_day_15_data = [];
      var undertime_day_16_data = [];
      
      var overtime_night_differential_day_1_data = [];
      var overtime_night_differential_day_2_data = [];
      var overtime_night_differential_day_3_data = [];
      var overtime_night_differential_day_4_data = [];
      var overtime_night_differential_day_5_data = [];
      var overtime_night_differential_day_6_data = [];
      var overtime_night_differential_day_7_data = [];
      var overtime_night_differential_day_8_data = [];
      var overtime_night_differential_day_9_data = [];
      var overtime_night_differential_day_10_data = [];
      var overtime_night_differential_day_11_data = [];
      var overtime_night_differential_day_12_data = [];
      var overtime_night_differential_day_13_data = [];
      var overtime_night_differential_day_14_data = [];
      var overtime_night_differential_day_15_data = [];
      var overtime_night_differential_day_16_data = [];
      
      var overtime_regular_holiday_day_1_data = [];
      var overtime_regular_holiday_day_2_data = [];
      var overtime_regular_holiday_day_3_data = [];
      var overtime_regular_holiday_day_4_data = [];
      var overtime_regular_holiday_day_5_data = [];
      var overtime_regular_holiday_day_6_data = [];
      var overtime_regular_holiday_day_7_data = [];
      var overtime_regular_holiday_day_8_data = [];
      var overtime_regular_holiday_day_9_data = [];
      var overtime_regular_holiday_day_10_data = [];
      var overtime_regular_holiday_day_11_data = [];
      var overtime_regular_holiday_day_12_data = [];
      var overtime_regular_holiday_day_13_data = [];
      var overtime_regular_holiday_day_14_data = [];
      var overtime_regular_holiday_day_15_data = [];
      var overtime_regular_holiday_day_16_data = [];
      
      var overtime_special_holiday_day_1_data = [];
      var overtime_special_holiday_day_2_data = [];
      var overtime_special_holiday_day_3_data = [];
      var overtime_special_holiday_day_4_data = [];
      var overtime_special_holiday_day_5_data = [];
      var overtime_special_holiday_day_6_data = [];
      var overtime_special_holiday_day_7_data = [];
      var overtime_special_holiday_day_8_data = [];
      var overtime_special_holiday_day_9_data = [];
      var overtime_special_holiday_day_10_data = [];
      var overtime_special_holiday_day_11_data = [];
      var overtime_special_holiday_day_12_data = [];
      var overtime_special_holiday_day_13_data = [];
      var overtime_special_holiday_day_14_data = [];
      var overtime_special_holiday_day_15_data = [];
      var overtime_special_holiday_day_16_data = [];
      
      var overtime_regular_overtime_day_1_data = [];
      var overtime_regular_overtime_day_2_data = [];
      var overtime_regular_overtime_day_3_data = [];
      var overtime_regular_overtime_day_4_data = [];
      var overtime_regular_overtime_day_5_data = [];
      var overtime_regular_overtime_day_6_data = [];
      var overtime_regular_overtime_day_7_data = [];
      var overtime_regular_overtime_day_8_data = [];
      var overtime_regular_overtime_day_9_data = [];
      var overtime_regular_overtime_day_10_data = [];
      var overtime_regular_overtime_day_11_data = [];
      var overtime_regular_overtime_day_12_data = [];
      var overtime_regular_overtime_day_13_data = [];
      var overtime_regular_overtime_day_14_data = [];
      var overtime_regular_overtime_day_15_data = [];
      var overtime_regular_overtime_day_16_data = [];
      
      var overtime_regular_rest_day_overtime_day_1_data = [];
      var overtime_regular_rest_day_overtime_day_2_data = [];
      var overtime_regular_rest_day_overtime_day_3_data = [];
      var overtime_regular_rest_day_overtime_day_4_data = [];
      var overtime_regular_rest_day_overtime_day_5_data = [];
      var overtime_regular_rest_day_overtime_day_6_data = [];
      var overtime_regular_rest_day_overtime_day_7_data = [];
      var overtime_regular_rest_day_overtime_day_8_data = [];
      var overtime_regular_rest_day_overtime_day_9_data = [];
      var overtime_regular_rest_day_overtime_day_10_data = [];
      var overtime_regular_rest_day_overtime_day_11_data = [];
      var overtime_regular_rest_day_overtime_day_12_data = [];
      var overtime_regular_rest_day_overtime_day_13_data = [];
      var overtime_regular_rest_day_overtime_day_14_data = [];
      var overtime_regular_rest_day_overtime_day_15_data = [];
      var overtime_regular_rest_day_overtime_day_16_data = [];
      
      var overtime_holiday_overtime_day_1_data = [];
      var overtime_holiday_overtime_day_2_data = [];
      var overtime_holiday_overtime_day_3_data = [];
      var overtime_holiday_overtime_day_4_data = [];
      var overtime_holiday_overtime_day_5_data = [];
      var overtime_holiday_overtime_day_6_data = [];
      var overtime_holiday_overtime_day_7_data = [];
      var overtime_holiday_overtime_day_8_data = [];
      var overtime_holiday_overtime_day_9_data = [];
      var overtime_holiday_overtime_day_10_data = [];
      var overtime_holiday_overtime_day_11_data = [];
      var overtime_holiday_overtime_day_12_data = [];
      var overtime_holiday_overtime_day_13_data = [];
      var overtime_holiday_overtime_day_14_data = [];
      var overtime_holiday_overtime_day_15_data = [];
      var overtime_holiday_overtime_day_16_data = [];
      
      var overtime_special_holiday_overtime_day_1_data = [];
      var overtime_special_holiday_overtime_day_2_data = [];
      var overtime_special_holiday_overtime_day_3_data = [];
      var overtime_special_holiday_overtime_day_4_data = [];
      var overtime_special_holiday_overtime_day_5_data = [];
      var overtime_special_holiday_overtime_day_6_data = [];
      var overtime_special_holiday_overtime_day_7_data = [];
      var overtime_special_holiday_overtime_day_8_data = [];
      var overtime_special_holiday_overtime_day_9_data = [];
      var overtime_special_holiday_overtime_day_10_data = [];
      var overtime_special_holiday_overtime_day_11_data = [];
      var overtime_special_holiday_overtime_day_12_data = [];
      var overtime_special_holiday_overtime_day_13_data = [];
      var overtime_special_holiday_overtime_day_14_data = [];
      var overtime_special_holiday_overtime_day_15_data = [];
      var overtime_special_holiday_overtime_day_16_data = [];
      
      var overtime_holiday_rest_day_overtime_day_1_data = [];
      var overtime_holiday_rest_day_overtime_day_2_data = [];
      var overtime_holiday_rest_day_overtime_day_3_data = [];
      var overtime_holiday_rest_day_overtime_day_4_data = [];
      var overtime_holiday_rest_day_overtime_day_5_data = [];
      var overtime_holiday_rest_day_overtime_day_6_data = [];
      var overtime_holiday_rest_day_overtime_day_7_data = [];
      var overtime_holiday_rest_day_overtime_day_8_data = [];
      var overtime_holiday_rest_day_overtime_day_9_data = [];
      var overtime_holiday_rest_day_overtime_day_10_data = [];
      var overtime_holiday_rest_day_overtime_day_11_data = [];
      var overtime_holiday_rest_day_overtime_day_12_data = [];
      var overtime_holiday_rest_day_overtime_day_13_data = [];
      var overtime_holiday_rest_day_overtime_day_14_data = [];
      var overtime_holiday_rest_day_overtime_day_15_data = [];
      var overtime_holiday_rest_day_overtime_day_16_data = [];
      
      var overtime_special_rest_day_holiday_overtime_day_1_data = [];
      var overtime_special_rest_day_holiday_overtime_day_2_data = [];
      var overtime_special_rest_day_holiday_overtime_day_3_data = [];
      var overtime_special_rest_day_holiday_overtime_day_4_data = [];
      var overtime_special_rest_day_holiday_overtime_day_5_data = [];
      var overtime_special_rest_day_holiday_overtime_day_6_data = [];
      var overtime_special_rest_day_holiday_overtime_day_7_data = [];
      var overtime_special_rest_day_holiday_overtime_day_8_data = [];
      var overtime_special_rest_day_holiday_overtime_day_9_data = [];
      var overtime_special_rest_day_holiday_overtime_day_10_data = [];
      var overtime_special_rest_day_holiday_overtime_day_11_data = [];
      var overtime_special_rest_day_holiday_overtime_day_12_data = [];
      var overtime_special_rest_day_holiday_overtime_day_13_data = [];
      var overtime_special_rest_day_holiday_overtime_day_14_data = [];
      var overtime_special_rest_day_holiday_overtime_day_15_data = [];
      var overtime_special_rest_day_holiday_overtime_day_16_data = [];
      
      
      $('#attendance .full_name').each(function(){
      
        user.push($(this).find('input[type="hidden"]').val());
        
        attendance_day_1_data.push($(this).siblings().find('#select_attendance_day_1').val());
        attendance_day_2_data.push($(this).siblings().find('#select_attendance_day_2').val());
        attendance_day_3_data.push($(this).siblings().find('#select_attendance_day_3').val());
        attendance_day_4_data.push($(this).siblings().find('#select_attendance_day_4').val());
        attendance_day_5_data.push($(this).siblings().find('#select_attendance_day_5').val());
        attendance_day_6_data.push($(this).siblings().find('#select_attendance_day_6').val());
        attendance_day_7_data.push($(this).siblings().find('#select_attendance_day_7').val());
        attendance_day_8_data.push($(this).siblings().find('#select_attendance_day_8').val());
        attendance_day_9_data.push($(this).siblings().find('#select_attendance_day_9').val());
        attendance_day_10_data.push($(this).siblings().find('#select_attendance_day_10').val());
        attendance_day_11_data.push($(this).siblings().find('#select_attendance_day_11').val());
        attendance_day_12_data.push($(this).siblings().find('#select_attendance_day_12').val());
        attendance_day_13_data.push($(this).siblings().find('#select_attendance_day_13').val());
        attendance_day_14_data.push($(this).siblings().find('#select_attendance_day_14').val());
        attendance_day_15_data.push($(this).siblings().find('#select_attendance_day_15').val());
        if($(this).siblings().find('#select_attendance_day_16').length){
          attendance_day_16_data.push($(this).siblings().find('#select_attendance_day_16').val());
        } else {attendance_day_16_data.push(0);}

        
      });
      
      /*$('#attendance .full_name').each(function(){
     
         working_days.push($( "#select_attendance_day_1[value='1']" ).length);
      
      });*/

      
      $('#lates_undertime .full_name').each(function(){
      
        late_day_1_data.push($(this).siblings().find('.late_day_1').val());
        late_day_2_data.push($(this).siblings().find('.late_day_2').val());
        late_day_3_data.push($(this).siblings().find('.late_day_3').val());
        late_day_4_data.push($(this).siblings().find('.late_day_4').val());
        late_day_5_data.push($(this).siblings().find('.late_day_5').val());
        late_day_6_data.push($(this).siblings().find('.late_day_6').val());
        late_day_7_data.push($(this).siblings().find('.late_day_7').val());
        late_day_8_data.push($(this).siblings().find('.late_day_8').val());
        late_day_9_data.push($(this).siblings().find('.late_day_9').val());
        late_day_10_data.push($(this).siblings().find('.late_day_10').val());
        late_day_11_data.push($(this).siblings().find('.late_day_11').val());
        late_day_12_data.push($(this).siblings().find('.late_day_12').val());
        late_day_13_data.push($(this).siblings().find('.late_day_13').val());
        late_day_14_data.push($(this).siblings().find('.late_day_14').val());
        late_day_15_data.push($(this).siblings().find('.late_day_15').val());
        if($(this).siblings().find('.late_day_16').length){
          late_day_16_data.push($(this).siblings().find('.late_day_16').val());
        } else {late_day_16_data.push(0);}
        undertime_day_1_data.push($(this).siblings().find('.undertime_day_1').val());
        undertime_day_2_data.push($(this).siblings().find('.undertime_day_2').val());
        undertime_day_3_data.push($(this).siblings().find('.undertime_day_3').val());
        undertime_day_4_data.push($(this).siblings().find('.undertime_day_4').val());
        undertime_day_5_data.push($(this).siblings().find('.undertime_day_5').val());
        undertime_day_6_data.push($(this).siblings().find('.undertime_day_6').val());
        undertime_day_7_data.push($(this).siblings().find('.undertime_day_7').val());
        undertime_day_8_data.push($(this).siblings().find('.undertime_day_8').val());
        undertime_day_9_data.push($(this).siblings().find('.undertime_day_9').val());
        undertime_day_10_data.push($(this).siblings().find('.undertime_day_10').val());
        undertime_day_11_data.push($(this).siblings().find('.undertime_day_11').val());
        undertime_day_12_data.push($(this).siblings().find('.undertime_day_12').val());
        undertime_day_13_data.push($(this).siblings().find('.undertime_day_13').val());
        undertime_day_14_data.push($(this).siblings().find('.undertime_day_14').val());
        undertime_day_15_data.push($(this).siblings().find('.undertime_day_15').val());
        if($(this).siblings().find('.undertime_day_16').length){
          undertime_day_16_data.push($(this).siblings().find('.undertime_day_16').val());
        } else {undertime_day_16_data.push(0);}
        
        console.log(attendance_day_1_data);
        console.log(late_day_1_data);
        console.log(user);
        console.log(working_days);
        //console.log(days_worked);
      
      });
      
      $('#overtime .full_name').each(function(){
      
        overtime_night_differential_day_1_data.push($('.night_diff_total').val());
        overtime_night_differential_day_2_data.push($('.night_diff_total').val());
        overtime_night_differential_day_3_data.push($('.night_diff_total').val());
        overtime_night_differential_day_4_data.push($('.night_diff_total').val());
        overtime_night_differential_day_5_data.push($('.night_diff_total').val());
        overtime_night_differential_day_6_data.push($('.night_diff_total').val());
        overtime_night_differential_day_7_data.push($('.night_diff_total').val());
        overtime_night_differential_day_8_data.push($('.night_diff_total').val());
        overtime_night_differential_day_9_data.push($('.night_diff_total').val());
        overtime_night_differential_day_10_data.push($('.night_diff_total').val());
        overtime_night_differential_day_11_data.push($('.night_diff_total').val());
        overtime_night_differential_day_12_data.push($('.night_diff_total').val());
        overtime_night_differential_day_13_data.push($('.night_diff_total').val());
        overtime_night_differential_day_14_data.push($('.night_diff_total').val());
        overtime_night_differential_day_15_data.push($('.night_diff_total').val());
        if($(this).siblings().find('.overtime_regular_holiday_day_16').length){
        overtime_night_differential_day_16_data.push($('.night_diff_total').val());
        } else {overtime_night_differential_day_16_data.push(0);}
      
        overtime_regular_holiday_day_1_data.push($(this).siblings().find('.overtime_regular_holiday_day_1').val());
        overtime_regular_holiday_day_2_data.push($(this).siblings().find('.overtime_regular_holiday_day_2').val());
        overtime_regular_holiday_day_3_data.push($(this).siblings().find('.overtime_regular_holiday_day_3').val());
        overtime_regular_holiday_day_4_data.push($(this).siblings().find('.overtime_regular_holiday_day_4').val());
        overtime_regular_holiday_day_5_data.push($(this).siblings().find('.overtime_regular_holiday_day_5').val());
        overtime_regular_holiday_day_6_data.push($(this).siblings().find('.overtime_regular_holiday_day_6').val());
        overtime_regular_holiday_day_7_data.push($(this).siblings().find('.overtime_regular_holiday_day_7').val());
        overtime_regular_holiday_day_8_data.push($(this).siblings().find('.overtime_regular_holiday_day_8').val());
        overtime_regular_holiday_day_9_data.push($(this).siblings().find('.overtime_regular_holiday_day_9').val());
        overtime_regular_holiday_day_10_data.push($(this).siblings().find('.overtime_regular_holiday_day_10').val());
        overtime_regular_holiday_day_11_data.push($(this).siblings().find('.overtime_regular_holiday_day_11').val());
        overtime_regular_holiday_day_12_data.push($(this).siblings().find('.overtime_regular_holiday_day_12').val());
        overtime_regular_holiday_day_13_data.push($(this).siblings().find('.overtime_regular_holiday_day_13').val());
        overtime_regular_holiday_day_14_data.push($(this).siblings().find('.overtime_regular_holiday_day_14').val());
        overtime_regular_holiday_day_15_data.push($(this).siblings().find('.overtime_regular_holiday_day_15').val());
        if($(this).siblings().find('.overtime_regular_holiday_day_16').length){
        overtime_regular_holiday_day_16_data.push($(this).siblings().find('.overtime_regular_holiday_day_16').val());
        } else {overtime_regular_holiday_day_16_data.push(0);}
        overtime_special_holiday_day_1_data.push($(this).siblings().find('.overtime_special_holiday_day_1').val());
        overtime_special_holiday_day_2_data.push($(this).siblings().find('.overtime_special_holiday_day_2').val());
        overtime_special_holiday_day_3_data.push($(this).siblings().find('.overtime_special_holiday_day_3').val());
        overtime_special_holiday_day_4_data.push($(this).siblings().find('.overtime_special_holiday_day_4').val());
        overtime_special_holiday_day_5_data.push($(this).siblings().find('.overtime_special_holiday_day_5').val());
        overtime_special_holiday_day_6_data.push($(this).siblings().find('.overtime_special_holiday_day_6').val());
        overtime_special_holiday_day_7_data.push($(this).siblings().find('.overtime_special_holiday_day_7').val());
        overtime_special_holiday_day_8_data.push($(this).siblings().find('.overtime_special_holiday_day_8').val());
        overtime_special_holiday_day_9_data.push($(this).siblings().find('.overtime_special_holiday_day_9').val());
        overtime_special_holiday_day_10_data.push($(this).siblings().find('.overtime_special_holiday_day_10').val());
        overtime_special_holiday_day_11_data.push($(this).siblings().find('.overtime_special_holiday_day_11').val());
        overtime_special_holiday_day_12_data.push($(this).siblings().find('.overtime_special_holiday_day_12').val());
        overtime_special_holiday_day_13_data.push($(this).siblings().find('.overtime_special_holiday_day_13').val());
        overtime_special_holiday_day_14_data.push($(this).siblings().find('.overtime_special_holiday_day_14').val());
        overtime_special_holiday_day_15_data.push($(this).siblings().find('.overtime_special_holiday_day_15').val());
        if($(this).siblings().find('.overtime_special_holiday_day_16').length){
        overtime_special_holiday_day_16_data.push($(this).siblings().find('.overtime_special_holiday_day_16').val());
        } else {overtime_special_holiday_day_16_data.push(0);}
        overtime_regular_overtime_day_1_data.push($(this).siblings().find('.overtime_regular_overtime_day_1').val());
        overtime_regular_overtime_day_2_data.push($(this).siblings().find('.overtime_regular_overtime_day_2').val());
        overtime_regular_overtime_day_3_data.push($(this).siblings().find('.overtime_regular_overtime_day_3').val());
        overtime_regular_overtime_day_4_data.push($(this).siblings().find('.overtime_regular_overtime_day_4').val());
        overtime_regular_overtime_day_5_data.push($(this).siblings().find('.overtime_regular_overtime_day_5').val());
        overtime_regular_overtime_day_6_data.push($(this).siblings().find('.overtime_regular_overtime_day_6').val());
        overtime_regular_overtime_day_7_data.push($(this).siblings().find('.overtime_regular_overtime_day_7').val());
        overtime_regular_overtime_day_8_data.push($(this).siblings().find('.overtime_regular_overtime_day_8').val());
        overtime_regular_overtime_day_9_data.push($(this).siblings().find('.overtime_regular_overtime_day_9').val());
        overtime_regular_overtime_day_10_data.push($(this).siblings().find('.overtime_regular_overtime_day_10').val());
        overtime_regular_overtime_day_11_data.push($(this).siblings().find('.overtime_regular_overtime_day_11').val());
        overtime_regular_overtime_day_12_data.push($(this).siblings().find('.overtime_regular_overtime_day_12').val());
        overtime_regular_overtime_day_13_data.push($(this).siblings().find('.overtime_regular_overtime_day_13').val());
        overtime_regular_overtime_day_14_data.push($(this).siblings().find('.overtime_regular_overtime_day_14').val());
        overtime_regular_overtime_day_15_data.push($(this).siblings().find('.overtime_regular_overtime_day_15').val());
        if($(this).siblings().find('.overtime_regular_overtime_day_16').length){
          overtime_regular_overtime_day_16_data.push($(this).siblings().find('.overtime_regular_overtime_day_16').val());
        } else {overtime_regular_overtime_day_16_data.push(0);}
        
        
        overtime_regular_rest_day_overtime_day_1_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_1').val());
        overtime_regular_rest_day_overtime_day_2_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_2').val());
        overtime_regular_rest_day_overtime_day_3_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_3').val());
        overtime_regular_rest_day_overtime_day_4_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_4').val());
        overtime_regular_rest_day_overtime_day_5_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_5').val());
        overtime_regular_rest_day_overtime_day_6_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_6').val());
        overtime_regular_rest_day_overtime_day_7_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_7').val());
        overtime_regular_rest_day_overtime_day_8_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_8').val());
        overtime_regular_rest_day_overtime_day_9_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_9').val());
        overtime_regular_rest_day_overtime_day_10_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_10').val());
        overtime_regular_rest_day_overtime_day_11_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_11').val());
        overtime_regular_rest_day_overtime_day_12_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_12').val());
        overtime_regular_rest_day_overtime_day_13_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_13').val());
        overtime_regular_rest_day_overtime_day_14_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_14').val());
        overtime_regular_rest_day_overtime_day_15_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_15').val());
        if($(this).siblings().find('.overtime_regular_rest_day_overtime_day_16').length){
          overtime_regular_rest_day_overtime_day_16_data.push($(this).siblings().find('.overtime_regular_rest_day_overtime_day_16').val());
        } else {overtime_regular_rest_day_overtime_day_16_data.push(0);}
        
        
        overtime_holiday_overtime_day_1_data.push($(this).siblings().find('.overtime_holiday_overtime_day_1').val());
        overtime_holiday_overtime_day_2_data.push($(this).siblings().find('.overtime_holiday_overtime_day_2').val());
        overtime_holiday_overtime_day_3_data.push($(this).siblings().find('.overtime_holiday_overtime_day_3').val());
        overtime_holiday_overtime_day_4_data.push($(this).siblings().find('.overtime_holiday_overtime_day_4').val());
        overtime_holiday_overtime_day_5_data.push($(this).siblings().find('.overtime_holiday_overtime_day_5').val());
        overtime_holiday_overtime_day_6_data.push($(this).siblings().find('.overtime_holiday_overtime_day_6').val());
        overtime_holiday_overtime_day_7_data.push($(this).siblings().find('.overtime_holiday_overtime_day_7').val());
        overtime_holiday_overtime_day_8_data.push($(this).siblings().find('.overtime_holiday_overtime_day_8').val());
        overtime_holiday_overtime_day_9_data.push($(this).siblings().find('.overtime_holiday_overtime_day_9').val());
        overtime_holiday_overtime_day_10_data.push($(this).siblings().find('.overtime_holiday_overtime_day_10').val());
        overtime_holiday_overtime_day_11_data.push($(this).siblings().find('.overtime_holiday_overtime_day_11').val());
        overtime_holiday_overtime_day_12_data.push($(this).siblings().find('.overtime_holiday_overtime_day_12').val());
        overtime_holiday_overtime_day_13_data.push($(this).siblings().find('.overtime_holiday_overtime_day_13').val());
        overtime_holiday_overtime_day_14_data.push($(this).siblings().find('.overtime_holiday_overtime_day_14').val());
        overtime_holiday_overtime_day_15_data.push($(this).siblings().find('.overtime_holiday_overtime_day_15').val());
        if($(this).siblings().find('.overtime_holiday_overtime_day_16').length){
          overtime_holiday_overtime_day_16_data.push($(this).siblings().find('.overtime_holiday_overtime_day_16').val());
        } else {overtime_holiday_overtime_day_16_data.push(0);}
        
        
        overtime_special_holiday_overtime_day_1_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_1').val());
        overtime_special_holiday_overtime_day_2_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_2').val());
        overtime_special_holiday_overtime_day_3_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_3').val());
        overtime_special_holiday_overtime_day_4_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_4').val());
        overtime_special_holiday_overtime_day_5_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_5').val());
        overtime_special_holiday_overtime_day_6_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_6').val());
        overtime_special_holiday_overtime_day_7_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_7').val());
        overtime_special_holiday_overtime_day_8_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_8').val());
        overtime_special_holiday_overtime_day_9_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_9').val());
        overtime_special_holiday_overtime_day_10_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_10').val());
        overtime_special_holiday_overtime_day_11_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_11').val());
        overtime_special_holiday_overtime_day_12_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_12').val());
        overtime_special_holiday_overtime_day_13_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_13').val());
        overtime_special_holiday_overtime_day_14_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_14').val());
        overtime_special_holiday_overtime_day_15_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_15').val());
        if($(this).siblings().find('.overtime_special_holiday_overtime_day_16').length){
          overtime_special_holiday_overtime_day_16_data.push($(this).siblings().find('.overtime_special_holiday_overtime_day_16').val());
        } else {overtime_special_holiday_overtime_day_16_data.push(0);}
        
        
        overtime_holiday_rest_day_overtime_day_1_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_1').val());
        overtime_holiday_rest_day_overtime_day_2_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_2').val());
        overtime_holiday_rest_day_overtime_day_3_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_3').val());
        overtime_holiday_rest_day_overtime_day_4_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_4').val());
        overtime_holiday_rest_day_overtime_day_5_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_5').val());
        overtime_holiday_rest_day_overtime_day_6_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_6').val());
        overtime_holiday_rest_day_overtime_day_7_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_7').val());
        overtime_holiday_rest_day_overtime_day_8_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_8').val());
        overtime_holiday_rest_day_overtime_day_9_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_9').val());
        overtime_holiday_rest_day_overtime_day_10_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_10').val());
        overtime_holiday_rest_day_overtime_day_11_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_11').val());
        overtime_holiday_rest_day_overtime_day_12_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_12').val());
        overtime_holiday_rest_day_overtime_day_13_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_13').val());
        overtime_holiday_rest_day_overtime_day_14_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_14').val());
        overtime_holiday_rest_day_overtime_day_15_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_15').val());
        if($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_16').length){
          overtime_holiday_rest_day_overtime_day_16_data.push($(this).siblings().find('.overtime_holiday_rest_day_overtime_day_16').val());
        } else {overtime_holiday_rest_day_overtime_day_16_data.push(0);}
        
        
        overtime_special_rest_day_holiday_overtime_day_1_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_1').val());
        overtime_special_rest_day_holiday_overtime_day_2_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_2').val());
        overtime_special_rest_day_holiday_overtime_day_3_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_3').val());
        overtime_special_rest_day_holiday_overtime_day_4_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_4').val());
        overtime_special_rest_day_holiday_overtime_day_5_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_5').val());
        overtime_special_rest_day_holiday_overtime_day_6_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_6').val());
        overtime_special_rest_day_holiday_overtime_day_7_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_7').val());
        overtime_special_rest_day_holiday_overtime_day_8_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_8').val());
        overtime_special_rest_day_holiday_overtime_day_9_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_9').val());
        overtime_special_rest_day_holiday_overtime_day_10_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_10').val());
        overtime_special_rest_day_holiday_overtime_day_11_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_11').val());
        overtime_special_rest_day_holiday_overtime_day_12_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_12').val());
        overtime_special_rest_day_holiday_overtime_day_13_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_13').val());
        overtime_special_rest_day_holiday_overtime_day_14_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_14').val());
        overtime_special_rest_day_holiday_overtime_day_15_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_15').val());
        if($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_16').length){
          overtime_special_rest_day_holiday_overtime_day_16_data.push($(this).siblings().find('.overtime_special_rest_day_holiday_overtime_day_16').val());
        } else {overtime_special_rest_day_holiday_overtime_day_16_data.push(0);}

      });

      $.ajax({
    
        type: "POST",
				url: site_url + function_data[1],
				data: {
          user:user,
          pay_period:pay_period,
          days_worked:days_worked,
          working_days:working_days,
          attendance_day_1_data:attendance_day_1_data,
          attendance_day_2_data:attendance_day_2_data,
          attendance_day_3_data:attendance_day_3_data,
          attendance_day_4_data:attendance_day_4_data,
          attendance_day_5_data:attendance_day_5_data,
          attendance_day_6_data:attendance_day_6_data,
          attendance_day_7_data:attendance_day_7_data,
          attendance_day_8_data:attendance_day_8_data,
          attendance_day_9_data:attendance_day_9_data,
          attendance_day_10_data:attendance_day_10_data,
          attendance_day_11_data:attendance_day_11_data,
          attendance_day_12_data:attendance_day_12_data,
          attendance_day_13_data:attendance_day_13_data,
          attendance_day_14_data:attendance_day_14_data,
          attendance_day_15_data:attendance_day_15_data,
          attendance_day_16_data:attendance_day_16_data,
          late_day_1_data:late_day_1_data,
          late_day_2_data:late_day_2_data,
          late_day_3_data:late_day_3_data,
          late_day_4_data:late_day_4_data,
          late_day_5_data:late_day_5_data,
          late_day_6_data:late_day_6_data,
          late_day_7_data:late_day_7_data,
          late_day_8_data:late_day_8_data,
          late_day_9_data:late_day_9_data,
          late_day_10_data:late_day_10_data,
          late_day_11_data:late_day_11_data,
          late_day_12_data:late_day_12_data,
          late_day_13_data:late_day_13_data,
          late_day_14_data:late_day_14_data,
          late_day_15_data:late_day_15_data,
          late_day_16_data:late_day_16_data,
          undertime_day_1_data:undertime_day_1_data,
          undertime_day_2_data:undertime_day_2_data,
          undertime_day_3_data:undertime_day_3_data,
          undertime_day_4_data:undertime_day_4_data,
          undertime_day_5_data:undertime_day_5_data,
          undertime_day_6_data:undertime_day_6_data,
          undertime_day_7_data:undertime_day_7_data,
          undertime_day_8_data:undertime_day_8_data,
          undertime_day_9_data:undertime_day_9_data,
          undertime_day_10_data:undertime_day_10_data,
          undertime_day_11_data:undertime_day_11_data,
          undertime_day_12_data:undertime_day_12_data,
          undertime_day_13_data:undertime_day_13_data,
          undertime_day_14_data:undertime_day_14_data,
          undertime_day_15_data:undertime_day_15_data,
          undertime_day_16_data:undertime_day_16_data,
          overtime_night_differential_day_1_data:overtime_night_differential_day_1_data,
          overtime_night_differential_day_2_data:overtime_night_differential_day_2_data,
          overtime_night_differential_day_3_data:overtime_night_differential_day_3_data,
          overtime_night_differential_day_4_data:overtime_night_differential_day_4_data,
          overtime_night_differential_day_5_data:overtime_night_differential_day_5_data,
          overtime_night_differential_day_6_data:overtime_night_differential_day_6_data,
          overtime_night_differential_day_7_data:overtime_night_differential_day_7_data,
          overtime_night_differential_day_8_data:overtime_night_differential_day_8_data,
          overtime_night_differential_day_9_data:overtime_night_differential_day_9_data,
          overtime_night_differential_day_10_data:overtime_night_differential_day_10_data,
          overtime_night_differential_day_11_data:overtime_night_differential_day_11_data,
          overtime_night_differential_day_12_data:overtime_night_differential_day_12_data,
          overtime_night_differential_day_13_data:overtime_night_differential_day_13_data,
          overtime_night_differential_day_14_data:overtime_night_differential_day_14_data,
          overtime_night_differential_day_15_data:overtime_night_differential_day_15_data,
          overtime_night_differential_day_16_data:overtime_night_differential_day_16_data,
          overtime_regular_holiday_day_1_data:overtime_regular_holiday_day_1_data,
          overtime_regular_holiday_day_2_data:overtime_regular_holiday_day_2_data,
          overtime_regular_holiday_day_3_data:overtime_regular_holiday_day_3_data,
          overtime_regular_holiday_day_4_data:overtime_regular_holiday_day_4_data,
          overtime_regular_holiday_day_5_data:overtime_regular_holiday_day_5_data,
          overtime_regular_holiday_day_6_data:overtime_regular_holiday_day_6_data,
          overtime_regular_holiday_day_7_data:overtime_regular_holiday_day_7_data,
          overtime_regular_holiday_day_8_data:overtime_regular_holiday_day_8_data,
          overtime_regular_holiday_day_9_data:overtime_regular_holiday_day_9_data,
          overtime_regular_holiday_day_10_data:overtime_regular_holiday_day_10_data,
          overtime_regular_holiday_day_11_data:overtime_regular_holiday_day_11_data,
          overtime_regular_holiday_day_12_data:overtime_regular_holiday_day_12_data,
          overtime_regular_holiday_day_13_data:overtime_regular_holiday_day_13_data,
          overtime_regular_holiday_day_14_data:overtime_regular_holiday_day_14_data,
          overtime_regular_holiday_day_15_data:overtime_regular_holiday_day_15_data,
          overtime_regular_holiday_day_16_data:overtime_regular_holiday_day_16_data,
          overtime_special_holiday_day_1_data:overtime_special_holiday_day_1_data,
          overtime_special_holiday_day_2_data:overtime_special_holiday_day_2_data,
          overtime_special_holiday_day_3_data:overtime_special_holiday_day_3_data,
          overtime_special_holiday_day_4_data:overtime_special_holiday_day_4_data,
          overtime_special_holiday_day_5_data:overtime_special_holiday_day_5_data,
          overtime_special_holiday_day_6_data:overtime_special_holiday_day_6_data,
          overtime_special_holiday_day_7_data:overtime_special_holiday_day_7_data,
          overtime_special_holiday_day_8_data:overtime_special_holiday_day_8_data,
          overtime_special_holiday_day_9_data:overtime_special_holiday_day_9_data,
          overtime_special_holiday_day_10_data:overtime_special_holiday_day_10_data,
          overtime_special_holiday_day_11_data:overtime_special_holiday_day_11_data,
          overtime_special_holiday_day_12_data:overtime_special_holiday_day_12_data,
          overtime_special_holiday_day_13_data:overtime_special_holiday_day_13_data,
          overtime_special_holiday_day_14_data:overtime_special_holiday_day_14_data,
          overtime_special_holiday_day_15_data:overtime_special_holiday_day_15_data,
          overtime_special_holiday_day_16_data:overtime_special_holiday_day_16_data,
          overtime_regular_overtime_day_1_data:overtime_regular_overtime_day_1_data,
          overtime_regular_overtime_day_2_data:overtime_regular_overtime_day_2_data,
          overtime_regular_overtime_day_3_data:overtime_regular_overtime_day_3_data,
          overtime_regular_overtime_day_4_data:overtime_regular_overtime_day_4_data,
          overtime_regular_overtime_day_5_data:overtime_regular_overtime_day_5_data,
          overtime_regular_overtime_day_6_data:overtime_regular_overtime_day_6_data,
          overtime_regular_overtime_day_7_data:overtime_regular_overtime_day_7_data,
          overtime_regular_overtime_day_8_data:overtime_regular_overtime_day_8_data,
          overtime_regular_overtime_day_9_data:overtime_regular_overtime_day_9_data,
          overtime_regular_overtime_day_10_data:overtime_regular_overtime_day_10_data,
          overtime_regular_overtime_day_11_data:overtime_regular_overtime_day_11_data,
          overtime_regular_overtime_day_12_data:overtime_regular_overtime_day_12_data,
          overtime_regular_overtime_day_13_data:overtime_regular_overtime_day_13_data,
          overtime_regular_overtime_day_14_data:overtime_regular_overtime_day_14_data,
          overtime_regular_overtime_day_15_data:overtime_regular_overtime_day_15_data,
          overtime_regular_overtime_day_16_data:overtime_regular_overtime_day_16_data,
          overtime_regular_rest_day_overtime_day_1_data:overtime_regular_rest_day_overtime_day_1_data,
          overtime_regular_rest_day_overtime_day_2_data:overtime_regular_rest_day_overtime_day_2_data,
          overtime_regular_rest_day_overtime_day_3_data:overtime_regular_rest_day_overtime_day_3_data,
          overtime_regular_rest_day_overtime_day_4_data:overtime_regular_rest_day_overtime_day_4_data,
          overtime_regular_rest_day_overtime_day_5_data:overtime_regular_rest_day_overtime_day_5_data,
          overtime_regular_rest_day_overtime_day_6_data:overtime_regular_rest_day_overtime_day_6_data,
          overtime_regular_rest_day_overtime_day_7_data:overtime_regular_rest_day_overtime_day_7_data,
          overtime_regular_rest_day_overtime_day_8_data:overtime_regular_rest_day_overtime_day_8_data,
          overtime_regular_rest_day_overtime_day_9_data:overtime_regular_rest_day_overtime_day_9_data,
          overtime_regular_rest_day_overtime_day_10_data:overtime_regular_rest_day_overtime_day_10_data,
          overtime_regular_rest_day_overtime_day_11_data:overtime_regular_rest_day_overtime_day_11_data,
          overtime_regular_rest_day_overtime_day_12_data:overtime_regular_rest_day_overtime_day_12_data,
          overtime_regular_rest_day_overtime_day_13_data:overtime_regular_rest_day_overtime_day_13_data,
          overtime_regular_rest_day_overtime_day_14_data:overtime_regular_rest_day_overtime_day_14_data,
          overtime_regular_rest_day_overtime_day_15_data:overtime_regular_rest_day_overtime_day_15_data,
          overtime_regular_rest_day_overtime_day_16_data:overtime_regular_rest_day_overtime_day_16_data,
          overtime_holiday_overtime_day_1_data:overtime_holiday_overtime_day_1_data,
          overtime_holiday_overtime_day_2_data:overtime_holiday_overtime_day_2_data,
          overtime_holiday_overtime_day_3_data:overtime_holiday_overtime_day_3_data,
          overtime_holiday_overtime_day_4_data:overtime_holiday_overtime_day_4_data,
          overtime_holiday_overtime_day_5_data:overtime_holiday_overtime_day_5_data,
          overtime_holiday_overtime_day_6_data:overtime_holiday_overtime_day_6_data,
          overtime_holiday_overtime_day_7_data:overtime_holiday_overtime_day_7_data,
          overtime_holiday_overtime_day_8_data:overtime_holiday_overtime_day_8_data,
          overtime_holiday_overtime_day_9_data:overtime_holiday_overtime_day_9_data,
          overtime_holiday_overtime_day_10_data:overtime_holiday_overtime_day_10_data,
          overtime_holiday_overtime_day_11_data:overtime_holiday_overtime_day_11_data,
          overtime_holiday_overtime_day_12_data:overtime_holiday_overtime_day_12_data,
          overtime_holiday_overtime_day_13_data:overtime_holiday_overtime_day_13_data,
          overtime_holiday_overtime_day_14_data:overtime_holiday_overtime_day_14_data,
          overtime_holiday_overtime_day_15_data:overtime_holiday_overtime_day_15_data,
          overtime_holiday_overtime_day_16_data:overtime_holiday_overtime_day_16_data,
          overtime_special_holiday_overtime_day_1_data:overtime_special_holiday_overtime_day_1_data,
          overtime_special_holiday_overtime_day_2_data:overtime_special_holiday_overtime_day_2_data,
          overtime_special_holiday_overtime_day_3_data:overtime_special_holiday_overtime_day_3_data,
          overtime_special_holiday_overtime_day_4_data:overtime_special_holiday_overtime_day_4_data,
          overtime_special_holiday_overtime_day_5_data:overtime_special_holiday_overtime_day_5_data,
          overtime_special_holiday_overtime_day_6_data:overtime_special_holiday_overtime_day_6_data,
          overtime_special_holiday_overtime_day_7_data:overtime_special_holiday_overtime_day_7_data,
          overtime_special_holiday_overtime_day_8_data:overtime_special_holiday_overtime_day_8_data,
          overtime_special_holiday_overtime_day_9_data:overtime_special_holiday_overtime_day_9_data,
          overtime_special_holiday_overtime_day_10_data:overtime_special_holiday_overtime_day_10_data,
          overtime_special_holiday_overtime_day_11_data:overtime_special_holiday_overtime_day_11_data,
          overtime_special_holiday_overtime_day_12_data:overtime_special_holiday_overtime_day_12_data,
          overtime_special_holiday_overtime_day_13_data:overtime_special_holiday_overtime_day_13_data,
          overtime_special_holiday_overtime_day_14_data:overtime_special_holiday_overtime_day_14_data,
          overtime_special_holiday_overtime_day_15_data:overtime_special_holiday_overtime_day_15_data,
          overtime_special_holiday_overtime_day_16_data:overtime_special_holiday_overtime_day_16_data,
          overtime_holiday_rest_day_overtime_day_1_data:overtime_holiday_rest_day_overtime_day_1_data,
          overtime_holiday_rest_day_overtime_day_2_data:overtime_holiday_rest_day_overtime_day_2_data,
          overtime_holiday_rest_day_overtime_day_3_data:overtime_holiday_rest_day_overtime_day_3_data,
          overtime_holiday_rest_day_overtime_day_4_data:overtime_holiday_rest_day_overtime_day_4_data,
          overtime_holiday_rest_day_overtime_day_5_data:overtime_holiday_rest_day_overtime_day_5_data,
          overtime_holiday_rest_day_overtime_day_6_data:overtime_holiday_rest_day_overtime_day_6_data,
          overtime_holiday_rest_day_overtime_day_7_data:overtime_holiday_rest_day_overtime_day_7_data,
          overtime_holiday_rest_day_overtime_day_8_data:overtime_holiday_rest_day_overtime_day_8_data,
          overtime_holiday_rest_day_overtime_day_9_data:overtime_holiday_rest_day_overtime_day_9_data,
          overtime_holiday_rest_day_overtime_day_10_data:overtime_holiday_rest_day_overtime_day_10_data,
          overtime_holiday_rest_day_overtime_day_11_data:overtime_holiday_rest_day_overtime_day_11_data,
          overtime_holiday_rest_day_overtime_day_12_data:overtime_holiday_rest_day_overtime_day_12_data,
          overtime_holiday_rest_day_overtime_day_13_data:overtime_holiday_rest_day_overtime_day_13_data,
          overtime_holiday_rest_day_overtime_day_14_data:overtime_holiday_rest_day_overtime_day_14_data,
          overtime_holiday_rest_day_overtime_day_15_data:overtime_holiday_rest_day_overtime_day_15_data,
          overtime_holiday_rest_day_overtime_day_16_data:overtime_holiday_rest_day_overtime_day_16_data,
          overtime_special_rest_day_holiday_overtime_day_1_data:overtime_special_rest_day_holiday_overtime_day_1_data,
          overtime_special_rest_day_holiday_overtime_day_2_data:overtime_special_rest_day_holiday_overtime_day_2_data,
          overtime_special_rest_day_holiday_overtime_day_3_data:overtime_special_rest_day_holiday_overtime_day_3_data,
          overtime_special_rest_day_holiday_overtime_day_4_data:overtime_special_rest_day_holiday_overtime_day_4_data,
          overtime_special_rest_day_holiday_overtime_day_5_data:overtime_special_rest_day_holiday_overtime_day_5_data,
          overtime_special_rest_day_holiday_overtime_day_6_data:overtime_special_rest_day_holiday_overtime_day_6_data,
          overtime_special_rest_day_holiday_overtime_day_7_data:overtime_special_rest_day_holiday_overtime_day_7_data,
          overtime_special_rest_day_holiday_overtime_day_8_data:overtime_special_rest_day_holiday_overtime_day_8_data,
          overtime_special_rest_day_holiday_overtime_day_9_data:overtime_special_rest_day_holiday_overtime_day_9_data,
          overtime_special_rest_day_holiday_overtime_day_10_data:overtime_special_rest_day_holiday_overtime_day_10_data,
          overtime_special_rest_day_holiday_overtime_day_10_data:overtime_special_rest_day_holiday_overtime_day_10_data,
          overtime_special_rest_day_holiday_overtime_day_11_data:overtime_special_rest_day_holiday_overtime_day_11_data,
          overtime_special_rest_day_holiday_overtime_day_12_data:overtime_special_rest_day_holiday_overtime_day_12_data,
          overtime_special_rest_day_holiday_overtime_day_13_data:overtime_special_rest_day_holiday_overtime_day_13_data,
          overtime_special_rest_day_holiday_overtime_day_14_data:overtime_special_rest_day_holiday_overtime_day_14_data,
          overtime_special_rest_day_holiday_overtime_day_15_data:overtime_special_rest_day_holiday_overtime_day_15_data,
          overtime_special_rest_day_holiday_overtime_day_16_data:overtime_special_rest_day_holiday_overtime_day_16_data
        }, 
				success:function(data) {

          window.location.href= site_url + function_data[0];
          
				
        }
      });
  
  }

  
  
  $('button.set_schedule').click(function(e){
      var team_id = $('input.team_id').val();
      var start = $('input.team_schedule_start').val();
      var end = $('input.team_schedule_end').val();
      
      
      $.ajax({
        type: "POST",
        url: site_url + 'index.php/ajax/attendance_ajax/save_team_schedule',
        data: {start:start, end:end, team_id:team_id}, 
        success:function(data) {
          
          window.location.href= site_url + 'attendance/tracker';
        }
      });
  });
  
});