var salary = {
    'monthly_gross': 0,
    'monthly_basic': 0,
    'daily_gross': 0,
    'daily_basic': 0
},
    clone_salary = null,
    user_id = null,
    ehmo_id = null;

var hmo = {
    'hmo_id': 3,
    'selected_hmo_id': 3
},
    clone_hmo = null;

var dependent = {
    'fname': '',
    'lname': '',
    'mname': '',
    'dependent_gender': 1,
    'dependent_dob': '',
    'dependent_relationship': 1,
    'dependent_taxable': 0
};

var dependent_hmo = {
    'dependent_id': '',
    'hmo_id': '',
    'id': ''
},
    clone_dependent_hmo = null,
    delete_hmo_id = null;

var principal_monthly = 0;

var incentive = {
    'type': null,
    'amount': 0,
    'user_id': null,
    'update_id': null
},
    update_incentive_id = null;

var loan = {
    'loan_type': 1,
    'loan_amount': '',
    'loan_interest': '',
    'loan_terms': '',
    'loan_due': '',
    'loan_current': '',
    'loan_remaining': '',
    'loan_date_granted': '',
    'loan_date_effective': ''
},
    update_loan = null,
    clone_loan = null,
    delete_loan = null;

var date_selected = null;

var optionSet = {
    autoUpdateInput: false,
    locale: {
        cancelLabel: 'Clear'
    },
    opens: 'left'
};

var log_details = null,
    update_log_id = null;

var pending_overtime_logs = null,
    update_overtime_data = null,
    pending_leave_logs = null,
    update_leave_data = null;

function bind_events() {
    $('.update_dependent_hmo, .remove_dependent_hmo').on('click', function (e) {
        if ($(this).attr('name') == 'remove_dependent_hmo') {
            $('.name-display').html($(this).data('name'));
            delete_hmo_id = $(this).data('dependent');
        } else {
            dependent_hmo.id = $(this).data('id');
            dependent_hmo.hmo_id = $(this).data('hmo');
            dependent_hmo.dependent_id = $(this).data('dependent');

            if ($(this).data('hmo') == null) {
                $('#hmo_dependent_save').prop('disabled', false);
            } else {
                $('#hmo_dependent_save').prop('disabled', true);
            }
            clone_dependent_hmo = JSON.parse(JSON.stringify(dependent_hmo));
            $('#selected_dependent_hmo_id').val(dependent_hmo.hmo_id == null ? 6 : dependent_hmo.hmo_id);
        }
    });

    $('.update_incentive, .remove_incentive').on('click', function (e) {
        update_incentive_id = $(this).data('id');
        $('#update_incentive_type').val($(this).data('incentive'));
    });

    $('.update_loan, .remove_loan').on('click', function (e) {
        if ($(this).attr('name') == 'remove_loan') {
            delete_loan = $(this).data('id');
        } else {
            var index = $(this).data('index');
            update_loan = {
                'loan_type': clone_loan[index].loan_type_id,
                'loan_amount': clone_loan[index].amount,
                'loan_interest': clone_loan[index].interest,
                'loan_terms': clone_loan[index].terms_to_pay,
                'loan_due': clone_loan[index].amount_due,
                'loan_current': clone_loan[index].current_term,
                'loan_remaining': clone_loan[index].amount_remaining,
                'loan_date_granted': clone_loan[index].date_granted,
                'loan_date_effective': clone_loan[index].date_start,
                'loan_id': clone_loan[index].loan_id
            };

            $('#update_loan_type').val(clone_loan[index].loan_type_id);
            $('#update_loan_amount').val(clone_loan[index].amount);
            $('#update_loan_interest').val(clone_loan[index].interest);
            $('#update_loan_terms').val(clone_loan[index].terms_to_pay);
            $('#update_loan_due').val(clone_loan[index].amount_due);
            $('#update_loan_current').val(clone_loan[index].current_term);
            $('#update_loan_remaining').val(clone_loan[index].amount_remaining);
            $('#update_loan_date_granted').val(clone_loan[index].date_granted);
            $('#update_loan_date_effective').val(clone_loan[index].date_start);
        }
    });

    $('#mark-all-client').on('click', function () {
        $('.clientPaidId').prop('checked', true);
    });

    $('#mark-all-AOS').on('click', function () {
        $('.AOSPaidRadioId').prop('checked', 'checked');
    })

    $('.approve_overtime_action, .update_overtime_action, .remove_overtime_action').on('click', function (e) {
        var index = $(e.target).data('index');
        $('#total_pending_ot').html('');
        update_overtime_data = pending_overtime_logs[index];
        console.log(pending_overtime_logs);
        console.log(update_overtime_data);
        isClientPaid = $("input[name='isClientPaidRadio" + index + "' ]:checked").val();
        $('.overtime_form').addClass('hidden');
        switch ($(e.target).attr('name')) {
            case 'approve':
                $.ajax({
                    type: "POST",
                    url: site_url + "ajax/employee_overtime_ajax/approve_ot",
                    data: {
                        id: update_overtime_data.id,
                        action: 'approve',
                        isClientPaid: isClientPaid
                    },
                    beforeSend: function () {
                        $(e.target).removeClass('fa-thumbs-up').addClass('fa-spinner fa-pulse');
                        $('#approve_all_ot').prop('disabled', true);
                    },
                    success: function (result) {
                        $('#approve_all_ot').prop('disabled', false);
                        $(e.target).removeClass('fa-spinner fa-pulse').addClass('fa-thumbs-up');
                        if (result.message == 'failed') {
                            $('#pending_ot_error').removeClass('hidden').html(result.message);
                        } else {
                            repopulate_calendar(user_id);
                            $('#pending_ot_error').addClass('hidden').html('');
                            var remove_index = null;
                            $.each(pending_overtime_logs, function (key, value) {
                                if (value.id == update_overtime_data.id) {
                                    remove_index = key;
                                }
                            });
                            pending_overtime_logs.splice(remove_index, 1);

                            var pending_ot = "<tbody>";
                            if (pending_overtime_logs.length > 1) {
                                $('#total_pending_ot').html('(' + pending_overtime_logs.length + ')');
                                pending_ot += "<tr><td><b>Date</b></td><td><b>OT Type</b></td><td><b>Time In</b></td><td><b>Time Out</b></td><td><b>Duration</b></td><td style='width:23%; text-align:center;'> <b> Paid By <br> <a id='mark-all-client' style='margin-right:17px; color:#000; cursor:pointer;'>click all</a> <a id='mark-all-AOS' style='color:#000; cursor:pointer;' >click all</a></b></td><td><b>Action</b></td></tr>";
                            }else if(pending_overtime_logs.length == 1){
                                $('#total_pending_ot').html('(' + pending_overtime_logs.length + ')');
                                pending_ot += "<tr><td><b>Date</b></td><td><b>OT Type</b></td><td><b>Time In</b></td><td><b>Time Out</b></td><td><b>Duration</b></td><td style='width:23%; text-align:center;'> <b> Paid By </b></td><td><b>Action</b></td></tr>";
                            }else{
                                pending_ot += "<tr><td><b>Date</b></td><td><b>OT Type</b></td><td><b>Time In</b></td><td><b>Time Out</b></td><td><b>Duration</b></td><td style='width:23%; text-align:center;'> <b> Paid By </b></td><td><b>Action</b></td></tr>";
                            }

                            $.each(pending_overtime_logs, function (key, value) {
                                var time_in = moment(value.time_in, ["HH:mm"]).format("h:mm A"),
                                    time_out = moment(value.time_out, ["HH:mm"]).format("h:mm A");
                                let isClient = ((value.client_paid == 1) ? "checked" : "");
                                let isAOS = ((value.client_paid == 0) ? "checked" : "");
                                pending_ot += "<tr><td>" + value.date + "</td><td>" + value.overtime_name + "</td><td>" + time_in + "</td><td>" + time_out + "</td><td>" + value.duration + "</td>" +
                                    "<td><label class='radio-inline'> <input a data-index='" + key + "' type='radio' class='clientPaidId' name='isClientPaidRadio" + key + "' value='1' " + isClient + "> Client </input> </label> <label class='radio-inline'> <input a data-index='" + key + "' value='0' type='radio' class='AOSPaidRadioId' name='isClientPaidRadio" + key + "' " + isAOS + "> AOS </input> </label> </td>" +
                                    "<td><a data-index='" + key + "' name='approve' class='approve_overtime_action' style='margin-right: 5px'><i data-index='" + key + "' name='approve' class='fa fa-thumbs-up text-green'></i></a>" +
                                    "<a data-index='" + key + "' name='update' class='update_overtime_action' style='margin-right: 5px'><i data-index='" + key + "' name='update' class='fa fa-pencil'></i></a>" +
                                    "<a data-index='" + key + "' name='remove' class='remove_overtime_action' name='remove_overtime' data-toggle='modal' data-target='#delete_overtime'><i data-index='" + key + "' name='remove' class='fa fa-close text-red'></i></a></td></tr>";
                            });
                            pending_ot += "</tbody>";
                            $('#pending_ot_table').html(pending_ot);
                            if (pending_overtime_logs.length > 0) {
                                $('#approve_all_ot').prop('disabled', false);
                            } else {
                                $('#approve_all_ot').prop('disabled', true);
                            }
                            bind_events();
                        }
                    }
                });
                break;
            case 'update':
                var time_in = moment(pending_overtime_logs[index].time_in, ["HH:mm"]).format("h:mm A"),
                    time_out = moment(pending_overtime_logs[index].time_out, ["HH:mm"]).format("h:mm A");
                $('#overtime_type').val(pending_overtime_logs[index].type);
                $('#paid_by').val(pending_overtime_logs[index].client_paid);
                $('#overtime_date').datepicker('setDate', pending_overtime_logs[index].date);
                $('#overtime_in').val(time_in);
                $('#overtime_out').val(time_out);
                $('#overtime_duration').val(pending_overtime_logs[index].duration);
                $("#overtime_approval").prop('checked', false);
                $('#pending_overtime').modal('hide');
                $('.overtime_form').removeClass('hidden');
                $('#title_display').html('<b>Edit Employee Overtime</b>');
                if (pending_overtime_logs[index].duration == '00:00') {
                    $('#add_overtime').prop('disabled', true).html('Update');
                } else {
                    $('#add_overtime').prop('disabled', false).html('Update');
                }
                break;
            case 'remove':
                $.ajax({
                    type: "POST",
                    url: site_url + "ajax/employee_overtime_ajax/ajax_delete_overtime_entry",
                    data: {
                        overtime_id: update_overtime_data.id
                    },
                    beforeSend: function () {
                        $(e.target).removeClass('fa-close').addClass('fa-spinner fa-pulse');
                        $('#approve_all_ot').prop('disabled', true);
                    },
                    success: function (result) {
                        $('#approve_all_ot').prop('disabled', false);
                        $(e.target).removeClass('fa-spinner fa-pulse').addClass('fa-close');
                        if (result.message == 'failed') {
                            $('#pending_ot_error').html(result.message);
                        } else {
                            $('#pending_ot_error').html('');
                            var remove_index = null;
                            $.each(pending_overtime_logs, function (key, value) {
                                if (value.id == update_overtime_data.id) {
                                    remove_index = key;
                                }
                            });
                            pending_overtime_logs.splice(remove_index, 1);

                            var pending_ot = "<tbody>";
                            if (pending_overtime_logs.length > 1) {
                                $('#total_pending_ot').html('(' + pending_overtime_logs.length + ')');
                                pending_ot += "<tr><td><b>Date</b></td><td><b>OT Type</b></td><td><b>Time In</b></td><td><b>Time Out</b></td><td><b>Duration</b></td><td style='width:23%; text-align:center;'> <b> Paid By <br> <a id='mark-all-client' style='margin-right:17px; color:#000; cursor:pointer;'>click all</a> <a id='mark-all-AOS' style='color:#000; cursor:pointer;' >click all</a></b></td><td><b>Action</b></td></tr>";
                            }else if(pending_overtime_logs.length == 1){
                                $('#total_pending_ot').html('(' + pending_overtime_logs.length + ')');
                                pending_ot += "<tr><td><b>Date</b></td><td><b>OT Type</b></td><td><b>Time In</b></td><td><b>Time Out</b></td><td><b>Duration</b></td><td style='width:23%; text-align:center;'> <b> Paid By </b></td><td><b>Action</b></td></tr>";
                            }else{
                                pending_ot += "<tr><td><b>Date</b></td><td><b>OT Type</b></td><td><b>Time In</b></td><td><b>Time Out</b></td><td><b>Duration</b></td><td style='width:23%; text-align:center;'> <b> Paid By </b></td><td><b>Action</b></td></tr>";
                            }
                            
                            $.each(pending_overtime_logs, function (key, value) {
                                var time_in = moment(value.time_in, ["HH:mm"]).format("h:mm A"),
                                    time_out = moment(value.time_out, ["HH:mm"]).format("h:mm A");
                                let isClient = ((value.client_paid == 1) ? "checked" : "");
                                let isAOS = ((value.client_paid == 0) ? "checked" : "");
                                pending_ot += "<tr><td>" + value.date + "</td><td>" + value.overtime_name + "</td><td>" + time_in + "</td><td>" + time_out + "</td><td>" + value.duration + "</td>" +
                                    "<td><label class='radio-inline'> <input a data-index='" + key + "' type='radio' class='clientPaidId' name='isClientPaidRadio" + key + "' value='1' " + isClient + "> Client </input> </label> <label class='radio-inline'> <input a data-index='" + key + "' value='0' type='radio' class='AOSPaidRadioId' name='isClientPaidRadio" + key + "' " + isAOS + "> AOS </input> </label> </td>" +
                                    "<td><a data-index='" + key + "' name='approve' class='approve_overtime_action' style='margin-right: 5px'><i data-index='" + key + "' name='approve' class='fa fa-thumbs-up text-green'></i></a>" +
                                    "<a data-index='" + key + "' name='update' class='update_overtime_action' style='margin-right: 5px'><i data-index='" + key + "' name='update' class='fa fa-pencil'></i></a>" +
                                    "<a data-index='" + key + "' name='remove' class='remove_overtime_action' name='remove_overtime' data-toggle='modal' data-target='#delete_overtime'><i data-index='" + key + "' name='remove' class='fa fa-close text-red'></i></a></td></tr>";
                            });
                            pending_ot += "</tbody>";
                            $('#pending_ot_table').html(pending_ot);
                            if (pending_overtime_logs.length > 0) {
                                $('#approve_all_ot').prop('disabled', false);
                            } else {
                                $('#approve_all_ot').prop('disabled', true);
                            }
                            bind_events();
                        }
                    }
                });
                break;
        }
    });

    $('.evaluate_leave_action, .remove_leave_action').on('click', function (e) {
        var index = $(e.target).data('index');
        update_leave_data = pending_leave_logs[index];

        if ($(e.target).attr('name') == 'evaluate') {

            var paid = (update_leave_data.paid == 1) ? 'Paid' : 'Unpaid',
                date_of_leave = (update_leave_data.duration_start === update_leave_data.duration_end) ?
                    update_leave_data.duration_start :
                    update_leave_data.duration_start + " to " + update_leave_data.duration_end;

            $('#leave_employee').html(update_leave_data.full_name);
            $('#leave_daterange').html(date_of_leave);
            $('#leave_date_filed').html(update_leave_data.date_recorded);
            $('#leave_view_status').html(update_leave_data.status);

            if (update_leave_data.status == 'ReviewedbyTL') {
                $('#reviewer_wrapper').removeClass('hidden');
                $('#leave_reviewer').html(update_leave_data.approved_by);
                $('#leave_remarks').addClass('hidden');
                $('#leave_remarks2').html(update_leave_data.remarks);

            } else {
                $('#leave_remarks').removeClass('hidden');
                $('#reviewer_wrapper').addClass('hidden');
                $('#leave_remarks2').html('');
            }

            $('#leave_view_nature').html(update_leave_data.nature);
            $('#leave_view_days_paid').html(update_leave_data.total_days);
            $('#leave_paid').html(paid);
            $('#leave_details').html(update_leave_data.reason);

            $('#pending_leaves').modal('hide');
            $("#view_leave_errors").addClass('hidden');
            $("#view_leave_errors").html('');
            $("#leave_remarks").val('');

            // Set Unpaid Checkbox
            $('.modal#evaluate_leaves input[type="checkbox"]#markunpaid').prop('checked', (update_leave_data.paid == 1) ? false : true);

            window.setTimeout(function () {
                $('#evaluate_leaves').modal('show').on('hidden.bs.modal', function () {
                    $('.pending-leave-action').trigger('click');
                });
            }.bind(this), 500);

        } else {
            $.ajax({
                type: "POST",
                url: site_url + 'ajax/leave_ajax/delete_leave',
                data: { id: update_leave_data.leave_id },
                beforeSend: function () {
                    $('remove_leave_action').html('<i class="fa fa-spinner fa-pulse"></i>');
                },
                success: function (data) {
                    repopulate_calendar(user_id);
                    $('remove_leave_action').html('<i class="fa fa-trash text-red"></i>');
                    $.ajax({
                        type: "POST",
                        url: site_url + "ajax/setup_ajax/get_pending_leaves",
                        data: {
                            user_id: user_id
                        },
                        beforeSend: function () {
                            $('#dropdown_pending').prop('disabled', true).html('Show Pending <i class="fa fa-spinner fa-pulse" style="margin-left: 5px;"></i>');
                        },
                        success: function (response) {
                            $('#dropdown_pending').prop('disabled', false).html('Show Pending <span class="caret" style="margin-left: 5px;"></span>');
                            pending_leave_logs = JSON.parse(response);
                            var pending_leave = "<tbody>";
                            pending_leave += "<tr><td><b>Date of Leave</b></td><td><b>Total Days</b></td><td><b>Nature</b></td><td><b>Reason</b></td><td><b>Status</b></td><td><b>Date Filed</b></td><td><b>Action</b></td></tr>";
                            $.each(pending_leave_logs, function (key, value) {
                                console.log(value);
                                var status = '<span class="label label-primary">' + value.status + '</span>';
                                if (value.status == 'Pending') {
                                    status = '<span class="label label-warning">' + value.status + '</span>';
                                }
                                var date_of_leave = value.duration_start === value.duration_end ? value.duration_start : value.duration_start + " to " + value.duration_end;
                                pending_leave += "<tr><td>" + date_of_leave + "</td><td>" + value.total_days + "</td><td>" + value.nature + "</td><td>" + value.reason + "</td><td>" + status + "</td><td>" + value.date_recorded + "</td>" +
                                    "<td><a data-index='" + key + "' title='Evaluate' name='evaluate' class='evaluate_leave_action' style='margin-right: 5px'><i data-index='" + key + "' name='evaluate' class='fa fa-legal'></i></a>" +
                                    "<a data-index='" + key + "' title='Archive' name='remove' class='remove_leave_action' style='margin-right: 5px'><i data-index='" + key + "' name='remove' class='fa fa-trash text-red'></i></a></td></tr>";
                            });
                            pending_leave += "</tbody>";
                            $('#pending_leave_table').html(pending_leave);
                            if (pending_leave_logs.length > 0) {
                                $('#approve_all_leave').prop('disabled', false);
                            } else {
                                $('#approve_all_leave').prop('disabled', true);
                            }
                            $('#pending_leaves').modal('show');
                            bind_events();
                        }
                    });
                }
            });
        }
    });
}

