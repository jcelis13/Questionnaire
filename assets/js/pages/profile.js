$(document).ready(function() {

  var employee_list = [];

  // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
  function capitaliseFirstLetter(string) {
    if (typeof string == "string") {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  function intializeScrollingEmployeePayrollNavigation() {
    var $scrollingDiv = $("#department-employee-search");
    var slider_speed = 1900;

    $(window).scroll(function(){ // sliding kitten
      if ($(window).scrollTop() <= 2090) {
        $scrollingDiv
          .stop()
          .animate({"marginTop": ($(window).scrollTop() + 1) + "px"}, slider_speed);   
      }  
    });
    
  }

  intializeScrollingEmployeePayrollNavigation();

  function searchEmployeeList(employee_name) {
    if (employee_name.length != 0) {
      $("#employee-list-table-body").html("");

      for (var counter = 0 ; counter < employee_list.length ; ++counter) {
        if (employee_list[counter].indexOf(employee_name) > -1) {
          $("#employee-list-table-body").append(employee_list[counter]);
        }
      }
    } else {
      $("#employee-list-table-body").html("");
      $("#employee-list-table-body").append(employee_list);
    }
    
  }

  function populateEmployeeList(response) {
    var employee = response.split("</a>");

    for (var counter = 0 ; counter < employee_list.length ; ++counter) {
      employee_list[counter] = employee_list[counter] + "</a>";
    }

    employee_list = employee;
  }

  $(document).on("keyup", "#employee-profile-search", function() {
    var name = $("#employee-profile-search").val();
    // console.log(name);
    searchEmployeeList(name);
  });

  $(document).on("click", ".emp-profile", function() {
    var data = $.trim( $(this).prop("id") );
    var full_name = $.trim( $(this).html() );

    var data_arr = data.split(",");

    //window.location.href = site_url + "profile/render_profile";

    $("#fullname").html(full_name);
    $("#email").html(data_arr[0]);
    $("#department").html(data_arr[1]); 

    // alert(data_arr[2]);

    $.ajax({
      type: "POST",
      url: site_url + "ajax/profile_ajax/ajax_fetch_user_teams_by_user_id",
      data: {user_id: data_arr[2]},
      beforeSend: function() {

      },
      success: function(response) {
        $("#profile-user-teams").html("");
        $("#profile-user-teams").html(response);
      }
    });

    $.ajax({
      type: "POST",
      url: site_url + "ajax/profile_ajax/ajax_fetch_user_profile_by_user_id",
      data: {user_id: data_arr[2]},
      beforeSend: function() {
        $(".loader").css("visibility", "visible");
      },
      success: function(response) {
        $(".loader").css("visibility", "hidden");

        if (response != "null") {
          var user_profile = $.parseJSON(response);
          // alert(user_profile[0]["email"]);
          console.log(user_profile[0]);

          for (var key in user_profile[0]) {
            var profile = user_profile[0];

            if (profile[key] != undefined) {
              if (key != 'email') {
                $("#" + key).html( capitaliseFirstLetter(profile[key]) );
              }
              
            } else {
              $("#" + key).html( "" );
            }
            // console.log( key + " " + capitaliseFirstLetter(profile[key]) );
          }
        } else {
          console.log("response is null.");
        }
        
      }
    });

  });

  $(document).on("change", "#department-employee-profile", function() {
    var department = $.trim( $("#department-employee-profile").val() );
    var department_id = $.trim( $("#department-employee-profile").find(":selected").prop("id") );

    // console.log(department_id);

    $.ajax({
      type: "POST",
      url: site_url + "ajax/employee_ajax/ajax_get_employee_profile_by_department_id",
      data: {department: department, dept_id: department_id},
      beforeSend: function() {
        $("#department-employee-icon").removeClass("fa fa-users");
        $("#department-employee-icon").addClass("fa fa-spinner fa-spin");
      }, 
      success: function(response) {
        if (response.length > 0) {
          populateEmployeeList(response);

          console.log(response);

          $("#result-search").prop("disabled", false);

          $(document).on("keyup", "#result-search", function() {
            var input = $(this).val();
            console.log(input);
            searchEmployeeList(input);
          });

          $("#department-employee-icon").removeClass("fa fa-spinner fa-spin");
          $("#department-employee-icon").addClass("fa fa-users");
            
          // $("#employee-list").empty();
          // $("#employee-list").append(response);

          $("#employee-list-table-body").empty();
          $("#employee-list-table-body").append(response);

          // $("#search-container").append("<p>" + response.match(/</a>/g).length + "</p>");
        } else {
          $("#department-employee-icon").removeClass("fa fa-spinner fa-spin");
          $("#department-employee-icon").addClass("fa fa-users");

          $("#result-search").prop("disabled", true);
          $("#result-search").val("");

          $("#employee-list-table-body").empty();
          $("#employee-list-table-body").append("<td><p style='padding:5px; margin-top:5px; margin-bottom:5px; text-align:center;'>Found nothing in Department</p></td>");
        }
        
      }
    });
  });

  // $(document).on("keyup", "#confirm-password", function() {
  //   var confirm_password = $.trim( $("#confirm-password").val() );
  //   var new_password = $.trim( $("#new-password").val() );

  //   if (confirm_password.length >= 3) {

  //     if (confirm_password != new_password) {
  //       $("#change-password").prop("disabled", true);
  //     } else {
  //       $("#change-password").prop("disabled", false);
  //     }
      
  //   } else {
  //     $("#change-password").prop("disabled", true);
  //   }
  // });

  // $(document).on("keyup", "#new-password", function() {
  //   var new_password = $.trim( $("#new-password").val() );

  //   if (new_password.length >= 3) {
  //     $("#confirm-password").prop("disabled", false);

  //     var value = $.trim( $(this).val() );
  //     var confp = $.trim( $("#confirm-password").val() );

  //     if (value == confp) {
  //       $("#change-password").prop("disabled", false);
  //     } else {
  //       $("#change-password").prop("disabled", true);
  //     }
  //   } else {
  //     $("#confirm-password").prop("disabled", true);
  //     $("#change-password").prop("disabled", true);
  //   }
  // });

  // $(document).on("keyup", "#current-password", function() {
  //   var current_password = $.trim( $("#current-password").val() );
  //   var user_id = $.trim( $("#logged-user-id").prop("class") );

  //   if (current_password.length >= 3) {

  //     $.ajax({
  //       type: "POST",
  //       url: site_url + "ajax/profile_ajax/ajax_validate_password",
  //       data: {user_id: user_id, current_password: current_password},
  //       beforeSend: function() {
  //         $("#current-password-icon").html("<img src=" + site_url + "assets/img/14_loader.gif" + ">");
  //       },
  //       success: function(response) {
  //         if (response != "password_matched") {
  //           $("#current-password-icon").html('<i class="fa fa-key">');
  //           $("#current-password-div").addClass("has-error");

  //           $("#new-password").prop("disabled", true);
  //           $("#confirm-password").prop("disabled", true);
  //           $("#change-password").prop("disabled", true);
  //         } else {
  //           $("#current-password-div").removeClass("has-error");
  //           $("#current-password-div").addClass("has-success");
  //           $("#current-password-icon").html('<i class="fa fa-key">');

  //           var new_password = $.trim( $("#new-password").val() );
  //           var confirm_pass = $.trim( $("#confirm-password").val() );

  //           $("#new-password").prop("disabled", false);

  //           if (new_password == confirm_pass) {
  //             $("#change-password").prop("disabled", false);
  //             $("#confirm-password").prop("disabled", false);
  //           } else {
  //             $("#change-password").prop("disabled", true);
  //           }
  //         }
  
  //       }
  //     });
      
  //   } else {
  //     $("#current-password-div").removeClass("has-error has-success");
  //     $("#new-password").prop("disabled", true);
  //     $("#confirm-password").prop("disabled", true);
  //     $("#change-password").prop("disabled", true);
  //   }

  // });

  function display_message_modal(message) {
    $("#message").html(message);
  }

  // $("#change-password").click(function() {
  //   var current_password = $.trim( $("#current-password").val() );
  //   var new_password = $.trim( $("#new-password").val() );
  //   var confirm_password = $.trim( $("#confirm-password").val() );

  //   $("#confirm-password-change-dialog").modal("show");
  // });

  // $("#change-password-confirm").click(function() {
  //   var new_password = $.trim( $("#new-password").val() );
  //   var user_id = $.trim( $("#logged-user-id").prop("class") );

  //   $("#confirm-password-change-dialog").modal("toggle");

  //   $.ajax({
  //     type: "POST",
  //     url: site_url + "ajax/profile_ajax/ajax_change_user_password",
  //     data: {new_password: new_password, user_id: user_id},
  //     beforeSend: function() {
  //       $("#password-update-progress-dialog").modal("show");
  //     },
  //     success: function(response) {

  //       setTimeout(function() {
  //         $("#password-update-progress-dialog").modal("toggle");
  //         window.location.href = site_url + 'home/home_page';
  //         // location.reload();
  //       }, 500);
        
  //     }
  //   });

  // });
  
  $('#pay_period').change( function() {
    var p_pay_period = $('#pay_period').val();
    var user_id = $('#user_id').val();
    /*if(period_selected != 'select')
      window.location.href = site_url + 'profile/print_payslip/' + period_selected;
      */
     $.ajax({
      type: "POST",
      url: site_url + "ajax/payroll_ajax/get_payroll_data",
      data: {p_pay_period: p_pay_period, user_id: user_id},
      beforeSend: function() {
        $("#payslip-ajax-loader").css("visibility", "visible");
      },
      success: function(data) {

        $("#payslip-ajax-loader").css("visibility", "hidden");
       
         var payslip_data = $.parseJSON(data);
         if(payslip_data[0] === undefined || payslip_data[0].length == 0 ){
            confirm("Payslip data not found.");
            window.location.href = site_url + 'profile/print_payslip/';
         } else {
         
          
          var gross_pay = Number(payslip_data[0].reg_basic) +
                           Number(payslip_data[0].ot_pay_regular) +
                           Number(payslip_data[0].ot_pay_rd) +
                           Number(payslip_data[0].night_differential) +
                           Number(payslip_data[0].regular_holiday_pay) +
                           Number(payslip_data[0].ot_pay_regular_h) +
                           Number(payslip_data[0].special_holiday_pay) +
                           Number(payslip_data[0].ot_pay_rd_h) +
                           Number(payslip_data[0].ot_pay_rd_sh) +
                           Number(payslip_data[0].productivity) +
                           Number(payslip_data[0].poc_incentive) +
                           Number(payslip_data[0].contingency_bonus) +
                           Number(payslip_data[0].referral) +
                           Number(payslip_data[0].adjustments);
           var benefits = Number(payslip_data[0].other_benefits1) +
                          Number(payslip_data[0].other_benefits2) +
                          Number(payslip_data[0].other_benefits3);
           var total_nontaxable = Number(payslip_data[0].rice_allowance) +
                           Number(payslip_data[0].laundry_allowance) +
                           Number(payslip_data[0].clothing_allowance) +
                           Number(payslip_data[0].meal_allowance) +
                           benefits +
                           Number(payslip_data[0]._13th_month);

           var total_deduction = Number(payslip_data[0].p_tax_withheld) + 
                                 Number(payslip_data[0].sss_employee) +
                                 Number(payslip_data[0].pagibig_employee) +
                                 // Number(payslip_data[0].maxicare_principal) +
                                 Number(payslip_data[0].phic_employee) ;

                              /*+
                              Number(payslip_data[0].total_deductions) +
                                  +
                                  +
                                 Number(payslip_data[0].maxicare_dependent) +
                                  +
                                 Number(payslip_data[0].maxicare_dental) +

                                 Number(payslip_data[0].sss_salary_loan) +
                                 Number(payslip_data[0].ca_salary_adjustment +
                                 Number(payslip_data[0].hdmf_salary_loan) +
                                 Number(payslip_data[0].food_deduction) +
                                 Number(payslip_data[0].hdmf_house_loan) +

                                 Number(payslip_data[0].food_deduction2) +
                                 Number(payslip_data[0].gym) +
                                 Number(payslip_data[0].hdmf_salary_loan) +
                                 Number(payslip_data[0].food_deduction) +
                                 Number(payslip_data[0].hdmf_house_loan) +

                                 Number(payslip_data[0].p_tax_withheld) +
                                 Number(payslip_data[0].undertime) +
                                 Number(payslip_data[0].tardy) +
                                 Number(payslip_data[0].gadget_loan) +
                                 Number(payslip_data[0].other_loan) +
                                 Number(payslip_data[0].gadget_loan);*/

          // console.log("SSS: " + payslip_data[0].sss_employee);
          // console.log("Philhealth: " + payslip_data[0].phic_employee);
          // console.log("PAGIBIG: " + payslip_data[0].pagibig_employee);
          // console.log("SSS Loans: " + payslip_data[0].sss_salary_loan);
          // console.log("HDMF Salary Loan: " + payslip_data[0].sss_employee);
          // console.log("HDMF House Loan: " + payslip_data[0].sss_employee);
          // console.log("Gym: " + payslip_data[0].sss_employee);    

          // console.log("HMO - Principal: " + payslip_data[0].sss_employee);
          // console.log("HMO - Dependent: " + payslip_data[0].sss_employee);
          // console.log("HMO - Dental: " + payslip_data[0].sss_employee);
          // console.log("Cash Advance: " + payslip_data[0].sss_employee);
          // console.log("Food: " + payslip_data[0].sss_employee);
          // console.log("Food 2: " + payslip_data[0].sss_employee);
          // console.log("Tax: " + payslip_data[0].sss_employee);   

          // console.log("Undertime: " + payslip_data[0].sss_employee);
          // console.log("Lates: " + payslip_data[0].sss_employee);
          // console.log("Gadget Loan: " + payslip_data[0].sss_employee);
          // console.log("OTHERS" + payslip_data[0].sss_employee);

           console.log("SSS: " + (payslip_data[0].sss_employee));
           console.log("HMO Principal: " + (payslip_data[0].maxicare_principal));
           console.log("Philhealth: " + payslip_data[0].phic_employee);
           console.log("HMO - Dependent:" + (payslip_data[0].maxicare_dependent));
           console.log("PAGIBIG: " + (payslip_data[0].pagibig_employee));
           console.log("HMO - Dental:" + (payslip_data[0].maxicare_dental));
           console.log("SSS Loans:" + (payslip_data[0].sss_salary_loan));
           console.log("Cash Advance:" + (payslip_data[0].ca_salary_adjustment));
           console.log("DMF Salary Loan:" + (payslip_data[0].hdmf_salary_loan));
           console.log("Food:" + (payslip_data[0].food_deduction));
           console.log("HDMF House Loan:" + (payslip_data[0].hdmf_house_loan));
           console.log("Food 2:" + (payslip_data[0].food_deduction2));
           console.log("Gym:" + (payslip_data[0].gym));
           console.log("Tax:" + (payslip_data[0].p_tax_withheld));
           console.log("Undertime:" + (payslip_data[0].undertime));
           console.log("Lates:" + (payslip_data[0].tardy));
           console.log("Gadget Loan:" + (payslip_data[0].gadget_loan));
           console.log("OTHERS (Loans, Contributions):" + (payslip_data[0].other_loan)); 

           var total_deduct_2 =
           Number(payslip_data[0].sss_employee) +
           Number(payslip_data[0].maxicare_principal) +
           Number(payslip_data[0].phic_employee) +
           Number(payslip_data[0].maxicare_dependent) +
           Number(payslip_data[0].pagibig_employee) +
           Number(payslip_data[0].maxicare_dental) +
           Number(payslip_data[0].sss_salary_loan) +
           Number(payslip_data[0].ca_salary_adjustment) +
           Number(payslip_data[0].hdmf_salary_loan) +
           Number(payslip_data[0].food_deduction) +
           Number(payslip_data[0].hdmf_house_loan) +
           Number(payslip_data[0].food_deduction2) +
           Number(payslip_data[0].gym) +
           Number(payslip_data[0].p_tax_withheld) +
           Number(payslip_data[0].undertime) +
           Number(payslip_data[0].tardy) +
           Number(payslip_data[0].gadget_loan) +
           Number(payslip_data[0].other_loan);  

           console.log("Total Deduction: " + total_deduct_2);       
                                 
           var sub_total = gross_pay + total_nontaxable;

           $('.lastname').text(payslip_data[0].last_name);
           $('.department').text(payslip_data[0].department);
           $('.firstname').text(payslip_data[0].first_name);
           $('.pay_period').text(payslip_data[0].pay_period);
           $('.dependents').text(payslip_data[0].p_dependents);
           $('.working_days').text(payslip_data[0].p_working_days);
           $('.reg_basic').text(Math.abs(payslip_data[0].reg_basic));
           $('.p_days_worked').text(payslip_data[0].p_days_worked);
           $('.ot_pay_regular').text(Math.abs(payslip_data[0].ot_pay_regular));
           $('.days_absent').text(payslip_data[0].p_working_days - payslip_data[0].p_days_worked);
           $('.daily_rate').text(Math.abs(payslip_data[0].p_daily_rate));
           $('.night_differential').text(Math.abs(payslip_data[0].night_differential));
           $('.regular_holiday_pay').text(Math.abs(payslip_data[0].regular_holiday_pay));
           $('.ot_pay_regular_h').text(Math.abs(payslip_data[0].ot_pay_regular_h));
           $('.special_holiday_pay').text(Math.abs(payslip_data[0].special_holiday_pay));
           $('.ot_pay_rd').text(Math.abs(payslip_data[0].ot_pay_rd));
           $('.ot_pay_rd_h').text(Math.abs(payslip_data[0].ot_pay_rd_h));
           $('.ot_pay_rd_sh').text(Math.abs(payslip_data[0].ot_pay_rd_sh));
           $('.productivity').text(Math.abs(payslip_data[0].productivity));
           $('.poc_incentive').text(Math.abs(payslip_data[0].poc_incentive));
           $('.contingency_bonus').text(Math.abs(payslip_data[0].contingency_bonus));
           $('.referral').text(Math.abs(payslip_data[0].referral));
           $('.adjustments').text(Math.abs(payslip_data[0].adjustments));
           $('.gross_pay').text(gross_pay.toFixed(2));
           $('.rice_allowance').text(payslip_data[0].rice_allowance);
           $('.laundry_allowance').text(payslip_data[0].laundry_allowance);
           $('.clothing_allowance').text(payslip_data[0].clothing_allowance);
           $('.meal_allowance').text(payslip_data[0].meal_allowance);
           $('.benefits').text(benefits.toFixed(2));
           $('._13th_month').text(payslip_data[0]._13th_month);
           $('.total_non_taxable_pay_and_allowances').text(total_nontaxable.toFixed(2));
           $('.subtotal').text(sub_total.toFixed(2));
           $('.phic_employee').text(payslip_data[0].phic_employee);
           $('.sss_emloyee').text(payslip_data[0].sss_employee);
           $('.maxicare_principal').text(payslip_data[0].maxicare_principal);
           $('.maxicare_dependent').text(payslip_data[0].maxicare_dependent);
           $('.pagibig_employee').text(payslip_data[0].pagibig_employee);
           $('.maxicare_dental').text(payslip_data[0].maxicare_dental);
           $('.sss_salary_loan').text(payslip_data[0].sss_salary_loan);
           $('.ca_salary_adjustment').text(payslip_data[0].ca_salary_adjustment);
           $('.hdmf_salary_loan').text(payslip_data[0].hdmf_salary_loan);
           $('.food_deduction').text(payslip_data[0].food_deduction);
           $('.hdmf_house_loan').text(payslip_data[0].hdmf_house_loan);
           $('.food_deduction2').text(payslip_data[0].food_deduction2);
           $('.gym').text(payslip_data[0].gym);
           $('.p_tax_withheld').text(payslip_data[0].p_tax_withheld);
           $('.undertime').text(Math.abs(payslip_data[0].undertime));
           $('.tardy').text(Math.abs(payslip_data[0].tardy));
           $('.gadget_loan').text(payslip_data[0].gadget_loan);
           $('.other_loan').text(payslip_data[0].other_loan);
           $('.gadget_loan').text(payslip_data[0].gadget_loan);
           $('.total_deduction').text(total_deduct_2.toFixed(2));
           $('.p_net_income').text(payslip_data[0].p_net_income);
         
         }
        }
    });
      
      
  });

});