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
                <!--<a class="navbar-brand" ng-click="logout();">Cerrar Sesion</a>-->
            </div>
        </div>
    </nav>

    <div class="container">

        <div class="row">
            <div class="col-lg-12">
                <!-- <h1 class="page-header">Usuario : <small><?php echo $this->user->nombres.' '.$this->user->apellidos; ?></small></h1> -->
                <h1 class="page-header">Usuario : <small>{{usuario.nombres}} {{usuario.apellidos}}</small></h1>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <h2 class="page-header">Sus Clientes :</h2>
            </div>
            <div class="col-lg-12" style="text-align:right">
                <?php 
                echo Open('div', array('class'=>'col-lg-12'));
                    echo tagcontent('button','Nuevo Cliente', array('class'=>"btn btn-primary",'ng-click'=>'nuevo();', 'type'=>"button")); 
                    echo tagcontent('button','Cerrar Sesion', array('class'=>"btn btn-danger",'ng-click'=>'logout();', 'type'=>"button")); 
                echo Close('div');
                ?>
            <br>
            <br>
            <hr>
            </div>
            <?php
            echo Open('div', array('class'=>'col-lg-12'));
                echo Open('div', array('ng-repeat'=>'cliente in clientes'));
                    echo Open('div', array('class'=>"col-lg-3 col-sm-6 text-center", 'style'=>'padding: 0px;'));
                        echo Open('a', array('href'=>'{{cliente.name_domain}}', 'target'=>"_blank"));
                            //echo tagcontent('img', '', array('class'=>"img-thumbnail img-responsive img-center", 'src'=>'{{cliente.logo}}', 'ng-if'=>'cliente.logo!=null', 'alt'=>"", 'style'=>'height:100px;width:100px'));
                            echo tagcontent('img', '', array('class'=>"img-thumbnail img-responsive img-center", 'src'=>base_url("uploads/logo.jpeg"), 'ng-if'=>'cliente.logo!=null', 'alt'=>"", 'style'=>'height:100px;width:100px'));
                            echo tagcontent('img', '', array('class'=>"img-thumbnail img-responsive img-center", 'src'=>base_url("uploads/no_disponible.png"), 'ng-if'=>'cliente.logo==null', 'alt'=>"", 'style'=>'height:100px;width:100px'));
                        echo Close('a');
                        echo tagcontent('h6', '<b>'.'{{cliente.nombre}}'.'</b> ({{cliente.ruc}})');
                    echo Close('div');
                echo Close('div');
            echo Close('div');
            ?>
        <hr>
        </div>
    </div>
    <script src="<?php echo base_url('assets/template/js/jquery.js'); ?>"></script>
    <script src="<?php echo base_url('assets/template/js/bootstrap.min.js'); ?>"></script>
</body>
</html>