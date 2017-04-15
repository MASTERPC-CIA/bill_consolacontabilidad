<?php
class Generic_model extends CI_Model {

	function __construct()
	{
		parent::__construct();
	}
	
	function get_all($table_name, $fields = '', $order_by = null)
	{
        if(!empty($fields)){
            $this -> db -> select($fields,FALSE);
        }else{
            $this -> db -> select('*');
        }            
        $this -> db -> from($table_name);
        if($order_by){
            foreach ($order_by as $order => $tipo) {
                $this -> db -> order_by($order, $tipo);        
            }                                
        }            
        $query = $this -> db -> get();

        return $query->result();
	}
        
	function get($table_name, $where_data = null, $fields = '', $order_by = null, 
                $rows_num = 0, $or_like_data = null, $and_like_data = null, $group_by = null, $or_where = null )
	{            
        if($where_data){
            foreach ($where_data as $key => $value) {
                $this -> db -> where($key,$value);        
            }
        }
        if($or_where){
            foreach ($or_where as $key => $value) {
                $this -> db -> or_where($key,$value);        
            }
        }
        if($or_like_data){
            foreach ($or_like_data as $key => $value) {
                $this -> db -> or_like( 'UPPER('.$key.')' ,strtoupper($value),FALSE);        
            }
        }
        if($and_like_data){
            foreach ($and_like_data as $key => $value) {
                $this -> db -> like( 'UPPER('.$key.')' ,strtoupper($value),FALSE);    
            }
        }
        
        if(!empty($group_by)){
            $this->db->group_by($group_by);
        }
        
        if(!empty($fields)){
            $this -> db -> select($fields,FALSE);
        }else{
            $this -> db -> select('*');                
        }
        $this -> db -> from($table_name);
        
        if($order_by){                
            foreach ($order_by as $order => $tipo) {
                $this -> db -> order_by($order, $tipo);        
            }                                
        }

        if($rows_num == 1){
            $this -> db -> limit($rows_num); 
            $query = $this -> db -> get();                
            return $query->row();
        }elseif($rows_num > 1){
            $this -> db -> limit($rows_num); 
            $query = $this -> db -> get();            
            return $query->result();
        }elseif($rows_num == 0){
            $query = $this -> db -> get();            
            return $query->result();
        }
	}
        
    function get_data( $table_name, $where_data = null, $fields = '', $order_by = null, $rows_num = 0, $group_by = null )
	{
        if($where_data){
            foreach ($where_data as $key => $value) {
                $this -> db -> where($key,$value);        
            }
        }
        
        if(!empty($group_by)){
            $this->db->group_by($group_by);
        }
        
        if(!empty($fields)){
            $this -> db -> select($fields,FALSE);
        }else{
            $this -> db -> select('*');                
        }
        $this -> db -> from($table_name);
        
        if($order_by){                
            foreach ($order_by as $order => $tipo) {
                $this -> db -> order_by($order, $tipo);        
            }                                
        }

        if($rows_num == 1){
            $this -> db -> limit($rows_num); 
            $query = $this -> db -> get();                
            return $query->row();
        }elseif($rows_num > 1){
            $this -> db -> limit($rows_num); 
            $query = $this -> db -> get();            
            return $query->result();
        }elseif($rows_num == 0){
            $query = $this -> db -> get();            
            return $query->result();
        }
	}
        
    function get_in($table_name, $where_in = null, $where_not_in = null, $fields = '', $group_by = null, $order_by = null, $rows_num = 0)
	{
        if($where_in){
            foreach ($where_in as $key => $value) {
                $this->db->where_in($key,$value);
            }
        }
        if($where_not_in){
            foreach ($where_not_in as $key => $value) {
                $this->db->where_not_in($key,$value);
            }
        }
        
        if(!empty($group_by)){
            $this->db->group_by($group_by);
        }
        
        if(!empty($fields)){
            $this -> db -> select($fields);
        }else{
            $this -> db -> select('*');                
        }
        $this -> db -> from($table_name);
        
        if($order_by){                
            foreach ($order_by as $order => $tipo) {
                $this -> db -> order_by($order, $tipo);        
            }                                
        }

        if($rows_num == 1){
            $this -> db -> limit($rows_num); 
            $query = $this -> db -> get();                
            return $query->row();
        }elseif($rows_num > 1){
            $this -> db -> limit($rows_num); 
            $query = $this -> db -> get();            
            return $query->result();
        }elseif($rows_num == 0){
            $query = $this -> db -> get();            
            return $query->result();
        }
	}
        
