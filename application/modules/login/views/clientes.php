<toaster-container toaster-options="{'time-out': 3000, 'position-class': 'toast-bottom-left'}"></toaster-container>
<a class="btn btn-success btn-xs col-md-1" ng-click="exportData()">EXCEL</a>
<a class="btn btn-danger btn-xs col-md-1" ng-click="nuevo()">PDF</a>
<a class="btn btn-warning btn-xs col-md-1" ng-click="nuevo()">IMPRIMIR</a>

<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel='stylesheet' type='text/css'>

    <div class="row">
    
        <div class="col-md-12">

            <div class="panel panel-default panel-table" style="overflow-x:scroll ; overflow-y: hidden; padding-bottom:10px;">
              <div class="panel-heading">
                <div class="row">
                  <div class="col col-xs-6">
                    <h3 class="panel-title">Clientes</h3>
                  </div>
                  <div class="col col-xs-6 text-right">
                    <button type="button" class="btn btn-xs btn-primary btn-create" ng-click="nuevo()">Crear Nuevo</button>
                  </div>
                </div>
              </div>
              <div class="panel-body">
                <table class="table table-striped table-bordered table-list" style='font-family:monospace;font-size:10'>
                  <thead>
                    <tr>
                        <th rowspan="2" class="text-center"><em class="fa fa-cog"></em></th>
                        <th><CENTER>Identificacion</CENTER></th>
                        <th><CENTER>TipoIdentificacion</CENTER></th>
                        <th><CENTER>Nombres</CENTER></th>
                        <th><CENTER>Apellidos</CENTER></th>
                        <th><CENTER>Direccion</CENTER></th>
                        <th><CENTER>Email</CENTER></th>
                        <th><CENTER>TipoCliente</CENTER></th>
                        <th><CENTER>TipoRuc</CENTER></th>
                        <th><CENTER>DiasCredito</CENTER></th>
                        <th><CENTER>MaxDecuento</CENTER></th>
                        <th><CENTER>CreditoTemp</CENTER></th>
                        <th><CENTER>Credito</CENTER></th>
                    </tr>
                    <tr>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.identificacion"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.tipo_identificacion"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.nombres"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.apellidos"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.direccion"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.email"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.cli_tipo"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.tipo_ruc"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.dias_credito"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.descuento_max"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.credito_temp"></td>
                        <td class="text-center"><input type="text" name="" class="form-control input-xs" ng-model="search.credito"></td>
                    </tr>
                  </thead>
                  <tbody>
                        <tr dir-paginate="c in clientes|filter:search|itemsPerPage:10" class="repeat-item" ng-animate="animate">
                            <td class="columnA">
                                <a class="btn btn-xs btn-warning glyphicon glyphicon-pencil" ng-click="modificar(c)"></a>
                                <a class="btn btn-xs btn-danger glyphicon glyphicon-remove" ng-click="anular(c)"></a>
                            </td>
                            <td class="columnB text-right">{{ c.identificacion }}</td>
                            <td class="columnC text-center">{{ c.tipo_identificacion | uppercase }}</td>
                            <td class="columnD text-right">{{ c.nombres }}</td>
                            <td class="columnE text-right">{{ c.apellidos }}</td>
                            <td class="columnF text-center">{{ c.direccion }}</td>
                            <td class="columnG text-right">{{ c.email }}</td>
                            <td class="columnH text-right">{{ c.cli_tipo }}</td>
                            <td class="columnI text-right">{{ c.tipo_ruc }}</td>
                            <td class="columnJ text-right">{{ c.dias_credito }}</td>
                            <td class="columnK text-center">{{ c.descuento_max }}</td>
                            <td class="columnMtext-right">{{ c.credito_temp }}</td>
                            <td class="columnN text-right">{{ c.credito }}</td>
                        </tr>
                    </tbody>
                </table>
            
              </div>
              <div class="panel-footer">
                <div class="row">
                  <div class="col col-xs-4">Page 1 of 5
                  </div>
                  <div class="col col-xs-8">
                    <dir-pagination-controls on-page-change="pageChanged(newPageNumber)"/>
                  </div>
                </div>
              </div>
            

</div></div></div>
<style type="text/css">
	.panel-table .panel-body{
  padding:0;
}

.panel-table .panel-body .table-bordered{
  border-style: none;
  margin:0;
}

.panel-table .panel-body .table-bordered > thead > tr > th:first-of-type {
    text-align:center;
    width: 100px;
}

.panel-table .panel-body .table-bordered > thead > tr > th:last-of-type,
.panel-table .panel-body .table-bordered > tbody > tr > td:last-of-type {
  border-right: 0px;
}

.panel-table .panel-body .table-bordered > thead > tr > th:first-of-type,
.panel-table .panel-body .table-bordered > tbody > tr > td:first-of-type {
  border-left: 0px;
}

.panel-table .panel-body .table-bordered > tbody > tr:first-of-type > td{
  border-bottom: 0px;
}

.panel-table .panel-body .table-bordered > thead > tr:first-of-type > th{
  border-top: 0px;
}

.panel-table .panel-footer .pagination{
  margin:0; 
}

/*
used to vertically center elements, may need modification if you're not using default sizes.
*/
.panel-table .panel-footer .col{
 line-height: 34px;
 height: 34px;
}

.panel-table .panel-heading .col h3{
 line-height: 30px;
 height: 30px;
}

.panel-table .panel-body .table-bordered > tbody > tr > td{
  line-height: 20px;
}

.input-xs {
  height: 22px;
  padding: 2px 5px;
  font-size: 12px;
  line-height: 1.5; /* If Placeholder of the input is moved up, rem/modify this. */
  border-radius: 3px;
}

/*table {
      width: 100%;
  }

td {
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis ;
    white-space: nowrap;
}

td.columnA {
    width: 25%;
}
td.columnD {
    width: 100%;
}*/

td.columnA {
    width: 1px;
    white-space: nowrap;
}

</style>