var vaccine_status = null;

function bind_events() {
    $('.ht_profile_btn').prop('disabled', false);

    $('.ht_profile_btn').on("click", function () {
        var target = $().attr('data-target');
        $(target).modal('show');
    });

    $('.modify-ht-btn').on("click", function () {
        var target = $().attr('data-target');
        var action = $().attr('data-action');
        $(target).modal('show');
        $(target + "_action").html(action);
    });

    $('#vf_shot_date').datepicker();
    $('#vf_next_shot').datepicker();
    $('#hp_docu_date').datepicker();

   

    $('#vaccine_table').on("click", ".btn_cancel_vaccine", function () {
        var id = $(this).attr('data-id');
        $('#edit-' + id).hide();
        $('#vaccine-' + id).parent().show();
    });

    $('#vaccine_table').on("click", ".btn_update_vaccine", function () { 
        var valid = true;
        var shot_date = $('#edit_hp_vaccine_shot_date').val();
        var status = $('#edit_hp_vaccine_status').find(":selected").val();

        if (shot_date == '' || status == '0') {
            valid = false;
        }

        if (valid) {
            $('#hp_update_btn').attr("hrecord-type", "vaccine");
            $('#hp_update_btn').attr("hrecord-action", "update");
            $('#hp_update_btn').attr("emp-hrecord-id", $('.btn_update_vaccine').attr("data-id"));
            $("#hp_update_btn").trigger("click");
        }
        else {
            alert("Please fill up required fields");
        }
    });

    $('body').on("click", ".edit-btn", function () {
        var id = $(this).attr('data-id');
        var row = $('#vaccine-' + id).parent();
        
        edit_html = '';
        edit_html += '<tr id="edit-'+id+'">';
        edit_html += '    <td>' + row.find("td:nth-child(1)").text() + '</td>';
        edit_html += '        <td><input class="form-control" type="text" id="edit_hp_vaccine_shot_date" value="' + row.find("td:nth-child(2)").text() + '" placeholder="Required"></td>';
        edit_html += '            <td><input class="form-control" type="text" id="edit_hp_vaccine_next_shot" value="' + row.find("td:nth-child(3)").text() + '" placeholder="" ></td>';
        edit_html += '                <td style="text-align:center;">';
        edit_html += '                    <select class="form-control" id="edit_hp_vaccine_status">';
        edit_html += '                        <option disabled value="0" >Select Status required</option>';
        edit_html += '                        <option value="1">On Going</option>';
        edit_html += '                        <option value="2">Done</option>';
        edit_html += '                    </select>';
        edit_html += '                </td>';
        edit_html += '                <td style="text-align:center;">';
        edit_html += '                    <table style="margin-auto;">';
        edit_html += '                       <tbody><tr>';
        edit_html += '                            <td data-original-title="Cancel" data-toggle="tooltip">';
        edit_html += '                                <button class="btn btn-default btn-flat btn_cancel_vaccine" data-id="' + id + '">';
        edit_html += '                                    <i class="fa fa-times"></i>';
        edit_html += '                                </button>';
        edit_html += '                            </td>';
        edit_html += '                            <td data-original-title="Save" data-toggle="tooltip">';
        edit_html += '                                <button class="btn btn-primary btn-flat btn_update_vaccine" data-id="' + id + '">';
        edit_html += '                                    <i class="fa fa-check"></i>';
        edit_html += '                                </button>';
        edit_html += '                            </td></tr></tbody> </table></td></tr>';


        $('#vaccine_table > tbody > tr').eq(row.index()).after(edit_html);
        $('#edit_hp_vaccine_shot_date').datepicker();
        $('#edit_hp_vaccine_next_shot').datepicker();
       // $('#edit_hp_vaccine_status').val(row.find('button.hp-status-btn').attr('data-original-title'));

        $("#edit_hp_vaccine_status option").filter(function () {
            return this.text == row.find('button.hp-status-btn').attr('data-original-title');
        }).attr('selected', true);

        $('#vaccine_table > tbody > tr').eq(row.index()).hide();
        
    }); //vaccine edit

    

}

