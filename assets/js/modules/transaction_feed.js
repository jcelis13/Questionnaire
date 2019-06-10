$(document).ready(function() {

  var TransactionFeedApp = {};

  TransactionFeedApp.runApp = function() {
    TransactionFeedApp.startEventControllers();
  };

  TransactionFeedApp.updateMarkAsReadFlag = function(transaction_id, self) {
    $.ajax({
      type: "POST",
      url: globalAppVariables.site_url + "ajax/admin_dashboard_ajax/ajax_update_transaction_visibility",
      data: {
        transaction_id: transaction_id
      },
      beforeSend: function() {
        self.prop('disabled', true);
        $('#marker-' + transaction_id).removeClass('fa fa-circle-o').addClass('fa fa-spinner fa-pulse');
      },
      success: function(response) {
        self.parent().closest('div').attr('class', '.post').fadeOut('slow');

        if (! $('.post').length) {
          $('#transaction-feed-panel').fadeOut('slow');
        }
      }
    });
  }

  TransactionFeedApp.startEventControllers = function() {
    TransactionFeedApp.eventController('click', '#mark-as-read', function(event) {
      event.isDefaultPrevented();

      var transaction_id = $(this).attr('data-transaction-id');
      var self = $(this);

      TransactionFeedApp.updateMarkAsReadFlag(transaction_id, self);
    });
  }

  TransactionFeedApp.eventController = function(domAction, target, eventFunction) {
    $(document).on(domAction, target, eventFunction);
  }

  TransactionFeedApp.runApp();

});