<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Index extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
	}

	public function index() {
        $send['app'] = 'appHotel';
        $send['angularjs'] = $this->load_angularjs();
        $send['css_angular'] = $this->load_css();
        $send_lte['slidebar_actions'] = $this->load->view('slidebar','',TRUE);
        $send['slidebar'] = $this->load->view('common/templates/slidebar_lte',$send_lte,TRUE);
        $send['title'] = 'HOTEL';
        $this->load->view('common/templates/dashboard_lte_angularjs',$send);
    }
}