function filter_emp_visits(item, val, text) {
    u_id = val;

    $('#visit_history_table > tbody  > tr').each(function () {
        var user_id = $(this).attr('data-uid');
        if (user_id != u_id) {
            $(this).hide();
        }
    });
}

 function displayHealthProfile(item, val, text) {
     user_id = val;

     $('#health_search_profile').attr('data-id', user_id);
     $('#upload_result_doc').attr('data-uid', user_id);

    $.ajax({
        type: "POST",
        url: site_url + "ajax/health_tracker_ajax/get_user_health_profile",
        data: { user_id: val },
        beforeSend: function () {
            //$('#add_loan').prop('disabled', true).html('<i class="fa fa-spinner fa-pulse"></i>');
        },
        success: function (response) {
            //$('#add_loan').prop('disabled', false).html('<i class="fa fa-plus"></i> Add loan');
            var result = JSON.parse(response);

            vaccine_status = result.vaccine_status;

            fill_profile(result.user_profile);
            fill_conditions(result.conditions);
            fill_allergies(result.allergies);
            fill_vaccines(result.vaccines);
            fill_documents(result.documents);

            bind_events();
        }
    });
 }

function fill_profile(user_profile) {
    $('#ht-profile-name').html(user_profile.full_name);
    $('#ht-profile-gender').html(user_profile.gender_type);
    var age = (typeof user_profile.age != 'undefined') ? user_profile.age : "";
    $('#ht-profile-age').html(age);
    $('#ht-profile-bdate').html(user_profile.birth_date);
    $('#ht-profile-blood').html(user_profile.blood_type);
    $('#ht-profile-marital-stat').html(user_profile.marital_status);

 }

function fill_conditions(conditions) {
    $('#btn_add_condition_modal').attr('data-count', conditions.length )
    if (conditions.length > 0) {
        var c_html = '';
        $.each(conditions, function (key, value) {
            c_html += ' <p> <span id="condition-' + value.id + '">' + jsUcfirst(value.name) + '</span> <a href="javascript:;" data-toggle="modal" data-target="#profile_update_modal" class="delete-btn ht_delete" id="condition_delete_' + value.id + '" title="Delete Condition"> x </a></p>';
        });
        $('#condition_list').html(c_html);
    } else {
        $('#condition_list').html('<p class="grey-text" id="zero_cond_txt"> No known conditions. </p>');
    }
}

function fill_allergies(allergies) {
    $('#btn_add_allergy_modal').attr('data-count', allergies.length)
    if (allergies.length > 0) {
        var a_html = '';
        $.each(allergies, function (key, value) {
            a_html += ' <p> <span id="allergy-' + value.id + '"> ' + jsUcfirst(value.name) + '</span> <a href="javascript:;" data-toggle="modal" data-target="#profile_update_modal" class="delete-btn ht_delete" id="allergy_delete_' + value.id + '" title="Delete Allergy"> x </a></p>';
        });
        $('#allergy_list').html(a_html);
    } else {
        $('#allergy_list').html('<p class="grey-text" id="zero_allergy_txt"> No known allergies. </p>');
    }
}

function fill_vaccines(vaccines, update = false) {
    if (!update) {
        $('#vaccine_table tbody').html("");
    }

    if (vaccines.length > 0) {
        var v_html = '';
        $.each(vaccines, function (key, vaccine) {
            var v_status_icon = (vaccine.status == 'On Going') ? "arrow-circle-right" : "check-circle";
            var v_status_btn = (vaccine.status == 'On Going') ? "warning" : "info";
            
            v_html += '<tr data-id="' + vaccine.id + '">';
            v_html += '    <td id="vaccine-' + vaccine.id +'">' + jsUcfirst(vaccine.vaccine_name) + '</td>';
            v_html += '    <td>' + vaccine.date_shot + '</td>';
            v_html += '    <td>' + vaccine.date_next_shot + '</td>';
            v_html += '    <td style="text-align:center;">';
            v_html += '        <button class="btn btn-' + v_status_btn +' btn-flat hp-status-btn" style="cursor:default;" data-original-title="' + vaccine.status + '" data-toggle="tooltip">';
            v_html += '            <i class="fa fa-' + v_status_icon + '" ></i> </button></td>';
            v_html += '    <td><table style="margin: auto;">';
            v_html += '        <tr>';
            v_html += '            <td data-original-title="Edit Vaccine Record" data-toggle="tooltip">';
            v_html += '                <button class="btn btn-success btn-flat edit-btn" data-id="' + vaccine.id + '" >';
            v_html += '                    <i class="fa fa-edit" ></i>';
            v_html += '                </button>';
            v_html += '            </td>';
            v_html += '            <td data-original-title="Delete  Vaccine Record" data-toggle="tooltip">';
            v_html += '                <button class="btn btn-danger btn-flat delete-btn"  data-toggle="modal" data-target="#profile_update_modal" id="vaccine_delete_' + vaccine.id + '" >';
            v_html += '                    <i class="fa fa-trash-o" ></i>';
            v_html += '                </button>';
            v_html += '            </td>';
            v_html += '        </tr>';
            v_html += '    </table> </td>';
            v_html += '</tr >';
        });
        $('#vaccine_table > tbody').append(v_html);
    }
}

