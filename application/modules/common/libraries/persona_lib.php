<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Persona_lib {

    public function __construct() {
        $this->ci = & get_instance();
        $this->ci->load->library('ValidarIdentificacion');
        $this->ci->load->library('mensaje_lib');

        $this->ValidarIdentificacion = new ValidarIdentificacion();
        $this->obj_mensaje = new mensaje_lib();
    }

    public function insert_persona($data){
        $send['per_id'] = 0;
        if($this->ValidarIdentificacion->validarCedula($data['per_identificacion'])){
            $rta = $this->select_x_identificacion($data['per_identificacion']);
            $send['bandera'] = true;
            if($rta['bandera']){
                $send['per_id'] = $rta['query']->per_id;
                $send['msg'] = $this->obj_mensaje->select_x_id(4);
            }else{
                $send['per_id'] = $this->ci->generic_model->save('persona', $data);
                if($send['per_id'] > 0){
                    $send['msg'] = $this->obj_mensaje->select_x_id(4);
                }
            }
        }else{
            $send['bandera'] = false;
            $send['msg'] = $this->obj_mensaje->select_x_id(3);
        }
        return $send;
    }

    public function select_x_identificacion($identificacion){
        $return['query'] = $this->ci->generic_model->get_by_id('persona', $identificacion, $fields = '*', $id_column_name = 'per_identificacion');
        if($return['query']){
            $return['bandera'] = true;
            $return['msg'] = $this->obj_mensaje->select_x_id(2);
        }else{
            $return['bandera'] = false;
            $return['msg'] = $this->obj_mensaje->select_x_id(1);
        }
        return $return;
    }

    public function select_x_nombres($nombres){
        return $this->ci->generic_model->get('persona');
    }

    public function select_x_apellidos($apellidos){
        return $this->ci->generic_model->get('persona');
    }
}