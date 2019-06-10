typeAhead = {};

typeAhead.clickedUserid = 0;
typeAhead.clickedName = '';
typeAhead.onClickFunc = null;
typeAhead.ajaxTargetUrl = 'ajax/public_profile_ajax/get_names';

/**
 * @param {string} url
 */

typeAhead.changeAjaxTargetUrl = function(url) {
  typeAhead.ajaxTargetUrl = url;
};

/**
 * @param {function} func
 */

typeAhead.setOnClickAction = function(func) {
  typeAhead.onClickFunc = func;
};

/**
 * @param none
 */

typeAhead.getClickedname = function() {
  return typeAhead.clickedName;
};

/**
 * @param none
 */

typeAhead.init = function() {
  typeAhead.clickedUserid = 0;
};

/**
 * @param none
 */

typeAhead.getClickeduserid = function() {
  return typeAhead.clickedUserid;
};

/**
 * @param none
 */

typeAhead.typeAheadaction = function(item, val, text) {
  typeAhead.clickedUserid = val;
  typeAhead.clickedName = text;
  typeAhead.onClickFunc(text.split(',')[0], val, text);
};

/**
 * @param {string} str
 */

typeAhead.toTitlecase = function(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

/**
 * @param {string} base_url
 * @param {string} ref
 */

typeAhead.initTypeahead = function(base_url, ref) {
  $.ajax({
    type: 'POST',
    url: base_url + typeAhead.ajaxTargetUrl,
    beforeSend: function() {
      $(ref).prop('disabled', true);
    },
    success: function(response) {
      $(ref).prop('disabled', false);

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
              capitalized_name += typeAhead.toTitlecase(name_split[c]) + ' ';
            }
          }

          names.push({
            id: value['user_id'],
            name: value['last_name'] + ", " + capitalized_name 
          });
        });

        $(ref).typeahead({
          source: names,
          itemSelected: typeAhead.typeAheadaction,
          items: 10
        });
      }  
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if (textStatus === 'timeout') {
        alert('Server timeout.');
      } else {
        alert(textStatus);
      }
    }
  });
}

// Class osnetApp

function osnetApp() {
  this.ajaxLoaderModel = {};
  this.ajaxLoaderModel.ajaxLoaderRef = null;

  /**
 * @param {string} ref
 */

  this.setAjaxloaderref = function(ref) {
    this.ajaxLoaderModel.ajaxLoaderRef = ref;
  };

  /**
 * @param none
 */

  this.hideAjaxloader = function() {
    $(this.ajaxLoaderModel.ajaxLoaderRef).html('').css('display', 'none');
  };

  /**
 * @param {string} message
 */

  this.showAjaxloader = function(message) {
    $(this.ajaxLoaderModel.ajaxLoaderRef).each(function(index, value) {
      $(this).html('<i class="fa fa-spinner fa-pulse"></i>' + " " + message).css('display', 'initial');
    });
  };

  // Modal Model
  this.modalModel = {};
  this.modalModel.currentActivemodal = null;
  this.modalModel.lastActivemodal = null;
  this.modalModel.editId = null;
  this.modalModel.deleteId = null;

  /**
 * @param none
 */

  this.getEditid = function() {
    return this.modalModel.editId;
  };

  /**
 * @param none
 */

  this.getDeleteid = function() {
    return this.modalModel.deleteId;
  };

  /**
 * @param {int} id
 */

  this.setEditid = function(id) {
    this.modalModel.editId = id;
  };

  /**
 * @param {int} id
 */

  this.setDeleteid = function(id) {
    this.modalModel.deleteId = id;
  };

  /**
 * @param {object} modalInfo
 */

  this.showNotificationmodal = function(modalInfo) {
    this.closeModal();
    $(modalInfo.titleRef).html(modalInfo.title);
    $(modalInfo.messageRef).html(modalInfo.message);
    this.openModal(modalInfo.ref);
  };

  /**
 * @param {string} ref
 */

  this.openModal = function(ref) {
    this.setCurrentactivemodal(ref);
    $(ref).modal('show');
  };

  /**
 * @param none
 */

  this.closeModal = function() {
    $(this.modalModel.currentActivemodal).modal('hide');
  };

  /**
 * @param {string} ref
 */

  this.setCurrentactivemodal = function(ref) {
    this.modalModel.lastActivemodal = this.modalModel.currentActivemodal;
    this.modalModel.currentActivemodal = ref;
  };

  // DataTable Model
  this.datatableModel = {};
  this.datatableModel.datatable = null;
  this.datatableModel.rowLastclicked = null;

  /**
 * @param none
 */

  this.clearDataTable = function() {
    this.datatableModel.datatable.clear().draw();
  };

  /**
 * @param {string} ref
 */

  this.setRowlastclicked = function(ref) {
    this.datatableModel.rowLastclicked = ref;
  };

  /**
 * @param {object} objectArray
 */

  this.insertRow = function(objectArray) {
    this.datatableModel.datatable.row.add(objectArray).draw();
  };

  /**
 * @param none
 */

  this.deleteClickedrow = function() {
    this.datatableModel.datatable.row(this.datatableModel.rowLastclicked).remove().draw(false);
  };

  /**
 * @param none
 */

  this.getDatatable = function() {
    return this.datatableModel.datatable;
  };

  /**
 * @param {string} ref
 */

  this.initializeDataTable = function(ref) {
    this.datatableModel.datatable = $(ref).DataTable({
      "pagingType": "full_numbers",
      "paging":   true,
      "bFilter": true,
      responsive: true
    });
  };

  // App Core
  this.coreModel = {};
  this.coreModel.base_url = null;

  /**
 * @param {string} str
 */

  this.isJson = function(str) {
    try {
      JSON.parse(str);
    } catch(e) {
      return false;
    }
    return true;
  };

  /**
 * @param none
 */

  this.getBaseurl = function() {
    return this.coreModel.base_url;
  };

  /**
 * @param {string} base_url
 */

  this.setBaseUrl = function(base_url) {
    this.coreModel.base_url = base_url;
  };

  /**
 * @param {string} type
 * @param {string} url
 * @param {object} dependencies
 */

  this.ajaxRequest = function(type, url, dependencies) {
    $.ajax({
      type: type,
      url: this.coreModel.base_url + url,
      data: dependencies.ajax_data,
      beforeSend: dependencies.ajax_beforesend,
      success: dependencies.ajax_success,
      error: function(jqXHR, textStatus, errorThrown) {
        if (textStatus === 'timeout') {
          alert('Server timeout.');
        } else {
         alert(textStatus);
        }
      }
    });
  };

  /**
 * @param {string} base_url
 */

  this.initializeApp = function(initObject) {
    this.setBaseUrl(initObject.base_url);  
    this.setAjaxloaderref(initObject.loaderRef);
    this.initializeDataTable(initObject.tableRef);
  };

  /**
 * @param {string} ref
 */

  this.resetForm = function(ref) {
    $(ref).trigger('reset');
  };

  // DOM Controller

  /**
 * @param {string} action
 * @param {string} ref
 * @param {function} func
 */

  this.eventHandler = function(action, ref, func) {
    $(document).on(action, ref, function(event) {
      event.isDefaultPrevented();
      func(); return false;
      event.preventDefault();
    });
  };

};