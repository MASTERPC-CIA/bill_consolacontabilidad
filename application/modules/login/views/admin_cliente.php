<div class = "panel panel-default">
    <div class = "panel-heading">
        {{accion}}
    </div>
    <div class = "panel-body">
        <form class = "form-horizontal" name="form_cliente" role="form" novalidate>
            <div class = "col-md-12">
                <div class = "form-group form-group-sm col-md-4">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">Identificacion</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.identificacion" only-numbers>
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group form-group-sm col-md-4">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">TipoIdentificacion</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.tipo_identificacion">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group form-group-sm col-md-6">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">Nombres</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.nombres">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group col-md-6">
                    <div class = "input-group form-group-sm has-warning">
                        <span class = "input-group input-group-addon">Apellidos</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.apellidos">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">Direccion</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.direccion">
                    </div>
                </div>
            </div>
            <div class = "col-md-4">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">Email</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.email">
                    </div>
                </div>
            </div>
            <div class = "col-md-4">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">Telefono</span>
                        <input type="text" class = "form-control" ng-model="cliente.telefono" only-numbers>
                    </div>
                </div>
            </div>
            <div class = "col-md-4">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">TipoCiente</span>
                        <input type="text" class = "form-control" ng-model="cliente.cli_tipo" only-numbers>
                    </div>
                </div>
            </div>
            <div class = "col-md-4">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">TipoRuc</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.tipo_ruc">
                    </div>
                </div>
            </div>
            <div class = "col-md-4">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">DiasCredito</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.dias_credito">
                    </div>
                </div>
            </div>
            <div class = "col-md-4">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">MaxDescuento</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.descuento_max">
                    </div>
                </div>
            </div>
            <div class = "col-md-4">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">CreditoTemp</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.credito_temp">
                    </div>
                </div>
            </div>
            <div class = "col-md-4">
                <div class = "form-group form-group-sm col-md-12">
                    <div class = "input-group has-warning">
                        <span class = "input-group input-group-addon">Credito</span>
                        <input type="text" ng-required = "true" class = "form-control" ng-model="cliente.credito">
                    </div>
                </div>
            </div>
            <div class = "col-md-12">
                <button class = "btn btn-success" ng-click = "guardar(cliente)" ng-disabled = "form_cliente.$invalid">{{button_name}}</button>
                <button class = "btn btn-danger" ng-click = "cancelar()">Cancelar </button>
            </div>
        </form>
    </div>
</div>