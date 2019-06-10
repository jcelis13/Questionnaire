var dateLog = null,
    employee_logs_data = null;

function _onChangeTeam() {
  var team_selected = $('#department_teams_selection').val();
  window.location.href= site_url + 'team_schedules/view_logs/' + team_selected;
}

$('#datepicker').datepicker({
	format: 'yyyy-mm-dd',
	endDate: '+0d',
    autoclose: true
}).on('changeDate', function(e) {
	dateLog = e.target.value;	
});

function viewDateLog() {
  var data = {
  	'dateLog': dateLog,
  	'team_selected': $('#department_teams_selection').val()
  };
  if(dateLog) {
  	$.ajax({
  	  type: 'POST',
  	  url: site_url + 'ajax/teams_ajax/view_date_logs',
  	  data: data,
  	  dataType: 'json',
  	  success: function(results) {
  	  	//console.log(results.response);
  	  	updateUIforTeamLogs(results.response);
  	  }
  	})
  }
}

function updateUIforTeamLogs(members) {

  var time_in = '-',
  	  time_out = '-',
  	  late = 0,
  	  undertime = 0,
  	  m, h;

  var full_name,
      middle;

  employee_logs_data = members;

  for(var i=0; i<members.length; i++) {
  	if(members[i].time_in) {
  	  time_in = moment(members[i].time_in).format('LLL');
      if(members[i].time_out) {
        time_out = moment(members[i].time_out).format('LLL');
      }
  	} else {
      time_in = '-';
      time_out = '-';
    }

    if(members[i].late === 0) {
      late = members[i].late;
      m = late % 60;
      h = (late-m)/60;
      late = h.toString() + ":" + (m<10?"0":"") + m.toString();
    } else {
      late = "-";
    }

    if(members[i].undertime != 0) {
      undertime = members[i].undertime;
      m = undertime % 60;
      h = (undertime-m)/60;
      undertime = h.toString() + ":" + (m<10?"0":"") + m.toString();
    } else {
      undertime = "-";
    }

  	document.getElementById('time_in_' + members[i].user_id).innerHTML = time_in;
  	document.getElementById('time_out_' + members[i].user_id).innerHTML = time_out;
  	document.getElementById('late_' + members[i].user_id).innerHTML = late;
  	document.getElementById('undertime_' + members[i].user_id).innerHTML = undertime;
  	document.getElementById('auto_logout_' + members[i].user_id).innerHTML = members[i].auto_logout==1? 'Yes': 'No';
    document.getElementById("inputHidden" + members[i].user_id).value = JSON.stringify(members[i]);
  }
}

function onClickEditAction(element) {
  var employee = JSON.parse(document.getElementById("inputHidden" + element.id).value);

  var  middle = employee.middle_name ==='N/A' ? '': employee.middle_name,
       full_name = employee.first_name + " " + middle + " " + employee.last_name;

  var employee_id = employee.user_id,
      timesheet_id = employee.timesheet_id,
      employee_name = full_name,
      timein_sched = employee.timein_schedule.split(" "),
      timeout_sched = employee.timeout_schedule.split(" "),
      timein = employee.time_in.split(" "),
      timeout = employee.time_out.split(" ");

  $(".current_employee_name").html(employee_name);

  $("#login_date").val(timein_sched[0]);
  $("#login_time").val(timein_sched[1]);

  $("#timein_date").val(timein[0]);
  $("#timelog_time-in").val(timein[1]);

  $("#logout_date").val(timeout_sched[0]);
  $("#logout_time").val(timeout_sched[1]);

  $("#timeout_date").val(timeout[0]);
  $("#timelog_time-out").val(timeout[1]);

  if(timesheet_id) {
    $("#edit-employee-timelog-modal").modal("show");
  }
}

