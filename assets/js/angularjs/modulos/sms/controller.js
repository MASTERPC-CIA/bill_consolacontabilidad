app.controller('envioCtrl', function ($scope, Data, $filter, $location) {

    $scope.init = function() {
        $scope.data = {};
        $scope.data.msg = '';
        $scope.text_email = '';
        $scope.asunto = '';
        $scope.correo = '';
    };

    $scope.init();

    $scope.send = function(datos) {
        Data.post('send', datos).then(function (result) {
        	Data.toast({"status":result.tipo,"message":result.msg});
        	$scope.init();
        });
    };

    $scope.send_mail = function() {
        send = {'email':$scope.correo,'asunto':$scope.asunto,'msg':CKEDITOR.instances.editor1.getData()}
        Data.post('enviar_mail', send).then(function (result) {
            Data.toast({"status":result.tipo,"message":result.msg});
            $scope.init();
        });
    };

    $scope.$watch('data.msg', function() {
        if(angular.isUndefined($scope.data.msg)){
            $scope.data.num = 0;
        }else{
            $scope.data.num = $scope.data.msg.length;
        }
    });
});

app.controller('clientesCtrl', function ($scope, Data, $filter, MyService, $uibModal, $interval) {
    $scope.init = function() {
        $scope.data = {};
        $scope.data.msg = '';
        $scope.envio = false;
        angular.forEach($scope.clientes, function(cliente) {
            cliente.select = false;
        });
        Data.post('select_all_tipo_clientes').then(function (result) {
        	$scope.tipos = result.query;
        });
    };
    $scope.init();

    $scope.find_tipo = function() {
        Data.post('select_all_clientes', $scope.selectedTipo).then(function (result) {
        	$scope.clientes = result.query;
        	$scope.count = result.count;
        });
    };

    var send_one = function(item, msg) {
        item.msg = msg;
        Data.post('send', item).then(function (result) {
            if(result){
                $scope.ok += 1;
            }else{
                $scope.fail += 1;
            }
            $scope.restantes = $scope.ok + $scope.fail;
            Data.toast({"status":result.tipo,"message":result.msg});
            if($scope.restantes == $scope.total){
                $scope.init();
            }
        });
    };

    $scope.send = function(msg, clientes) {
        var cont = 0;
        $scope.ok = 0;
        $scope.fail = 0;
        $scope.total = 0;
        $scope.restantes = 0;
        angular.forEach(clientes, function (item) {
            if(item.select){
                $scope.total += 1;
            }
        });
        var envio = $interval(function() {
            if(clientes[cont].select){
               $scope.envio = true;
               send_one(clientes[cont], msg);
            }
            cont++;
        }, 30000, $scope.total);
    };

    $scope.$watch('data.msg', function() {
        if(angular.isUndefined($scope.data.msg)){
            $scope.data.num = 0;
        }else{
            $scope.data.num = $scope.data.msg.length;
        }
    });

    $scope.$watch('select_all', function() {
        if($scope.select_all===true){
            angular.forEach($scope.clientes, function(cliente) {
                cliente.select = true;
            });
        }else{
            angular.forEach($scope.clientes, function(cliente) {
                cliente.select = false;
            });
        }
    });

    $scope.admin_cli = function(proveedor_find) {
        var cliente = '';
        Data.post('select_cli_x_ced',proveedor_find.cedula).then(function (result) {
            if(result.count > 0){
                MyService.data.cliente = proveedor_find;
                var modalInstance = $uibModal.open({
                  templateUrl: 'index/load_admin_cli',
                  controller: 'adminCliCtrl',
                  size: 'lg',
                  resolve: {
                    item: function () {
                      return cliente;
                    }
                  }
                });
                modalInstance.result.then(function(selectedObject) {
                    Data.post('select_all_clientes', $scope.selectedTipo).then(function (result) {
			        	$scope.clientes = result.query;
			        	$scope.count = result.count;
			        });
                });
            }
        });
    };

    $scope.columns = [
                        {text:"IDENTIFICACION"},
                        {text:"NOMBRES"},
                        {text:"APELLIDOS"},
                        {text:"CELULAR"},
                        {text:"EDITAR"},
                        {text:"ACCION"}
                    ];
});

app.controller('adminCliCtrl', function ($scope, Data, $filter, MyService, $uibModalInstance) {
    $scope.title = 'MODIFICAR CLIENTE';
    $scope.tipo_id = false;
    $scope.cliente = {"PersonaComercio_cedulaRuc":MyService.data.cliente.cedula,"nombres":MyService.data.cliente.nombres,"apellidos":MyService.data.cliente.apellidos,"celular":MyService.data.cliente.celular};

    $scope.cancel = function () {
        $uibModalInstance.close();
    };

    $scope.update = function (cliente) {
        Data.post('update_cli', cliente).then(function (rta) {
        	$uibModalInstance.close();
            Data.toast({"status":rta.tipo,"message":rta.msg});
        });
    };
});

