$(document).ready(function() {

  var data = null;
  var team_member_data = null;
  var member_reactivation_id_array = [];

  /* Team Assigment Search */
  var team_member_row_data = [];
  var dept_member_row_data = [];

  /* Inactive Member List */
  var inactive_member_list = [];

  /* Edit Team Data */
  var edit_team_data = null;

  /* MTL Var */
  mtl_data = null;

  /* Add New Team January 2015 */
  var GLOBAL_REMOVE_MEMBER_LIST = {};
  var GLOBAL_TEAM_MEMBER_ID_LIST = [];
  var GLOBAL_CONFIRM_REMOVE_MEMBER_ID_LIST = [];

  $("#modify-db").click(function() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/modify_db",
      data: {mod: true},
      beforeSend: function() {
        console.log("modifying profiles.");
      },
      success: function(response) {
        console.log("done!");
      }
    });
  });

  // Pagination Start

  var current_page = 1;
  var num_row_to_be_displayed = null;
  var offset = null;
  var pagination_count = null;
  var team_row_count = null;

  function calculate_pagination_offset(item_displayed_count, current_page) {
    return item_displayed_count * ( current_page - 1 );
  }

  function get_team_row_count() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_get_team_row_count",
      data: {"get_team_row_count": true},
      beforeSend: function() {

      },
      success: function(response) {
        team_row_count = parseInt(response);
      }
    });
  }

  function render_team_rows(rows_limit, offset) {
    var dept_id = $("#dept-selector").find(":selected").prop("id");

    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_render_pagination_results",
      data: {rows: rows_limit, offset: offset, dept_id: dept_id},
      beforeSend: function() {
        console.log("appear!");

        $("#pagination-kitten-coffee-loader").css("visibility", "visible");
        // var current_class = $("#pagination-kitten-coffee-loader").prop("class");
        // $("#pagination-kitten-coffee-loader").removeClass(current_class);
        // $("#pagination-kitten-coffee-loader").addClass("fa fa-refresh fa-spin");
        //$("#pagination-kitten-coffee-loader").html("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAaVBMVEX////brVXk06fguGzr377bxo/Elk7TuXdAQEDkwoDLlCvRxqnWoj5CPTDLrmHpzpljY2P38uVEQTeDaD1AOSn59uw9NiN5WSM5LBd2Xyb158717t5BNR9AMhmSkpLV1dXSzajeunTIyMjGRSbSAAAC0klEQVRIiZXUiZKjIBAG4HCLKKIxujPOzB7v/5D7N+CBOarSqUk5ykd3A+ZyKUJrfXkzdNe8izRjdf2e0YI1j8iLgnUHcm+QnD0z2rLmPg3u6udEsPs0uKnrp2k0E3dpKEf9gjRMNGUaysFeEhhBzeZIwtYwjwmVnIMGERX2JYEQFKwICHt9QnbRUIpkMdSK6/X6kFDrq2DpMl4LYZ8QCCasFeIgkrleHxPdWIiuI9FsYjf3RDcdYxCdpSTIZnfDYGrMczoTVAurKiwOphXRHgxIc0eolKq6VDQAAlksLfC65DU7E82M9+FSIQ2NQ3W4DCyjaEAKoz3nnIbRjuAZqy6/V7/u7Ik4KSWeBFotGkMlZpJTpXNwItzs68sCkoRgOyGUUsaYZPRJKAy1bD0AAQCrYBSnUCbeLAnnhkrBrOvCCtHYBB4ZF8W/n59QKakkdojezeav4ZzyR0PbVBLvqhgYQoQxQzXJGJHQ1pbEJDLTc5jYg5Q7MWfClZOBSCweZB+fkyhji2acMk7OlEQFHsjwApDwZTNOeffhQxXymh56yOuFzs7EOP4xh9mHlKYMCB/bL4jyfzwKwzNDMyp1ACgK/ydyNFzhgISEPM1aAs6tYKc0nM8gYa7WiM0gXQK0YCdiJHf+A5+Z5Dyv/a8l4sCkA70Rm42iD4Us1wx3MtmMTcbtgwuyiSPpogFyeXC8iDuUlmD7HdgJmTijS7GdmJjD77+eK3H4Eercvt2HM0CdmSzs4c3EpDBxxr1jnpdZpaqokuIlS3NybKNK4aexldKM09f0hZimEefm+/vXHaFOEXQAps8BZY1LOy3LMo3LhAKmzxOJy2PWaPuhbUeQPn8jSpJ6X18PBIaNGNe3/ajou21vZ3Lc6kj6MZOW4+82DI+IyiL+VLTLGKceMHiI33177mVLEF8YFJMC42+3+NX3y4GsadTWvRkpqOchB7qPi/wfHykvVoT53xsAAAAASUVORK5CYII='>");
      },
      success: function(response) {
        // console.log("disappear!");
        if (response.length > 0) {
          $("#pagination-kitten-coffee-loader").css("visibility", "hidden");
          // var current_class = $("#pagination-kitten-coffee-loader").prop("class");
          // $("#pagination-kitten-coffee-loader").removeClass(current_class);
          // $("#pagination-kitten-coffee-loader").addClass("fa fa-coffee");

          $("#team-tbody").empty();
          $("#team-tbody").append(response);
        } else {
          $("#team-tbody").empty();
          $("#team-tbody").append("<tr><td>Query returned nothing.</td><td></td><td></td><td></td><td></td></tr>");
        }
  
      }
    });
  }

  // Pagination Config
  var pagination_head = 1;
  var pagination_tail = 5;
  var pagination_length = null;

  function render_pagination(pagination_limit) {
    $("#pagination-cat").empty();

    pagination_length = pagination_limit;
    pagination_end = pagination_limit;

    if (pagination_limit >= 1 && pagination_limit <= 5) {
      for(var i = 1 ; i <= pagination_limit ; ++i) {
        $("#pagination-cat").append("<li id='pagination-kitten' class=" + i + ">" + "<a href=#" + i + ">" + i + "</a>" + "</li>");
      }
    } else {
      if (pagination_head != 1) {
        $("#pagination-cat").append("<li id='pagination-kitten-head'><a href='#'>&laquo</a></li>");
      } else {
        $("#pagination-cat").append("<li id='pagination-kitten-head-sleep'><a href='#'>&laquo</a></li>");
      }
      for(var i = pagination_head ; i <= pagination_tail ; ++i) {
        $("#pagination-cat").append("<li id='pagination-kitten' class=" + i + ">" + "<a href=#" + i + ">" + i + "</a>" + "</li>");
      }
      if (pagination_tail != pagination_length) {
        $("#pagination-cat").append("<li id='pagination-kitten-tail'><a href='#'>&raquo</a></li>");
      } else {
        $("#pagination-cat").append("<li id='pagination-kitten-tail-sleep'><a href='#'>&raquo</a></li>");
      }
    }

    //$("#pagination-kitten:first").addClass("active");
  }

  $(document).on("click", "#pagination-kitten-tail", function() {
    pagination_head = pagination_head + 1;
    pagination_tail = pagination_tail + 1;
    render_pagination(pagination_length);
  });

  $(document).on("click", "#pagination-kitten-head", function() {
    pagination_head = pagination_head - 1;
    pagination_tail = pagination_tail - 1;
    render_pagination(pagination_length);
  });

  $(document).on("click", "#pagination-kitten", function() {
    var value = parseInt( $(this).prop("class") );

    $("li[id=pagination-kitten]").removeClass("active");
    $(this).addClass("active");

    var this_offset = calculate_pagination_offset(num_row_to_be_displayed, value);
    render_team_rows(num_row_to_be_displayed, this_offset);
  });

  //get_team_row_count();

  var pagination_drop_down_click_counter = 0;
  $(document).on("click", "#row-pagination-count", function() {
    pagination_drop_down_click_counter += 1;
    if (pagination_drop_down_click_counter == 2) {
      var row_displayed = parseInt( $(this).val() );

      // Whenever user changes row # displayed, reset pagination.
      pagination_head = 1;
      pagination_tail = 5;

      get_team_row_count();

      num_row_to_be_displayed = row_displayed;
      offset_result = calculate_pagination_offset(num_row_to_be_displayed, current_page);
      pagination_count = Math.ceil( team_row_count / num_row_to_be_displayed );

      render_pagination(pagination_count);

      render_team_rows(num_row_to_be_displayed, offset_result);
      
      pagination_drop_down_click_counter = 0;
    }
  });

  $(document).on("change", "#row-pagination-count", function() {
    
  });

  // Pagination End

  $("#search").keypress(function(event) {
    if (event.which == 13) {
      var search_key = $(this).val();
      console.log(search_key);

      $.ajax({
        type: "POST",
        url: site_url + "ajax/team_ajax/ajax_search_team",
        data: {search: search_key},
        beforeSend: function() {
          var current_class = $("#search-team-loader").prop("class");
          $("#search-team-loader").removeClass(current_class);
          $("#search-team-loader").addClass("fa fa-refresh fa-spin");
        },
        success: function(response) {
          console.log(response);

          var current_class = $("#search-team-loader").prop("class");
          $("#search-team-loader").removeClass(current_class);
          $("#search-team-loader").addClass("fa fa-search");
          //alert(response);
          $("#team-tbody").empty();
          $("#team-tbody").append(response);
        }
      });
    }
    
  });

  $(document).on("keyup", "#reactivate-employee-search", function() {
    var employee = $("#reactivate-employee-search").val();

    $("#inactive-member-ul").html("");

    for (var c = 0 ; c < inactive_member_list.length ; ++c) {
      if ((inactive_member_list[c].toLowerCase()).indexOf(employee) > -1) {
        $("#inactive-member-ul").append(inactive_member_list[c]);
      }
    }

  });

  function populateInactiveMemberModal() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_populate_inactive_members",
      data: {team_id: data[1]},
      beforeSend: function() {
        $("#select-inactive-member-icon").removeClass("fa fa-users");
        $("#select-inactive-member-icon").addClass("fa fa-spinner fa-spin");
      },
      success: function(response) {

        // Store ajax response into array for employee search.
        var inactive_members = response.split("</label>");

        for (var c = 0 ; c < inactive_members.length ; ++c) {
          inactive_members[c] = inactive_members[c] + "</label>";
          console.log(inactive_members[c] + "<-");
        }

        inactive_member_list = inactive_members;

        console.log(response);

        $("#select-inactive-member-icon").removeClass("fa fa-spinner fa-spin");
        $("#select-inactive-member-icon").addClass("fa fa-users");

        $("#inactive-member-ul").html("");
        $("#inactive-member-ul").append(response);
      }
    });
  }

  function search_dept_member_in_data_array(search) {
    $("#department-member").empty();

    console.log(dept_member_row_data);

    for(var x = 0 ; x < dept_member_row_data.length ; ++x) {
      if ((dept_member_row_data[x].toLowerCase()).indexOf(search) > -1) {
        $("#department-member").append(dept_member_row_data[x]);
      }
    }
  }

  function searchDepartmentMember() {
    var dept_employee = $.trim( $("#dept-employee-member-search").val() ).toLowerCase(); 

    console.log(dept_employee);

    search_dept_member_in_data_array(dept_employee);
  }

  // Search for names in data row array
  function search_team_member_in_data_array(search) {
    $("#team-member").empty();

    for(var x = 0 ; x < team_member_row_data.length ; ++x) {
      if ((team_member_row_data[x].toLowerCase()).indexOf(search) > -1) {
        $("#team-member").append(team_member_row_data[x]);
      }
    }
  }

  function searchTeamMember() {
    var team_employee = $.trim( $("#team-employee-member-search").val() ).toLowerCase();

    console.log(team_employee);

    search_team_member_in_data_array(team_employee);
  }

  function populateTeamMemberListTable() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_populate_team_member_list_table",
      data: {team_id: data[1]},
      beforeSend: function() {
        $("#view-team-loader").css("visibility", "visible");
      },
      success: function(response) {
        $("#view-team-loader").css("visibility", "hidden");

        console.log(response);
        if (response.length > 0) {
          $("#new-team-list-body").empty();
          $("#new-team-list-body").append(response);

          // console.log("OVER HERE!");

          $(".checkbox-selector:checkbox").each(function() {
            // console.log($(this).prop("id").split("|"));
            GLOBAL_TEAM_MEMBER_ID_LIST.push({"user_id": $(this).prop("id").split("|")[0]});
          });

          // console.log(GLOBAL_TEAM_MEMBER_ID_LIST);
        } else {
          $("#new-team-list-body").empty();
          $("#new-team-list-body").append("<tr><td></td><td>No member has been assigned to this team, yet.</td><td> </td></tr>");
        }
        
      }
    });
  }

  $(document).on("click", ".assign-team-member-checkbox", function(event) {
    var check_box_counter = 0;

    $("input:checked").each(function() {
      check_box_counter++;
    });

    if (check_box_counter > 1) {
      $("#reworked-assign-new-team-member").prop("disabled", false);
    } else {
      $("#reworked-assign-new-team-member").prop("disabled", true);
    }

    event.stopPropagation();
  });

  $(document).on("click", ".checkbox-selector", function(event) {
    var check_box_counter = 0;

    $("input:checked").each(function() {
      check_box_counter++;
    });

    if (check_box_counter > 1) {
      $("#remove-from-team-list").prop("disabled", false);
    } else {
      $("#remove-from-team-list").prop("disabled", true);
    }

    event.stopPropagation();
  });

  function populateTeamMemberDropDown() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_populate_team_drop_down",
      data: {team_id: data[1]},
      beforeSend: function() {
        $("#team-member-icon").removeClass("fa fa-thumb-tack");
        $("#team-member-icon").addClass("fa fa-spinner fa-spin");
        $("#team-member").prop("disabled", true);
      }, 
      success: function(response) {
        var team_members = response.split("</option>");
        
        for (var x = 0 ; x < team_members.length ; ++x) {
          team_members[x] = team_members[x] + "</option>";
        }

        team_member_row_data = team_members;

        $("#team-member-icon").removeClass("fa fa-spinner fa-spin");
        $("#team-member-icon").addClass("fa fa-thumb-tack");
        $("#team-member").prop("disabled", false);

        $("#team-member").empty();
        $("#team-member").append(response);
      }
    });
  }

  $(document).on("click", "#perma-go-kitten-go", function() {
    perma_remove_team_member();
  });

  $(document).on("click", "#perma-remove-member", function() {
    $(this).prop("disabled", true);
    $("#perma-go-kitten-go").prop("disabled", false);
  });

  function perma_remove_team_member() {
    var team_member_data = [];

    $("#team-member :selected").each(function(i, selected) {
      team_member_data.push( {team_id: data[1], user_id: $(selected).prop("id"), active: 1, date_assigned: "NOW()"} );
    });

    //console.log(JSON.stringify(team_member_data, null, 4));

    $.ajax({
      type: "POST",
      // url: site_url + "ajax/team_ajax/ajax_set_team_member_to_inactive",
      url: site_url + "ajax/team_ajax/ajax_perma_remove_team_member_from_team",
      data: {user_data: JSON.stringify(team_member_data, null, 4)},
      beforeSend: function() {
        displayLoader("#mtl-remove-team-kitten-from-team", "fa fa-cog fa-spin");
        // $("#remove-member-icon").removeClass("fa fa-pencil");
        // $("#remove-member-icon").addClass("fa fa-spinner fa-spin");
      },
      success: function(response) {
        removeLoader("#mtl-remove-team-kitten-from-team", "fa fa-eraser");
        // $("#remove-member-icon").removeClass("fa fa-spinner fa-spin");
        // $("#remove-member-icon").addClass("fa fa-pencil");

        populateTeamMemberDropDown();

        $("#perma-go-kitten-go").prop("disabled", true);
        $("#perma-remove-member").prop("disabled", false);
        // $("#confirm-remove-team-member-dialog").modal("toggle");
        //$("#assign-team-member-dialog").modal("show");
      }
    });
  }

  function remove_team_member() {
    var team_member_data = [];

    $("#team-member :selected").each(function(i, selected) {
      team_member_data.push( {team_id: data[1], user_id: $(selected).prop("id"), active: 1, date_assigned: "NOW()"} );
    });

    //console.log(JSON.stringify(team_member_data, null, 4));

    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_set_team_member_to_inactive",
      data: {user_data: JSON.stringify(team_member_data, null, 4)},
      beforeSend: function() {
        $("#remove-member-icon").removeClass("fa fa-pencil");
        $("#remove-member-icon").addClass("fa fa-spinner fa-spin");
      },
      success: function(response) {
        $("#remove-member-icon").removeClass("fa fa-spinner fa-spin");
        $("#remove-member-icon").addClass("fa fa-pencil");

        populateTeamMemberDropDown();

        $("#confirm-remove-team-member-dialog").modal("toggle");
        $("#assign-team-member-dialog").modal("show");
      }
    });
  }

  $(document).on("keyup", "#dept-employee-member-search", function() {
    searchDepartmentMember();
  });

  $(document).on("keyup", "#team-employee-member-search", function() {
    
    searchTeamMember();
  })

  // Reactivate member button
  $("#reactivate-team-member").click(function() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_set_team_member_to_active",
      data: {reactivate_user_id: JSON.stringify(member_reactivation_id_array, null, 4), team_id: data[1]},
      beforeSend: function() {
        $("#reactiavate-member-icon").removeClass("fa fa-pencil");
        $("#reactiavate-member-icon").addClass("fa fa-spinner fa-spin");
      },
      success: function(response) {
        $("#reactiavate-member-icon").removeClass("fa fa-spinner fa-spin");
        $("#reactiavate-member-icon").addClass("fa fa-pencil");

        // Repopulate inactive list after reactivating an inactive member.
        populateInactiveMemberModal();

        $("#confirm-reactivate-team-member-dialog").modal("toggle");
        $("#inactive-member-modal-dialog").modal("show");
      }
    });
  });

  // Close reactivate member button
  $("#close-reactivate-team-member-confirmation").click(function() {
    $("#confirm-reactivate-team-member-dialog").modal("toggle");
    $("#inactive-member-modal-dialog").modal("show");
  });

  // Activate in-active member
  $(".activate").click(function() {
    $("#inactive-member-ul li").each(function(i, li) {
      if ($(li).find("input").prop("checked")) {
        var user_id = $(li).find("input").prop("id");
        member_reactivation_id_array.push({user_id: user_id});
      }
    });

    $("#inactive-member-modal-dialog").modal("toggle");
    $("#confirm-reactivate-team-member-dialog").modal("show");
    //console.log(member_reactivation_id_array);
  });

  $(document).on("click", "#view-inactive-member", function() {
    var team_name = $(this).prop("class");

    var team_data_arr = team_name.split(",");

    // Global Variable
    data = team_data_arr;

    console.log(team_data_arr);

    populateInactiveMemberModal();

    $("#inactive-member-modal-dialog").modal("show");
  });

  $("#remove-team-member-confirmation-btn").click(function() {
    remove_team_member();
  });

  $("#close-remove-team-member-confirmation").click(function() {
    $("#confirm-remove-team-member-dialog").modal("toggle");
    $("#assign-team-member-dialog").modal("show");
  });

  // Remove member(s) from a team. [Remove from Team] button.
  $("#remove-member").click(function() {
    $("#assign-team-member-dialog").modal("toggle");
    $("#confirm-remove-team-member-dialog").modal("show");
  });

  // Allows removing team members by double clicking.
  // $(document).on("dblclick", ".team-team-member", function() {
  //   $("#assign-team-member-dialog").modal("toggle");
  //   $("#confirm-remove-team-member-dialog").modal("show");
  // });

  $(document).on("click", "#close-member-assignment-dialog", function() {
    location.reload();
  });

  $("#add-new-team").click(function() {
    $("#create-new-team-dialog").modal("show");
  });

  $("#close-team-member-confirmation").click(function() {
    $("#confirm-team-member-assignment-dialog").modal("toggle");
    $("#assign-team-member-dialog").modal("show");
  });

  $("#confirm-team-member-assignment").click(function() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/test_multiple_user_data",
      data: {user_data: team_member_data, team_id: data[1]},
      beforeSend: function() {
        $("#team-member-confirmation-btn").removeClass("fa fa-pencil");
        $("#team-member-confirmation-btn").addClass("fa fa-spinner fa-spin");
        $("#confirm-team-member-assignment").prop("disabled", true);
      },
      success: function(response) {

        $("#team-member-confirmation-btn").removeClass("fa fa-spinner fa-spin");
        $("#team-member-confirmation-btn").addClass("fa fa-pencil");
        $("#confirm-team-member-assignment").prop("disabled", false);

        populateTeamMemberDropDown();
        $("#confirm-team-member-assignment-dialog").modal("toggle");
        $("#assign-team-member-dialog").modal("show");
      }
    });
  });

  function assign_team_member() {
    $("#employee_id").val( $("#department-member").find(":selected").prop("id") );
    $("#employee_name").val( $("#department-member").find(":selected").val() );

    var data_array = [];

    $("#department-member :selected").each(function(i, selected) {
      data_array.push( {team_id: data[1], user_id: $(selected).prop("id"), active: 1, date_assigned: "NOW()"} );
    });

    // Global Variable
    team_member_data = JSON.stringify(data_array, null, 4);

    $("#assign-team-member-dialog").modal("toggle");
    $("#confirm-team-member-assignment-dialog").modal("show");
  }

  // Allows adding team member by double clicking deparment member select
  $(document).on("dblclick", ".dept-team-member", function() {
    assign_team_member();
  });

  $("#assign-member").click(function() {
    assign_team_member();
  });

  $(document).on("change", "#team-list-department", function() {
    var department = $(this).val();
    var department_id = $(this).find(":selected").prop("id");

    // Exclude existing members from team.
    var existing_member_id_list = [];

    $("#team-member option").each(function() {
      existing_member_id_list.push( { "user_id": $(this).prop("id") } );
    });

    console.log(existing_member_id_list);

    $.ajax({
      type: "POST",
      url: site_url + "ajax/employee_ajax/ajax_get_employee_profile_by_department_team_assign",
      data: {team_id: data[1], department: department, department_id: department_id, current_member_id: JSON.stringify(existing_member_id_list, null, 4)},
      beforeSend: function() {
        // Disable controls before making an AJAX request.
        $("#dept-employee-member-search").prop("disabled", true);
        $("#department-member").prop("disabled", true);
        $("#assign-member").prop("disabled", true);

        $("#department-member-icon").removeClass("fa fa-user");
        $("#department-member-icon").addClass("fa fa-spinner fa-spin");
        $("#department-member").prop("disabled", true);
      },
      success: function(response) {
        console.log(response);

        $("#department-member-icon").removeClass("fa fa-spinner fa-spin");
        $("#department-member-icon").addClass("fa fa-user");

        // Enable Controls
        $("#dept-employee-member-search").prop("disabled", false);
        $("#department-member").prop("disabled", false);
        $("#assign-member").prop("disabled", false);        

        // here
        var department_members = response.split("</option>");
        
        for (var x = 0 ; x < department_members.length ; ++x) {
          department_members[x] = department_members[x] + "</option>";
          console.log(department_members[x]);
        }

        dept_member_row_data = department_members;

        $("#department-member").empty();
        $("#department-member").append(response);
      }
    });
  });

  $("#update-team-department").on("click", function(event) {
    $(this).off(event);

    var department_id = $("#team-list-change-department-dropdown").find("option:selected").prop("id");
    var department = $("#team-list-change-department-dropdown").find("option:selected").val();

    $(this).unbind("click");

    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_update_team_department_id",
      data: {team_id: mtl_data[1], dept_id: department_id},
      beforeSend: function() {
        var current_class = $("#edit-team-department-loader").prop("class");
        $("#edit-team-department-loader").removeClass(current_class);
        $("#edit-team-department-loader").addClass("fa fa-spinner fa-spin");
      },
      success: function(response) {
        var current_class = $("#edit-team-department-loader").prop("class");
        $("#edit-team-department-loader").removeClass(current_class);
        $("#edit-team-department-loader").addClass("fa fa-users");
      
        $("#edit-team-modal").modal("toggle");

        location.reload();
      }
    });
  });

  $(document).on("click", "#update-team", function() {
    var updated_team_name = $("#input-team-name").val();
    var updated_team_lead_id = $("#edit-team-team-leader").find("option:selected").prop("id");

    if (updated_team_name.length > 0 && updated_team_lead_id.length > 0) {
      $.ajax({
        type: "POST",
        url: site_url + "ajax/team_ajax/ajax_update_team",
        data: {team_id: edit_team_data[1], team_leader_id: updated_team_lead_id, team_name: updated_team_name},
        beforeSend: function() {
          var current_class = $("#edit-team-loader").prop("class");
          $("#edit-team-loader").removeClass(current_class);
          $("#edit-team-loader").addClass("fa fa-spinner fa-spin");
        },
        success: function(response) {
          var current_class = $("#edit-team-loader").prop("class");
          $("#edit-team-loader").removeClass(current_class);
          $("#edit-team-loader").addClass("fa fa-users");

          $("#edit-team-modal").modal("toggle");

          location.reload();
        }
      });
    } else {
      $(this).prop("disabled", true);
    }
  });

  $(document).on("change", "#team-list-change-department-dropdown", function() {
    $("#update-team-department-confirm").prop("disabled", false);
  });

  $(document).on("click", "#update-team-department-confirm", function() {
    $("#update-team-department").prop("disabled", false);
  });

  $(document).on("click", "#update-team-confirm", function() {
    var updated_team_name = $("#input-team-name").val();
    var updated_team_lead_id = $("#edit-team-team-leader").find("option:selected").prop("id");

    if (updated_team_name.length > 0 && updated_team_lead_id.length > 0) {

      $(this).prop("disabled", true);
      $("#update-team").prop("disabled", false);
      console.log(updated_team_name + " " + updated_team_lead_id);
    } else {
      console.log("fill everything.");
    }
    
  });

  $(document).on("click", "#close-edit-team-modal", function() {
    $("#edit-team-modal").modal("toggle");
  });

  function update_edit_team_data(data) {
    edit_team_data = data;
  }

  $(document).on("click", "#edit-team", function() {
    var team_info = $(this).prop("class").split(",");
    update_edit_team_data(team_info);

    console.log("team_name: " + team_info[0]);
    console.log("team_id: " + team_info[1]);
    console.log("manager (user_id): " + team_info[4]);
    console.log("manager_full_name: " + team_info[2]);
    console.log("department_id: " + team_info[3]);

    $("#team-list-change-department-dropdown > option").each(function() {
      if (parseInt($(this).prop("id")) == parseInt(team_info[3])) {
        $("#team-list-change-department-dropdown").val($(this).val());
      }
    });

    // $("#edit-team-team-leader > option").each(function() {
    //   console.log($(this).prop("id") + " " + team_info[4]);
    //   if (parseInt($(this).prop("id")) == parseInt(team_info[4])) {
    //     $("#edit-team-team-leader").val($(this).val());
    //   }
    // });

    $("#edit-team-name").html('<i class="fa fa-user"></i> ' + team_info[0]);
    $("#input-team-name").val(team_info[0]);

    $("#edit-team-modal").modal("show");
  });

  function ajax_delete_team(team_id) {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_delete_team_by_team_id",
      data: {team_id: team_id},
      beforeSend: function() {
        // alert("sending request.");
      },
      success: function(response) {
        $("#confirm-team-deletion-dialog").modal("toggle");
        $("tr[id=" + team_id + "]").remove();
        // alert(response);
      }
    });
  }

  $(document).on("click", ".proceed-team-delete", function() {
    var team_id = $(this).prop("id");

    ajax_delete_team(team_id);
  });

  $(document).on("click", "#delete-team", function() {
    var button_class = $(this).prop("class");

    var data_array = button_class.split(",");
    var team_id = data_array[1];

    $(".proceed-team-delete").prop("id", team_id);

    $("#confirm-team-deletion-dialog").modal("show");
  });

  $(document).on("click", "#check-all-boxes", function() {
    alert("!");
    // var current_state = $(this).checked;

    // alert(current_state);
  });

  $(document).on("change", "#rework-team-list-department", function() {
    var department_id = $(this).find(":selected").prop("id");

    $("#reworked-assign-new-team-member").prop("disabled", true);

    $.ajax({
      type: "POST",
      url: site_url + "ajax/employee_ajax/ajax_reworked_get_employee_profile_by_department_team_assign",
      data: {team_id: data[1], department_id: department_id, current_member_id: JSON.stringify(GLOBAL_TEAM_MEMBER_ID_LIST, null, 4)},
      beforeSend: function() {
        $("#assign-team-member-loader").css("visibility", "visible");
      },
      success: function(response) {
        $("#assign-team-member-loader").css("visibility", "hidden");
        $("#team-member-selection-table").css("visibility", "visible");

        if (response.length > 0) {
          $("#team-member-selection-table-body").empty();
          $("#team-member-selection-table-body").append(response);
        } else {
          $("#team-member-selection-table-body").empty();
          $("#team-member-selection-table-body").append("<tr><td></td><td class='position-center'>Department has no members, yet. (or members have been already assigned into the current team.)</td></tr>");
        }
      }
    });
  });

  $(document).on("click", "#remove-from-team-list", function() {
    GLOBAL_REMOVE_MEMBER_LIST = [];
    // while (GLOBAL_REMOVE_MEMBER_LIST.length > 0) {
    //   GLOBAL_REMOVE_MEMBER_LIST.pop();
    // }

    $("input:checked").each(function() {
      if (this.checked) {
        var user_data = $(this).prop("id").split("|");

        if (typeof user_data[1] !== "undefined") {
          GLOBAL_REMOVE_MEMBER_LIST.push($(this).prop("id"));
          // GLOBAL_CONFIRM_REMOVE_MEMBER_ID_LIST.push( $(this).prop("id") );
        }
      }
    });

    console.log(GLOBAL_REMOVE_MEMBER_LIST.length);

    if (GLOBAL_REMOVE_MEMBER_LIST.length > 0) {
      $("#remove-from-team-list").prop("disabled", false);
    } else {
      $("#remove-from-team-list").prop("disabled", true);
    }

    $("#confirm-removal-table-body").empty();

    for (var c = 0 ; c < GLOBAL_REMOVE_MEMBER_LIST.length ; ++c) {
      var user_data = GLOBAL_REMOVE_MEMBER_LIST[c].split("|");
      var full_name = user_data[1];
      $("#confirm-removal-table-body").append("<tr><td id='" + user_data[0] + "|" + data[1].replace(" ", '') + "' class='position-center'>" + full_name + "</td></tr>");
    }

    $("#reworked-add-team-member-modal").modal("hide");
    $("#confirm-team-member-deletion-modal").modal("show");
  });

  $(document).on("click", "#open-assign-team-member-modal", function() {
    $("#reworked-add-team-member-modal").modal("hide");
    $("#reworked-assign-team-member-modal").modal("show");
  });

  $(document).on("click", "#reopen-add-team-member-modal", function() {
    $("#confirm-team-member-deletion-modal").modal("hide");
    $("#reworked-add-team-member-modal").modal("show");
  });

  // Add Team Member Reworked Modal Event Controller
  $(document).on("click", "#assign-team-member", function() {
    var team_name = $(this).prop("class");

    var team_data_array = team_name.split(",");

    data = team_data_array;

    populateTeamMemberListTable();
    $("#team-name").html(team_data_array[0]);
    $("#reworked-add-team-member-modal").modal("show");
  });

  // $(document).on("click", "#assign-team-member", function() {
  //   var team_name = $(this).prop("class");

  //   var team_data_arr = team_name.split(",");

  //   // Global Variable
  //   data = team_data_arr;

  //   //alert(data);

  //   //$("#team-member-assignment-dialog").modal("show");

  //   populateTeamMemberDropDown();

  //   $("#team-name-label").html(team_data_arr[0] + " " + "<i id='team-member-icon' class='fa fa-spinner fa-spin'></i>");
  //   $("#team-leader-full-name").html("Assign Team Member (" + team_data_arr[2] + ")");
  //   $("#assign-team-member-dialog").modal("show");
  // });

  $(".confirm-create-team").click(function() {
    var team_department_id = $.trim( $("#team-department").find(":selected").prop("id") );
    var team_lead_id = $.trim( $("#team_leader").find(":selected").prop("id") );
    var team_name = $.trim( $("#team_name").val() );

    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_create_new_team",
      data: {team_lead_id: team_lead_id, team_name: team_name, department_id: team_department_id},
      beforeSend: function() {

      },
      success: function(response) {
        $("#create-team-confirmation-dialog").modal("toggle");
        //console.log(response);
        location.reload();
      }
    });

  });

  $(".create-team").click(function() {
    $("#create-new-team-dialog").modal("toggle");
    $("#create-team-confirmation-dialog").modal("show");
  });

});

