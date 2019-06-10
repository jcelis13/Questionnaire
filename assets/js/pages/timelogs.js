(function($) {
	$(document).ready(function() {
		var Table = {
			Team: {
				options: {
					'pagingType': 'full_numbers',
		            'iDisplayLength': 25,
		            'bSort' : false,
		            'searching' : false,
		            'processing': true,
					'serverSide': true,
					'ajax': {
						url: $('#activate_users_table').data('team-ajax-url'),
						data: function(data) {
							console.log($('select[name="department"]'));
							data.department = $('select[name="department"]').val();
							data.search = $('input[name="search[term]"').val();
						}
					},
					columns: [
						{
							'render': function(data, type, row, meta) {
								var page = $('#activate_users_table').DataTable().page.info();
								return page.start + meta.row + 1;
							} 
						},
						{
							'data': 'team',
						},
						{
							'data': 'team_leader',
							'render': function(data, type, row, meta) {
								return (data == null) ? '-' : data;
							}
						},
						{
							'data': 'department',
						},
						{
							'data': 'team_members_count',
							'createdCell': function(cell) {
								$(cell).addClass('text-center');
							},
							'render': function(data, type, row, meta) {
								var template = $('<div />').append(
									$('<label />').attr({
										'class': 'label label-primary'
									}).text(data + ' active')
								);

								return template.html();
							}
						},
						{
							'data': null,
							createdCell: function(cell) {
								$(cell).addClass('text-center');
							},
							'render': function(data, type, row, meta) {
								var template = $('<div />');
								var anchor = $('<a />').attr({
									'href': '#',
									'class': 'activate_wrapper',
									'data-id': row.team_id,
									'data-team': row.team,
									'data-tl': row.team_leader_id
								}).append(
									$('<i />').attr('class', 'fa fa-eye')
								).append(' View Team');

								template.append(anchor);

								return template.html();
							}
						}
					]
				}
			},
			Employee: {
				options: {
					pagingType: 'full_numbers',
		            iDisplayLength: 25,
		            bSort: false,
		            searching: false,
		            processing: true,
					serverSide: true,
					ajax: {
						url: $('#activate_users_table').data('employee-ajax-url'),
						data: function(data) {
							data.department = $('select[name="department"]').val();
							data.search = $('input[name="search[term]"').val();
						}
					},
					columns: [
						{
							render: function(data, type, row, meta) {
								var page = $('#activate_users_table').DataTable().page.info();
								return page.start + meta.row + 1;
							} 
						},
						{
							data: 'employee',
						},
						{
							data: 'team', 
							render: function(data, type, row, meta) {
								return (data == null) ? 'N/A' : data;
							}
						},
						{
							data: 'team_leader',
							'render': function(data, type, row, meta) {
								return (data == null) ? 'N/A' : data;
							}
						},
						{
							render: function(data, type, row, meta) {
								var template = $('<div />');
								var anchor = $('<a />').attr({
									'href': '#',
									'class': 'activate_wrapper',
									'data-id': row.team_id,
									'data-team': row.team,
									'data-tl': row.team_leader_id
								}).append(
									$('<i />').attr('class', 'fa fa-eye')
								).append(' View Team');

								template.append(anchor);

								return template.html();
							}
						}
					]
				}
			},
		}

		$('select[name="search[type]"]').on('change', function() {
			$('input[name="search[term]"]').focus();
		});

		$('select[name="department"]').on('change', function() {
			$('#activate_users_table').DataTable().clear().destroy();
			heading('team');

			$('#activate_users_table').DataTable(Table.Team.options);
			$('select[name="search[type]"]').val($('select[name="search[type]"] option:first-child').val());
		});
		
		$('input[name="search[term]"').keyup(function(event) {
			if (event.which == 13) {
				var select = $('select[name="search[type]"]')
				var input = $('select[name="search[term]"]');
				var search = select.val();
				
				if (input.data('type') == search) {	
					$('#activate_users_table').DataTable().ajax.reload();

				} else {
					$('#activate_users_table').DataTable().destroy();

					input.attr('data-type', search).data('type', search);

					heading(search); // Change Table Heading

					$('#activate_users_table tbody').html(null);

					var options;

					switch(search) {
						case 'employee':
							options = Table.Employee.options;
							break;

						case 'team':
							options = Table.Team.options;
							break;
					}

					// Re-initialize Table
					$('#activate_users_table').DataTable(options);
				}
			}
		});

		function heading(type) {
			var row = $('<tr />').attr('role', 'row');
			var headings = ['#'];
			
			switch(type) {
				case 'employee':
					headings = headings.concat(['Name', 'Team', 'Team Leader']);
					break;

				case 'team':
					headings = headings.concat(['Team', 'Team Leader', 'Department', 'Member Count']);
					break;
			}

			headings = headings.concat(['Action']);
			
			for(var index in headings) {
				row.append(
					$('<th />').html(headings[index])
				);
			}
			
			$('#activate_users_table thead').html($('<thead />').append(row).contents());
		}

		$('#activate_users_table').DataTable(Table.Team.options);
	});
} (jQuery));