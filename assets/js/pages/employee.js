$(document).ready(function() {

  $(document).on("click", "#view-status-change-log", function(event) {
    $("#view-status-change-log-modal").modal("show");
  });

  $("#start-elaga-fun").on("dblclick", function(event) {
    alert("!");

    var nat = [];

    $("#citizenship").find("option").each(function(index, value) {
      nat.push( $(value).val() );
    });

    $.ajax({
      type: "POST",
      url: site_url + "ajax/employee_ajax/ajax_populate_citizenship_table",
      data: {nats: JSON.stringify(nat, null, 4)},
      beforeSend: function() {

      },
      success: function(response) {
        console.log(response);
      }
    });

    $(this).unbind("dblclick");
  });

  function ajax_fetch_department_managers_by_dept_id(dept_id) {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/employee_ajax/ajax_populate_immediate_superior_dropdown_by_dept_id",
      data: {dept_id: dept_id},
      beforeSend: function() {
        $("#immediate_superior").prop("disabled", true);
        $("#immediate_superior").empty();
        $("#immediate_superior").append("<option>Loading. . .</option>");
      },
      success: function(response) {
        console.log(response);

        if (response != 'null') {
          $("#immediate_superior").prop("disabled", false);

          $("#immediate_superior").empty();
          $("#immediate_superior").append(response);
        } else {
          $("#immediate_superior").prop("disabled", true);

          $("#immediate_superior").empty();
        }
        
      }
    });
  }

  $(document).on("change", ".edit-employee-profile-department-dropdown", function(event) {
    var dept_id = $.trim( $(this).find(":selected").prop("id") );

    ajax_fetch_department_managers_by_dept_id(dept_id);
  });

  $(document).on("change", ".add-new-employee-department-dropdown", function(event) {
    var dept_id = $.trim( $(this).find(":selected").prop("id") );

    ajax_fetch_department_managers_by_dept_id(dept_id);
  });

  $(document).on("change", "#gender", function(event) {
    var marital_status_id = $.trim( $("#marital_status").find(":selected").prop("id") );
    var gender = $.trim( $(this).find(":selected").prop("id") );

    if (marital_status_id == 2 && gender == 2) {
      $("#maiden_name").prop("disabled", false);
    } else {
      $("#maiden_name").prop("disabled", true);
    }
  });

  $(document).on("change", "#marital_status", function(event) {
    var marital_status_id = $.trim( $(this).find(":selected").prop("id") );
    var gender = $.trim( $("#gender").find(":selected").prop("id") );

    if (marital_status_id == 2 && gender == 2) {
      $("#maiden_name").prop("disabled", false);
    } else {
      $("#maiden_name").prop("disabled", true);
    }
  });

  $(document).on("keyup", "#sss", function(event) {
    var sss = $(this).val();
    var formated_sss = "";

    if (sss.length != 10) {

    } else {
      formated_sss = sss[0] + "" + sss[1] + "-";
      formated_sss += sss[2] + "" + sss[3] + "" + sss[4] + "" + sss[5] + "" + sss[6] + "" + sss[7] + "" + sss[8] + "-" + sss[9];
      $(this).val(formated_sss);
    }
  });

  $(document).on("keyup", "#phic", function(event) {
    var phic = $(this).val();
    var formated_phic = "";

    if (phic.length != 12) {

    } else {
      formated_phic = phic[0] + "" + phic[1] + "-";
      formated_phic += phic[2] + "" + phic[3] + "" + phic[4] + "" + 
        phic[5] + "" + phic[6] + "" + phic[7] + "" + phic[8] + "" + phic[9] + phic[10] + "-" + phic[11];

      $(this).val(formated_phic);
    }
  });

  $(".datepick").each(function() {
    $(this).inputmask("dd/mm/yyyy", {"placeholder": "dd-mm-yyyy"});
  });

  var user_profile_id = null;

  function check_name_uniqueness(first_name, last_name, middle_name) {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/employee_ajax/ajax_check_name_uniqueness", // for first and last name checking only.
      // url: site_url + "ajax/employee_ajax/ajax_check_employee_fml_names",
      data: {first_name: first_name, last_name: last_name, middle_name: middle_name},
      beforeSend: function() {
        $("#save-new-profile").prop("disabled", true);

        $("#ajax-uniqueness-test-loader").css("visibility", "visible");
        $("#ajax-uniqueness-test-loader").html('<i class="fa fa-cog fa-spin"></i>' + " Checking name uniqueness, please wait.");
      },
      success: function(response) {
        $("#ajax-uniqueness-test-loader").css("visibility", "hidden");

        if (response != "null") {
          user_profile_id = response;

          $("#duplicate-message").css("visibility", "visible");
          $("#duplicate-name").html("<a href='#duplicate'>" + last_name + ", " + first_name + " " + middle_name + "</a>");
          $("#duplicate-link").html("<a id='user-profile-link' href='#link'>Click here</a>");
          //  + site_url + "employee/render_edit_employee_profile/" + response + 
          $("#save").prop("disabled", true);
          $("#save-new-profile").prop("disabled", true);

          $("#user-profile-link").bind("click", function(event) {
            window.open(site_url + "employee/render_edit_employee_profile/" + user_profile_id);
          });

          $("#last_name").css("border", "1px solid purple");
          $("#first_name").css("border", "1px solid purple");
          // $("#middle_name").css("border", "1px solid purple");

        } else {
          $("#duplicate-message").css("visibility", "hidden");
          $("#save").prop("disabled", false);
          $("#save-new-profile").prop("disabled", false);

          $("#last_name").css("border", "1px solid green");
          $("#first_name").css("border", "1px solid green");
          // $("#middle_name").css("border", "1px solid green");
        }
      }
    });
  }

  function ajax_archive_employee_profile(user_id) {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/employee_ajax/ajax_archive_employee_profile",
      data: {user_id: user_id},
      beforeSend: function() {
        $("#delete-employee-profile-loader").removeClass("fa fa-pencil");
        $("#delete-employee-profile-loader").addClass("fa fa-cog fa-spin");
      },
      success: function(response) {
        $("#delete-employee-profile-loader").removeClass("fa fa-cog fa-spin");
        $("#delete-employee-profile-loader").addClass("fa fa-pencil");

        $("#delete-employee-modal").modal("toggle");
        location.reload();
      }
    });
  }

  function ajax_delete_employee_profile(user_id) {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/employee_ajax/ajax_delete_employee_profile",
      data: {user_id: user_id},
      beforeSend: function() {
        $("#delete-employee-profile-loader").removeClass("fa fa-pencil");
        $("#delete-employee-profile-loader").addClass("fa fa-cog fa-spin");
      },
      success: function(response) {
        $("#delete-employee-profile-loader").removeClass("fa fa-cog fa-spin");
        $("#delete-employee-profile-loader").addClass("fa fa-pencil");

        $("#delete-employee-modal").modal("toggle");
        location.reload();
      }
    });
  }

  $(document).on("click", "#delete-employee-profile", function(event) {
    event.preventDefault();
    $(this).prop("disabled", true);

    var user_info_array = $(this).prop("class").split(",");
    var user_id = $.trim( user_info_array[0] ); 
    var first_name = $.trim( user_info_array[2] ); 
    var last_name = $.trim( user_info_array[1] ); 
    var middle_name = $.trim( user_info_array[3] ); 
    var full_name = "";
    var placeholder_message = "Enter fullname of the employee to be archived.";

    // alert(user_id);

    if (last_name.length > 0) {
      full_name = full_name + last_name + ", ";
    } if (first_name.length > 0) {
      full_name = full_name + first_name;
    } if (full_name.length < 1) {
      var rand = Math.floor( (Math.random() * 99999) + 10000 );
      full_name = rand.toString();
      placeholder_message = "Profile lastname and firstname were empty. Enter random number generated.";
    }

    $("#employee-to-be-deleted-name").html(full_name);
    $("#delete-textbox-confirm").prop("placeholder", placeholder_message);
    $("#delete-employee-modal").modal("show");

    $("#delete-textbox-confirm").on("keyup", function(event) {
      var textbox_content = $.trim( $(this).val() );

      console.log(textbox_content + " " + full_name);

      if (textbox_content == full_name) {
        $("#delete-employee-profile-btn").prop("disabled", false);

        archieve_a_profile_user_id = user_id;

      } else {
        $("#delete-employee-profile-btn").prop("disabled", true);
      }
    });
  });

  var archieve_a_profile_user_id = null;

  $(document).on("click", "#delete-employee-profile-btn", function(event) {
    event.preventDefault();
    // ajax_delete_employee_profile(user_id);
    ajax_archive_employee_profile(archieve_a_profile_user_id);
  });

  // $("#last_name").on("keyup", function(event) {
  //   var last_name = $.trim( $(this).val() );
  //   var first_name = $.trim( $("#first_name").val() );
  //   var middle_name = $.trim( $("#middle_name").val() );

  //   console.log("last_name: " + last_name + " / first_name: " + first_name);

  //   if (last_name.length > 0 && first_name.length > 0 /*&& middle_name.length > 0 (uncomment if required again)*/) {
  //     console.log("checking uniqueness." + last_name.length + " " + first_name.length );
  //     check_name_uniqueness( first_name, last_name, middle_name );
  //   } else {
  //     $("#save-new-profile").prop("disabled", true);
  //     $("#duplicate-message").css("visibility", "hidden");

  //     if ($("#first_name").val().length < 1) {
  //       $("#first_name").css("border", "1px solid red");
  //     } else {
  //       $("#first_name").css("border", "1px solid green");
  //     }
  //   }

  //   if ($(this).val().length > 0) {
  //     $(this).css("border", "1px solid green");
  //   } else {
  //     $(this).css("border", "1px solid red");
  //   }
  // });
  
    // event controller for middlename checking.
