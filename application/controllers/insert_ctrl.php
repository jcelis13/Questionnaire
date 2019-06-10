<?php

class insert_ctrl extends CI_Controller {

function __construct() {
parent::__construct();
$this->load->database();
 $this->load->helper('url');
$this->load->model('insert_model');
}
public function index() {
//Including validation library
$this->load->library('form_validation');

$this->form_validation->set_error_delimiters('<div class="error">', '</div>');

//Validating Name Field
$this->form_validation->set_rules('dname', 'Username', 'required|max_length[15]');

//Validating Email Field
$this->form_validation->set_rules('demail', 'Email', 'required|valid_email');

//Validating Mobile no. Field
$this->form_validation->set_rules('dmobile', 'Mobile No.', 'required|regex_match[/^[0-9]{11}$/]');

//Validating Address Field
$this->form_validation->set_rules('daddress', 'Address', 'required|max_length[50]');

if ($this->form_validation->run() === FALSE) {
		 $result['data']=$this->insert_model->get_record();
 		 $this->load->view('insert_view', $result);

} else {
//Setting values for tabel columns
$data = array(
'Student_Name' => $this->input->post('dname'),
'Student_Email' => $this->input->post('demail'),
'Student_Mobile' => $this->input->post('dmobile'),
'Student_Address' => $this->input->post('daddress')
);
//Transfering data to Model
$this->insert_model->form_insert($data);
$data['message'] = 'Data Inserted Successfully';
$this->load->view('insert_view', $data);
//Loading View

}
}
public function view(){
		 $result['data']=$this->insert_model->get_record();
 		 $this->load->view('insert_view', $result);
 }
/*function show_student_id() {
$id = $this->uri->segment(3);
$data['students'] = $this->insert_model->show_students();
$data['single_student'] = $this->insert_model->show_student_id($id);
$this->load->view('update_view', $data);
}
*/
}

?>