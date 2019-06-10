// Variables
var base_url = "http://awesomeos.org/";

// Functions
function showAJAXLoader(target) {
  $(target).css("visibility", "visible");
}

function hideAJAXLoader(target) {
  $(target).css("visibility", "hidden");
}

function ajax_populate_employee_table(dept_id, limit) {
  $.ajax({
    type: "POST",
    url: base_url + "ajax/password_manager_ajax/ajax_populate_employee_table",
    data: {dept_id: dept_id, limit: limit},
    beforeSend: function() {
      showAJAXLoader("#dropdown-result-loading-notification");
    },
    success: function(table_row) {
      hideAJAXLoader("#dropdown-result-loading-notification");

      $("#password-manager-employee-table").empty();
      $("#password-manager-employee-table").append(table_row);
    }
  });
}

function ajax_search_employee_name(name) {
  $.ajax({
    type: "POST",
    url: base_url + "ajax/password_manager_ajax/ajax_search_employee_name",
    data: {name: name},
    beforeSend: function() {
      showAJAXLoader("#name-search-loader");
    },
    success: function(table_row) {
      hideAJAXLoader("#name-search-loader");
      
      $("#password-manager-employee-table").empty();
      $("#password-manager-employee-table").append(table_row);
    }
  });
}

$(document).ready(function() {

  // Event Handlers
  $("#department-list-dropdown").on("change", function(event) {
    var dept_id = parseInt( $.trim( $(this).find(":selected").attr("id") ) );
    var limit = parseInt( $.trim( $("#department-list-dropdown-limit").find(":selected").attr("id") ) );

    ajax_populate_employee_table(dept_id, limit);
  });

  $("#department-list-dropdown-limit").on("change", function(event) {
    var dept_id = parseInt( $.trim( $("#department-list-dropdown").find(":selected").attr("id") ) );
    var limit = parseInt( $.trim( $(this).find(":selected").attr("id") ) );

    ajax_populate_employee_table(dept_id, limit);
  });

  $("#search-employee-btn").on("click", function(event) {
    var name_search_key = $("#employee-search-input").val();

    ajax_search_employee_name(name_search_key);
  });

});