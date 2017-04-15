app.controller('Init', function ($scope, Data, $http, $filter) {
	$scope.facturas = [];
	$scope.codigos = [];
	$scope.totales = [];
	$scope.codigo_view = true;
	$scope.secuencia_view = true;
	$scope.cliente_ci_view = true;
	$scope.cliente_nombres_view = true;
	$scope.emision_view = true;
	$scope.archivada_view = true;
	$scope.autorizada_view = true;
	$scope.vence_view = true;
	$scope.subtotalNeto_view = true;
	$scope.descuentovalor_view = true;
	$scope.subtotalBruto_view = true;
	$scope.iva_view = true;
	$scope.totalCompra_view = true;
	$scope.tipo_pago_view = true;
	$scope.precio_view = true;
	$scope.asiento_contable_view = false;
	$scope.usuario_view = true;

	$scope.pendiente = false;
	$scope.archivada = true;
	$scope.autorizado_sri = false;
	$scope.anuladas = false;

	$scope.vendedor_view = false;
	$scope.tecnico_view = false;
	$scope.edit_cli_view = false;
	$scope.series_view = false;
	$scope.tot_bienes_view = false;
	$scope.tot_servicios_view = false;
	$scope.observaciones_view = false;

	$scope.util_tot_view = false;
	$scope.util_percent_view = false;
	$scope.util_concesion_view = false;
	$scope.edit_fact_view = false;
	$scope.generar_guia = false;
    $scope.provincia_view = true;
    $scope.sector_view = true;
	
	$scope.ver_costos = false;
	$scope.change_invoice_date = false;
	$scope.change_user = false;

	$scope.cliente_view = {};
	$scope.cliente_view.estado = false;

	$scope.comprobantes = {};

	$scope.filas = [{'valor':'5'},{'valor':'10'},{'valor':'15'},{'valor':'20'},{'valor':'30'},{'valor':$scope.facturas.length}];
	$scope.filas_now = $scope.facturas.length;

	$scope.clientes = [];
    $scope.selectedCliente = [];
    $scope.selectedCliente.originalObject = [];

    $scope.farchivada_ini = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.farchivada_fin = $filter('date')(new Date(), 'yyyy-MM-dd');
    
    Data.get('select_all_clientes').then(function (result) {
        $scope.clientes = result;
    });

    Data.get('load_datos_init').then(function (result) {
    	$scope.vendedores = result.vendedores;
        $scope.tecnicos = result.tecnicos;
        $scope.usuarios = result.usuarios;
        $scope.ventatipos = result.ventatipos;
        $scope.establecimientos = result.establecimientos;
        $scope.pemisiones = result.pemisiones;
        $scope.ventapuntos = result.ventapuntos;
        $scope.tiposcomprobantes = result.tiposcomprobantes;
        $scope.selectedTipoComprobante = result.tiposcomprobantes[0].cod;
        /*Para filtros de busqueda por provincia y por sectores MKCO 20-07-2016*/
        $scope.provincias = result.provincias; 
        $scope.sectores = result.sectores;
//        $scope.tiposservicios=result.tiposservicios;
//        $scope.selectedTipoServicio=result.tiposservicios[0].id;
    });

	Data.get('permisos_users').then(function (result) {
        if(result.ver_costos){
        	$scope.ver_costos = true;
        	$scope.util_tot_view = true;
			$scope.util_percent_view = true;
			$scope.util_concesion_view = true;
			$scope.edit_fact_view = true;
			$scope.generar_guia = true;
			$scope.asiento_contable_view = true;
        }
        if(result.change_invoice_date){
        	$scope.edit_fact_view = true;
        	$scope.generar_guia = true;
        }
        if(result.change_user){
        	$scope.edit_cli_view = true;
        }
        if(result.root){
        	$scope.ver_costos = true;
        	$scope.util_tot_view = true;
			$scope.util_percent_view = true;
			$scope.util_concesion_view = true;
			$scope.edit_fact_view = true;
			$scope.generar_guia = true;
			$scope.edit_cli_view = true;	
        }
        if(result.make_nota_credito){
        	$scope.asiento_contable_view = true;	
        }
    });

	$scope.buscar = function(){
        if(angular.isUndefined($scope.selectedCliente)){
            $scope.cliente_select = '';
        }else{
            if($scope.selectedCliente.originalObject != null){
                $scope.cliente_select = $scope.selectedCliente.originalObject.ci;
            }else{
                $scope.cliente_select = '';
            }
        }
		formData =  { 
                            "pendiente" : $scope.validate($scope.pendiente),
	                    "archivada" : $scope.validate($scope.archivada),
	                    "anuladas" : $scope.validate($scope.anuladas),
	                    "autorizada" : $scope.validate($scope.autorizada),
	                    "eliminadas" : $scope.validate($scope.eliminadas),

	                    "codigofactventa" : $scope.validate($scope.codigofactventa),
	                    "secuencia" : $scope.validate($scope.secuencia),
	                    "vendedor" : $scope.validate($scope.selectedVendedor),
	                    "tecnico" : $scope.validate($scope.selectedTecnico),
	                    "usuario" : $scope.validate($scope.selectedUsuario),
	                    "tipo" : $scope.validate($scope.selectedVentaTipo),
	                    "establecimiento" : $scope.validate($scope.selectedEstablecimiento),
	                    "emision" : $scope.validate($scope.selectedPemision),
	                    "femision_ini" : $scope.validate($scope.femision_ini),
	                    "femision_fin" : $scope.validate($scope.femision_fin),
	                    "farchivada_ini" : $scope.validate($scope.farchivada_ini),
	                    "farchivada_fin" : $scope.validate($scope.farchivada_fin),
	                    "fautorizada_ini" : $scope.validate($scope.fautorizada_ini),
	                    "fautorizada_fin" : $scope.validate($scope.fautorizada_fin),
	                    "comprobante" : $scope.validate($scope.selectedTipoComprobante),
	                    "cliente" : $scope.validate($scope.cliente_select),
	                    "provincia" : $scope.validate($scope.selectedProvincia),
	                    "sector" : $scope.validate($scope.selectedSector)
                	};
        $http.post('ventasjs/find',formData).then(function (result) {
            if(result){
            	$scope.facturas = result.data.query;
                $scope.codigo = result.data.codigo;
            	$scope.totales = result.data.sum[0];
            	$scope.filas[5].valor = $scope.facturas.length;
            }
            $scope.pendiente = false;
            $scope.archivada = false;
            $scope.anuladas = false;
            $scope.autorizada = false;
            $scope.eliminadas = false;
        });
    };

    $scope.pendiente_elect = function(){
        $scope.archivada = false;
        $scope.anuladas = false;
        $scope.autorizada = false;
        $scope.eliminadas = false;
    };

    $scope.archivada_elect = function(){
    	$scope.pendiente = false;
        $scope.anuladas = false;
        $scope.autorizada = false;
        $scope.eliminadas = false;
    };

    $scope.autorizada_elect = function(){
    	$scope.pendiente = false;
        $scope.archivada = false;
        $scope.anuladas = false;
        $scope.eliminadas = false;
    };

    $scope.anulada_elect = function(){
    	$scope.pendiente = false;
        $scope.archivada = false;
        $scope.autorizada = false;
        $scope.eliminadas = false;
    };
    
    $scope.eliminada_elect = function(){
    	$scope.pendiente = false;
        $scope.archivada = false;
        $scope.autorizada = false;
        $scope.anuladas = false;
    };

    $scope.validate = function(valor){
    	var send;
    	if((angular.isUndefined(valor))||(valor==-1)){
    		send = '';
    	}else{
    		send = valor;
    	}
    	return send;
    };

    $scope.load_color = function(estado,autorizado){
    	var color_send;
    	if(estado == 0){
    		color_send = 'blue';
    	}
    	if(estado < 0){
    		color_send = 'red';
    	}
    	if(estado == 1){
    		color_send = 'black';
    	}
    	if((estado == 2) && (autorizado < 1)){
    		color_send = '#ff6600';
    	}
    	if((estado == 2) && (autorizado > 0)){
    		color_send = 'green';
    	}
    	return {"color":color_send};
    };

    $scope.filas_now_change = function(valor){
    	$scope.filas_now = valor.valor;
    };

    $scope.find_cli = function() {
        Data.get('select_cli_x_ced/'+$scope.cliente_view.PersonaComercio_cedulaRuc).then(function (result) {
            if(result.length > 0){
                $scope.cliente_view = result[0];
                $scope.cliente_view.estado = true;
            }
        });
    };

    $scope.quit_cli = function() {
        $scope.selectedCliente.title = '';
        $scope.selectedCliente.originalObject = null;
        $scope.cliente_view.estado = false;
    };
});

