$(document).ready(function() {

  var department = null
  var name = null;
  var dept_id = null;
  var manager_id = null;

  // Unassigned Team Array for searching.
  var unassigned_team_list = [];

  // Assigned Team Array for searching.
  var assigned_team_list = [];

  // Pagination Start
  var current_pagination_page = 1;
  var num_row_displayed = null;
  var pagination_offset = null;
  var pagination_counter = null;
  var dept_row_count = null;

  get_dept_row_count();

  function calculate_pagination_offset(item_displayed_count, current_pagination_page) {
    return parseInt( item_displayed_count * ( current_pagination_page - 1 ) );
  }

  function get_dept_row_count() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/department_ajax/ajax_get_department_row_count",
      data: {"get_dept_row_count": true},
      beforeSend: function() {

      },
      success: function(response) {
        dept_row_count = parseInt(response);
      }
    });
  }

  function render_dept_rows(rows_limit, pagination_offset) {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/department_ajax/ajax_render_department_pagination_results",
      data: {rows: rows_limit, pagination_offset: pagination_offset},
      beforeSend: function() {
        var current_class = $("#pagination-kitten-coffee-loader").prop("class");
        $("#pagination-kitten-coffee-loader").removeClass(current_class);
        $("#pagination-kitten-coffee-loader").addClass("fa fa-refresh fa-spin");
        //$("#pagination-kitten-coffee-loader").html("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAaVBMVEX////brVXk06fguGzr377bxo/Elk7TuXdAQEDkwoDLlCvRxqnWoj5CPTDLrmHpzpljY2P38uVEQTeDaD1AOSn59uw9NiN5WSM5LBd2Xyb158717t5BNR9AMhmSkpLV1dXSzajeunTIyMjGRSbSAAAC0klEQVRIiZXUiZKjIBAG4HCLKKIxujPOzB7v/5D7N+CBOarSqUk5ykd3A+ZyKUJrfXkzdNe8izRjdf2e0YI1j8iLgnUHcm+QnD0z2rLmPg3u6udEsPs0uKnrp2k0E3dpKEf9gjRMNGUaysFeEhhBzeZIwtYwjwmVnIMGERX2JYEQFKwICHt9QnbRUIpkMdSK6/X6kFDrq2DpMl4LYZ8QCCasFeIgkrleHxPdWIiuI9FsYjf3RDcdYxCdpSTIZnfDYGrMczoTVAurKiwOphXRHgxIc0eolKq6VDQAAlksLfC65DU7E82M9+FSIQ2NQ3W4DCyjaEAKoz3nnIbRjuAZqy6/V7/u7Ik4KSWeBFotGkMlZpJTpXNwItzs68sCkoRgOyGUUsaYZPRJKAy1bD0AAQCrYBSnUCbeLAnnhkrBrOvCCtHYBB4ZF8W/n59QKakkdojezeav4ZzyR0PbVBLvqhgYQoQxQzXJGJHQ1pbEJDLTc5jYg5Q7MWfClZOBSCweZB+fkyhji2acMk7OlEQFHsjwApDwZTNOeffhQxXymh56yOuFzs7EOP4xh9mHlKYMCB/bL4jyfzwKwzNDMyp1ACgK/ydyNFzhgISEPM1aAs6tYKc0nM8gYa7WiM0gXQK0YCdiJHf+A5+Z5Dyv/a8l4sCkA70Rm42iD4Us1wx3MtmMTcbtgwuyiSPpogFyeXC8iDuUlmD7HdgJmTijS7GdmJjD77+eK3H4Eercvt2HM0CdmSzs4c3EpDBxxr1jnpdZpaqokuIlS3NybKNK4aexldKM09f0hZimEefm+/vXHaFOEXQAps8BZY1LOy3LMo3LhAKmzxOJy2PWaPuhbUeQPn8jSpJ6X18PBIaNGNe3/ajou21vZ3Lc6kj6MZOW4+82DI+IyiL+VLTLGKceMHiI33177mVLEF8YFJMC42+3+NX3y4GsadTWvRkpqOchB7qPi/wfHykvVoT53xsAAAAASUVORK5CYII='>");
      },
      success: function(response) {
        // console.log(response);
        var current_class = $("#pagination-kitten-coffee-loader").prop("class");
        $("#pagination-kitten-coffee-loader").removeClass(current_class);
        $("#pagination-kitten-coffee-loader").addClass("fa fa-coffee");

        $("#department-table-tbody").empty();
        $("#department-table-tbody").append(response);
      }
    });
  }

  // Pagination Config Start
  var pagination_head = 1;
  var pagination_tail = 5;
  var pagination_length = null;

  function render_dept_pagination_kittens(pagination_limit) {
    $("#pagination-dog").empty();

    pagination_length = pagination_limit;
    pagination_end = pagination_limit;

    if (pagination_limit >= 1 && pagination_limit <= 5) {
      for(var i = 1 ; i <= pagination_limit ; ++i) {
        $("#pagination-dog").append("<li id='pagination-kitten' class=" + i + ">" + "<a href=#" + i + ">" + i + "</a>" + "</li>");
      }
    } else {
      if (pagination_head != 1) {
        $("#pagination-dog").append("<li id='pagination-kitten-head'><a href='#'>&laquo</a></li>");
      } else {
        $("#pagination-dog").append("<li id='pagination-kitten-head-sleep'><a href='#'>&laquo</a></li>");
      }
      for(var i = pagination_head ; i <= pagination_tail ; ++i) {
        $("#pagination-dog").append("<li id='pagination-kitten' class=" + i + ">" + "<a href=#" + i + ">" + i + "</a>" + "</li>");
      }
      if (pagination_tail != pagination_length) {
        $("#pagination-dog").append("<li id='pagination-kitten-tail'><a href='#'>&raquo</a></li>");
      } else {
        $("#pagination-dog").append("<li id='pagination-kitten-tail-sleep'><a href='#'>&raquo</a></li>");
      }
    }

    $("#pagination-kitten:first").addClass("active");
  }
  // Pagination Config End

  $(document).on("click", "#pagination-kitten-tail", function() {
    pagination_head = pagination_head + 1;
    pagination_tail = pagination_tail + 1;
    render_dept_pagination_kittens(pagination_length);
  });

  $(document).on("click", "#pagination-kitten-head", function() {
    pagination_head = pagination_head - 1;
    pagination_tail = pagination_tail - 1;
    render_dept_pagination_kittens(pagination_length);
  });

  $(document).on("click", "#pagination-kitten", function() {
    var value = parseInt( $(this).prop("class") );

    $("li[id=pagination-kitten]").removeClass("active");
    $(this).addClass("active");

    var this_offset = calculate_pagination_offset(num_row_displayed, value);
    render_dept_rows(num_row_displayed, this_offset);
  });

  var pagination_drop_down_click_counter = 0;
  $(document).on("click", "#row-pagination-count", function() {
    pagination_drop_down_click_counter += 1;
    if (pagination_drop_down_click_counter == 2) {
      var row_displayed = parseInt( $(this).val() );

      // Whenever user changes row # displayed, reset pagination
      pagination_head = 1;
      pagination_tail = 5;

      // get_dept_row_count();

      num_row_displayed = row_displayed;
      offset_result = calculate_pagination_offset(num_row_displayed, current_pagination_page);
      pagination_counter = Math.ceil( dept_row_count / num_row_displayed );

      render_dept_pagination_kittens(pagination_counter);

      render_dept_rows(num_row_displayed, offset_result);

      pagination_drop_down_click_counter = 0;
    }
  });
  // Pagination End

  $("#kitten-searcher").keypress(function(event) {
    if (event.which == 13) {
      var search_key = $(this).val();
      //console.log(search_key);

      $.ajax({
        type: "POST",
        url: site_url + "ajax/department_ajax/ajax_find_department",
        data: {search: search_key},
        beforeSend: function() {
          var current_class = $("#department-search-kitten-yeah").prop("class");
          $("#department-search-kitten-yeah").removeClass(current_class);
          $("#department-search-kitten-yeah").addClass("fa fa-refresh fa-spin");
        },
        success: function(response) {
          //console.log(response);

          var current_class = $("#department-search-kitten-yeah").prop("class");
          $("#department-search-kitten-yeah").removeClass(current_class);
          $("#department-search-kitten-yeah").addClass("fa fa-search");

          $("#department-table-tbody").empty();
          $("#department-table-tbody").append(response);

        }
      });
    }
    
  });

  function searchArray(search_key, select_id, list) {
    $(select_id).html("");

    for (var c = 0 ; c < list.length ; ++c) {
      if ((list[c].toLowerCase()).indexOf(search_key) > -1) {
        $(select_id).append(list[c]);
      }
    }
  }

  function splitResponseToSearchArray(response, container) {
    var data_chunks = response.split("</option>");

    for (var c = 0 ; c < data_chunks.length ; ++c) {
      data_chunks[c] = data_chunks[c] + "</option>";
    }

    return data_chunks;
  }

  // Load Assigned team into respective select field.
  function populateAssignedTeams() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/department_ajax/ajax_search_department_team_by_department_id",
      data: {dept_id: dept_id},
      beforeSend: function() {
        $("#assign-team").prop("disabled", true);

        $("#team-employee-member-search-add-icon").removeClass("fa fa-search");
        $("#team-employee-member-search-add-icon").addClass("fa fa-refresh fa-spin");
      }, 
      success: function(response) {
        $("#team-employee-member-search-add-icon").removeClass("fa fa-refresh fa-spin");
        $("#team-employee-member-search-add-icon").addClass("fa fa-search");

        assigned_team_list = splitResponseToSearchArray(response);
        //console.log(assigned_team_list);

        //console.log(response);
        $("#department-team-list").empty();
        $("#department-team-list").append(response);

        $("#assign-team").prop("disabled", false);
      }
    });
  }

  // Load unassigned teams into respective select field.
  function populateUnassignedTeams() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/department_ajax/ajax_populate_unassigned_teams",
      data: {call_me_maybe: true},
      beforeSend: function() {
        $("#unassign-team").prop("disabled", true);

        $("#team-employee-member-search-remove-icon").removeClass("fa fa-search");
        $("#team-employee-member-search-remove-icon").addClass("fa fa-refresh fa-spin");
      },
      success: function(response) {
        $("#team-employee-member-search-remove-icon").removeClass("fa fa-refresh fa-spin");
        $("#team-employee-member-search-remove-icon").addClass("fa fa-search");

        unassigned_team_list = splitResponseToSearchArray(response);
        //console.log(unassigned_team_list);

        $("#unassigned-team-list").html("");
        $("#unassigned-team-list").append(response);

        $("#unassign-team").prop("disabled", false);
      }
    });
  }

  function unassign_teams() {
    var teams = [];

    $("#department-team-list :selected").each(function(i, selected) {
      teams.push( { team_id: $(selected).prop("id") } );
    });

    $.ajax({
      type: "POST",
      url: site_url + "ajax/department_ajax/ajax_unassign_team",
      data: {data: JSON.stringify(teams, null, 4)},
      beforeSend: function() {
        $("#update-department-icon").removeClass("fa fa-pencil");
        $("#update-department-icon").addClass("fa fa-spinner fa-spin");
      },
      success: function(response) {
        $("#update-department-icon").removeClass("fa fa-spinner fa-spin");
        $("#update-department-icon").addClass("fa fa-pencil");

        populateAssignedTeams();
        populateUnassignedTeams();
        toggleModal("#edit-department-modal", "#dept-team-deassignment");
        //console.log(response);
        //location.reload();
      }
    });
  }

  function assign_teams() {
    var teams = [];

    $("#unassigned-team-list :selected").each(function(i, selected) {
      teams.push( { dept_id: dept_id, team_id: $(selected).prop("id") } );
    });

    $.ajax({
      type: "POST",
      url: site_url + "ajax/department_ajax/ajax_assign_team",
      data: {data: JSON.stringify(teams, null, 4)},
      beforeSend: function() {
        $("#update-department-assign-icon").removeClass("fa fa-pencil");
        $("#update-department-assign-icon").addClass("fa fa-spinner fa-spin");
      },
      success: function(response) {
        $("#update-department-assign-icon").removeClass("fa fa-spinner fa-spin");
        $("#update-department-assign-icon").addClass("fa fa-pencil");

        populateUnassignedTeams();
        populateAssignedTeams();
        toggleModal("#edit-department-modal", "#dept-team-assignment");
        //location.reload();
        //console.log(response);
      }
    });
    //console.log(teams);
  }

  function toggleModal(show, toggle) {
    $(show).modal("show");
    $(toggle).modal("toggle");
  }

  $("#close-view-team-members-modal").click(function() {
    $("#team-member-list-modal").modal("toggle");
    $("#view-dept-teams-modal").modal("show");
    //toggleModal("#team-member-list-modal", "#view-dept-teams-modal");
  });

  $("#action-modal-close").click(function() {
    location.reload();
  });

  // searchArray(search_key, select_id, list)

  $(document).on("keyup", "#team-employee-member-search-unassigned", function() {
    var input = $.trim( $("#team-employee-member-search-unassigned").val() ).toLowerCase();

    searchArray(input, "#unassigned-team-list", unassigned_team_list);
    //console.log(unassigned_team_list);
    //console.log(input + " (unassigned)");
  });

  $(document).on("keyup", "#team-employee-member-search-assigned", function() {
    var input = $.trim( $("#team-employee-member-search-assigned").val() ).toLowerCase();

    searchArray(input, "#department-team-list", assigned_team_list);
    //console.log(assigned_team_list);
    //console.log(input + " (assigned)");
  });

  $(document).on("click", ".view-member-btn", function() {
    var team_id = $(this).prop("id");

    $("#team-tbody").empty();

    $.ajax({
      type: "POST",
      url: site_url + "ajax/department_ajax/ajax_populate_team_member_modal_by_team_id",
      data: {team_id: team_id},
      beforeSend: function() {
        $("#team-member-list-modal-icon").removeClass("fa fa-truck");
        $("#team-member-list-modal-icon").addClass("fa fa-refresh fa-spin");
      },
      success: function(response) {
        $("#team-member-list-modal-icon").removeClass("fa fa-refresh fa-spin");
        $("#team-member-list-modal-icon").addClass("fa fa-truck");

        //console.log(response);
        $("#team-tbody").append(response);
      }
    });

    //console.log(team_id);
    toggleModal("#team-member-list-modal", "#view-dept-teams-modal");
  });

  // Populate dept team listing.
  $(document).on("click", "#view-team", function() {
    var department_info = $(this).prop("class").split(",");
    
    department = $.trim( department_info[0] );
    name = $.trim( department_info[1] );
    dept_id = $.trim( department_info[2] );
    manager_id = $.trim( department_info[3] );

    $.ajax({
      type: "POST",
      url: site_url + "ajax/department_ajax/ajax_populate_dept_team_modal_by_dept_id",
      data: {dept_id: dept_id},
      beforeSend: function() {
        $("#dept-team-tbody").empty();
        
        $("#view-departmen-team-list-icon").removeClass("fa fa-rocket");
        $("#view-departmen-team-list-icon").addClass("fa fa-refresh fa-spin");
      },
      success: function(response) {
        $("#view-departmen-team-list-icon").removeClass("fa fa-refresh fa-spin");
        $("#view-departmen-team-list-icon").addClass("fa fa-rocket");

        $("#dept-team-tbody").empty();
        $("#dept-team-tbody").append(response);
      }
    });
    //$("#dept-team-tbody").append("<tr><td>Test</td><td><button class='btn btn-primary'><i class='fa fa-search'></i></button></td></tr>");

    $("#view-dept-teams-modal").modal("show");
  });

  $(document).on("dblclick", ".dept-team-class", function() {
    //toggleModal("#dept-team-assignment", "#edit-department-modal");
  });

  $(document).on("dblclick", ".unassigned-team-member-class", function() {
    //toggleModal("#dept-team-deassignment", "#edit-department-modal");
  });

  $("#deassign-team-action-confirmation").click(function() {
    unassign_teams();
  });

  $("#assign-team-action-confirmation").click(function() {
    assign_teams();
  });

  $(document).on("click", "#assign-team", function() {
    toggleModal("#dept-team-assignment", "#edit-department-modal");
  });

  $(document).on("click", "#unassign-team", function() {
    toggleModal("#dept-team-deassignment", "#edit-department-modal");
  });

  $("#edit-department-confirmation-action").click(function() {
    $.ajax({
      type: "POST",
      url: site_url + "ajax/department_ajax/ajax_update_department",
      data: {department: department, dept_id: dept_id, manager_id: manager_id},
      beforeSend: function() {
        $("#update-department-icon").removeClass("fa fa-pencil");
        $("#update-department-icon").addClass("fa fa-spinner fa-spin");
      },
      success: function(response) {
        $("#update-department-icon").removeClass("fa fa-spinner fa-spin");
        $("#update-department-icon").addClass("fa fa-pencil");
        
        $("#edit-department-confirmation-dialog").modal("toggle");
        location.reload();
      }
    });
  });

  $("#edit-department-action").click(function() {
    department = $.trim( $("#edit-department-name").val() );
    manager_id = $.trim( $("#edit-team-leader").find(":selected").prop("id") );

    $("#edit-department-modal").modal("toggle");
    $("#edit-department-confirmation-dialog").modal("show");
  });

  $(document).on("click", ".delete-team-modal-delete-button", function(event) {
    $(this).prop("disabled", true);

    var department_id = $(this).prop("id");

    // alert(department_id);

    $.ajax({
      type: "POST",
      url: site_url + "ajax/department_ajax/ajax_delete_department",
      data: {department_id: department_id},
      beforeSend: function() {

      },
      success: function(response) {
        $("tr[id=" + department_id + "]").remove();
        $("#delete-team-confirmation-modal").modal("toggle");
        console.log(response);
      }
    });
  });

  function generateRandomNumber(min, max) {
    if (min < 1) {
      min = 0;
    } if (max < 1) {
      max = 1;
    }
    return Math.floor( (Math.random() * max) + min );
  }

  $(document).on("keyup", "#confirmation-number-input", function(event) {
    var confirmation_number_value = $("#confirmation-number").html();
    var conf_number = $(this).val();

    if (confirmation_number_value == conf_number) {
      $(".delete-team-modal-delete-button").prop("disabled", false);
    } else {
      $(".delete-team-modal-delete-button").prop("disabled", true);
    }
  });

  $(document).on("click", "#delete", function(event) {
    // $(".delete-team-modal-delete-button").prop("disabled", false);

    var department_info = $(this).prop("class").split(",");
    var department_id = $.trim( department_info[2] );

    $("#confirmation-number").html( generateRandomNumber(100000, 999999) );
    $("#confirmation-number-input").val("");

    $(".delete-team-modal-delete-button").prop("id", department_id);

    $("#delete-team-confirmation-modal").modal("show");
  });

  $(document).on("click", "#edit", function() {
    $("#edit-department-modal").modal("show");

    var department_info = $(this).prop("class").split(",");
    
    department = $.trim( department_info[0] );
    name = $.trim( department_info[1] );
    dept_id = $.trim( department_info[2] );
    manager_id = $.trim( department_info[3] );

    //console.log(manager_id + "<-- ");

    populateAssignedTeams();
    populateUnassignedTeams();

    $("#edit-department-name").val(department);
    $("#edit-team-leader").val(name);
  });

  $(".save-department").click(function() {
    $("#add-department-modal").modal("toggle");
    $("#confirmation-department-dialog").modal("show");
  });

  $(".save-department-confirm").click(function() {
    var department_name = $.trim( $("#department_name").val() );
    var team_lead_id = $.trim( $("#team_leader").find(":selected").prop("id") );
    //var team_lead = $.trim( $("#team_leader").val() );

    if (department_name.length >= 5) {
      $.ajax({
        type: "POST",
        url: site_url + "ajax/department_ajax/addDepartment",
        data: {new_dept: department_name, team_lead_id: team_lead_id/*team_lead: team_lead*/},
        success: function(response) {
          $("#confirmation-department-dialog").modal("toggle");
          location.reload();
        }
      });
    }

  });

});