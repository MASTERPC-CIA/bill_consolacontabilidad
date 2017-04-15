<?php if ( ! defined('BASEPATH')) exit('No se permite el acceso directo al script');

class User {
   public $id; 
   public $userid; 
   public $username; 
   public $nombres; 
   public $apellidos; 
   public $email; 
   public $telefonos; 
   public $celular;
   public $essuperusuario; 
   public $root; //un alias de essuperusuario 
   public $rucempresa; 
   public $ivaporcent; 
   public $numdecimales; 
  
   function __construct()
    {
      $ci =& get_instance();
        $this->id = $ci->session->userdata('id');      
        $this->userid = $ci->session->userdata('userid');      
        $this->username = $ci->session->userdata('username');
        $this->nombres = $ci->session->userdata('nombres');
        $this->apellidos = $ci->session->userdata('apellidos');
        $this->email = $ci->session->userdata('email');
        $this->telefonos = $ci->session->userdata('telefonos');
        $this->celular = $ci->session->userdata('celular');
        $this->essuperusuario = $ci->session->userdata('essuperusuario');
        $this->root = $ci->session->userdata('essuperusuario');
//        $this->rucempresa = $ci->session->userdata('rucempresa');
        $this->ivaporcent = 12;
        $this->numdecimales = 2;
    }
       
    function getAllCapabilities(){
        $ci =& get_instance();
        $ci->load->model('role','',TRUE);
        $allcapabilities = $ci->role->getAllCapabilities(); /* obtiene todos los posibles permisos de un usuario */ 
        return $allcapabilities;
    }   
    
    function getAssignedRole($userid){
        $ci =& get_instance();
        $ci->load->model('role','',TRUE);
        $assignedrole = $ci->role->getUserRoles($userid,'0'); /* obtiene todos los posibles permisos de un usuario */                
        return $assignedrole;
//        return $userid;
    }

    /*
     * Verifica si el usuario identificado tiene
     * el permiso pasado como parametro
     * $cap = array('admin','vendedor','otropermiso')
     */
    function check_permission( $cap, $user, $type = 'OR'){
        /* si es superusuario, no comprueba nada mas */
        if($this->root == 1){
            return true;
        }
        $ci =& get_instance();
        $ci->load->model('role','',TRUE);
        $res = $ci->role->check_permission($cap, $user, $type);
        return $res;
    }
    
    public function check_session(){
        $ci =& get_instance();
        $user_id = $ci->user->id;
        if(empty($user_id)){
            $ci->session->set_userdata('message', 'Su sesion ha expirado, vuelva a ingresar');
//            redirect(base_url('login/login'));
            echo tagcontent('script', "window.location.replace('".  base_url('login/login')."')");            
            die();
        }
    }
    
    public function get_assigned_role() {
        $ci =& get_instance();
        $join_cluase = array(
            '0'=>array('table'=>'billing_capacidad c','condition'=>'ec.Capacidades_capacidad = c.capacidad')
        );
        $assignedrole = $ci->generic_model->get_join('billing_empleadocapacidad ec', array('ec.empleado_id'=>$ci->user->id), $join_cluase, $fields = 'ec.empleado_id, ec.Capacidades_capacidad, c.capacidad capacidad, ec.fecha, c.interno, c.acceso, c.ubicacion, c.tabid label');
        
        return $assignedrole;
    }
}
