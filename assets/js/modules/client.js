$(document).ready(function () {
    $('#client-table').DataTable({
        "pagingType": "full_numbers",
        "iDisplayLength": 20
    });

    $('#add-date-started').datepicker();
    $('#edit-date-started').datepicker();


    $(document).on("click", "#add-client-btn", function (event) {
        event.isDefaultPrevented();
        $('#new_client').modal('show');
        return false;
    });


    $(document).on('click', '.archive-client-entry-btn', function (event) {
        event.isDefaultPrevented();
        var client_id = $(this).attr('data-id');
        $('#archive-client-submit').attr('data-id', client_id);
        $('#archive_client').modal('show');
        return false;
    });


    $(document).on("click", ".edit-client-entry-btn", function (event) {
        event.isDefaultPrevented();
        var client_id = $(this).attr('data-id');

        $.ajax({
            type: "POST",
            url: site_url + "ajax/client_ajax/get_client",
            data: { client_id: client_id },
            success: function (response) {
                var pdata = jQuery.parseJSON(response);
                var date = new Date(pdata.date_started);
                $('#edit-client-name').val(pdata.client_name);
                $('#edit-date-started').datepicker('setDate', new Date((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()));
                $('#edit-gsd').val(pdata.gsdname);
                $('#edit-operation-manager').val(pdata.omname);
                $('#edit-account-manager').val(pdata.amname);
                $('#edit-gsdid').val(pdata.gsd);
                $('#edit-omid').val(pdata.operation_manager);
                $('#edit-amid').val(pdata.account_manager);
                $('input[name="ot_offset"][value="'+pdata.ot_offset+'"]').prop("checked",true);
                $('#edit-client-btn').attr('data-id', pdata.ID);

                $('#edit_client').modal('show');
            }
        });
        return false;
    });


    $(document).on("click", "#archive-client-submit", function (event) {
        var ID = $('#archive-client-submit').attr('data-id');
        $.ajax({
            type: "POST",
            url: site_url + "ajax/client_ajax/archive_client",
            data: { ID: ID },
            success: function (response) {
                location.reload();
            }
        });
        return false;
    });


    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }

    function displayGSD(item, val, text) {
        $('#gsdid').val(val);
    }

    function displayOM(item, val, text) {
        $('#omid').val(val);
    }

    function displayAM(item, val, text) {
        $('#amid').val(val);
    }

    function displayEditGSD(item, val, text) {
        $('#edit-gsdid').val(val);
    }

    function displayEditOM(item, val, text) {
        $('#edit-omid').val(val);
    }

    function displayEditAM(item, val, text) {
        $('#edit-amid').val(val);
    }

    function get_names(id, selected) {
        var names = [];
        $.ajax({
            type: "POST",
            url: site_url + "ajax/client_ajax/get_names",
            success: function (response) {
                $(id).css('display', 'block');
                if (response.indexOf('Message:') > -1) {

                } else {
                    var data_obj = jQuery.parseJSON(response);
                    $.each(data_obj, function (key, value) {
                        var capitalized_name = '';

                        if (typeof (value['first_name']) === 'string') {
                            var name_split = value['first_name'].split(' ');
                            capitalized_name = '';
                            for (c = 0; c < name_split.length; c++) {
                                capitalized_name += toTitleCase(name_split[c]) + ' ';
                            }
                        }

                        names.push({
                            id: value['user_id'],
                            name: capitalized_name + value['last_name']
                        });
                    });

                    switch (selected) {
                        case 'displayAM':
                            $(id).typeahead({
                                source: names,
                                itemSelected: displayAM,
                                items: 10
                            });
                            break;
                        case 'displayEditAM':
                            $(id).typeahead({
                                source: names,
                                itemSelected: displayEditAM,
                                items: 10
                            });
                            break;
                        case 'displayOM':
                            $(id).typeahead({
                                source: names,
                                itemSelected: displayOM,
                                items: 10
                            });
                            break;
                        case 'displayEditOM':
                            $(id).typeahead({
                                source: names,
                                itemSelected: displayEditOM,
                                items: 10
                            });
                            break;
                    }
                }
            }
        });
    }




    function get_gsd_names(id, selected) {
        var names = [];
        $.ajax({
            type: "POST",
            url: site_url + "ajax/client_ajax/get_gsd_names",
            success: function (response) {
                $(id).css('display', 'block');
                if (response.indexOf('Message:') > -1) {

                } else {
                    var data_obj = jQuery.parseJSON(response);
                    $.each(data_obj, function (key, value) {
                        var capitalized_name = '';

                        if (typeof (value['first_name']) === 'string') {
                            var name_split = value['first_name'].split(' ');
                            capitalized_name = '';
                            for (c = 0; c < name_split.length; c++) {
                                capitalized_name += toTitleCase(name_split[c]) + ' ';
                            }
                        }

                        names.push({
                            id: value['user_id'],
                            name: capitalized_name + value['last_name']
                        });
                    });

                    switch (selected) {
                        case 'displayGSD':
                            $(id).typeahead({
                                source: names,
                                itemSelected: displayGSD,
                                items: 10
                            });
                            break;
                        case 'displayEditGSD':
                            $(id).typeahead({
                                source: names,
                                itemSelected: displayEditGSD,
                                items: 10
                            });
                            break;
                    }
                }
            }
        });
    }


    $(document).on('keyup', '#add-gsd', function (e) {
        if ($('#add-gsd').val()) {
            get_gsd_names('#add-gsd', 'displayGSD');
        }

    });

    $(document).on('keyup', '#add-operation-manager', function (e) {
        if ($('#add-operation-manager').val()) {
            get_names('#add-operation-manager', 'displayOM');
        }

    });

    $(document).on('keyup', '#add-account-manager', function (e) {
        if ($('#add-account-manager').val()) {
            get_names('#add-account-manager', 'displayAM');
        }

    });

    $(document).on('keyup', '#edit-gsd', function (e) {
        if ($('#edit-gsd').val()) {
            get_gsd_names('#edit-gsd', 'displayEditGSD');
        }

    });


    $(document).on('keyup', '#edit-operation-manager', function (e) {
        if ($('#edit-operation-manager').val()) {
            get_names('#edit-operation-manager', 'displayEditOM');
        }

    });

    $(document).on('keyup', '#edit-account-manager', function (e) {
        if ($('#edit-account-manager').val()) {
            get_names('#edit-account-manager', 'displayEditAM');
        }

    });


    $(document).on('submit', '#add-client-form', function (event) {
        event.isDefaultPrevented();
        var form_data = $(this).serializeArray();
        $.ajax({
            type: "POST",
            url: site_url + "ajax/client_ajax/insert_client",
            data: { form_data: form_data },
            success: function (response) {
                location.reload();
            }
        });

        event.preventDefault();
        return false;
    });


    $(document).on('submit', '#edit-client-form', function (event) {
        event.isDefaultPrevented();
        var form_data = $(this).serializeArray();
        var ID = $('#edit-client-btn').attr('data-id');

        $.ajax({
            type: "POST",
            url: site_url + "ajax/client_ajax/edit_client",
            data: { ID: ID, form_data: form_data },
            success: function (response) {
                location.reload();
            }
        });

        event.preventDefault();
        return false;
    });
    
///////////////////////////
//   client EMP LOOK-UP

    $('#employee-table').dataTable({
        "pagingType": "full_numbers",
        "iDisplayLength": 10,
        "processing" : true
    });
    

    $('#inpt_client').on('change', function (e) {
        var valueSelected = this.value;
        $('#employee-table').DataTable().clear().draw();
        $.ajax({
            type: "POST",
            url: site_url + "ajax/client_ajax/get_employees_by_client",
            data: { client_id: valueSelected},
            success: function (response) {
                var emp_list = JSON.parse(response);
                if (emp_list.length > 0) {
                    $.each(emp_list, function (index, emp) {
                        if (emp.date_started == null || emp.date_started == "" || emp.date_started == "N/A") {
                            var date_start = moment("01-01-1970").format("MMM DD , YYYY");
                        }
                        else {
                            date_start = moment(emp.date_started).format("MMM DD , YYYY");
                        }
                        $('#employee-table').DataTable().row.add([
                            "<a href='#' class='emp_profile_link' rel='" + emp.user_id + "' >  " + emp.full_name + "</a>",
                            emp.position,
                            emp.team_name,
                            date_start
                        ]).draw(true);
                    });
                } 
            }
        });

    });

    $('body').on("click", ".emp_profile_link", function(e){
        var emp_id = $(this).attr('rel');
        $.ajax({
            type: "POST",
            url: site_url + "ajax/client_ajax/get_employee_profile",
            data: { user_id: emp_id },
            success: function (response) {
                var data = JSON.parse(response);
                if (data['success']) {
                    $('#e_full_name').html(data['user_profile'].full_name);
                    $('#e_registered_address').html(data['user_profile'].registered_address);
                    $('#e_gender_type').html(jsUcfirst(data['user_profile'].gender_type));
                    $('#e_blood_type').html(data['user_profile'].blood_type);
                    $('#e_marital_status').html(jsUcfirst(data['user_profile'].marital_status));
                    $('#e_is_full_name').html(data['user_profile'].is_full_name);
                    $('#e_email').html(data['user_profile'].email);
                    $('#e_branch').html(data['user_profile'].branch);
                    $('#e_dept_name').html(data['user_profile'].dept_name);
                    $('#e_team_name').html(data['user_profile'].team_name);
                    $('#e_pos_desc').html(data['user_profile'].pos_desc);
                    $('#e_stat_desc').html(jsUcfirst(data['user_profile'].stat_desc));
                    $('#e_role_type').html(jsUcfirst(data['user_profile'].role_type));
                    $('#e_date_started').html(data['user_profile'].date_started);

                    $('#emp_profile_modal').modal('show');
                }
            }
        });

    });

    function jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
	
});