	function get_join($table_name, $where_data, $join_clause, $fields = '', $rows_num = 0, $order_by = null, $group_by = null , $or_where = null)
	{            
        if($where_data){
            foreach ($where_data as $key => $value) {
                $this -> db -> where($key,$value);        
            }
        }

        if($or_where){
            foreach ($or_where as $key => $value) {
                $this -> db -> or_where($key,$value);        
            }
        }
        
        if(!empty($group_by)){
            $this->db->group_by($group_by);
        }
        
        if(!empty($fields)){
            $this -> db -> select($fields, FALSE);
        }else{
            $this -> db -> select('*');                
        }
        $this -> db -> from($table_name);
        
        foreach ($join_clause as $join) {
            if(!empty($join['type'])){
                $this->db->join($join['table'],$join['condition'],$join['type']);
            }else{
                $this->db->join($join['table'],$join['condition']);                                
            }
        }
        
        if($order_by){
            foreach ($order_by as $order => $tipo) {
                $this -> db -> order_by($order, $tipo);        
            }                                
        }
        
        if($rows_num == 1){
            $this -> db -> limit($rows_num);  
            $query = $this -> db -> get();
            return $query->row();
        }else{
            $query = $this -> db -> get();                
            return $query->result();                
        }
	}

	function get_by_id($table_name, $id, $fields = '', $id_column_name = 'id')
	{    
        $this -> db -> where($id_column_name, $id);
        
        if(!empty($fields)){
            $this -> db -> select($fields);
        }else{
            $this -> db -> select('*');                
        }            

        $this -> db -> from($table_name);
        $query = $this -> db -> get();

        return $query->row();
	}
        
    function get_val($table_name, $id, $val, $id_column_name = 'id', $alias_val = null, $empty_val = -1 )
	{
        $this -> db -> where($id_column_name, $id);
        $this -> db -> select($val,FALSE);

        $this -> db -> from($table_name);
        $query = $this -> db -> get();

        if( $query->row() ){
            if($alias_val != null ){
                return $query->row()->{$alias_val};
            }else{
                return $query->row()->$val;    
            }                
        }else{
            return $empty_val;
        }
	}
        
	function get_val_where($table_name, $where_data, $val, $alias_val = null, $empty_val = -1)
	{
        if($where_data){
            foreach ($where_data as $key => $value) {
                $this -> db -> where($key,$value);        
            }
        }            
        $this -> db -> select($val,FALSE);

        $this -> db -> from($table_name);
        $query = $this -> db -> get();

        if( $query->row() ){
            if($alias_val != null ){
                return $query->row()->{$alias_val};
            }else{
                return $query->row()->$val;    
            }                
        }else{
            return $empty_val;
        }
	}
        
	function save($table_name, $form_data)
	{
        $this->db->insert($table_name, $form_data);
        return $this->db->insert_id();
	}
        
	function delete_all($table_name)
	{
        $this->db->where('id >','0');
        $this->db->delete($table_name);
        return $this->db->affected_rows();
	}
        
	function delete($table_name, $where = null )
	{            
        if($where){
            foreach ($where as $col => $val) {
                $this->db->where($col,$val);
            }
        }else{
            $this->db->where('id >','0');
        }
        
        $this->db->delete($table_name);
        return $this->db->affected_rows();
	}        
        
    function update_by_id( $table_name, $data_set, $id, $id_column_name = 'id' ){
        $this->db->where($id_column_name, $id);
        $this->db->update($table_name, $data_set);
        return $this->db->affected_rows();
    }
    
    function update( $table_name, $data_set, $where_data ){
        $this->db->update($table_name, $data_set, $where_data);
        return $this->db->affected_rows();
    }
        
    function count_all_results($table_name, $where_data = null, $or_where_data = null ) {
        
        if($where_data){
            foreach ($where_data as $key => $value) {
                $this -> db -> where($key,$value);        
            }
        }
        if( $or_where_data ){
            foreach ($or_where_data as $key => $value) {
                $this -> db -> or_where($key,$value);        
            }
        }

        $this->db->from($table_name);
        return $tot_results = $this->db->count_all_results();            
    }
        
    function sum_table_field( $table, $field, $where_data = null ){
        $this->db->select_sum($field);
        if($where_data){
            foreach ($where_data as $key => $value) {
                $this -> db -> where($key,$value);        
            }
        }            
        $query = $this->db->get($table);
        return $query->row()->$field;
    }
}