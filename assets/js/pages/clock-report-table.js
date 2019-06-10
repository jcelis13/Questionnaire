$(document).ready(function() {
    let Clock = {
        table: null
    };

    Clock.table = $('#activate_users_table').DataTable({
        dom: "<'row'<'col-sm-3'l><'col-sm-3'f><'col-sm-6'p>>" + 
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        processing: true,
        serverSide: true,
        ajax: {
            url: $('#activate_users_table').data('ajax-url'),
            data: function(data) {
                let department = $('select[name="department[id]"]');

                if (department.length) {
                    data.department = {
                        id: department.val()
                    };
                }

                let team = $('input[name="team[search]"]');
                data.team = {
                    search: team.val()
                };

                console.log(data);
            }
        },
        oLanguage: {
            sProcessing: $('#activate_users_table').data('language-processing')
        },
        searching: false,
        iDisplayLength: $('#activate_users_table').data('length'),
        order: [
            [1, 'asc']
        ],
        columns: [
            {
                'name': '#', 'data': '#', 'orderable': false},
            {
                'name': 'name', 'data': 'name'
            },
            {
                'name': 'department', 'data': 'department',
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                'name': 'team_leader', 
                'data': 'team_leader',
                render: function(data, type, row, meta) {
                    let container = $('<div />');

                    if (data) {
                        container.append(data);
                    } else {
                        let label = $('<label />').attr('class', 'label label-warning').text('No Team Leader');
                        container.append(label);
                    }
                    return container.html();
                }
            },
            {
                'name': 'team_member_count', 
                'data': 'team_member_count',
                createdCell: function(td) {
                    $(td).addClass('text-center');
                },
                render: function(data, type, row, meta) {
                    let container = $('<div />');
                        container.append(data);

                    return container.html();
                }
            },
            {
                'name': 'action',
                'orderable': false,
                render: function(data, type, row, meta) {
                    let container = $('<div />');
                    
                    if (row.team_member_count == 0) {
                        let label = $('<label />').attr('class', 'label label-warning')
                            .text('No Team Members');

                        container.append(label);
                    
                    } else {
                        let icon = $('<span />').attr('class', 'fa fa-file-text-o');

                        let a = $('<a />').attr({
                            'class': 'activate_wrapper',
                            'data-id': row.team_id,
                            'data-team': row.name,
                            'data-tl': row.team_leader_id,
                            'href': '#'
                        })
                        .append(icon)
                        .append(' Generate Report');

                        container.append(a);
                    }
                    
                    return container.html();
                }
            }
        ]
    });

    $('select[name="department[id]"]').on('change', function() {
        Clock.table.ajax.reload();
    });

    $('input[name="team[search]"]').on('keypress', function(event) {
        if (event.which == 13) {
            $('select[name="department[id]"]').val(null);
            Clock.table.ajax.reload();
        } 
    });
});