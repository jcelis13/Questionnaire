$(document).ready(function() {

  var EvaluationCountDownApp = {};

  // Run evaluation countdown app.
  EvaluationCountDownApp.runApp = function() {
    EvaluationCountDownApp.ajaxFetchCurrentServerDate();
  };

  // Fetch current server time from server.
  EvaluationCountDownApp.ajaxFetchCurrentServerDate = function() {
    $.ajax({
      type: "POST",
      url: globalAppVariables.site_url + "ajax/admin_dashboard_ajax/fetch_server_time",
      success: function(response) {
        var server_date = jQuery.parseJSON(response).split('/');
        var year = server_date[0], month = server_date[1];

        EvaluationCountDownApp.checkEvaluationSchedule(year, month);
      }
    });
  };

  // Set countdown timer.
  EvaluationCountDownApp.setEvaluationCountDownTimer = function(target_date) {
    // target_date = yyyy/mm/dd
    $("#assessment-countdown").countdown(target_date, function(event) {
      var $this = $(this).html(event.strftime(''
       + '<strong><span>%-w</span> week%!w '
       + '<span>%-d</span> day%!d '
       + '<span>%H</span> hr '
       + '<span>%M</span> min '
       + '<span>%S</span> sec</strong>'));
    });
  };

  // Check valid evaluation months.
  EvaluationCountDownApp.checkEvaluationSchedule = function(year, month) {
    switch(parseInt(month)) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        EvaluationCountDownApp.setEvaluationCountDownTimer(year + "/06/01");
        break;
      case 6: // June
        $("#event-icon").html('<i class="fa fa-child"></i>');
        $('.small-box-title').html("Event");
        $('#timer-anchor').html('Check Assessment <i class="fa fa-arrow-circle-right">').attr('href', site_url + 'evaluation/employee_evaluation');
        break;
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
        EvaluationCountDownApp.setEvaluationCountDownTimer(year + "/12/01");
        break;
      case 12: // December
        $("#event-icon").html('<i class="fa fa-child"></i>');
        $('.small-box-title').html("Event");
        $('#timer-anchor').html('Check Assessment <i class="fa fa-arrow-circle-right">').attr('href', site_url + 'evaluation/employee_evaluation');
        break;
      default:
        
        break;
    }
  };

  EvaluationCountDownApp.runApp();

});