function repopulate_calendar(uid) {
    var calendar = $('#calendar_logs');
    calendar.empty();

    calendar.fullCalendar({
        eventSources: [{
            type: "POST",
            url: site_url + 'ajax/setup_ajax/get_employee_logs',
            data: {
                user_id: uid
            },
            success: function (response) {
                calendar.data('logs', response.logs);

                return response.events;
            }
        }],
        eventClick: function (event) {
            var auto_log = null,
                timeout = null;
            log_details = event.details;
            update_log_id = log_details.id;
            console.log(log_details);
            if ($(this).hasClass("cal-event")) {
                if (log_details.auto_logout > 0) {
                    auto_log = "<span class='text-red'>Yes</span>";

                } else {
                    auto_log = "<span class='text-green'>No</span>";
                }

                if (log_details.time_out) {
                    timeout = log_details.time_out;

                } else {
                    timeout = "<span class='text-orange'>Pending</span>";
                }

                $(".log_date").html(log_details.date);
                $(".log_sched_in").html(log_details.time_in_schedule);
                $(".log_in").html(log_details.time_in);
                $(".log_sched_out").html(log_details.time_out_schedule);
                $(".log_out").html(timeout);
                $(".log_late").html(log_details.late);
                $(".log_undertime").html(log_details.undertime);
                $(".log_auto_out").html(auto_log);
                $('#timelog_view').modal('show');

            } else if ($(this).hasClass("ot-event")) {
                $(".overtime_date").html(log_details.date);
                $(".overtime_type").html(log_details.overtime_name);
                $(".overtime_in").html(log_details.time_in);
                $(".overtime_out").html(log_details.time_out);
                $(".overtime_duration").html(log_details.duration);

                if (log_details.approved_by > 0) {
                    $(".overtime_approved_by").html(log_details.approved_by_name);

                } else {
                    $(".overtime_approved_by").html("<span class='text-orange'>Waiting for Approval</span>");
                }

                update_overtime_data = event.details;

                let buttons = {
                    edit: $('#overtime_view .modal-footer').find('#edit_overtime'),
                    delete: $('#overtime_view .modal-footer').find('#remove_overtime')
                };

                if (event.details.action.edit) {
                    buttons.edit.show();

                } else {
                    buttons.edit.hide();
                }

                if (event.details.action.delete) {
                    buttons.delete.show();

                } else {
                    buttons.delete.hide();
                }

                if (event.details.action.edit || event.details.action.delete) {
                    $('#overtime_view .modal-footer').show();

                } else {
                    $('#overtime_view .modal-footer').hide();
                }

                $("#overtime_view").modal("show");
            } else if ($(this).hasClass("leave-event")) {
                $(".leave_date").html(log_details.date_of_leave);
                $(".leave_nature").html(log_details.nature);
                $(".leave_reason").html(log_details.reason);
                $(".leave_status").html(log_details.status);
                update_leave_data = event.details;
                $("#leave_view").modal("show");
            } else if ($(this).hasClass("abs-event")) {
                $(".absent_date").html(log_details.date_absent);
                $(".absent_days").html(log_details.days_schedule);
                $(".absent_in").html(moment(log_details.time_in_schedule, ["HH:mm"]).format("hh:mm A"));
                $(".absent_out").html(moment(log_details.time_out_schedule, ["HH:mm"]).format("hh:mm A"));
                $(".absent_marked").html(log_details.time_marked_absent);
                $("#absent_view").modal("show");
            }
        },
        dayClick: function (day, jsEvent, view) {
            date_selected = $(this).data('date');

            let date = {
                input: new Date(day),
                today: new Date(),
                selected: moment(day)
            };
            let triggers = {
                overtime: $('#trigger_2'),
            };

            let logs = calendar.data('logs');

            if (date.input.setHours(0, 0, 0, 0) > date.today.setHours(0, 0, 0, 0)) {
                $('#trigger_1').prop('disabled', true).html('Timelog unavailable for future dates');
                $('#trigger_2').prop('disabled', true).html('OT unavailable for future dates');

            } else {
                $('#trigger_1').prop('disabled', false).html('Attendance');
                $('#trigger_2').prop('disabled', false).html('Overtime');
            }

            if (logs.overtime.plot) {
                triggers.overtime.show();

            } else {
                triggers.overtime.hide();
            }

            $('#date_display').html(date.selected.format('MMMM DD, YYYY'));
            $("#common_error").addClass('hidden').html('');
            $('#select_log_modal').modal('show');
        }
    });
}

