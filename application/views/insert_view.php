<html>
<head>
<title>Insert Data Into Database Using CodeIgniter Form</title>
<style>
#container {
width:700px;
height:600px;
margin:5px;
}

.error {
color:red;
font-size:13px;
margin-bottom:-15px
}
form {
width:800px;
padding:0 50px 20px;
background: #ff751a;
border:1px solid #ccc;
box-shadow:0 0 5px;
font-family:'Marcellus',serif;
margin-left: 300px;
margin-top:10px
}
h1 {
text-align:center;
font-size:28px
}
hr {
border:0;
border-bottom:1.5px solid #ccc;
margin-top:-10px;
margin-bottom:30px
}
label {
font-size:17px
}
input {
width:100%;
padding:10px;
margin:6px 0 20px;
border:none;
box-shadow:0 0 5px
}
input#submit {
margin-top:20px;
font-size:18px;
background:linear-gradient(#22abe9 5%,#36caf0 100%);
border:1px solid #0F799E;
color:#fff;
font-weight:700;
cursor:pointer;
text-shadow:0 1px 0 #13506D
}
input#submit:hover {
background:linear-gradient(#36caf0 5%,#22abe9 100%)
}	


</style>
<link href='http://fonts.googleapis.com/css?family=Marcellus' rel='stylesheet' type='text/css'/>

<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

</head>
<body>
<br>

<div id="container">
<?php echo form_open('insert_ctrl'); ?>
<div class="row">
<div class="col-sm-3">
	<br><br><br><br><br>
	<p>LIST OF STUDENTS:</p>
	

	<?php foreach ($data as $news_item): ?>	

		<h3><?php echo $news_item['Student_Name']  ?></h3>
	<?php endforeach ?>
 

</div>
<div class="col-sm-9">
<h1>Insert Data Into Database Using CodeIgniter</h1><hr/>
<?php if (isset($message)) { ?>
<CENTER><h3 style="color:green;">Data inserted successfully</h3></CENTER><br>
<?php } ?>

<?php echo form_label('Student Name :'); ?> <?php echo form_error('dname'); ?><br />
<?php echo form_input(array('id' => 'dname', 'name' => 'dname')); ?><br />

<?php echo form_label('Student Email :'); ?> <?php echo form_error('demail'); ?><br />
<?php echo form_input(array('id' => 'demail', 'name' => 'demail')); ?><br />

<?php echo form_label('Student Mobile No. :'); ?> <?php echo form_error('dmobile'); ?><br />
<?php echo form_input(array('id' => 'dmobile', 'name' => 'dmobile', 'placeholder' => '11 Digit Mobile No.')); ?><br />

<?php echo form_label('Student Address :'); ?> <?php echo form_error('daddress'); ?><br />
<?php echo form_input(array('id' => 'daddress', 'name' => 'daddress')); ?><br />
</div>
<div class="row">
</div>
<div class="col-sm-4"><?php echo form_submit(array('id' => 'submit', 'value' => 'Add' )); ?></div>
<div class="col-sm-4"><?php echo form_submit(array('id' => 'submit', 'value' => 'Update' )); ?></div>
<div class="col-sm-4"><?php echo form_submit(array('id' => 'submit', 'value' => 'Delete' )); ?></div>
</div>
<?php echo form_close(); ?><br/>
<div id="fugo">

</div>


</div>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>
</html>