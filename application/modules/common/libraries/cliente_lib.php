<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

include_once("persona_lib.php");

class Cliente_lib extends Persona_lib{

    protected $table_cliente = 'cliente';
    
    public function __construct() {
        parent::__construct();
        $this->ci = & get_instance();
    }

    public function insert($data){
        $data_persona['per_identificacion'] = trim($data->identificacion);
        $data_persona['per_nombres'] = strtoupper($data->nombres);
        $data_persona['per_apellidos'] = strtoupper($data->apellidos);
        $data_persona['per_direccion'] = strtoupper($data->direccion);
        $data_persona['per_email'] = trim(strtolower($data->email));
        if(!empty($data->img)){
            $data_persona['per_img'] = trim($data->img);            
        }
        $rta = $this->insert_persona($data_persona);
        //print_r($rta);
        if($rta['bandera']){
            $data_cliente['per_id'] = $rta['per_id'];
            $data_cliente['tipo_identificacion'] = $data->tipo_identificacion;
            $data_cliente['tipo_ruc'] = $data->tipo_ruc;
            $data_cliente['dias_credito'] = $data->dias_credito;
            $data_cliente['descuento_max'] = $data->descuento_max;
            $data_cliente['credito_temp'] = $data->credito_temp;
            $data_cliente['credito'] = $data->credito;
            $rta['cli_id'] = $this->ci->generic_model->save('cliente', $data_cliente);
        }
        return $rta;
    }

    public function select_all(){
        $where_data = null;
        $join_clause[0] = array('table'=>'persona p','condition'=>"p.per_id = c.per_id");
        $join_clause[1] = array('table'=>'identificacion_tipo it','condition'=>"it.idetip_id = c.tipo_identificacion");
        $join_clause[2] = array('table'=>'cliente_tipo ct','condition'=>"ct.clitip_id = c.cli_tipo");
        $fields =  'p.per_identificacion identificacion,
                    p.per_nombres nombres,
                    p.per_apellidos apellidos,
                    p.per_direccion direccion,
                    p.per_email email,
                    it.idetip_nombre tipo_identificacion,
                    ct.clitip_nombre cli_tipo,
                    c.tipo_ruc,
                    c.dias_credito,
                    c.descuento_max,
                    c.credito_temp,
                    c.credito';
        $order_by = array('p.per_id'=>'DESC');
        return $this->ci->generic_model->get_join('cliente c', $where_data , $join_clause, $fields, $rows_num = 0, $order_by);
    }
}