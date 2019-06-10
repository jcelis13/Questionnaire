$(document).ready(function() {
    var TEXTBOX_OBJECT = null;
    var TEAM_ID = null;
    var TEAM_LEAD_ID = null;
    var TEAM_LABEL = null;
    var delayTimer;

    $("#activate_users_search").on("keyup", function() {
        var search_key = $.trim($("#activate_users_search").val());

        if(search_key.length > 0){
            clearTimeout(delayTimer);
            delayTimer = setTimeout(function() {
                $("#activate_users_search_employee").val("");
                $.ajax({
                    type: "POST",
                    url:  site_url + "ajax/teams_ajax/search/true",
                    data: {search_key:search_key},
                    success:function (data){
                        $(".table").html("");
                        $(".table").append(data);
                    }
                });
            }, 500);
        }
    });

    $('#activate_users_department').change( function() {
        var department_selected = $('#activate_users_department').val();
        department_selected = department_selected.replace(/[^A-Z0-9]/ig, "");
        window.location.href= site_url + 'reports/clock_in_out/index/' + department_selected;
    });

    $('#activate_users_table').on("click", ".activate_wrapper", function() {
        var id = $(this).data('id');
        var team = $(this).data('team');
        var tl_id = $(this).data('tl');
        TEAM_ID = id;
        TEAM_LEAD_ID = tl_id;
        TEAM_LABEL = team;
        $('#days_off_modal').modal('show');
        $("#activate_users_team_name_report").text(" " + TEAM_LABEL);
        //teamDisplaySchedule(); 
    });

    $('#generate-report-trigger').click(function() {
        var month = $('#month-report').val(),
            day =  $('#day-report').val(),
            year = $('#year-report').val();
        if(month && day && year) {
            $("#error_report").addClass("hidden");
            var page = site_url + "ajax/report_ajax/clock_in_out_report/" + month + "/" + day + "/" + year + "/" + TEAM_ID + "/" + escape(TEAM_LABEL);
            window.open(page,'_blank' );
        } else {
            $("#error_report").removeClass('hidden');
        }
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
                    $("td.time-in .time-in-txt").on("blur", function(){

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
                    });
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
});
