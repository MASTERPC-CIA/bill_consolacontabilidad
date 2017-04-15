<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Round About - Start Bootstrap Template</title>

    <!-- Bootstrap Core CSS -->
    <link href="<?php echo base_url('assets/template/css/bootstrap.min.css'); ?>" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="<?php echo base_url('assets/template/css/round-about.css'); ?>" rel="stylesheet">
    <link href="<?php echo base_url('assets/ihover-gh-pages/src/ihover.min.css'); ?>" rel="stylesheet">

</head>

<body>

    <!-- Navigation -->
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">Cerrar Sesion</a>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <!--<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li>
                        <a href="#">About</a>
                    </li>
                    <li>
                        <a href="#">Services</a>
                    </li>
                    <li>
                        <a href="#">Contact</a>
                    </li>
                </ul>
            </div>-->
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>

    <!-- Page Content -->
    <div class="container">

        <!-- Introduction Row -->
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">Ing. Tania Tinoco
                    <!--<small>It's Nice to Meet You!</small>-->
                </h1>
                <!--<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint, explicabo dolores ipsam aliquam inventore corrupti eveniet quisquam quod totam laudantium repudiandae obcaecati ea consectetur debitis velit facere nisi expedita vel?</p>-->
            </div>
        </div>

        <!-- Team Members Row -->
        <div class="row">
            <div class="col-lg-12">
                <h2 class="page-header">Sus Clientes :</h2>
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
                    if(strlen($cliente->nombre) > 20){
                        $name_cliente = substr($cliente->nombre, 0, 20);
                    }else{
                        $name_cliente = $cliente->nombre;
                    }
                    echo tagcontent('h6', $name_cliente.' ('.$cliente->ruc.')');
                echo Close('div');
            }
            ?>
        </div>

        <hr>

        <!-- Footer -->
        <footer>
            <div class="row">
                <div class="col-lg-12">
                    <p>Copyright &copy; Your Website 2014</p>
                </div>
                <!-- /.col-lg-12 -->
            </div>
            <!-- /.row -->
        </footer>

    </div>
    <!-- /.container -->

    <!-- jQuery -->
    <script src="<?php echo base_url('assets/template/js/jquery.js'); ?>"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="<?php echo base_url('assets/template/js/bootstrap.min.js'); ?>"></script>

</body>
</html>