// New Create Team JS for multiple team leaders in a team.

function isDuplicate(pointer, tl_id) {
  var duplicate = false;
  $(pointer).each(function() {
    if (parseInt($(this).prop("id")) == parseInt(tl_id)) {
      duplicate = true;
    }
  });
  return duplicate;
}

var tl_list_counter = 0;
$(document).on("click", "#team_leader", function() {
  tl_list_counter += 1;
  if (tl_list_counter == 2) {
    var tl_name = $(this).val();
    var tl_id = $(this).find(":selected").prop("id");

    if (!isDuplicate("#team-leader-list > option", tl_id)) {
      $("#team-leader-list").append("<option id=" + tl_id + ">" + tl_name + "</option>");
    }
    
    tl_list_counter = 0;
  }
});

$(document).on("dblclick", "#team-leader-list > option", function() {
  $(this).remove();
});

$(document).on("change", "#team-department", function() {
  $("#team_leader").prop("disabled", false);
  $("#team-leader-list").prop("disabled", false);
  $("#team_name").prop("disabled", false);
});

$(document).on("click", ".mtl-create-new-team", function() {
  $(".mtl-create-new-team-go").prop("disabled", false);
});

$(document).on("keyup", "#team_name", function() {
  var team_name = $(this).val();
  if (team_name.length >= 1 && team_name.length <= 50) {
    $(".mtl-create-new-team").prop("disabled", false);
  } else {
    $(".mtl-create-new-team").prop("disabled", true);
    $(".mtl-create-new-team-go").prop("disabled", true);
  }
});

