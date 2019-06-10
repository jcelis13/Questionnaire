function loadPosts(fetched_posts, num_posts){
            $.ajax({
                url: globalAppVariables.site_url + "ajax/newsfeed_ajax/load_more",
                type: "POST",
                data: {
                        "ids_fetched": fetched_posts,
                        "num_posts": num_posts
                       },
                success: function (html) {
                    if (html) {
                        $('#tupdate').append(html);
                        $('a.comment_upload').each(function (e) {
                            console.log($(this));
                            uploadPhotoComment($(this));
                        });
                        $('#Spinner').hide();
                    } else {
                        // extension is not allowed
                        $("#newsfeed_admin_modal").find('.modal-body').html('<i class="fa fa-thumbs-o-down"></i> No more posts to show.');
                        $("#newsfeed_admin_modal").modal('show');
                        $('#delete-post').hide(); $('#unpin-post').hide();
                        return false;
                    }
                }
            });

}

function uploadPhotoComment(btnPhotoComment) {
    new AjaxUpload(btnPhotoComment, {
        action: globalAppVariables.site_url + "ajax/newsfeed_ajax/upload_image",
        name: 'uploadfile',
        onSubmit: function (file, ext) {
            if (!(ext && /^(jpg|jpeg|gif|png)$/.test(ext))) {
                // extension is not allowed
                $("#newsfeed_admin_modal").find('.modal-body').html('<i class="fa fa-thumbs-o-down"></i> Only JPG or GIF files are allowed');
                $("#newsfeed_admin_modal").modal('show');
                $('#delete-post').hide(); $('#unpin-post').hide();
                return false;
            }
            var status = $('#uploadStat-' + btnPhotoComment.parent().parent().find('input[name=ac_form_submit]').attr('title'));
            status.text('Uploading...');
        },
        onComplete: function (file, response) {
            //On completion clear the status
            var comment_form = btnPhotoComment.parent().parent();
            var status = $('#uploadStat-' + comment_form.find('input[name=ac_form_submit]').attr('title'));
            var parent_id = btnPhotoComment.attr('rel');

            status.text('');

            var upPhoto = response.split('.');
            //Add uploaded file to list
            if (upPhoto[1] != "jpeg") {
                $("#newsfeed_admin_modal").find('.modal-body').html("Something went wrong with the upload");
                $("#newsfeed_admin_modal").modal('show');
                $('#delete-post').hide(); $('#unpin-post').hide();
                console.log('Upload ERROR');
            } else {
                console.log('Upload SUCCESS');
                comment_form.find('input[name=act_photo]').val(response);
                console.log(comment_form.find('input[name=act_photo]'));
                console.log('#pic_comment_'.parent_id);
                comment_form.find('div.live_photo_comment').html('<img src="' + globalAppVariables.site_url + 'uploads/' + response + '" width="20%">');
            }
        }
    });


}



