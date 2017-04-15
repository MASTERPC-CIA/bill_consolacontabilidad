<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Helena</title>
        <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />
    <?php

    $css = array(
                base_url('bower_components/bootstrap/dist/css/bootstrap.min.css'),
                base_url('assets/dreams/js/morris/morris-0.4.3.min.css'),
                base_url('assets/dreams/css/custom-styles.css'),
                base_url('bower_components/components-font-awesome/css/font-awesome.min.css'),
            );
    echo csslink($css);

    if(!empty($css_angular)){ echo csslink($css_angular); }
        
    $js = array(
                base_url('bower_components/jquery/dist/jquery.min.js'),
                base_url('bower_components/bootstrap/dist/js/bootstrap.min.js'),
                base_url('assets/dreams/js/jquery.metisMenu.js'),

                base_url('bower_components/angular/angular.min.js'),
                //base_url('assets/js/angularjs/angular.min.js'),
                base_url('assets/js/angularjs/pagination.js'),
                base_url('bower_components/angular-bootstrap/ui-bootstrap.min.js'),
                base_url('bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'),
                base_url('bower_components/underscore/underscore-min.js'),
                base_url('bower_components/angular-route/angular-route.min.js'),
                base_url('bower_components/angular-animate/angular-animate.min.js'),
                base_url('assets/js/angularjs/ngprogress.js'),
                base_url('bower_components/angular-touch/angular-touch.min.js')
            );
    echo jsload($js);
    if(!empty($angularjs)){ echo jsload($angularjs); }

    ?>
    </head>
    <body>
        <div id="wrapper">
            <?php
                $res['module_title'] = 'Ventas';
                $this->load->view('common/templates/navigation.php');
            ?>
            <?php echo $slidebar; ?>
            <div id="page-wrapper">
                <div id="page-inner">
                    <div class="row" ng-app="<?php echo $app ?>" ng-view="" id="ng-view" />
                    <footer><p>All right reserved. Template by: <a href="http://webthemez.com">WebThemez</a></p></footer>
                </div>
            </div>
        </div>
    </body>
</html>