$(document).on("click", ".mtl-create-new-team-go", function(event) {
  // $(this).off(event);

  $(this).prop("disabled", true);

  var department = $("#team-department").val();
  var tl_id_list = [];
  var team_name = $("#team_name").val();

  $("#team-leader-list > option").each(function() {
    var tl_id = parseInt($(this).prop("id"));
    tl_id_list.push({"user_id": tl_id});
  });

  $.ajax({
    type: "POST",
    url: site_url + "ajax/team_ajax/ajax_create_new_team_mtl",
    data: {dept: department, team_leader_id_list: JSON.stringify(tl_id_list, null, 4), teamname: team_name},
    beforeSend: function() {
      displayLoader("#mtl-create-new-team-meow", "fa fa-refresh fa-spin");
    },
    success: function(response) {
      removeLoader("#mtl-create-new-team-meow", "fa fa-pencil");
      console.log(response);
      location.reload();
    }
  });
});

function displayLoader(element, loader_class) {
  var current_class = $(element).prop("class");
  $(element).removeClass(current_class);
  $(element).addClass(loader_class);
}

function removeLoader(element, default_class) {
  var current_class = $(element).prop("class");
  $(element).removeClass(current_class);
  $(element).addClass(default_class);
}

function populateEditTeamLeaderDropDown(team_id) {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_populate_tl_dropdown",
      data: {teamid: team_id},
      beforeSend: function() {
        displayLoader("#mtl-kitten-rocket", "fa fa-refresh fa-spin");

        $("#edit-team-team-leader").prop("disabled", true);
        $("#mtl-tl-list-edit").prop("disabled", true);
        $("#mtl-update").prop("disabled", true);
      },
      success: function(response) {
        removeLoader("#mtl-kitten-rocket", "fa fa-rocket");

        $("#edit-team-team-leader").prop("disabled", false);
        $("#mtl-tl-list-edit").prop("disabled", false);
        $("#mtl-update").prop("disabled", false);

        $("#mtl-tl-list-edit").empty();
        $("#mtl-tl-list-edit").append(response);
      }
    });
  }

