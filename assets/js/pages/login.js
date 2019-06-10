$( function() {
  $('.login-page').mousemove(function(e){
    var x = -(e.pageX + this.offsetLeft) / 100;
    var y = -(e.pageY + this.offsetTop) / 100;
    $(this).css('background-position', x + 'px ' + y + 'px');
  }); 

  $('.btn-primary').click(function(){

		var username = $.trim( $('input[name="username"]').val());


		if(username){
			$.ajax({
				type: "POST",
				url: site_url + 'index.php/ajax/login_ajax/update_login',
				data: {username:username}, 
				success:function(data) {}
			});
		}

	});
  
});