function displayPayrollInfo(item, val, text) {
    console.log(item);
    console.log(text);
    user_id = val;
    repopulate_calendar(user_id);
    $.ajax({
        type: "POST",
        url: site_url + "ajax/setup_ajax/get_user_payroll_details",
        data: { user_id: val },
        beforeSend: function () {
            $('#dropdown_pending').prop('disabled', true).html('Show Pending <i class="fa fa-spinner fa-pulse" style="margin-left: 5px;"></i>');
            $('#update_compensation_modal').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i>');
            $('#update_principal_modal').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i>');
            $('#add_dependent').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i>');
            $('#add_incentive').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i>');
            $('#add_loan').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i>');
        },
        success: function (response) {
            $('#dropdown_pending').prop('disabled', false).html('Show Pending <span class="caret" style="margin-left: 5px;"></span>');
            $('#update_compensation_modal').prop('disabled', false).html('<i class="fa fa-pencil"></i> Update');
            $('#update_principal_modal').prop('disabled', false).html('<i class="fa fa-pencil"></i> Update');
            $('#add_dependent').prop('disabled', false).html('<i class="fa fa-plus"></i> Add Dependent');
            $('#add_incentive').prop('disabled', false).html('<i class="fa fa-plus"></i> Add Incentive');
            $('#add_loan').prop('disabled', false).html('<i class="fa fa-plus"></i> Add loan');
            $('.attendance_form').addClass('hidden');
            var result = JSON.parse(response);
            console.log(result);
            var hmo_dependent_table = "<tbody>";
            hmo_dependent_table += "<tr><td><b>Name</b></td><td><b>Selected HMO</b></td><td><b>Monthly Payable</b></td>";
            if (result.role_type != "GSD") { hmo_dependent_table += "<td><b>Action</b></td>"; }
            hmo_dependent_table += "</tr > ";
            $.each(result.employee_dependent_hmo, function (key, value) {
                var full_name = value.first_name + " " + value.last_name,
                    plan = value.hmo_plan == null ? 'not set' : value.hmo_plan,
                    monthly = value.hmo_monthly == null ? 0 : value.hmo_monthly;
                hmo_dependent_table += "<tr><td>" + full_name.toUpperCase() + "</td><td>" + plan + "</td><td>" + monthly + "</td>";
                if (result.role_type != "GSD") {
                    hmo_dependent_table += "<td><a data-dependent='" + value.dependent_id + "' data-id='" + value.id + "' data-hmo='" + value.hmo_id + "' data-toggle='modal' data-target='#update_hmo_dependent_modal' class='update_dependent_hmo modify-comp-btn' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-dependent='" + value.dependent_id + "' class='remove_dependent_hmo modify-comp-btn' name='remove_dependent_hmo' data-toggle='modal' data-target='#delete_dependent_hmo' data-name='" + full_name + "'><i class='fa fa-close text-red'></i></a></td>";
                }
                hmo_dependent_table += "</tr > ";
            });
            hmo_dependent_table += "</tbody>";
            $('#hmo_dependent_table').html(hmo_dependent_table);

            var incentive_table = "<tbody>";
            incentive_table += "<tr><td><b>Incentive Type</b></td><td><b>Amount</b></td>";
            if (result.role_type != "GSD") { incentive_table += "<td><b>Action</b></td>"; }
            incentive_table += "</tr > ";
            $.each(result.employee_incentives, function (key, value) {
                var incetive_type = value.label,
                    amount = value.amount;
                incentive_table += "<tr><td>" + incetive_type + "</td><td>" + amount + "</td>";
                if (result.role_type != "GSD") {
                    incentive_table += "<td><a data-incentive='" + value.incentive_id + "' data-id='" + value.id + "' data-toggle='modal' data-target='#update_incentive_modal' class='update_incentive modify-comp-btn' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-id='" + value.id + "' class='remove_incentive modify-comp-btn' name='remove_incentive' data-toggle='modal' data-target='#delete_incentive'><i class='fa fa-close text-red'></i></a></td>";
                }
                incentive_table += "</tr > ";
            });
            incentive_table += "</tbody>";
            $('#incentive_table').html(incentive_table);

            var loan_table = "<tbody>";
            loan_table += "<tr><td><b>Loan Type</b></td><td><b>Amount</b></td><td><b>Date Granted</b></td><td><b>Terms to Pay</b></td>";
            if (result.role_type != "GSD") { loan_table += "<td><b>Action</b></td>"; }
            loan_table += "</tr > ";
            $.each(result.employee_loans, function (key, value) {
                var loan_type = value.loan_type_name,
                    amount = value.amount;
                loan_table += "<tr><td>" + loan_type + "</td><td>" + amount + "</td>" + "<td>" + value.date_granted + "</td>" + "<td>" + value.terms_to_pay + "</td>";
                if (result.role_type != "GSD") {
                    loan_table += "<td><a data-index='" + key + "' data-toggle='modal' data-target='#update_loan_modal' class='update_loan modify-comp-btn' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-id='" + value.loan_id + "' class='remove_loan modify-comp-btn' name='remove_loan' data-toggle='modal' data-target='#delete_loan'><i class='fa fa-close text-red'></i></a></td>";
                }
                loan_table += "</tr > ";
            });
            loan_table += "</tbody>";
            $('#loan_table').html(loan_table);
            clone_loan = result.employee_loans;

            if (result.employee_hmo.length > 0) {
                principal_monthly = result.employee_hmo[0].selected_monthly - result.employee_hmo[0].granted_monthly;
                hmo.hmo_id = result.employee_hmo.length > 0 ? result.employee_hmo[0].hmo_id : 3;
                hmo.selected_hmo_id = result.employee_hmo.length > 0 ? result.employee_hmo[0].selected_hmo_id : 3;
                ehmo_id = result.employee_hmo.length > 0 ? result.employee_hmo[0].ehmo_id : 0;
                $('#hmo_principal_save').prop('disabled', true);
                $('#delete_principal_hmo').prop('disabled', false);
                clone_hmo = JSON.parse(JSON.stringify(hmo));
            } else {
                principal_monthly = 0;
                ehmo_id = 0;
                hmo.hmo_id = 3;
                hmo.selected_hmo_id = 3;
                $('#hmo_principal_save').prop('disabled', false);
                $('#delete_principal_hmo').prop('disabled', true);
            }

            $('.principal_granted').html(result.employee_hmo.length > 0 ? result.employee_hmo[0].granted_hmo : 'not set');
            $('.principal_selected').html(result.employee_hmo.length > 0 ? result.employee_hmo[0].selected_hmo : 'not set');
            $('.principal_monthly').html(parseFloat(principal_monthly).toFixed(2));

            $('#hmo_id').val(result.employee_hmo.length > 0 ? result.employee_hmo[0].hmo_id : 3);
            $('#selected_hmo_id').val(result.employee_hmo.length > 0 ? result.employee_hmo[0].selected_hmo_id : 3);

            $('.monthly_gross').html(result.employee_salary_details[0] ? result.employee_salary_details[0].monthly_gross : 0);
            $('.monthly_basic').html(result.employee_salary_details[0] ? result.employee_salary_details[0].basic : 0);
            $('.daily_gross').html(result.employee_salary_details[0] ? result.employee_salary_details[0].daily_gross : 0);
            $('.daily_basic').html(result.employee_salary_details[0] ? result.employee_salary_details[0].basic_daily : 0);

            $('#monthly_gross').val(result.employee_salary_details[0] ? result.employee_salary_details[0].monthly_gross : 0);
            $('#monthly_basic').val(result.employee_salary_details[0] ? result.employee_salary_details[0].basic : 0);
            $('#daily_gross').val(result.employee_salary_details[0] ? result.employee_salary_details[0].daily_gross : 0);
            $('#daily_basic').val(result.employee_salary_details[0] ? result.employee_salary_details[0].basic_daily : 0);

            salary.monthly_gross = result.employee_salary_details[0] ? result.employee_salary_details[0].monthly_gross : 0;
            salary.monthly_basic = result.employee_salary_details[0] ? result.employee_salary_details[0].basic : 0;
            salary.daily_gross = result.employee_salary_details[0] ? result.employee_salary_details[0].daily_gross : 0;
            salary.daily_basic = result.employee_salary_details[0] ? result.employee_salary_details[0].basic_daily : 0;
            clone_salary = JSON.parse(JSON.stringify(salary));

            fill_profile(result.user_profile);
            bind_events();

            if (result.role_type == "GSD") {
                $('.modify-comp-btn').hide();
            }
            console.log(typeof result.emp_infractions);

            if (typeof result.emp_infractions !== "undefined") {
                $('#no_infractions').hide();
                $('#emp_infractions').show();
                var infractions_tbody = $('#emp_infractions tbody').html('');

                jQuery.each(result.emp_infractions, function (i, infraction) {
                    var infraction_tr = '';
                    infraction_tr += ' <tr>';
                    infraction_tr += '    <td>' + infraction.name + '</td >';
                    infraction_tr += '        <td>' + infraction.offense + '</td>';
                    infraction_tr += '        <td>' + infraction.details + '</td>';
                    infraction_tr += '        <td class="center">' + infraction.infra_date + '</td>';
                    infraction_tr += '</tr>';

                    $('#emp_infractions tbody').append(infraction_tr);
                });

            } else {
                $('#emp_infractions').hide();
                $('#no_infractions').show();
            }
        }
    });
}

function fill_profile(user_profile) {
    $('#edit-salary-user-picture').attr('src', user_profile.profile_picture);
    $('.profile-username').html(user_profile.full_name);
    $('.profile-position').html(user_profile.pos_desc);
    $('.profile-bdate').html(user_profile.birth_date_html);

    $('#profile-name').html(user_profile.full_name);
    $('#profile-gender').html(user_profile.gender_type);
    $('#profile-blood').html(user_profile.blood_type);
    $('#profile-marital-stat').html(user_profile.marital_status);

    $('#profile-superior').html(user_profile.immediate_superior.is_full_name);
    $('#profile-email').html(user_profile.email);
    $('#profile-branch').html(user_profile.branch);
    $('#profile-dept').html(user_profile.dept_name);
    var teams = user_profile.team_name.split(';');

    var string = teams.shift();

    if (teams.length) {
        let count = teams.length;
        let title = teams.join('<br />');

        string += ' and <a href="#" data-toggle="tooltip" data-placement="top" data-html="true" title="' + title + '" class="more">' + count + ' more</a>';
    }
    $('#profile-team').html(string);

    $('#profile-date-started').html(user_profile.date_started);

    if ((typeof user_profile.emergency_contact_name != "undefined") || (user_profile.emergency_contact_name.length > 1) || (user_profile.emergency_contact_number.length > 1)) {
        $('#emergency-info').show();
        $('#emergency-contact-name').html(user_profile.emergency_contact_name);
        $('#emergency-contact-relationship').html(user_profile.relationship);
        $('#emergency-contact-address').html(user_profile.emergency_contact_address);
        $('#emergency-contact-number').html(user_profile.emergency_contact_number);
    } else {
        $('#emergency-info').hide();
    }

    if (typeof user_profile.schedule_days === "undefined") {
        $('#sched-info').hide();
    } else {
        $('#sched-info').show();
        $('#profile-time-in').html(user_profile.schedule_time_in);
        $('#profile-time-out').html(user_profile.schedule_time_out);
        $('#profile-sched-days').html(user_profile.schedule_days);
    }

}