app.controller('ModalDemoCtrl', function ($scope, $http, $uibModal, $log, MyService) {
	$scope.animationsEnabled = true;

  	$scope.open = function (size, cliente) {
  		$http.post('ventasjs/select_cli',cliente).then(function (result) {
	        if(result){
	        	MyService.data.cliente = result.data;
	        	var modalInstance = $uibModal.open({
				      animation: $scope.animationsEnabled,
				      templateUrl: 'myModalContent.html',
				      controller: 'ModalInstanceCtrl',
				      size: size,
				      resolve: {
				        item: function () {
				          return cliente;
				        }
				      }
				});
				modalInstance.result.then(function (selectedItem) {
				    if(selectedItem.rta == "OK"){
		                cliente = selectedItem;
		            }
				});
	    	}
    	});    	
    };

  	$scope.toggleAnimation = function () {
    	$scope.animationsEnabled = !$scope.animationsEnabled;
  	};
});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item, MyService, $http, Data) {
	$scope.cliente = MyService.data.cliente[0];

	$scope.ok = function () {
		$http.post('ventasjs/update_cli',$scope.cliente).then(function (result) {
			var x = '';
			if(parseInt(result.data) > 0){
				Data.toast({"status":"success","message":"HA SIDO MODIFICADO...!!!!!!!!!!"});
				x.rta = 'OK';
			}else{
				Data.toast({"status":"error","message":"HA OCURRIDO UN ERROR AL ACTUALIZAR...!!!!!!!!!!"});
				x.rta = 'FAIL';
			}
			$uibModalInstance.close(x);
		});		
  	};

  	$scope.cancel = function () {
    	$uibModalInstance.dismiss('cancel');
  	};
});

