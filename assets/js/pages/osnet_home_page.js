!function(){

    function generate_calendar(isAdmin) {
        var events_url = 'ajax/profile_ajax/ajax_get_calendar_events';

        var cal_data =  function(){
          var tmp = null;
            $.ajax({
                  async: false,
                  type: "POST",
                  url: domain + events_url,
                  data: {
                      start: moment().startOf('month').unix(),
                      end: moment().endOf('month').unix()
                  },
                  success: function (response) {
                      tmp = response;
                  }
              });
          return tmp;
         }();
        
        var calendar = new Calendar('#attendance_cal', cal_data, site_url + events_url);
        
    }

    var pathArray = window.location.pathname.split( '/' );
    if(pathArray.find(function(val){
        return val == "osnet_home_page";
    }) == "osnet_home_page"){
        generate_calendar(false);
    }else if (pathArray.find(function (val) {
        return val == "home";
    }) == "home") {
        generate_calendar(true);
    }

        

}();

function update_date() {
    timestamp = $("#timestamp").val();
    var date = new Date(timestamp * 1000);

    var syear = parseInt($("#syear").val());
    var smonth = parseInt($("#smonth").val());
    var sday = parseInt($("#sday").val());

    var shour = parseInt($("#shour").val());
    var smin = parseInt($("#smin").val());
    var ssec = parseInt($("#ssec").val());

    ssec += 1;

    if (ssec >= 60) {
        ssec = 0;

        smin += 1;
        if (smin >= 60) {

            smin = 0;

            shour += 1;
            console.log(shour);
            if (shour >= 24) {
                shour = 1;

                sday += 1;
            }
        }
    }

    var data = getHourAndMeridian(shour);

    var month = new Array();
    month[1] = "Jan";
    month[2] = "Feb";
    month[3] = "Mar";
    month[4] = "Apr";
    month[5] = "May";
    month[6] = "Jun";
    month[7] = "Jul";
    month[8] = "Aug";
    month[9] = "Sep";
    month[10] = "Oct";
    month[11] = "Nov";
    month[12] = "Dec";
    var mon = month[smonth];

    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var weekday = weekday[date.getDay()];

    min = smin;
    if (smin < 10) {
        min = "0" + smin;
    }

    sec = ssec;
    if (sec < 10) {
        sec = "0" + ssec;
    }

    $(".sweekday").html(weekday);
    $(".smonth").html(mon);
    $(".sday").html(sday);
   // $(".syear").html(syear);
    $(".shours").html(data.hour);
    $(".sminutes").html(min);
    $(".sseconds").html(sec);
    $(".smeridian").html(data.mer);

    $("#syear").val(syear);
    $("#smonth").val(smonth);
    $("#sday").val(sday);

    $("#shour").val(shour);
    $("#smin").val(smin);
    $("#ssec").val(ssec);

    $("#timestamp").val(parseInt(timestamp) + 1);

}

function getHourAndMeridian(num) {
    data = { "mer": "AM", "hour": num };
    if (num > 12) {
        data.mer = "PM";
        data.hour = num - 12;
    }
    if (data.hour < 10) {
        data.hour = "0" + data.hour;
    }

    return data;
}


