$(document).ready(function() {
	// Page @code begin
	var Coaching = {
		table: null,
		columns: function () {
			var definitions = [
				{'name': '#','data': '#','orderable': false},
				{
					'name': 'coach',
					'data': 'coach'
				},
				{
					'name': 'employee',
					'data': 'employee'
				},
				{
					'name': 'team',
					'data': 'team'
				},
				{'name': 'type', 'data': 'type'},
				{
					'name': 'date_coached', 
					'data': 'date_coached',
					'render': function (data, type, row, meta) {
						return moment(data).format('MM/DD/YYYY hh:mm A');
					}
				},
				{
					'name':'action',
					'orderable': false, 
					'render': function(data, type, row, meta) {
						let template = $('<div />').html($('script[type="text/template"]#template-coaching[name="row[action]"]').html());

						if ( ! row.action.edit) {
							template.find('.coaching-edit').remove();
						
						} else {
							template.find('.coaching-edit')
								.attr('data-id', row.coaching_id);
						}

						if ( ! row.action.delete) {
							template.find('.coaching-delete').remove();

						} else {
							template.find('.coaching-delete')
								.attr('data-id', row.coaching_id);
						}

						template.find('.coaching-details')
							.attr('data-id', row.coaching_id);

						return template.html();
					}
				},
			];

			var columns = [];

			$('#coachings-table thead tr > th').each(function(index) {
				var name = $(this).data('name');
				
				for (var key in definitions) {
					var definition = definitions[key];

					if (definition.name == name) {
						columns.push(definition);
						break;
					}
				}
			});

			return columns;
		},
		ordering: function() {
			var order = [];

			$('#coachings-table thead tr > th').each(function(index) {
				var sort = $(this).data('sort');
				
				if (sort) {
					order.push([index, sort]);
				}
			});

			return order;
		}
	}

	$('input[name="coaching[date]"]').daterangepicker({
		'applyClass': 'btn-warning'
	}, function (start, end) {
		Coaching.table.ajax.reload();
	});

	Coaching.table = $('#coachings-table').DataTable({
		'processing': true,
		'serverSide': true,
		'dom': "<'row'<'col-sm-3'l><'col-sm-6 legend'><'col-sm-3'f>>" +
			"<'row'<'col-sm-12'tr>>" +
			"<'row'<'col-sm-5'i><'col-sm-7'p>>",
		'fnInitComplete': function() {
			let legend = $('script[type="text/template"]#template-coaching[name="table[legend]"]').html();
			$('.legend').html(legend);
		},
		'ajax': {
			url: $('#coachings-table').data('ajax-url'),
			data: function (data) {
				data.mode = $('#coachings-table').data('mode');

				data.team = {
					id: $('select[name="coaching[team]"]').val()
				}

				data.type = $('select[name="coaching[type]"]').val();

				data.date = {
					start: $('input[name="coaching[date]"]').data('daterangepicker').startDate.format('MM/DD/YYYY'),
					to: $('input[name="coaching[date]"]').data('daterangepicker').endDate.format('MM/DD/YYYY'),
				}
				data.employee = {
					name: $('input[name="employee[name]"]').val()
				}
			}
		},
		'order': Coaching.ordering(),
		'columns': Coaching.columns(),
		'searching': false,
		'createdRow': function(row, data, index) {
			var color = 'text-red';
			
			if (data.closed_by) {
				color = 'text-yellow';
			
			} else if (data.commitment) {
				color = 'text-aqua';
			}

			if (data.validated_by) {
				color = 'text-green';
			}

			$(row).addClass(color);
		}
	});

	$('select#team[name="coaching[team]"], select#type[name="coaching[type]"]').on('change', function () {
		Coaching.table.ajax.reload();
	});

	$('input[name="employee[name]"]').on('keypress', function (event) {
		if (event.which == 13) {
			$('select#team[name="coaching[team]"], select#type[name="coaching[type]"]').val(null);

			Coaching.table.ajax.reload();
		}
	});
	// Page @code end


	// Create Coaching @code begin
	$('#coaching-create').on('click', function () {
		var template = $('script[type="text/template"]#template-coaching[name="modal[create]"]').html();
		$('#modal.container').append(template);

		$('.modal[data-module="coaching"]#create').modal('show');
	});

	$('#modal.container')
	.on('show.bs.modal', '.modal[data-module="coaching"]#create', function() {
		let components = {
			attachments: new window.OSnet.Components.Attachments()
		};

		components.attachments.initialize('.modal[data-module="coaching"]#create #attachments');

		$(this).data('components', components);
	})
	.on('shown.bs.modal', '.modal[data-module="coaching"]#create', function() {
		var modal = $(this);
			
		var e = {
			team: {
				id: modal.find('select[name="team[id]"]'),
				member: {
					id: modal.find('select[name="team[member][id]"]')
				}
			},
			employee: {
				id: modal.find('select[name="employee[id]"]')
			},
			coaching: {
				date: modal.find('input[name="coaching[date]"]'),
				type: {
					select: modal.find('select[name="coaching[type]"]'),
					input: modal.find('input[name="coaching[type][others]"]')
				},
				overview: modal.find('textarea[name="coaching[overview]"]'),
				strengths: modal.find('textarea[name="coaching[strengths]"]'),
				AFI: modal.find('textarea[name="coaching[AFI]"]'),
				action_steps: modal.find('textarea[name="coaching[action_steps]"]'),
				comments: modal.find('textarea[name="coaching[comments]"]'),
			}
		};

		e.coaching.date.datetimepicker({
			minDate: new Date(),
			defaultDate: new Date(),
			sideBySide: true,
			widgetPositioning: {
				horizontal: 'right'
			}
		});
		
		$.ajax({
			url: e.employee.id.data('get-url'),
			type: 'post',
			dataType: 'json',
			success: function(response) {
				if (response.status.text == 'success') {
					let employees = $.map(response.data.employees, function(employee) {
						return {
							id: employee.user_id,
							text: employee.full_name
						};
					});

					e.employee.id.select2({
						theme: 'bootstrap',
						width: '100%',
						placeholder: '-- Select --',
						data: employees
					});
				}
			}
		});

		e.coaching.type.select.on('change', function () {
			if ($(this).val() == 'Others') {
				e.coaching.type.input.show().focus();
			} else {
				e.coaching.type.input.hide();
			}
		})

		// Create Coaching Event Handler @code begin
		modal.find('button#create').on('click', function() { 
			var proceed = true;

			var button = $(this);
			
			modal.find('.form-group').removeClass('has-error');

			if ( ! check(e.coaching.date)) {
				proceed = false;
			}

			if ( ! check(e.coaching.type.select)) {
				proceed = false;
			
			} else {
				if (e.coaching.type.select.val() == 'Others' && e.coaching.type.input.val() == '') {
					e.coaching.type.input.parents('.form-group')
						.addClass('has-error');

					proceed = false;
				}
			}

			if ( ! check(e.employee.id)) {
				proceed = false;
			}
			if ( ! check(e.team.member.id)) {
				proceed = false;
			}

			if ( ! check(e.coaching.overview)) {
				proceed = false;
			}

			if ( ! check(e.coaching.strengths)) {
				proceed = false;
			}

			if ( ! check(e.coaching.AFI)) {
				proceed = false;
			}

			if ( ! check(e.coaching.action_steps)) {
				proceed = false;
			}

			if (proceed) {
				let attachments = modal.data('components').attachments.pop();

				$.ajax({
					type: 'post',
					url: button.data('ajax-url'),
					dataType: 'json',
					beforeSend: function() {
						button.button('loading');
						window.OSnet.Components.Alert.clear('#coaching-alert');
					},
					data: {
						employee:{
							id: e.employee.id.val(),
						},
						coaching: {
							date: e.coaching.date.val(),
							type: (e.coaching.type.select.val() == 'Others') ? e.coaching.type.input.val() : e.coaching.type.select.val(),
							overview: e.coaching.overview.val(),
							strengths: e.coaching.strengths.val(),
							AFI: e.coaching.AFI.val(),
							action_steps: e.coaching.action_steps.val(),
							comments: e.coaching.comments.val(),
							attachments: attachments
						}
					},
					success: function(response) {
						if (response.status.text == 'success') {
							modal.one('hidden.bs.modal', function() {
								window.OSnet.Components.Alert.show('#coaching-alert', 'success', 'Success!', 'Coaching log successfully created.', true);

								Coaching.table.ajax.reload();
							});
						}
					}
				})
				.always(function() {
					button.button('reset');
					modal.modal('hide');
				});
			}
		});
	})
	.on('hide.bs.modal', '.modal[data-module="coaching"]#create', function() {
		$(this).data('components').attachments.clean();
	});
	// Create Coaching @code end


	function check(element) {
		if (element.val() == '') {
			element.parents('.form-group').addClass('has-error');
			element.parents('.collapse').collapse('show');
			return false;
		}

		return true;
	}

	// Coaching Details @code begin 
	$(document).on('click', '.coaching-details', function(event) {
		event.preventDefault();

		var template = $('script[type="text/template"]#template-coaching[name="modal[details]"]').html();
		$('#modal.container').append(template);

		var coaching = {
			id: $(this).data('id')
		}

		$('.modal[data-module="coaching"]#details').one('show.bs.modal', function() {
			var modal = $(this);

			modal.find('input[name="coaching[id]"]').val(coaching.id);

		}).modal('show');
	});

	$('#modal.container')
	.on('show.bs.modal', '.modal[data-module="coaching"]#details', function() {
		let components = {
			attachments: new window.OSnet.Components.Attachments({
				readonly: true
			})
		};

		components.attachments.initialize('.modal[data-module="coaching"]#details #attachments');

		$(this).data('components', components);
	})
	.on('shown.bs.modal', '.modal[data-module="coaching"]#details', function() {
		var modal = $(this);

		$.ajax({
			type: 'post',
			url: modal.data('ajax-url'),
			data: {
				coaching: {
					id: modal.find('input[name="coaching[id]"]').val()
				}
			},
			dataType: 'json',
			success: function(response) {
				if (response.status.text == 'success') {
					var coaching = response.data.coaching;

					modal.find('#coach').text(coaching.coach);
					modal.find('#employee').text(coaching.employee);
					modal.find('#type').text(coaching.type);
					modal.find('#date').text(moment(coaching.date_coached).format('MM/DD/YYYY hh:mm A'));

					for (let key in coaching.attachments) {
						modal.data('components').attachments.insert(coaching.attachments[key]);
					}

					modal.find('textarea[name="coaching[overview]"]').val(coaching.overview);
					modal.find('textarea[name="coaching[strengths]"]').val(coaching.strengths);
					modal.find('textarea[name="coaching[AFI]"]').val(coaching.afi);
					modal.find('textarea[name="coaching[action_steps]"]').val(coaching.action_steps);
					modal.find('textarea[name="coaching[comments]"]').val(coaching.comments);

					modal.find('textarea[name="coaching[commitment]"]').val(coaching.commitment);

					if (coaching.action.acknowledge) {
						modal.find('textarea[name="coaching[commitment]"]').prop('readonly', false);

					} else {
						modal.find('textarea[name="coaching[commitment]"]')
							.parents('.panel').addClass('readonly');
						
						modal.find('button#acknowledge').remove();
					}

					if (coaching.action.validate) {

					} else {
						modal.find('button#validate').remove();
					}

					if (coaching.action.print) {
						modal.find('a#print').attr('href', coaching.url.print);

					} else {
						modal.find('a#print').remove();
					}
				}
			}
		})
		.always(function () {
			modal.find('.modal-loading').slideUp();
			modal.find('.modal-body, .modal-footer').slideDown();
		});
	});

	$('#modal.container').on('click', '.modal[data-module="coaching"]#details button#acknowledge', function() {
		var button = $(this);

		var modal = button.parents('.modal');
		var commitment = modal.find('textarea[name="coaching[commitment]"]');

		modal.find('.form-group').removeClass('has-error').find('.error').hide();

		if (check(commitment)) {
			$.ajax({
				url: button.data('ajax-url'),
				type: 'post',
				dataType: 'json',
				data: {
					coaching: {
						id: modal.find('input[name="coaching[id]"]').val(),
						commitment: commitment.val(),
					}
				},
				beforeSend: function() {
					button.button('loading');
					window.OSnet.Components.Alert.clear('#coaching-alert');
				},
				success: function(response) {
					if (response.status.text == 'success') {
						modal.one('hidden.bs.modal', function() {
							window.OSnet.Components.Alert.show('#coaching-alert', 'success', 'Success!', 'Coaching successfully acknowledged.', true);
							Coaching.table.ajax.reload();
						});
					}
				}
			})
			.always(function () {
				button.button('reset');
				modal.modal('hide');
			});
		}
	});

	$('#modal.container').on('click', '.modal[data-module="coaching"]#details button#validate', function() {
		var button = $(this);

		var modal = button.parents('.modal');

		$.ajax({
			url: button.data('ajax-url'),
			type: 'post',
			dataType: 'json',
			data: {
				coaching: {
					id: modal.find('input[name="coaching[id]"]').val()
				}
			},
			beforeSend: function() {
				button.button('loading');
				window.OSnet.Components.Alert.clear('#coaching-alert');
			},
			success: function(response) {
				if (response.status.text == 'success') {
					modal.one('hidden.bs.modal', function() {
						window.OSnet.Components.Alert.show('#coaching-alert', 'success', 'Success!', 'Coaching successfully validated.', true);
						Coaching.table.ajax.reload();
					});
				}
			}
		})
		.always(function() {
			button.button('reset');
			modal.modal('hide');
		});
	});
	// Coaching Details @code end


	// Edit Coaching @code begin
	$('body').popover({
		'selector': '[data-toggle="popover"]'
	});

	$('body').on('click', '[data-dismiss="popover"]', function() {
		let popover = $(this).parents('.popover');

		popover.popover('hide');
	});

	$(document).on('click', '.coaching-edit', function(event) {
		event.preventDefault();

		var template = $('script[type="text/template"]#template-coaching[name="modal[edit]"]').html();		
		$('#modal.container').append(template);

		var coaching = {
			id: $(this).data('id')
		}

		$('.modal[data-module="coaching"]#edit').one('show.bs.modal', function() {
			var modal = $(this);
				modal.find('input[name="coaching[id]"]').val(coaching.id);

		}).modal('show');
	});

	$('#modal.container').on('show.bs.modal', '.modal[data-module="coaching"]#edit', function() {
		let components = {
			attachments: new window.OSnet.Components.Attachments()
		};

		components.attachments.initialize('.modal[data-module="coaching"]#edit #attachments');

		$(this).data('components', components);
	})
	.on('shown.bs.modal', '.modal[data-module="coaching"]#edit', function() {
		var modal = $(this);

		modal.find('input[name="coaching[date]"]').datetimepicker({
			minDate: new Date(),
			sideBySide: true,
			widgetPositioning: {
				horizontal: 'right'
			}
		});

		$.ajax({
			url: modal.data('ajax-url'),
			type: 'post',
			data: {
				coaching: {
					id: modal.find('input[name="coaching[id]"]').val()
				}
			},
			dataType: 'json',
			success: function (response) {
				if (response.status.text == 'success') {
					let coaching = response.data.coaching;
					
					modal.find('input#employee').val(coaching.employee);
					modal.find('input[name="coaching[date]"]').val(
						moment(coaching.date_coached).format('MM/DD/YYYY hh:mm A')
					);
				
					modal.find('select[name="coaching[type]"]').on('change', function () {
						if ($(this).val() == 'Others') {
							modal.find('input[name="coaching[type][others]"]').show().focus();
						} else {
							modal.find('input[name="coaching[type][others]"]').hide();
						}
					});

					let types = modal.find('select[name="coaching[type]"] option').map(function() {
						return $(this).val();
					}).get();

					if (types.indexOf(coaching.type) > -1) {
						modal.find('select[name="coaching[type]"]')
							.val(coaching.type)
							.trigger('change');
					
					} else {
						modal.find('input[name="coaching[type][others]"]').val(coaching.type);
						modal.find('select[name="coaching[type]"]')
							.val('Others')
							.trigger('change');
					}

					if (coaching.action.close) {

					} else {
						modal.find('button#close').remove();
					}

					for (let key in coaching.attachments) {
						modal.data('components').attachments.insert(coaching.attachments[key]);
					}

					let popover = {
						close: modal.find('.modal-footer button#close'),
					};

					popover.close.on('click', function() {
						let trigger = $(this);
						
						if (trigger.next('div.popover:visible').length === 0) {
							$(this).popover('show');
						}
					})
					.on('shown.bs.popover', function(event) {
						$(this).prop('disabled', true);
						
						let tooltip = $(this).data('bs.popover').tip().find('textarea').focus();

						modal.find('button#update').prop('disabled', true)
							.fadeOut('fast');
						modal.find('button[data-dismiss="modal"]').prop('disabled', true)
							.fadeOut('fast');

						modal.data('components').attachments.readonly(true);
					})
					.on('hidden.bs.popover', function () {
						$(this).prop('disabled', false);
						
						modal.find('button#update').prop('disabled', false)
							.fadeIn('fast');
						modal.find('button[data-dismiss="modal"]').prop('disabled', false)
							.fadeIn('fast');
					
						modal.data('components').attachments.readonly(false);
					});

					/**
					 * Tooltip Close Coaching Log
					 * @param  {[type]}
					 * @return {[type]}   [description]
					 */
					modal.on('click', '.popover #proceed-to-close', function() {
						let button = $(this);

						let popover = button.parents('.popover');
						
						let cancel = popover.find('[data-dismiss="popover"]');
						let reason = popover.find('textarea[name="reason"]');

						let proceed = true;

						reason.parents('.form-group').removeClass('has-error');

						if ($.trim(reason.val()) == '') {
							reason.parents('.form-group').addClass('has-error');

						} else {
							let id = modal.find('input[name="coaching[id]"]').val();

							$.ajax({
								url: button.data('ajax-url'),
								type: 'post',
								dataType: 'json',
								data: {
									coaching: {
										id: id,
										close: {
											reason: $.trim(reason.val())
										}
									}
								},
								beforeSend: function() {
									button.button('loading');
									cancel.prop('disabled', true);
								},
								success: function(response) {
									if (response.status.text == 'success') {
										modal.one('hidden.bs.modal', function() {
											window.OSnet.Components.Alert.show('#coaching-alert', 'success', 'Success!', 'Coaching log successfully closed.', true);
											Coaching.table.ajax.reload();
										});
									}
								}
							})
							.always(function() {
								setTimeout(function () {
									button.button('reset');
									cancel.prop('disabled', false);

									modal.modal('hide');
								}, 1000);
							});
						}
					});

					modal.find('textarea[name="coaching[overview]"]').val(coaching.overview);
					modal.find('textarea[name="coaching[strengths]"]').val(coaching.strengths);
					modal.find('textarea[name="coaching[AFI]"]').val(coaching.afi);
					modal.find('textarea[name="coaching[action_steps]"]').val(coaching.action_steps);
					modal.find('textarea[name="coaching[comments]"]').val(coaching.comments);
				
					/**
					 * [description]
					 * 
					 * @param  {[type]} 
					 * @return {[type]}         [description]
					 */
					modal.find('button#update').on('click', function(){
				    	var button = $(this);

				    	let attachments = modal.data('components').attachments.pop();

				    	var data = {
				    		coaching: {
				    			id: modal.find('input[name="coaching[id]"]').val(),
				    			date: modal.find('input[name="coaching[date]"]').val(),
					    		type: (modal.find('select[name="coaching[type]"]').val() == 'Others') 
					    			? modal.find('input[name="coaching[type][others]"]').val() 
					    			: modal.find('select[name="coaching[type]"]').val(),
					    		overview: modal.find('textarea[name="coaching[overview]"]').val(),
					    		strengths: modal.find('textarea[name="coaching[strengths]"]').val(),
					    		AFI: modal.find('textarea[name="coaching[AFI]"]').val(),
					    		action_steps: modal.find('textarea[name="coaching[action_steps]"]').val(),
					    		comments: modal.find('textarea[name="coaching[comments]"]').val(),
					    		attachments: attachments
				    		}
				    	}
				    	
				    	$.ajax({
				    		url: button.data('ajax-url'),
				    		type: 'post',
				    		dataType: 'json',
				    		data: data,
				    		beforeSend: function() {
				    			button.button('loading');
				    			window.OSnet.Components.Alert.clear('#coaching-alert');
				    		},
				    		success: function (response) {
				    			if (response.status.text == 'success') {
				    				modal.one('hidden.bs.modal', function() {
					    				window.OSnet.Components.Alert.show('#coaching-alert', 'success', 'Success!', 'Coaching log successfully updated.', true);
					    				Coaching.table.ajax.reload();
					    			});
				    			}
				    		}
				    	})
				    	.always(function() {
				    		button.button('reset');
							modal.modal('hide');
				    	});
				    });
				}
			}
		})
		.always(function () {
			modal.find('.modal-loading').slideUp();
			modal.find('.modal-body, .modal-footer').slideDown();
		});
	})
	.on('hide.bs.modal', '.modal[data-module="coaching"]#edit', function() {
		$(this).data('components').attachments.clean();
	});
	// Edit Coaching @code end


	// Delete Coaching @code begin
	$(document).on('click', '.coaching-delete', function(event) {
		event.preventDefault();

		var button = $(this);

		var coaching = {
			id: $(this).data('id')
		}
		
		var proceed = confirm('Are you sure you want to delete this coaching log?\nThis cannot be undone.');
	
		if (coaching.id && proceed) {
			$.ajax({
				url: button.data('ajax-url'),
				type: 'post',
				dataType: 'json',
				data: {
					coaching: coaching
				},
				beforeSend: function() {
					window.OSnet.Components.Alert.clear('#coaching-alert');
				},
				success: function(response) {
					if (response.status.text == 'success') {
						window.OSnet.Components.Alert.show('#coaching-alert', 'success', 'Sucess!', 'Coaching log successfully deleted.', true);
						Coaching.table.ajax.reload();
					}
				}
			});
		}
	});
	// Delete Coaching @code end

	$('#modal.container').on('hidden.bs.modal', '.modal', function() {
		
		$(this).remove();
	}); // Modal Housekeeper
});