$(document).ready(function () {
    $('#calendar_logs').fullCalendar();

    $('#dependent_dob').datepicker({
        todayHighlight: true,
        format: 'yyyy-mm-dd'
    }).on('changeDate', function (e) {
        dependent[e.target.id] = e.target.value;
        if (dependent.fname.length > 0 &&
            dependent.mname.length > 0 &&
            dependent.lname.length > 0 &&
            dependent.dependent_dob.length > 0) {
            $('#hmo_dependent_add').prop('disabled', false);
        } else {
            $('#hmo_dependent_add').prop('disabled', true);
        }
    });

    $('#loan_date_granted, #loan_date_effective, #update_loan_date_granted, #update_loan_date_effective').datepicker({
        todayHighlight: true,
        format: 'yyyy-mm-dd'
    }).on('changeDate', function (e) {
        if (e.target.id == 'loan_date_granted' || e.target.id == 'loan_date_effective') {
            loan[e.target.id] = e.target.value.substr(0, 10);
            if (loan.loan_amount.length > 0 &&
                loan.loan_interest.length > 0 &&
                loan.loan_terms.length > 0 &&
                loan.loan_due.length > 0 &&
                loan.loan_current.length > 0 &&
                loan.loan_remaining.length > 0 &&
                loan.loan_date_granted.length > 0 &&
                loan.loan_date_effective.length > 0) {
                $('#add_employee_loan').prop('disabled', false);
            } else {
                $('#add_employee_loan').prop('disabled', true);
            }
        } else {
            update_loan[e.target.id.substr(7)] = e.target.value.substr(0, 10);
            if (update_loan.loan_amount.length > 0 &&
                update_loan.loan_interest.length > 0 &&
                update_loan.loan_terms.length > 0 &&
                update_loan.loan_due.length > 0 &&
                update_loan.loan_current.length > 0 &&
                update_loan.loan_remaining.length > 0 &&
                update_loan.loan_date_granted.length > 0 &&
                update_loan.loan_date_effective.length > 0) {
                $('#save_employee_loan').prop('disabled', false);
            } else {
                $('#save_employee_loan').prop('disabled', true);
            }
        }
    });

    $('#overtime_date').datepicker({
        todayHighlight: true,
        startDate: moment().subtract(1, 'months').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        format: 'yyyy-mm-dd'
    });

    auto_complete_controller('employee_search', displayPayrollInfo);

    $('#monthly_gross, #monthly_basic, #daily_gross, #daily_basic').on('change, input', function (e) {
        if (e.target.value.length == 0) {
            $('#compensation_error').removeClass('hidden');
            $('#compensation_save').prop('disabled', true);
        } else {
            $('#compensation_error').addClass('hidden');
            $('#compensation_save').prop('disabled', false);
            salary[e.target.id] = e.target.value;
        }
        if (clone_salary.monthly_gross == salary.monthly_gross &&
            clone_salary.monthly_basic == salary.monthly_basic &&
            clone_salary.daily_gross == salary.daily_gross &&
            clone_salary.daily_basic == salary.daily_basic) {
            $('#compensation_save').prop('disabled', true);
        }
    });

    $('#compensation_save').on('click', function (e) {
        $.ajax({
            type: "POST",
            url: site_url + "ajax/setup_ajax/save_compensation",
            data: { 'salary': salary, user_id: user_id },
            beforeSend: function () {
                $('#compensation_save').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Saving..');
            },
            success: function (response) {
                $('#compensation_save').html('Save Changes');
                $('#compensation_modal').modal('hide');
                var result = JSON.parse(response);
                $('.monthly_gross').html(result.monthly_gross);
                $('.monthly_basic').html(result.basic);
                $('.daily_gross').html(result.daily_gross);
                $('.daily_basic').html(result.basic_daily);
                salary.monthly_gross = result.monthly_gross;
                salary.monthly_basic = result.basic;
                salary.daily_gross = result.daily_gross;
                salary.daily_basic = result.basic_daily;
                clone_salary = JSON.parse(JSON.stringify(salary));
            }
        });
    });

    $('#hmo_id, #selected_hmo_id').on('change', function (e) {
        hmo[e.target.id] = e.target.value;
        if (ehmo_id > 0) {
            if (hmo.hmo_id == clone_hmo.hmo_id && hmo.selected_hmo_id == clone_hmo.selected_hmo_id) {
                $('#hmo_error').addClass('hidden');
                $('#hmo_principal_save').prop('disabled', true);
            } else {
                if (hmo.hmo_id < hmo.selected_hmo_id) {
                    $('#hmo_principal_save').prop('disabled', true);
                    $('#hmo_error').removeClass('hidden');
                } else {
                    $('#hmo_principal_save').prop('disabled', false);
                    $('#hmo_error').addClass('hidden');
                }
            }
        } else {
            if (hmo.hmo_id < hmo.selected_hmo_id) {
                $('#hmo_principal_save').prop('disabled', true);
                $('#hmo_error').removeClass('hidden');
            } else {
                $('#hmo_principal_save').prop('disabled', false);
                $('#hmo_error').addClass('hidden');
            }
        }
    });

    $('#hmo_principal_save').on('click', function (e) {
        $.ajax({
            type: "POST",
            url: site_url + "ajax/setup_ajax/save_employee_hmo",
            data: { 'hmo': hmo, ehmo_id: ehmo_id, user_id: user_id },
            beforeSend: function () {
                $('#hmo_principal_save').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Saving..');
            },
            success: function (response) {
                $('#hmo_principal_save').html('Save Changes');
                $('#hmo_principal_modal').modal('hide');
                $('#delete_principal_hmo').prop('disabled', false);
                var result = JSON.parse(response)[0];
                principal_monthly = result.selected_monthly - result.granted_monthly;
                $('.principal_granted').html(result.plan);
                $('.principal_selected').html(result.selected_plan);
                $('.principal_monthly').html(parseFloat(principal_monthly).toFixed(2));
                ehmo_id = result.ehmo_id;
                hmo.hmo_id = result.hmo_id;
                hmo.selected_hmo_id = result.selected_hmo_id;
                clone_hmo = JSON.parse(JSON.stringify(hmo));
            }
        });
    });

    $('#delete_principal_hmo').on('click', function (e) {
        $.ajax({
            type: "POST",
            url: site_url + "ajax/employee_hmo_ajax/ajax_delete_employee_hmo_entry",
            data: { ehmo_id: ehmo_id },
            beforeSend: function () {
                $('#delete_principal_hmo').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Deleting..');
            },
            success: function () {
                $('#delete_principal_hmo').prop('disabled', false).html('<i class="fa fa-close"></i> Delete');
                $('#hmo_principal_save').prop('disabled', false);
                principal_monthly = 0;
                ehmo_id = null;
                hmo.hmo_id = 3;
                hmo.selected_hmo_id = 3;
                $('.principal_granted').html('not set');
                $('.principal_selected').html('not set');
                $('.principal_monthly').html(parseFloat(principal_monthly).toFixed(2));
                hmo.hmo_id = 3;
                hmo.selected_hmo_id = 3;
                clone_hmo = JSON.parse(JSON.stringify(hmo));
            }
        });
    });

    $('#fname, #mname, #lname, #dependent_dob').on('input', function (e) {
        if (e.target.id != 'dependent_dob') {
            dependent[e.target.id] = e.target.value;
        }
        if (dependent.fname.length > 0 &&
            dependent.mname.length > 0 &&
            dependent.lname.length > 0 &&
            dependent.dependent_dob.length > 0) {
            $('#hmo_dependent_add').prop('disabled', false);
        } else {
            $('#hmo_dependent_add').prop('disabled', true);
        }
    });

    $('#dependent_gender, #dependent_relationship, #dependent_taxable').on('change', function (e) {
        dependent[e.target.id] = e.target.value;
    });

    $('#hmo_dependent_add').on('click', function (e) {
        dependent.dependent_dob = $('#dependent_dob').val();
        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/setup_ajax/add_dependent',
            data: { dependent: dependent, user_id: user_id },
            beforeSend: function () {
                $('#hmo_dependent_add').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Saving..');
            },
            success: function (response) {
                var result = JSON.parse(response);
                if (typeof result.result !== 'undefined') {
                    $('#add_dependent_error').removeClass('hidden').html('<strong>' + dependent.lname + ", " + dependent.fname + ' <i>already exists. Cannot insert duplicate entry.</i></strong>');
                    $('#hmo_dependent_add').prop('disabled', false).html('Submit');
                } else {
                    $('#hmo_dependent_add').prop('disabled', true).html('Submit');
                    $('#add_dependent_modal').modal('hide');
                    $('#add_dependent_error').addClass('hidden');

                    $('#fname').val('');
                    $('#mname').val('');
                    $('#lname').val('');
                    $('#dependent_dob').val('');
                    $('#dependent_gender').val(1);
                    $('#dependent_relationship').val(1);
                    $('#dependent_taxable').val(0);

                    dependent.fname = '';
                    dependent.lname = '';
                    dependent.mname = '';
                    dependent.dependent_gender = 1;
                    dependent.dependent_dob = '';
                    dependent.dependent_relationship = 1;
                    dependent.dependent_taxable = 0;

                    var hmo_dependent_table = "<tbody>";
                    hmo_dependent_table += "<tr><td><b>Name</b></td><td><b>Selected HMO</b></td><td><b>Monthly Payable</b></td><td><b>Action</b></td></tr>";
                    $.each(result, function (key, value) {
                        var full_name = value.first_name + " " + value.last_name,
                            plan = value.hmo_plan == null ? 'not set' : value.hmo_plan,
                            monthly = value.hmo_monthly == null ? 0 : value.hmo_monthly;
                        hmo_dependent_table += "<tr><td>" + full_name.toUpperCase() + "</td><td>" + plan + "</td><td>" + monthly + "</td>" +
                            "<td><a data-dependent='" + value.dependent_id + "' data-id='" + value.id + "' data-hmo='" + value.hmo_id + "' data-toggle='modal' data-target='#update_hmo_dependent_modal' class='update_dependent_hmo' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-dependent='" + value.dependent_id + "' class='remove_dependent_hmo' name='remove_dependent_hmo' data-toggle='modal' data-target='#delete_dependent_hmo' data-name='" + full_name + "'><i class='fa fa-close text-red'></i></a></td></tr>";
                    });
                    hmo_dependent_table += "</tbody>";
                    $('#hmo_dependent_table').html(hmo_dependent_table);
                }
                bind_events();
            }
        });
    });

    $('#selected_dependent_hmo_id').change(function (e) {
        dependent_hmo.hmo_id = e.target.value;
        if (clone_dependent_hmo.id == null) {
            $('#hmo_dependent_save').prop('disabled', false);
        } else {
            if (dependent_hmo.hmo_id == clone_dependent_hmo.hmo_id) {
                $('#hmo_dependent_save').prop('disabled', true);
            } else {
                $('#hmo_dependent_save').prop('disabled', false);
            }
        }
    });

    $('#hmo_dependent_save').on('click', function (e) {
        var update_url = site_url + "ajax/setup_ajax/update_dependent_hmo",
            add_url = site_url + "ajax/setup_ajax/insert_dependent_hmo";

        var properties = {
            update_id: dependent_hmo.id == null ? dependent_hmo.dependent_id : dependent_hmo.id,
            hmo_id: dependent_hmo.hmo_id == null ? 6 : dependent_hmo.hmo_id,
            user_id: user_id
        };

        $.ajax({
            type: "POST",
            url: dependent_hmo.id == null ? add_url : update_url,
            data: properties,
            beforeSend: function () {
                $('#hmo_dependent_save').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Saving..');
            },
            success: function (response) {
                var result = JSON.parse(response);
                if (result.response) {
                    $('#update_dependent_error').addClass('hidden');
                    $('#hmo_dependent_save').prop('disabled', true).html('<i class="fa fa-pencil"></i> Save Changes');
                    dependent_hmo = {
                        'dependent_id': '',
                        'hmo_id': ''
                    };
                    clone_dependent_hmo = null;
                    var hmo_dependent_table = "<tbody>";
                    hmo_dependent_table += "<tr><td><b>Name</b></td><td><b>Selected HMO</b></td><td><b>Monthly Payable</b></td><td><b>Action</b></td></tr>";
                    $.each(result.data, function (key, value) {
                        var full_name = value.first_name + " " + value.last_name,
                            plan = value.hmo_plan == null ? 'not set' : value.hmo_plan,
                            monthly = value.hmo_monthly == null ? 0 : value.hmo_monthly;
                        hmo_dependent_table += "<tr><td>" + full_name.toUpperCase() + "</td><td>" + plan + "</td><td>" + monthly + "</td>" +
                            "<td><a data-dependent='" + value.dependent_id + "' data-id='" + value.id + "' data-hmo='" + value.hmo_id + "' data-toggle='modal' data-target='#update_hmo_dependent_modal' class='update_dependent_hmo' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-dependent='" + value.dependent_id + "' class='remove_dependent_hmo' name='remove_dependent_hmo' data-toggle='modal' data-target='#delete_dependent_hmo' data-name='" + full_name + "'><i class='fa fa-close text-red'></i></a></td></tr>";
                    });
                    hmo_dependent_table += "</tbody>";
                    $('#hmo_dependent_table').html(hmo_dependent_table);
                    $('#update_hmo_dependent_modal').modal('hide');
                } else {
                    $('#update_dependent_error').removeClass('hidden').html('Something went wrong.');
                    $('#hmo_dependent_save').prop('disabled', false).html('<i class="fa fa-pencil"></i> Save Changes');
                }
                bind_events();
            }
        });
    });

    $('#remove_hmo_dependent').on('click', function (e) {
        $.ajax({
            type: "POST",
            url: site_url + "ajax/setup_ajax/delete_dependent_hmo",
            data: {
                'dependent_id': delete_hmo_id,
                'user_id': user_id
            },
            beforeSend: function () {
                $('#remove_hmo_dependent').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Removing..');
            },
            success: function (response) {
                delete_hmo_id = null;
                var result = JSON.parse(response);
                var hmo_dependent_table = "<tbody>";
                hmo_dependent_table += "<tr><td><b>Name</b></td><td><b>Selected HMO</b></td><td><b>Monthly Payable</b></td><td><b>Action</b></td></tr>";
                $.each(result, function (key, value) {
                    var full_name = value.first_name + " " + value.last_name,
                        plan = value.hmo_plan == null ? 'not set' : value.hmo_plan,
                        monthly = value.hmo_monthly == null ? 0 : value.hmo_monthly;
                    hmo_dependent_table += "<tr><td>" + full_name.toUpperCase() + "</td><td>" + plan + "</td><td>" + monthly + "</td>" +
                        "<td><a data-dependent='" + value.dependent_id + "' data-id='" + value.id + "' data-hmo='" + value.hmo_id + "' data-toggle='modal' data-target='#update_hmo_dependent_modal' class='update_dependent_hmo' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-dependent='" + value.dependent_id + "' class='remove_dependent_hmo' name='remove_dependent_hmo' data-toggle='modal' data-target='#delete_dependent_hmo' data-name='" + full_name + "'><i class='fa fa-close text-red'></i></a></td></tr>";
                });
                hmo_dependent_table += "</tbody>";
                $('#delete_dependent_hmo').modal('hide');
                $('#hmo_dependent_table').html(hmo_dependent_table);
                $('#remove_hmo_dependent').prop('disabled', false).html('<i class="fa fa-trash" style="margin-right: 5px"></i>Delete');
                bind_events();
            }
        });
    });

    $('#incentive_amount, #update_incentive_amount').on('input', function (e) {
        if ($(this).attr('id') == 'incentive_amount') {
            if (e.target.value.length > 0) {
                $('#add_employee_incentive').prop('disabled', false);
                incentive.amount = e.target.value;
            } else {
                $('#add_employee_incentive').prop('disabled', true);
                incentive.amount = null;
            }
        } else {
            if (e.target.value.length > 0) {
                $('#save_incentive').prop('disabled', false);
                incentive.amount = e.target.value;
            } else {
                $('#save_incentive').prop('disabled', true);
                incentive.amount = null;
            }
        }
    });

    $('#incentive_type, #update_incentive_type').on('change', function (e) {
        incentive.type = e.target.value;
    });

    $('#add_employee_incentive').on('click', function (e) {
        incentive.user_id = user_id;
        if (incentive.type == null) {
            incentive.type = $('#incentive_type').val();
        }

        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/setup_ajax/insert_incentive',
            data: incentive,
            beforeSend: function () {
                $('#add_employee_incentive').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Saving..');
            },
            success: function (response) {
                var result = JSON.parse(response);
                $('#add_employee_incentive').prop('disabled', true).html('Submit');
                $('#incentive_type').val(incentive.type);
                $('#incentive_amount').val('');
                incentive.type = null;
                incentive.amount = 0;

                var incentive_table = "<tbody>";
                incentive_table += "<tr><td><b>Incentive Type</b></td><td><b>Amount</b></td><td><b>Action</b></td></tr>";
                $.each(result, function (key, value) {
                    var incetive_type = value.label,
                        amount = value.amount;
                    incentive_table += "<tr><td>" + incetive_type + "</td><td>" + amount + "</td>" +
                        "<td><a data-incentive='" + value.incentive_id + "' data-id='" + value.id + "' data-toggle='modal' data-target='#update_incentive_modal' class='update_incentive' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-id='" + value.id + "' class='remove_incentive' name='remove_incentive' data-toggle='modal' data-target='#delete_incentive'><i class='fa fa-close text-red'></i></a></td></tr>";
                });
                incentive_table += "</tbody>";
                $('#incentive_table').html(incentive_table);
                $('#add_incentive_modal').modal('hide');
                bind_events();
            }
        });
    });

    $('#save_incentive').on('click', function (e) {
        incentive.user_id = user_id;
        incentive.update_id = update_incentive_id;
        if (incentive.type == null) {
            incentive.type = $('#update_incentive_type').val();
        }
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/setup_ajax/update_incentive',
            data: incentive,
            beforeSend: function () {
                $('#save_incentive').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Saving..');
            },
            success: function (response) {
                var result = JSON.parse(response);
                $('#save_incentive').prop('disabled', true).html('Save Changes');
                $('#update_incentive_type').val(incentive.type);
                $('#update_incentive_amount').val('');
                incentive.type = null;
                incentive.amount = 0;
                update_incentive_id = null;

                var incentive_table = "<tbody>";
                incentive_table += "<tr><td><b>Incentive Type</b></td><td><b>Amount</b></td><td><b>Action</b></td></tr>";
                $.each(result, function (key, value) {
                    var incetive_type = value.label,
                        amount = value.amount;
                    incentive_table += "<tr><td>" + incetive_type + "</td><td>" + amount + "</td>" +
                        "<td><a data-incentive='" + value.incentive_id + "' data-id='" + value.id + "' data-toggle='modal' data-target='#update_incentive_modal' class='update_incentive' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-id='" + value.id + "' class='remove_incentive' name='remove_incentive' data-toggle='modal' data-target='#delete_incentive'><i class='fa fa-close text-red'></i></a></td></tr>";
                });
                incentive_table += "</tbody>";
                $('#incentive_table').html(incentive_table);
                $('#update_incentive_modal').modal('hide');
                bind_events();
            }
        });
    });

    $('#remove_incentive').on('click', function (e) {
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/setup_ajax/delete_employee_incentive',
            data: {
                'update_id': update_incentive_id,
                'user_id': user_id
            },
            beforeSend: function () {
                $('#remove_incentive').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Removing..');
            },
            success: function (response) {
                var result = JSON.parse(response);
                $('#remove_incentive').prop('disabled', false).html('<i class="fa fa-trash" style="margin-right: 5px"></i>Delete');
                incentive.type = null;
                incentive.amount = 0;
                update_incentive_id = null;

                var incentive_table = "<tbody>";
                incentive_table += "<tr><td><b>Incentive Type</b></td><td><b>Amount</b></td><td><b>Action</b></td></tr>";
                $.each(result, function (key, value) {
                    var incetive_type = value.label,
                        amount = value.amount;
                    incentive_table += "<tr><td>" + incetive_type + "</td><td>" + amount + "</td>" +
                        "<td><a data-incentive='" + value.incentive_id + "' data-id='" + value.id + "' data-toggle='modal' data-target='#update_incentive_modal' class='update_incentive' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-id='" + value.id + "' class='remove_incentive' name='remove_incentive' data-toggle='modal' data-target='#delete_incentive'><i class='fa fa-close text-red'></i></a></td></tr>";
                });
                incentive_table += "</tbody>";
                $('#incentive_table').html(incentive_table);
                $('#delete_incentive').modal('hide');
                bind_events();
            }
        })
    });

    $('#loan_amount, #loan_interest, #loan_terms, #loan_due, #loan_current, #loan_remaining, #loan_date_granted, #loan_date_effective').on('input', function (e) {
        loan[e.target.id] = e.target.value;
        if (e.target.id == 'loan_date_effective' || e.target.id == 'loan_date_granted') {
            loan[e.target.id] = e.target.value.substr(0, 10);
        }
        if (loan.loan_amount.length > 0 &&
            loan.loan_interest.length > 0 &&
            loan.loan_terms.length > 0 &&
            loan.loan_due.length > 0 &&
            loan.loan_current.length > 0 &&
            loan.loan_remaining.length > 0 &&
            loan.loan_date_granted.length > 0 &&
            loan.loan_date_effective.length > 0) {
            $('#add_employee_loan').prop('disabled', false);
        } else {
            $('#add_employee_loan').prop('disabled', true);
        }
    });

    $('#update_loan_amount, #update_loan_interest, #update_loan_terms, #update_loan_due, #update_loan_current, #update_loan_remaining, #update_loan_date_granted, #update_loan_date_effective').on('input', function (e) {
        update_loan[e.target.id.substr(7)] = e.target.value;
        if (e.target.id == 'update_loan_date_effective' || e.target.id == 'update_loan_date_granted') {
            update_loan[e.target.id.substr(7)] = e.target.value.substr(0, 10);
        }
        if (update_loan.loan_amount.length > 0 &&
            update_loan.loan_interest.length > 0 &&
            update_loan.loan_terms.length > 0 &&
            update_loan.loan_due.length > 0 &&
            update_loan.loan_current.length > 0 &&
            update_loan.loan_remaining.length > 0 &&
            update_loan.loan_date_granted.length > 0 &&
            update_loan.loan_date_effective.length > 0) {
            $('#save_employee_loan').prop('disabled', false);
        } else {
            $('#save_employee_loan').prop('disabled', true);
        }
    });

    $('#loan_type, #update_loan_type').on('change', function (e) {
        if (e.target.id == 'loan_type') {
            loan.loan_type = e.target.value;
        } else {
            update_loan.loan_type = e.target.value;
        }
    });

    $('#add_employee_loan').on('click', function (e) {
        loan['user_id'] = user_id;
        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/setup_ajax/add_employee_loan',
            data: loan,
            beforeSend: function () {
                $('#add_employee_loan').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Saving..');
            },
            success: function (response) {
                var result = JSON.parse(response);
                clone_loan = result;
                $('#add_employee_loan').prop('disabled', false).html('Submit');

                $('#loan_amount').val('');
                $('#loan_interest').val('');
                $('#loan_terms').val('');
                $('#loan_due').val('');
                $('#loan_current').val('');
                $('#loan_remaining').val('');
                $('#loan_date_granted').val('');
                $('#loan_date_effective').val('');

                loan.loan_amount = '';
                loan.loan_interest = '';
                loan.loan_terms = '';
                loan.loan_due = '';
                loan.loan_current = '';
                loan.loan_remaining = '';
                loan.loan_date_granted = '';
                loan.loan_date_effective = '';

                var loan_table = "<tbody>";
                loan_table += "<tr><td><b>Loan Type</b></td><td><b>Amount</b></td><td><b>Date Granted</b></td><td><b>Terms to Pay</b></td><td><b>Action</b></td></tr>";
                $.each(result, function (key, value) {
                    var loan_type = value.loan_type_name,
                        amount = value.amount;
                    loan_table += "<tr><td>" + loan_type + "</td><td>" + amount + "</td>" + "<td>" + value.date_granted + "</td>" + "<td>" + value.terms_to_pay + "</td>" +
                        "<td><a data-index='" + key + "' data-toggle='modal' data-target='#update_loan_modal' class='update_loan' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-id='" + value.loan_id + "' class='remove_loan' name='remove_loan' data-toggle='modal' data-target='#delete_loan'><i class='fa fa-close text-red'></i></a></td></tr>";
                });
                loan_table += "</tbody>";
                $('#loan_table').html(loan_table);
                $('#add_loan_modal').modal('hide');

                bind_events();
            }
        });
    });

    $('#save_employee_loan').on('click', function (e) {
        update_loan['user_id'] = user_id;
        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/setup_ajax/update_employee_loan',
            data: update_loan,
            beforeSend: function () {
                $('#save_employee_loan').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Saving..');
            },
            success: function (response) {
                var result = JSON.parse(response);
                clone_loan = result;
                $('#save_employee_loan').prop('disabled', false).html('Save Changes');

                $('#update_loan_amount').val('');
                $('#update_loan_interest').val('');
                $('#update_loan_terms').val('');
                $('#update_loan_due').val('');
                $('#update_loan_current').val('');
                $('#update_loan_remaining').val('');
                $('#update_loan_date_granted').val('');
                $('#update_loan_date_effective').val('');

                update_loan.loan_amount = '';
                update_loan.loan_interest = '';
                update_loan.loan_terms = '';
                update_loan.loan_due = '';
                update_loan.loan_current = '';
                update_loan.loan_remaining = '';
                update_loan.loan_date_granted = '';
                update_loan.loan_date_effective = '';

                var loan_table = "<tbody>";
                loan_table += "<tr><td><b>Loan Type</b></td><td><b>Amount</b></td><td><b>Date Granted</b></td><td><b>Terms to Pay</b></td><td><b>Action</b></td></tr>";
                $.each(result, function (key, value) {
                    var loan_type = value.loan_type_name,
                        amount = value.amount;
                    loan_table += "<tr><td>" + loan_type + "</td><td>" + amount + "</td>" + "<td>" + value.date_granted + "</td>" + "<td>" + value.terms_to_pay + "</td>" +
                        "<td><a data-index='" + key + "' data-toggle='modal' data-target='#update_loan_modal' class='update_loan' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-id='" + value.loan_id + "' class='remove_loan' name='remove_loan' data-toggle='modal' data-target='#delete_loan'><i class='fa fa-close text-red'></i></a></td></tr>";
                });
                loan_table += "</tbody>";
                $('#loan_table').html(loan_table);
                $('#update_loan_modal').modal('hide');

                bind_events();
            }
        });
    });

    $('#remove_loan').on('click', function (e) {
        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/setup_ajax/delete_employee_loan',
            data: {
                'delete_id': delete_loan,
                'user_id': user_id
            },
            beforeSend: function () {
                $('#remove_loan').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Removing..');
            },
            success: function (response) {
                var result = JSON.parse(response);
                clone_loan = result;
                $('#remove_loan').prop('disabled', false).html('<i class="fa fa-trash" style="margin-right: 5px"></i>Delete');

                var loan_table = "<tbody>";
                loan_table += "<tr><td><b>Loan Type</b></td><td><b>Amount</b></td><td><b>Date Granted</b></td><td><b>Terms to Pay</b></td><td><b>Action</b></td></tr>";
                $.each(result, function (key, value) {
                    var loan_type = value.loan_type_name,
                        amount = value.amount;
                    loan_table += "<tr><td>" + loan_type + "</td><td>" + amount + "</td>" + "<td>" + value.date_granted + "</td>" + "<td>" + value.terms_to_pay + "</td>" +
                        "<td><a data-index='" + key + "' data-toggle='modal' data-target='#update_loan_modal' class='update_loan' style='margin-right: 5px'><i class='fa fa-pencil'></i></a><a data-id='" + value.loan_id + "' class='remove_loan' name='remove_loan' data-toggle='modal' data-target='#delete_loan'><i class='fa fa-close text-red'></i></a></td></tr>";
                });
                loan_table += "</tbody>";
                $('#loan_table').html(loan_table);
                $('#delete_loan').modal('hide');

                bind_events();
            }
        });
    });

    $('.trigger').on('click', function (e) {
        var title_display = $('#title_display');
        $('.attendance_form').addClass('hidden');
        $('.overtime_form').addClass('hidden');
        $('.leave_form').addClass('hidden');
        update_log_id = null;

        switch (e.target.name) {
            case 'add_attendance_modal':
                $.ajax({
                    type: "POST",
                    url: site_url + 'ajax/teams_ajax/preset_timelogs',
                    data: {
                        id: user_id
                    },
                    beforeSend: function () {
                        $('#trigger_1').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Fetching Schedule Source..');
                    },
                    success: function (results) {
                        if (results.length > 0) {
                            title_display.html('<b>Add Attendance Log</b>');
                            $('.attendance_form').removeClass('hidden');

                            $('#sched_date_in').datepicker('setDate', date_selected);
                            $('#sched_date_in_entry').datepicker('setDate', date_selected);

                            $("#sched_time_in").val(moment(results[0].time_in, ["HH:mm"]).format("h:mm A"));
                            $("#sched_time_out").val(moment(results[0].time_out, ["HH:mm"]).format("h:mm A"));

                            $("#sched_time_in_entry").val(moment(results[0].time_in, ["HH:mm"]).format("h:mm A"));
                            $("#sched_time_out_entry").val(moment(results[0].time_out, ["HH:mm"]).format("h:mm A"));

                            if (results[0].time_in > results[0].time_out) {
                                var today = moment(date_selected);
                                var tomorrow = today.add('days', 1);
                                $('#sched_date_out').datepicker('setDate', moment(tomorrow).format("YYYY-MM-DD"));
                                $('#sched_date_out_entry').datepicker('setDate', moment(tomorrow).format("YYYY-MM-DD"));
                            } else {
                                $('#sched_date_out').datepicker('setDate', moment().format("YYYY-MM-DD"));
                                $('#sched_date_out_entry').datepicker('setDate', moment().format("YYYY-MM-DD"));
                            }

                            $('#trigger_1').prop('disabled', false).html('Attendance');
                            $('#select_log_modal').modal('hide');
                        } else {
                            $('#select_log_modal').modal('hide');
                            window.setTimeout(function () {
                                $('#no_schedule_modal').modal('show');
                            }, 500);
                        }
                    }
                });
                break;
            case 'add_overtime_modal':
                update_overtime_data = null;
                pending_overtime_logs = null;
                title_display.html('<b>Add Employee Overtime</b>');

                new OTDate($('#overtime_date')).reset();

                $('#overtime_date').datepicker('setDate', date_selected);
                $("#overtime_duration").val('');
                $("#overtime_type").val(3);
                $('#add_overtime').prop('disabled', true).html('Submit');
                $('#overtime_approval').prop('checked', false);
                $('.overtime_form').removeClass('hidden');
                $('#select_log_modal').modal('hide');
                break;
            case 'add_leave_modal':
                title_display.html('<b>Apply Employee Leave</b>');
                $('.leave_form').removeClass('hidden');
                $('#select_log_modal').modal('hide');
                break;
        }
    });

    $('#sched_date_out, #sched_date_out_entry, #sched_date_in, #sched_date_in_entry').datepicker({
        todayHighlight: true,
        format: 'yyyy-mm-dd'
    }).on('changeDate', function (e) {
        console.log(e.target.value);
    });

    $('#sched_time_in_entry, #sched_time_out_entry, #sched_time_in, #sched_time_out').timepicker().on('changeTime.timepicker, input', function (e) {
        if ($('#sched_time_in_entry').val().length > 0 && $('#sched_time_out_entry').val().length > 0) {
            $('#add_timelog').prop('disabled', false);
        } else {
            $('#add_timelog').prop('disabled', true);
        }
    });

    $('#overtime_in, #overtime_out').timepicker().on('changeTime.timepicker, blur, change', function (e) {
        if ($('#overtime_in').val().length > 0 && $('#overtime_out').val().length > 0) {
            var start = moment($('#overtime_in').val(), ["h:mm A"]).format("HH:mm");
            var end = moment($('#overtime_out').val(), ["h:mm A"]).format("HH:mm");
            var duration = getTimeDifference(start, end);
            $('#overtime_duration').val(duration);
            $('#add_overtime').prop('disabled', false);
        } else {
            $('#add_overtime').prop('disabled', true);
        }
        if ($('#overtime_duration').val() == '00:00') {
            $('#add_overtime').prop('disabled', true);
        } else {
            $('#add_overtime').prop('disabled', false);
        }
    });

    $('#add_timelog').on('click', function (e) {
        var time_out_time = moment($("#sched_time_out_entry").val(), ["h:mm A"]).format("HH:mm:ss");
        var base_time_out_time = moment($("#sched_time_out").val(), ["h:mm A"]).format("HH:mm:ss");
        var data = {
            date: date_selected,
            time_in: $("#sched_date_in_entry").val() + " " + moment($("#sched_time_in_entry").val(), ["h:mm A"]).format("HH:mm:ss"),
            time_out: $("#sched_date_out_entry").val() + " " + time_out_time,
            id: update_log_id,
            employee_id: user_id,
            base: {
                time_in: $("#sched_date_in").val() + " " + moment($("#sched_time_in").val(), ["h:mm A"]).format("HH:mm:ss"),
                time_out: $("#sched_date_out").val() + " " + base_time_out_time
            }
        };

        if (!is_valid_date(data.time_out)) {
            delete data["time_out"];
        }
        if (!is_valid_date(data.base.time_out)) {
            delete data.base["time_out"];
        }

        $.ajax({
            type: "POST",
            url: site_url + "ajax/teams_ajax/editEmployeeLog",
            data: {
                id: update_log_id,
                data: data,
                date: date_selected
            },
            beforeSend: function () {
                $('#add_timelog').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Processing..');
            },
            success: function (data) {
                $('#add_timelog').prop('disabled', false).html('Submit');
                if (data.status == "success") {
                    $("#common_error").addClass('hidden').html('');
                    $(".attendance_form").addClass('hidden');
                    $("#title_display").html('');
                    repopulate_calendar(user_id);
                    alert(data.message);
                } else {
                    $("#common_error").removeClass('hidden').html(data.message);
                }
            }
        });
    });

    function OTDate(e) {
        let element = e;

        this.check = function () {
            if (element) {
                this.reset();

                var check = true;

                var date = {
                    input: element.val(),
                    min: moment(element.data('datepicker').o.startDate).format('YYYY-MM-DD'),
                    max: moment(element.data('datepicker').o.endDate).format('YYYY-MM-DD'),
                };

                if (date.input) {
                    if (moment(date.input).isBefore(date.min) ||
                        moment(date.input).isAfter(date.max)) {

                        element.parent().siblings('.error').find('small')
                            .text(element.data('incorrect-text'));

                        check = false;
                    }
                } else {
                    console.log(element.parent().siblings('.error'))
                    element.parent().siblings('.error').find('small')
                        .text(element.data('required-text'));

                    check = false;
                }

                if (check == false) {
                    element.parent().siblings('.error').show();
                }

                return check;
            }
        }

        this.reset = function () {
            if (element) {
                element.parent().siblings('.error').hide()
                    .find('small').text(element.data('required-text'));
            }
        }
    }

    $('#cancel-ot-action').on('click', function () {
        var target = $(this).data('hide');

        new OTDate($('#overtime_date')).reset();

        $(target).addClass('hidden');
        $('#title_display').html(null);
    });

    $('#add_overtime').on('click', function (e) {
        var employee_id = user_id;
        var ot_type = $('#overtime_type').val();
        let paid_by = $('#paid_by').val();
        var date = $('#overtime_date').val();
        var time_in = moment($('#overtime_in').val(), ["h:mm A"]).format("HH:mm");
        var time_out = moment($('#overtime_out').val(), ["h:mm A"]).format("HH:mm");
        var duration = $('#overtime_duration').val();
        var approved_by = $('#overtime_approval').val();
        if (approved_by && document.getElementById('overtime_approval').checked) {
            approved_by = $('#approved_by').val();
        } else {
            approved_by = null;
        }

        // Date Check @code begin
        var OTD = new OTDate($('#overtime_date'));

        if (OTD.check() == false) {
            date = '';
        }
        // Date Check @code end

        var url = update_overtime_data ? site_url + "ajax/employee_overtime_ajax/ajax_update_ot_data" : site_url + "ajax/employee_overtime_ajax/ajax_save_ot_data",
            overtime_data = update_overtime_data ? {
                ot_id: update_overtime_data.id,
                paid_by: paid_by,
                ot_type: ot_type,
                date: date,
                time_in: time_in,
                time_out: time_out,
                duration: duration,
                approved_by: approved_by
            } : {
                    user_id: employee_id,
                    ot_type: ot_type,
                    paid_by: paid_by,
                    date: date,
                    time_in: time_in,
                    time_out: time_out,
                    duration: duration,
                    approved_by: approved_by
                };

        if (employee_id && date && duration) {
            $.ajax({
                type: 'POST',
                url: url,
                data: overtime_data,
                beforeSend: function () {
                    $('#common_error').addClass('hidden').html('');
                    $('#add_overtime').prop("disabled", true).html('<i class="fa fa-spinner fa-pulse"></i> Saving overtime..');
                },
                success: function (response) {
                    $('#add_overtime').prop("disabled", false).html('Submit');
                    if (response) {
                        $("#common_error").addClass('hidden').html('');
                        $(".overtime_form").addClass('hidden');
                        $("#title_display").html('');
                        repopulate_calendar(user_id);
                        if (!approved_by) {
                            $(".pending-overtime-action").trigger("click");
                        } else {
                            alert('OT Data was saved.');
                        }
                    } else {
                        $('#common_error').removeClass('hidden').html('Failed to save OT data.');
                    }
                }
            });
        }
    });

    $('#admin_exclude_date_button').click(function () {
        $('#exclude_date_wrapper').slideToggle("fast", "swing", function () {
            var duration_tok = $('#admin_leave_duration').val().split(' ');
            var start = new Date(duration_tok[0]);
            var end = new Date(duration_tok[2]);

            duration_tok = $('#admin_exclude_date_duration').val().split(' ');
            var start2 = new Date(duration_tok[0]);
            var end2 = new Date(duration_tok[2]);
            admin_getDaysDiff(start, end, start2, end2);
        });
    });

    $('#admin_leave_duration').daterangepicker(optionSet, admin_cb_duration);
    $('#admin_exclude_date_duration').daterangepicker(optionSet, admin_cb_exclude);

    $('#add_submit').on("click", function () {
        var admin_id = $('#admin_id').val(); //user_id sa nag gamit
        var leave_nature = $('#admin_leave_nature').val();
        var leave_duration = $('#admin_leave_duration').val();
        var leave_total_days = $('#admin_leave_total_days').text();
        var leave_reason = $('#admin_leave_reason').val();
        var exclude_date = $('#admin_exclude_date_duration').val();
        var unpaid = ($('#markunpaid').prop('checked'));
        var check = check_leave_err(leave_nature, leave_reason, leave_total_days);

        if (check) {
            $('#validation_error').html(check.replace(/\n/g, '<br />'));
            $('#leave_validation').show();
        } else {
            var color = $('#excluded_days').css("color");
            if (color != "rgb(255, 0, 0)" || $("#exclude_date_wrapper").is(":hidden")) {
                $.ajax({
                    type: "POST",
                    url: site_url + 'ajax/leave_ajax/check_duplicate',
                    data: {
                        user_id: user_id,
                        leave_duration: leave_duration
                    },
                    beforeSend: function () {
                        $("#add_submit").prop("disabled", true).html('<i class="fa fa-spinner fa-pulse"></i>  Processing leave application...');
                    },
                    success: function (data) {
                        var parsedata = jQuery.parseJSON(data);
                        if (parsedata == true) {
                            var validation_string = "Duplicate leave application detected. Please enter a different duration.";
                            $('#validation_error').html(validation_string.replace(/\n/g, '<br />'));
                            $('#leave_validation').show();
                            $("#add_submit").prop("disabled", false).html('Submit');
                        } else {
                            $('#leave_validation').hide();
                            if ($("#excluded_days").text() != "") {
                                leave_reason = "(Excluded:" + exclude_date + ") " + leave_reason;
                            } else {
                                exclude_date = null;
                            }
                            $.ajax({
                                type: "POST",
                                url: site_url + 'ajax/leave_ajax/add_leave',
                                data: {
                                    user_id: user_id,
                                    usersId: admin_id,
                                    leave_nature: leave_nature,
                                    leave_duration: leave_duration,
                                    leave_total_days: leave_total_days,
                                    leave_reason: leave_reason,
                                    exclude_date: exclude_date,
                                    unpaid: unpaid
                                },
                                complete: function (data) {
                                    console.log(data);
                                    repopulate_calendar(user_id);
                                    $("#add_submit").prop("disabled", false).html('Submit');
                                    $(".leave_form").addClass('hidden');
                                    $("#title_display").html("");
                                    alert('Leave application has been saved');
                                }
                            });
                        }
                    }
                });
            }
        }
    });

    $('#edit_log').on('click', function (e) {
        date_selected = log_details.date;
        $('#title_display').html('<b>Edit Attendance Log</b>');
        $('.attendance_form').removeClass('hidden');
        $('.overtime_form').addClass('hidden');
        $('.leave_form').addClass('hidden');

        $('#sched_date_in').datepicker('setDate', log_details.date);
        $('#sched_date_in_entry').datepicker('setDate', log_details.date);

        $("#sched_time_in").val(moment(log_details.time_in_schedule.split(" ")[1], ["HH:mm"]).format("h:mm A"));
        $("#sched_time_out").val(moment(log_details.time_out_schedule.split(" ")[1], ["HH:mm"]).format("h:mm A"));

        $("#sched_time_in_entry").val(moment(log_details.time_in.split(" ")[1], ["HH:mm"]).format("h:mm A"));
        if (log_details.time_out) {
            $("#sched_time_out_entry").val(moment(log_details.time_out.split(" ")[1], ["HH:mm"]).format("h:mm A"));
        } else {
            $("#sched_time_out_entry").val(moment(log_details.time_out_schedule.split(" ")[1], ["HH:mm"]).format("h:mm A"));
        }

        if (log_details.time_in_schedule.split(" ")[1] > log_details.time_out_schedule.split(" ")[1]) {
            var today = moment(log_details.date);
            var tomorrow = today.add('days', 1);
            $('#sched_date_out').datepicker('setDate', moment(tomorrow).format("YYYY-MM-DD"));
            $('#sched_date_out_entry').datepicker('setDate', moment(tomorrow).format("YYYY-MM-DD"));
        } else {
            $('#sched_date_out').datepicker('setDate', log_details.date);
            $('#sched_date_out_entry').datepicker('setDate', log_details.date);
        }

        $('#trigger_1').prop('disabled', false).html('Attendance');
        $('#timelog_view').modal('hide');
    });

    $('#remove_log').on('click', function (e) {
        $.ajax({
            type: "POST",
            url: site_url + "ajax/teams_ajax/deleteEmployeeLog",
            data: { id: update_log_id },
            success: function (data) {
                $('#timelog_view').modal('hide');
                $('.attendance_form').addClass('hidden');
                $('.overtime_form').addClass('hidden');
                $('.leave_form').addClass('hidden');
                $('#title_display').html('');
                update_log_id = null;
                repopulate_calendar(user_id);
            }
        });
    });

    $('#mark_as_absent').on('click', function (e) {
        date_entry = $('.log_date').text();
        $.ajax({
            type: "POST",
            url: site_url + "ajax/teams_ajax/markAsAbsent",
            data: { update_log_id: update_log_id, user_id: user_id, date_entry: date_entry },
            success: function (data) {
                alert(data.message);
                $('#timelog_view').modal('hide');
                $('.attendance_form').addClass('hidden');
                $('.overtime_form').addClass('hidden');
                $('.leave_form').addClass('hidden');
                $('#title_display').html('');
                update_log_id = null;
                repopulate_calendar(user_id);
            }
        });
    });

    $('.pending-overtime-action, .pending-leave-action').on('click', function (e) {
        $('.calendar_logs').trigger('click');
        $('.fc-button-today').trigger('click');
        $('#total_pending_ot').html('');
        if (e.target.name == 'overtime') {
            $.ajax({
                type: "POST",
                url: site_url + 'ajax/setup_ajax/get_user_overtime',
                data: {
                    user_id: user_id
                },
                beforeSend: function () {
                    $('#dropdown_pending').prop('disabled', true).html('Show Pending <i class="fa fa-spinner fa-pulse" style="margin-left: 5px;"></i>');
                },
                success: function (response) {
                    var pending_ot = "<tbody>";
                    $('#dropdown_pending').prop('disabled', false).html('Show Pending <span class="caret" style="margin-left: 5px;"></span>');
                    pending_overtime_logs = JSON.parse(response);
                    if (pending_overtime_logs.length > 1) {
                        $('#total_pending_ot').html('(' + pending_overtime_logs.length + ')');
                        pending_ot += "<tr><td><b>Date</b></td><td><b>OT Type</b></td><td><b>Time In</b></td><td><b>Time Out</b></td><td><b>Duration</b></td><td style='width:23%; text-align:center;'> <b> Paid By <br> <a id='mark-all-client' style='margin-right:17px; color:#000; cursor:pointer;'>click all</a> <a id='mark-all-AOS' style='color:#000; cursor:pointer;' >click all</a></b></td><td><b>Action</b></td></tr>";
                    }else if(pending_overtime_logs.length == 1){
                        $('#total_pending_ot').html('(' + pending_overtime_logs.length + ')');
                        pending_ot += "<tr><td><b>Date</b></td><td><b>OT Type</b></td><td><b>Time In</b></td><td><b>Time Out</b></td><td><b>Duration</b></td><td style='width:23%; text-align:center;'> <b> Paid By </b></td><td><b>Action</b></td></tr>";
                    }else{
                        pending_ot += "<tr><td><b>Date</b></td><td><b>OT Type</b></td><td><b>Time In</b></td><td><b>Time Out</b></td><td><b>Duration</b></td><td style='width:23%; text-align:center;'> <b> Paid By </b></td><td><b>Action</b></td></tr>";
                    }
                                        
                    $.each(pending_overtime_logs, function (key, value) {
                        var time_in = moment(value.time_in, ["HH:mm"]).format("h:mm A"),
                            time_out = moment(value.time_out, ["HH:mm"]).format("h:mm A");
                        let isClient = ((value.client_paid == 1) ? "checked" : "");
                        let isAOS = ((value.client_paid == 0) ? "checked" : "");
                        pending_ot += "<tr><td>" + value.date + "</td><td>" + value.overtime_name + "</td><td>" + time_in + "</td><td>" + time_out + "</td><td>" + value.duration + "</td>" +
                            "<td><label class='radio-inline'> <input a data-index='" + key + "' type='radio' class='clientPaidId' name='isClientPaidRadio" + key + "' value='1' " + isClient + "> Client </input> </label> <label class='radio-inline'> <input a data-index='" + key + "' value='0' type='radio' class='AOSPaidRadioId' name='isClientPaidRadio" + key + "' " + isAOS + "> AOS </input> </label> </td>" +
                            "<td><a data-index='" + key + "' title='Approve' name='approve' class='approve_overtime_action' style='margin-right: 5px'><i data-index='" + key + "' name='approve' class='fa fa-thumbs-up text-green'></i></a>" +
                            "<a data-index='" + key + "' title='Edit' name='update' class='update_overtime_action' style='margin-right: 5px'><i data-index='" + key + "' name='update' class='fa fa-pencil'></i></a>" +
                            "<a data-index='" + key + "' title='Delete' name='remove' class='remove_overtime_action' name='remove_overtime' data-toggle='modal' data-target='#delete_overtime'><i data-index='" + key + "' name='remove' class='fa fa-close text-red'></i></a></td></tr>";
                    });
                    pending_ot += "</tbody>";
                    $('#pending_ot_table').html(pending_ot);
                    if (pending_overtime_logs.length > 0) {
                        $('#approve_all_ot').prop('disabled', false);
                    } else {
                        $('#approve_all_ot').prop('disabled', true);
                    }
                    $('#pending_overtime').modal('show');
                    bind_events();
                }
            });
        } else {
            $.ajax({
                type: "POST",
                url: site_url + "ajax/setup_ajax/get_pending_leaves",
                data: {
                    user_id: user_id
                },
                beforeSend: function () {
                    $('#dropdown_pending').prop('disabled', true).html('Show Pending <i class="fa fa-spinner fa-pulse" style="margin-left: 5px;"></i>');
                },
                success: function (response) {
                    $('#dropdown_pending').prop('disabled', false).html('Show Pending <span class="caret" style="margin-left: 5px;"></span>');
                    pending_leave_logs = JSON.parse(response);
                    var pending_leave = "<tbody>";
                    pending_leave += "<tr><td><b>Date of Leave</b></td><td><b>Total Days</b></td><td><b>Nature</b></td><td><b>Reason</b></td><td><b>Status</b></td><td><b>Date Filed</b></td><td><b>Action</b></td></tr>";
                    $.each(pending_leave_logs, function (key, value) {
                        console.log(value);
                        var status = '<span class="label label-primary">' + value.status + '</span>';
                        if (value.status == 'Pending') {
                            status = '<span class="label label-warning">' + value.status + '</span>';
                        }
                        var date_of_leave = value.duration_start === value.duration_end ? value.duration_start : value.duration_start + " to " + value.duration_end;
                        pending_leave += "<tr><td>" + date_of_leave + "</td><td>" + value.total_days + "</td><td>" + value.nature + "</td><td>" + value.reason + "</td><td>" + status + "</td><td>" + value.date_recorded + "</td>" +
                            "<td><a data-index='" + key + "' title='Evaluate' name='evaluate' class='evaluate_leave_action' style='margin-right: 5px'><i data-index='" + key + "' name='evaluate' class='fa fa-legal'></i></a>" +
                            "<a data-index='" + key + "' title='Archive' name='remove' class='remove_leave_action' style='margin-right: 5px'><i data-index='" + key + "' name='remove' class='fa fa-trash text-red'></i></a></td></tr>";
                    });
                    pending_leave += "</tbody>";
                    $('#pending_leave_table').html(pending_leave);
                    if (pending_leave_logs.length > 0) {
                        $('#approve_all_leave').prop('disabled', false);
                    } else {
                        $('#approve_all_leave').prop('disabled', true);
                    }
                    $('#pending_leaves').modal('show');
                    bind_events();
                }
            });
        }
    });

    $('#edit_overtime').on('click', function (e) {
        console.log(update_overtime_data);
        var time_in = moment(update_overtime_data.time_in, ["HH:mm"]).format("h:mm A"),
            time_out = moment(update_overtime_data.time_out, ["HH:mm"]).format("h:mm A");
        $('#overtime_type').val(update_overtime_data.type);
        $('#overtime_date').datepicker('setDate', update_overtime_data.date);
        $('#overtime_in').val(time_in);
        $('#overtime_out').val(time_out);
        $('#overtime_duration').val(update_overtime_data.duration);
        $("#overtime_approval").prop('checked', true);
        $('#pending_overtime').modal('hide');
        $('.overtime_form').removeClass('hidden');
        $('#title_display').html('<b>Edit Employee Overtime</b>');
        if (update_overtime_data.duration == '00:00') {
            $('#add_overtime').prop('disabled', true).html('Update');
        } else {
            $('#add_overtime').prop('disabled', false).html('Update');
        }
        $('#overtime_view').modal('hide');
    });

    $('#remove_overtime').on('click', function (e) {
        $.ajax({
            type: "POST",
            url: site_url + "ajax/employee_overtime_ajax/ajax_delete_overtime_entry",
            data: {
                overtime_id: update_overtime_data.id
            },
            beforeSend: function () {
                $('#remove_overtime').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Processing...');
            },
            success: function (result) {
                $('#remove_overtime').prop('disabled', false).html('<i class="fa fa-trash"></i> Remove');
                if (result.message == 'failed') {
                    $('#ot_error').removeClass('hidden').html(result.message);
                } else {
                    $('#ot_error').addClass('hidden').html('');
                    $('#overtime_view').modal('hide');
                    $('#title_display').html('');
                    $('.overtime_form').addClass('hidden');
                    repopulate_calendar(user_id);
                }
            }
        });
    });

    $('#approve_all_ot').on('click', function (e) {
        var pending_id = [];
        var isPaidArray = [];
        for (var i = 0; i < pending_overtime_logs.length; i++) {
            pending_id.push(pending_overtime_logs[i].id);
            isPaidArray.push($("input[name='isClientPaidRadio" + i + "' ]:checked").val());
        }
        console.log(isPaidArray);
        $.ajax({
            type: "POST",
            url: site_url + "ajax/setup_ajax/approve_pending_overtime",
            data: {
                multiple_id: pending_id,
                user_id: user_id,
                multiple_is_cl_paid: isPaidArray
            },
            beforeSend: function () {
                $('#approve_all_ot').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Processing...');
            },
            success: function (response) {
                $('#approve_all_ot').prop('disabled', true).html('<i class="fa fa-thumbs-up"></i> Approve All');
                repopulate_calendar(user_id);
                $('#pending_overtime').modal('hide');
            }
        });
    });

    $('#leave_approve_btn').click(function () {
        var remarks = $.trim($('#leave_remarks').val());
        if (update_leave_data.status == "ReviewedbyTL") {
            remarks = update_leave_data.remarks;
        }

        if (remarks.length == 0) {
            $("#view_leave_errors").html('<p>Remarks Required</p>');
            $("#view_leave_errors").removeClass('hidden');
        } else {
            $("#view_leave_errors").addClass('hidden');
            $("#view_leave_errors").html('');
        }

        var unpaid = $('.modal#evaluate_leaves input[type="checkbox"]#markunpaid').prop('checked');

        if (remarks) {
            $.ajax({
                type: "POST",
                url: site_url + 'ajax/leave_ajax/leave_approve',
                data: {
                    leaveid: update_leave_data.leave_id,
                    remarks: remarks,
                    unpaid: unpaid,
                    days_paid: update_leave_data.total_days
                },
                beforeSend: function () {
                    $('#leave_approve_btn').button('loading'); // $('#leave_approve_btn').attr('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Approve');
                    $('#leave_deny_btn').prop('disabled', true); // $('#leave_deny_btn').attr('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Deny');
                },
                success: function (data) {
                    $('#leave_approve_btn').button('reset'); // $('#leave_approve_btn').attr('disabled', false).html('<i class="fa fa-thumbs-down"></i> Approve');
                    $('#leave_deny_btn').prop('disabled', false); // $('#leave_deny_btn').attr('disabled', false).html('<i class="fa fa-thumbs-down"></i> Deny');

                    repopulate_calendar(user_id);
                    $('#evaluate_leaves').modal('hide');
                }
            });
        }
    });

    $('#leave_deny_btn').click(function () {
        var remarks = $.trim($('#leave_remarks').val());
        if (update_leave_data.status == "ReviewedbyTL") {
            remarks = update_leave_data.remarks;
        }

        if (remarks.length == 0) {
            $("#view_leave_errors").html('<p>Remarks Required</p>');
            $("#view_leave_errors").removeClass('hidden');
        } else {
            $("#view_leave_errors").addClass('hidden');
            $("#view_leave_errors").html('');
        }

        if (remarks) {
            $.ajax({
                type: "POST",
                url: site_url + 'ajax/leave_ajax/leave_deny',
                data: {
                    leaveid: update_leave_data.leave_id,
                    remarks: remarks
                },
                beforeSend: function () {
                    $('#leave_approve_btn').prop('disabled', true); // $('#leave_approve_btn').attr('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Approve');
                    $('#leave_deny_btn').button('loading'); // $('#leave_deny_btn').attr('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i> Deny');
                },
                success: function (data) {
                    $('#leave_approve_btn').prop('disabled', false); // $('#leave_approve_btn').attr('disabled', false).html('<i class="fa fa-thumbs-down"></i> Approve');
                    $('#leave_deny_btn').button('reset'); // $('#leave_deny_btn').attr('disabled', false).html('<i class="fa fa-thumbs-down"></i> Deny');

                    repopulate_calendar(user_id);
                    $('#evaluate_leaves').modal('hide');
                }
            });
        }
    });

    $('#remove_leave').on('click', function (e) {
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/leave_ajax/delete_leave',
            data: { id: update_leave_data.leave_id },
            beforeSend: function () {
                $('#remove_leave').html('<i class="fa fa-spinner fa-pulse"></i> Processing...');
            },
            success: function (data) {
                repopulate_calendar(user_id);
                $('remove_leave').html('<i class="fa fa-trash"></i> Archive');
                $('#leave_view').modal('hide');
                update_leave_data = null;
            }
        });
    });
});