jQuery(document).ready(function () {

    $('#load_more_posts').on("click", function () {
        $spinner.show();
        var fetched_posts = [];
        var listItems = $("#tupdate > li");
        listItems.each(function (idx, li) {
            var post = $(li);
            fetched_posts.push($(li).attr("rel"));
        });
        loadPosts(fetched_posts, 1);
    });

    $('body').on( "change", "#post_status_select", function () {
       var status_selected = $('#post_status_select').val();
       window.location.href = site_url + 'newsfeed/manager/' + status_selected;
      
    });

    $('#newsfeed_posts').bind('submit', function (event) {
        return false;
    });

    $('.btn_view_post').on("click", function () {
        var rowid = $(this).data('id');
        var action = $(this).attr('data-action');
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/show_post',
            data: { id: rowid, action: action },
            success: function (data) {
                $("#view_post_title").html(data);
                $('#view-post-modal').modal('show');
            }

        });
    });

    //---------------------------Edit----------------------------------------------//

    $('.btn_edit_post').on("click", function () {
        var rowid = $(this).data('id');
        var action = $(this).attr('data-action');
        var post_content = $('td#post-' + rowid).text();

        $("#post-txt-edit").val(post_content);
        $("#modify_post").attr('data-id', rowid);
        $('#edit-post-modal').modal('show');
           
    });

    $('#modify_post').on("click", function () {
        var rowid = $(this).data('id');

        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/modify_post',
            data: { id: rowid, content: $("#post-txt-edit").val() },
            success: function (data) {
                window.location.href = site_url + 'newsfeed/my_pending_posts';
            }

        });

    });

    //--------------------------Approve-------------------------------------------//

    $('.btn_approve_post').on("click", function () {
        var rowid = $(this).data('id');
        $('#approve_post_btn').data('id', rowid);
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/show_post',
            data: { id: rowid },
            success: function (data) {
                $("#approve_post_title").html(data);
                $('#approve-post-modal').modal('show');
            }

        });
    });


    $('#approve_post_btn').click(function () {
        var rowid = $('#approve_post_btn').data('id');
        var checked = [];
        checked.push(rowid);
        var selected_company = $('#approve-post-modal').find('#company_select').val();
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/approve_posts',
            data: { selected_ids: checked, company_id: selected_company},
            success: function (data) {
                window.location.href = site_url + 'newsfeed/manager';

            }
        });
    });


    $('#approve_post_mul').click(function () {
        $("#approve_selected_post_btn").show();
        var form = document.getElementById('newsfeed_posts');
        var chks = form.querySelectorAll('input[type="checkbox"]');
        var count = 0;
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked)
                count++;
        }
        if (count == 0) {
            $("#approve_count").text("No post selected");
            $("#approve_selected_post_btn").hide();
        }
        else
            $("#approve_count").html("<h5 >"+count + " post(s) selected</h5>");
    });


    $('#approve_selected_post_btn').click(function () {
        var form = document.getElementById('newsfeed_posts');
        var chks = form.querySelectorAll('input[type="checkbox"]');
        var checked = [];
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
                checked.push(chks[i].value);
            }
        }
        var selected_company = $('#approve-selected-post-modal').find('#company_select').val();
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/approve_posts',
            data: { selected_ids: checked, company_id: selected_company },
            success: function (data) {
                window.location.href = site_url + 'newsfeed/manager';

            }
        });


    });

    //-------------------------- Pin / Unpin -------------------------------------------//

    $('.btn_pin_post').on("click", function () {
        var rowid = $(this).data('id');
        $('#pin_post_btn').data('id', rowid);
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/show_post',
            data: { id: rowid },
            success: function (data) {
                $("#pin_post_title").html(data);
                $('#pin-post-modal').modal('show');
            }

        });
    });

    $('#pin_post_btn').click(function () {
        var rowid = $('#pin_post_btn').data('id');
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/pin_post',
            data: { pid: rowid },
            success: function (data) {
                location.reload();
            }
        });
    });

    $('.btn_unpin_post').on("click", function () {
        var rowid = $(this).data('id');
        $('#unpin_post_btn').data('id', rowid);
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/show_post',
            data: { id: rowid },
            success: function (data) {
                $("#unpin_post_title").html(data);
                $('#unpin-post-modal').modal('show');
            }
        });
    });

    $('#unpin_post_btn').click(function () {
        var rowid = $('#unpin_post_btn').data('id');
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/unpin_post',
            data: { pid: rowid },
            success: function (data) {
                location.reload();
            }
        });
    });

    //-------------------------DELETE-------------------------------------------//

    $('.btn_delete_post').on("click", function () {
        var rowid = $(this).data('id');
        $('#delete_post_btn').data('id', rowid);
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/show_post',
            data: { id: rowid },
            success: function (data) {
                console.log(data);
                $("#delete_post_title").html(data);
                $('#delete-post-modal').modal('show');
            }

        });
    });


    $('#delete_post_btn').click(function () {
        var rowid = $('#delete_post_btn').data('id');
        var checked = [];
        checked.push(rowid);
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/delete_posts',
            data: { selected_ids: checked },
            success: function (data) {
                window.location.href = site_url + 'newsfeed/' + $('#delete_post_btn').attr('data-location') ;
             //   console.log(site_url + 'newsfeed/' + $('#delete_post_btn').attr('data-location'));
            }
        });
    });


    $('#delete_post_mul').click(function () {
        $("#delete_selected_post_btn").show();
        var form = document.getElementById('newsfeed_posts');
        var chks = form.querySelectorAll('input[type="checkbox"]');
        var count = 0;
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked)
                count++;
        }
        if (count == 0) {
            $("#delete_count").text("No post selected");
            $("#delete_selected_post_btn").hide();
        }
        else {
            $("#delete_count").html("<h5 >"+count + " post(s) selected</h5>");
        }
            
    });


    $('#delete_selected_post_btn').on("click", function () {
        var form = document.getElementById('newsfeed_posts');
        var chks = form.querySelectorAll('input[type="checkbox"]');
        var checked = [];
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
                checked.push(chks[i].value);
            }
        }
        console.log(checked);
        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/delete_posts',
            data: { selected_ids: checked },
            success: function (data) {
                console.log("deleted");
                window.location.href = site_url + 'newsfeed/manager';

            }
        });

    });

    $('body').on("click", ".btn-vote", function () {
        console.log("VOTING!");
        var close_date = $(this).attr('data-poll-close');
        console.log(close_date);
        var details = $(this).attr('data-poll-option').split('-');
        console.log(details);

        $.ajax({
            type: "POST",
            url: site_url + 'ajax/newsfeed_ajax/vote_poll',
            data: { poll_id: details[0], option_id: details[1], date_poll_closed: close_date },
            success: function (data) {
                var response = $.parseJSON(data);
                if (response.result) {
                    $('#post-' + details[0]).find('div.options').html(response.html);
                } else {
                    $("#newsfeed_admin_modal").find('.modal-body').html(response.html);
                    $("#newsfeed_admin_modal").modal('show');
                    $("#unpin-post").hide();
                    $("#delete-post").hide();
                }
            }
        });
    });

});