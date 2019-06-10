$(function() {
  // Handler for .ready() called.
  var select_default = '<option value="0">Please select</option>';
  var user_role_type = $('.user_role_type').val();
  //$('.team_schedule_start').timepicker({minuteStep: 1}); 
  //$('.team_schedule_end').timepicker({minuteStep: 1});
  //$('.time_in').timepicker({minuteStep: 1}); 
  //$('.time_out').timepicker({minuteStep: 1});
  $('#schedule_time_in_time_out').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD h:mm A', singleDatePicker: true});
  $('#time_in_time_out').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD h:mm A'});
  
  console.log('user role: ' + user_role_type);

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
    $.ajax({
      
      type: "POST",
      url: site_url + 'index.php/ajax/tracker_ajax/load_teams',
      success:function(data) {
        var teams = $.parseJSON(data);
        var teams_result = '';
        for(var i = 0; i<teams.length; i++){
          teams_result = teams_result + 
          '<option value="' + teams[i].team_id + '">' + teams[i].team_name + '</option>';
        }
        $('.non-admin-team-list').html(select_default + teams_result);
      }
      
    });
  }
  
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
  
});