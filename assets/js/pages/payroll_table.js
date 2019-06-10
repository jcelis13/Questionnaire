$(document).ready(function() {

  var queue = 0;

  var main_calc_all_taxable_income_delay = 1; // ms
  var delay_timer = 500;

  var protected_fields = [
    'user_id', 
    'last_name', 
    'first_name', 
    'p_daily_rate',
    // 'p_working_days',
    // 'p_days_worked',
    'p_monthly_basic',

    'p_min_tardy',
    'p_min_undertime',
    'p_min_regular_night_diff',
    'p_min_regular_h',
    'p_min_sh',
    'p_min_regular_ot',
    'p_min_regular_rd_ot',
    'p_min_holiday_ot',
    'p_min_sh_ot',
    'p_min_holiday_rd_ot',
    'p_min_sh_rd_ot',

    'p_rice_allowance',
    'p_laundry_allowance',
    'p_clothing_allowance',
    'p_meal_allowance',
    'p_other_benefits1',
    'p_other_benefits2',
    'p_other_benefits3',
    'p_productivity',

    'reg_basic',

    'tardy',
    'undertime',
    'night_differential',
    'regular_holiday_pay',
    'special_holiday_pay',
    'ot_pay_regular',
    'ot_pay_rd',
    'ot_pay_regular_h',
    'ot_pay_sh',
    'ot_pay_rd_h',
    'ot_pay_rd_sh',
    'productivity',
    'poc_incentive',
    'contingency_bonus',

    'rice_allowance',
    'laundry_allowance',
    'clothing_allowance',
    'meal_allowance',
    'other_benefits1',
    'other_benefits2',
    'other_benefits3',

    'total_deductions',
    'p_taxable_income',
    'p_dependents',
    'p_tax_withheld',
    'p_net_income'
  ];

  function set_not_allowed_field_cursor() {
    for (var c = 0 ; c < protected_fields.length ; ++c) {
      $("td." + protected_fields[c]).css("cursor", "not-allowed");
      // console.log("td." + protected_fields[c]);
    }
  }

  $(function () {
    $("[data-toggle='tooltip']").tooltip();
  });

  /* Start JS Controls for Update Employee Employment Number */

  $(document).on("click", ".update-employment-number", function() {
    var user_id = $(this).prop("id");

    window.open(site_url + "employee/edit_employee_profile/" + user_id);
    //alert(user_id);
    // $("#emp-number").html( user_id );
    // $("#update-employee-employment-number").modal("show");
  });

  $(document).on("keydown", "#employment-number-input", function() {
    //console.log("!");
  });

  /* End JS Controls for Update Employee Employment Number */

  function modifyClass(target, currentClass, toClass) {
    $(target).removeClass(currentClass);
    $(target).addClass(toClass);
  }

  function fetch_html_value(selector, parse_type) {
    var vHtml = 0;
    var cleaned_value = removeCommasReturnAsFloat( $(selector).html() );
    parse_type = parse_type || "int";

    switch(parse_type) {
      case "int":
        vHtml = parseInt( cleaned_value );
        break;

      case "float":
        vHtml = parseFloat( cleaned_value );
        break;

      default:
        vHtml = parseInt( cleaned_value );
        break;
    }

    return  vHtml;
  }

  function ajax_fetch_secondary_payroll_data(dept_id, payperiod_id) {
    $.ajax({
      type: "POST",
      url: base_url + "ajax/payroll_table_ajax/ajax_fetch_payroll_secondary_data",
      data: {dept_id: dept_id, payperiod_id: payperiod_id},
      beforeSend: function() {
        modifyClass("#payroll-ajax-loader", "fa fa-laptop", "fa fa-refresh fa-spin");
      },
      success: function(table_rows) {
        modifyClass("#payroll-ajax-loader", "fa fa-refresh fa-spin", "fa fa-laptop");

        $("#payroll-table-body").append(table_rows);
      }
    });
  }

  // $(function(){
  //   var pop = function(){
  //     $('#screen').css({'display': 'block', opacity: 0.7, 'width':$(document).width(),'height':$(document).height()});
  //     $('body').css({'overflow':'hidden'});
  //     $('#box').css({'display': 'block'}).click(function(){$(this).css('display', 'none');$('#screen').css('display', 'none')});
  //   }
  //   $('#button').click(pop);
  // });

  function ajax_fetch_primary_payroll_data(dept_id, payperiod_id) {
    $.ajax({
      type: "POST",
      url: base_url + "ajax/payroll_table_ajax/ajax_fetch_payroll_primary_data",
      data: {dept_id: dept_id, payperiod_id: payperiod_id},
      beforeSend: function() {
        $('#screen').css({'display': 'block', opacity: 0.7, 'width':$(document).width(),'height':$(document).height()});
        $('body').css({'overflow':'hidden'});
        $('#box').css({'display': 'block'});

        $(".super_outer_div").toggle("clip");

        $("#payroll-ajax-status-notifier").html('<i class="fa fa-spinner fa-spin fa-2x"></i> ' + "Loading Payroll Data, please wait.");
        // modifyClass("#payroll-ajax-loader", "fa fa-laptop", "fa fa-refresh fa-spin");
        $("#payroll-export").prop("disabled", true);
      },
      success: function(table_rows) {
        $("#box").css('display', 'none');
        $('body').css({'overflow':'visible'});
        $('#screen').css('display', 'none');

        $(".super_outer_div").toggle("clip");
        // alert(table_rows.length);
        // alert(table_rows);
        // console.log(table_rows);
        $("#payroll-ajax-status-notifier").html('<i class="fa fa-bolt fa-2x"></i> ' + "Payroll Data successfully retrieved.");

        $("#download-export").prop("href", base_url + "payroll/create_excel_file/" + dept_id + "/" + payperiod_id);

        // modifyClass("#payroll-ajax-loader", "fa fa-refresh fa-spin", "fa fa-laptop");

        $("#payroll-table-body").empty();
        $("#payroll-table-body").append(table_rows);

        set_not_allowed_field_cursor();

        // performOnLoadCalculations();

        $("#payroll-export").prop("disabled", false);
      }
    });
  }

  $(document).on("click", "#payroll-calculate-all", function(event) {
    event.isDefaultPrevented();

    performOnLoadCalculations();
  });

  function performPayrollCalculationOnTr(employee_id) {
    var tr_selector = "tr.payroll" + employee_id;

    var _p_gross_pay = removeCommasReturnAsFloat( $(tr_selector).find("td" + '.p_gross_pay').html() );
    var _p_daily_rate = removeCommasReturnAsFloat( $(tr_selector).find("td" + ".p_daily_rate").html() );
    var _p_working_days = $(tr_selector).find("td" + ".p_working_days").html();

    console.log( "gross_pay: " + _p_gross_pay + " daily_rate: " + _p_daily_rate + " working_days" + _p_working_days );
    if ($.isNumeric(_p_gross_pay) && $.isNumeric(_p_daily_rate) && $.isNumeric(_p_working_days)) {
      if (_p_gross_pay > 0 && _p_daily_rate > 0 && _p_working_days > 0) {
        calc_daily_rate("td#" + employee_id, _p_gross_pay);
        calc_basic_pay("td#" + employee_id, _p_gross_pay);
      }
    }
  }

  function performOnLoadCalculations() {
    var save_payroll_counter = 0;

    $('tr').each(function(index, value) {
      var this_tr_class = $(value).prop("class");
      var data = this_tr_class.split("ll");

      //console.log( this_tr_class + " " + data[1] );

      var payroll_id = data[1];

      var input_selector = "input#" + payroll_id + ".";
      var td_selector = "td#" + payroll_id + ".";

      var td_html_content = removeCommasReturnAsFloat( $(this).find("td" + '.p_gross_pay').html() );
      var td_daily_rate = removeCommasReturnAsFloat( $(this).find("td" + ".p_daily_rate").html() );
      var td_working_days = removeCommasReturnAsFloat( $(this).find("td" + ".p_working_days").html() );

      var gross_pay = 0;
      var daily_rate = 0;
      var working_days = 0;

      console.log( "-> " + td_html_content + " " + td_daily_rate + " " + td_working_days );

      if ($.isNumeric( td_html_content ) && 
          $.isNumeric(td_daily_rate) && 
          $.isNumeric(td_working_days)) {

        // gross_pay = parseFloat( td_html_content );
        // daily_rate = parseInt( td_daily_rate );
        // working_days = parseInt( td_working_days );

        gross_pay = td_html_content;
        daily_rate = td_daily_rate;
        working_days = parseInt(td_working_days);

        // console.log("1st");

        if (gross_pay > 0 && daily_rate > 0 && working_days > 0) {
          save_payroll_counter += 1;
          calc_daily_rate( td_selector, gross_pay );
          calc_basic_pay( td_selector, gross_pay );

          // console.log("2nd");

          console.log( "---->-> " + td_html_content + " " + td_daily_rate + " " + td_working_days );

          //console.log("gp: " + gross_pay + " dr: " + daily_rate + " wd: " + working_days );
        }
      }
    });

    // if (save_payroll_counter > 0) {
    //   setTimeout(function() {
    //     $("#save-department-payroll").modal("show");
    //   }, 5000);
    // }
    
  }

  function sendPayrollData(data, mode, payroll_id, td) {
    var payroll_information = {
    
      payroll: {
        // change this user_id: data["user_id"] to employment_number: data["employment_number"] once db table has been updated.
        user_id: data["user_id"],
        p_pay_period: $("#payroll-payperiod-list-dropdown").find("option:selected").attr("id"),
        p_gross_pay:     parseFloat( data["p_gross_pay"] ),
        p_gross_income:  parseFloat( data["p_gross_income"] ),
        p_daily_rate:    parseFloat( data["p_daily_rate"] ),
        p_working_days:  parseFloat( data["p_working_days"] ),
        p_days_worked:   parseFloat( data["p_days_worked"] ),
        p_monthly_basic: parseFloat( data["p_monthly_basic"] ),

        p_min_tardy:              parseFloat( data["p_min_tardy"] ),
        p_min_undertime:          parseFloat( data["p_min_undertime"] ),
        p_min_regular_night_diff: parseFloat( data["p_min_regular_night_diff"] ),
        p_min_regular_h:          parseFloat( data["p_min_regular_h"] ),
        p_min_sh:                 parseFloat( data["p_min_sh"] ),
        p_min_regular_ot:         parseFloat( data["p_min_regular_ot"] ),
        p_min_regular_rd_ot:      parseFloat( data["p_min_regular_rd_ot"] ),
        p_min_holiday_ot:         parseFloat( data["p_min_holiday_ot"] ),
        p_min_sh_ot:              parseFloat( data["p_min_sh_ot"] ),
        p_min_sh_rd_ot:           parseFloat( data["p_min_sh_rd_ot"] ),
        p_min_holiday_rd_ot:      parseFloat( data["p_min_holiday_rd_ot"] ),

        p_rice_allowance:     parseFloat( data["p_rice_allowance"] ),
        p_laundry_allowance:  parseFloat( data["p_laundry_allowance"] ),
        p_clothing_allowance: parseFloat( data["p_clothing_allowance"] ),
        p_meal_allowance:     parseFloat( data["p_meal_allowance"] ),
        p_other_benefits1:    parseFloat( data["p_other_benefits1"] ),
        p_other_benefits2:    parseFloat( data["p_other_benefits2"] ),
        p_other_benefits3:    parseFloat( data["p_other_benefits3"] ),
        p_productivity:       parseFloat( data["p_productivity"] ),
        p_poc_incentive:      parseFloat( data["p_poc_incentive"] ),
        p_contingency_bonus:  parseFloat( data["p_contingency_bonus"] ),

        p_taxable_income: parseFloat( data["p_taxable_income"] ),
        p_dependents:     parseFloat( data["p_dependents"] ),
        p_tax_withheld:   parseFloat( data["p_tax_withheld"] ),
        p_net_income:     parseFloat( data["p_net_income"] )
      },

      payroll_deductions: {
        ca_salary_adjustment: parseFloat( data["ca_salary_adjustment"] ), // 
        gadget_loan:          parseFloat( data["gadget_loan"] ),
        gym:                  parseFloat( data["gym"] ),
        maxicare_principal:   parseFloat( data["maxicare_principal"] ),
        maxicare_dependent:   parseFloat( data["maxicare_dependent"] ),
        maxicare_dental:      parseFloat( data["maxicare_dental"] ),
        food_deduction:       parseFloat( data["food_deduction"] ),
        food_deduction2:      parseFloat( data["food_deduction2"] ),
        other_loan:           parseFloat( data["other_loan"] ),
        hdmf_house_loan:      parseFloat( data["hdmf_house_loan"] ),
        hdmf_salary_loan:     parseFloat( data["hdmf_salary_loan"] ),
        sss_salary_loan:      parseFloat( data["sss_salary_loan"] ),
        phic_employee:        parseFloat( data["phic_employee"] ),
        pagibig_employee:     parseFloat( data["pagibig_employee"] ),
        sss_employee:         parseFloat( data["sss_employee"] ),
        total_deductions:     parseFloat( data["total_deductions"] )
      },

      payroll_nontaxable_allowance: {
        rice_allowance:     parseFloat( data["rice_allowance"] ),
        laundry_allowance:  parseFloat( data["laundry_allowance"] ),
        clothing_allowance: parseFloat( data["clothing_allowance"] ),
        meal_allowance:     parseFloat( data["meal_allowance"] ),
        other_benefits1:    parseFloat( data["other_benefits1"] ),
        other_benefits2:    parseFloat( data["other_benefits2"] ),
        other_benefits3:    parseFloat( data["other_benefits3"] ),
        _13th_month:        parseFloat( data["_13th_month"] )
      },

      payroll_taxable_earning: {
        reg_basic:           parseFloat( data["reg_basic"] ),
        tardy:               parseFloat( data["tardy"] ),
        undertime:           parseFloat( data["undertime"] ),
        night_differential:  parseFloat( data["night_differential"] ),
        regular_holiday_pay: parseFloat( data["regular_holiday_pay"] ),
        special_holiday_pay: parseFloat( data["special_holiday_pay"] ),
        ot_pay_regular:      parseFloat( data["ot_pay_regular"] ),
        ot_pay_rd:           parseFloat( data["ot_pay_rd"] ),
        ot_pay_regular_h:    parseFloat( data["ot_pay_regular_h"] ),
        ot_pay_sh:           parseFloat( data["ot_pay_sh"] ),
        ot_pay_rd_h:         parseFloat( data["ot_pay_rd_h"] ),
        ot_pay_rd_sh:        parseFloat( data["ot_pay_rd_sh"] ),
        productivity:        parseFloat( data["productivity"] ),
        poc_incentive:       parseFloat( data["poc_incentive"] ),
        contingency_bonus:   parseFloat( data["contingency_bonus"] ),
        referral:            parseFloat( data["referral"] ),
        adjustments:         parseFloat( data["adjustments"] ) //(missing field)
      }

    };

    // console.log(payroll_information);

    switch(mode) {
      case "save":

      console.log("saving...");
      // alert("saving...");

        // alert("payroll_id: " + payroll_id + " / " + "");

        $.ajax({
          type: "POST",
          url: base_url + "ajax/payroll_ajax/ajax_save_payroll",
          data: { payroll_id: payroll_id, payroll_data: JSON.stringify(payroll_information, null, 4) },
          beforeSend: function() {
            $("#fetch-payroll").prop("disabled", true);

            $("#payroll-ajax-status-notifier").html('<i class="fa fa-spinner fa-spin fa-2x"></i> ' + "Sending (save) changes to database.");

            queue += 1;
            // $("#payroll-progress-loader").css("visibility", "visible");
            $("#queue").html("(" + queue + ")");
          },
          success: function(response) {
            $("#fetch-payroll").prop("disabled", false);

            $("#payroll-ajax-status-notifier").html('<i class="fa fa-check fa-2x"></i> ' + "Changes have been saved.");

            console.log("TYPE: " + mode);
            console.log(response);

            queue -= 1;
            // $("#payroll-progress-loader").css("visibility", "hidden");
            $("#queue").html("(" + queue + ")");

            //alert("(save response) latest payroll_id for this user: " + response);

            // bug: after saving new employee payroll, when you try to input more data, things don't update anymore.
            // fix: fetched recently created payroll_id under the employment_number, then assign it to the respective
            // tr td class="primary-td user_id" id="response"
            td.prop("id", response);
          }
        });

        break;
      case "update":

      console.log("updating...");

        $.ajax({
          type: "POST",
          url: base_url + "ajax/payroll_ajax/ajax_update_payroll",
          data: { payroll_id: payroll_id, payroll_data: JSON.stringify(payroll_information, null, 4) },
          beforeSend: function() {
            $("#fetch-payroll").prop("disabled", true);

            $("#payroll-ajax-status-notifier").html('<i class="fa fa-spinner fa-spin fa-2x"></i> ' + "Sending (update) changes to database.");

            queue += 1;
            // $("#payroll-progress-loader").css("visibility", "visible");
            $("#queue").html("(" + queue + ")");
          },
          success: function(response) {
            $("#fetch-payroll").prop("disabled", false);

            $("#payroll-ajax-status-notifier").html('<i class="fa fa-check fa-2x"></i> ' + "Changes have been saved.");

            console.log("TYPE: " + mode);
            console.log(response);

            queue -= 1;
            // $("#payroll-progress-loader").css("visibility", "hidden");
            $("#queue").html("(" + queue + ")");

            //alert("update response: " + response);
            ////console.log(response);
          }
        });

        break;

      default:
        alert("something went wrong!");
        break;
    }
  }

  function fetchFieldValues(payroll_id) {
    var associativeArray = new Array();

    $(".payroll" + payroll_id).find("td").each(function(index, value) {
      var input_child = $(value).children().is("input");

      var current_field_value = removeCommasReturnAsFloat( $.trim( $(value).html() ) );

      var obj_class = $(value).prop("class").split(" ");
      var db_table_data_description = obj_class[1];

      associativeArray[db_table_data_description] = current_field_value;
      console.log(db_table_data_description + " " + current_field_value);

      if (input_child) {
        var value = $(value).children().val();
        associativeArray[db_table_data_description] = value;
      }
    });

    return associativeArray;
  }

  // Payroll Calculations Function Start

  function main_calc_all_taxable_income(td_selector, monthly_basic, gross_pay) {
    // Added delay to prevent functions from getting value from data_row
    // functions use .html(), when editing, data_row is appended with <input>
    // the delay gives time for the <input> to revert back to html which corrects the NaN miscalculations.
    setTimeout(function() {
      calc_taxable_tardy(td_selector + "tardy", monthly_basic, fetch_html_value( td_selector + "p_min_tardy" ));
      calc_taxable_undertime(td_selector + "undertime", monthly_basic, fetch_html_value( td_selector + "p_min_undertime" ));
      calc_taxable_night_diff(td_selector + "night_differential", monthly_basic, fetch_html_value( td_selector + "p_min_regular_night_diff" ));
      calc_taxable_reg_holi_ot_pay(td_selector + "regular_holiday_pay", gross_pay, fetch_html_value( td_selector + "p_min_regular_h" ));
      calc_taxable_spec_holi_ot_pay(td_selector + "special_holiday_pay", gross_pay, fetch_html_value( td_selector + "p_min_sh" ));
      calc_taxable_regular_ot_pay(td_selector + "ot_pay_regular", gross_pay, fetch_html_value( td_selector + "p_min_regular_ot" ));

      calc_taxable_reg_rd_ot(td_selector + "ot_pay_rd", gross_pay, fetch_html_value( td_selector + "p_min_regular_rd_ot" ));
      calc_taxable_holi_ot(td_selector + "ot_pay_regular_h", gross_pay, fetch_html_value( td_selector + "p_min_holiday_ot" ));
      calc_taxable_sh_ot(td_selector + "ot_pay_sh", gross_pay, fetch_html_value( td_selector + "p_min_sh_ot" ));
      calc_taxable_holi_rd_ot(td_selector + "ot_pay_rd_sh", gross_pay, fetch_html_value( td_selector + "p_min_holiday_rd_ot" ));
      calc_taxable_sh_rd_ot(td_selector + "ot_pay_rd_h", gross_pay, fetch_html_value( td_selector + "p_min_sh_rd_ot" ));
    }, main_calc_all_taxable_income_delay);
  }

  function calc_taxable_contingency_bonus(td_selector) {
    var taxable_contingency_bonus = 0;

    if ( $.isNumeric( fetch_html_value(td_selector + "p_contingency_bonus") ) ) {
      taxable_contingency_bonus += ( fetch_html_value(td_selector + "p_contingency_bonus") / 2 );
    }

    assign_calculation_result_to_field(td_selector + "contingency_bonus", taxable_contingency_bonus);
  }

  function calc_taxable_poc_incentive(td_selector) {
    var taxable_poc_incentive = 0;

    if ( $.isNumeric( fetch_html_value(td_selector + "p_poc_incentive") ) ) {
      taxable_poc_incentive += ( fetch_html_value(td_selector + "p_poc_incentive") / 2 );
    }

    assign_calculation_result_to_field(td_selector + "poc_incentive", taxable_poc_incentive);
  }

  function calc_net_income(td_selector) {
    var gross_income = 0;
    var total_deductions = 0;
    var tax_withheld = 0;

    if ($.isNumeric( fetch_html_value( td_selector + "p_gross_income" ) ) ) {
      gross_income += fetch_html_value(td_selector + "p_gross_income", "float");
    } if ($.isNumeric( fetch_html_value( td_selector + "total_deductions" ) ) ) {
      total_deductions += fetch_html_value(td_selector + "total_deductions", "float");
    } if ($.isNumeric( fetch_html_value( td_selector + "p_tax_withheld" ) ) ) {
      tax_withheld += fetch_html_value(td_selector + "p_tax_withheld", "float");
    }

    console.log("NET_INCOME: " + gross_income + ", " + total_deductions + ", " + tax_withheld);

    var net_income = parseFloat( gross_income - total_deductions - tax_withheld );
    //console.log( "gross_income: " + gross_income + " total_deductions: " + total_deductions + " tax_withheld: " + tax_withheld );
    //console.log( "net_income: " + net_income  );
    assign_calculation_result_to_field(td_selector + "p_net_income", net_income);
  }

  function calc_gross_income(td_selector) {
    var gross_income = 0;

    if ( $.isNumeric( fetch_html_value( td_selector + "night_differential" ) ) ) {
      gross_income += fetch_html_value(td_selector + "night_differential", "float");
      console.log( "night_differential" + " = " + fetch_html_value(td_selector + "night_differential", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "regular_holiday_pay" ) ) ) {
      gross_income += fetch_html_value(td_selector + "regular_holiday_pay", "float");
      console.log( "regular_holiday_pay" + " = " + fetch_html_value(td_selector + "regular_holiday_pay", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "special_holiday_pay" ) ) ) {
      gross_income += fetch_html_value(td_selector + "special_holiday_pay", "float");
      console.log( "special_holiday_pay" + " = " + fetch_html_value(td_selector + "special_holiday_pay", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_regular" ) ) ) {
      gross_income += fetch_html_value(td_selector + "ot_pay_regular", "float");
      console.log( "ot_pay_regular" + " = " + fetch_html_value(td_selector + "ot_pay_regular", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_rd" ) ) ) {
      gross_income += fetch_html_value(td_selector + "ot_pay_rd", "float");
      console.log( "ot_pay_rd" + " = " + fetch_html_value(td_selector + "ot_pay_rd", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_regular_h" ) ) ) {
      gross_income += fetch_html_value(td_selector + "ot_pay_regular_h", "float");
      console.log( "ot_pay_regular_h" + " = " + fetch_html_value(td_selector + "ot_pay_regular_h", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_sh" ) ) ) {
      gross_income += fetch_html_value(td_selector + "ot_pay_sh", "float");
      console.log( "ot_pay_sh" + " = " + fetch_html_value(td_selector + "ot_pay_sh", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_rd_h" ) ) ) {
      gross_income += fetch_html_value(td_selector + "ot_pay_rd_h", "float");
      console.log( "ot_pay_rd_h" + " = " + fetch_html_value(td_selector + "ot_pay_rd_h", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_rd_sh" ) ) ) {
      gross_income += fetch_html_value(td_selector + "ot_pay_rd_sh", "float");
      console.log( "ot_pay_rd_sh" + " = " + fetch_html_value(td_selector + "ot_pay_rd_sh", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "poc_incentive" ) ) ) {
      gross_income += fetch_html_value(td_selector + "poc_incentive", "float");
      console.log( "poc_incentive" + " = " + fetch_html_value(td_selector + "poc_incentive", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "contingency_bonus" ) ) ) {
      gross_income += fetch_html_value(td_selector + "contingency_bonus", "float");
      console.log( "contingency_bonus" + " = " + fetch_html_value(td_selector + "contingency_bonus", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "productivity" ) ) ) {
      gross_income += fetch_html_value(td_selector + "productivity", "float");
      console.log( "productivity" + " = " + fetch_html_value(td_selector + "productivity", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "referral" ) ) ) {
      gross_income += fetch_html_value(td_selector + "referral", "float");
      console.log( "referral" + " = " + fetch_html_value(td_selector + "referral", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "_13th_month" ) ) ) {
      gross_income += fetch_html_value(td_selector + "_13th_month", "float");
      console.log( "_13th_month" + " = " + fetch_html_value(td_selector + "_13th_month", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "adjustments" ) ) ) {
      gross_income += fetch_html_value(td_selector + "adjustments", "float");
      console.log( "adjustments" + " = " + fetch_html_value(td_selector + "adjustments", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "reg_basic" ) ) ) {
      gross_income += fetch_html_value(td_selector + "reg_basic", "float");
      console.log( "reg_basic" + " = " + fetch_html_value(td_selector + "reg_basic", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "rice_allowance" ) ) ) {
      gross_income += fetch_html_value(td_selector + "rice_allowance", "float");
      console.log( "rice_allowance" + " = " + fetch_html_value(td_selector + "rice_allowance", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "laundry_allowance" ) ) ) {
      gross_income += fetch_html_value(td_selector + "laundry_allowance", "float");
      console.log( "laundry_allowance" + " = " + fetch_html_value(td_selector + "laundry_allowance", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "clothing_allowance" ) ) ) {
      gross_income += fetch_html_value(td_selector + "clothing_allowance", "float");
      console.log( "clothing_allowance" + " = " + fetch_html_value(td_selector + "clothing_allowance", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "meal_allowance" ) ) ) {
      gross_income += fetch_html_value(td_selector + "meal_allowance", "float");
      console.log( "meal_allowance" + " = " + fetch_html_value(td_selector + "meal_allowance", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "other_benefits1" ) ) ) {
      gross_income += fetch_html_value(td_selector + "meal_allowance", "float");
      console.log( "meal_allowance" + " = " + fetch_html_value(td_selector + "meal_allowance", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "other_benefits2" ) ) ) {
      gross_income += fetch_html_value(td_selector + "other_benefits2", "float");
      console.log( "other_benefits2" + " = " + fetch_html_value(td_selector + "other_benefits2", "float") );
    } 
    if ( $.isNumeric( fetch_html_value( td_selector + "other_benefits3" ) ) ) {
      gross_income += fetch_html_value(td_selector + "other_benefits3", "float");
      console.log( "other_benefits3" + " = " + fetch_html_value(td_selector + "other_benefits3", "float") );
    } 

    console.log("GROSS_INCOME: " + gross_income);

    assign_calculation_result_to_field(td_selector + "p_gross_income", gross_income);
  }

  function calc_taxable_income(td_selector) {
    var taxable_income = 0;

    if ( $.isNumeric( fetch_html_value(td_selector + "reg_basic") ) ) {
      taxable_income += fetch_html_value(td_selector + "reg_basic", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "tardy" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "tardy", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "undertime" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "undertime", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "night_differential" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "night_differential", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "regular_holiday_pay" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "regular_holiday_pay", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "special_holiday_pay" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "special_holiday_pay", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_regular" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "ot_pay_regular", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_rd" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "ot_pay_rd", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_regular_h" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "ot_pay_regular_h", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_sh" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "ot_pay_sh", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_rd_h" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "ot_pay_rd_h", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "ot_pay_rd_sh" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "ot_pay_rd_sh", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "productivity" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "productivity", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "poc_incentive" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "poc_incentive", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "contingency_bonus" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "contingency_bonus", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "referral" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "referral", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "adjustments" ) ) ) {
      taxable_income += fetch_html_value(td_selector + "adjustments", "float");
    } 

    var allowance_calculations = 0;

    if ( $.isNumeric( fetch_html_value( td_selector + "rice_allowance" ) ) ) {
      allowance_calculations += fetch_html_value(td_selector + "rice_allowance", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "laundry_allowance" ) ) ) {
      allowance_calculations += fetch_html_value(td_selector + "laundry_allowance", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "clothing_allowance" ) ) ) {
      allowance_calculations += fetch_html_value(td_selector + "clothing_allowance", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "meal_allowance" ) ) ) {
      allowance_calculations += fetch_html_value(td_selector + "meal_allowance", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "other_benefits1" ) ) ) {
      allowance_calculations += fetch_html_value(td_selector + "other_benefits1", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "other_benefits2" ) ) ) {
      allowance_calculations += fetch_html_value(td_selector + "other_benefits2", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "other_benefits3" ) ) ) {
      allowance_calculations += fetch_html_value(td_selector + "other_benefits3", "float");
    }

    var insurance_calculations = 0;

    if ( $.isNumeric( fetch_html_value(td_selector + "phic_employee") ) ) {
      insurance_calculations += (  fetch_html_value(td_selector + "phic_employee", "float")  );
    } if ( $.isNumeric( fetch_html_value(td_selector + "pagibig_employee") ) ) {
      insurance_calculations += (  fetch_html_value(td_selector + "pagibig_employee", "float")  );
    } if ( $.isNumeric( fetch_html_value(td_selector + "sss_employee") ) ) {
      insurance_calculations += (  fetch_html_value(td_selector + "sss_employee", "float")  );
    }

    var total_taxable_income = taxable_income - ( allowance_calculations + insurance_calculations );

    console.log("TOTAL TAXABLE INCOME: " + taxable_income + " - (" + allowance_calculations + " + " + insurance_calculations + ")");

    total_dependents = 0;
    // if ( fetch_html_value(td_selector + "p_dependents").length > 0 ) { 
    // }
    if ( $.isNumeric( fetch_html_value(td_selector + "p_dependents") ) ) {
      total_dependents += fetch_html_value(td_selector + "p_dependents");
    }

    calculate_tax_withheld(td_selector, total_taxable_income, total_dependents);

    assign_calculation_result_to_field(td_selector + "p_taxable_income", total_taxable_income);
  }

  function calc_total_deductions(td_selector) {
    var total_deductions = 0;

    if ( $.isNumeric( fetch_html_value( td_selector + "ca_salary_adjustment" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "ca_salary_adjustment", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "gadget_loan" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "gadget_loan", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "gym" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "gym", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "maxicare_principal" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "maxicare_principal", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "maxicare_dependent" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "maxicare_dependent", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "maxicare_dental" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "maxicare_dental", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "food_deduction" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "food_deduction", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "food_deduction2" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "food_deduction2", "float");
    }
      if ( $.isNumeric( fetch_html_value( td_selector + "other_loan" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "other_loan", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "hdmf_house_loan" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "hdmf_house_loan", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "hdmf_salary_loan" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "hdmf_salary_loan", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "sss_salary_loan" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "sss_salary_loan", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "phic_employee" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "phic_employee", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "pagibig_employee" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "pagibig_employee", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "sss_employee" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "sss_employee", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "tardy" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "tardy", "float");
    } if ( $.isNumeric( fetch_html_value( td_selector + "undertime" ) ) ) {
      total_deductions += fetch_html_value( td_selector + "undertime", "float");
    }

    console.log("TOTAL_DEDUCTIONS: " + total_deductions);

    assign_calculation_result_to_field(td_selector + "total_deductions", total_deductions);
  }

  function calculate_tax_withheld(td_selector, taxable_income, dependents) {
      //var taxable_income = parseFloat( $(td_selector + "p_taxable_income").html() );
      //var dependents = parseInt( $("#dependents").val() );
      var tax_withheld = 0;

      console.log("before tax_withheld calc: " + taxable_income + " " + dependents);

      dependents = parseInt(dependents);

      // console.log("taxable income: " + taxable_income + " tax_withheld: " + tax_withheld + " dependents: "  + dependents);

      if (dependents > 0) {
        switch(dependents) {
          case 1:
            if ( taxable_income >= 3125 && taxable_income < 3542 ) {
              tax_withheld = (taxable_income - 3125) * 0.05; 
            } if ( taxable_income >= 3542 && taxable_income < 4375 ) {
              tax_withheld = (taxable_income - 3542) * 0.10 + 20.83;
            } if ( taxable_income >= 4375 && taxable_income < 6042 ) {
              tax_withheld = (taxable_income - 4375) * 0.15 + 104.17;
            } if ( taxable_income >= 6042 && taxable_income < 8958 ) {
              tax_withheld = (taxable_income - 6042) * 0.20 + 354.17;
            } if ( taxable_income >= 8958 && taxable_income < 13542 ) {
              tax_withheld = (taxable_income - 8958) * 0.25 + 937.50;
            } if ( taxable_income >= 13542 && taxable_income < 23958 ) {
              tax_withheld = (taxable_income - 13542) * 0.30 + 2083.33;
            } if ( taxable_income >= 23958 ) {
              tax_withheld = (taxable_income - 23958) * 0.32 + 5208.33;
            }
            break;
          case 2:
            if ( taxable_income >= 4167 && taxable_income < 4583 ) {
              tax_withheld = (taxable_income - 4167) * 0.05;
            } if ( taxable_income >= 4583 && taxable_income < 5417 ) {
              tax_withheld = (taxable_income - 4583) * 0.10 + 20.83;
            } if ( taxable_income >= 5417 && taxable_income < 7083 ) {
              tax_withheld = (taxable_income - 5417) * 0.15 + 104.17;
            } if ( taxable_income >= 7083 && taxable_income < 10000 ) {
              tax_withheld = (taxable_income - 7083) * 0.20 + 354.17;
            } if ( taxable_income >= 10000 && taxable_income < 14583 ) {
              tax_withheld = (taxable_income - 10000) * 0.25 + 937.50;
            } if ( taxable_income >= 14583 && taxable_income < 25000 ) {
              tax_withheld = (taxable_income - 14583) * 0.30 + 2088.33;
            } if ( taxable_income >= 25000 ) {
              tax_withheld = (taxable_income - 25000) * 0.32 + 5208.33;
            }
            break;
          case 3:
            if ( taxable_income >= 5208 && taxable_income < 5625 ) {
              tax_withheld = (taxable_income - 5208) * 0.05;
            } if ( taxable_income >= 5625 && taxable_income < 6458 ) {
              tax_withheld = (taxable_income - 5625) * 0.10 + 20.83;
            } if ( taxable_income >= 6458 && taxable_income < 8125 ) {
              tax_withheld = (taxable_income - 6458) * 0.15 + 104.17;
            } if ( taxable_income >= 8125 && taxable_income < 11042 ) {
              tax_withheld = (taxable_income - 8125) * 0.20 + 354.17;
            } if ( taxable_income >= 11042 && taxable_income < 15625 ) {
              tax_withheld = (taxable_income - 11042) * 0.25 + 937.50;
            } if ( taxable_income >= 15625 && taxable_income < 26042 ) {
              tax_withheld = (taxable_income - 15625) * 0.30 + 2088.33;
            } if ( taxable_income >= 26042 ) {
              tax_withheld = (taxable_income - 26042) * 0.32 + 5208.33;
            } 
            break;
          case 4:
            if ( taxable_income >= 6250 && taxable_income < 6667 ) {
              tax_withheld = (taxable_income - 6250) * 0.05;
            } if ( taxable_income >= 6667 && taxable_income < 7500 ) {
              tax_withheld = (taxable_income - 6667) * 0.10 + 20.83;
            } if ( taxable_income >= 7500 && taxable_income < 9167 ) {
              tax_withheld = (taxable_income - 7500) * 0.15 + 104.17;
            } if ( taxable_income >= 9167 && taxable_income < 12083 ) {
              tax_withheld = (taxable_income - 9167) * 0.20 + 354.17;
            } if ( taxable_income >= 12083 && taxable_income < 16667 ) {
              tax_withheld = (taxable_income - 12083) * 0.25 + 937.50;
            } if ( taxable_income >= 16667 && taxable_income < 27083 ) {
              tax_withheld = (taxable_income - 16667) * 0.30 + 2088.33;
            } if ( taxable_income >= 27083 ) {
              tax_withheld = (taxable_income - 27083) * 0.32 + 5208.33;
            }
            break;

          default:
            break;
        }
      } else {
        if ( taxable_income >= 2083 && taxable_income < 2500 ) {
          tax_withheld = (taxable_income - 2083) * 0.05;
        } if( taxable_income >= 2500 && taxable_income < 3333 ) {
          tax_withheld = (taxable_income - 2500) * 0.10 + 20.83;
        } if( taxable_income >= 3333 && taxable_income < 5000 ) {
          tax_withheld = (taxable_income - 3333) * 0.15 + 104.17;
        } if( taxable_income >= 5000 && taxable_income < 7917 ) {
          tax_withheld = (taxable_income - 5000) * 0.20 + 354.17;
        } if( taxable_income >= 7917 && taxable_income < 12500 ) {
          tax_withheld = (taxable_income - 7917) * 0.25 + 937.50;
        } if( taxable_income >= 12500 && taxable_income < 22917 ) {
          tax_withheld = (taxable_income - 12500) * 0.30 + 2083.33;
        } if ( taxable_income >= 22917 ) {
          tax_withheld = (taxable_income - 22917) * 0.32 + 5208.33;
        }
      }

      //var tax_withheld = (taxable_income - 3333) * 0.15 + 104.17;

      // console.log("TAX WITHHELD: " + tax_withheld);

      console.log("TAX_WITHHELD: " + tax_withheld);

      assign_calculation_result_to_field(td_selector + "p_tax_withheld", tax_withheld);
    }

  function calc_taxable_productivity(field_selector, days_worked, productivity) {
    if ($.isNumeric(days_worked) && $.isNumeric(productivity)) {
      var taxable_productivity = (productivity / 22) * days_worked;

      assign_calculation_result_to_field(field_selector, taxable_productivity);
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
  }

  function calc_taxable_sh_rd_ot(field_selector, gross_pay, minute_sh_rd_ot) {
    if ( $.isNumeric(gross_pay) && $.isNumeric(minute_sh_rd_ot) ) {
      if (parseFloat(minute_sh_rd_ot) > 0) {
        var taxable_holiday_rest_day_ot_pay = ((gross_pay / 22 / 480) * 2.60) + 
        ((gross_pay / 22 / 480) * 2.60) * minute_sh_rd_ot;

        //alert( "gross_pay" + gross_pay + " minute_sh_rd_ot: " + minute_sh_rd_ot + " / " + "sh_rd_ot: " + taxable_holiday_rest_day_ot_pay);

        assign_calculation_result_to_field(field_selector, taxable_holiday_rest_day_ot_pay);
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
  }

  function calc_taxable_holi_rd_ot(field_selector, gross_pay, minute_holi_rd_ot) {
    if ( $.isNumeric(gross_pay) && $.isNumeric(minute_holi_rd_ot) ) {
      if (parseFloat(minute_holi_rd_ot) > 0) {
        var special_holiday_rest_day_ot_pay = ((gross_pay / 22 / 480) * 1.50) + 
        ((gross_pay / 22 / 480) * 0.30) * minute_holi_rd_ot;

        assign_calculation_result_to_field(field_selector, special_holiday_rest_day_ot_pay); 
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
  }

  function calc_taxable_sh_ot(field_selector, gross_pay, minute_sh_ot) {
    if ( $.isNumeric(gross_pay) && $.isNumeric(minute_sh_ot) ) {
      if (parseFloat(minute_sh_ot) > 0) {
        var special_holiday_ot_pay = ((gross_pay / 22 / 480) * 1.30) + 
        ((gross_pay / 22 / 480) * 0.30) * minute_sh_ot;

        assign_calculation_result_to_field(field_selector, special_holiday_ot_pay);
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
    
  }

  function calc_taxable_holi_ot(field_selector, gross_pay, minute_holi_ot) {
    if ( $.isNumeric(gross_pay) && $.isNumeric(minute_holi_ot) ) {
      if (parseFloat(minute_holi_ot) > 0) {
        var regular_holiday_pay = ((gross_pay / 22 / 480) * 2.00) * minute_holi_ot;

        assign_calculation_result_to_field(field_selector, regular_holiday_pay);
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
    
  }

  function calc_taxable_reg_rd_ot(field_selector, gross_pay, minute_reg_rd_ot) {
    if ( $.isNumeric(gross_pay) && $.isNumeric(minute_reg_rd_ot) ) {
      if (parseFloat(minute_reg_rd_ot) > 0) {
        var rest_day_ot_pay = (gross_pay / 22 / 480) * 1.30 * minute_reg_rd_ot;

        assign_calculation_result_to_field(field_selector, rest_day_ot_pay);
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
    
  }

  function calc_taxable_regular_ot_pay(field_selector, gross_pay, minute_regular_ot) {
    if ( $.isNumeric(gross_pay) && $.isNumeric(minute_regular_ot) ) {
      if (parseFloat(minute_regular_ot) > 0) {
        var taxable_regular_ot_pay = (gross_pay / 22 / 480) * 1.25 * minute_regular_ot;
        //assign_calculation_result_to_field(field_selector, parseInt(minute_regular_ot));
        assign_calculation_result_to_field(field_selector, taxable_regular_ot_pay);
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
    
  }

  function calc_taxable_spec_holi_ot_pay(field_selector, gross_pay, minute_spec_holi) {
    if ( $.isNumeric(gross_pay) && $.isNumeric(minute_spec_holi) ) {
      if (parseFloat(minute_spec_holi) > 0) {
        var taxable_spec_holi_ot_pay = ((gross_pay / 22 / 480) * 0.30) * minute_spec_holi;
        //assign_calculation_result_to_field(field_selector, parseInt(minute_spec_holi));
        assign_calculation_result_to_field(field_selector, taxable_spec_holi_ot_pay);
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
    
  }

  function calc_taxable_reg_holi_ot_pay(field_selector, gross_pay, minute_reg_holi) {
    if ( $.isNumeric(gross_pay) && $.isNumeric(minute_reg_holi) ) {
      if (parseFloat(minute_reg_holi) > 0) {
        var taxable_reg_holi_ot_pay = ((gross_pay / 22 / 480) * 1.00) * minute_reg_holi;
        //assign_calculation_result_to_field(field_selector, parseInt(minute_reg_holi));
        assign_calculation_result_to_field(field_selector, taxable_reg_holi_ot_pay);
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
    
  }

  function calc_taxable_night_diff(field_selector, monthly_basic, minute_reg_night_diff) {
    if ( $.isNumeric(monthly_basic) && $.isNumeric(minute_reg_night_diff) ) {
      if (parseFloat(minute_reg_night_diff) > 0) {
        var taxable_night_diff = (monthly_basic / 22 / 480) * 0.10 * minute_reg_night_diff;
        //assign_calculation_result_to_field(field_selector, parseInt(minute_reg_night_diff));
        assign_calculation_result_to_field(field_selector, taxable_night_diff);
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
    
  }

  function calc_taxable_undertime(field_selector, monthly_basic, minutes_undertime) {
    if ( $.isNumeric(monthly_basic) && $.isNumeric(minutes_undertime) ) {
      if (parseFloat(minutes_undertime) > 0) {
        var taxable_undertime = (monthly_basic / 22 / 480) * minutes_undertime;
        //assign_calculation_result_to_field(field_selector, parseInt(minutes_undertime));
        assign_calculation_result_to_field(field_selector, taxable_undertime);
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
    
  }

  function calc_taxable_tardy(field_selector, monthly_basic, minutes_tardy) {
    if ( $.isNumeric(monthly_basic) && $.isNumeric(minutes_tardy) ) {
      if (parseFloat(minutes_tardy) > 0) {
        var taxable_tardy = (monthly_basic / 22 / 480) * minutes_tardy;

        // //console.log( "taxable_tardy: " + taxable_tardy );
        //assign_calculation_result_to_field(field_selector, parseInt(minutes_tardy));
        assign_calculation_result_to_field(field_selector, taxable_tardy);
      } else {
        assign_calculation_result_to_field(field_selector, 0);
      }
    } else {
      assign_calculation_result_to_field(field_selector, 0);
    }
    
  } 

  function assign_calculation_result_to_field(field_selector, value) {
    $(field_selector).empty();

    if ($.isNumeric(value)) {
      $(field_selector).html( addCommas( value.toFixed(2) ) );
    } else {
      $(field_selector).html( addCommas( value ) ); 
    }
    
  }

  function calc_daily_rate(td_selector, gross_pay) {
    var WORKING_DAYS = 22;
    var daily_rate = gross_pay / WORKING_DAYS;

    assign_calculation_result_to_field(td_selector + "p_daily_rate", daily_rate);
  }

  function calc_regular_basic(td_selector, days_worked, monthly_basic) {
    var reg_basic = (monthly_basic / 22) * days_worked;

    //console.log(td_selector + " " + days_worked + " " + monthly_basic);

    assign_calculation_result_to_field(td_selector + "reg_basic", reg_basic);
  }

  // A.K.A calc_monthly_basic() {};
  function calc_basic_pay(td_selector, gross_pay) {
    var MIN_GROSS_PAY = 12999;
    var MIN_BASIC_PAY = 8000;
    var MAX_BASIC_PAY = 10000;
    var ZERO = 0;
    var current_monthly_basic = 0;

    if (gross_pay > ZERO) {
      if (gross_pay > MIN_GROSS_PAY) {
        if ((gross_pay - MAX_BASIC_PAY) > 0) {
          calc_allowances( td_selector, gross_pay - MAX_BASIC_PAY );
        }

        assign_calculation_result_to_field( td_selector + "p_monthly_basic", MAX_BASIC_PAY );
        current_monthly_basic = MAX_BASIC_PAY;
      } else {
        if ((gross_pay - MIN_BASIC_PAY) > 0) {
          calc_allowances( td_selector, gross_pay - MIN_BASIC_PAY );
        }

        assign_calculation_result_to_field( td_selector + "p_monthly_basic", MIN_BASIC_PAY );
        current_monthly_basic = MIN_BASIC_PAY;
      }
    } else {
      assign_calculation_result_to_field( td_selector + "p_monthly_basic", "" );
    }

    // Added delay to prevent functions from getting value from data_row
    // functions use .html(), when editing, data_row is appended with <input>
    // the delay gives time for the <input> to revert back to html which corrects the NaN miscalculations.
    setTimeout(function() {
      main_calc_all_taxable_income( td_selector, current_monthly_basic, gross_pay );
      calc_regular_basic( td_selector, fetch_html_value( td_selector + "p_days_worked" ), current_monthly_basic );
      calc_taxable_income( td_selector );
      calc_total_deductions( td_selector );
      calc_net_income( td_selector );
      calc_taxable_contingency_bonus( td_selector );
      calc_taxable_poc_incentive( td_selector );
      calc_gross_income( td_selector );
    }, delay_timer);
    
  }

  function calc_allowances(td_selector, total_allowance) {
    var allowance_allocation = {
      rice: 0,
      laundry: 0,
      clothing: 0,
      gifts_other_benefits_medical: 0,
      medical_dependents: 0,
      meal_allowance: 0,
      other_benefits: 0,
      productivity: 0
    };

    var rice_allowance_max                         = 1500;
    var laundry_allowance_max                      = 300;
    var clothing_allowance_max                     = 333.33;
    var gifts_other_benefits_medical_allowance_max = 416.66;
    var medical_dependents_allowance_max           = 125;
    var meal_allowance_max                         = 1600;
    var other_benefits_max                         = 1600;

    // RICE ALLOCATION
    if (total_allowance > rice_allowance_max) {
      allowance_allocation.rice = rice_allowance_max;
      total_allowance -= rice_allowance_max;
    } else {
      allowance_allocation.rice = total_allowance;
      total_allowance -= allowance_allocation.rice;
    }

    // LAUNDRY ALLOCATION
    if (total_allowance > laundry_allowance_max) {
      allowance_allocation.laundry = laundry_allowance_max;
      total_allowance -= laundry_allowance_max;
    } else {
      allowance_allocation.laundry = total_allowance;
      total_allowance -= allowance_allocation.laundry;
    }

    // CLOTHING ALLOCATION
    if (total_allowance > clothing_allowance_max) {
      allowance_allocation.clothing = clothing_allowance_max;
      total_allowance -= clothing_allowance_max;
    } else {
      allowance_allocation.clothing = total_allowance;
      total_allowance -= allowance_allocation.clothing;
    }

    // GIFTS, OTHER BENEFITS, MEDICAL ALLOWANCE ALLOCATIONS
    if (total_allowance > gifts_other_benefits_medical_allowance_max) {
      allowance_allocation.gifts_other_benefits_medical = gifts_other_benefits_medical_allowance_max;
      total_allowance -= gifts_other_benefits_medical_allowance_max;
    } else {
      allowance_allocation.gifts_other_benefits_medical = total_allowance;
      total_allowance -= allowance_allocation.gifts_other_benefits_medical;
    }

    // MEDICAL DEPENDENTS ALLOCATIONS
    if (total_allowance > medical_dependents_allowance_max) {
      allowance_allocation.medical_dependents = medical_dependents_allowance_max;
      total_allowance -= medical_dependents_allowance_max;
    } else {
      allowance_allocation.medical_dependents = total_allowance;
      total_allowance -= allowance_allocation.medical_dependents;
    }

    // MEAL ALLOWANCE
    if (total_allowance > meal_allowance_max) {
      allowance_allocation.meal_allowance = meal_allowance_max;
      total_allowance -= meal_allowance_max;
    } else {
      allowance_allocation.meal_allowance = total_allowance;
      total_allowance -= allowance_allocation.meal_allowance; 
    }

    // BENEFITS ALLOWANCE
    if (total_allowance > other_benefits_max) {
      allowance_allocation.other_benefits = other_benefits_max;
      total_allowance -= other_benefits_max;
    } else {
      allowance_allocation.other_benefits = total_allowance;
      total_allowance -= allowance_allocation.other_benefits;
    }

    if (total_allowance > 0) {
      allowance_allocation.productivity = total_allowance;
      total_allowance -= allowance_allocation.productivity;
    }

    assign_calculation_result_to_field( td_selector + "p_rice_allowance", allowance_allocation.rice );
    assign_calculation_result_to_field( td_selector + "p_laundry_allowance", allowance_allocation.laundry );
    assign_calculation_result_to_field( td_selector + "p_clothing_allowance", allowance_allocation.clothing );
    assign_calculation_result_to_field( td_selector + "p_meal_allowance", allowance_allocation.meal_allowance );
    assign_calculation_result_to_field( td_selector + "p_other_benefits1", allowance_allocation.gifts_other_benefits_medical );
    assign_calculation_result_to_field( td_selector + "p_other_benefits2", allowance_allocation.medical_dependents );
    assign_calculation_result_to_field( td_selector + "p_other_benefits3", allowance_allocation.other_benefits );
    assign_calculation_result_to_field( td_selector + "p_productivity", allowance_allocation.productivity ); 

    // calc_non_taxable_allowance
    var days_worked = $( td_selector + "p_days_worked" ).html();

    calc_taxable_productivity( td_selector + "productivity", days_worked, allowance_allocation.productivity );

    var non_taxable_rice      = (allowance_allocation.rice / 22) * days_worked;   
    var non_taxable_laundry   = (allowance_allocation.laundry / 22) * days_worked;
    var non_taxable_clothing  = (allowance_allocation.clothing / 22) * days_worked;
    var non_taxable_meal      = (allowance_allocation.meal_allowance / 22) * days_worked;
    var non_taxable_benefit_1 = (allowance_allocation.gifts_other_benefits_medical / 22) * days_worked;
    var non_taxable_benefit_2 = (allowance_allocation.medical_dependents / 22) * days_worked;
    var non_taxable_benefit_3 = (allowance_allocation.other_benefits / 22) * days_worked;

    assign_calculation_result_to_field( td_selector + "rice_allowance", non_taxable_rice );
    assign_calculation_result_to_field( td_selector + "laundry_allowance", non_taxable_laundry );
    assign_calculation_result_to_field( td_selector + "clothing_allowance", non_taxable_clothing );
    assign_calculation_result_to_field( td_selector + "meal_allowance", non_taxable_meal );
    assign_calculation_result_to_field( td_selector + "other_benefits1", non_taxable_benefit_1 );
    assign_calculation_result_to_field( td_selector + "other_benefits2", non_taxable_benefit_2 );
    assign_calculation_result_to_field( td_selector + "other_benefits3", non_taxable_benefit_3 );
  }

  // Payroll Calculations Function End

  function bindControls(field_selector, field, td_selector) {
    $(field_selector + field).on('keyup', function(event) {
      var gross_pay = 0;

      if ( $.isNumeric( fetch_html_value(td_selector + 'p_gross_pay') ) ){
        gross_pay += fetch_html_value(td_selector + 'p_gross_pay', "float");
      }

      //console.log("current gross_pay: " + gross_pay);

      calc_daily_rate( td_selector, gross_pay );
      calc_basic_pay( td_selector, gross_pay );
    });
  }

  function fieldCalculationHandle(payroll_id) {

    var field_array = [
      'p_min_tardy',
      'p_min_undertime',
      'p_min_regular_night_diff',
      'p_min_regular_h',
      'p_min_sh',
      'p_min_regular_ot',
      'p_min_regular_rd_ot',
      'p_min_holiday_ot',
      'p_min_sh_ot',
      'p_min_holiday_rd_ot',
      'p_min_sh_rd_ot',
      'p_poc_incentive',
      'p_contingency_bonus',
      'referral',
      'adjustments',
      '_13th_month',
      'ca_salary_adjustment',
      'gadget_loan',
      'gym',
      'maxicare_principal',
      'maxicare_dependent',
      'maxicare_dental',
      'food_deduction',
      'other_loan',
      'hdmf_house_loan',
      'hdmf_salary_loan',
      'sss_salary_loan',
      'phic_employee',
      'pagibig_employee',
      'sss_employee',
      'p_dependents'
    ];

    var input_selector = "input#" + payroll_id + ".";
    var td_selector = "td#" + payroll_id + ".";

    $(input_selector + "p_working_days").on("keyup", function(event) {
      //console.log( $(this).val() );
      // $(td_selector + "p_days_worked").empty();
      // $(td_selector + "p_days_worked").html( parseFloat($(this).val()) * 5 );
    });

    $(input_selector + "p_gross_pay").on("keyup", function(event) {
      //console.log( $(this).val() );

      calc_daily_rate( td_selector, removeCommasReturnAsFloat( $(this).val() ) );
      calc_basic_pay( td_selector, removeCommasReturnAsFloat( $(this).val() ) );
    });

    for (var counter = 0 ; counter < field_array.length ; ++counter) {
      bindControls(input_selector, field_array[counter], td_selector);
    }

    // $(input_selector + "p_days_worked").on("keyup", function(event) {

    // });

    // alert("payroll_id" + payroll_id);
    // var fieldClassArray = new Array();

    // $(".payroll" + payroll_id).find("td").each(function(index, value) {
    //   var obj_class = $(value).prop("class").split(" ");
    //   var fieldClass = obj_class[1];
    //   var fieldId = $(value).prop("id");

    //   fieldClassArray[fieldClass] = fieldClass + "," + fieldId;
    // });

    // //console.log(fieldClassArray);

    // var fieldInfo = fieldClassArray["p_min_tardy"].split(",");
    // var selector = "input#" + fieldInfo[1] + "." + fieldInfo[0] + "";

    // $(selector).on("keydown", function() {
    //   //console.log(selector);
    // });
  }

  // $(document).on("click", ".edit-payroll", function(event) {
  //   var user_id = $(this).prop("id");

  //   $(".save-payroll" + user_id).css("visibility", "visible");

  //   $(".payroll" + user_id).find("td").each(function(index, value) {
  //     var current_field_value = $.trim( $(value).html() );

  //     if (index > 0) {
  //       var obj_class = $(value).prop("class").split(" ");
  //       var db_table_data_description = obj_class[1];

  //       if (index >= 1 && index <= 3) {

  //       } else {
  //         $(value).html("<input class='form-control " + db_table_data_description + "' value=" + current_field_value + "></input>");
  //       }

  //     }
  //   });

  //   $(this).prop("disabled", true)

  //   $(document).on("click", ".save-payroll" + user_id, function() {
  //     var id_data = $(this).prop("id").split(",");
  //     var payroll_id = id_data[1];

  //     var associativeArray = new Array();

  //     $(".payroll" + user_id).find("td > input").each(function(index, value) {
  //       var current_field_value = $.trim( $(value).val() );

  //       var obj_class = $(value).prop("class").split(" ");
  //       var db_table_data_description = obj_class[1];

  //       associativeArray[db_table_data_description] = current_field_value;

        // //console.log(" " + db_table_data_description + "<-");
  //     });

      // //console.log(associativeArray);

  //     sendPayrollData(associativeArray, "update", payroll_id);
  //   });
  // });

  $(document).on("mouseover", "td", function(event) {
    $(this).css("border", "1.1px solid black");

    $(this).on("mouseout", function(event) {
      $(this).css("border", "1px solid #DDD");
      $(this).unbind("mouseout");
    });
  });

  $(document).on("mouseover", "tr", function(event) {
    var this_id = $(this).prop("id");

    if (this_id != "table-header") {
      var current_bg_color = $(this).css("background-color");
      $(this).css("background-color", "#F8F8F8");

      $(this).on("mouseout", function(event) {
        $(this).css("background-color", current_bg_color);
        $(this).unbind("mouseout");
      });
    }

  });

  $("#fetch-payroll").on("click", function(event) {
    var dept_id = $("#payroll-department-list-dropdown").find(":selected").prop("id");
    var payperiod_id = $("#payroll-payperiod-list-dropdown").find(":selected").prop("id");

    ajax_fetch_primary_payroll_data(dept_id, payperiod_id);
    // ajax_fetch_secondary_payroll_data(dept_id, payperiod_id);
  });

  function is_protected_field(field) {
    var is_protected = false;

    for (var c = 0 ; c < protected_fields.length ; ++c) {
      if (protected_fields[c] == field) {
        is_protected = true;
        break;
      }
    }

    return is_protected;
  }

  function addCommas(nStr)
  {
    if (nStr.length > 0) {
      nStr += '';
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    } else {
      return "";
    }
    
  }

  function removeCommasReturnAsFloat(nStr) {
    if (nStr !== NaN) {
      if (nStr !== undefined) {
        var container = "";
        for (var rcC = 0 ; rcC < nStr.length ; ++rcC) {
          if (nStr[rcC] >= '0' && nStr[rcC] <= '9' || nStr[rcC] == '.') {
            container = container + nStr[rcC];
          }
        }
        return parseFloat(container)
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  $(document).on("dblclick", "td", function(event) {
    event.isDefaultPrevented();

    var clicked_td_class = $(this).prop("class");
    var class_array = clicked_td_class.split(" ");
    // alert(class_array[1]);

    if (! is_protected_field(class_array[1])) {
      var this_parent = $(this).parent().prop("id");
      var ajax_data_operation_type = "update";

      console.log("this_parent" + this_parent);
      // alert("this_parent" + this_parent);
      // alert(this_parent);

      if (class_array[1] != 'p_working_days' && class_array[1] != 'p_days_worked') {
        switch (this_parent) {
          case "save-payroll":
            ajax_data_operation_type = "save";
            $(this).parent().prop("id", "edit-payroll");
            break;
          case "edit-payroll":
            ajax_data_operation_type = "update";
            break;

          default:
            alert("WARNING: Unknown ajax data operation type." + " parent: " + this_parent);
            break;
        }
      }
      
      console.log(ajax_data_operation_type);

      // if (this_parent == "save-payroll") {
      //   $(this).parent().prop("id", "update-payroll");
      //   ajax_data_operation_type = "save";

      //   // change current tr id to "update-payroll" to avoid creating another payroll for the current employee
      // } else {
      //   ajax_data_operation_type = "update";
      // }

      //alert("about to " + ajax_data_operation_type);

      var user_id = $(this).prop("id");
      var current_field_value = $.trim( $(this).html() );

      // var nextValue = $(this).next("td").html();
      // alert(nextValue);

      //reverts all input to td in a clicked row.
      $(".payroll" + user_id).find("td > input").each(function(index, value) {
        var this_value = $(value).val();

        ////console.log(index + " " + this_value );

        $(value).parent("td").html(this_value);
      });

      var obj_class = $(this).prop("class").split(" ");
      var db_table_data_description = obj_class[1];

      var kitten_fun = current_field_value;

      // bug fix: appends <input> in textbox whenever user doubl clicks on the textbox.
      if (kitten_fun.indexOf("input") > -1) {
          // alert("found input! no!");
          // alert(current_field_value);
          $(this).html(current_field_value);
      } else {
        // alert("input not found. meow. lolz.");
        $(this).css("border", "2px dotted black");
        $(this).css('border-radius', '5px');
        $(this).html("<input type='text' id=" + user_id + " class='form-control " + db_table_data_description + "' value=" + current_field_value + "></input>");
      }

      $("input." + db_table_data_description).focus();

      // bug fix: appends <input> in textbox whenever user doubl clicks on the textbox.
      $("input." + db_table_data_description).on("dblclick", function(e) {
        if (kitten_fun.indexOf("input") > -1) {
            // alert("found input! no!");
           // alert(current_field_value);
          $(this).html(current_field_value);
        } else {
          // alert("input not found. meow. lolz.");
          $(this).html("<input type='text' id=" + user_id + " class='form-control " + db_table_data_description + "' value=" + current_field_value + "></input>");
        }
      });

      var ol = $(this).parent("tr").prop("class").split("ll");
      var payroll_id = ol[1];

      var payr_id = $(this).parent("tr").find("td.user_id").prop("id");

      fieldCalculationHandle(payroll_id);

      // associativeArray = fetchFieldValues(payroll_id);
      // sendPayrollData(associativeArray, "update", payr_id)

      // $(this).on("keypress", function(e) {
      //   if(e.keyCode==13){
      //     var this_class = $(this).prop("class");
      //     var this_value = $(this).find("input").val();
          
      //     ////console.log("enter. disappear!");
      //     // this_value = addCommas(this_value);
      //     $(this).html((this_value));

      //     associativeArray = fetchFieldValues(payroll_id);

      //     setTimeout(function() {
      //       sendPayrollData(associativeArray, ajax_data_operation_type, payr_id, $(this).parent("tr").find("td.user_id"));
      //     }, 2500);

          
      //     var next = $(this).next("td");
      //     var n_class = next.prop("class").split(" ");
      //     var n_value = next.html();

      //     // $(next).html("<input type='text' id=" + user_id + " class='form-control " + n_class[1] + "' value=" + n_value + "></input>");

      //     // $(next).clone().appendTo(this);
      //     // $('input.' + n_class[1]).focus();

      //     // alert('enter me!');

      //     $(this).unbind("keypress");
      //   }
      // });

      $(this).on("focusout", function(e) {
        e.isDefaultPrevented();

        var this_class = $(this).prop("class");
        var this_value = $(this).find("input").val();
        
        ////console.log("focusout. disappear!");
        // this_value = addCommas(this_value);
        $(this).html((this_value));

        if ( class_array[1] != 'p_working_days' && class_array[1] != 'p_days_worked' ) {
          performPayrollCalculationOnTr(user_id);
          // performOnLoadCalculations();

          associativeArray = fetchFieldValues(payroll_id);
          sendPayrollData(associativeArray, ajax_data_operation_type, payr_id, $(this).parent("tr").find("td.user_id"));
        }
        
        // setTimeout(function() {
          
        // }, delay_timer);

        // var next = $(this).next("td");
        //   var n_class = next.prop("class").split(" ");
        //   var n_value = next.html();

        //   $(next).html("<input type='text' id=" + user_id + " class='form-control " + n_class[1] + "' value=" + n_value + "></input>");

        $(this).unbind("focusout");
      }); 
    }

  });

});