$(document).on("click", "#mtl-edit-team", function() {
  var objClass = $(this).prop("class");
  var objClassData = objClass.split(",");

  var team_name = objClassData[0];
  var team_id = objClassData[1];
  var dept_id = objClassData[2];

  mtl_data = objClassData;

  $("#team-list-change-department-dropdown > option").each(function() {
    if (parseInt($(this).prop("id")) == parseInt(dept_id)) {
      $("#team-list-change-department-dropdown").val($(this).val());
    }
  });

  // alert("team_name: " + team_name + " team_id: " + team_id + " dept_id: " + dept_id);
  $("#edit-team-name").html('<i id="mtl-kitten-rocket" class="fa fa-rocket"></i> ' + team_name);
  $("#input-team-name").val(team_name);
  $("#edit-team-modal").modal("show");

  populateEditTeamLeaderDropDown(mtl_data[1]);
});

$(document).on("dblclick", "#mtl-tl-list-edit > option", function() {
  var dblclickedObject = $(this).prop("id");

  $.ajax({
    type: "POST",
    url: site_url + "ajax/team_ajax/ajax_remove_tl",
    data: {tl_id: dblclickedObject, team_id: mtl_data[1]},
    beforeSend: function() {
      displayLoader("#mtl-kitten-rocket", "fa fa-refresh fa-spin");

      $("#edit-team-team-leader").prop("disabled", true);
      $("#mtl-tl-list-edit").prop("disabled", true);
      $("#mtl-update").prop("disabled", true);
    },
    success: function(response) {
      removeLoader("#mtl-kitten-rocket", "fa fa-rocket");

      $("#edit-team-team-leader").prop("disabled", false);
      $("#mtl-tl-list-edit").prop("disabled", false);
      $("#mtl-update").prop("disabled", false);

      populateEditTeamLeaderDropDown(mtl_data[1]);
    }
  });
});

