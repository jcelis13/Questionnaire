$(document).ready(function() {

  function bindControls() {
    $("#update-profile").click(function() {
      $("#confirmation-profile-update-dialog").modal("show");
    });

    $(".update-profile-confirm").click(function() {
      $("#confirmation-profile-update-dialog").modal("toggle");

      var values = {};

      $(":input").each(function() {
        if ($(this).prop("id") == "user-role") {
          values["role_id"] = $(this).find(":selected").prop("class");
        } else {
          values[$(this).prop("id")] = $(this).val();
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

        if ($(this).prop("id") == "status-date-applied") {
          values[$(this).prop("id")] = $(this).val();
        }        

        if ($(this).prop("id") == "position") {
          values[$(this).prop("id")] = $(this).find(":selected").prop("id");
        }

        if ($(this).prop("id") == "contract_period_start") {
          values[$(this).prop("id")] = $(this).val();
        }    

        if ($(this).prop("id") == "contract_period_end") {
          values[$(this).prop("id")] = $(this).val();
        }    
      });

      console.log(values);

      var profile_user_id = $(".profile_user_id").prop("id");

      $.ajax({
        type: "POST",
        url: site_url + "ajax/employee_ajax/ajax_update_employee_profile",
        data: {updated_profile: JSON.stringify(values, null, 4), employee_id: profile_user_id},
        beforeSend: function() {
          $("#profile-update-progress-dialog").modal("show");
        },
        success: function(response) {
          console.log(response);
          //alert(JSON.stringify(response, null, 4));
          //console.log(JSON.stringify(response, null, 4));

          $("#profile-update-progress-dialog").modal("toggle");

          //console.log(response);
          location.reload();
        }
      });

    });
  }

  bindControls();

});