function fill_documents(documents, update = false) {
    console.log('isUpdate? ' + update);
    if (!update) {
        $('#result_doc_table tbody').html("");
        
    } 
   
    if (documents.length > 0) {
        var d_html = '';
        $.each(documents, function (key, docu) {
            d_html += '<tr data-uid="' + docu.id + '">';
            d_html += '    <td id="result-' + docu.id + '">' + docu.result_date + '</td>';
            d_html += '    <td>' + docu.result_type + '</td>';
            d_html += '    <td>' + docu.description + '</td>';
            d_html += '    <td><table style="margin: auto;">';
            d_html += '        <tr>';
            d_html += '            <td data-original-title="View Result Record" data-toggle="tooltip">';
            d_html += '                <button class="btn btn-success btn-flat view-result-btn" data-filename="' + docu.result_img + '" id="result_view_' + docu.id + '" >';
            d_html += '                    <i class="fa fa-file-o" ></i>';
            d_html += '                </button>';
            d_html += '            </td>';
            d_html += '            <td data-original-title="Delete Result Record" data-toggle="tooltip">';
            d_html += '                <button class="btn btn-danger btn-flat delete-btn"  data-toggle="modal" data-target="#profile_update_modal" id="result_delete_' + docu.id + '" >';
            d_html += '                    <i class="fa fa-trash-o" ></i>';
            d_html += '                </button>';
            d_html += '            </td>';
            d_html += '        </tr>';
            d_html += '    </table> </td>';
            d_html += '</tr >';
        });
        $('#result_doc_table > tbody').append(d_html);
    }
}

function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function auto_complete_hrecord(input_id, callback) {
    var input_param = input_id.split("_");
    
    $.ajax({
        type: "POST",
        url: site_url + "ajax/health_tracker_ajax/get_hrecords",
        data: { htype: input_param[input_param.length - 1] },
        beforeSend: function () {
            $('#' + input_id).prop('disabled', true);
        },
        success: function (response) {
            $('#' + input_id).prop('disabled', false);

            if (response.indexOf('Message:') > -1) {

            } else {
                var data_obj = jQuery.parseJSON(response);
                var hrecord = [];

                $.each(data_obj, function (key, value) {
                    hrecord.push({
                        id: value['id'],
                        name: jsUcfirst(value['name'])
                    });
                });

                $('#' + input_id).typeahead({
                    source: hrecord,
                    itemSelected: callback,
                    items: 10
                });
            }
        }
    });
}


