$(document).ready(function() {
	var GLOBAL_URL_ = document.URL;

    $('#leave_stats_duration').daterangepicker();

	// $('#leave_list_table').DataTable( {
	// 	"pagingType": "full_numbers",
	// 	"iDisplayLength": 25,
	// 	"bSort" : false
	// } );

	let Leave = {
		List: {
			table: null
		}
	}

	Leave.List.table = $('#leave_list_table').DataTable({
		'processing': true,
	    'serverSide': true,
	    'searching': false,
	    'bSort': false,
	    'pageLength': 100,
	    'language': {
	    	'processing': '<span class="fa fa-spinner fa-pulse"></span> Loading, please wait&hellip;'
	    },
	    'ajax': {
      		url: $('#leave_list_table').data('ajax-url'),
      		data: function(data) {
				if ($('#leave_department').length) {
					data.department = {
						id: $('#leave_department').val()
					}
				}

				if ($('#leave_list_team').length) {
					data.team = {
						id: $('#leave_list_team').val()
					};
				}

				data.date = $('#leave_range_duration').val();

				data.employee = {
					name: $('#leave_list_search').val()
				}

				data.status = $('#leave_status').val()
			},
			'dataSrc': function (json) {
	       		if ($('#leave_list_team').length && json.teams.length) {
	       			let selected = $('#leave_list_team').val();

	       			$('#leave_list_team').html($('<option />').attr('value', 0).text('-- Select all --'));

	       			let teams = json.teams;

	       			$.each(json.teams, function(index, team) {
	       				$('#leave_list_team').append($('<option />').attr('value', team.team_id).text(team.team_name));
	       			});

	       			selected = ($('#leave_list_team option[value="' + selected + '"]').length) ? selected : 0;
	       			$('#leave_list_team').val(selected);
	       		}

	       		return json.data;
	        }
		},
		'columns': [
			{
				'name': 'applicant', 'data': 'applicant',
				'createdCell': function (td, cellData, rowData, row, col) {
	          		//$(td).addClass('center');
		        }
			},
			{
				'name': 'teams', 'data': 'teams',
				render: function (data, type, row, meta) {
					let teams = data.split(';');

                    let string = teams.shift();

                    if (teams.length) {
                        let count = teams.length;
                        let title = teams.join('<br />');

                        string += ' and <a href="#" data-toggle="tooltip" data-placement="top" data-html="true" title="'+title+'" class="more">' + count + ' more</a>';
                    }

                    return string;
				},
				'createdCell': function (td, cellData, rowData, row, col) {
	          		//$(td).addClass('center');
		        }
			},
			{
				'name': 'date_of_leave', 'data': 'date_of_leave',
				'createdCell': function (td, cellData, rowData, row, col) {
	          		$(td).addClass('center');
		        }
			},
			{
				'name': 'reason', 'data': 'reason',
			},
			{
				'name': 'status', 'data': null,
				'createdCell': function (td, cellData, rowData, row, col) {
		        	$(td).addClass('center');
		        },
				'render': function(data, type, row, meta) {
					let span = $('<span />').addClass('label');

					switch(row.status.toLowerCase()) {
						case 'approved':
							span.addClass('label-success');
							break;

						case 'pending':
							span.addClass('label-warning');
							break;

						case 'denied':
							span.addClass('label-danger');
							break;

						default:
							span.addClass('label-primary');
							break;
					}

					span.text(row.status);

					return $('<div />').append(span).html();
				}
			},
			{
				'name': 'date_recorded', 'data': 'date_recorded',
				'createdCell': function (td, cellData, rowData, row, col) {
	          		$(td).addClass('center');
		        }
			},
			{
				'name': 'action', 'data': null,
				'createdCell': function (td, cellData, rowData, row, col) {
		        	$(td).addClass('center');
		        },
				'render': function(data, type, row, meta) {
					let template = $('<div />').html($('script[type="text/template"]#template-leave-list[name="row[action]"]').html());

					template.find('.btn_view_leave').attr('data-id', row.leave_id);

					if (row.status.toLowerCase() == 'pending') {
						template.find('.btn_view_leave strong').addClass('text-yellow');
					}

					return template.html();
				}
			}
		]
	});

	$('#leave_stat_table').DataTable( {
		"pagingType": "full_numbers",
		"iDisplayLength": 25,
		"bSort" : false,
		'searching': false
	} );


	function check_leave_err(leave_nature, leave_reason, leave_total_days){
		var validation_string = "";

		if (leave_nature == 0 || !leave_reason || leave_total_days == 0){
			if(leave_total_days == 0)
				validation_string += "0 days of leave applied. Please check duration and exclusion of date.\n";
			if (leave_nature == 0 || !leave_reason)
				validation_string += "Please make sure all fields are correctly filled up.\n";

			return validation_string;
		}
		else
			return false;
	}


	$('#submit_button').click(function() {
		var user_id 		= $('#leave_user_id').val();
		var gender 			= $('#gender').val();
		var marital_status 	= $('#marital_status').val();
		var paid_leave 		= $('#leave_paid_leave').val();
		var pl_display 		= $('#pl_display').val();
		var leave_nature 	= $('#leave_nature').val();
		var leave_duration 	= $('#leave_duration').val();
		var leave_total_days= $('#leave_total_days').text();
		var exclude_date    = $('#exclude_date_duration').val();
		var leave_reason 	= $('#leave_reason').val();

		var check = check_leave_err(leave_nature, leave_reason, leave_total_days);
		if (check){
			$('#validation_error').html(check.replace(/\n/g, '<br />'));
			$('#leave_apply_success').hide();
			$('#leave_apply_validation').show();
		}
		else{
			$('#leave_apply_validation').hide();
			var leave_nature_arr = ['Bereavement', 'Paternity', 'Maternity', 'Preventive Suspension', 'Offsite', 'Suspension'];

			$.ajax({
				type: "POST",
				url: site_url + 'ajax/leave_ajax/check_leave_credits',
				data: {
					user_id :user_id
				},
				success:function (data){
					var pl_display = data ;

			if( parseInt(leave_total_days, 10) > parseInt(pl_display , 10 ) &&  jQuery.inArray(leave_nature, leave_nature_arr ) == -1){
				$('#confirm_apply_leave').modal('show');
						$('.pl-display').text(pl_display);
			}
			else if(gender == 1 && marital_status == 1 && leave_nature == "Paternity"){
				$('#err_paternal').modal('show');
			}
			else if(parseInt(leave_total_days, 10) > 78 && leave_nature == "Maternity"){
				$('#err_maternal').modal('show');
			}
			else if(parseInt(leave_total_days, 10) > 3 && leave_nature == "Bereavement"){
				$('#err_bereavement').modal('show');
			}
			else{
				var color = $('#excluded_days').css("color");
				if(color != "rgb(255, 0, 0)" || $("#exclude_date_wrapper").is(":hidden")){
					$.ajax({
						type: "POST",
						url: site_url + 'ajax/leave_ajax/check_duplicate',
						data: {
							user_id 		:user_id,
							leave_duration  :leave_duration
						},
						success:function (data){
							var parsedata = jQuery.parseJSON( data );
							if(parsedata == true){
								var validation_string = "Duplicate leave application detected. Please enter a different duration.";
								$('#validation_error').html(validation_string.replace(/\n/g, '<br />'));
								$('#leave_apply_validation').show();
								$("#add_submit").prop("disabled", false);
							}
							else{
								$("#submit_button").prop("disabled",true);
								$("#submit_button").html("<i class='fa fa-send'></i> Application Sent");

								if($("#excluded_days").text() != ""){
									leave_reason = "(Excluded:" + exclude_date + ") " + leave_reason;
								}
								else
									exclude_date = null;

								$.ajax({
									type: "POST",
									url: site_url + 'ajax/leave_ajax/apply_leave',
									data: {
										user_id			:user_id,
										leave_nature	:leave_nature,
										leave_duration	:leave_duration,
										leave_total_days:leave_total_days,
										leave_reason	:leave_reason,
										paid_leave		:paid_leave,
										exclude_date    : exclude_date,
										from			:'member'
									},
									success:function (data){
										var pdata = jQuery.parseJSON( data );
										$('.pl-display').text(pdata);
										$('#leave_apply_success').show();
									}
								});
							}
						}
					});
				}
			}
		}
	});
		}
	});


	$('#add-leave-application-modal').on("click", "#add_submit", function() {
		var name 			= $(this).data('name');
		var user_id 		= $(this).data('id');
		var usersId 		= $('#usersId').val(); //user_id sa nag gamit
		var leave_nature 	= $('#admin_leave_nature').val();
		var leave_duration 	= $('#admin_leave_duration').val();
		var leave_total_days= $('#admin_leave_total_days').text();
		var leave_reason 	= $('#admin_leave_reason').val();
		var exclude_date = $('#admin_exclude_date_duration').val();

		if ($('#markunpaid').prop('checked'))
			var unpaid = 'true';
		else
			var unpaid = 'false';

		var check = check_leave_err(leave_nature, leave_reason, leave_total_days);
		if (check){
			$('#validation_error').html(check.replace(/\n/g, '<br />'));
			$('#leave_validation').show();
		}
		else{
			var color = $('#excluded_days').css("color");
			if(color != "rgb(255, 0, 0)" || $("#exclude_date_wrapper").is(":hidden")){
				$("#add_submit").prop("disabled",true);
				$.ajax({
					type: "POST",
					url: site_url + 'ajax/leave_ajax/check_duplicate',
					data: {
						user_id 		:user_id,
						leave_duration  :leave_duration
					},
					success:function (data){
						var parsedata = jQuery.parseJSON( data );
						if(parsedata == true){
							var validation_string = "Duplicate leave application detected. Please enter a different duration.";
							$('#validation_error').html(validation_string.replace(/\n/g, '<br />'));
							$('#leave_validation').show();
							$("#add_submit").prop("disabled", false);
						}
						else{
							if($("#excluded_days").text() != ""){
								leave_reason = "(Excluded:" + exclude_date + ") " + leave_reason;
							}
							else
								exclude_date = null;
							$.ajax({
								type: "POST",
								url: site_url + 'ajax/leave_ajax/add_leave',
								data: {
									user_id			:user_id,
									usersId			:usersId,
									leave_nature	:leave_nature,
									leave_duration	:leave_duration,
									leave_total_days:leave_total_days,
									leave_reason	:leave_reason,
									exclude_date 	:exclude_date,
									unpaid			: unpaid
								},
								complete:function (data){
									var name = $(this).data('name');
									$.ajax({
										type: "POST",
										url: site_url + 'ajax/leave_ajax/stat_view_list',
										data: {id:user_id},
										success		:function(data) {
											$("#view_list_table").html("");
											$("#view_list_table").append(data);

										},
										complete	:function() {
											$('#add-leave-application-modal').modal('hide');
										}
									});
								}
							});
						}// end else
					}
				});
			}//end else color
		}
	});


	$('#apply_leave_continue').click(function() {
		var user_id 		= $('#leave_user_id').val();
		var paid_leave 		= $('#leave_paid_leave').val();
		var leave_nature 	= $('#leave_nature').val();
		var leave_duration 	= $('#leave_duration').val();
		var leave_total_days= $('#leave_total_days').text();
		var exclude_date_duration = $('#exclude_date_duration').val();
		var leave_reason 	= $('#leave_reason').val();

		var color = $('#excluded_days').css("color");
		if(color != "rgb(255, 0, 0)" || $("#exclude_date_wrapper").is(":hidden")){
			$("#submit_button").prop("disabled",true);
			$("#submit_button").html("<i class='fa fa-send'></i> Application Sent");
			if($("#excluded_days").text() != ""){
				var exclude_date_duration = $('#exclude_date_duration').val();
				leave_reason = "(Excluded:" + exclude_date_duration + ") " + leave_reason;
			}
			$.ajax({
				type: "POST",
				url: site_url + 'ajax/leave_ajax/apply_leave',
				data: {
					user_id			:user_id,
					leave_nature	:leave_nature,
					leave_duration	:leave_duration,
					leave_total_days:leave_total_days,
					leave_reason	:leave_reason,
					paid_leave		:paid_leave,
					from			:'member'
				},
				success:function (data){
					$('#confirm_apply_leave').modal('hide');
					var pdata = jQuery.parseJSON( data );
					$('.pl-display').text(pdata);
					$('#leave_apply_success').show();
				}
			});
		}

	});


	//admin apply leave
	$('#admin_submit_button').click(function() {
		var user_id 		= $(this).data('id');
		var paid_leave 		= $('#admin_paid_leave').text();
		var leave_nature 	= $('#admin_leave_nature').val();
		var leave_duration 	= $('#admin_leave_duration').val();
		var leave_total_days= $('#admin_leave_total_days').text();
		var leave_reason 	= $('#admin_leave_reason').val();

		var validation_string = "";
		if (leave_nature == 0 || leave_duration == "" || leave_reason == ""){
			if(leave_nature == 0)
				validation_string += "Nature field is required.\n";
			if(leave_duration == "")
				validation_string += "Duration field is required.\n";
			if(leave_reason == "")
				validation_string += "Reason field is required.";

			$('#admin_validation_error').html(validation_string.replace(/\n/g, '<br />'));
			$('#admin_leave_apply_success').hide();
			$('#admin_leave_apply_validation').show();
		}
		else{
			$('#admin_apply_leave_continue').data('id', user_id);
			$('#admin_leave_apply_validation').hide();
			if (parseInt(leave_total_days , 10 ) > parseInt(paid_leave , 10 )){
				$('#admin_confirm_apply_leave').modal('show');
			}
			else{
				$.ajax({
					type: "POST",
					url: site_url + 'ajax/leave_ajax/apply_leave',
					data: {
						user_id			:user_id,
						leave_nature	:leave_nature,
						leave_duration	:leave_duration,
						leave_total_days:leave_total_days,
						leave_reason	:leave_reason,
						paid_leave		:paid_leave,
						from			:'admin'
					},
					success:function (data){
						$('#admin_leave_apply_success').show();
						$("#admin_submit_button").prop("disabled",true);
					}
				});

			}
		}

	});


	$('#admin_apply_leave_teams').change( function() {
		var leave_teams_selected = $('#admin_apply_leave_teams').val();

		if (GLOBAL_URL_.indexOf('os_admin_apply_leave') > -1)  {
			window.location.href= site_url + 'leave/os_admin_apply_leave/' + leave_teams_selected;
		} else {
			window.location.href= site_url + 'leave/admin_apply_leave/' + leave_teams_selected;
		}

	});


	$("#admin_apply_leave_search").on("keyup", function() {
		var search_key = $.trim($("#admin_apply_leave_search").val());

		if(search_key.length > 0){
			$.ajax({
				type: "POST",
				url:  site_url + "ajax/leave_ajax/admin_search",
				data: {search_key:search_key},
				success:function (data){
					$(".table").html("");
					$(".table").append(data);
				}
			});
		}
	});


	$("#leave_stat_search").keypress(function(e) {
		if(e.which == 13) {
	    	var search_key = $.trim($("#leave_stat_search").val());

			if(search_key.length > 0) {
				$.ajax({
					type: "POST",
					beforeSend: function() {
						$("#leave_stat_department").val($("#leave_stat_department option:first").val());
						$("#leave_stat_team").val($("#leave_stat_team option:first").val());
					},
					url:  site_url + "ajax/leave_ajax/leave_stat_search",
					data: {search_key:search_key},
					success:function (data){
						$('#leave_stat_table').DataTable().destroy();
						$("#leave_stat_table").html('');
						$("#leave_stat_table").html(data);
						$('#leave_stat_table').DataTable( {
							"pagingType": "full_numbers",
							"iDisplayLength": 20,
							"bSort" : false,
							'searching': false
						} );
					}
				});
			}

			return false;
		}
	});


	$("#leave_list_search").keypress(function(e) {
		if(e.which == 13) {
			Leave.List.table.ajax.reload();
			// var search_key = $.trim($("#leave_list_search").val());

			// if(search_key.length > 0){
			// 	$.ajax({
			// 		type: "POST",
			// 		url:  site_url + "ajax/leave_ajax/leave_list_search",
			// 		data: {search_key:search_key},
			// 		success:function (data){
			// 			$('#leave_list_table').DataTable().destroy();
			// 			$("#leave_list_table").html('');
			// 			$("#leave_list_table").html(data);
			// 			$('#leave_list_table').DataTable( {
			// 				"pagingType": "full_numbers",
			// 				"iDisplayLength": 20,
			// 				"bSort" : false
			// 			} );
			// 		}
			// 	});
			// }
			// return false;
		}
	});


	$('#admin_apply_leave_continue').click(function() {
		var user_id 		= $(this).data('id');
		var paid_leave 		= $('#admin_paid_leave').text();
		var leave_nature 	= $('#admin_leave_nature').val();
		var leave_duration 	= $('#admin_leave_duration').val();
		var leave_total_days= $('#admin_leave_total_days').text();
		var leave_reason 	= $('#admin_leave_reason').val();

		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/apply_leave',
			data: {
				user_id			:user_id,
				leave_nature	:leave_nature,
				leave_duration	:leave_duration,
				leave_total_days:leave_total_days,
				leave_reason	:leave_reason,
				paid_leave		:paid_leave,
				from			:'admin'
			},
			success:function (data){
				$('#admin_confirm_apply_leave').modal('hide');
				$('#admin_leave_apply_success').show();
				$("#admin_submit_button").prop("disabled",true);
			}
		});

	});


	$('#manage_leave_notif_table').on("click", ".assign_manage_leave_click", function() {
		var team_id = $(this).data('id');
		var team_name = $(this).data('team');
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/assign_leave_notif_view',
			data: {
				team_id:team_id
			},
			beforeSend:function (){
				$('#manage_leave_team_id').val(team_id);
				$('#search_assign_leave_notif').val("");
				$("#search_assign_leave_notif_table").html("");
				$('#manage_leave_notif_team').text(team_name);
			},
			success:function (data){
				$("#assigned_employee").html(data);
				$('#assign_manage_leave_modal').modal('show');
			}
		});

	});


	$('#assign_manage_leave_modal').on("keyup", "#search_assign_leave_notif", function() {
		var search_key = $.trim($("#search_assign_leave_notif").val());
		if(search_key.length > 0){
			$.ajax({
				type: "POST",
				url:  site_url + "ajax/leave_ajax/leave_notif_search",
				data: {search_key:search_key},
				success:function (data){
					$("#search_assign_leave_notif_table").html("");
					$("#search_assign_leave_notif_table").append(data);
				}
			});
		}

	});


	$('#assign_manage_leave_modal').on("click", ".assign_manage_leave", function() {
		var user_id = $(this).data('id');
		var team_id = $('#manage_leave_team_id').val();

		$.ajax({
			type: "POST",
			url:  site_url + "ajax/leave_ajax/assign_manage_leave",
			data: {user_id:user_id, team_id:team_id},
			success:function (data){
				$.ajax({
					type: "POST",
					url: site_url + 'ajax/leave_ajax/assign_leave_notif_view',
					data: {team_id:team_id},
					success:function (data){
						$("#assigned_employee").html('');
						$("#assigned_employee").html(data);
					},
					complete:function (data){
						/**
						$('#manage_leave_notif_table').DataTable().destroy();
	                    $('#manage_leave_notif_table').html('');
	                    $('#manage_leave_notif_table').html(data);

	                    $('#manage_leave_notif_table').DataTable( {
	                        "pagingType": "full_numbers",
	                        "iDisplayLength": 40
	                    } );
						*/
					}
				});
			}
		});

	});


	$('#assign_manage_leave_modal').on("click", ".remove_manage_leave", function() {
		var lnid = $(this).data('lnid');
		var team_id = $('#manage_leave_team_id').val();
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/remove_leave_notif',
			data: {lnid:lnid},
			success:function (data){
				$.ajax({
					type: "POST",
					url: site_url + 'ajax/leave_ajax/assign_leave_notif_view',
					data: {team_id:team_id},
					success:function (data){
						$("#assigned_employee").html('');
						$("#assigned_employee").html(data);
					},
					complete:function (data){
						/**
						$('#manage_leave_notif_table').DataTable().destroy();
	                    $('#manage_leave_notif_table').html('');
	                    $('#manage_leave_notif_table').html(data);

	                    $('#manage_leave_notif_table').DataTable( {
	                        "pagingType": "full_numbers",
	                        "iDisplayLength": 40
	                    } );
						*/
					}
				});

			}
		});

	});


	$('#assign_manage_leave_modal').on("click", "#manage_leave_back", function() {
		$('#assign_manage_leave_modal').modal('hide');
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/manage_leave_notif_view',
			data: {},
			success:function (data){
				$('#manage_leave_notif_table').DataTable().destroy();
                $('#manage_leave_notif_table').html('');
                $('#manage_leave_notif_table').html(data);


                $('#manage_leave_notif_table').DataTable( {
                    "pagingType": "full_numbers",
                    "iDisplayLength": 40
                } );
			}
		});

	});


	$('#assign_manage_leave_modal').on("click", "#set_defaultleave_notif", function() {
		var team_id = $('#manage_leave_team_id').val();

		$('#assign_manage_leave_modal').modal('hide');
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/set_defaultleave_notif',
			data: {team_id:team_id},
			success:function (data){
				$('#assign_manage_leave_modal').modal('hide');
				$.ajax({
					type: "POST",
					url: site_url + 'ajax/leave_ajax/manage_leave_notif_view',
					data: {},
					success:function (data){
						$('#manage_leave_notif_table').DataTable().destroy();
	                    $('#manage_leave_notif_table').html('');
	                    $('#manage_leave_notif_table').html(data);


	                    $('#manage_leave_notif_table').DataTable( {
	                        "pagingType": "full_numbers",
	                        "iDisplayLength": 40
	                    } );
					}
				});
			}
		});

	});


	$('#admin_leave_table').on("click", ".apply_leave_wrapper", function() {
		var user_id = $(this).data('id');
		var formattedDate = new Date();
		var d = formattedDate.getDate();
		var m = formattedDate.getMonth() + 1;
		var y = formattedDate.getFullYear();
		var cur_date = m +'/'+d+'/'+y;
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/admin_apply_leave',
			data: {user_id:user_id},
			success:function (data){
				var parsedata = jQuery.parseJSON( data );
				$('#apply-leave-name').text(parsedata.name);
				$('#admin_paid_leave').text(parsedata.paid_leave);
				$('#admin_leave_nature').val(0);
				$('#admin_leave_duration').val(cur_date + ' - ' + cur_date);
				$('#admin_leave_total_days').text(1);
				$('#admin_leave_reason').val('');
				$('#admin_submit_button').data('id', user_id);
				$("#admin_submit_button").prop("disabled", false);
				$('#admin_leave_apply_success').hide();
				$('#admin_leave_apply_validation').hide();
				$('#apply-leave-modal').modal('show');
			}
		});

	});


	var optionSet2 = {
		autoUpdateInput: false,
	    locale: {
	          cancelLabel: 'Clear'
	    },
		opens: 'right'
	};

	function CountDaysOfWork(fromDate, toDate, array){
		var count = 0;
	    while(fromDate <= toDate){
	        array.forEach(function(entry) {
	        	if(fromDate.getDay() === dowToDay(entry)){
	        		count++;
	        	}
			}, this);
			fromDate.setDate(fromDate.getDate() + 1);
	    }
	    return count ;
	}


	function dowToDay(dow){
		switch(dow){
			case 'sun': return 0;
			case 'mon': return 1;
			case 'tue': return 2;
			case 'wed': return 3;
			case 'thu': return 4;
			case 'fri': return 5;
			case 'sat': return 6;
			default:
				return -1; break;
		}
	}


	function getDaysDiff(start, end, start2, end2){
		var oneDay  	= 24*60*60*1000;
		var diffDays 	= Math.abs((start - end) / oneDay) + 1;
		var diffDays2 	=  Math.abs((start2 - end2) / oneDay) + 1;
		var totalDiff = diffDays - diffDays2;

		if($("#exclude_date_wrapper").is(":visible")){
			if(start2 >= start && start2 <= end && end2 >= start && end2 <= end){
				$('#leave_total_days').text(totalDiff);
				$('#excluded_days').text(diffDays2 + " day(s) excluded");
				$('#excluded_days').css("color", "");
			}
			else{
				$('#excluded_days').text("Excluded date(s) should be within duration");
				$('#excluded_days').css("color", "red");
			}
		}
		else{
			$('#leave_total_days').text(diffDays);
			$('#excluded_days').text("");
			$('#excluded_days').css("color", "");
		}
	}


	function admin_getDaysDiff(start, end, start2, end2){
		var oneDay  	= 24*60*60*1000;
		var diffDays 	= Math.abs((start - end) / oneDay) + 1;
		var diffDays2 	=  Math.abs((start2 - end2) / oneDay) + 1;
		var totalDiff = diffDays - diffDays2;

		if($("#exclude_date_wrapper").is(":visible")){
			if(start2 >= start && start2 <= end && end2 >= start && end2 <= end){
				$('#admin_leave_total_days').text(totalDiff);
				$('#excluded_days').text(diffDays2 + " day(s) excluded");
				$('#excluded_days').css("color", "");
			}
			else{
				$('#excluded_days').text("Excluded date(s) should be within duration");
				$('#excluded_days').css("color", "red");
			}
		}
		else{
			$('#admin_leave_total_days').text(diffDays);
			$('#excluded_days').text("");
			$('#excluded_days').css("color", "");
		}
	}


	function cb_duration (s, e, label) {
		$('#leave_duration').val(s.format('MM/DD/YYYY') + ' - ' + e.format('MM/DD/YYYY'));
		var exclude = $('#exclude_date_duration').val();
		var start = new Date(s.format('MM/DD/YYYY'));
		var end = new Date(e.format('MM/DD/YYYY'));
		var start2 = null, end2 = null;

		if(exclude){
			var duration_tok = exclude.split(' ');
			start2 = new Date(duration_tok[0]);
			end2 = new Date(duration_tok[2]);
		}

		getDaysDiff(start, end, start2, end2);
	}


	function cb_exclude (s, e, label) {
		$('#exclude_date_duration').val(s.format('MM/DD/YYYY') + ' - ' + e.format('MM/DD/YYYY'));
		var duration = $('#leave_duration').val();
		var duration_tok = duration.split(' ');
		var start = new Date(duration_tok[0]);
		var end = new Date(duration_tok[2]);
		var start2 = new Date(s.format('MM/DD/YYYY'));
		var end2 = new Date(e.format('MM/DD/YYYY'));

		getDaysDiff(start, end, start2, end2);
	}


	function admin_cb_duration (s, e, label) {
		$('#admin_leave_duration').val(s.format('MM/DD/YYYY') + ' - ' + e.format('MM/DD/YYYY'));
		var exclude = $('#admin_exclude_date_duration').val();
		var start = new Date(s.format('MM/DD/YYYY'));
		var end = new Date(e.format('MM/DD/YYYY'));
		var start2 = null, end2 = null;

		if(exclude){
			var duration_tok = exclude.split(' ');
			start2 = new Date(duration_tok[0]);
			end2 = new Date(duration_tok[2]);
		}

		admin_getDaysDiff(start, end, start2, end2);
	}


	function admin_cb_exclude (s, e, label) {
		$('#admin_exclude_date_duration').val(s.format('MM/DD/YYYY') + ' - ' + e.format('MM/DD/YYYY'));
		var duration = $('#admin_leave_duration').val();
		var duration_tok = duration.split(' ');
		var start = new Date(duration_tok[0]);
		var end = new Date(duration_tok[2]);
		var start2 = new Date(s.format('MM/DD/YYYY'));
		var end2 = new Date(e.format('MM/DD/YYYY'));

		admin_getDaysDiff(start, end, start2, end2);
	}


	function leaveListCallback(s, e, label){
		// $('#leave_range_duration').val(s.format('MM/DD/YYYY') + ' - ' + e.format('MM/DD/YYYY'));
		// var department = $('#leave_department').val();
		// var team = $('#leave_list_team').val();
		// var status = $('#leave_status').val();
		// var date_range = $('#leave_range_duration').val();
		// department = (!department) ? 0 : department;
		// team = (!team) ? 0 : team;

		// $.ajax({
		// 	type: "POST",
		// 	url:  site_url + "ajax/leave_ajax/leave_list_duration",
		// 	data: {
		// 		department:department,
		// 		team:team,
		// 		status:status,
		// 		date_range:date_range
		// 	},
		// 	success:function (data){
		// 		$('#leave_list_table').DataTable().destroy();
		// 		$("#leave_list_table").html('');
		// 		$("#leave_list_table").html(data);
		// 		$('#leave_list_table').DataTable( {
		// 			"pagingType": "full_numbers",
		// 			"iDisplayLength": 20,
		// 			"bSort" : false
		// 		} );
		// 	}
		// });
		Leave.List.table.ajax.reload();
	}


	$('#exclude_date_button').click(function() {
		$('#exclude_date_wrapper').slideToggle("fast","swing", function(){
			var duration_tok = $('#leave_duration').val().split(' ');
			var start = new Date(duration_tok[0]);
			var end = new Date(duration_tok[2]);

			var duration_tok = $('#exclude_date_duration').val().split(' ');
			var start2 = new Date(duration_tok[0]);
			var end2 = new Date(duration_tok[2]);
			getDaysDiff(start, end, start2, end2);
		});

	});


	$('#admin_exclude_date_button').click(function() {
		$('#exclude_date_wrapper').slideToggle("fast","swing", function(){
			var duration_tok = $('#admin_leave_duration').val().split(' ');
			var start = new Date(duration_tok[0]);
			var end = new Date(duration_tok[2]);

			var duration_tok = $('#admin_exclude_date_duration').val().split(' ');
			var start2 = new Date(duration_tok[0]);
			var end2 = new Date(duration_tok[2]);
			admin_getDaysDiff(start, end, start2, end2);
        });
	});


	$('#leave_duration').daterangepicker(optionSet2, cb_duration);
	$('#exclude_date_duration').daterangepicker(optionSet2, cb_exclude);
	$('#admin_leave_duration').daterangepicker(optionSet2, admin_cb_duration);
	$('#admin_exclude_date_duration').daterangepicker(optionSet2, admin_cb_exclude);
	$('#leave_range_duration').daterangepicker(optionSet2, leaveListCallback);


	$('#leave_stat_team, #leave_stat_department').change( function() {
		var department_selected = $('#leave_stat_department').val();
		var team_selected = $('#leave_stat_team').val();
		department_selected = (!department_selected) ? 0 : department_selected;
		team_selected = (!team_selected) ? 0 : team_selected;

		window.location.href= site_url + 'leave/osnet_leave_statistics/' + department_selected + '/' + team_selected;
	});


	$('#leave_status, #leave_list_team').change( function(e) {
		// var status_selected = $('#leave_status').val();
		// var department_selected = $('#leave_department').val();
		// var team_selected = $('#leave_list_team').val();
		// department_selected = (!department_selected) ? 0 : department_selected;
		// team_selected = (!team_selected) ? 0 : team_selected;

		// location.href = site_url + 'leave/osnet_leave_list/' + department_selected + '/' + team_selected + '/' + status_selected ;

		Leave.List.table.ajax.reload();
	});


	$('#leave_department').change( function(e) {
		// var status_selected = $('#leave_status').val();
		// var department_selected = $('#leave_department').val();
		// var team_selected = 0;
		// location.href = site_url + 'leave/osnet_leave_list/' + department_selected + '/' + team_selected + '/' + status_selected ;
		$('#leave_list_team').val(0);

		Leave.List.table.ajax.reload();
	});

	/**
	 * Deprecated
	$('#leave_list_table').on("click", ".btn_view_leave", function() {
		var id = $(this).attr('id');
		var leaveid = $('#' + id).data('id');

		$('#leave_approve_btn').show();
		$('#leave_deny_btn').show();
		$('#checkbox_unpaid').show();
		$('#status_by_wrapper').hide();

		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/leave_view',
			data: {leaveid:leaveid},
			success:function (data){
				var parsedata = jQuery.parseJSON( data );

				$("#leave_employee") . text (parsedata.leave_employee);
				$("#leave_daterange") . text(parsedata.leave_daterange);
				$("#leave_date_filed") . text(parsedata.leave_date_filed);
				$("#leave_view_status") . text (parsedata.leave_status);
				$("#leave_view_nature") . text (parsedata.leave_nature);
				$("#leave_view_days_paid") . text(parsedata.leave_days_paid);
				$("#leave_paid") . text(parsedata.paid);
				$("#leave_details").text (parsedata.leave_details);
				$('#leave_approve_btn').data('id', leaveid);
				$('#leave_deny_btn').data('id', leaveid);

				if (parsedata.leave_status == 'Pending'){
					$("#leave_remarks2").hide();
					$("#leave_remarks").attr("readonly", false);
					$("#leave_remarks").show();
				}
				else if (parsedata.leave_status == 'Denied' || parsedata.leave_status == 'Approved' || parsedata.leave_status == 'ReviewedbyTL'){
					$("#leave_remarks2").text(parsedata.leave_remarks);
					$("#leave_remarks2").show();
					$("#leave_remarks").hide();

					if(parsedata.leave_status != 'ReviewedbyTL'){
						$('#leave_approve_btn').hide();
						$('#leave_deny_btn').hide();
						$('#checkbox_unpaid').hide();
					}
				}

				if(parsedata.role != "superadmin" && parsedata.role != "hr-admin"){
					//hide buttons so user cant approve/deny his own leave
					if(parsedata.user_id == parsedata.uid){
						$('#leave_approve_btn').hide();
						$('#leave_deny_btn').hide();
					}

					if(parsedata.leave_status == 'ReviewedbyTL'){

						$("#leave_remarks").attr("readonly", true);
						$('#leave_approve_btn').hide();
						$('#leave_deny_btn').hide();
						$('#checkbox_unpaid').hide();
						$("#leave_view_status") . text ("Awaiting HR Approval");
					}
				}

				if(parsedata.leave_status == 'Denied' || parsedata.leave_status == 'Approved' || parsedata.leave_status == 'ReviewedbyTL'){
					if(parsedata.leave_status == 'Approved' ){
						$("#status_by_type") . text ("Approved By");
						$("#status_by") . text (parsedata.approved_by);
					}
					else if(parsedata.leave_status == 'ReviewedbyTL'){
						$("#status_by_type") . text ("Reviewed By");
						$("#status_by") . text (parsedata.approved_by);
					}
					else if(parsedata.leave_status == 'Denied'){
						$("#status_by_type") . text ("Denied By");
						$("#status_by") . text (parsedata.denied_by);
					}
					$('#status_by_wrapper').show();
				}

				$('#leave-item-modal').modal('show');
			}
		});
	});
	*/

	var AJAX = {
		details: {
			view: null
		}
	}

	$('#leave_list_table').on('click', '.btn_view_leave', function () {
		var id = $(this).data('id');

		$('#leave-item-modal')
			.find('input[name="leave[id]"]').val(id);

		$('#leave-item-modal').modal('show');
	});

	$('#leave-item-modal').on('shown.bs.modal', function() {
		var modal = $(this);

		var leave = {
			id: modal.find('input[name="leave[id]"]').val()
		}

		AJAX.details.view = $.ajax({
			type: 'post',
			url: modal.data('ajax-url'),
			data: {
				leaveid: leave.id,
			},
			dataType: 'json',
			success: function(response) {
				leave.status = response.leave_status.toLowerCase();
				leave.remarks = response.leave_remarks;
				leave.unpaid = (response.paid.toLowerCase() == 'unpaid') ? true : false;
				leave.days_paid = response.leave_days_paid;

				modal.find("#leave_employee")
					.text(response.leave_employee);

				modal.find("#leave_daterange")
					.text(response.leave_daterange);

				modal.find("#leave_date_filed")
					.text(response.leave_date_filed);

				modal.find("#leave_view_status")
					.text(response.leave_status);

				modal.find("#leave_view_nature")
					.text(response.leave_nature);

				modal.find("#total-days")
					.text(response.total_days);

				modal.find("#leave_view_days_paid")
					.text(response.leave_days_paid);

				modal.find("#leave_paid")
					.text(response.paid);

				modal.find("#leave_details")
					.text(response.leave_details);

				if (leave.status == 'pending') {

				} else {
					modal.find('#remarks-group').show();
					modal.find('#remarks-readonly')
						.text(leave.remarks).show();

					switch (leave.status) {
						case 'approved':
							$('#status_by_type').text('Approved By');
							$('#status_by').text(response.approved_by);
							break;

						case 'denied':
							$('#status_by_type').text('Denied By');
							$('#status_by').text(response.denied_by);
							break;

						case 'reviewedbytl':
							$('#status_by_type').text('Reviewed By');
							$('#status_by').text(response.approved_by);

							modal.find("#leave_view_status")
								.text('Awaiting HR Approval');
							break;
					}

					modal.find('#status_by_wrapper').show();
				}

				if (response.action.review || response.action.approve) {
					modal.find('#leave_approve_btn, #leave_deny_btn')
						.data('leave', leave)
						.show(); // Set Button Data and Show Buttons

					if (response.action.approve) {
						modal.find('#markunpaid').parent().show(); // Show checkbox
					}

					if (leave.status == 'pending') {
						modal.find('#remarks-group').show();
						modal.find('#leave_remarks').show();

					} else if (leave.status == 'reviewedbytl') {
						modal.find("#leave_view_status")
							.text('Reviewed');
					}
				}
			}
		})
		.always(function (xhr, status) {
			if (status == 'success') {
				modal.find('.modal-loading').slideUp();
				modal.find('.modal-body, .modal-footer').slideDown();
			}
		});
	});

	$('#leave-item-modal').on('hide.bs.modal', function() {
		AJAX.details.view.abort();

	}).on('hidden.bs.modal',  function() {
		var modal = $(this);

			modal.find('.modal-loading h5').text(
				modal.find('.modal-loading h5').data('loading-text')
			);
			modal.find('.modal-loading').css('padding-bottom', '10px').show();
			modal.find('.modal-body, .modal-footer').hide();

			modal.find('#remarks-readonly').parents('.form-group')
				.removeClass('has-error');

			modal.find('#remarks-readonly').parents('.form-group')
				.find('.help-block').hide();

			modal.find('#remarks-group, #leave_remarks, #remarks-readonly').hide();
			modal.find('#status_by_wrapper').hide();

			modal.find('#markunpaid').parent().hide();

			modal.find('#leave_approve_btn, #leave_deny_btn')
				.button('reset')
				.prop('disabled', false).hide();
	}); // Leave Details Modal House-keeping

	$('#leave_approve_btn').click(function() {
		var button = $(this);

		var leave = button.data('leave'); // Get Leave Data

		var modal = {
			$: $('#leave-item-modal'),
			remarks: $('#leave-item-modal').find('#leave_remarks'),
			unpaid: $('#leave-item-modal').find('#markunpaid')
		}

		// Clear Remarks Error
		modal.remarks.parents('.form-group')
			.removeClass('has-error').find('.help-block').hide();

		// Leave Application is Pending, Get Remarks
		if (leave.status == 'pending') {
			leave.remarks = $.trim(modal.remarks.val());
		}

		// Show Remarks Error
		if (leave.remarks == '') {
			modal.remarks.parents('.form-group')
				.addClass('has-error').find('.help-block').show();
		}

		// Check if Set Leave Application to Unpaid
		if (modal.unpaid.length) {
			leave.unpaid = modal.unpaid.is(':checked');
		}

		if (leave.id && leave.remarks) {
			var timesheets = [];

			modal.$.find('#leave_approve_btn, #leave_deny_btn').prop('disabled', true);

			if (leave.status == 'reviewedbytl') {
				$.ajax({
					url: button.data('check-url'),
					type: 'post',
					beforeSend: function() {
						// Change Button States
						button.button('checking');
					},
					data: {
						leaveid: leave.id
					},
					dataType: 'json',
					success: function(response) {
						var dates = [];

						timesheets = $.map(response, function(element) {
							dates.push(element.date_of_leave);
							return element.id;
						});

						if (dates.length) {
							proceed = confirm('Employee has time logs on (' + dates.join(', ') + ').\nTime logs on above date(s) will be deleted.\n\nDo you wish to continue?');

							if (proceed) {
								approve(leave, timesheets);

							} else {
								modal.$.find('#leave_approve_btn, #leave_deny_btn').prop('disabled', false);
								button.button('reset');
							}
						} else {
							approve(leave, timesheets);
						}
					}
				});

			} else if (leave.status == 'pending') {
				approve(leave, timesheets);
			}
		}

		function approve(leave, timesheets) {
			if (leave.id && leave.remarks) {
				$.ajax({
					url: button.data('ajax-url'),
					beforeSend: function() {
						button.button('loading');
					},
					type: 'post',
					data: {
						leaveid: leave.id,
						remarks: leave.remarks,
						unpaid: ((leave.unpaid) ? 'true' : 'false'),
						days_paid: leave.days_paid,
						timesheet_id: timesheets
					},
					success: function (response) {

					}
				})
				.always(function() {
					modal.$.one('hidden.bs.modal', function() {
						window.location.reload();
					}).modal('hide');
				});
			}
		}
	});

	/**
	 * Deprecated
	$('#leave_approve_btn').click(function() {
		var id = $(this).attr('id');

		var status_selected = ($('#leave_status').length) ? $('#leave_status').val() : 0;
		var department_selected = ($('#leave_department').length) ? $('#leave_department').val() : 0;
		var team_selected = ($('#leave_list_team').length) ? $('#leave_list_team').val() : 0;

		var status = $('#leave_view_status').text();
		var leaveid = $('#' + id).data('id');
		var remarks = $.trim($('#leave_remarks').val());
		var days_paid = $('#leave_view_days_paid').text();
		var err = "", timesheet_id = [];

		if (status == "ReviewedbyTL") {
			remarks = $.trim($('#leave_remarks2').text());
			$.ajax({
				type: "POST",
				url: site_url + 'ajax/leave_ajax/check_log',
				data: {
					leaveid:leaveid
				},
				success:function(data) {
					var parsedata = jQuery.parseJSON( data );
					var dates = "";
					parsedata.forEach(function(element) {
						dates += element.date_of_leave+" ";
						timesheet_id.push(element.id);
					});
					if(dates != "") {
						if (confirm("Employee had time logs on (" + dates + "). \nTime logs on above date(s) will be deleted.\n\nDo you wish to continue?"))
							cont();
					}
					else
						cont();
				}
			});
		}
		else
			cont();

		if (!remarks)	err = '<p>Remarks Required</p>';
		$("#view_leave_errors").html(err);

		if ($('#markunpaid').prop('checked'))
			var unpaid = 'true';
		else
			var unpaid = 'false';

		function cont(){
			if (remarks){
				$("#leave_approve_btn").attr("disabled", "disabled");
				$("#leave_deny_btn").attr("disabled", "disabled");

				$.ajax({
					type: "POST",
					url: site_url + 'ajax/leave_ajax/leave_approve',
					data: {
						leaveid:leaveid,
						remarks:remarks,
						unpaid:unpaid,
						days_paid:days_paid,
						timesheet_id:timesheet_id
					},
					success:function(data) {
						location.href = site_url + 'leave/osnet_leave_list/' + department_selected + '/' + team_selected + '/' + status_selected ;
					}
				});
			}
		}
	});
	*/

	$('#leave_deny_btn').click(function() {
		var button = $(this);
		var leave = button.data('leave');

		var modal = {
			$: $('#leave-item-modal')
		}

		modal.remarks = modal.$.find('#leave_remarks');

		modal.remarks.parents('.form-group')
			.removeClass('has-error').find('.help-block').hide();

		if (leave.status == 'pending') {
			leave.remarks = $.trim(modal.remarks.val());
		}

		if (leave.remarks == '') {
			modal.remarks.parents('.form-group')
				.addClass('has-error').find('.help-block').show();
		}

		if (leave.id && leave.remarks) {
			$.ajax({
				url: button.data('ajax-url'),
				type: 'post',
				beforeSend: function() {
					// Change Button States
					modal.$.find('#leave_approve_btn, #leave_deny_btn').prop('disabled', true);
					button.button('loading');
				},
				data: {
					leaveid: leave.id,
					remarks: leave.remarks
				},
				dataType: 'json',
				success: function(response) {

				}
			})
			.always(function() {
				modal.$.one('hidden.bs.modal', function() {
					window.location.reload();
				}).modal('hide');
			})
		}
	});

	/**
	 * Deprecated
	$('#leaves_deny_btn').click( function() {
		var status_selected = ($('#leave_status').length) ? $('#leave_status').val() : 0;
		var department_selected = ($('#leave_department').length) ? $('#leave_department').val() : 0;
		var team_selected = ($('#leave_list_team').length) ? $('#leave_list_team').val() : 0;

		var status = $('#leave_view_status').text();

		var id = $(this).attr('id');
		var leaveid = $('#' + id).data('id');
		if(status == "ReviewedbyTL")
			var remarks = $.trim($('#leave_remarks2').text());
		else
			var remarks = $.trim($('#leave_remarks').val());
		var err = "";

		if (!remarks)	err = '<p>Remarks Required</p>';
		$("#view_leave_errors").html(err);

		if (remarks || status == "ReviewedbyTL"){
			$("#leave_approve_btn").attr("disabled", "disabled");
			$("#leave_deny_btn").attr("disabled", "disabled");

			$.ajax({
				type: "POST",
				url: site_url + 'ajax/leave_ajax/leave_deny',
				data: {leaveid:leaveid, remarks:remarks},
				success:function(data) {
					location.href = site_url + 'leave/osnet_leave_list/' + department_selected + '/' + team_selected + '/' + status_selected ;
				}
			});
		}
	});
	*/

	$('#recalculate_leave_left').click( function() {
		$("#recalculate_button").hide();
		$("#recalculate_loading").show();
		var pathname = window.location.pathname;
		var url      = window.location.href;
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/recalculate_leave_left',
			success:function(data) {
				window.location.href = url;
			}
		});
	});


	$('#leave_stat_table').on("click", ".default_leave_credit_edit", function() {
		var id = $(this).attr('id');
		$(".con_default_leave_credit_edit"+id).hide();
		$(".con_default_leave_credit_save"+id).show();
	});


	$('#leave_stat_table').on("click", ".default_leave_credit_save", function() {
		var id = $(this).attr('id');
		var input = $('#input'+id).val();
		var default_leave_credit_val = $('#default_leave_credit_val'+id).text();

		if(isNaN(input) || input == ""){
			$("#leave_alert" ).show();
			$("#leave_alert" ).fadeOut(2000);
			$('#input'+id).val(default_leave_credit_val);
		}
		else{
			$.ajax({
				type: "POST",
				url: site_url + 'ajax/leave_ajax/save_default_leave',
				data: {input:input, id:id},
				success:function(data) {
					var pdata = jQuery.parseJSON( data );
					$('#default_leave_credit_val'+id).text(pdata);
					$('#leave_left_val'+id).text(pdata);
					$(".con_default_leave_credit_save"+id).hide();
					$(".con_default_leave_credit_edit"+id).show();
					$("#leave_alert_save" ).show();
					$("#leave_alert_save" ).fadeOut(2000);
					//window.location.href = site_url + 'leave/leave_list/' + department_selected + '/' + status_selected;
				}
			});

		}

	});


	$('#leave_stat_table').on("click", ".default_leave_credit_cancel", function() {
		var id = $(this).attr('id');
		$(".con_default_leave_credit_save"+id).hide();
		$(".con_default_leave_credit_edit"+id).show();
	});


	$('#leave_stat_table').on("click", ".leave_stat_view", function() {
		var id = $(this).attr('id');
		var name = $(this).data('name');
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/stat_view_list',
			data: {id:id},
			beforeSend	:function(){
				$("#view_list_name").text(name + "'s Leave List");
				$("#add_submit").data('id', id);
				$("#add_submit").data('name', name);
				$("#add_leave_application").data('name', name);
			},
			success		:function(data) {
				$("#view_list_table").html("");
				$("#view_list_table").append(data);

			},
			complete	:function() {
				$('#view-list-modal').modal('show');
			}
		});
	});


	$('#view-list-modal').on("click", "#add_leave_application", function() {
		var name = $(this).data('name');
		var formattedDate = new Date();
		var d = formattedDate.getDate();
		var m = formattedDate.getMonth() + 1;
		var y = formattedDate.getFullYear();
		var cur_date = m +'/'+d+'/'+y;

		$("#add_application_name").text(name);
		$("#add_submit").prop("disabled",false);
		//resets notifications
		$('#leave_validation').hide();
		$('#admin_leave_nature').val(0);
		$('#admin_leave_reason').val("");
		$('#add-leave-application-modal').modal('show');
	});


	$('#view-list-modal').on("click", ".delete_leave_wrapper", function() {
		var id = $(this).attr('id');
		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/get_leave_by_leaveID',
			data: {id:id},
			success:function(data) {
				var parsedata = jQuery.parseJSON(data);
				$('#delete_leave_button').data('id', parsedata.leave_id);
				$('#delete_leave_button').data('user_id', parsedata.user_id);
				$("#confirmation_text").html("Are you sure you want to archive leave on <b>'"+parsedata.duration_start+" to "+parsedata.duration_end+"'</b> ?");
				$('#confirm-delete-modal').modal('show');
			}
		});
	});


	$('#confirm-delete-modal').on("click", "#delete_leave_button", function() {
		var id = $(this).data('id');
		var user_id = $(this).data('user_id');

		$.ajax({
			type: "POST",
			url: site_url + 'ajax/leave_ajax/delete_leave',
			data: {id:id},
			success:function(data) {
				var total = jQuery.parseJSON(data);
				console.log(total);
				$('#leave_left_val'+user_id).text(total);
				$.ajax({
					type: "POST",
					url: site_url + 'ajax/leave_ajax/stat_view_list',
					data: {id:user_id},
					success		:function(data) {
						$("#view_list_table").html("");
						$("#view_list_table").append(data);
					}
				});
				$('#confirm-delete-modal').modal('hide');
			}
		});
	});



});



