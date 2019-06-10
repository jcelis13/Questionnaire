$(document).ready(function() {
    var globalTimeout = null,
        USER_NAME = null,
        USER_ID = null,
        DATE_SELECTED = null,
        mainDataTable = $(".main-table"),
        userDataTable = $(".user-table"),
        dateAbsent = $("#date_absent"),
        userModal = $(".user-modal");

    dateAbsent.datepicker({
        autoclose: true,
        todayHighlight: true,
        format: 'yyyy-mm-dd'
    });

    $('#employee_search').keyup(function(e) {
        if (globalTimeout != null) {
            clearTimeout(globalTimeout);
        }
        globalTimeout = setTimeout(function() {
            globalTimeout = null;
            if(e.target.value.length > 2) {
                $.ajax({
                    type: "POST",
                    url: site_url + "ajax/absent_ajax/search",
                    data: {search_key: e.target.value},
                    success:function (data){
                        mainDataTable.html("");
                        mainDataTable.append(data);
                    }
                });
            } else if(e.target.value.length == 0) {
                $.ajax({
                    type: "POST",
                    url: site_url + "ajax/absent_ajax/search",
                    data: {search_key: 'none'},
                    success:function (data){
                        mainDataTable.html("");
                        mainDataTable.append(data);
                    }
                });
            }
        }, 500);
    });

    mainDataTable.on("click", ".activate_wrapper", function() {
        if($(this).data('id') != USER_ID) {
            dateAbsent.val('');
            DATE_SELECTED = null;
            userDataTable.html("");
        }
        USER_NAME = $(this).data('name');
        USER_ID = $(this).data('id');
        $("#user_name").html(USER_NAME);
        userModal.modal('show');
    });

    dateAbsent.on('changeDate', function(e) {
        DATE_SELECTED = e.target.value;
        $.ajax({
            type: "POST",
            url: site_url + "ajax/absent_ajax/select_user_absent",
            data: {search_id: USER_ID, date_absent: DATE_SELECTED},
            success:function (data){
                userDataTable.html(data);
            }
        });
    });

    userDataTable.on("click", ".activate_wrapper", function() {
        var absent_id = $(this).data('id');
        $.ajax({
            type: "POST",
            url: site_url + "ajax/absent_ajax/delete_absent",
            data: {delete_id: absent_id, user_id: USER_ID, date: DATE_SELECTED},
            success:function (data){
                if(data == 'error') {
                    alert("ERROR DELETING LOG.");
                } else {
                    userDataTable.html(data);
                }
            }
        });
    });

});