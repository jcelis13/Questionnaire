$(document).ready(function() {

    var current_employee_id;
    var current_employee_name;
    var current_team_id;
    var current_tl_id;
    var current_team;
    var modalState = 1;

    $('#log_tracking_range').daterangepicker();
    
    $("#view-team-modal").on("click", ".viewEmployeeLogs", function(){ 
        var user_id = $(this).data("id");
        var employee_name = $(this).closest("tr").find("td:first").html();
        current_employee_id = user_id;
        current_employee_name = employee_name;
        viewLogs();
        document.getElementById('add_timelog').dataset.id = user_id;
        $('#view-team-modal').modal('hide');
        $('#view-employee-logs-modal').modal('show');
    });

    /**
     * Teams Modal ON-CLOSED ACTION
     */
    $('#view-employee-logs-modal').on('hidden.bs.modal', function (e) {
        if(modalState > 0) {
            $.ajax({
                type: "POST",
                url:  site_url + "ajax/teams_ajax/view_team_members",
                data: {id:current_team_id, tl_id:current_tl_id},
                success:function (data){
                    $("#activate_users_team_name").text(" " + current_team);
                    $("#view_employees_table").html("");
                    $("#view_employees_table").append(data.team);
                    $('#view-team-modal').modal('show');
                }
            });
        }
    });

    /**
     * Teams Modal ON-CLOSED ACTION
     */
    $('#add-edit-timelog-modal').on('hidden.bs.modal', function (e) {
        modalState*=-1;
        $('#view-employee-logs-modal').modal('show');
    });

    $("#search_log").click(function(e){
        e.preventDefault();
        viewLogs();
    });
    
    function viewLogs(){
        //ajax call content
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var date_start = (m + 1*1)+"/"+ 1 +"/"+ y;
        var date_end = (m + 1*1) +"/"+ lastDay.getDate() +"/"+ y;
        var user_id = current_employee_id;
        
        var date_range = $("#log_tracking_range").val();
        
        if( date_range ){
            date_range_array = date_range.split("-");
           
            date_start = date_range_array[0].trim();
            date_end =  date_range_array[1].trim();
        }
        $("#animated_loader").show();
        $.ajax({
            type: "POST",
            url:  site_url + "ajax/teams_ajax/getEmployeeLogs",
            data: {user_id:user_id, date_start:date_start, date_end:date_end}, 
            success:function (data){
                //$('#view-team-modal').modal('hide');
            	$(".current_employee_name").html(current_employee_name);
                $("#animated_loader").hide();
                $("#view_employee_logs_table").html("");
                $("#view_employee_logs_table").append(data.logs);
                if(!data.edit_mode)
                	$("#add_timelog").prop('disabled', true);
                else
                	$("#add_timelog").prop('disabled', false);
            }
        });
    }
    
    $('#activate_users_department').change( function() {
        var department_selected = $('#activate_users_department').val();
        department_selected = department_selected.replace(/[^A-Z0-9]/ig, "");
        window.location.href= site_url + 'team_schedules/employee_logs/' + department_selected;
    });
    
    
    $('#activate_users_table').on("click", ".activate_wrapper", function() {
        $("#select_users_error").hide();
        $("#select_users_error2").hide();
        var id = $(this).data('id');
        var team = $(this).data('team');
        var tl_id = $(this).data('tl'); 
        $('#confirmation_cancel').data('id', id);
        $('#confirmation_cancel').data('team', team);
        current_team_id = id;
        current_tl_id = tl_id;
        current_team = team;
        $.ajax({
            type: "POST",
            url:  site_url + "ajax/teams_ajax/view_team_members",
            data: {id:id, tl_id:tl_id}, 
            success:function (data){
                $("#activate_users_team_name").text(" " + team);
                $("#view_employees_table").html("");
                $("#view_employees_table").append(data.team);
                $('#view-team-modal').modal('show');
            }
        });
    });

    $("#view_employee_logs_table").on("click",".edit_employee_log", function(e){
    	e.preventDefault();
        var logout_schedule = null,
            timein_schedule = null;
    	$.ajax({
            type: "POST",
            url:  site_url + "ajax/teams_ajax/getEmployeeLog",
            data: {id:$(this).data("id")}, 
            success:function (data){
            	console.log(data);
            	$(".current_employee_name").html(current_employee_name);
            	time_in = data.data.time_in.split(" ");
            	if(data.data.time_out)
            		time_out = data.data.time_out.split(" ");
            	else
            		time_out = ["",""];

                timein_schedule = data.data.time_in_schedule.split(" ");
                logout_schedule = data.data.time_out_schedule.split(" ");
                modalState*=-1;

                $("#login_time").val(timein_schedule[1]);
                $("#logout_time").val(logout_schedule[1]);
            	$("#timelog_id").val(data.data.id);
            	$("#log_date").val(data.data.date);
                $("#logout_date").val(time_out[0]);
                //$("#logout_date").val(data.data.date);
                $("#log_date").prop("disabled","disabled");
            	$("#timein_date").val(time_in[0]);
            	$("#timeout_date").val(time_out[0]);
            	$("#timelog_time-in").val(time_in[1]);
            	$("#timelog_time-out").val(time_out[1]);
                $("#sched_type").val(data.data.schedule_type);
                $("#view-employee-logs-modal").modal("hide");
                $("#add-edit-timelog-modal").modal("show");
            }
        });
    	
    });
    
    $("#view_employee_logs_table").on("click",".delete_employee_log", function(e){
    	e.preventDefault();
    	
    	$.ajax({
            type: "POST",
            url:  site_url + "ajax/teams_ajax/deleteEmployeeLog",
            data: {id:$(this).data("id")}, 
            success:function (data){
            	viewLogs();
            	alert("Employee log removed!");
            	//$("#add-edit-timelog-modal").modal("show");
            }
        });
    	
    });

    $('#open-add-team-log').click(function(e){
        $('#display-success').empty();
        $('#display-failed').empty();
        $('#display-exist').empty();
        $('#timelog_datepcker').datepicker({
            format: 'mm-dd-yyyy',
            endDate: '+0d',
            autoclose: true
        });
        $("#activate_users_team_name_log").text(" " + current_team);
        $('.mini-content').addClass('hidden');
        $('#add-team-log').modal('show');
    });

    $('#insert-logs').click(function(e){
        if($('#timelog_datepcker').val()) {
            $(this).addClass('disabled');
            $(this).removeClass('disabled');

            var data = {
                'team_id': current_team_id,
                'date': $('#timelog_datepcker').val()
            };
            $.ajax({
                type: "POST",
                url:  site_url + "ajax/teams_ajax/insert_team_logs",
                data: data,
                success:function (data){
                    console.log(JSON.parse(data));
                    if(JSON.parse(data).response) {
                        var formatted = moment($('#timelog_datepcker').val()).format('LL');
                        $('#display-success').empty();
                        $('#display-failed').empty();
                        $('#display-exist').empty();
                        $('#date-selected').empty();
                        $('#display-success').append(JSON.parse(data).success);
                        $('#display-failed').append(JSON.parse(data).failed);
                        $('#display-exist').append(JSON.parse(data).log_exist);
                        $('#date-selected').append(formatted + ", " + moment($('#timelog_datepcker').val()).format('dddd'));
                        $('#insert-logs').removeClass('disabled');
                        $('.mini-content').removeClass('hidden');
                    } else {
                        alert('Something went wrong');
                    }
                }
            });
        } else {
            alert('Please select date to mark as present');
        }
    });


    $("#add_timelog").click(function(e){
    	e.preventDefault();
    	$("#log_date").prop('disabled', false)
    	$("#log_date").val("");
    	$("#timelog_id").val("");
    	$("#timein_date").val("");
    	$("#timeout_date").val("");
    	$("#timelog_time-in").val("");
    	$("#timelog_time-out").val("");
        modalState*=-1;
        var user_id = document.getElementById('add_timelog').dataset.id;
        $.ajax({
            type: "POST",
            url:  site_url + "ajax/teams_ajax/preset_timelogs",
            data: {id: user_id},
            success:function (results){

                $("#log_date").val(moment().format("YYYY-MM-DD"));
                $("#timein_date").val(moment().format("YYYY-MM-DD"));
                $("#login_time").val(results[0].time_in);
                $("#logout_time").val(results[0].time_out);
                $("#timelog_time-in").val(results[0].time_in);
                $("#timelog_time-out").val(results[0].time_out);

                if(results[0].time_in > results[0].time_out) {
                    var today = moment();
                    var tomorrow = today.add('days', 1);
                    $("#logout_date").val(moment(tomorrow).format("YYYY-MM-DD"));
                    $("#timeout_date").val(moment(tomorrow).format("YYYY-MM-DD"));
                } else {
                    $("#logout_date").val(moment().format("YYYY-MM-DD"));
                    $("#timeout_date").val(moment().format("YYYY-MM-DD"));
                }

                $("#view-employee-logs-modal").modal("hide");
                $("#add-edit-timelog-modal").modal("show");
            }
        });
    });
    
    $("#submit-timelog").click(function(e){
    	e.preventDefault();
    	$("#timelog_edit_warning").html("");
    	var time_out_time = $("#timelog_time-out").val().split(":");
        var base_time_out_time = $("#logout_time").val().split(":");

    	if(time_out_time.length < 3)
    		time_out_time = time_out_time.join(":") + ":00";
    	else
    		time_out_time = time_out_time.join(":");

        if(base_time_out_time.length < 3)
            base_time_out_time = base_time_out_time.join(":") + ":00";
        else
            base_time_out_time = base_time_out_time.join(":");

    	var data = {
    				date:$("#log_date").val(),
    				time_in:$("#timein_date").val() + " " + $("#timelog_time-in").val(),
    				time_out:$("#timeout_date").val() + " " + time_out_time,
    				id: $("#timelog_id").val(),
    				employee_id: current_employee_id,
                    base: {
                        time_in:$("#log_date").val() + " " + $("#login_time").val(),
                        time_out:$("#logout_date").val() + " " + base_time_out_time
                    },
                    schedule_type: $("#sched_type").val()
    			};
    	
    	if(!is_valid_date(data.time_out))
    		delete data["time_out"];

        if(!is_valid_date(data.base.time_out))
            delete data.base["time_out"];


        $.ajax({
            type: "POST",
            url:  site_url + "ajax/teams_ajax/editEmployeeLog",
            data: {id:$("#timelog_id").val(), data:data, date: $("#log_date").val()}, 
            success:function (data){
            	if(data.status == "success"){
            		//$("#add-edit-timelog-modal").modal("hide");
            		viewLogs();
            		alert("Employee logs updated!");
            	}
            	else
            		$("#timelog_edit_warning").html(data.message);
            }
        });
    });

    var delayTimer;

    $("#scheduler_search_team").keypress(function(e) {
        if(e.which == 13) {
            var search_key = $.trim($("#scheduler_search_team").val());

            if(search_key.length > 0){
                $("#scheduler_search_employee").val("");

                $.ajax({
                    type: "POST",
                    url:  site_url + "ajax/teams_ajax/search_logs",
                    data: {search_key:search_key},
                    success:function (data){
                        $('#activate_users_table').DataTable().destroy();
                        $("#activate_users_table").html('');
                        $("#activate_users_table").html(data);
                        $('#activate_users_table').DataTable( {
                            "pagingType": "full_numbers",
                            "iDisplayLength": 20,
                            "bSort" : false,
                            "searching" : false
                        } );
                    }
                });
            }
        }
    });


    $("#scheduler_search_employee").keypress(function(e) {
        if(e.which == 13) {
            var search_key = $.trim($("#scheduler_search_employee").val());

            if(search_key.length > 0) {
                $("#scheduler_search_team").val("");
                $.ajax({
                    type: "POST",
                    url: site_url + "ajax/teams_ajax/search_employee_logs",
                    data: {search_key: search_key},
                    success: function (data) {
                        $('#activate_users_table').DataTable().destroy();
                        $("#activate_users_table").html('');
                        $("#activate_users_table").html(data);
                        $('#activate_users_table').DataTable( {
                            "pagingType": "full_numbers",
                            "iDisplayLength": 20,
                            "bSort" : false,
                            "searching" : false
                        } );
                    }
                });
            }
        }
    });            
    
});

function is_valid_date(value) {
	console.log(value);
	if(typeof value === undefined){
		console.log("undefined");
		return false;
	}
		
    // capture all the parts
    var matches = value.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    if (matches === null) {
    	console.log("no match");
        return false;
    } else{
        // now lets check the date sanity
        var year = parseInt(matches[1], 10);
        var month = parseInt(matches[2], 10) - 1; // months are 0-11
        var day = parseInt(matches[3], 10);
        var hour = parseInt(matches[4], 10);
        var minute = parseInt(matches[5], 10);
        var second = parseInt(matches[6], 10);
        var date = new Date(year, month, day, hour, minute, second);
        if (date.getFullYear() !== year
          || date.getMonth() != month
          || date.getDate() !== day
          || date.getHours() !== hour
          || date.getMinutes() !== minute
          || date.getSeconds() !== second
        ) {
           return false;
        } else {
           return true;
        }
    
    }
}