$(document).on("change", "#edit-team-team-leader", function() {
  var name = $(this).val();
  var user_id = $(this).find(":selected").prop("id");

  if (!isDuplicate("#mtl-tl-list-edit > option", user_id)) {
    $("#mtl-tl-list-edit").append("<option id=" + user_id + ">" + name + "</option>");
  }
});

$(document).on("click", "#mtl-update", function() {
  $("#mtl-update-confirm").prop("disabled", false);
});

$(document).on("click", "#mtl-update-confirm", function(event) {
  $(this).off(event);

  var tl_list = [];

  $("#mtl-tl-list-edit > option").each(function() {
    var tl_id = parseInt($(this).prop("id"));
    tl_list.push({"user_id": tl_id});
  });

  console.log(tl_list);
  // JSON.stringify(tl_id_list, null, 4)
  $.ajax({
    type: "POST",
    url: site_url + "ajax/team_ajax/ajax_add_tl_to_team",
    data: {dept_id: mtl_data[2], team_id: mtl_data[1], tl_id_list: JSON.stringify(tl_list, null, 4)},
    beforeSend: function() {
      displayLoader("#mtl-edit-team-leadership-loader", "fa fa-refresh fa-spin");

      $("#edit-team-team-leader").prop("disabled", true);
      $("#mtl-tl-list-edit").prop("disabled", true);
      $("#mtl-update").prop("disabled", true);
    },
    success: function(response) {
      removeLoader("#mtl-edit-team-leadership-loader", "fa fa-users");
      $("#edit-team-modal").modal("toggle");
      location.reload();
    }
  });
  // mtl_data = objClassData
  //alert("team_name: " + mtl_data[0] + " team_id: " + mtl_data[1] + " dept_id: " + mtl_data[2]);
});

