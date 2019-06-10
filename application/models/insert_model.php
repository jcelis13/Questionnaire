<?php
class insert_model extends CI_Model{
function __construct() {
parent::__construct();
 $this->load->helper('url'); 
  $this->load->database(); 
}

public function form_insert($data){
// Inserting in Table(students) of Database(college)
$this->db->insert('students', $data);
}
public function get_record(){

	$query=$this->db->query("select * from students");
 	return $query->result_array();
}
/*function show_students(){
$query = $this->db->get('students');
$query_result = $query->result();
return $query_result;
}*/
/*function show_student_id($data){
$this->db->select('*');
$this->db->from('students');
$this->db->where('student_id', $data);
$query = $this->db->get();
$result = $query->result();
return $result;
}*/
}
?>