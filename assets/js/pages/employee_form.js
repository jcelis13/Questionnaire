$(document).ready(function() {
  $('#personal_info').tab('show');
  $('a[href="#personal_info"]').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
  $('a[href="#work_info"]').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
});