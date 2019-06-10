$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip()

    let Schedule = {
        tables: {}
    };

    if ($('#operation-managers-table').length) {
        Schedule.tables['operation_managers'] = $('#operation-managers-table').DataTable({
            'processing': true,
            'serverSide': true,
            'ajax': {
                url: $('#operation-managers-table').data('ajax-url'),
                data: function(data) {
                    let department = $('select[name="department[id]"]');

                    if (department.length) {
                        data.department = {
                            id: department.val()
                        };
                    }

                    let team = $('select[name="team[id]"]');
                    data.team = {
                        id: team.val()
                    };

                    let employee = $('input[name="employee[search]"]');
                    data.employee = {
                        search: employee.val()
                    };
                }
            },
            'searching': false,
            'columns': [
                {
                    'name': '#', 'data': '#', 'orderable': false},
                {
                    'name': 'name', 'data': 'name'
                },
                {
                    'name': 'clients', 
                    'data': 'clients',
                    'orderable': false,
                    render: function(data, type, row, meta) {
                        let clients = data.split(';');

                        let string = clients.shift();

                        if (clients.length) {
                            let count = clients.length;
                            let title = clients.join('<br />');

                            string += ' and <a href="#" data-toggle="tooltip" data-placement="top" data-html="true" title="'+title+'" class="more">' + count + ' more</a>';
                        }

                        return string;
                    }
                },
                {
                    'name': 'action',
                    'orderable': false,
                    render: function(data, type, row, meta) {
                        if (row.action.plot) {
                            let icon = $('<span />').attr('class', 'fa fa-calendar');

                            let a = $('<a />').attr({
                                'class': 'set-schedule',
                                'data-id': row.user_id,
                                'href': '#'
                            })
                            .append(icon)
                            .append(' Set Schedule');
                        
                            let container = $('<div />');

                            container.append(a);

                            return container.html();
                        
                        } else {
                            return '';
                        }
                    }
                }
            ]
        });
    }

    if ($('#account-managers-table').length) {
        Schedule.tables['account_managers'] = $('#account-managers-table').DataTable({
            'processing': true,
            'serverSide': true,
            'ajax': {
                url: $('#account-managers-table').data('ajax-url'),
                data: function(data) {
                    let department = $('select[name="department[id]"]');

                    if (department.length) {
                        data.department = {
                            id: department.val()
                        };
                    }

                    let team = $('select[name="team[id]"]');
                    data.team = {
                        id: team.val()
                    };

                    let employee = $('input[name="employee[search]"]');
                    data.employee = {
                        search: employee.val()
                    };
                }
            },
            'searching': false,
            'columns': [
                {
                    'name': '#', 'data': '#', 'orderable': false},
                {
                    'name': 'name', 'data': 'name'
                },
                {
                    'name': 'clients', 
                    'data': 'clients',
                    'orderable': false,
                    render: function(data, type, row, meta) {
                        let clients = data.split(';');

                        let string = clients.shift();

                        if (clients.length) {
                            let count = clients.length;
                            let title = clients.join('<br />');

                            string += ' and <a href="#" data-toggle="tooltip" data-placement="top" data-html="true" title="'+title+'" class="more">' + count + ' more</a>';
                        }

                        return string;
                    }
                },
                {
                    'name': 'action',
                    'orderable': false,
                    render: function(data, type, row, meta) {
                        if (row.action.plot) {
                            let icon = $('<span />').attr('class', 'fa fa-calendar');

                            let a = $('<a />').attr({
                                'class': 'set-schedule',
                                'data-id': row.user_id,
                                'href': '#'
                            })
                            .append(icon)
                            .append(' Set Schedule');
                        
                            let container = $('<div />');

                            container.append(a);

                            return container.html();
                        
                        } else {
                            return '';
                        }
                    }
                }
            ]
        });
    }

    if ($('#floor-managers-table').length) {
        Schedule.tables['floor_managers'] = $('#floor-managers-table').DataTable({
            'processing': true,
            'serverSide': true,
            'ajax': {
                url: $('#floor-managers-table').data('ajax-url'),
                data: function(data) {
                    let department = $('select[name="department[id]"]');

                    if (department.length) {
                        data.department = {
                            id: department.val()
                        };
                    }

                    let team = $('select[name="team[id]"]');
                    data.team = {
                        id: team.val()
                    };

                    let employee = $('input[name="employee[search]"]');
                    data.employee = {
                        search: employee.val()
                    };
                }
            },
            'searching': false,
            'columns': [
                {
                    'name': '#', 'data': '#', 'orderable': false},
                {
                    'name': 'name', 'data': 'name'
                },
                {
                    'name': 'teams', 
                    'data': 'teams',
                    'orderable': false,
                    render: function(data, type, row, meta) {
                        let clients = data.split(';');

                        let string = clients.shift();

                        if (clients.length) {
                            let count = clients.length;
                            let title = clients.join('<br />');

                            string += ' and <a href="#" data-toggle="tooltip" data-placement="top" data-html="true" title="'+title+'" class="more">' + count + ' more</a>';
                        }

                        return string;
                    }
                },
                {
                    'name': 'action',
                    'orderable': false,
                    render: function(data, type, row, meta) {
                        if (row.action.plot) {
                            let icon = $('<span />').attr('class', 'fa fa-calendar');

                            let a = $('<a />').attr({
                                'class': 'set-schedule',
                                'data-id': row.user_id,
                                'href': '#'
                            })
                            .append(icon)
                            .append(' Set Schedule');
                        
                            let container = $('<div />');

                            container.append(a);

                            return container.html();
                        
                        } else {
                            return '';
                        }
                    }
                }
            ]
        });
    }

    Schedule.tables['employees'] = $('#employees-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: $('#employees-table').data('ajax-url'),
            data: function(data) {
                let department = $('select[name="department[id]"]');

                if (department.length) {
                    data.department = {
                        id: department.val()
                    };
                }

                let team = $('select[name="team[id]"]');
                data.team = {
                    id: team.val()
                };

                let employee = $('input[name="employee[search]"]');
                data.employee = {
                    search: employee.val()
                };
            }
        },
        iDisplayLength: $('#employees-table').data('length'),
        searching: false,
        columns: [
            {
                'name': '#', 'data': '#', 'orderable': false},
            {
                'name': 'name', 'data': 'name'
            },
            {
                'name': 'teams', 
                'data': 'teams',
                render: function(data, type, row, meta) {
                    let container = $('<div />');
                    
                    if (data) {
                        let teams = data.split(';');

                        let string = teams.shift();

                        if (teams.length) {
                            let count = teams.length;
                            let title = teams.join('<br />');

                            string += ' and <a href="#" data-toggle="tooltip" data-placement="top" data-html="true" title="' + title + '" class="more">' + count + ' more</a>';
                        }
                    
                        container.append(string);
                    } else {
                        let label = $('<label />').attr('class', 'label label-warning').text('Not Assigned');
                        container.append(label);
                    }

                    return container.html();
                }
            },
            {
                'name': 'action',
                'orderable': false,
                render: function(data, type, row, meta) {
                    if (row.action.plot) {
                        let icon = $('<span />').attr('class', 'fa fa-calendar');

                        let a = $('<a />').attr({
                            'class': 'set-schedule',
                            'data-id': row.user_id,
                            'href': '#'
                        })
                        .append(icon)
                        .append(' Set Schedule');
                    
                        let container = $('<div />');

                        container.append(a);

                        return container.html();
                    
                    } else {
                        return '';
                    }
                }
            }
        ]
    })

    Schedule.tables['teams'] = $('#activate_users_table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: $('#activate_users_table').data('ajax-url'),
            data: function(data) {
                let department = $('select[name="department[id]"]');

                if (department.length) {
                    data.department = {
                        id: department.val()
                    };
                }

                let team = $('select[name="team[id]"]');
                data.team = {
                    id: team.val()
                };

                let employee = $('input[name="employee[search]"]');
                data.employee = {
                    search: employee.val()
                };
            },
            dataSrc: function(json) {
                let dropdown = $('select[name="team[id]"]');

                let selected = dropdown.val();

                dropdown.html($('<option />').attr('value', '').text('-- Select all --'));

                let teams = json.teams;
                
                $.each(json.teams, function(index, team) {
                    dropdown.append($('<option />').attr('value', team.team_id).text(team.team_name));
                });

                selected = (dropdown.find('option[value="' + selected + '"]').length) ? selected : '';
                dropdown.val(selected);

                return json.data;
            }
        },
        searching: false,
        'columns': [
            {
                'name': '#', 'data': '#', 'orderable': false},
            {
                'name': 'name', 'data': 'name'
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

                    if ($('input[name="employee[search]"]').data('search')) {
                        
                        let results = (row.results) ? row.results.replace(/;/g, '<br />') : '';
                        
                        let icon = $('<span />').attr({
                            'class': 'fa fa-filter',
                        });

                        let a = $('<a />')
                            .attr({
                                'href': '#',
                                'data-placement': 'top',
                                'data-toggle': 'tooltip',
                                'title': results,
                                'data-html': true, 
                            })
                            .css({
                                'text-decoration': 'underline'
                            })
                            .append(data + ' ')
                            .append(icon)
                            .append(' Found');

                        container.append(a);

                    } else {
                        container.append(data);
                    }

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
                        let icon = $('<span />').attr('class', 'fa fa-calendar');

                        let a = $('<a />').attr({
                            'class': 'activate_wrapper',
                            'data-id': row.team_id,
                            'data-team': row.name,
                            'data-tl': row.team_leader_id,
                            'href': '#'
                        })
                        .append(icon)
                        .append(' Set Schedule');

                        container.append(a);
                    }
                    
                    return container.html();
                }
            }
        ]
    });

    $('input[name="employee[search]"]').keypress(function(event) {
        if (event.which == 13) {
            let employee = $.trim($(this).val());

            $(this).data('search', employee);

            $('select[name="department[id]"]').val(null);

            $('select[name="team[id]"]').val(null);

            for (let key in Schedule.tables) {
                Schedule.tables[key].ajax.reload(function(json) {
                    let tab = key.replace(/_/g, '-');

                    $('.nav-tabs a[href="#' + tab + '-tab"] .badge').text((employee && json.recordsFiltered) ? json.recordsFiltered : null);
                });
            }
            console.log('search');
        }
    });

    $('select[name="department[id]"], select[name="team[id]"]').on('change', function() {
        let department = $('select[name="department[id]"]').val();
        let team = $('select[name="team[id]"]').val();
        let employee = $('input[name="employee[search]"]').data('search');

        let filter = (department || team || employee);

        for (let key in Schedule.tables) {
            Schedule.tables[key].ajax.reload(function (json) {
                let tab = key.replace(/_/g, '-');

                $('.nav-tabs a[href="#' + tab + '-tab"] .badge').text((filter && json.recordsFiltered) ? json.recordsFiltered : null);
            });
        }
        console.log('changed');
    });

    $('#employee-schedule-modal').on('click', '.dropdown .dropdown-menu li a', function() {
        let icon = $(this).find('span.fa').attr({
            'class': 'fa'
        });

        if ($(this).hasClass('selected')) {
            icon.addClass('fa-square-o');
            
            $(this).attr({
                'class': ''
            });

        } else {
            icon.addClass('fa-check-square');
            
            $(this).attr({
                'class': 'selected'
            });
        }

        let menu = $(this).parents('.dropdown-menu')

        let days = menu.find('a.selected').map(function() {
            return $(this).data('day');
        }).get();
        
        $(this).parents('.dropdown').find('input')
            .data('days', days.join(',').toLowerCase())
            .val(days.join(', '));

        return false;
    });

    $('#employee-schedule-modal').on('click', '.new-schedule-row', function() {
        let row = $(this).parents('tr');

        let template = $('<div />').html($('#template-schedule[name="row[employee][schedule]"]').html());

        row.after(template.html());
    });

    $('#employee-schedule-modal').on('click', '.delete-schedule-row', function() {
        let row = $(this).parents('tr');

        if (row.siblings().length) {
            row.remove();
        
        } else {
            row.find('input[name="schedules[][days]"]').val(null).data('days', null);
            row.find('ul.dropdown-menu li a').map(function () {
                $(this).removeClass('selected').find('span').attr('class', 'fa fa-square-o');
            });

            row.find('input[name="schedules[][time][in]"]').val(null);
            row.find('input[name="schedules[][time][out]"]').val(null);
            row.find('input[name="schedules[][break]"]').val(null);
        }
    });

    $('#employees-table, #operation-managers-table, #account-managers-table, #floor-managers-table').on('click', '.set-schedule', function(event) {
        event.preventDefault();

        let button = $(this);

        $('#employee-schedule-modal').find('input[name="user[id]"]').val(button.data('id'));
        $('#employee-schedule-modal').modal('show');
    });

    $('#employee-schedule-modal').on('click', '#update-schedule', function() {
        let button = $(this);

        let modal = button.parents('.modal#employee-schedule-modal');
        let id = modal.find('input[name="user[id]"]').val();

        let rows = modal.find('table tbody');
        
        let update = true;

        let schedules = rows.find('tr').map(function() {
            let row = $(this);

            let days = row.find('input[name="schedules[][days]"]').data('days');

            let schedule = {
                user: {
                    id: id,
                },
                days: (days) ? days : '',
                break: row.find('input[name="schedules[][break]"]').val(),
                time: {
                    in: row.find('input[name="schedules[][time][in]"]').val(),
                    out: row.find('input[name="schedules[][time][out]"]').val()
                },
                id: row.find('input[name="schedules[][id]"]').val()
            };
            
            row.find('.form-group').removeClass('has-error');
            
            if (schedule.days != '' || schedule.time.in != '' || schedule.time.out != '') {
                
                if (schedule.days == '') {
                    row.find('input[name="schedules[][days]"]').parents('.form-group').addClass('has-error');
                    update = false;
                }

                if (schedule.time.in == '') {
                    row.find('input[name="schedules[][time][in]"]').parents('.form-group').addClass('has-error');
                    update = false;
                }

                if (schedule.time.out == '') {
                    row.find('input[name="schedules[][time][out]"]').parents('.form-group').addClass('has-error');
                    update = false;
                }
            }

            if (schedule.days && schedule.time.in && schedule.time.out) {
                return schedule;
            }
        }).get();

        if (id && update) {
            $.ajax({
                url: button.data('ajax-url'),
                type: 'post',
                dataType: 'json',
                data: {
                    user: {
                        id: id,
                    },
                    schedules: schedules
                },
                beforeSend: function() {
                    button.button('loading');
                },
                success: function(response) {
                    if (response.status.text == 'success') {
                        
                        modal.one('hidden.bs.modal', function() {
                            window.OSnet.Components.Alert.show(
                                '.schedule-management-alert', 
                                'success', 
                                'Success!', 
                                'Schedule successfully updated.', 
                                true
                            );
                        });
                    }
                }
            })
            .always(function () {
                setTimeout(function () {
                    button.button('reset');

                    modal.modal('hide');
                }, 500);
            });
        }
    })

    $('#employee-schedule-modal').on('shown.bs.modal', function() {
        let modal = $(this);

        $.ajax({
            url: modal.data('ajax-url'),
            type: 'post',
            dataType: 'json',
            data: {
                user: {
                    id: modal.find('input[name="user[id]"]').val()
                }
            },
            success: function(response) {
                if (response.status.text == 'success') {
                    let name = modal.find('.modal-title small');

                    let loading = modal.find('.modal-loading');
                    let body = modal.find('.modal-body');
                    let footer = modal.find('.modal-footer');

                    let table = modal.find('table tbody');
                        table.html(null);

                    let schedules = response.data.schedules;

                    if (schedules.length) {
                        $.each(schedules, function(index, schedule) {
                            let template = $('<div />').html($('#template-schedule[name="row[employee][schedule]"]').html());
                        
                            template.find('input[name="schedules[][id]"]').val(schedule.id);
                            template.find('input[name="schedules[][days]"]').attr({
                                'data-days': schedule.days
                            });
                            
                            let days = $.map(schedule.days.split(','), function(day) {
                                day = day.charAt(0).toUpperCase() + day.slice(1);
                                
                                template.find('ul.dropdown-menu li a[data-day="' + day + '"]').addClass('selected')
                                    .find('span')
                                    .attr('class', 'fa fa-check-square');

                                return day;
                            });

                            template.find('input[name="schedules[][days]"]').val(days.join(', '));
                        
                            template.find('input[name="schedules[][time][in]"]').val(schedule.time_in);
                            template.find('input[name="schedules[][time][out]"]').val(schedule.time_out);
                            
                            template.find('input[name="schedules[][break]"]').val(schedule.break);

                            table.append(template.contents());
                        });

                    } else {
                        let template = $('<div />').html($('#template-schedule[name="row[employee][schedule]"]').html());
                        table.append(template.contents());
                    }

                    name.fadeTo('normal', 0, function() {
                        name.html(response.data.user.name.full);
                        name.fadeTo('normal', 1);

                        loading.slideUp();
                        body.add(footer).slideDown();
                    });
                }
            },
        })
        .always(function () {

        });
    })
    .on('hidden.bs.modal', function() {
        // Modal Housekeeping
        let modal = $(this);
        let name = modal.find('.modal-title small');

        let loading = modal.find('.modal-loading');
        let body = modal.find('.modal-body');
        let table = modal.find('table tbody');
        let footer = modal.find('.modal-footer');

        name.html(null);

        loading.show();
        body.add(footer).hide();
        
        table.html(null);
    });
});