// $("#middle_name").on("keyup", function(event) {
//     var first_name = $.trim( $("#first_name").val() );
//     var last_name = $.trim( $("#last_name").val() );
//     var middle_name = $.trim( $(this).val() );

//     console.log("last_name: " + last_name + " / first_name: " + first_name);

//     if (last_name.length > 0 && first_name.length > 0 && middle_name.length > 0) {
//       console.log("checking uniqueness." + last_name.length + " " + first_name.length );
//       check_name_uniqueness( first_name, last_name, middle_name );
//     } else {
//       $("#save-new-profile").prop("disabled", true);
//       $("#duplicate-message").css("visibility", "hidden");

//       if ($("#last_name").val().length < 1) {
//         $("#last_name").css("border", "1px solid red");
//       } else {
//         $("#last_name").css("border", "1px solid green");
//       }

//       if ($("#first_name").val().length < 1) {
//         $("#first_name").css("border", "1px solid red");
//       } else {
//         $("#first_name").css("border", "1px solid green");
//       }
//     }

//     if ($(this).val().length > 0) {
//       $(this).css("border", "1px solid green");
//     } else {
//       $(this).css("border", "1px solid red");
//     }
//   });

  // $("#first_name").on("keyup", function(event) {
  //   var first_name = $.trim( $(this).val() );
  //   var last_name = $.trim( $("#last_name").val() );
  //   var middle_name = $.trim( $("#middle_name").val() );

  //   console.log("last_name: " + last_name + " / first_name: " + first_name);

  //   if (last_name.length > 0 && first_name.length > 0 /*&& middle_name.length > 0 (uncomment if required again)*/) {
  //     console.log("checking uniqueness." + last_name.length + " " + first_name.length );
  //     check_name_uniqueness( first_name, last_name, middle_name );
  //   } else {
  //     $("#save-new-profile").prop("disabled", true);
  //     $("#duplicate-message").css("visibility", "hidden");

  //     if ($("#last_name").val().length < 1) {
  //       $("#last_name").css("border", "1px solid red");
  //     } else {
  //       $("#last_name").css("border", "1px solid green");
  //     }
  //   }

  //   if ($(this).val().length > 0) {
  //     $(this).css("border", "1px solid green");
  //   } else {
  //     $(this).css("border", "1px solid red");
  //   }
  // });

  $(document).on("click", "#save", function() {
    var first_name = $.trim( $("#first_name").val() );
    var last_name = $.trim( $("#last_name").val() );

    if (first_name.length > 0 && last_name.length > 0 ) {
      $("#save-new-profile").prop("disabled", false);
    } else {
      $("#save-new-profile").prop("disabled", true);
    }
  });

  $(document).on("click", "#change-password", function() {
    var data = $(this).prop("class");

    $.ajax({
      type: "POST",
      url: site_url + "ajax/employee_ajax/ajax_get_employee_login_info",
      data: {user_id: data},
      beforeSend: function() {

      }, 
      success: function(response) {
        var obj = JSON.parse(response);
        var username = null;
        var password = null;

        $.each(obj, function(key, value) {
          username = value.username;
          password = value.password;
        });

        $("#username").val(username);
        $("#change-password-dialog").modal("show");
      }
    });

  });

  $("#save-new-profile").click(function(event) {
    event.preventDefault();
    $(this).prop("disabled", true);

    var first_name = $.trim( $("#first_name").val() );
    var last_name = $.trim( $("#last_name").val() );
    var middle_name = $.trim( $("#middle_name").val() );
    var registered_address = $.trim( $("#registered_address").val() );

    if (first_name.length > 0 && last_name.length > 0 ) {

      var values = {};
      $(":input").each(function() {
        values[$(this).prop("id")] = $.trim( $(this).val() );

        if ($(this).prop("id") == "role_id" ) {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "gender") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "marital_status") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "employment_type") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "branch_site") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "status") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "immediate_superior") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "employment_type") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "blood_type") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "citizenship") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "religion") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "emergency_contact_relationship") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "province") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "contract_type") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }
      }); 
      
      //alert(JSON.stringify(values, null, 4));

      $.ajax({
        type: "POST",
        url: site_url + "ajax/employee_ajax/ajax_add_new_employee",
        data: {profile: JSON.stringify(values, null, 4)},
        beforeSend: function() {
          var current_class = $("#save-profile-loader").prop("class");
          $("#save-profile-loader").removeClass(current_class);
          $("#save-profile-loader").addClass("fa fa-spinner fa-spin");
        },
        success: function(response) {
          $("#employee-creation-modal").modal("toggle");
          location.reload();
        }
      });

    } else {
      $(this).prop("disabled", true);
    } 
  });

});