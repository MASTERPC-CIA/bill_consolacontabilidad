app.controller('customersCtrl', function ($scope, $modal,Data,$filter) {
    $scope.pageSize = 5;
    $scope.currentPage = 1;
    $scope.name = {"cod":"","detalle_retencion":"","porcent_retencion":"","impuesto_renta":""};
    $scope.msg = '';

    Data.get('consultar').then(function (data) {
        //console.log(data);
        $scope.names = data;
    });

    $scope.delete = function(name){
        if(confirm("Esta seguro que desea eliminar este impuesto...?")){
            Data.delete("eliminar/"+name.cod).then(function (result){
                if(result.rows > 0){
                    $scope.names = _.without($scope.names, _.findWhere($scope.names, {cod:name.cod}));
                }
                $scope.msg = result.msg;
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };

    $scope.open = function (p,size) {
        var modalInstance = $modal.open({
          templateUrl: 'retenciones/admin',
          controller: 'productEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
    	});

        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.names.push(selectedObject);
                $scope.names = $filter('orderBy')($scope.names, 'id', 'reverse');
            }else if(selectedObject.save == "update"){
                p.cod = selectedObject.cod;
                p.detalle_retencion = selectedObject.detalle_retencion;
                p.porcent_retencion = selectedObject.porcent_retencion;
                p.impuesto_renta = selectedObject.impuesto_renta;
                p.cta_cont_compras = selectedObject.cta_cont_compras;
                p.cta_cont_ventas = selectedObject.cta_cont_ventas;
                p.col_compra = selectedObject.col_compra;
                p.col_venta = selectedObject.col_venta;
            }
        });
    };

    $scope.columns = [
                        {text:"CODIGO",predicate:"cod",sortable:true},
                        {text:"DETALLE",predicate:"detalle_retencion",sortable:true},
                        {text:"PORCENTAJE",predicate:"porcent_retencion",sortable:true},
                        {text:"TIPO DE IMPUESTO",predicate:"impuesto_renta",reverse:true,sortable:true},
                        {text:"Cta. Contable Compras",predicate:"cta_cont_compras",reverse:true,sortable:true},
                        {text:"Cta. Contable Ventas",predicate:"cta_cont_ventas",reverse:true,sortable:true},
                        {text:"Col. Compras",predicate:"col_compra",reverse:true,sortable:true},
                        {text:"Col. Ventas",predicate:"col_venta",reverse:true,sortable:true},
                        {text:"ACCION",predicate:"",sortable:false}
                    ];
});

app.controller('productEditCtrl', function ($scope, $modalInstance, item, Data) {

    $scope.name = angular.copy(item);

    if($scope.name.detalle_retencion.length != 0){
        $scope.tipo_nuevo = false;
        $scope.tipo_modificar = true;
        $scope.title = 'Modificar Impuesto';
        $scope.buttonText = 'MODIFICAR';
    }else{
        Data.get('consultar_cod').then(function (data) {
            $scope.codigos=data;
        });
        $scope.tipo_nuevo = true;
        $scope.tipo_modificar = false;
        $scope.title = 'Nuevo Impuesto';
        $scope.buttonText = 'NUEVO';
    }
    
    $scope.consultar_cod = function (name, $scope) {
        Data.get('consultar_x_cod/'+$scope.cod).then(function (result) {
            name.detalle_retencion = result.detalle_retencion;
            name.porcent_retencion = result.porcent_retencion;
            name.impuesto_renta = result.impuesto_renta;
        });
    };
        
    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
    
    var original = item;

    $scope.isClean = function() {
        return angular.equals(original, $scope.name);
    }

    $scope.save = function (codigo, name) {
        if($scope.title == 'Modificar Impuesto'){
                Data.put('modificar/'+name.cod, name).then(function (result) {
                var x = angular.copy(name);
                x.save = 'update';
                $modalInstance.close(x);
                $scope.msg = result.msg;
            });
        }else{
                name.cod = codigo.cod;
                Data.post('guardar', name).then(function (result) {
                var x = angular.copy(name);
                x.save = 'insert';
                x.id = result;
                $modalInstance.close(x);
                $scope.msg = result.msg;
            });
        }
    };
});