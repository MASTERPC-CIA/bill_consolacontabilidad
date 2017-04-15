<nav class="navbar-default navbar-side" role="navigation">
    <div class="sidebar-collapse">
        <ul class="nav" id="main-menu">
                <?php
                    /*$path_img = base_url('uploads/img.jpg');
                    echo Open('div','',array('class'=>'col-md-12'));
                        echo Open('center');
                            echo Image($path_img, array('alt'=>1,'class'=>'img-rounded','style'=>'height:50px;width:50px; margin-right:4px'));
                        echo Close('center');
                    echo Close('div');
                    echo Open('div','',array('class'=>'col-md-12'));
                        echo tagcontent('a', '<center>LINEA UNO</center>', array('style'=>'font-weight:bold','class'=>'text-muted'));
                    echo Close('div');*/
                ?>
            <?php
            foreach ($submodulos as $key => $submodulo) {
                ?>
                <li>
                    <a href="<?php echo $submodulo->submod_url; ?>"><i class="fa fa-dashboard"></i> <?php echo $submodulo->submod_nombre; ?></a><?php
                ?></li>
                <?php
            }?>
    </div>
</nav>