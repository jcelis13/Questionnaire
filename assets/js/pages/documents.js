$(document).ready(function() {

  CKEDITOR.replace('content');
  CKEDITOR.replace('content_view');
  CKEDITOR.replace('content_edit');
  
  $('body').tooltip({
        selector: "[data-tooltip=tooltip]",
        container: "body"
  });
  
  $('.docs_year').change(function(){
  
    filter_date();
  
  });
  
  $('.docs_month').change(function(){
  
    filter_date();
  
  });
  
  

  //$("table.documents-table").on("click", "button#unlock", function(){
  $("#add-document-dialog .btn-primary").click(function(){

    var title; //document title
    var content; //document content
    var creator; //document creator
    var err = "";
    
    title = $('#add-document-dialog .title').val();
    creator = $('#add-document-dialog .creator').val();
    content = CKEDITOR.instances.content.getData();
    
    
		if (!title) 			err += '<p>Title must not be blank.</p>';
		if (!content) 	err += '<p>Content should not be blank.</p>';
		$(".add_notification").html(err);
    
    if(title && content){
      //AJAX
      $.ajax({
        type: "POST",
        url: site_url + 'index.php/ajax/documents_ajax/add_document',
        data: {title:title, content:content, creator:creator}, 
        success:function(data) {window.location.href= site_url + 'documents/documents_list'}
      });
      //END AJAX
    }
  });
  
  $("#add-document-dialog .btn-danger").click(function(){

    CKEDITOR.instances['content'].setData('');
    $("#add-document-dialog .title").val("");
    $(".add_notification .title").val("");
    
  });
  
  $(".documents-table").on("click", "button.document-view",function(){
    $('#preloader').show();
    
    var d_id = $(this).attr('data-document-id'); //document id
    $('table.document_revisions tbody').empty();
    //AJAX
    $.ajax({
      type: "POST",
			url: site_url + 'index.php/ajax/documents_ajax/view_document',
			data: {d_id:d_id}, 
			success:function(data) {
        var document_details = $.parseJSON(data);
        CKEDITOR.instances['content_view'].setData(document_details.content);
        CKEDITOR.instances['content_view'].setReadOnly(true);
        $('#view-document-dialog .title').val(document_details.title);
        console.log(document_details.content);
        $('#preloader').hide();
      }
    });
    //END AJAX
  
  });
  
  
  
  $("#view-document-dialog .btn-danger").click(function(){

    CKEDITOR.instances['content_view'].setData('');
    $("#view-document-dialog .title").val("");
  });
  
  $(".documents-table").on("click", "button.document-edit",function(){
    $('#preloader').show();
    var d_id = $(this).attr('data-document-id'); //document id
    
    //AJAX
    // VIEW FIRST
    $.ajax({
      type: "POST",
			url: site_url + 'index.php/ajax/documents_ajax/view_document',
			data: {d_id:d_id}, 
			success:function(data) {
        var document_details = $.parseJSON(data);
        CKEDITOR.instances['content_edit'].setData(document_details.content);
        $('#edit-document-dialog .title').val(document_details.title);
        $('#edit-document-dialog .document_id').val(d_id);
        console.log(document_details.content);
        $('#preloader').hide();
      }
    });

    //END AJAX
  
  });
  
  $("#edit-document-dialog .btn-primary").click(function(){
    $('#preloader').show();
    var d_id = $('#edit-document-dialog .document_id').val(); //document id
    var title = $('#edit-document-dialog .title').val();
    var content = CKEDITOR.instances.content_edit.getData();
    var creator = $('#edit-document-dialog .creator').val();
    
    //EDIT
    $.ajax({
      type: "POST",
			url: site_url + 'index.php/ajax/documents_ajax/edit_document',
			data: {d_id:d_id, title:title, content:content, creator:creator}, 
      success:function(data) {
      window.location.href= site_url + 'documents/documents_list'
      }
    });
  
  });
  
  $("#edit-document-dialog .btn-danger").click(function(){

    CKEDITOR.instances['content_edit'].setData('');
    $("#edit-document-dialog .title").val("");
    $("#edit-document-dialog .document_id").val("");
  });
  
  
  $(".documents-table").on("click", "button.document-delete",function(){
    $('#preloader').show();
    var d_id = $(this).attr('data-document-id'); //document id
    $.ajax({
      type: "POST",
			url: site_url + 'index.php/ajax/documents_ajax/view_document',
			data: {d_id:d_id}, 
			success:function(data) {
        var document_details = $.parseJSON(data);
        $('#delete-document-dialog .delete_message b span').text(document_details.title);
        $('#preloader').hide();
      }
    });
  
  });
  
  $("#delete-document-dialog .btn-danger").click(function(){
    
    $("#delete-document-dialog .delete_message b span").text("");
  });
  
  $(".documents-table").on("click", "button.document-view-revision",function(){
    $('#preloader').show();
    
    var d_id = $(this).attr('data-document-id');
    
    $.ajax({
      type: "POST",
      url: site_url + 'index.php/ajax/documents_ajax/load_document_revisions',
      data: {d_id:d_id}, 
      success:function(data) {
        var document_revision_list = $.parseJSON(data);
        $('table.document_revisions tbody').empty();
        var res = '';
        
        for(var i = 0; i < document_revision_list.length; i++){
        
          res = res + '<tr>' +
                          '<td>' + document_revision_list[i].title + '</td>' +
                          '<td>' + document_revision_list[i].full_name + '</td>' +
                          '<td>' + document_revision_list[i].date_edited +'</td>' +
                          '<td><button class="fa fa-eye document-view btn btn-success "  data-toggle="modal" data-target="#view-document-dialog" data-placement="right" data-tooltip="tooltip" title="View Document" data-document-id="' + document_revision_list[i].d_id + '"></button></td>' +
                      '</tr>';
            
          
          
        }// for
        $('.document_revisions thead').after('<tbody>' + res + '</tbody>');
          
          $('#preloader').hide();
      }
    });
    
    
    
  });
  
  function filter_date(){
  
    var year_id = $('.docs_year').val();
    var month_id = $('.docs_month').val();
    var user_role = $('.user_role').val();
    
    $.ajax({
      type: 'POST',
      url: site_url + 'index.php/ajax/documents_ajax/load_documents_with_filter',
      data: {month_id:month_id, year_id:year_id},
      success:function(data){
      
        
        var document_list = $.parseJSON(data);

        $('table.documents-table tbody').empty();
        
        var res = '';
        var button_list = '';
        for(var i = 0; i<document_list.length; i++){
        
          button_list = '';
        
          button_list = button_list + '<button class="fa fa-eye document-view btn btn-success "  data-toggle="modal" data-target="#view-document-dialog" data-placement="right" data-tooltip="tooltip" title="View Document" data-document-id="' + document_list[i].d_id + '"></button>' + 
          '<button class="fa fa-file-text-o document-view-revision btn btn-info " data-tooltip="tooltip" data-placement="right" title="View Revisions" data-document-id="' + document_list[i].d_id + '"></button>';
          
          if(user_role == "superadmin"){
          
          button_list = button_list +
          '<!-- for ADMIN only -->' +
          '<button class="fa fa-edit document-edit btn btn-warning " data-tooltip="tooltip" data-placement="right" title="Edit Document" data-toggle="modal" data-target="#edit-document-dialog" data-document-id="' + document_list[i].d_id + '"></button>' +
                                                '<button class="fa fa-trash-o document-delete btn btn-danger "  data-tooltip="tooltip" data-placement="right" title="Delete Document" data-toggle="modal" data-target="#delete-document-dialog" data-document-id="' + document_list[i].d_id + '"></button>'+
          '<!-- END for ADMIN only -->';
          }
          
          res = res + '<tr>' +
                        '<td>' + document_list[i].title + '</td>' +
                        '<td>' + document_list[i].fullname + '</td>' +
                        '<td>' + document_list[i].date_created +'</td>' +
                        '<td>' +
                                              '<div class="btn-group">' +

                                        button_list        
                                                
                                                
                                              + '</div>' +
                                            '</td>' +
                      '</tr>';
        }
          
        $('.documents-table thead').after('<tbody>' + res + '</tbody>');
      }
    });
  
  }
  
});