app.controller('proveedoresCtrl', function ($scope, Data, $filter, $interval) {
    $scope.init = function() {
        $scope.data = {};
        $scope.data.msg = '';
        $scope.envio = false;
        angular.forEach($scope.proveedores, function(empleado) {
            empleado.select = false;
        });
        Data.post('select_all_proveedores').then(function (result) {
            $scope.proveedores = result.datos;
            $scope.count = result.count;
        });
    };
    $scope.init();

    $scope.$watch('data.msg', function() {
        if(angular.isUndefined($scope.data.msg)){
            $scope.data.num = 0;
        }else{
            $scope.data.num = $scope.data.msg.length;
        }
    });

    $scope.admin_pro = function(proveedor_find) {
        var cliente = '';
        Data.post('select_cli_x_ced',proveedor_find.cedula).then(function (result) {
            if(result.count > 0){
                MyService.data.cliente = proveedor_find;
                var modalInstance = $uibModal.open({
                  templateUrl: 'index/load_admin_cli',
                  controller: 'adminCliCtrl',
                  size: 'lg',
                  resolve: {
                    item: function () {
                      return cliente;
                    }
                  }
                });
                modalInstance.result.then(function(selectedObject) {
                    Data.post('select_all_clientes', $scope.selectedTipo).then(function (result) {
                        $scope.clientes = result.query;
                        $scope.count = result.count;
                    });
                });
            }
        });
    };

    var send_one = function(item, msg) {
        item.msg = msg;
        Data.post('send', item).then(function (result) {
            if(result){
                $scope.ok += 1;
            }else{
                $scope.fail += 1;
            }
            $scope.restantes = $scope.ok + $scope.fail;
            Data.toast({"status":result.tipo,"message":result.msg});
            if($scope.restantes == $scope.total){
                $scope.init();
            }
        });
    };

    $scope.send = function(msg, clientes) {
        var cont = 0;
        $scope.ok = 0;
        $scope.fail = 0;
        $scope.total = 0;
        $scope.restantes = 0;
        angular.forEach(clientes, function (item) {
            if(item.select){
                $scope.total += 1;
            }
        });
        var envio = $interval(function() {
            if(clientes[cont].select){
               $scope.envio = true;
               send_one(clientes[cont], msg);
            }
            cont++;
        }, 30000, $scope.total);
    };

    $scope.$watch('select_all', function() {
        if($scope.select_all){
            angular.forEach($scope.proveedores, function(proveedor) {
                proveedor.select = true;
            });
        }else{
            angular.forEach($scope.proveedores, function(proveedor) {
                proveedor.select = false;
            });
        }
    });

    $scope.columns = [
                        {text:"IDENTIFICACION"},
                        {text:"RAZON SOCIAL"},
                        {text:"CELULAR"},
                        {text:"EDITAR"},
                        {text:"ACCION"}
                    ];
});