$(document).ready(function () {
    
    auto_complete_controller('emp_visit_search', filter_emp_visits);

    auto_complete_controller('vhf_emp', function (item, val, text) {
        $('#vhf_emp').attr('data-id', val);
        $('#vhf_emp').prop('disabled', true).css("background", "white");
        $("#emp-clear").removeClass('hidden');
    });

    auto_complete_hrecord('vhf_finding', function (item, val, text) {
        $('#vhf_finding').attr('data-id', val);
        $('#vhf_finding').prop('disabled', true).css("background", "white");
        $("#finding-clear").removeClass('hidden');
    });

    $('#emp-clear a').on("click", function () {
        $("#emp-clear").addClass('hidden');
        $('#vhf_emp').attr('data-id', '').val("");
        $('#vhf_emp').prop('disabled', false);
    });

    $('#finding-clear a').on("click", function () {
        $("#finding-clear").addClass('hidden');
        $('#vhf_finding').attr('data-id', '').val("");
        $('#vhf_finding').prop('disabled', false);
    });

    $('.btn_view_visit_details').on("click", function () {
        var rowid = $(this).data('id');
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/health_tracker_ajax/show_visit_details',
            data: { visit_id: rowid },
            success: function (response) {
                var data_obj = jQuery.parseJSON(response);

                $('#vd-emp-name').html(jsUcfirst(data_obj.visit_details.full_name));
                $('#vd-complain').html(jsUcfirst(data_obj.visit_details.complain));
                $('#vd-finding').html(jsUcfirst(data_obj.visit_details.finding));
                $('#vd-intervention').html(data_obj.visit_details.intervention);
                $('#vd-action').html(jsUcfirst(data_obj.visit_details.action));
                $('#vd-nurse').html(jsUcfirst(data_obj.visit_details.nurse));
                $('#vd-docs-note').parent().parent().removeClass('hidden');
                $('#vd-docs-note').html(data_obj.visit_details.docs_note);
                $('#vdm-vdate').html(data_obj.visit_date);
                
                $('#visit-details-modal').modal('show');
            }
        });
    });

    $('.btn_edit_visit_details').on("click", function () {
        var rowid = $(this).data('id');
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/health_tracker_ajax/show_visit_details',
            data: { visit_id: rowid },
            success: function (response) {
                var data_obj = jQuery.parseJSON(response);

                $('#vhe_emp').val(jsUcfirst(data_obj.visit_details.full_name));
                $('#vhe_emp').attr("data-id", jsUcfirst(data_obj.visit_details.user_id));
                $('#vhe_complain').val(jsUcfirst(data_obj.visit_details.complain));
                $('#vhe_finding').val(jsUcfirst(data_obj.visit_details.finding));
                $('#vhe_finding').attr("data-id",jsUcfirst(data_obj.visit_details.finding_id));
                $('#vhe_intervention').val(data_obj.visit_details.intervention);
                $('#vhe_action').val(jsUcfirst(data_obj.visit_details.action_id));
                $('#vhe_note').val(jsUcfirst(data_obj.visit_details.note));
                $('#vhe_docs_note').val(data_obj.visit_details.docs_note);
                $('#edit-visit-modal #vdm-vdate').html(data_obj.visit_date);

                $('#visit_save_btn').attr("rel", jsUcfirst(data_obj.visit_details.id));
                $('#visit_delete_btn').attr("rel", jsUcfirst(data_obj.visit_details.id));

                $('#edit-visit-modal').modal('show');
            }
        });
    });

    $('#visit-details-modal').on('hidden.bs.modal', function () {
        if ($('#vdm-vdate').html() == "Review") {
            $('#vd-nurse').parent().parent().show();
            $('#visit_confirmation_btn').addClass('hidden');
            $('#vd-note').parent().parent().addClass('hidden');
            $('#vd-docs-note').parent().parent().addClass('hidden');
            $('#vdm-vdate').html("");
        }

        $('#vd-emp-name').html("");
        $('#vd-complain').html("");
        $('#vd-finding').html("");
        $('#vd-intervention').html("");
        $('#vd-action').html("");
        $('#vd-nurse').html("");
        $('#vdm-vdate').html("");
    });
   
    $('#visit_add_btn').on("click", function () {
        var valid = true;
        var va_add_emp = $('#vhf_emp').attr('data-id');
        var v_add_complain = $('#vhf_complain').val();
        var v_add_finding = $('#vhf_finding').val();
        var v_add_intervention = $('#vhf_intervention').val();
        var v_add_action = $('#vhf_action').find(":selected");

        if (va_add_emp == "" || v_add_complain == "" || v_add_finding == "" || v_add_action.val() == "0") {
            valid = false;
        }

        if (valid) {
            $('#vd-emp-name').html($('#vhf_emp').val());
            $('#vd-complain').html(jsUcfirst(v_add_complain));
            $('#vd-finding').html(jsUcfirst(v_add_finding));
            $('#vd-intervention').html(v_add_intervention);
            $('#vd-action').html(v_add_action.text());
            $('#vd-nurse').parent().parent().hide();
            $('#vd-note').parent().parent().removeClass('hidden');
            $('#vd-docs-note').parent().parent().removeClass('hidden');
            $('#vd-note').html($('#vhf_note').val());
            $('.cmn-t-underline #vd-docs-note').html($('#vhf_docs_note').val());
            $('#vdm-vdate').html("Review");

            $('#visit_confirmation_btn').removeClass('hidden');
            $('#visit-details-modal').modal('show');
        }
        else {
            alert("Please fill up required fields");
        }
    });

    $('#visit_confirmation_btn').on("click", function () {
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/health_tracker_ajax/save_visit_details',
            data: {
                user_id : $('#vhf_emp').attr('data-id'),
                complain : $('#vhf_complain').val(),
                finding_text: $('#vhf_finding').val(),
                finding_id: $('#vhf_finding').attr('data-id'),
                intervention: $('#vhf_intervention').val(),
                note: $('#vhf_note').val(),
                docs_note: $('#vhf_docs_note').val(),
                action_id: $('#vhf_action').find(":selected").val()
            },
            success: function (response) {
                location.reload();
            }
        });
    });

    $('#visit_delete_btn').on("click", function () {
        var rowid = $(this).attr('rel');
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/health_tracker_ajax/delete_visit_details',
            data: { visit_id: rowid },
            success: function (response) {
                location.reload();
            }
        });
    });

    $('#visit_save_btn').on("click", function () {
        var rowid = $(this).attr('rel');

        var valid = true;
        var va_add_emp = $('#vhe_emp').attr('data-id');
        var v_add_complain = $('#vhe_complain').val();
        var v_add_finding = $('#vhe_finding').val();
        var v_add_intervention = $('#vhe_intervention').val();
        var v_add_action = $('#vhe_action').find(":selected");

        if (va_add_emp == "" || v_add_complain == "" || v_add_finding == "" || v_add_action.val() == "0") {
            valid = false;
        }

        if (valid) {
            $.ajax({
                type: "POST",
                url: site_url + 'ajax/health_tracker_ajax/save_visit_details',
                data: {
                    visit_id: rowid,
                    user_id: $('#vhe_emp').attr('data-id'),
                    complain: $('#vhe_complain').val(),
                    finding_text: $('#vhe_finding').val(),
                    finding_id: $('#vhe_finding').attr('data-id'),
                    intervention: $('#vhe_intervention').val(),
                    note: $('#vhe_note').val(),
                    docs_note: $('#vhe_docs_note').val(),
                    action_id: $('#vhe_action').find(":selected").val()
                },
                success: function (response) {
                    location.reload();
                }
            });
        }
        else {
            alert("Please fill up required fields");
        }
        
    });


   ////////////////////////////////////////////////////////////////////////////////

    auto_complete_controller('health_search_profile', displayHealthProfile);

    auto_complete_hrecord('hp_condition', function (item, val, text) {
        $('#hp_condition').attr('data-id', val);
        $('#hp_condition').prop('disabled', true).css("background", "white");
    });

    auto_complete_hrecord('hp_allergy', function (item, val, text) {
        $('#hp_allergy').attr('data-id', val);
        $('#hp_allergy').prop('disabled', true).css("background", "white");
        //$("#finding-clear").removeClass('hidden');
    });

    auto_complete_hrecord('hp_vaccine', function (item, val, text) {
        $('#hp_vaccine').attr('data-id', val);
        $('#hp_vaccine').prop('disabled', true).css("background", "white");
    });

    auto_complete_hrecord('edit_hp_vaccine', function (item, val, text) {
        $('#edit_hp_vaccine').attr('data-id', val);
        $('#edit_hp_vaccine').prop('disabled', true).css("background", "white");
    });

    $('body').on("click", '.delete-btn', function () {
        var details = $(this).attr('id').split("_");

        var msg = "<p>Delete " + details[0] + ": <strong>" + $('#' + details[0] + "-" + details[2]).html() + "</strong>?</p>";
        $('#hp_update_btn').attr("hrecord-type", details[0]);
        $('#hp_update_btn').attr("hrecord-action", details[1]);
        $('#hp_update_btn').attr("emp-hrecord-id", details[2]);

        $('#update_review').html(msg);
    });

    $('#hp_vaccine_shot_date').datepicker();
    $('#hp_vaccine_next_shot').datepicker();

    $("#add_allergy_list").on('show.bs.collapse', function () {
        if ($('#btn_add_allergy_modal').attr('data-count') == "0"){
            $('#zero_allergy_txt').hide();
        }
        $('#hp_allergy').prop('disabled', false)
    });
    $("#add_allergy_list").on('hide.bs.collapse', function () {
        if ($('#btn_add_allergy_modal').attr('data-count') == "0") {
            $('#zero_allergy_txt').show();
        }
        $('#hp_allergy').attr('data-id', "");
        $('#hp_allergy').val("");
    });

    $("#add_cond_list").on('show.bs.collapse', function () {
        if ($('#btn_add_condition_modal').attr('data-count') == "0") {
            $('#zero_cond_txt').hide();
        }
        $('#hp_condition').prop('disabled', false)
    });
    $("#add_cond_list").on('hide.bs.collapse', function () {
        if ($('#btn_add_condition_modal').attr('data-count') == "0") {
            $('#zero_cond_txt').show();
        }
        $('#hp_condition').attr('data-id', "");
        $('#hp_condition').val("");
    });

    $("#add_vaccine_list").on('show.bs.collapse', function () {
        $('#hp_vaccine').prop('disabled', false)
    });
    $("#add_vaccine_list").on('hidden.bs.collapse', function () {
        $('#hp_vaccine').attr('data-id', "");
        $('#hp_vaccine').val("");
        $('#hp_vaccine_shot_date').val("");
        $('#hp_vaccine_next_shot').val("");
        $('#hp_vaccine_status').val("0");
    });

    $('#condition_add_btn').on("click", function () {
        var msg = "<p>Add condition: <strong>" + $('#hp_condition').val() + "</strong>?</p>";
        $('#hp_update_btn').attr("hrecord-type", "condition");
        $('#hp_update_btn').attr("hrecord-action", "add");
        $('#update_review').html(msg);
    });

    $('#allergy_add_btn').on("click", function () {
        var msg = "<p>Add allergy: <strong>" + $('#hp_allergy').val() + "</strong>?</p>";
        $('#hp_update_btn').attr("hrecord-type", "allergy");
        $('#hp_update_btn').attr("hrecord-action", "add");
        $('#update_review').html(msg);
    });

    $('.btn_save_vaccine').on("click", function () {
        var valid = true;
        var vaccine_name = $('#hp_vaccine').val();
        var shot_date = $('#hp_vaccine_shot_date').val();
        var status = $('#hp_vaccine_status').find(":selected").val();

        if (vaccine_name == '' || shot_date == '' || status == '0'){
            valid = false;
        }

        if (valid) {
            $('#hp_update_btn').attr("hrecord-type", "vaccine");
            $('#hp_update_btn').attr("hrecord-action", "add");
            $("#hp_update_btn").trigger("click");
        }
        else {
            alert("Please fill up required fields");
        }
       
    });

    $('#document_add_btn').on("click", function () {
        var valid = true;
        var result_date = $('#hp_docu_date').val();
        var result_type = $('#hp_docu_type').find(":selected").val();
        var result_desc = $('#hp_docu_desc').val();
        var result_img = $('#hp_docu_img').val();

        if (result_date == '' || result_desc == '' || result_img == "" || result_type == '0') {
            valid = false;
        }

        if (valid) {
            $('#hp_update_btn').attr("hrecord-type", "result");
            $('#hp_update_btn').attr("hrecord-action", "add");
            $("#hp_update_btn").trigger("click");
        }
        else {
            alert("Please fill up all fields");
        }

    });

    $('#hp_update_btn').on("click", function () {
        var hrecord_type = $('#hp_update_btn').attr("hrecord-type");
        var hrecord_action = $('#hp_update_btn').attr("hrecord-action");

        if (hrecord_action == 'delete') {
            var emp_hrecord_id = $('#hp_update_btn').attr("emp-hrecord-id");
            $.ajax({
                type: "POST",
                url: site_url + 'ajax/health_tracker_ajax/delete_employee_hrecord',
                data: {
                    hrecord_type: hrecord_type,
                    emp_hrecord_id: emp_hrecord_id
                },
                success: function (response) {
                    var data = jQuery.parseJSON(response);

                    $('#' + hrecord_type + "-" + emp_hrecord_id).parent().remove();
                }
            });
        }
        else {
            var details = {};
            details.hrecord_type = hrecord_type;
            details.hrecord_action = hrecord_action;

            if (hrecord_action == 'add') {
               
                details.user_id = $('#health_search_profile').attr('data-id');

                if (hrecord_type == "result") {
                    details.result_date = $('#hp_docu_date').val();
                    details.result_type_id = $('#hp_docu_type').find(":selected").val();
                    details.result_type = $('#hp_docu_type').find(":selected").text();
                    details.description = $('#hp_docu_desc').val();
                    details.result_img = $('#hp_docu_img').val();

                } else {
                    details.hrecord_value = $('#hp_' + hrecord_type).val();
                    details.hrecord_id = $('#hp_' + hrecord_type).attr('data-id');

                    if (hrecord_type == "vaccine") {
                        details.date_shot = $('#hp_vaccine_shot_date').val();
                        details.date_next_shot = $('#hp_vaccine_next_shot').val();
                        details.status_id = $('#hp_vaccine_status').find(":selected").val();
                        details.status = $('#hp_vaccine_status').find(":selected").text();
                    }
                }
            }
            else {
                //update vaccine
                details.emp_hrecord_id = $(this).attr('emp-hrecord-id');
                details.date_shot = $('#edit_hp_vaccine_shot_date').val();
                details.date_next_shot = $('#edit_hp_vaccine_next_shot').val();
                details.status_id = $('#edit_hp_vaccine_status').find(":selected").val();
                details.status = $('#edit_hp_vaccine_status').find(":selected").text();
            }

            $.ajax({
                type: "POST",
                url: site_url + 'ajax/health_tracker_ajax/update_health_profile',
                data: details,
                success: function (response) {
                    var data = jQuery.parseJSON(response);
                    var hrecord_html = '';

                    if (hrecord_action == 'add') {
                        switch (hrecord_type) {
                            case 'condition':
                            case 'allergy':
                                var hrecord_html = '<p> ' + jsUcfirst($('#hp_' + hrecord_type).val()) + ' <a href="javascript:;" class="delete-btn ht_delete" id="' + hrecord_type + '_delete_' + data.id + '" title="Delete ' + jsUcfirst(hrecord_type) + '"> x </a></p>';
                                $('#' + hrecord_type + "_list").append(hrecord_html);

                                break;

                            case 'vaccine':
                                details.id = data.id;
                                details.vaccine_name = details.hrecord_value;
                                var new_vaccine = [];
                                new_vaccine.push(details);
                                fill_vaccines(new_vaccine, true);
                                break;

                            case 'result':
                                $('#hp_docu_date').val("");
                                $('#hp_docu_type').find(":selected").val("0");
                                $('#hp_docu_desc').val("");
                                $('#hp_docu_img').val("");
                                $('#files').html("");
                                $('#results_modal').modal('hide');

                                details.id = data.id;
                                details.result_date = data.result_date;
                                var new_docu = [];
                                new_docu.push(details);
                                fill_documents(new_docu, true);
                                break;

                            default: break;
                        }
                        
                        var data_count = parseInt($('#btn_add_' + hrecord_type + '_modal').attr('data-count'));
                        $('#btn_add_' + hrecord_type + '_modal').attr('data-count', ++data_count);
                        $("#btn_add_" + hrecord_type + "_modal").trigger("click");

                    }
                    else {
                        
                        var edited_row = $('#vaccine-' + details.emp_hrecord_id).parent();
                        var v_status_icon = (details.status == 'On Going') ? "arrow-circle-right" : "check-circle";
                        var v_status_btn = (details.status == 'On Going') ? "warning" : "info";
                        hrecord_html += '        <button class="btn btn-' + v_status_btn + ' btn-flat hp-status-btn" style="cursor:default;" data-original-title="' + details.status + '" data-toggle="tooltip">';
                        hrecord_html += '            <i class="fa fa-' + v_status_icon + '" ></i> </button>';

                        edited_row.find("> td:nth-child(2)").text(data.date_shot);
                        edited_row.find("td:nth-child(3)").text(data.next_shot);
                        edited_row.find("td:nth-child(4)").html(hrecord_html);

                        $('#edit-' + details.emp_hrecord_id).remove();
                        edited_row.show();
                    }
                }
            });
        }

        if (hrecord_action != 'update') {
            auto_complete_hrecord('hp_' + hrecord_type, function (item, val, text) {
                $('#hp_' + hrecord_type).attr('data-id', val);
                $('#hp_' + hrecord_type).prop('disabled', true).css("background", "white");
            });
        }
        
    });

   
    

});

