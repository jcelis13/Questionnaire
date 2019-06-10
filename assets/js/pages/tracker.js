$(function() {
  // Handler for .ready() called.
  var select_default = '<option value="0">Please select</option>';
  var user_role_type = $('.user_role_type').val();
  var department_id = $('.user_department_id').val();
  var team_id = $('.user_team_id').val();
  var load_team_url  = '';
  var load_team_data  = '';
  //$('.team_schedule_start').timepicker({minuteStep: 1}); 
  //$('.team_schedule_end').timepicker({minuteStep: 1});
  //$('.time_in').timepicker({minuteStep: 1}); 
  //$('.time_out').timepicker({minuteStep: 1});
  $('#schedule_time_in_time_out').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD h:mm A', singleDatePicker: true});
  $('#time_in_time_out').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD h:mm A'});
  

  $.ajax({
    
    type: "POST",
    url: site_url + 'index.php/ajax/tracker_ajax/load_pay_period',
    success:function(data) {
      var pay_period = $.parseJSON(data);
      var pay_period_default = "<option value='0'>Select pay period</option>";
      var pay_period_result = "";
      var pay_period_history_result = "";
      for(var i = 0; i<pay_period.length; i++){
        pay_period_result = pay_period_result + '<option value="'+pay_period[i].p_pay_period+'">' +
        pay_period[i].pay_period + '</option>';
        
        pay_period_history_result = pay_period_history_result + '<div class="history-item">' +
          '<a class="btn btn-primary col-md-12" href="#' + pay_period[i].p_pay_period +'" data-toggle="collapse" aria-expanded="false" aria-controls="' + pay_period[i].p_pay_period + '" data-payperiod-id="' + pay_period[i].p_pay_period + '">'+pay_period[i].pay_period+'</a>' +
          '<div class="collapse days" id="' + pay_period[i].p_pay_period + '">' +
          '<div class="payperiod-item">' +
          /*  '<a href="#" >Test '+pay_period[i].pay_period.replace(/ /g,'')+'</a>'+*/
          '</div>' +
          '</div><!-- collapse -->' +
        '</div>';
      }
      //console.log(pay_period_result);
      $('#add_day select.payperiod').html(pay_period_default +pay_period_result);
      $('select.payperiod_filter').html(pay_period_default +pay_period_result);
      $('.tracker-history').html(pay_period_history_result);
   
    }
   
  });
  
  switch(user_role_type){
    case 'superadmin':
      load_team_url = site_url + 'index.php/ajax/tracker_ajax/load_teams';
     
      break;
    case 'floor manager':
    case 'manager':
      load_team_url = site_url + 'index.php/ajax/tracker_ajax/load_teams_by_department';

      break;
    case 'team leader':
      load_team_url = site_url + 'index.php/ajax/tracker_ajax/load_teams_by_team';

      break;
    
  
  }
  
  $.ajax({
      
      type: "POST",
      url: load_team_url,
      data: {department_id:department_id, team_id:team_id},
      success:function(data) {
        var teams = $.parseJSON(data);
        var teams_result = '';
        for(var i = 0; i<teams.length; i++){
          teams_result = teams_result + 
          '<option value="' + teams[i].team_id + '">' + teams[i].team_name + '</option>';
        }
        $('.team-list').html(select_default + teams_result);
      }
      
    });
  
  $.ajax({
    
    type: "POST",
    url: site_url + 'index.php/ajax/tracker_ajax/load_attendance_types',
    success:function(data) {
      var attendance_types = $.parseJSON(data);
      var attendance_types_result = '';
      for(var i = 0; i<attendance_types.length; i++){
        attendance_types_result = attendance_types_result + 
        '<option value="' + attendance_types[i].attendance_type_id + '">' + attendance_types[i].attendance_type_name + '</option>';
      }
      $('.attendance-type-add-modal').html(select_default + attendance_types_result);
    }
    
  });
  /* action when department list option is changed */
  $('.department-list').change(function(){
  
    var department_id = $('.department-list').val();
    var team_id;
    if(department_id != 0){
      $.ajax({
    
        type: "POST",
        url: site_url + 'index.php/ajax/tracker_ajax/load_teams_by_department',
        data: {department_id:department_id},
        beforeSend:function(){$('.fa-spinner').fadeIn(1000);},
        
        success:function(data) {
          var teams = $.parseJSON(data);
          var teams_result = '';
          for(var i = 0; i<teams.length; i++){
            teams_result = teams_result + 
            '<option value="' + teams[i].team_id + '">' + teams[i].team_name + '</option>';
          }
          $('.team-list').html(select_default + teams_result);
          $('.fa-spinner').fadeOut(1000);
        }
        
      });
    }
  
  });
  /* when View day button is clicked */
  $('.btn-view-day').click(function(){
    console.log('value of select: ' + $('.payperiod_filter').val());
    var payperiod_id = $('.payperiod_filter').val();
    var team_id = $('.team-list').val();
    console.log(team_id);
    var payperiod_name = $('.payperiod_filter option:selected').text();
    if(payperiod_id != 0 && team_id != 0 && team_id != null){
      $('.payperiod_filter').removeClass('warning');
      $('.team-list').removeClass('warning');
      $.ajax({
        type: "POST",
        url: site_url + 'index.php/ajax/tracker_ajax/load_days_under_pay_period',
        data:{payperiod_id:payperiod_id, team_id:team_id},
        beforeSend:function(){$('.fa-spinner').fadeIn(1000);},
        success:function(data) {
          var payperiod_days = $.parseJSON(data);
          var days_result = '';
          var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
          for(var i = 0; i<payperiod_days.length; i++){
            var d = new Date(payperiod_days[i].date);
            days_result = days_result +
              '<div class="row">' +
                '<div class="col-md-12">' +
                  '<button class="btn btn-default col-md-12 " data-date="'+payperiod_days[i].date + '"  data-team-id="'+payperiod_days[i].real_team_id + '">' + monthNames[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + '</button>' +
                '</div>' +
              '</div>';
          }
          if(payperiod_days.length != 0){
            $('.payperiod-days').html(days_result);
          } else {
            $('.payperiod-days').html('<div class="row"><div class="col-md-12">No Records to show</div></div>');
          }
          $('span.payperiod_name').html(payperiod_name);
          $('.fa-spinner').fadeOut(1000);
        }
      });
    } else {
      $('.payperiod_filter').addClass('warning');
      $('.department-list').addClass('warning');
      $('.team-list').addClass('warning');
    }
  });
  
  $(document).on('click', '.applyBtn', function(){
    
    var schedule_time_in_time_out_value = $('#add_day .schedule_time_in_time_out').val();
    var time_in_time_out_value = $('#add_day .time_in_time_out').val();
    var schedule_arr = schedule_time_in_time_out_value.split(" ");
    var time_arr = time_in_time_out_value.split(" ");
    var late_mins;
    var undertime_mins;
    var nightdiff_mins;
    var start;
    var end;
    
    
    console.log("initial: " + schedule_time_in_time_out_value + " " + time_in_time_out_value);
    console.log("initial arr: " + schedule_arr + " - " + time_arr);
    
    if(schedule_time_in_time_out_value && time_in_time_out_value){
      console.log(schedule_time_in_time_out_value + " " + time_in_time_out_value); 
      console.log('ok');
      start = (time_arr[0] + " " + twelveToTwentyfour(time_arr[1] + " " + time_arr[2]));
      end = (time_arr[4] + " " + twelveToTwentyfour(time_arr[5] + " " + time_arr[6]));
      late_mins = (new Date(time_arr[0] + " " + twelveToTwentyfour(time_arr[1] + " " + time_arr[2])) - new Date(schedule_arr[0] + " " + twelveToTwentyfour(schedule_arr[1] + " "+ schedule_arr[2])))  / 1000 / 60; 
      undertime_mins = (new Date(schedule_arr[4] + " " + twelveToTwentyfour(schedule_arr[5] + " " + schedule_arr[6])) - new Date(time_arr[4] + " " + twelveToTwentyfour(time_arr[5] + " "+ time_arr[6])))  / 1000 / 60;
      console.log("start: " + start);
      console.log('end: ' + end);
      if(late_mins < 0){late_mins = 0;}
      if(undertime_mins < 0){undertime_mins = 0;}
      if( parseInt(twelveToTwentyfour(time_arr[1] + " " + time_arr[2])) < 22 ){
        start = time_arr[0] + " 22:" + time_arr[1].slice(-2);
      }
      if(parseInt(twelveToTwentyfour(time_arr[5] + " " + time_arr[6]))  > 6){
        end = time_arr[4] + " 06:" + time_arr[5].slice(-2);
      }
      if(parseInt(twelveToTwentyfour(time_arr[1] + " " + time_arr[2])) < 22 && parseInt(twelveToTwentyfour(time_arr[5] + " " + time_arr[6])) < 6){
      console.log('nisulod');
      end = 0;
      start = 0; 
      }
      
      console.log('night diff start: ' + start);
      console.log('night diff end: ' + end);

      nightdiff_mins = (new Date(end) - new Date(start))/1000/60/60;
      nightdiff_mins = nightdiff_mins - 1;
      nightdiff_mins = nightdiff_mins * 60;
      console.log("orig night diff: " + nightdiff_mins);
      if(nightdiff_mins < 0){nightdiff_mins = 0;}
      console.log("new night diff: " + nightdiff_mins);
      $('#add_day .late_total').val(late_mins);
      $('#add_day .late_undertime_total').val(undertime_mins);
      $('#add_day .overtime_night_differential').val(nightdiff_mins);
    }else{
      console.log('zzz'); 
    }
  
  });
  
  function twelveToTwentyfour(time){

    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return sHours + ":" + sMinutes;
  
  }
  
  $('.btn-add-day').click(function(){
    $.ajax({
      type: "POST",
      url: load_team_url,
	  data: {department_id:department_id, team_id:team_id},
      success:function(data) {
        var teams = $.parseJSON(data);
        var teams_result = '';
        for(var i = 0; i<teams.length; i++){
          teams_result = teams_result + 
          '<option value="' + teams[i].team_id + '">' + teams[i].team_name + '</option>';
        }
        $('.team-list-add-modal').html(select_default + teams_result);
      }
    });
  });
  
  $('.team-list-add-modal').change(function(){
    
    var team_id = $('.team-list-add-modal').val();
    
    
    $.ajax({
      type: "POST",
      url: site_url + 'index.php/ajax/tracker_ajax/load_employees_by_team',
      data: {team_id:team_id},
      beforeSend:function(){$('.fa-spinner').fadeIn(1000);},
        
      success:function(data) {
        var employee = $.parseJSON(data);
        var employee_result = '';
        for(var i = 0; i<employee.length; i++){
          employee_result = employee_result + 
          '<option value="' + employee[i].user_id + '">' + employee[i].full_name + '</option>';
        }
        $('.employee-list-add-modal').html(select_default + employee_result);
        $('.fa-spinner').fadeOut(1000);
      }
        
    });
    
    
  });
  
  /* Click action for Days Box */
  $('.payperiod-days').on('click', 'button', function(){
    var date = $(this).attr('data-date');
	var team_id = $(this).attr('data-team-id');
    //console.log('selected date: ' +date);
    $.ajax({
    
      type: "POST",
      url: site_url + 'index.php/ajax/tracker_ajax/load_tracker_by_date',
      data:{date:date, team_id:team_id},
      beforeSend:function(){$('#view_day').modal('toggle');$('.fa-spinner').fadeIn(1000);},
      success:function(data) {
        var tracker_data = $.parseJSON(data);
        console.log(tracker_data);
        var tracker_data_result = '';
        for(var i = 0; i<tracker_data.length; i++){
          tracker_data_result = tracker_data_result + 
          '<tr>' +
          '<td class="name">'+tracker_data[i].full_name+'</td>' +
          '<td class="schedule"><input  type="text" class="schedule col-md-10" data-tracker-id="' +
          tracker_data[i].attendance_id +
          '" value="'+ tracker_data[i].schedule_time_in.substr(0, 10) +' ' + tConvert(tracker_data[i].schedule_time_in.substr(11, 17)) + ' - ' + tracker_data[i].schedule_time_out.substr(0, 10) +' ' + tConvert(tracker_data[i].schedule_time_out.substr(11, 17)) +'"/></td>' +
          '<td class="time-in-time-out"><input  type="text" class="time-in-time-out col-md-10"  data-tracker-id="' +
          tracker_data[i].attendance_id +
          '" value="'+ tracker_data[i].time_in.substr(0, 10) +' ' + tConvert(tracker_data[i].time_in.substr(11, 17)) + ' - ' + tracker_data[i].time_out.substr(0, 10) +' ' + tConvert(tracker_data[i].time_out.substr(11, 17)) +'"/></td>' +
          '<td class="actions">' +
          ' <button class="btn btn-default edit fa fa-edit" data-tracker-id="' +
          tracker_data[i].attendance_id +
          '" data-date="' +
				  tracker_data[i].date +
				  '" data-team-id="' +
            tracker_data[i].real_team_id +
            '"></button>'+
          ' <button class="btn btn-default delete fa fa-trash-o" data-tracker-id="' +
          tracker_data[i].attendance_id +
          '" data-date="' +
				  tracker_data[i].date +
				  '" data-team-id="' +
            tracker_data[i].real_team_id +
            '"></button>'+
          '</td>';
          '</tr>';
        }
        $('.tracker-table tbody').html(tracker_data_result);
        $('#view_day .schedule').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD h:mm A'});
        $('#view_day .time-in-time-out').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD h:mm A'});
		
        $('.fa-spinner').fadeOut(1000);
      }
      
    });
  });

  /* when history item is clicked */
  $('.tracker-history').on('click', '.history-item a', function(){
    var payperiod_id = $(this).attr('data-payperiod-id');
	var t = $(this);
	console.log('payperiod is: ' + payperiod_id);
    $.ajax({
        type: "POST",
        url: site_url + 'index.php/ajax/tracker_ajax/load_days_under_pay_period_admin',
        data:{payperiod_id:payperiod_id},
        beforeSend:function(){$('.fa-spinner').fadeIn(1000);},
        success:function(data) {
          var payperiod_days = $.parseJSON(data);
		  console.log();
          var days_result = '';
          var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
          for(var i = 0; i<payperiod_days.length; i++){
            var d = new Date(payperiod_days[i].date);
            days_result = days_result +
              '<div class="row">' +
                '<div class="col-md-12">' +
                  '<button class="btn btn-default col-md-12 " data-date="'+payperiod_days[i].date + '">' + monthNames[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + '</button>' +
                '</div>' +
              '</div>';
          }
          if(payperiod_days.length != 0){
            t.next('.days').html(days_result);
          } else {
            t.next('.days').html('<div class="row"><div class="col-md-12"><button class="btn btn-danger col-md-12 ">No Records to show</button></div></div>');
          }
          $('.fa-spinner').fadeOut(1000);
        }
      });
  });

  
  $('.btn-save-day').click(function(){
  
    var created_by = $('#add_day .created_by').val();
    var payperiod_id = $('#add_day .payperiod').val();
    var user_id = $('#add_day .employee-list-add-modal').val();
    var team_id = $('#add_day .team-list-add-modal').val();
    var schedule_time_in_time_out = $('#add_day .schedule_time_in_time_out').val();
    var time_in_time_out = $('#add_day .time_in_time_out').val();
    var time_out = $('#add_day .time_out').val();
    var attendance_type = $('#add_day .attendance-type-add-modal').val();
    var late_total = $('#add_day .late_total').val();
    var late_undertime_total = $('#add_day .late_undertime_total').val();
    var overtime_night_differential = $('#add_day .overtime_night_differential').val();
    var overtime_regular_holiday = $('#add_day .overtime_regular_holiday').val();
    var overtime_special_holiday = $('#add_day .overtime_special_holiday').val();
    var overtime_regular_overtime = $('#add_day .overtime_regular_overtime').val();
    var overtime_regular_rest_day_overtime = $('#add_day .overtime_regular_rest_day_overtime').val();
    var overtime_holiday_overtime = $('#add_day .overtime_holiday_overtime').val();
    var overtime_special_holiday_overtime = $('#add_day .overtime_special_holiday_overtime').val();
    var overtime_holiday_rest_day_overtime = $('#add_day .overtime_holiday_rest_day_overtime').val();
    var overtime_special_rest_day_holiday_overtime = $('#add_day .overtime_special_rest_day_holiday_overtime').val();
    var date = $('#add_day .datepicker').val();
    
    console.log('time in & time out: ' + time_in_time_out);
	
    if(attendance_type != 2){
    
      schedule_time_in_time_out = '0000-00-00 00:00:00';
    
    }

    
    
    
    if(team_id != 0 && payperiod_id != 0 && user_id != 'undefined' && time_in_time_out != ''){
      $.ajax({
    
        type: "POST",
        url: site_url + 'index.php/ajax/tracker_ajax/create_day_admin',
        data: {
          created_by:created_by,
          user_id:user_id,
          payperiod_id:payperiod_id,
          schedule_time_in_time_out:schedule_time_in_time_out,
          time_in_time_out:time_in_time_out,
          attendance_type:attendance_type,
          late_total:late_total,
          late_undertime_total:late_undertime_total,
          overtime_night_differential:overtime_night_differential,
          overtime_regular_holiday:overtime_regular_holiday,
          overtime_special_holiday:overtime_special_holiday,
          overtime_regular_overtime:overtime_regular_overtime,
          overtime_regular_rest_day_overtime:overtime_regular_rest_day_overtime,
          overtime_holiday_overtime:overtime_holiday_overtime,
          overtime_special_holiday_overtime:overtime_special_holiday_overtime,
          overtime_holiday_rest_day_overtime:overtime_holiday_rest_day_overtime,
          overtime_special_rest_day_holiday_overtime:overtime_special_rest_day_holiday_overtime,
          date:date
          },
        beforeSend:function(){$('.fa-spinner').fadeIn(1000);},
        success:function(data){
		  $('#add_day .team-list-add-modal').val('0');
          $('#add_day .payperiod').val('0');
          $('#add_day .employee-list-add-modal').html('');
          $('#add_day .attendance-type-add-modal').val('0');
          $('#add_day .schedule_time_in_time_out').val('');
          $('#add_day .time_in_time_out').val('');
          $('#add_day .datepicker').val('');
          $('#add_day .late_total').val('');
          $('#add_day .late_undertime_total').val('');
          $('#add_day .overtime_night_differential').val('');
          $('#add_day .overtime_regular_holiday').val('');
          $('#add_day .overtime_special_holiday').val('');
          $('#add_day .overtime_regular_overtime').val('');
          $('#add_day .overtime_regular_rest_day_overtime').val('');
          $('#add_day .overtime_holiday_overtime').val('');
          $('#add_day .overtime_special_holiday_overtime').val('');
          $('#add_day .overtime_holiday_rest_day_overtime').val('');
          $('#add_day .overtime_special_rest_day_holiday_overtime').val('');
          $('.fa-spinner').fadeOut(1000);
        }
        
      });
    } else {
    
      $('#add_day .team-list-add-modal').addClass('warning');
      $('#add_day .payperiod').addClass('warning');
      $('#add_day .employee-list-add-modal').addClass('warning');
      $('#add_day .attendance-type-add-modal').addClass('warning');
      $('#add_day .time_in_time_out').addClass('warning');
    }
  
  });

  $('.tracker-table').on('click', 'button.delete', function(){
    var t = $(this);
    var attendance_id = $(this).attr('data-tracker-id');
    console.log(attendance_id);
    $.ajax({
      
      type: "POST",
      url: site_url + 'index.php/ajax/tracker_ajax/delete_day_record',
      data:{attendance_id:attendance_id},
      success:function(data) {
        var date = $(t).attr('data-date');
        var team_id = $(t).attr('data-team-id');
        $.ajax({
      
          type: "POST",
          url: site_url + 'index.php/ajax/tracker_ajax/load_tracker_by_date',
          data:{date:date, team_id:team_id},
          beforeSend:function(){$('#view_day').modal('show');$('.fa-spinner').fadeIn(1000);}, 
          success:function(data) {
          var tracker_data = $.parseJSON(data);
          console.log(tracker_data);
          var tracker_data_result = '';
          for(var i = 0; i<tracker_data.length; i++){
            tracker_data_result = tracker_data_result + 
            '<tr>' +
            '<td class="name">'+tracker_data[i].full_name+'</td>' +
            '<td class="schedule"><input  type="text" class="schedule col-md-10" data-tracker-id="' +
            tracker_data[i].attendance_id +
            '" value="'+ tracker_data[i].schedule_time_in +' ' + tracker_data[i].schedule_time_out +'"/></td>' +
            '<td class="time-in-time-out"><input  type="text" class="time-in-time-out col-md-10"  data-tracker-id="' +
            tracker_data[i].attendance_id +
            '" value="'+ tracker_data[i].time_in +' ' + tracker_data[i].time_out +'"/></td>' +
            '<td class="actions">' +
            ' <button class="btn btn-default edit fa fa-edit" data-tracker-id="' +
            tracker_data[i].attendance_id +
            '" data-date="' +
            tracker_data[i].date +
            '" ></button>'+
            ' <button class="btn btn-default delete fa fa-trash-o" data-tracker-id="' +
            tracker_data[i].attendance_id +
            '" data-date="' +
            tracker_data[i].date +
            '" ></button>'+
            '</td>';
            '</tr>';
          }
          $('.tracker-table tbody').html(tracker_data_result);
          $('#view_day input.time-in').datepicker();
          $('#view_day input.time-out').datepicker();
          $('.fa-spinner').fadeOut(1000);
          }
          
        });
      }
      
    });
  });

  $('.tracker-table').on('click', 'button.edit', function(){
    var t = $(this);
    var created_by = $('#view_day .created_by').val();
    var attendance_id = $(this).attr('data-tracker-id');
    var date = $(this).attr('data-date');
    var schedule_time_in_time_out = $(this).parents('tr').find('input.schedule').val();
    var time_in_time_out = $(this).parents('tr').find('input.time-in-time-out').val();
    console.log('schedule_time_in_time_out: ' + schedule_time_in_time_out);
    console.log('attendance_id: ' + attendance_id);
    $.ajax({
      
      type: "POST",
      url: site_url + 'index.php/ajax/tracker_ajax/update_day_record',
      data:{attendance_id:attendance_id, created_by:created_by, date:date, schedule_time_in_time_out:schedule_time_in_time_out, time_in_time_out:time_in_time_out},
      success:function(data) {
        var date = $(t).attr('data-date');
        var team_id = $(t).attr('data-team-id');
        var attendance_id = $(t).attr('data-attendance-id');
        $.ajax({
      
          type: "POST",
          url: site_url + 'index.php/ajax/tracker_ajax/load_tracker_by_date',
          data:{date:date, team_id:team_id},
          beforeSend:function(){$('#view_day').modal('show');$('.fa-spinner').fadeIn(1000);}, 
          success:function(data) {
          var tracker_data = $.parseJSON(data);
          console.log(tracker_data);
          var tracker_data_result = '';
          for(var i = 0; i<tracker_data.length; i++){
          tracker_data_result = tracker_data_result + 
          '<tr>' +
          '<td class="name">'+tracker_data[i].full_name+'</td>' +
          '<td class="schedule"><input  type="text" class="schedule col-md-10" data-tracker-id="' +
          tracker_data[i].attendance_id +
          '" value="'+ tracker_data[i].schedule_time_in.substr(0, 10) +' ' + tConvert(tracker_data[i].schedule_time_in.substr(11, 17)) + ' - ' + tracker_data[i].schedule_time_out.substr(0, 10) +' ' + tConvert(tracker_data[i].schedule_time_out.substr(11, 17)) +'"/></td>' +
          '<td class="time-in-time-out"><input  type="text" class="time-in-time-out col-md-10"  data-tracker-id="' +
          tracker_data[i].attendance_id +
          '" value="'+ tracker_data[i].time_in.substr(0, 10) +' ' + tConvert(tracker_data[i].time_in.substr(11, 17)) + ' - ' + tracker_data[i].time_out.substr(0, 10) +' ' + tConvert(tracker_data[i].time_out.substr(11, 17)) +'"/></td>' +
          '<td class="actions">' +
          ' <button class="btn btn-default edit fa fa-edit" data-tracker-id="' +
          tracker_data[i].attendance_id +
          '" data-date="' +
				  tracker_data[i].date +
				  '" data-team-id="' +
            tracker_data[i].real_team_id +
            '"></button>'+
          ' <button class="btn btn-default delete fa fa-trash-o" data-tracker-id="' +
          tracker_data[i].attendance_id +
          '" data-date="' +
				  tracker_data[i].date +
				  '" data-team-id="' +
            tracker_data[i].real_team_id +
            '"></button>'+
          '</td>';
          '</tr>';
        }
          $('.tracker-table tbody').html(tracker_data_result);
          $('#view_day input.time-in').datepicker();
          $('#view_day input.time-out').datepicker();
          $('.fa-spinner').fadeOut(1000);
          }
          
        });
      }
      
    });
    
  });
  
  $('.btn-save-day').click(function(){});
  
  function tConvert (timeString) {
    var H = +timeString.substr(0, 2);
    var h = (H % 12) || 12;
    var ampm = H < 12 ? " AM" : " PM";
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString;
  }
});