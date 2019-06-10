(function(window, $) {
	if (typeof $ == 'undefined') {
		throw new Error('Leave statistics page requires jQuery.');
	}

	$(document).ready(function () {
		$('#export-statistics').on('click', function() {
			var button = $(this);
			var table = $('table#leave_stat_table').DataTable();

			if (table.rows().data().length == 0) {
				alert('Sorry, there\'s no statistics to export.');

			} else {
				var department = $('select#leave_stat_department').val();
				var team = $('select#leave_stat_team').val();

				var url  = button.data('export-url') + '/' + department + '/' + team;

				location.href = url;
			}
		});
	});
	
} (window, jQuery));