app.controller('empleadosCtrl', function ($scope, Data, $filter, $interval) {
    $scope.init = function() {
        $scope.data = {};
        $scope.data.msg = '';
        $scope.envio = false;
        angular.forEach($scope.empleados, function(empleado) {
            empleado.select = false;
        });
        Data.post('select_all_empleados').then(function (result) {
            $scope.empleados = result.query;
            $scope.count = result.count;
        });
    };
    $scope.init();

    $scope.$watch('data.msg', function() {
        if(angular.isUndefined($scope.data.msg)){
            $scope.data.num = 0;
        }else{
            $scope.data.num = $scope.data.msg.length;
        }
    });

    $scope.admin_pro = function(proveedor_find) {
        var cliente = '';
        Data.post('select_cli_x_ced',proveedor_find.cedula).then(function (result) {
            if(result.count > 0){
                MyService.data.cliente = proveedor_find;
                var modalInstance = $uibModal.open({
                  templateUrl: 'index/load_admin_cli',
                  controller: 'adminCliCtrl',
                  size: 'lg',
                  resolve: {
                    item: function () {
                      return cliente;
                    }
                  }
                });
                modalInstance.result.then(function(selectedObject) {
                    Data.post('select_all_clientes', $scope.selectedTipo).then(function (result) {
                        $scope.clientes = result.query;
                        $scope.count = result.count;
                    });
                });
            }
        });
    };

    var send_one = function(item, msg) {
        item.msg = msg;
        Data.post('send', item).then(function (result) {
            if(result){
                $scope.ok += 1;
            }else{
                $scope.fail += 1;
            }
            $scope.restantes = $scope.ok + $scope.fail;
            Data.toast({"status":result.tipo,"message":result.msg});
            if($scope.restantes == $scope.total){
                $scope.init();
            }
        });
    };

    $scope.send = function(msg, clientes) {
        var cont = 0;
        $scope.ok = 0;
        $scope.fail = 0;
        $scope.total = 0;
        $scope.restantes = 0;
        angular.forEach(clientes, function (item) {
            if(item.select){
                $scope.total += 1;
            }
        });
        var envio = $interval(function() {
            if(clientes[cont].select){
               $scope.envio = true;
               send_one(clientes[cont], msg);
            }
            cont++;
        }, 30000, $scope.total);
    };

    $scope.$watch('select_all', function() {
        if($scope.select_all){
            angular.forEach($scope.empleados, function(empleado) {
                empleado.select = true;
            });
        }else{
            angular.forEach($scope.empleados, function(empleado) {
                empleado.select = false;
            });
        }
    });

    $scope.columns = [
                        {text:"IDENTIFICACION"},
                        {text:"NOMBRES"},
                        {text:"APELLIDOS"},
                        {text:"CELULAR"},
                        {text:"EDITAR"},
                        {text:"ACCION"}
                    ];
    
});

app.controller('cxcCtrl', function ($scope, Data, $filter, MyService, $uibModal, $interval) {
    $scope.init = function() {
        $scope.data = {};
        $scope.data.msg = '';
        $scope.envio = false;
        angular.forEach($scope.cxcs, function(cxc) {
            cxc.select = false;
        });
        Data.post('select_all_cxc').then(function (result) {
            $scope.cxcs = result.query;
            $scope.data.msg = result.msg;
            $scope.data.num = result.count;
        });
    };
    $scope.init();

    $scope.$watch('data.msg', function() {
        if(angular.isUndefined($scope.data.msg)){
            $scope.data.num = 0;
        }else{
            $scope.data.num = $scope.data.msg.length;
        }
    });

    $scope.$watch('select_all', function() {
        if($scope.select_all){
            angular.forEach($scope.cxcs, function(cxc) {
                cxc.select = true;
            });
        }else{
            angular.forEach($scope.cxcs, function(cxc) {
                cxc.select = false;
            });
        }
    });

    var send_one = function(item, msg) {
        item.msg = msg;
        Data.post('send', item).then(function (result) {
            if(result){
                $scope.ok += 1;
            }else{
                $scope.fail += 1;
            }
            $scope.restantes = $scope.ok + $scope.fail;
            Data.toast({"status":result.tipo,"message":result.msg});
            if($scope.restantes == $scope.total){
                $scope.init();
            }
        });
    };

    $scope.send = function(msg, clientes) {
        var cont = 0;
        $scope.ok = 0;
        $scope.fail = 0;
        $scope.total = 0;
        $scope.restantes = 0;
        angular.forEach(clientes, function (item) {
            if(item.select){
                $scope.total += 1;
            }
        });
        var envio = $interval(function() {
            if(clientes[cont].select){
               $scope.envio = true;
               send_one(clientes[cont], msg);
            }
            cont++;
        }, 30000, $scope.total);
    };

    $scope.admin_cli = function(proveedor_find) {
        var cliente = '';
        Data.post('select_cli_x_ced',proveedor_find.cedula).then(function (result) {
            if(result.count > 0){
                MyService.data.cliente = proveedor_find;
                var modalInstance = $uibModal.open({
                  templateUrl: 'index/load_admin_cli',
                  controller: 'adminCliCtrl',
                  size: 'lg',
                  resolve: {
                    item: function () {
                      return cliente;
                    }
                  }
                });
                modalInstance.result.then(function(selectedObject) {
                    Data.post('select_all_cxc', $scope.selectedTipo).then(function (result) {
                        $scope.cxcs = result.query;
                        $scope.count = result.count;
                    });
                });
            }
        });
    };
    
    $scope.columns = [
                        {text:'CI / RUC'},
                        {text:'CLIENTE'},
                        {text:'CELULAR'},
                        {text:'EMAIL'},
                        {text:'F. VENC.'},
                        {text:'SALDO'},
                        {text:'EDIT'},
                        {text:"ACCION"}
                    ];
});