function is_valid_date(value) {
    if (typeof value === 'undefined') {
        return false;
    }

    var matches = value.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    if (matches === null) {
        return false;
    } else {
        var year = parseInt(matches[1], 10);
        var month = parseInt(matches[2], 10) - 1; // months are 0-11
        var day = parseInt(matches[3], 10);
        var hour = parseInt(matches[4], 10);
        var minute = parseInt(matches[5], 10);
        var second = parseInt(matches[6], 10);
        var date = new Date(year, month, day, hour, minute, second);
        return !(date.getFullYear() !== year || date.getMonth() != month || date.getDate() !== day || date.getHours() !== hour || date.getMinutes() !== minute || date.getSeconds() !== second)
    }
}

function getTimeDifference(start, end) {
    if (typeof start == "undefined" || typeof end == "undefined") {
        return;
    }
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0) {
        hours = hours + 24;
    }

    if (!isNaN(hours) && !isNaN(minutes)) {
        return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
    } else {
        return;
    }
}

function admin_getDaysDiff(start, end, start2, end2) {
    var oneDay = 24 * 60 * 60 * 1000;
    var diffDays = Math.abs((start - end) / oneDay) + 1;
    var diffDays2 = Math.abs((start2 - end2) / oneDay) + 1;
    var totalDiff = diffDays - diffDays2;
    var exclude_days = $('#excluded_days');

    if ($("#exclude_date_wrapper").is(":visible")) {
        if (start2 >= start && start2 <= end && end2 >= start && end2 <= end) {
            $('#admin_leave_total_days').text(totalDiff);
            exclude_days.text(diffDays2 + " day(s) excluded");
            exclude_days.css("color", "");
            $('#add_submit').prop('disabled', false);
        } else {
            exclude_days.text("Excluded date(s) should be within duration");
            exclude_days.css("color", "red");
            $('#add_submit').prop('disabled', true);
        }
    } else {
        $('#admin_leave_total_days').text(diffDays);
        exclude_days.text("");
        exclude_days.css("color", "");
    }
}

