$(document).ready(function() {
     var TEXTBOX_OBJECT = null;
     var TEAM_ID = null;
     var TEAM_LEAD_ID = null;
     var TEAM_LABEL = null;
     
     $("#view-team-modal").on("click",".days-off",function(){
         TEXTBOX_OBJECT = $(this).find("input");
         $("#days_off input").prop("checked", false);
         $("#days_off p div").removeClass("checked");
         $("#days_off input").prop("disabled", false);

         tr = $(this).closest("tr");
         trs = $("tr[data-id='" + tr.data("id") +"']");
         
         current_days = tr.find(".days-off input").val();
        
         if(typeof current_days !== "undefined" && current_days != ""){
        	 current_days = current_days.split(",");
        	 $.each(current_days, function(key, value){
        		 $("#days_off input."+value).prop("checked", true);
        		 $("#days_off input."+value).closest("div").addClass("checked");
        	 });
         }
         /** allow scheduling multiple times in a day
         
         $.each(trs, function(key, value){
        	 days = $(value).find(".days-off input");
        	 if(typeof days.val() !== "undefined" && days.val() != ""){
        		 days = days.val();
        		 days = days.split(",");
        		 
        	 	$.each(days, function(x, y){
        	 		if($.inArray(y, current_days) === -1)
        	 			$("#days_off input."+y).attr("disabled", true);
        	 	});
         	}
         });
         */

         $("#view-team-modal").modal("hide");
         $("#days_off_modal").modal("show");
     });

     $("#days_off_modal").on("hidden.bs.modal", function () {
        $("#view-team-modal").modal("show"); //close-hide modal
     });
     
     $("#set_days_off").click(function(){

         days = new Array();
         $.each($("#days_off input:checked"),function(){
             days.push($(this).val());
         });
         
         $(TEXTBOX_OBJECT).val(days.join(","));
     });
     
    $('#activate_users_department').change( function() {
        var department_selected = $('#activate_users_department').val();
        department_selected = department_selected.replace(/[^A-Z0-9]/ig, "");
        window.location.href= site_url + 'team_schedules/teams/' + department_selected;
    });
    
    
    $('#activate_users_table').on("click", ".activate_wrapper", function() {
        $("#select_users_error").hide();
        $("#select_users_error2").hide();
        var id = $(this).data('id');
        var team = $(this).data('team');
        var tl_id = $(this).data('tl');
        TEAM_ID = id;
        TEAM_LEAD_ID = tl_id;
        TEAM_LABEL = team;
        $('#confirmation_cancel').data('id', id);
        $('#confirmation_cancel').data('team', team);
        teamDisplaySchedule();
    });
    
    function teamDisplaySchedule(){
    	$.ajax({
            type: "POST",
            url:  site_url + "ajax/teams_ajax/view_teams",
            data: {id:TEAM_ID, tl_id:TEAM_LEAD_ID}, 
            success:function (data){
                $("#activate_users_team_name").text(" " + TEAM_LABEL);
                $("#view_teams_table").html("");
                $("#view_employees_table").html("");
                $("#view_teams_table").append(data.team);
                $("#view_employees_table").append(data.employees);
                if(!($("#view-team-modal").data('bs.modal') || {isShown: false}).isShown)
                	$('#view-team-modal').modal('show');
                if(!data.edit_mode){
                	$("#save_team_schedule").prop('disabled', true);
                	$("#save_member_schedules").prop('disabled', true);
                }else{
                	$("#save_team_schedule").prop('disabled', false);
                	$("#save_member_schedules").prop('disabled', false);
                	/*$("td.time-in .time-in-txt").on("blur", function(){
                		
                		formated = formatTime($(this).val());
                		if(  formated == false ){
                			alert("Please enter a valid time format!");
                			$(this).focus();
                		}else{
                			$(this).val(formated);
                		}
                	});
                	$("td.time-out .time-out-txt").on("blur", function(){
                		formated = formatTime($(this).val());
                		if(  formated == false ){
                			alert("Please enter a valid time format!");
                			$(this).focus();
                		}else{
                			$(this).val(formated);
                		}
                	});*/
                	/*$("document td.time-in .time-in-txt").timepicker({
                        minuteStep: 15,
                        showSeconds: false,
                        showMeridian: false,
                        defaultTime: false,
                        explicitMode: true,
                        showMeridian: false
                    });
                	
                	$("document td.time-out .time-out-txt").timepicker({
                        minuteStep: 15,
                        showSeconds: false,
                        showMeridian: false,
                        defaultTime: false,
                        explicitMode: true,
                        showMeridian: false
                    }).on('changeTime.timepicker', function(e) {
                        console.log('The time is ' + e.time.value);
                      }).on('show.timepicker', function(e) {
                    	    console.log('widget show');
                    	  });*/
                	
                }
                
                	
            }
        });
    }
    
    function formatTime(time) {
        var result = false, m;
        var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
        if ((m = time.match(re))) {
            result = (m[1].length === 2 ? "" : "0") + m[1] + ":" + m[2];
        }
        return result;
    }

    function am_pm_to_hours(time) {
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "pm" && hours < 12) hours = hours + 12;
        if (AMPM == "am" && hours == 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return (sHours +':'+sMinutes);
    }

    function hours_am_pm(time) {
        var hours = Number(time.match(/^(\d+)/)[1]);
        var min =  Number(time.match(/:(\d+)/)[1]);
        if (min < 10) min = "0" + min;
        if (hours < 12) {
            return hours + ':' + min + ' AM';
        } else {
            hours=hours - 12;
            hours=(hours < 10) ? '0'+hours:hours;
            return hours+ ':' + min + ' PM';
        }
    }
    
//    function setTeamVars(id, tl_id, team){
//    	TEAM_ID = id;
//        TEAM_LEAD_ID = tl_id;
//        TEAM_LABEL = team;
//    }

    var delayTimer;


    $("#scheduler_search_team").keypress(function(e) {
        if(e.which == 13) {
            var search_key = $.trim($("#scheduler_search_team").val());
        
            if(search_key.length > 0){
                $("#scheduler_search_employee").val("");
                $.ajax({
                    type: "POST",
                    url:  site_url + "ajax/teams_ajax/search",
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


    var delayTimer;

    $("#scheduler_search_employee").keypress(function(e) {
        if(e.which == 13) {
            var search_key = $.trim($("#scheduler_search_employee").val());

            if(search_key.length > 0) {
                $("#scheduler_search_team").val("");
                $.ajax({
                    type: "POST",
                    url: site_url + "ajax/teams_ajax/search_employee",
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
    
    
    $('#save_team_schedule').click(function(event) {
        event.preventDefault();
        
        let button = $(this);

        // var button_clicked = $(this).attr('id');
        // var form = document.getElementById('activate_email_form');
        // var schedules = [];
        
        // trs = $('#view_teams_table tbody tr');

        let schedules = $('#view_teams_table tbody tr').map(function() {
            let row = $(this);
            let push = true;

            let schedule = {
                id: row.find('td input.sched_id').val(),
                team_id: row.data('id'),
                time_in: row.find('td.time-in .time-in-txt').val(),
                time_out: row.find('td.time-out .time-out-txt').val(),
                days: row.find('td.days-off input').val(),
                break: row.find('td.break input').val()
            };

            if (schedule.days) {
                if (schedule.time_in == '') {
                    row.find('td.time-in .time-in-txt')
                        .parents('.form-group').addClass('has-error');

                } else {
                    row.find('td.time-in .time-in-txt')
                        .parents('.form-group').removeClass('has-error');
                }

                if (schedule.time_out == '') {
                    row.find('td.time-out .time-out-txt')
                        .parents('.form-group').addClass('has-error');
                
                } else {
                    row.find('td.time-out .time-out-txt')
                        .parents('.form-group').removeClass('has-error');
                }
            } else {
                push = false;
            }

            if (schedule.time_in) {
                if (schedule.time_out == '') {
                    row.find('td.time-out .time-out-txt').parents('.form-group')
                        .addClass('has-error');
                
                } else {
                    row.find('td.time-out .time-out-txt').parents('.form-group')
                        .removeClass('has-error');
                }
            } else {
                push = false;
            }

            if (schedule.time_out) {
                if (schedule.time_in == '') {
                    row.find('td.time-in .time-in-txt').parents('.form-group')
                        .addClass('has-error');

                } else {
                    row.find('td.time-in .time-in-txt').parents('.form-group')
                        .removeClass('has-error');
                }
            } else {
                push = false;
            }

            if (push) {
                return schedule;
            }
        }).get();

        if (schedules.length == 0) {
            alert('There are no team schedule set or incorrect schedule details. \nPlease check and try submitting again.');

        } else {
            $.ajax({
                type: 'POST',
                url: button.data('ajax-url'),
                beforeSend: function() {
                    button.button('loading');
                },
                data: {
                    'team_sched': schedules
                }, 
                success:function (data) {
                    //$('#view-team-modal').modal('hide');
                    teamDisplaySchedule();
                    alert('Team schedule successfully saved.');
                }
            })
            .always(function() {
                button.button('reset');
            });
        }
        // $.each(trs, function(index, value){
        	
        // 	sched_id = $(value).find('td input.sched_id').val();
        //     team_id = $(value).data('id');
        //     time_in = $(value).find('td.time-in .time-in-txt').val();
        //     time_out = $(value).find('td.time-out .time-out-txt').val();
        //     days_off = $(value).find('td.days-off input').val();
        //     var_break = $(value).find('td.break input').val();
            
        //     schedules.push({'team_id':team_id,'time_in':time_in, 'time_out':time_out, 'days':days_off, 'id':sched_id, 'break': var_break});
        // });
     
        // $.ajax({
        //     type: 'POST',
        //     url:  site_url + 'ajax/teams_ajax/save_team_schedule',
        //     data: {'team_sched': schedules}, 
        //     success:function (data){
        //         //$('#view-team-modal').modal('hide');
        //         teamDisplaySchedule();
        //         alert('Changes Saved!');
        //     }
        // });
        
    });
    
    $('#save_member_schedules').click(function(event) {
        event.preventDefault();

        let button = $(this);

        var button_clicked = $(this).attr('id');
        var form = document.getElementById('activate_email_form');
        var employee_data = new Array();
        //s$('#view-team-modal').modal('hide');
        
        if( button_clicked == "save_member_schedules" ){
            
            let employee_tr = $("#view_employees_table tbody tr");
            
            $.each(employee_tr, function(index, row) {
                let push = true;

                let schedule = {
                    "user_id": $(row).data("id"),
                    "time_in": $(row).find("td.time-in .time-in-txt").val(),
                    "time_out": $(row).find("td.time-out .time-out-txt").val(), 
                    "days": $(row).find("td.days-off input").val(),
                    "id" : $(row).find("td input.sched_id").val(),
                    "break": $(row).find("td.break input").val()
                };

                if (schedule.days) {
                    if (schedule.time_in == '') {
                        $(row).find('td.time-in .time-in-txt')
                            .parents('.form-group').addClass('has-error');

                    } else {
                        $(row).find('td.time-in .time-in-txt')
                            .parents('.form-group').removeClass('has-error');
                    }

                    if (schedule.time_out == '') {
                        $(row).find('td.time-out .time-out-txt')
                            .parents('.form-group').addClass('has-error');
                    
                    } else {
                        $(row).find('td.time-out .time-out-txt')
                            .parents('.form-group').removeClass('has-error');
                    }
                } else {
                    push = false;
                }

                if (schedule.time_in) {
                    if (schedule.time_out == '') {
                        $(row).find('td.time-out .time-out-txt').parents('.form-group')
                            .addClass('has-error');
                    
                    } else {
                        $(row).find('td.time-out .time-out-txt').parents('.form-group')
                            .removeClass('has-error');
                    }
                } else {
                    push = false;
                }

                if (schedule.time_out) {
                    if (schedule.time_in == '') {
                        $(row).find('td.time-in .time-in-txt').parents('.form-group')
                            .addClass('has-error');

                    } else {
                        $(row).find('td.time-in .time-in-txt').parents('.form-group')
                            .removeClass('has-error');
                    }
                } else {
                    push = false;
                }

                if (push) {
                    employee_data.push(schedule);
                }
            });
            
    
            if (employee_data.length == 0) {
                alert('There are no employee schedule set or incorrect schedule details. \nPlease check and try submitting again.');
            
            } else {
                $.ajax({
                    type: "POST",
                    url:  site_url + "ajax/teams_ajax/save_employees_schedule",
                    beforeSend: function() {
                        button.button('loading');
                    },
                    data: {employees:employee_data}, 
                    success:function (data) {
                     console.log(data);
                     alert("Employee schedules successfully saved.");
                    //$('#view-team-modal').modal('hide');
                    teamDisplaySchedule();
                    }
                })
                .always(function() {
                    button.button('reset');
                });
            }
        }
        
    });
    
    $('#view-team-modal').on('click', '.add', function(){
        let row = {
            ref: $(this).closest('tr')
        };

        row.new = row.ref.clone();

    	$(row.new).find('td .sched_id').val(null);    	
    	$(row.new).find('td.time-in .time-in-txt').val(null);
        $(row.new).find('td.time-out .time-out-txt').val(null);
        $(row.new).find('td.days-off input').val(null);

        $(row.new).find('td.time-in .form-group, td.time-out .form-group').removeClass('has-error');
    	
        row.ref.after(row.new);
    });

    $('#view-team-modal').on('keyup', 'td.time-in .time-in-txt, td.time-out .time-out-txt', function(event) {
        let input = $(this);
        
        if (event.which == 9) {

        } else {
            let formated = formatTime(input.val());

            if (formated) {
                input.val(formated);
                input.parents('.form-group').removeClass('has-error');
            
            } else {
                input.parents('.form-group').addClass('has-error');
            }
        }
    }).on('focusout', 'td.time-in .time-in-txt, td.time-out .time-out-txt', function(event) {
        let input = $(this);

        let formated = formatTime(input.val());

        if (formated) {
            input.val(formated);
            input.parents('.form-group').removeClass('has-error');
        
        }
    });

    $("#view-team-modal").on("click",".remove", function(){
    	tr = $(this).closest("tr");
    	
    	trs = $("tr[data-id='" + tr.data("id") +"']");
    	
    	id = $(tr).find("td .sched_id").val();

    	if(id <= 0 || typeof id == undefined){
    		tr.remove();
    	}else{
    		$.ajax({
                type: "POST",
                url:  site_url + "ajax/teams_ajax/remove_schedule",
                data: {"id":id, "type":1}, 
                success:function (data){
                	
                	if(trs.length <= 1){
                		//$('#view-team-modal').modal('hide');
                    	teamDisplaySchedule();
                    	alert("Changes Saved!");
                	}else{
                		tr.remove();
                	}
                }
            });
    	}
    	
    });
    
    $("#view-team-modal").on("click",".removeTeam", function(){
    	tr = $(this).closest("tr");
    	
    	id = $(tr).find("td .sched_id").val();

    	if(id <= 0 || typeof id == undefined){
    		tr.remove();
    	}else{
    		$.ajax({
                type: "POST",
                url:  site_url + "ajax/teams_ajax/remove_schedule",
                data: {"id":id, "type":0}, 
                success:function (data){
                	tr.remove();
                	//$('#view-team-modal').modal('hide');
                	teamDisplaySchedule();
                	alert("Changes Saved!");
                }
            });
    	}
    	
    });
    
});







