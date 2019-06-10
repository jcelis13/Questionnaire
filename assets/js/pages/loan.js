
/** Added November 25,2015 **/

$(document).ready(function(){
    var typingTimer;
    var typingInterval = 1000;
    var typingIntervalCalc = 2000;
    //$('#amount_due').val('');
    $('#empname').val('');
    $('#search-loan-by-name').val('');
    var optionSet = {
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        },
        opens: 'left'
    };

    $('#effective_date').datepicker();
    $('#edit_effective_date').datepicker();
    $('#date_granted').datepicker();
    $('#edit_date_granted').datepicker();
    $('#date_range').daterangepicker(optionSet, filter);
    
    function search_name()
    {
        var empid = $('#empid').val();
        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/loan_ajax/get_employee_name',
            data: {empid: empid},
            success:function(data){
                $('#empname').val(data);
            }
        });
    }


    $(document).on('keyup','#amount, #terms_to_pay, #interest, #amount_due, #current_term, #amount_remaining', function(e){
        e.preventDefault();
        var amount = $('#amount').val();
        var terms_to_pay = $('#terms_to_pay').val();
        var interest = $('#interest').val();
        var amount_due = $('#amount_due').val();
        var current_term = $('#current_term').val();
        var amount_remaining = $('#amount_remaining').val();


        if(isNaN(amount) || isNaN(interest) || isNaN(terms_to_pay) || isNaN(amount_due) || isNaN(current_term) || isNaN(amount_remaining) ){
            $('#add-nan-err').show();
            document.getElementById("add_btn").disabled = true;
        }
        else{
            $('#add-nan-err').hide();
            document.getElementById("add_btn").disabled = false;
            /**
             amount = parseFloat(amount);
             interest = parseFloat(interest);

             var amount_due = (amount+interest)/terms_to_pay;
             $('#amount_due').val(parseFloat(amount_due).toFixed(2));
             if(current_term){
                var amount_remaining = (amount+interest)-(amount_due*current_term) ;
                if(amount_remaining < 0) amount_remaining = 0;
                $('#amount_remaining').val(parseFloat(amount_remaining).toFixed(2));
            }
             */
        }
    });


    $(document).on('keyup','#edit_amount, #edit_terms_to_pay, #edit_interest, #edit_amount_due, #edit_current_term, #edit_amount_remaining', function(e){
        e.preventDefault();
        var amount = $('#edit_amount').val();
        var terms_to_pay = $('#edit_terms_to_pay').val();
        var interest = $('#edit_interest').val();
        var amount_due = $('#edit_amount_due').val();
        var current_term = $('#edit_current_term').val();
        var amount_remaining = $('#edit_amount_remaining').val();

        if(isNaN(amount) || isNaN(interest) || isNaN(terms_to_pay) || isNaN(amount_due) || isNaN(current_term) || isNaN(amount_remaining) ){
            $('#edit-nan-err').show();
            document.getElementById("edit_btn").disabled = true;
        }
        else{
            $('#edit-nan-err').hide();
            document.getElementById("edit_btn").disabled = false;

            /**
             amount = parseFloat(amount);
             interest = parseFloat(interest);

             var amount_due = (amount+interest)/terms_to_pay;
             $('#edit_amount_due').val(parseFloat(amount_due).toFixed(2));
             if(current_term){
                var amount_remaining = (amount+interest)-(amount_due*current_term) ;
                if(amount_remaining < 0) amount_remaining = 0;
                $('#edit_amount_remaining').val(parseFloat(amount_remaining).toFixed(2));
            }
             */
        }
    });


    /**
    $(document).on('keyup','#amount_due' , function(e){
        var amount = $('#amount').val();
        var interest = $('#interest').val();
        var amount_due = $('#amount_due').val();
        var current_term = $('#current_term').val();

        if( isNaN(amount_due) ){
            $('#add-nan-err').show();
            document.getElementById("add_btn").disabled = true;
        }
        else {
            $('#add-nan-err').hide();
            document.getElementById("add_btn").disabled = false;

            amount = parseFloat(amount);
            interest = parseFloat(interest);
            amount_due = parseFloat(amount_due);

            var terms_to_pay = (amount+interest) / amount_due;
            $('#terms_to_pay').val(Math.ceil(terms_to_pay));

            if(current_term){
                var amount_remaining = (amount+interest)-(amount_due*current_term) ;
                if(amount_remaining < 0) amount_remaining = 0;
                $('#amount_remaining').val(parseFloat(amount_remaining).toFixed(2));
            }

        }
    });


    $(document).on('keyup','#current_term' , function(e){
        var amount = $('#amount').val();
        var interest = $('#interest').val();
        var amount_due = $('#amount_due').val();
        var current_term = $('#current_term').val();
        if(isNaN(current_term) ){
            $('#add-nan-err').show();
            document.getElementById("add_btn").disabled = true;
        }
        else {
            $('#add-nan-err').hide();
            document.getElementById("add_btn").disabled = false;

            amount = parseFloat(amount);
            interest = parseFloat(interest);
            amount_due = parseFloat(amount_due);

            var amount_remaining = (amount+interest)-(amount_due*current_term) ;
            if(amount_remaining < 0) amount_remaining = 0;

            $('#amount_remaining').val(parseFloat(amount_remaining).toFixed(2));
        }
    });


    $(document).on('keyup','#edit_amount_due' , function(e){
        var amount = $('#edit_amount').val();
        var interest = $('#edit_interest').val();
        var amount_due = $('#edit_amount_due').val();
        var current_term = $('#edit_current_term').val();

        if( isNaN(amount_due) ){
            $('#edit-nan-err').show();
            document.getElementById("edit_btn").disabled = true;
        }
        else {
            $('#edit-nan-err').hide();
            document.getElementById("edit_btn").disabled = false;

            amount = parseFloat(amount);
            interest = parseFloat(interest);
            amount_due = parseFloat(amount_due);

            var terms_to_pay = (amount+interest) / amount_due;
            $('#edit_terms_to_pay').val(Math.ceil(terms_to_pay));

            if(current_term){
                var amount_remaining = (amount+interest)-(amount_due*current_term) ;
                if(amount_remaining < 0) amount_remaining = 0;
                $('#edit_amount_remaining').val(parseFloat(amount_remaining).toFixed(2));
            }

        }
    });


    $(document).on('keyup','#edit_current_term' , function(e){
        var amount = $('#edit_amount').val();
        var interest = $('#edit_interest').val();
        var amount_due = $('#edit_amount_due').val();
        var current_term = $('#edit_current_term').val();
        if(isNaN(current_term) ){
            $('#edit-nan-err').show();
            document.getElementById("edit_btn").disabled = true;
        }
        else {
            $('#edit-nan-err').hide();
            document.getElementById("edit_btn").disabled = false;

            amount = parseFloat(amount);
            interest = parseFloat(interest);
            amount_due = parseFloat(amount_due);

            var amount_remaining = (amount+interest)-(amount_due*current_term) ;
            if(amount_remaining < 0) amount_remaining = 0;

            $('#edit_amount_remaining').val(parseFloat(amount_remaining).toFixed(2));
        }
    });
     */


    $(document).on('click','#add_btn',function(e){
        e.preventDefault();

        var employee = $('#employee').val();
        var amount = $('#amount').val();
        //var terms_to_pay = $('#terms_to_pay').val();
        var interest = $('#interest').val();
        var amount_due = $('#amount_due').val();
        //var current_term = $('#current_term').val();
        var amount_remaining = $('#amount_remaining').val();
        var date_granted = $('#date_granted').val();
        var effective_date = $('#effective_date').val();

        if(employee && amount && interest && amount_due && date_granted && effective_date && amount_remaining){
            $('#add-allfield-err').hide();

            var form = $('#create-form').serializeArray();
            $.ajax({
                type: 'POST',
                url: site_url + 'ajax/loan_ajax/create_loan',
                data: {form: form},
                success:function(data){
                    filter();
                },
                complete:function(data){
                    $('#create-loan-modal').modal('hide');
                    document.getElementById("create-form").reset();
                }
            });
        }
        else
            $('#add-allfield-err').show();

        return false;
    });


    $(document).on('click','#edit_btn',function(e){
        e.preventDefault();
        var amount = $('#edit_amount').val();
        //var terms_to_pay = $('#edit_terms_to_pay').val();
        var interest = $('#edit_interest').val();
        var amount_due = $('#edit_amount_due').val();
        //var current_term = $('#edit_current_term').val();
        var amount_remaining = $('#edit_amount_remaining').val();
        var date_granted = $('#edit_date_granted').val();
        var effective_date = $('#edit_effective_date').val();
        var loan_id = $('#edit_loan_id').val();

        if(amount && interest && amount_due && date_granted && effective_date && amount_remaining){
            $('#edit-allfield-err').hide();
            var form = $('#edit-form').serializeArray();
            console.log(loan_id);
            $.ajax({
                type: 'POST',
                url: site_url + 'ajax/loan_ajax/update_loan',
                data: {
                    loan_id: loan_id,
                    form: form
                },
                success:function(data){
                    filter();
                },
                complete:function(data){
                    $('#edit-loan-modal').modal('hide');
                    document.getElementById("edit-form").reset();
                }
            });
        }
        else
            $('#edit-allfield-err').show();
    });


    function search_loan_by_name()
    {
        $('#loan-body-table').empty();
        var employee_name = $('#search-loan-by-name').val();

        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/loan_ajax/get_loan_by_name',
            data: {employee_name: employee_name},
            success:function(data){
                $('#loan-table').DataTable().destroy();
                $('#loan-body-table').html('');
                $('#loan-body-table').html(data);
                $('#loan-table').DataTable( {
                    "pagingType": "full_numbers",
                    "iDisplayLength": 20,
                    "bSort" : false
                } );
            }
        });

    }


    $(document).on('keyup','#payment_period',function(e){
        e.preventDefault();
        clearTimeout(typingTimer);
        if($('#empid').val())
        {
            typingTimer = setTimeout(calculate_due,typingIntervalCalc);
        }

    });


    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }


    function displayResult(item, val, text) {
     $('#empid').val(val);
    }


    $(document).on('keyup','#employee',function(e){
        if($('#employee').val())
        {
            $.ajax({
            type: "POST", 
            url: site_url + "ajax/loan_ajax/get_names",
             success: function(response) {
              $('#employee').css('display', 'block');

              if (response.indexOf('Message:') > -1) {

              } else {
                var data_obj = jQuery.parseJSON(response); 
                var names = [];

                $.each(data_obj, function(key, value) {
                  var capitalized_name = '';

                  if (typeof(value['first_name']) === 'string') {
                    var name_split = value['first_name'].split(' ');
                    capitalized_name = '';
                    for(c = 0 ; c < name_split.length ; c++) {
                      capitalized_name += toTitleCase(name_split[c]) + ' ';
                    }
                  }

                  names.push({
                    id: value['user_id'],
                    name: capitalized_name + value['last_name']
                  });
                });
                
                $('#employee').typeahead({
                  source: names,
                  itemSelected: displayResult,
                  items: 10
                });
              }
            }
          });
        }

    });


    $("#search-loan-by-name").keypress(function(e) {
        if(e.which == 13) {
            e.preventDefault();
            if ($('#search-loan-by-name').val()) {
                search_loan_by_name();
            }
        }
    });


    function filter(){
        var department = $("#department-filter").val();
        var loan_type = $("#loan-type-filter").val();
        var date_range = $('#date_range').val();

        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/loan_ajax/get_loan',
            data:{
                department: department,
                loan_type:loan_type,
                date_range:date_range
            },
            success:function(data){
                $('#loan-body-table').empty();
                $('#loan-table').DataTable().destroy();
                $('#loan-body-table').html('');
                $('#loan-body-table').html(data);
                $('#loan-table').DataTable( {
                    "pagingType": "full_numbers",
                    "iDisplayLength": 10,
                    "bSort" : false
                } );
            }
        });
    }


    $(document).on('change','#department-filter, #loan-type-filter',function(e){
        e.preventDefault();
        filter();
    });


    $(document).on('click','.btn-update-loan',function(e){
        e.preventDefault();
        var loan_id = $(this).attr('data-id');
        
        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/loan_ajax/update_loan_type_view',
            data:{loan_id: loan_id},
            beforeSend:function(data){ 
                $('#date_cancelled').hide();
                $('#edit_btn').hide();
            },
            success:function(data){ 
                $('#edit_btn').show();
                var pdata = jQuery.parseJSON( data ); 
                $('#edit_loan_id').val(pdata.loan_id);
                $('#edit_empid').val(pdata.employee_id);
                $('#edit_empname').val(pdata.full_name);
                $('#edit_amount').val(pdata.amount);
                $('#edit_terms_to_pay').val(pdata.terms_to_pay);
                $('#edit_interest').val(pdata.interest);
                $('#edit_amount_due').val(pdata.amount_due);
                $('#edit_current_term').val(pdata.current_term);
                $('#edit_amount_remaining').val(pdata.amount_remaining);

                if(pdata.date_granted){
                    var ed = (pdata.date_granted).split("-");
                    $('#edit_date_granted').val(ed[1]+'/'+ed[2]+'/'+ed[0]);
                }
                else
                     $('#edit_date_granted').val('');

                if(pdata.date_start){
                    var ed = (pdata.date_start).split("-");
                    $('#edit_effective_date').val(ed[1]+'/'+ed[2]+'/'+ed[0]);
                }
                else
                    $('#edit_effective_date').val('');
                
                //loan type
                var element = document.getElementById('edit_loan_type');
                element.value = pdata.loan_type_id;

                if(pdata.date_cancelled != null){
                    var ed = (pdata.date_cancelled).split("-");
                    $('#edit_date_cancelled').val(ed[1]+'/'+ed[2]+'/'+ed[0]);
                    $('#date_cancelled').show();
                    $('#edit_btn').hide();
                }

                $('#edit-loan-modal').modal('show'); 
            }
        });
    });


    $(document).on('click','.btn_delete_loan',function(e){
        e.preventDefault();
        $('#delete_loan_btn').attr('data-id','');
        $('#delete_loan_btn').attr('data-id',$(this).attr('data-id'));
        $('#loan-remove-modal').modal('show');
    });


    $(document).on('click','.btn_cancel_loan',function(e){
        e.preventDefault();
        $('#cancel_loan_btn').attr('data-id','');
        $('#cancel_loan_btn').attr('data-id',$(this).attr('data-id'));
        $('#loan-cancel-modal').modal('show');
    });


    $(document).on('click','#delete_loan_btn',function(e){
        e.preventDefault();
        var loan_id = $(this).attr('data-id');

        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/loan_ajax/delete_loan',
            data:{loan_id: loan_id},
            success:function(data){
                filter();
            },
            complete: function(data){
                $('#loan-remove-modal').modal('hide');
            }
        });
    });


    $(document).on('click','#cancel_loan_btn',function(e){
        e.preventDefault();
        var loan_id = $(this).attr('data-id');

        $.ajax({
            type: 'POST',
            url: site_url + 'ajax/loan_ajax/cancel_loan',
            data:{loan_id: loan_id},
            success:function(data){
                filter();
            },
            complete: function(data){
                $('#loan-cancel-modal').modal('hide');
            }
        });
    });


    $(document).on('click','#btn-create',function(e)
    {
        e.preventDefault();
        $('#create-loan-modal').modal('show');
        
    });

    $(document).on('click','#btn-type',function(e)
    {
        e.preventDefault();
        $('#loan-type-modal').modal('show');
    });

    $(document).on('click','#add_type_btn',function(e){
        e.preventDefault();
        $('#loan-type-form').submit();
    });

    
    

});