$(document).on("keyup", "#input-team-name", function() {
  $("#mtl-update-team-name").prop("disabled", false);
});

$(document).on("click", "#mtl-update-team-name", function() {
  $("#mtl-update-team-name-confirm").prop("disabled", false);
});

$(document).on("click", "#mtl-update-team-name-confirm", function(event) {
  $(this).off(event);

  var new_team_name = $("#input-team-name").val();

  $.ajax({
    type: "POST",
    url: site_url + "ajax/team_ajax/ajax_update_team_name",
    data: {team_name: new_team_name, teamid: mtl_data[1]},
    beforeSend: function() {
      displayLoader("#mtl-edit-team-name-loader", "fa fa-refresh fa-spin");
    },
    success: function(response) {
      removeLoader("#mtl-edit-team-name-loader", "fa fa-users");
      $("#edit-team-modal").modal("toggle");
      location.reload();
    }
  });
});

  function reworked_remove_team_member() {
    var remove_member_id_list = [];
    var user_id_list = [];

    $("#confirm-removal-table-body tr > td").each(function() {
      var employee_data = $(this).prop("id").split("|")
      user_id_list.push(employee_data[0]);
      remove_member_id_list.push( {team_id: employee_data[1], user_id: employee_data[0], active: 1, date_assigned: "NOW()"} );
    });

    $.ajax({
      type: "POST",
      url: site_url + "ajax/team_ajax/ajax_perma_remove_team_member_from_team",
      data: {user_data: JSON.stringify(remove_member_id_list, null, 4)},
      beforeSend: function() {
        $("#confirm-team-member-removal-loader").css("visibility", "visible");
      },
      success: function(response) {
        $("#confirm-team-member-removal-loader").css("visibility", "hidden");

        for (var cc = 0 ; cc < user_id_list.length ; ++cc) {
          $(".team-member-list#" + user_id_list[cc]).remove();
        }

        $("#remove-from-team-list").prop("disabled", true);

        $("#confirm-team-member-deletion-modal").modal("hide");
        $("#reworked-add-team-member-modal").modal("show");
      }
    });
  }

  var GLOBAL_ASSIGN_MEMBER_ID_LIST = [];
  var GLOBAL_CURRENT_TEAM_ID = null;
  var GLOBAL_SELECTED_TEAM_MEMBER_CHECKBOX = [];

