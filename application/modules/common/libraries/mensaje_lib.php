<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Mensaje_lib {

	public $msg = [];

    protected $table_name = 'mensaje';
    
    public function __construct() {
        $this->ci = & get_instance();
    }

    public function select_x_id($id){
        $query = (array)$this->ci->generic_model->get_by_id($this->table_name, $id, $fields = '*', $id_column_name = 'msg_id');
        print_r($query);echo '<br>';
        array_push($query, $this->msg);
        //print_r($this->msg);echo '<br>';
        return $this->msg;
    }
}