$(document).ready(function () {
    var timer = setInterval(function () { update_date() }, 1000);

    $("#time-in").click(function () {
        if ($("#time-in").hasClass("active")) {
            submit_timein();
        }
    });

    if($("#time-in").hasClass("active")){
        $("#time-out").addClass("hidden");
    }else{
        $("#time-in").addClass("hidden");
    }

    if ($("#time-in").hasClass("active") && $("#flexi").val() == 0) {
        console.log("active");
        $("#time_tracker_modal .modal-body p").html("<p style='font-weight:bold'>Please wait as we attempt to clock you in for your shift!</p>");
        $("#time_tracker_modal").modal("show");
        modal_backdrop_bypass();
        submit_timein();
    } else {
        message = $("#time_tracker_warning").html();
        console.log(message);
        

        if (typeof message != "undefined" && message.trim().length > 0) {
            $("#time_tracker_modal").modal("show");
            modal_backdrop_bypass();
        } else {
            if (!$("#time-out").hasClass("active") && $("#flexi").val() == 0) {
                if (document.referrer == "https://awesomeos.org/home/osnet_login") {
                    $("#time_tracker_modal .modal-body p").html("Welcome to OSnet,<br/><br/> Per our record you are <span style='color:red'>not scheduled to work</span> at this time. If this is wrong, please contact your TL or OSnet admin for schedule update.<br/><br/>Thanks");
                    $("#time_tracker_modal").modal("show");
                    modal_backdrop_bypass();
                }
            } else {
                console.log("clocked in");

            }
        }

    }



    $("#time-out").click(function () {
        if ($(this).hasClass("active")) {
            timestamp = $("#timestamp").val();
            timestamp_logout = $("#timestamp_time_out").val();
            submit = false;

            trackLate = parseInt($("#track-late").val());
            if ( timestamp_logout > timestamp ) {
                $("#time_tracker_undertime_modal").modal("show");
            } else {
                submit_timeout(timestamp, "");
            }
        }
    });

    $("#submit_undertime").click(function () {
        $("#time_tracker_undertime_modal").modal("hide");
        $("#time_tracker_undertime_form_modal").modal("show");
        modal_backdrop_bypass();
    });

    $("#submit_undertime_reason").click(function () {

        reason = $("#undertime_reason").val();
        timestamp = $("#timestamp").val();
        submit_timeout(timestamp, reason);
    });

    function submit_timeout(timestamp, reason) {
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/time_tracker_ajax/update',
            data: { "timestamp": timestamp, "reason": reason },
            success: function (data) {
                if (data.status == 1) {
                    $("#time-out").removeClass("active");
                    $("#time-out").addClass("inactive");
                    location.reload();
                } else {
                    $("#time_tracker_modal .modal-body p").html(data.message);
                    $("#time_tracker_modal").modal("show");
                    modal_backdrop_bypass();
                }
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    }

    function submit_timein() {
        $("#time-in").removeClass("active");
        $("#time-in").addClass("inactive");
        timestamp = $("#timestamp").val();
        date = $("#schedule_date").val();
        time_in_schedule = $("#time_in_schedule").val();
        time_out_schedule = $("#time_out_schedule").val();
        break_length_scheduled = $("#break_length_scheduled").val();
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/time_tracker_ajax/add',
            data: { timestamp: timestamp, date: date, time_in_schedule: time_in_schedule, time_out_schedule: time_out_schedule, break_length_scheduled: break_length_scheduled },
            success: function (data) {
                $("#time_tracker_modal .modal-body p").html(data.message);
                $("#time_tracker_modal").modal("hide");
                window.setTimeout(function () {
                    $("#time_tracker_modal").modal("show");
                    modal_backdrop_bypass();
                }, 500);

                if (data.status == 1) {
                    $("#time-out").removeClass("inactive");
                    $("#time-out").addClass("active");
                    if ($("#flexi").val() == 1) {
                        location.reload();
                    }
                } else {
                    $("#time-in").addClass("active");
                    $("#time-in").removeClass("inactive");
                }
            },
            error: function (jqXHR, textStatus) {
                $("#time-in").addClass("active");
                $("#time-in").removeClass("inactive");
                $("#time_tracker_modal").modal("hide");
                $("#time_tracker_modal .modal-body p").html("<p color='red'>An error has occured while trying to save your time-in! <br/>Please try again in a few minutes.</p>");
                window.setTimeout(function () {
                    $("#time_tracker_modal").modal("show");
                    modal_backdrop_bypass();
                }, 500);
            }
        });
    }

    ///////////////////////////////////////////////////////////////////
    function modal_backdrop_bypass() {
        $('.modal-backdrop').removeClass('in');
        window.setTimeout(function () {
            $('.modal-backdrop').remove();
        }, 500);
    }

});