app.controller('EditFactCtrl', function ($scope, $http, $uibModal, $log) {
	$scope.animationsEnabled = true;

  	$scope.open = function (size, val) {
  		$http.post('ventasjs/select_fact',val.codigo).then(function (rta) {
	        if(rta){
	        	var modalInstance = $uibModal.open({
				      animation: $scope.animationsEnabled,
				      templateUrl: 'modalFacturaEdit.html',
				      controller: 'EditFactInstanceCtrl',
				      size: size,
				      resolve: {
				        item: function () {
				          return rta;
				        }
				      }
				});
				modalInstance.result.then(function(selectedObject) {
				    if(selectedObject.rta == "OK"){
		                val.nroAutorizacion = selectedObject.nroAutorizacion;
		                val.vendedor = selectedObject.vendedor;
		                val.tecnico = selectedObject.tecnico;
		                val.observaciones = selectedObject.observaciones;
		                val.tipo_pago = selectedObject.tipo_pago;
		            }
				});
	    	}
    	});    	
    };

  	$scope.toggleAnimation = function () {
    	$scope.animationsEnabled = !$scope.animationsEnabled;
  	};
});

app.controller('EditFactInstanceCtrl', function ($scope, $uibModalInstance, item, $http, Data) {
	$scope.factura = item.data.factura;
	$scope.empleados = item.data.empleados;
	$scope.tipo_pagos = item.data.tipo_pagos;
	$scope.establecimientos = item.data.establecimientos;
	$scope.pemisiones = item.data.pemisiones;

	$scope.vendedor_default = _.findWhere($scope.empleados, {id:item.data.vendedor_default.id}).id;
	$scope.tecnico_default = _.findWhere($scope.empleados, {id:item.data.tecnico_default.id}).id;
	$scope.tipopago_default = _.findWhere($scope.tipo_pagos, {id:item.data.tipopago_default.id}).id;
	$scope.establecimiento_default = _.findWhere($scope.establecimientos, {establecimiento:item.data.establecimiento_default});
	$scope.pemision_default = _.findWhere($scope.pemisiones, {pemision:item.data.pemision_default}).pemision;

	$scope.ok = function () {
		send = 	{	 
	                "codigofactventa" : $scope.factura.codigofactventa,
	                "nroAutorizacion" : $scope.factura.nroAutorizacion,
	                "observaciones" : $scope.factura.observaciones,
	                "empleado_vendedor" : $scope.vendedor_default,
	                "tecnico_id" : $scope.tecnico_default,
	                "tipo_pago" : $scope.tipopago_default,
	                "puntoventaempleado_establecimiento" : $scope.establecimiento_default,
	                "puntoventaempleado_puntoemision" : $scope.pemision_default,
	                "secuenciafactventa" : $scope.factura.secuencia,
	                "fechaCreacion" : $scope.factura.fechaCreacion,
	                "fechaarchivada" : $scope.factura.fechaarchivada,
	                "autorizado_sri" : $scope.factura.autorizado_sri,
	                "mensaje_sri" : $scope.factura.mensaje_sri
                };
		$http.post('ventasjs/update_fact',send).then(function (result) {
			var x = angular.copy(result.data.query);
			if(parseInt(result.data.update) > 0){
				x.rta = 'OK';
				$uibModalInstance.close(x);
				Data.toast({"status":"success","message":"HA SIDO MODIFICADO...!!!!!!!!!!"});
			}else{
				x.rta = 'FAIL';
				$uibModalInstance.close(x);
				Data.toast({"status":"error","message":"HA OCURRIDO UN ERROR AL ACTUALIZAR...!!!!!!!!!!"});
			}
		});
  	};

  	$scope.cancel = function () {
    	$uibModalInstance.dismiss('cancel');
  	};
});