function admin_cb_duration(s, e, label) {
    $('#admin_leave_duration').val(s.format('MM/DD/YYYY') + ' - ' + e.format('MM/DD/YYYY'));
    var exclude = $('#admin_exclude_date_duration').val();
    var start = new Date(s.format('MM/DD/YYYY'));
    var end = new Date(e.format('MM/DD/YYYY'));
    var start2 = null, end2 = null;

    if (exclude) {
        var duration_tok = exclude.split(' ');
        start2 = new Date(duration_tok[0]);
        end2 = new Date(duration_tok[2]);
    }

    admin_getDaysDiff(start, end, start2, end2);
}

function admin_cb_exclude(s, e, label) {
    $('#admin_exclude_date_duration').val(s.format('MM/DD/YYYY') + ' - ' + e.format('MM/DD/YYYY'));
    var duration = $('#admin_leave_duration').val();
    var duration_tok = duration.split(' ');
    var start = new Date(duration_tok[0]);
    var end = new Date(duration_tok[2]);
    var start2 = new Date(s.format('MM/DD/YYYY'));
    var end2 = new Date(e.format('MM/DD/YYYY'));

    admin_getDaysDiff(start, end, start2, end2);
}

function check_leave_err(leave_nature, leave_reason, leave_total_days) {
    var validation_string = "";
    if (leave_nature == 0 || !leave_reason || leave_total_days == 0) {
        if (leave_total_days == 0) {
            validation_string += "0 days of leave applied. Please check duration and exclusion of date.\n";
        }
        if (leave_nature == 0 || !leave_reason) {
            validation_string += "Please make sure all fields are correctly filled up.\n";
        }
        return validation_string;
    } else {
        return false;
    }
}