<div class = "panel panel-default">
    <div class = "panel-heading">
        NUEVA EMPRESA
    </div>
    <div class = "panel-body">
        <form class = "form-horizontal" name="form_empresa" role="form" method="post">
            <div class = "col-md-12">
                <div class = "form-group form-group-sm col-md-5">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">RUC</span>
                        <input type="text" class = "form-control" ng-model="empresa.ruc">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">RAZON SOCIAL</span>
                        <input type="text" class = "form-control" ng-model="empresa.nombre">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group form-group-sm col-md-6">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">EMAIL</span>
                        <input type="text" class = "form-control" ng-model="empresa.email">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group col-md-6">
                    <div class = "input-group form-group-sm has-warning">
                        <span class = "input-group input-group-addon">LOGO</span>
                        <input type="text" class = "form-control" ng-model="empresa.logo">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <button class = "btn btn-success" ng-click="save(empresa);">GUARDAR</button>
                <button class = "btn btn-danger" ng-click="cancel();">Cancelar </button>
            </div>
        </form>
    </div>
</div>