$(document).on("click", "#confirm-team-member-removal", function(event) {
  reworked_remove_team_member();
});

function reworked_populate_team_member_list() {
  $.ajax({
    type: "POST",
    url: site_url + "ajax/team_ajax/ajax_populate_team_member_list_table",
    data: {team_id: GLOBAL_CURRENT_TEAM_ID},
    beforeSend: function() {
      $("#view-team-loader").css("visibility", "visible");
    },
    success: function(response) {
      $("#view-team-loader").css("visibility", "hidden");

      console.log(response);
      if (response.length > 0) {
        $("#new-team-list-body").empty();
        $("#new-team-list-body").append(response);

        // console.log("OVER HERE!");

        // $(".checkbox-selector:checkbox").each(function() {
        //   // console.log($(this).prop("id").split("|"));
        //   GLOBAL_TEAM_MEMBER_ID_LIST.push({"user_id": $(this).prop("id").split("|")[0]});
        // });

        // console.log(GLOBAL_TEAM_MEMBER_ID_LIST);
      } else {
        $("#new-team-list-body").empty();
        $("#new-team-list-body").append("<tr><td></td><td>No member has been assigned to this team, yet.</td><td> </td></tr>");
      }
      
    }
  });
}

// function populateTeamMemberListTable() {
//     $.ajax({
//       type: "POST",
//       url: site_url + "ajax/team_ajax/ajax_populate_team_member_list_table",
//       data: {team_id: data[1]},
//       beforeSend: function() {
//         $("#view-team-loader").css("visibility", "visible");
//       },
//       success: function(response) {
//         $("#view-team-loader").css("visibility", "hidden");

