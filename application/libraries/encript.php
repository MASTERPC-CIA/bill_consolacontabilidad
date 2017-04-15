<?php
/**
 * Description of Encriptacion
 *
 * @author COR
 */
class Encript {
    //put your code here
    
    /******************Encriptacion con base64**************************************/
     function encryptbase64($string, $key = "keymasterpc") {
        $result = '';
            for($i=0; $i<strlen($string); $i++) {
                $char = substr($string, $i, 1);
                $keychar = substr($key, ($i % strlen($key))-1, 1);
                $char = chr(ord($char)+ord($keychar));
                $result.=$char;
            }
        return base64_encode($result);
     }
     
     
        function decryptbase64($string, $key = "keymasterpc") {
            $result = '';
            $string = base64_decode($string);
            for($i=0; $i<strlen($string); $i++) {
                $char = substr($string, $i, 1);
                $keychar = substr($key, ($i % strlen($key))-1, 1);
                $char = chr(ord($char)-ord($keychar));
                $result.=$char;
            }
            return $result;
        }    
    /********************************************************/
    
    /******************Encriptacion poco eficiente para guardar en bd y pasar por webservices***********/
    public function encryptX($cadena, $clave = "keymasterpc")
    {
        $cifrado = MCRYPT_RIJNDAEL_256;
        $modo = MCRYPT_MODE_ECB;
        return mcrypt_encrypt($cifrado, $clave, $cadena, $modo,
            mcrypt_create_iv(mcrypt_get_iv_size($cifrado, $modo), MCRYPT_RAND)
            );
    }

    public function decryptX($cadena, $clave = "keymasterpc")
    {
        $cifrado = MCRYPT_RIJNDAEL_256;
        $modo = MCRYPT_MODE_ECB;
        return mcrypt_decrypt($cifrado, $clave, $cadena, $modo,
            mcrypt_create_iv(mcrypt_get_iv_size($cifrado, $modo), MCRYPT_RAND)
            );
    }    
}
?>