<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	public function index()
	{
		if($this->session->userdata('userid'))
   		{
			$this->load->view('index');
		}else{
			$this->load->view('main');
		}
	}

	public function logout()
	{
		$this->session->sess_destroy();
		redirect('', 'refresh');
	}

	public function load_login()
	{
		$this->load->view('login');
	}

	public function load_main()
	{
		$this->load->view('index');
	}

	public function load_admin_clientes()
	{
		$this->load->view('login/admin_empresa');
	}

	public function verificar_usuario()
	{
		$data = json_decode(file_get_contents("php://input"));
		$usuario = $data->nombre;
		$clave = $data->clave;
		$where_data = array('u.user'=>$usuario, 'u.pwd'=>$clave, 'u.tipo'=>4);
		$join_clause[0] = array('table'=>'contadora c','condition'=>"c.user_id = u.id");
        $query = $this->generic_model->get_join('usuario u', $where_data, $join_clause, $fields = 'c.*');
		if($query){
			$send['usuario'] = $query[0];
			$user = array(
							'id' => $query[0]->cont_id, 
							'user_id' => $query[0]->user_id,
							'ruc' => $query[0]->cont_ruc,
							'nombres' => $query[0]->cont_nombres,
							'apellidos' => $query[0]->cont_apellidos,
							'email' => $query[0]->cont_email,
						);
			$this->session->set_userdata($user);
			$this->user = new User();
		}
		$send['count'] = count($query);
		echo json_encode($send);
	}

	public function load_clientes()
	{
		$where_data = array('c.cont_id'=>$this->user->id);
		$join_clause[0] = array('table'=>'empresa e','condition'=>"e.cont_id = c.cont_id");
        $send['clientes'] = $this->generic_model->get_join('contadora c', $where_data, $join_clause, $fields = 'e.*');
		echo json_encode($send);
	}

	public function save_cliente()
	{
		$id_empresa = 0;
		$data = json_decode(file_get_contents("php://input"));
		$data->cont_id = $this->user->id;
		$data->logo = null;
		$send['id_empresa'] = $this->generic_model->save('empresa', $data);
		echo json_encode($send);
	}
}
