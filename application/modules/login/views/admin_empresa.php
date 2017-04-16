<div class = "panel panel-default">
    <div class = "panel-heading">
        NUEVA EMPRESA
    </div>
    <div class = "panel-body">
        <form class = "form-horizontal" name="form_empresa" role="form" action="<?php echo base_url('login/index/save'); ?>" method="post">
            <div class = "col-md-12">
                <div class = "form-group form-group-sm col-md-4">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">RUC</span>
                        <input type="text" class = "form-control" id="ruc" name="ruc">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">RAZON SOCIAL</span>
                        <input type="text" class = "form-control">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group form-group-sm col-md-6">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">EMAIL</span>
                        <input type="text" class = "form-control">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group col-md-6">
                    <div class = "input-group form-group-sm has-warning">
                        <span class = "input-group input-group-addon">LOGO</span>
                        <input type="text" class = "form-control">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <button class = "btn btn-success">GUARDAR</button>
                <button class = "btn btn-danger">Cancelar </button>
            </div>
        </form>
    </div>
</div>