<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Index extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
	}

	public function index() {
		$usuario = $this->input->post('usuario');
		$clave = $this->input->post('clave');
		$where_data = array('u.user'=>$usuario, 'u.pwd'=>$clave, 'u.tipo'=>4);
		$join_clause[0] = array('table'=>'contadora c','condition'=>"c.user_id = u.id");
        $query = $this->generic_model->get_join('usuario u', $where_data, $join_clause, $fields = 'c.*');
		if($query){
			$send['usuario'] = $query[0];
			$user = array(
							'cont_id' => $query[0]->cont_id, 
							'user_id' => $query[0]->user_id,
							'cont_ruc' => $query[0]->cont_ruc,
							'cont_nombres' => $query[0]->cont_nombres,
							'cont_apellidos' => $query[0]->cont_apellidos,
							'cont_email' => $query[0]->cont_email,
						);
			$this->session->set_userdata($user);
			$this->load->view('index', $send);
		}else{
			redirect('welcome/index', 'refresh');
		}
    }

	public function save() {
		redirect('login/index', 'refresh');
		/*$ruc = $this->input->post('ruc');
		print_r($ruc);*/
	}
}