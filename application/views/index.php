<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Menu Principal</title>

    <link href="<?php echo base_url('assets/template/css/bootstrap.min.css'); ?>" rel="stylesheet">

    <link href="<?php echo base_url('assets/template/css/round-about.css'); ?>" rel="stylesheet">
    <link href="<?php echo base_url('assets/ihover-gh-pages/src/ihover.min.css'); ?>" rel="stylesheet">

</head>

<body>
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="<?php base_url('welcome/logout') ?>">Cerrar Sesion</a>
            </div>
        </div>
    </nav>

    <div class="container">

        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">Usuario : <?php echo $usuario->cont_nombres.' '.$usuario->cont_apellidos; ?>
                </h1>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <h2 class="page-header">Sus Clientes :</h2>
            </div>
            <div class="col-lg-12" style="text-align:right">
                <?php 
                    echo tagcontent('button','', array('class'=>"btn btn-primary glyphicon glyphicon-file",'data-toggle'=>"modal", 'data-target'=>".bs-example-modal-lg", 'type'=>"button")); 
                    echo Open('div', array('class'=>"modal fade bs-example-modal-lg", 'tabindex'=>"-1", 'role'=>"dialog", 'aria-labelledby'=>"myLargeModalLabel"));
                        echo Open('div', array('class'=>"modal-dialog modal-lg", 'role'=>"document"));
                            echo Open('div', array('class'=>"modal-content"));
                            $this->load->view('login/admin_empresa');
                            echo Close('div');
                        echo Close('div');
                    echo Close('div');
                ?>
            </div>
            <?php
            $join_clause[0] = array('table'=>'empresa e','condition'=>"e.cont_id = c.cont_id");
            $clientes = $this->generic_model->get_join('contadora c', $where_data = null, $join_clause, $fields = 'e.*');
            foreach($clientes as $cliente){
                echo Open('div', array('class'=>"col-lg-3 col-sm-6 text-center", 'style'=>'padding: 0px;'));
                    echo Open('a', array('href'=>$cliente->name_domain, 'target'=>"_blank"));
                        if(empty($cliente->logo)){
                            echo tagcontent('img', '', array('class'=>"img-thumbnail img-responsive img-center", 'src'=>base_url('uploads/no_disponible.png'), 'alt'=>"", 'style'=>'height:100px;width:100px'));
                        }else{
                            echo tagcontent('img', '', array('class'=>"img-thumbnail img-responsive img-center", 'src'=>$cliente->logo, 'alt'=>"", 'style'=>'height:100px;width:100px'));
                        }
                    echo Close('a');
                    /*echo tagcontent('button','', array('class'=>"btn btn-warning glyphicon glyphicon-edit", 'type'=>"button"));
                    echo tagcontent('button','', array('class'=>"btn btn-danger glyphicon glyphicon-trash", 'type'=>"button"));*/
                    if(strlen($cliente->nombre) > 20){
                        $name_cliente = substr($cliente->nombre, 0, 20);
                    }else{
                        $name_cliente = $cliente->nombre;
                    }
                    echo tagcontent('h6', '<b>'.$name_cliente.'</b> ('.$cliente->ruc.')');
                echo Close('div');
            }
        echo Close('div');
            ?>
        <hr>

    </div>
    <script src="<?php echo base_url('assets/template/js/jquery.js'); ?>"></script>
    <script src="<?php echo base_url('assets/template/js/bootstrap.min.js'); ?>"></script>
</body>
</html>