//         console.log(response);
//         if (response.length > 0) {
//           $("#new-team-list-body").empty();
//           $("#new-team-list-body").append(response);

//           // console.log("OVER HERE!");

//           $(".checkbox-selector:checkbox").each(function() {
//             // console.log($(this).prop("id").split("|"));
//             GLOBAL_TEAM_MEMBER_ID_LIST.push({"user_id": $(this).prop("id").split("|")[0]});
//           });

//           // console.log(GLOBAL_TEAM_MEMBER_ID_LIST);
//         } else {
//           $("#new-team-list-body").empty();
//           $("#new-team-list-body").append("<tr><td></td><td>No member has been assigned to this team, yet.</td><td> </td></tr>");
//         }
        
//       }
//     });
//   }

function reworked_add_new_team_members() {
  $.ajax({
    type: "POST",
    url: site_url + "ajax/team_ajax/test_multiple_user_data",
    data: {user_data: JSON.stringify(GLOBAL_ASSIGN_MEMBER_ID_LIST, null, 4), team_id: GLOBAL_CURRENT_TEAM_ID},
    beforeSend: function() {
      $("#confirm-assign-team-member-loader").css("visibility", "visible");
    },
    success: function(response) {
      // console.log(GLOBAL_ASSIGN_MEMBER_ID_LIST);

      $("#confirm-assign-team-member-loader").css("visibility", "hidden");

      $("#reworked-assign-new-team-member").prop("disabled", true);
      // $("#team-member-selection-table-body").empty();

      for (var cc = 0 ; cc < GLOBAL_SELECTED_TEAM_MEMBER_CHECKBOX.length ; ++cc) {
        $(".assign-member-tr#" + GLOBAL_SELECTED_TEAM_MEMBER_CHECKBOX[cc]).remove();
        // $("input[id=" + GLOBAL_SELECTED_TEAM_MEMBER_CHECKBOX[cc] + "]").remove();
        // $(".assign-team-member-checkbox #" + GLOBAL_SELECTED_TEAM_MEMBER_CHECKBOX[cc]).remove();
        // $("input[id=" + GLOBAL_SELECTED_TEAM_MEMBER_CHECKBOX[cc] + "]").remove();
        // $('.assign-team-member-checkbox#' + GLOBAL_SELECTED_TEAM_MEMBER_CHECKBOX[cc] ).remove();
      }

      console.log(GLOBAL_SELECTED_TEAM_MEMBER_CHECKBOX);

      reworked_populate_team_member_list();

      $("#confirm-team-member-assignment-modal").modal("hide");
      $("#reworked-assign-team-member-modal").modal("show");
    }
  });
}

$(document).on("click", "#reworked-confirm-team-member-assignment", function() {
  reworked_add_new_team_members();
});

$(document).on("click", "#reworked-assign-new-team-member", function(event) {
  GLOBAL_ASSIGN_MEMBER_ID_LIST.length = 0;
  GLOBAL_SELECTED_TEAM_MEMBER_CHECKBOX.length = 0;

  $("#confirm-assignment-table-body").empty();

  $(".assign-team-member-checkbox:checked").each(function() {
    var user_info = $(this).prop("id").split("|");

    GLOBAL_SELECTED_TEAM_MEMBER_CHECKBOX.push( user_info[0] );

    GLOBAL_CURRENT_TEAM_ID = user_info[2].replace(" ", '');

    GLOBAL_ASSIGN_MEMBER_ID_LIST.push( {team_id: user_info[2].replace(" ", ''), user_id: user_info[0], active: 1, date_assigned: "NOW()"} );
    console.log(user_info[0] + " " + user_info[1] + " " + user_info[2]);

    $("#confirm-assignment-table-body").append("<tr><td class='position-center'>" + user_info[1] + "</td></tr>");
  });

  console.log(GLOBAL_ASSIGN_MEMBER_ID_LIST);

  $("#reworked-assign-team-member-modal").modal("hide");
  $("#confirm-team-member-assignment-modal").modal("show");
}); 