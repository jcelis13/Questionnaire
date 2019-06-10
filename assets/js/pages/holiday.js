
/* Added by Nico Oct 27, 2015 */

$(document).ready(function(){

    /* Holiday JS */
    
    $('#holiday_date').datepicker({ 
     dateFormat: 'yyyy-mm-dd',
     minDate: '+5d',
     changeMonth: true,
     changeYear: true,
     altField: "#idTourDateDetailsHidden",
     altFormat: "yyyy-mm-dd"
 });


    $(document).on('click','#create-holiday-btn',function(e){
        e.preventDefault();
        var holiday = $('#holiday_name').val(), 
        holiday_location = $('#holiday_location').val();
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/holiday_ajax/check_holiday',
            data: {
                holiday: holiday,
                holiday_location : holiday_location 
            },
            success: function(data){ 
                var pdata = jQuery.parseJSON( data );
				if(pdata.dup === null || true){
					$('#add-holiday-form').submit();
                    $('.err-duplicate').hide();
                }   
                else
                   $('.err-duplicate').show();
            }
        });
        
    });

    $(document).on('click','#create-holiday-type-btn',function(e){
        e.preventDefault();

        $('#add-holiday-type-form').submit();
    });
    

    $(document).on('click','.btn_edit_holiday',function(e){
        e.preventDefault();
        var h_id = $(this).attr("data-id");

        $("#edit-holiday-tbody").empty();
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/holiday_ajax/fetch_holiday',
            data: {h_id: h_id},
            success: function(data){
                $("#edit-holiday-tbody").append(data);
                $('#holiday_date_modal').datepicker({dateFormat: 'MM/dd/yyyy'});
                $("#holiday-modal").modal("show");
            }
        });
    });


    $(document).on('click','.btn_add_holiday',function(e){
        e.preventDefault();
        $("#add-holiday-modal").modal("show");
    });

    $(document).on('click','.btn_add_holiday_type',function(e){
        e.preventDefault();
        $("#add-holiday-type-modal").modal("show");
    });


    $(document).on('click','.btn_edit_holiday_type',function(e){
        e.preventDefault();
        var h_id = $(this).attr("data-id");
        $("#edit-holiday-type-tbody").empty();
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/holiday_ajax/fetch_holiday_type',
            data: {h_id: h_id},
            success: function(data){
                $("#edit-holiday-type-tbody").append(data); 
                $('#holiday_type_modal').datepicker({dateFormat: 'MM dd, yy'});
                $("#holiday-type-modal").modal("show");
            }
        });
    });


    $(document).on('click','#update_btn',function(e){
        e.preventDefault();
        $('#update-form').submit();
    });


    $(document).on('click','#update_ht_btn',function(e){
        e.preventDefault();
        $('#update-ht-form').submit();
    });


    $(document).on('click','#btn_delete_holiday', function(e){
        e.preventDefault();
        var id = $(this).data('id');
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/holiday_ajax/delete_holiday',
            data: {h_id: id},
            success: function(data){
                window.location.href= site_url + 'holiday/';
            }
        });
    });


    $(document).on('click','.delete_holiday', function(e){
        e.preventDefault();
        var id = $(this).attr('data-id');
        $('#btn_delete_holiday').data('id', id);
        $("#delete-holiday-modal").modal("show");

    });

    /* Holiday Types JS 
    $(document).on('click','.btn_edit_holiday_type',function(e){
        e.preventDefault();
        $("#holiday-modal").modal("show");
    });
    */

    $(document).on('click','#btn_delete_holiday_type', function(e){
        e.preventDefault();
        var id = $(this).data('id');
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/holiday_ajax/delete_holiday_type',
            data: {h_t_id: id},
            success: function(data){
                window.location.href= site_url + 'holiday';
            }
        });
    });

    $(document).on('click','.delete_holiday_type', function(e){
        e.preventDefault();
        var id = $(this).attr('data-id');
        $('#btn_delete_holiday_type').data('id', id);
        $("#delete-holiday-type-modal").modal("show");
    });

    /* Page switch */
    $(document).on('click','#btn',function(e){
        e.preventDefault();
        var link = $(this).attr("data-link")
        window.location.href = link;

    });

});
