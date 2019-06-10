$(document).ready(function() {
  let Infraction = {
    table: null
  };

  $('.insfractions_table').DataTable( {
      "pagingType": "full_numbers",
          "iDisplayLength": 25,
          "bSort" : false,
          "searching": false
    } );

  Infraction.table = $('.infractions_table').DataTable({
    'processing': true,
    'serverSide': true,
    'searching': false,
    'ajax': {
      url: $('.infractions_table').data('ajax-url'),
      data: function(data) {
        data.team = {
          id: $('#team_filter').val()
        };

        data.employee = {
          name: $('#employee_filter').val()
        }
      }
    },
    'order': [
      [0, 'asc']
    ],
    'columns': [{
        'name': 'name', 'data': 'name'
      }, {
        'name': 'team_name', 'data': 'team_name'
      }, {
        'name': 'incident_report_count', 'data': 'incident_report_count', 
        'createdCell': function (td, cellData, rowData, row, col) {
          $(td).addClass('center');
        }
      }, {
        'name': 'staff_notice_count', 'data': 'staff_notice_count', 
        'createdCell': function (td, cellData, rowData, row, col) {
          $(td).addClass('center');
        }
      }, {
        'name': 'probationary_letter_count', 'data': 'probationary_letter_count', 
        'createdCell': function (td, cellData, rowData, row, col) {
          $(td).addClass('center');
        }
      }, {
        'name': 'action',
        'orderable': false,
        'data': null,
        'render': function(data, type, row, meta) {
          let template = $('<div />').html($('script[type="text/template"]#template-infraction-list[name="row[action]"]').html());

            template.find('.add-infraction')
              .attr('id', row.u_id);

            template.find('.view-infraction')
              .attr('data-name', row.name)
              .attr('id', row.u_id);

          return template.html();
        },
        'createdCell': function (td, cellData, rowData, row, col) {
          $(td).addClass('center');
        },
      }
    ]
  });

  $(".infraction-date").inputmask("mm/dd/yyyy", {"placeholder": "mm-dd-yyyy"});
  $(".edit-infraction-date").inputmask("mm/dd/yyyy", {"placeholder": "mm-dd-yyyy"});


  $.ajax({
    type: "POST",
      url: site_url + 'index.php/ajax/infractions_ajax/getCurrentQuarterDate',
      success:function(data) {
        var d = $.parseJSON(data);
        $(".infraction-date-range").daterangepicker(
          {
            autoUpdateInput: false,
            locale: {
              format: 'MM-DD-YYYY'
            },
            startDate: d.start_date,
            endDate: d.end_date,
            opens: 'right'
          },
          rangeCallback
          ).val(d.start_date + ' - ' + d.end_date);
      }
  });


  function rangeCallback () {
      var date_range = $('.infraction-date-range').val();
      var user_id = $('input.user-id').val();
      view_infraction_ajax(user_id, date_range);
  }


  $(".infractions_table").on("click", ".add-infraction" , function(){
    $('#add-infraction-dialog input.infraction-user-id').val($(this).prop("id")); 
  });

  
  $('.applyBtn').click(function(){
    
    var user_id = $('input.user-id').val();
    var date_start = $(".daterangepicker_start_input input").val();
    var date_end = $(".daterangepicker_end_input input").val();
    
    $.ajax({
    
        type: "POST",
				url: site_url + 'index.php/ajax/infractions_ajax/getEmployeeInfractionCountCustomDateRange',
				data: {user_id:user_id, date_start:date_start, date_end:date_end}, 
				success:function(data) {

          var quarterly_infraction_count_custom = $.parseJSON(data);
          var res = '<tr><th>Infraction Type</th><th>Date</th></tr>';
          
          if(typeof quarterly_infraction_count_custom.firstname != 'undefined'){
          
            /*$(".total-infractions2").text(quarterly_infraction_count_custom.infractions_count);
            $(".total-unexcused-absences2").text(quarterly_infraction_count_custom.unexcused_absence_count);
            $(".total-excused-absences2").text(quarterly_infraction_count_custom.excused_absence_count);
            $(".total-ncns2").text(quarterly_infraction_count_custom.ncns_count);
            $(".total-no-notifications2").text(quarterly_infraction_count_custom.no_notification_count);
            $(".total-lates2").text(quarterly_infraction_count_custom.late_count);
            */
            $(".total-incident-report2").text(quarterly_infraction_count_custom.incident_report_count);
            $(".total-staff-notice2").text(quarterly_infraction_count_custom.staff_notice_count);
            $(".total-probationary-letter2").text(quarterly_infraction_count_custom.probationary_letter_count);
            
          } else {
          
            $('table.quarterly_infractions2').empty();
            $('table.quarterly_infractions2').append(res);
            /*$(".total-infractions2").text();
            $(".total-unexcused-absences2").text();
            $(".total-excused-absences2").text();
            $(".total-ncns2").text("0");
            $(".total-no-notifications2").text();
            $(".total-lates2").text();*/
            $(".total-incident-report2").text();
            $(".total-staff-notice2").text();
            $(".total-probationary-letter2").text();
          
          }
          
        }
    
    });
    
    $.ajax({
    
        type: "POST",
				url: site_url + 'index.php/ajax/infractions_ajax/getEmployeeInfractionListCustomDateRange',
				data: {user_id:user_id, date_start:date_start, date_end:date_end}, 
				success:function(data) {

          var quarterly_infractions_list_custom = $.parseJSON(data);
          var res = '';
          
          if(typeof quarterly_infractions_list_custom != 'undefined'){
          

            for(var i = 0; i<quarterly_infractions_list_custom.length; i++){
            
              res = res + '<tr>' +
                            '<td>' + quarterly_infractions_list_custom[i].name +'</td>' +
                            '<td>' + quarterly_infractions_list_custom[i].date +'</td>' +
                          '</tr>';
            }
            
            $('table.quarterly_infractions2 tr').after(res);
            
            
          } else {
            $('table.quarterly_infractions2').empty();
            $('table.quarterly_infractions2').append(res);
          }
        }
    });
  });

  function view_infraction_ajax(user_id){
      $.ajax({
        type: "POST",
        url: site_url + 'index.php/ajax/infractions_ajax/getEmployeeInfractionList',
        data: {
          user_id:user_id
        }, 
        beforeSend:function(){
          $.ajax({  
              type: "POST",
              url: site_url + 'index.php/ajax/infractions_ajax/getInfractionCount',
              data: {
                user_id:user_id
              }, 
              beforeSend:function(data) {

                $(".total-incident-report").text(0);
                $(".total-staff-notice").text(0);
                $(".total-probationary-letter").text(0);

              },
              success:function(data) {
                var quarterly_infractions = $.parseJSON(data);
                
                if(quarterly_infractions){
                  $(".total-incident-report").text(quarterly_infractions.incident_report_count);
                  $(".total-staff-notice").text(quarterly_infractions.staff_notice_count);
                  $(".total-probationary-letter").text(quarterly_infractions.probationary_letter_count);  
                } 
              }
          });
          
          $('table.quarterly_infractions2 ').html('');
        },
        success:function(data) {
          $('table.quarterly_infractions2').html(data);
        }
    });

  }


  $(".infractions_table").on("click", ".view-infraction" , function(){
    var user_id = $(this).attr("id");
    $('input.user-id').val(user_id);
    $("#employee_name").text($(this).data('name'));
    view_infraction_ajax(user_id);
  });


  $("#view-infraction-dialog").on("click", ".edit-infraction" , function(){
    var infraction_id = $(this).data("id");

    $.ajax({
      type: "POST",
      url: site_url + 'index.php/ajax/infractions_ajax/getInfraction',
      data: {
        infraction_id:infraction_id
      },
      beforeSend:function() {
        $('#view-infraction-dialog').modal('hide');
      },
      success:function(data) {
        var res = $.parseJSON(data);
        $('#full_name').text(res.full_name);
        $('.edit-infraction-date').val(res.date);
        $('.edit-infraction-type option[value=' + res.infraction_type_id + ']').prop("selected", true);
        $('.edit-offense-type option[value=' + res.infraction_offense_type_id + ']').prop("selected", true);
        $('.edit-infraction-details').val(res.details);
        $('#btn-edit-infraction').data('id', res.infraction_id);
        $('#edit-infraction-dialog').modal('show');
      }
    });

    return false;
  });


  $("#edit-infraction-dialog").on("click", "#btn-edit-infraction" , function(){
    var infraction_id = $(this).data("id");
    var date = $('.edit-infraction-date').val();
    var infraction_type = $('.edit-infraction-type').val();
    var offense_type =  $('.edit-offense-type').val();
    var details = $('.edit-infraction-details').val();
    $.ajax({
      type: "POST",
      url: site_url + 'index.php/ajax/infractions_ajax/editInfraction',
      data: {
        infraction_id:infraction_id,
        date:date,
        infraction_type:infraction_type,
        offense_type:offense_type,
        details:details
      },
      success:function() {
        location.reload();
      }
    });
    return false;
  });


  $("#view-infraction-dialog").on("click", ".delete-infraction" , function(){
    var infraction_id = $(this).data("id");
    $('#btn-delete-infraction').data('id', infraction_id);
    $('#delete-infraction-dialog').modal('show');
    return false;
  });


  $("#delete-infraction-dialog").on("click", "#btn-delete-infraction" , function(){
    var infraction_id = $(this).data("id");

    $.ajax({
      type: "POST",
      url: site_url + 'index.php/ajax/infractions_ajax/deleteInfraction',
      data: {
        infraction_id:infraction_id
      },
      success:function() {
        location.reload();
      }
    });
    return false;
  });


  /**
  $('.btn-danger').click(function(){
  
    var res = '<tr><th>Infraction Type</th><th>Date</th></tr>';
  
    $('table.quarterly_infractions').empty();
    $('table.quarterly_infractions').append(res);
    $('table.quarterly_infractions2').empty();
    $('table.quarterly_infractions2').append(res);
    
    $(".total-incident-report").text("0");
    $(".total-staff-notice").text("0");
    $(".total-probationary-letter").text("0");
    
    $(".total-incident-report2").text("0");
    $(".total-staff-notice2").text("0");
    $(".total-probationary-letter2").text("0");
    
    
  });
   */
  
  $('#add-infraction-dialog .btn-primary').click(function(){

		var user_id = $.trim( $('#add-infraction-dialog .infraction-user-id').val());
		var date = $.trim( $('.infraction-date').val());
		var infraction_type = $.trim( $('.infraction-type').val());
		var offense_type = $.trim( $('.offense-type').val());
		var details = $.trim( $('.infraction-details').val());
    var department = $('#department_filter').val();
    var team = $('#team_filter').val();

		var err = "";
		if (!user_id) 			err += '<p>No User ID Error. Please contact OSNET developer! :)</p>';
		if (!date) 	err += '<p>There should be a Date</p>';
		if (infraction_type == 0) 	err += '<p>Select Infraction Type</p>';
		if (offense_type == 0) 	err += '<p>Select Offense Type</p>';
		$("#add_infraction_errors").html(err);

		if(user_id && date && infraction_type && offense_type){
			$.ajax({
				type: "POST",
				url: site_url + 'index.php/ajax/infractions_ajax/add',
				data: {user_id:user_id, date:date, infraction_type:infraction_type, details:details, offense_type:offense_type}, 
				success:function(data) {
					window.location.href= site_url + 'infraction/osnet_infraction_list/'+department+'/'+team;
				}
			});
		}

	});


  $('#add-offense-type-dialog .btn-danger').click(function(){
    $('#add-offense-type-dialog .offense-name').val("");
  });



  $('#add-offense-type-dialog .btn-primary').click(function(){
    //declarations
    var offense_type_name = $.trim($('#add-offense-type-dialog .offense-name').val());
    //validation
    var err = "";
	if (!offense_type_name)
    err += '<p>Set offense type name.</p>';
		$("#add_offense_type_errors").html(err);
    

		if(offense_type_name){
			$.ajax({
				type: "POST",
				url: site_url + 'index.php/ajax/infractions_ajax/add_offense_type',
				data: {offense_type_name:offense_type_name,}, 
				success:function(data) {
          $('#add-offense-type-dialog .offense-name').val("");
					$("#add-offense-type-dialog").modal('hide');
				}
			});
		}
  
  });
  
	$('#department_filter').change(function(){
    var department_id = $('#department_filter').val();
        department_id = (typeof department_id === "undefined") ? 0 : department_id;
    
    window.location.href = site_url + 'infraction/osnet_infraction_list/' + department_id + '/0/';
    // Infraction.table.ajax.reload();
  });
	
	
	$('#team_filter').change(function(){
    var department_id = $('#department_filter').val();
        department_id = (typeof department_id === "undefined") ? 0 : department_id;
		
    var team_id = $('#team_filter').val();
		window.location.href = site_url + 'infraction/osnet_infraction_list/' + department_id + '/'+team_id+'/'; 
    
    // Infraction.table.ajax.reload();
  });
  
  //var delayTimer;

  $('#employee_filter').keypress(function(event) {
      //var employee_name = $('#employee_filter').val();
    //   var department_id = $('#department_filter').val();
    //   var team_id = $('#team_filter').val();
    //   department_id = (typeof department_id === "undefined") ? 0 : department_id;

    // if(employee_name.length > 0) {
    //   clearTimeout(delayTimer);
    //   delayTimer = setTimeout(function() {
    //     $.ajax({
    //       type: "POST",
    //       url: site_url + 'index.php/ajax/infractions_ajax/search_employee_name',
    //       data: { employee_name: employee_name, department_id: department_id, team_id: team_id},
    //       success:function(data){
    //         var infraction_list = $.parseJSON(data);
    //         $('.infractions_table').DataTable().destroy();
    //         $('.infractions_table tbody').html('');

    //         var res = '';
    //         for(var i = 0; i<infraction_list.length; i++){

    //             res = res + '<tr>' +
    //                 '<td>' + infraction_list[i].name + '</td>' +
    //                 '<td>' + infraction_list[i].department + '</td>' +
    //                 '<td class="center">' + infraction_list[i].incident_report_count + '</td>' +
    //                 '<td class="center">' + infraction_list[i].staff_notice_count + '</td>' +
    //                 '<td class="center">' + infraction_list[i].probationary_letter_count + '</td>' +
    //                 '<td class="center">';
    //             if ($('#is_account_manager').val() != "1")
    //                 res = res + '<strong><a href="#add-infraction-dialog" class="add-infraction"  id="' + infraction_list[i].u_id + '" data-name="' + infraction_list[i].name + '" data-toggle="modal" data-target="#add-infraction-dialog" style="white-space: nowrap"><i class="fa fa-gavel fa-1x"></i> Add </a></strong> <span> | </span>';

    //             res = res + '<strong><a href="#view-infraction-dialog" class="view-infraction" id="' + infraction_list[i].u_id + '" data-name="' + infraction_list[i].name + '" data-toggle="modal" data-target="#view-infraction-dialog" style="white-space: nowrap"> <i class="fa fa-file-text-o fa-1x"></i> View</a></strong>'
    //               +  '</td>' +
    //               '</tr>';
    //         }

    //         $('.infractions_table thead').after('<tbody>' + res + '</tbody>');

    //         $('.infractions_table').DataTable( {
    //             "pagingType": "full_numbers",
    //               "iDisplayLength": 25,
    //               "bSort" : false,
    //               "searching": false
    //         });

    //       }
    //     });
    //   }, 500);
    //}
    
    if (event.which == 13) {
      $('#department_filter, #team_filter').val(0);
      Infraction.table.ajax.reload();
    }

  });
  
  function change_infraction_list(){
  
    var department_id = $('#department_filter').val();
    var team_id = $('#team_filter').val();
    var limit = 5;
	
	$.ajax({
      type: 'POST',
      url: site_url + 'index.php/ajax/infractions_ajax/get_infraction_list_filter',
      data: {department_id:department_id, limit:limit, team_id:team_id},
      success:function(data){
        
        var infraction_list = $.parseJSON(data);

        $('table.infractions_table tbody').empty();
        
        var res = '';
        for(var i = 0; i<infraction_list.length; i++){
          
          res = res + '<tr>' +
                        '<td>' + infraction_list[i].department + '</td>' +
                        '<td>' + infraction_list[i].name + '</td>' +
                        '<td>' + infraction_list[i].incident_report_count +'</td>' +
                        '<td>' + infraction_list[i].staff_notice_count +'</td>' +
                        '<td>' + infraction_list[i].probationary_letter_count +'</td>' +
                        '<td>' +
                          '<a href="#add-infraction-dialog" class="btn btn-success btn-flat add-infraction"  id="' + infraction_list[i].u_id + '" data-toggle="modal" data-target="#add-infraction-dialog" style="white-space: nowrap" class="add-infraction"><i class="fa fa-plus fa-1x"></i></a> ' +
                          '<a href="#view-infraction-dialog" class="btn btn-danger btn-flat view-infraction" id="' + infraction_list[i].u_id + '" data-toggle="modal" data-target="#view-infraction-dialog" style="white-space: nowrap" class="view-infraction"> <i class="fa fa-eye fa-1x"></i></a>'
                     +  '</td>' +
                      '</tr>';
        }
          
        $('.infractions_table thead').after('<tbody>' + res + '</tbody>');
      }
    });
  
  }
  
});