<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	public function index()
	{
		if($this->session->userdata('userid'))
   		{
			$this->load->view('index');
		}else{
			$this->load->view('login');
		}
	}
}
