<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

	/**
	* ONLY FOR THIS CLASS (self)
	*   parse_attr($attributes) -> Parse out the attributes
	*
	* @static
	* @access	private
	* @param	mixed - An array or string for parse the specified attributes
	* @return	string The parsed attribute (attribute="value")
	*/
	function parse_attr($attributes) {
		if (is_string($attributes)) {
			return (!empty($attributes)) ? ' ' . trim($attributes) : '';
		}

		if (is_array($attributes)) {
			$attr = '';

			foreach ($attributes as $key => $val) {
                            if($key=='checked' AND $val==''){
                                continue;
                            }
				$attr .= ' ' . $key . '="' . $val . '"';
			}

			return $attr;
		}
	}

	/**
	 * ONLY FOR THIS CLASS (self)
	 * HTML::parse_fields($fields) -> Parse the $fields array and transform into a valid HTML input
	 *
	 * @static
	 * @access private
	 * @param  array $fields An array with the following structure -> 'Type' => array($attributes)
	 * @return string The parsed input HTML
	 */
	function parse_fields($fields, $content = '') {
		if (is_array($fields)) {
			$field = '';$label='';
			foreach ($fields as $key => $val) {
                             	$attributes =   parse_attr($val);   

                                if(strlen ( $key ) > 1){ $label = '<label>'.$key.'</label>&nbsp;'; }else{ $label = ''; }
                                if(!empty($content)){
        				$field .= '<div class="'.$content.'">'.$label.'<input ' . $attributes . ' /></div>' . PHP_EOL;
                                }else{
        				$field .= $label.'<input ' . $attributes . ' />' . PHP_EOL;
                                }
			}

			return $field;
		}
	}

	/**
	 * ONLY FOR THIS CLASS (self)
	 *   list_item($items) -> Returns a <li></li> tag parsed with the value in the array ($items = array)
	 *
	 * @static
	 * @access private
	 * @param  array $items The array with a list to transform into a <li></li> tag
	 * @param  string $class A class for the items
	 * @return string The complete <li></li> tag
	 */
	function list_item($items, $class = null) {
		if (is_array($items)) {
			$class = (isset($class) && !empty($class)) ? ' class="' . $class . '"': null;
			$li = '';
			$i = 0;

			foreach ($items as $key => $val) {
				$i++;
				$li .= '<li id="' . $i . '"' . $class . '>' . PHP_EOL . $val . PHP_EOL . '</li>' . PHP_EOL;
			}

			return $li;
		}
	}

	/**
	 * ONLY FOR THIS CLASS (self)
	 *   filter description
	 *
	 * @static
	 * @access 	private
	 * @param  	string $str The input string to filter
	 * @param  	string $mode The filter mode
	 * @return 	mixed May return the filtered string or may return null if the $mode variable isn't set
	 */
	function filter($str, $mode) {
		switch($mode) {
			case 'strip':
				/* HTML tags are stripped from the string
				before it is used. */
				return strip_tags($str);
			case 'escapeAll':
				/* HTML and special characters are escaped from the string
				before it is used. */
				return htmlentities($str, ENT_QUOTES, 'UTF-8');
			case 'escape':
				/* Only HTML tags are escaped from the string. Special characters
				is kept as is. */
				return htmlspecialchars($str, ENT_NOQUOTES, 'UTF-8');
			case 'url':
				/* Encode a string according to RFC 3986 for use in a URL. */
				return rawurlencode($str);
			case 'filename':
				/* Escape a string so it's safe to be used as filename. */
				return str_replace('/', '-', $str);
			default:
				return null;
		}
	}

	/**
	 * Generates a HTML document type
	 *
	 * @static
	 * @access 	public
	 * @param 	string $type Type of the document
	 * @return 	string
	 */
	function Doctype($type = 'html5') {
		$doctypes = array(
			'html5'			=> '<!DOCTYPE html>',
			'xhtml11'		=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
			'xhtml1-strict'	=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
			'xhtml1-trans'	=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
			'xhtml1-frame'	=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
			'html4-strict'	=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
			'html4-trans'	=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
			'html4-frame'	=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">',
		);

		if (isset($doctypes[strtolower($type)])) {
			return $doctypes[$type] . "\n";
		}
		else {
			return '';
		}
	}

	/**
	 * Creates the <img /> tag
	 *
	 * @static
	 * @access 	public
	 * @param 	string $src Where is the image?
	 * @param 	mixed $attributes Custom attributes (must be a valid attribute for the <img /> tag)
	 * @return 	string The formated <img /> tag
	 */
	function Image($src, $attributes = '') {
		if (isset($attributes) && !empty($attributes)) {
			$attributes =   parse_attr($attributes);
		}

		$border = (isset($attributes['border']) && !empty($attributes['border'])) ? $attributes['border'] . ' ' : 'border="0" ';
		$alt = (isset($attributes['alt']) && !empty($attributes['alt'])) ? $attributes['alt'] . ' ' : 'alt="" ';

		return '<img src="' . $src . '"' . $attributes . ' ' . $border . $alt . '/>';
	}
       
	/**
	 * Creates a HTML Anchor link
	 *
	 * @static
	 * @access 	public
	 * @param 	string $url the URL
	 * @param 	string $label the link value
	 * @param 	mixed $attributes Custom attributes (must be a valid attribute for the <a></a> tag)
	 * @return 	string The formated <a></a> tag
	 */
	function Url($url, $label = null, $attributes = null) {
		$label = (!empty($label)) ? $label : $url;

		if (isset($attributes) && !empty($attributes)) {
			$attributes = parse_attr($attributes);
		}

		return '<a href="' . $uri . '"' . $attributes . '>' . $label . '</a>';
	}

	/**
	 * Generates a "mailto" link
	 *
	 * @static
	 * @access 	public
	 * @param 	$email
	 * @param 	string $label The anchor value.
	 * @param 	mixed $attributes Custom attributes (must be a valid attribute for the <a></a> tag)
	 * @return 	string The formated <a></a> tag with the 'href' attribute set for: mailto:$email
	 */
	function Email($email, $label = null, $attributes = null)	{
		$label = (!empty($label)) ? $label : $email;

		if (isset($attributes) && !empty($attributes)) {
			$attributes = parse_attr($attributes);
		}

		$html = '<a href="mailto:' . $email . '"' . $attributes . '>' . $label . '</a>';
		return $html;
	}

	/**
	 * HTML <br /> tag
	 *
	 * @static
	 * @access 	public
	 * @param 	int $count How many line breaks?
	 * @return 	string
	 */
	function LineBreak($count = 1, $attributes = null) {
            	if (isset($attributes) && !empty($attributes)) {
                    $attributes =   parse_attr($attributes);
		}
		return str_repeat('<br '.$attributes.'/>', $count) . PHP_EOL;
	}
	
         function lineBreak2($count = 1, $attributes = null) {
            	if (isset($attributes) && !empty($attributes)) {
                    $attributes =   parse_attr($attributes);
		}
		return str_repeat('<hr '.$attributes.'/>', $count) . PHP_EOL;
	}

	/**
	 * Returns non-breaking space entities
	 *
	 * @static
	 * @access 	public
	 * @param 	int $count How many spaces?
	 * @return 	string
	 */
	 function Space($count = 1) {
//		return str_repeat('&nbsp;', $count);
            $output = '';
            for ($index = 0; $index < $count; $index++) {
                $output .= '&nbsp;';
            }
            return $output;
	}

	/**
	 * HTML::Form() -> Creates the <form> tag with the specified variables.
	 *
	 * @static
	 * @access 	public
	 * @param 	string $action The action attribute value.
	 * @param 	array $fields What is the form fields?
	 * @param 	string $name The form name
	 * @param 	string $method The form method (post or get)
	 * @param 	string $enctype The form enctype
	 */
	 function Form($action, $fields, $content = '', $fields2='', $fields3='', $arrattributes = array() , $name = null, $method = 'post', $enctype = 'multipart/form-data') {
		$name = (isset($name) && !empty($name)) ? ' name="' . $name . '"' : null;
		$method = (isset($method)) ? ' method="' . $method . '"': null;
		$enctype = (isset($enctype)) ? ' enctype="' . $enctype . '"': null;
                
                $attributes =   parse_attr($arrattributes);
                
		$html = '<form action="' . $action . '"' . $name . $method . $enctype . $attributes . '>' . PHP_EOL;
                $html .= $fields2;
		$html .=   parse_fields($fields, $content);
		$html .= $fields3;
		$html .= '</form>' . PHP_EOL;

		return $html;
	}
        
        
	 function Form1($fields, $arrattributes = array() ,$method = 'post', $enctype = 'multipart/form-data') {
            $name = (isset($name) && !empty($name)) ? ' name="' . $name . '"' : null;
            $method = (isset($method)) ? ' method="' . $method . '"': null;
            $enctype = (isset($enctype)) ? ' enctype="' . $enctype . '"': null;
            $attributes =   parse_attr($arrattributes);
            $html = '<form '.$attributes. $method . $enctype . '>' . PHP_EOL;
            $html .=   parse_fields($fields);
            $html .= '</form>' . PHP_EOL;
            return $html;
        }        
        
         function tablethead($arrData){                        
            $output = '<thead><tr>';
            foreach ($arrData as $th) {
                $output.='<th>'.$th.'</th>';
            }
            $output.='</tr></thead>';
            return $output;
        }        

	/**
	 * HTML::Open('tag') -> Opens a HTML tag
	 *
	 * @static
	 * @access 	private
	 * @param 	string $tag Which tag we're gonna open?
	 * @param 	mixed $attributes Custom attributes (must be a valid attribute for the specified tag)
	 * @param 	array $li_items Some array with items for <ul> or <ol> tags
	 * @return 	string Return the opened tag (<$tag>)
	 */
	 function Open($tag, $attributes = null, $li_items = array()) {
		  $tag = strtolower($tag);

		if (isset($attributes) && !empty($attributes)) {
			$attributes =   parse_attr($attributes);
		}

		if ($tag == 'ul' || $tag == 'ol') {
			if (!empty($attributes['li_class'])) {
				$list =   list_item($li_items, $attributes['li_class']);
				return '<' .   $tag . $attributes . '>' . PHP_EOL . $li_items;
			} else {
				$list =   list_item($li_items);
				return '<' .   $tag . $attributes . '>' . PHP_EOL . $li_items;
			}
		}

		return '<' .   $tag . $attributes . '>' ;
	}
        
	function tagcontent($tag, $content = '', $attributes = '') {
            $output = '';
		  $tag = strtolower($tag);

		if (isset($attributes) && !empty($attributes)) {
			$attributes =   parse_attr($attributes);
		}
		$output .= '<' .   $tag . $attributes . '>' ;
                    $output .= $content;
                $output .= '</' .   $tag . $attributes . '>' ;
                return $output;
	}

	/**
	 * HTML::Close() -> Close the current open tag
	 *
	 * @static
	 * @access 	public
	 */
	 function Close($tag) {
             $tag = strtolower($tag);
		return '</' .   $tag . '>' ;
	}

        /**
	 * HTML::Close() -> Close the current open tag
	 *
	 * @static
	 * @access 	public
	 */
	 function closeTag($ptag) {
              $tag = strtolower($ptag);
		return PHP_EOL . '</' .   $tag . '>' . PHP_EOL;
	}

         function csslink($srcarray){
            $output = '';
            foreach ($srcarray as $val) {
                $output .= '<link href="'.$val.'" rel="stylesheet">';            
            }
            return $output;
        }
        
         function jsload($srcarray){
            $output = '';
            foreach ($srcarray as $val) { $output .= '<script src="'.$val.'"></script>'; }
            return $output;
        }
        
         function tabs($tabsarray, $attributes){
            $output = '';
		if (isset($attributes) && !empty($attributes)) {
			$attributes =   parse_attr($attributes);
		}            
                $output.='<ul '.$attributes.'>';        
                    foreach ($tabsarray as $id => $label) {
                        $liattributes =   parse_attr($label);
                            $output.='<li '.$liattributes.' ><a href="#'.$id.'" data-toggle="tab"><strong>'.$label['label'].'</strong></a></li>';                        
                    }
                $output.='</ul>';
            return $output;
        }
       
        function inputGroup($checkbox, $attributes, $attrlabel = array('class'=>'btn btn-primary'), $attrdiv = array('class'=>'btn-group', 'data-toggle'=>'buttons')){
            $output = ''; $input = '';
		if (isset($attributes) && !empty($attributes)) { $attributes =   parse_attr($attributes); }
                                
                $output .=   Open('div', $attrdiv);
                    foreach ($checkbox as $label) {
                        $input .= '<input '.$attributes.'> '.$label;
                            $output .=   tagcontent('label', $input, $attrlabel);
                    }
                $output .=   closeTag('div');
            return $output;
        }

         function input($attributes){
            $output = '';
		if (isset($attributes) && !empty($attributes)) { $attributes =   parse_attr($attributes); }                               
                    $output .= '<input '.$attributes.'/>';
            return $output;
        }
        
        function combobox( $data, $optattr = null, $comboattr = null, $elem1 = false, $selected = '', $noselectedval = '-1'){
        $combo_opt = ''; 
        $opt_label = $optattr['label'];
//        echo $opt_label;
        $opt_value = $optattr['value'];
        $cont = 0;
            foreach ($data as $g) {
                if( $elem1 AND $cont == 0 ){
                    $combo_opt .= tagcontent('option', 'Seleccionar -- ', array('value'=>$noselectedval));
                    $cont ++;
//                    continue;
                }

                if( $selected != '' AND $selected == $g->$opt_value ){
                    $combo_opt .= tagcontent('option', $g->$opt_label, array('value'=>$g->$opt_value,'selected'=>'')); 
                    $cont ++;
                    continue;
                }
                $combo_opt .= tagcontent('option', $g->$opt_label, array('value'=>$g->$opt_value)); 
                $cont ++;
            }
            $combobox = tagcontent('select', $combo_opt, $comboattr);

            return $combobox;            
        }
        
        function combobox_array( $data, $comboattr = null, $elem1 = false, $selected = '' ){
        $combo_opt = ''; 
//        $opt_label = $optattr['label'];
//        echo $opt_label;
//        $opt_value = $optattr['value'];
        $cont = 0;
            foreach ($data as $g) {
                if( $elem1 AND $cont == 0 ){
                    $combo_opt .= tagcontent('option', 'Seleccionar -- ', array('value'=>'-1'));
                    $cont ++;
//                    continue;
                }

                if( $selected != '' AND $selected == $g ){
                    $combo_opt .= tagcontent('option', $g, array('value'=>$g,'selected'=>'')); 
                    $cont ++;
                    continue;
                }
                $combo_opt .= tagcontent('option', $g, array('value'=>$g)); 
                $cont ++;
            }
            $combobox = tagcontent('select', $combo_opt, $comboattr);

            return $combobox;            
        }