app.controller('excelCtrl', function ($scope, Data, $filter, upload, MyService) {
    $scope.envio = false;
    $scope.envio_sms_excel = function(data) {
        send = {'msg':data.msg,'name_file':MyService.data.name_file}
        Data.post('envio_sms_excel', send).then(function (result) {
            Data.toast({"status":result.tipo,"message":result.msg});
        });
    };
    /*$scope.envio_mail_excel = function() {
        send = {'asunto':$scope.asunto,'msg':CKEDITOR.instances.editor2.getData(),'name_file':MyService.data.name_file}
        Data.post('envio_mail_excel', send).then(function (result) {
            Data.toast({"status":result.tipo,"message":result.msg});
        });
    };*/
    $scope.envio_mail_excel = function() {
        $scope.ok = 0;
        $scope.fail = 0;
        $scope.restantes = 0;
        send = {'asunto':$scope.asunto,'msg':CKEDITOR.instances.editor2.getData(),'name_file':MyService.data.name_file}
        Data.post('envio_mail_excel', send).then(function (result) {            
            $scope.total = result.count;
            $scope.envio = true;
            $scope.datos = result.list;
            angular.forEach(result.list, function(row) {
                send = {'email':row.correoDestinatario,'asunto':$scope.asunto,'msg':CKEDITOR.instances.editor2.getData()}
                Data.post('enviar_mail', send).then(function (result) {
                    if(result.aux === 1){ $scope.ok ++; }
                    if(result.aux === 2){ $scope.fail ++; }
                    $scope.restantes = $scope.ok + $scope.fail;
                    row.estado = result.msg;
                    if($scope.restantes == $scope.total){
                        $scope.ok = 0;
                        $scope.fail = 0;
                        $scope.restantes = 0;
                        Data.toast({"status":'ok',"message":'El envio se realizo correctamente...!!!!!!!!'});
                    }
                });
            });
        });
    };
});

app.controller('HomeCtrl', ['$scope', 'Data', 'upload', 'MyService', function ($scope, Data, upload, MyService) {

     $scope.uploadFile = function (){
        var name = 'hola';
        var file = $scope.file;
        var send = {};
        send.codigo = 'hola';
        send.file = file.name;
        upload.uploadFile(file, name).then(function (res)
        {
            MyService.data.name_file = res.data;
        })
    }
}]);

app.controller('configCtrl', function ($scope, Data, $filter, $interval) {
    $scope.init = function() {
        $scope.data = {};
        $scope.data.msg = '';
        $scope.envio = false;
        Data.post('config').then(function (result) {
            $scope.data.msg = result.msg;
            $scope.data.emails = result.emails;
            $scope.data.correo = result.emisor_correo;
            $scope.data.clave = result.emisor_clave;
            $scope.data.activado = true;
            $scope.data.desactivado = false;

            $scope.ok = 0;
            $scope.fail = 0;
            $scope.restantes = 0;
            $scope.total = 0;
        });
    };
    $scope.init();

    $scope.$watch('data.activado', function() {
        if(!$scope.data.activado){
            $scope.data.desactivado = true;
        }else{
            $scope.data.desactivado = false;
        }
    });

    $scope.$watch('data.desactivado', function() {
        if(!$scope.data.desactivado){
            $scope.data.activado = true;
        }else{
            $scope.data.activado = false;
        }
    });

    $scope.save = function(data) {
        Data.post('save_config', data).then(function (result) {
            Data.toast({"status":result.tipo,"message":result.msg});
        });
    };

    $scope.all_clientes = function() {
        $scope.clientes = {};
        Data.post('get_clientes').then(function (result) {
            $scope.clientes = result.query;
            $scope.total = $scope.clientes.length;
        });
    };

    $scope.eject = function() {
        var cont = 0;
        var envio = $interval(function() {
        Data.post('update_cel_cliente', $scope.clientes[cont]).then(function (result) {
                if(result.rta ===  true){
                    $scope.ok++;
                }else{
                    $scope.error++;
                }
                $scope.total = $scope.ok + $scope.error;
            });
            cont++;
        }, 1000, 2);
    };
});
app.service('upload', ["$http", "$q", function ($http, $q){
    this.uploadFile = function (file, name)
    {
        var deferred = $q.defer();
        var formData = new FormData();
        formData.append("name", name);
        formData.append("file", file);
        return $http.post("index/load_server", formData, {
            headers: {
                "Content-type": undefined
            },
            transformRequest: angular.identity
        })
                .success(function (res)
                {
                    deferred.resolve(res);
                })
                .error(function (msg, code)
                {
                    deferred.reject(msg);
                })
        return deferred.promise;
    }
}]);
app.directive('uploaderModel', ["$parse", function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs)
        {
            iElement.on("change", function (e)
            {
                $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
            });
        }
    };
}]);