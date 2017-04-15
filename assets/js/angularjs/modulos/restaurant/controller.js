app.controller('inicio', function ($scope, $modal, Data, $filter, ngCart, $http, MyService, $location) {
    $scope.grupo = {};
    $scope.producto = {};
    $scope.cliente_default = [];
    $scope.puntoventas = [];
    $scope.cedula_valida = false;
    $scope.product_X_cod = [];
    $scope.product_X_cod.stockactual = 0;
    $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
    $scope.bandera_codigo = false;

    /*Data.session().then(function () {
     
     });*/

    Data.get('get_ptoventa').then(function (data) {
        if (data.length > 0) {
            $scope.puntoventas.establecimiento = data[0].establecimiento;
            $scope.puntoventas.puntoemision = data[0].puntoemision;
            $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
            $scope.permiso = true;
        } else {
            $scope.permiso = false;
        }
    });

    Data.get('select_cli_x_ced/9999999999').then(function (result) {
        $scope.cliente_default = result.query[0];
        $scope.cliente_find = $scope.cliente_default;
        $scope.cedula_valida = true;
    });

    $scope.get_cart = function () {
        if (ngCart.getTotalItems() > 0) {
            send = {
                "cart": ngCart,
                "cliente": $scope.cliente_find
            };
            var modalInstance = $modal.open({
                templateUrl: 'index/load_cambio',
                controller: 'cambio_ctrl',
                resolve: {
                    item: function () {
                        return send;
                    }
                }
            });
            modalInstance.result.then(function (selectedObject) {
                if (selectedObject.rta == "OK") {
                    ngCart.empty();
                    Data.get('get_ptoventa').then(function (data) {
                        $scope.puntoventas.establecimiento = data[0].establecimiento;
                        $scope.puntoventas.puntoemision = data[0].puntoemision;
                        $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
                    });
                    $location.path('/print/' + selectedObject.venta.data);
                } else if (selectedObject.rta == "FAIL") {

                }
            });
        } else {
            Data.toast({"status": "error", "message": "LA FACTURA ESTA VACIA...!!!!!!!!!!"});
        }
    };

    $scope.buscar_letras = function () {
        Data.get('select_all_products/' + $scope.letras).then(function (result) {
            $scope.products = result.query;
        });
    };

    $scope.verificar_stock = function () {
        if ($scope.product_X_cod.qty != '') {
            if ($scope.product_X_cod.qty > $scope.product_X_cod.stockactual) {
                //$scope.product_X_cod.qty = $scope.product_X_cod.stockactual;
                Data.toast({"status": "error", "message": "LA CANTIDAD ES MAYOR AL STOCK"});
            }
        }
    };

    $scope.buscar_letras_cliente = function () {
        Data.get('select_all_clients/' + $scope.letras_clientes).then(function (result) {
            $scope.clientes = result;
        });
    };

    $scope.elegir_cliente = function (client) {
        $scope.cliente_find = client;
        $scope.bandera_verclientes = false;
        $scope.letras_clientes = '';
        Data.toast({"status": "success", "message": "Cliente ha sido seleccionado...!!!"});
    };

    $scope.activar_find = function () {
        if ($scope.bandera_verproductos) {
            $scope.bandera_verproductos = false;
        } else {
            $scope.bandera_verproductos = true;
        }
    };

    $scope.activar_find_clientes = function () {
        if ($scope.bandera_verclientes) {
            $scope.bandera_verclientes = false;
        } else {
            $scope.bandera_verclientes = true;
        }
    };

    $scope.calcular_valor = function (codigo) {
        Data.get('select_product_x_cod/' + codigo).then(function (result) {
            if (result.query.length > 0) {
                bandera = true;
            } else {
                bandera = false;
            }
            if (bandera) {
                $scope.product = result.query[0];
                $scope.product.priceA = result.priceA;
                $scope.product.priceB = result.priceB;
                $scope.product.priceC = result.priceC;
                $scope.product.qty = 1;
            } else {
                $scope.product.nombreUnico = 'NO EXISTE....!!!!!!';
                $scope.product.qty = 1;
            }
        });
    };

    $scope.add_cart = function (product, qty, price) {
        send = {"product": product, "qty": qty};
        $http.post('index/verificar_stock', send).then(function (result) {
            if (result.data.rta) {
                //Data.get('calcular_valor/'+product.codigo).then(function (result) {
                Data.get('select_product_x_cod/' + product.codigo).then(function (result) {
                    product.priceA = result.priceA;
                    product.priceB = result.priceB;
                    product.priceC = result.priceC;
                    ngCart.addItem(product.codigo, product.nombreUnico, product.priceA, qty, product);
                    Data.toast({"status": "success", "message": "AGREGADO...!!!"});
                });
            } else {
                Data.toast({"status": "error", "message": "FALLO.....!!!!"});
            }
        });
    };

    $scope.find_barcode = function (codigo) {
        if (codigo) {
            Data.get('select_product_x_cod/' + codigo).then(function (result) {
                if (result.query.length > 0) {
                    $scope.add(result, codigo, 1);
                } else {
                    Data.get('select_product_x_cod_comun/' + codigo).then(function (result) {
                        if (result.query.length > 0) {
                            $scope.add(result, codigo, 1);
                        } else {
                            Data.get('select_product_x_barcode/' + codigo).then(function (result) {
                                if (result.query.length > 0) {
                                    $scope.add(result, codigo, 1);
                                } else {
                                    Data.toast({"status": "error", "message": "No existe el codigo ingresado..!!!"});
                                    $scope.product_X_cod = [];
                                    $scope.product_X_cod.stockactual = 0;
                                    $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    $scope.add = function (result, codigo, qty) {
        qty_cart = ngCart.getItemById(codigo)._quantity;
        $scope.product_X_cod = result.query[0];
        $scope.product_X_cod.priceA = result.priceA;
        $scope.product_X_cod.price_iva = result.price_iva;
        $scope.product_X_cod.priceB = result.priceB;
        $scope.product_X_cod.priceC = result.priceC;
        $scope.product_X_cod.qty = parseInt(qty);
        if ($scope.product_X_cod.esServicio == 1) {
            $scope.product_X_cod.stockactual = 1000;
            if ($scope.product_X_cod.pvppromo > 0) {
                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, $scope.product_X_cod.qty, $scope.product_X_cod);
            } else {
                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            }
            Data.toast({"status": "success", "message": "PRODUCTO INGRESADO...!!!"});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stockactual = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        } else {
            //if(qty <= $scope.product_X_cod.stockactual){
            send = {
                "product": $scope.product_X_cod,
                "qty": ($scope.product_X_cod.qty + qty_cart)
            };
            $http.post('index/verificar_stock', send).then(function (result) {
                if (result.data.rta) {
                    if (!angular.isUndefined($scope.product_X_cod.codigo)) {
                        if ($scope.product_X_cod.pvppromo > 0) {
                            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, $scope.product_X_cod.qty, $scope.product_X_cod);
                        } else {
                            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
                        }
                    }
                }
                Data.toast({"status": "success", "message": result.data.msg});
                $scope.product_X_cod = [];
                $scope.product_X_cod.stockactual = 0;
                $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
            });
            /*}else{
             Data.toast({"status":"error","message":"LA CANTIDAD ES MAYOR AL STOCK"});
             $scope.product_X_cod.qty = $scope.product_X_cod.stockactual;
             }*/
        }
    }

    $scope.find_product_x_codigo = function (codigo, costopromediokardex, qty, price) {
        qty = parseInt(qty);
        if (codigo) {
            Data.get('get_tarifaIva').then(function (result) {
                $scope.product_X_cod.iva_calc = result.iva_calc;
            });
            if (!costopromediokardex) {
                Data.get('select_product_x_cod/' + codigo).then(function (result) {
                    if (result.query.length > 0) {
                        $scope.product_X_cod = result.query[0];
                        $scope.product_X_cod.priceA = result.priceA;
                        $scope.product_X_cod.price_iva = result.price_iva;
                        $scope.product_X_cod.priceB = result.priceB;
                        $scope.product_X_cod.priceC = result.priceC;
                        $scope.product_X_cod.qty = 1;
                        if ($scope.product_X_cod.esServicio == 1) {
                            $scope.product_X_cod.stockactual = 1000;
                        }
                    } else {
                        Data.get('select_product_x_cod_comun/' + codigo).then(function (result) {
                            if (result.query.length > 0) {
                                $scope.product_X_cod = result.query[0];
                                $scope.product_X_cod.priceA = result.priceA;
                                $scope.product_X_cod.price_iva = result.price_iva;
                                $scope.product_X_cod.priceB = result.priceB;
                                $scope.product_X_cod.priceC = result.priceC;
                                $scope.product_X_cod.qty = 1;
                                if ($scope.product_X_cod.esServicio == 1) {
                                    $scope.product_X_cod.stockactual = 1000;
                                }
                            } else {
                                Data.toast({"status": "success", "message": "NO EXISTE...!!!!"});
                                $scope.product_X_cod = [];
                                $scope.product_X_cod.qty = 1;
                                $scope.product_X_cod.stockactual = 0;
                                $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
                            }
                        });
                    }
                });
            } else {
                if ($scope.product_X_cod.esServicio == 1) {
                    send = {"product": $scope.product_X_cod, "qty": (qty + ngCart.getItemById(codigo)._quantity)};
                    $http.post('index/verificar_stock', send).then(function (result) {
                        if (result.data.rta) {
                            if (angular.isUndefined(price)) {
                                if ($scope.product_X_cod.pvppromo > 0) {
                                    ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, qty, $scope.product_X_cod);
                                } else {
                                    ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, qty, $scope.product_X_cod);
                                }
                            } else {
                                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, price, qty, $scope.product_X_cod);
                            }
                            Data.toast({"status": "success", "message": result.data.msg});
                            $scope.product_X_cod = [];
                            $scope.product_X_cod.stockactual = 0;
                            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
                        } else {
                            $scope.product_X_cod = [];
                            $scope.product_X_cod.stockactual = 0;
                            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
                            Data.toast({"status": "error", "message": result.data.msg});
                        }
                    });
                } else {
                    if (qty <= $scope.product_X_cod.stockactual) {
                        send = {"product": $scope.product_X_cod, "qty": (qty + ngCart.getItemById(codigo)._quantity)};
                        $http.post('index/verificar_stock', send).then(function (result) {
                            if (result.data.rta) {
                                if (angular.isUndefined(price)) {
                                    if ($scope.product_X_cod.pvppromo > 0) {
                                        ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, qty, $scope.product_X_cod);
                                    } else {
                                        ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, qty, $scope.product_X_cod);
                                    }
                                } else {
                                    ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, price, qty, $scope.product_X_cod);
                                }
                                Data.toast({"status": "success", "message": result.data.msg});
                                $scope.product_X_cod = [];
                                $scope.product_X_cod.stockactual = 0;
                                $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
                            } else {
                                $scope.product_X_cod = [];
                                $scope.product_X_cod.stockactual = 0;
                                $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
                                Data.toast({"status": "error", "message": result.data.msg});
                            }
                        });
                    } else {
                        Data.toast({"status": "error", "message": "LA CANTIDAD ES MAYOR AL STOCK"});
                        $scope.product_X_cod.qty = $scope.product_X_cod.stockactual;
                    }
                }
            }
        } else {
            $scope.product_X_cod = [];
            $scope.product_X_cod.stockactual = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        }
    }

    $scope.find_cli = function () {
        var cliente = '';
        Data.get('select_cli_x_ced/' + $scope.cliente_find.PersonaComercio_cedulaRuc).then(function (result) {
            if (result.count > 0) {
                $scope.cliente_find = result.query[0];
                $scope.es_cedula = true;
                $scope.es_ruc = false;
                $scope.cedula_valida = true;
                Data.toast({"status": "success", "message": "CLIENTE ENCONTRADO...!!!!!!!!!!"});
            } else {
                $scope.cedula_valida = false;
                $scope.cliente_find.nombres_apellidos = 'CLIENTE NO EXISTE...!!!!!!!!!!';
                Data.toast({"status": "error", "message": "CLIENTE NO EXISTE...!!!!!!!!!!"});
                MyService.data.cedula = $scope.cliente_find.PersonaComercio_cedulaRuc;
                var modalInstance = $modal.open({
                    templateUrl: 'index/load_admin_cli_view',
                    controller: 'admin_cli',
                    resolve: {
                        item: function () {
                            return cliente;
                        }
                    }
                });
                modalInstance.result.then(function (selectedObject) {
                    $scope.cliente_find = selectedObject;
                });
            }
        });
    };
});

app.controller('menu_principal', function ($scope, Data, MyService) {

    Data.get('consultar').then(function (data) {
        $scope.grupos = data;
    });

    $scope.consultar_cod = function (grupo) {
        MyService.data.grupo = grupo;
    };

    $scope.columns = [
        {text: "IMAGEN", predicate: "", sortable: false},
        {text: "NOMBRE", predicate: "nombre", sortable: true}
    ];
});

app.controller('submenu', function ($http, $scope, Data, MyService, ngCart) {
    $scope.columns = [
        {text: "IMAGEN", predicate: "img", sortable: false},
        {text: "NOMBRE", predicate: "nombreUnico", sortable: true},
        {text: "VALOR", predicate: "costopromediokardex", sortable: true},
        {text: "", predicate: "", sortable: true},
    ];

    Data.get('consultar_submenu/' + MyService.data.grupo.codigo).then(function (result) {
        $scope.productos = result;
    });
    $scope.cant = 1;

    $scope.remove_cart = function (codigo) {
        ngCart.removeItem(codigo);
    };

    $scope.find_barcode = function (codigo) {
        if (codigo) {
            Data.get('select_product_x_cod/' + codigo).then(function (result) {
                if (result.query.length > 0) {
                    $scope.add(result, codigo, 1);
                } else {
                    Data.get('select_product_x_cod_comun/' + codigo).then(function (result) {
                        if (result.query.length > 0) {
                            $scope.add(result, codigo, 1);
                        } else {
                            Data.get('select_product_x_barcode/' + codigo).then(function (result) {
                                if (result.query.length > 0) {
                                    $scope.add(result, codigo, 1);
                                } else {
                                    Data.toast({"status": "error", "message": "No existe el codigo ingresado..!!!"});
                                    $scope.product_X_cod = [];
                                    $scope.product_X_cod.stockactual = 0;
                                    $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    $scope.add = function (result, codigo, qty) {
        qty_cart = ngCart.getItemById(codigo)._quantity;
        $scope.product_X_cod = result.query[0];
        $scope.product_X_cod.priceA = result.priceA;
        $scope.product_X_cod.price_iva = result.price_iva;
        $scope.product_X_cod.priceB = result.priceB;
        $scope.product_X_cod.priceC = result.priceC;
        $scope.product_X_cod.qty = parseInt(qty);
        if ($scope.product_X_cod.esServicio == 1) {
            $scope.product_X_cod.stockactual = 1000;
            if ($scope.product_X_cod.pvppromo > 0) {
                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, $scope.product_X_cod.qty, $scope.product_X_cod);
            } else {
                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            }
            Data.toast({"status": "success", "message": "PRODUCTO INGRESADO...!!!"});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stockactual = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        } else {
            /*if(qty <= $scope.product_X_cod.stockactual){*/
            send = {
                "product": $scope.product_X_cod,
                "qty": ($scope.product_X_cod.qty + qty_cart)
            };
            $http.post('index/verificar_stock', send).then(function (result) {
                if (result.data.rta) {
                    if (!angular.isUndefined($scope.product_X_cod.codigo)) {
                        if ($scope.product_X_cod.pvppromo > 0) {
                            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, $scope.product_X_cod.qty, $scope.product_X_cod);
                        } else {
                            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
                        }
                    }
                }
                Data.toast({"status": "success", "message": result.data.msg});
                $scope.product_X_cod = [];
                $scope.product_X_cod.stockactual = 0;
                $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
            });
            /*}else{
             Data.toast({"status":"error","message":"LA CANTIDAD ES MAYOR AL STOCK"});
             $scope.product_X_cod.qty = $scope.product_X_cod.stockactual;
             }*/
        }
    }
});

app.controller('admin_cli', function ($scope, Data, $modalInstance, item, MyService) {
    $scope.title = 'NUEVO CLIENTE';
    $scope.btnText = 'GUARDAR';
    $scope.tipo_id = false;
    $scope.cliente = {"es_pasaporte": "0", "PersonaComercio_cedulaRuc": MyService.data.cedula, "nombres": "", "apellidos": "", "razonsocial": "", "direccion": "loja", "celular": "", "email": ""};

    $scope.identificacion = function () {
        if (!angular.isUndefined($scope.cliente)) {
            if ($scope.cliente.PersonaComercio_cedulaRuc.length == 13) {
                $scope.tipo_id = true;
            } else {
                $scope.tipo_id = false;
            }
        }
    };

    $scope.cancel = function () {
        Data.get('select_cli_x_ced/9999999999').then(function (result) {
            $modalInstance.close(result.query[0]);
        });
    };

    $scope.new_cli = function (cliente) {
        Data.post('new_cli', cliente).then(function (rta) {
            if (rta.id > 0) {
                Data.toast({"status": "success", "message": rta.msg});
                Data.get('select_cli_x_ced/' + cliente.PersonaComercio_cedulaRuc).then(function (result) {
                    $modalInstance.close(result.query[0]);
                });
            } else {
                Data.toast({"status": "error", "message": rta.msg});
            }
        });
    };
});

app.controller('cambio_ctrl', function ($http, $scope, Data, $modalInstance, item, MyService) {
    $scope.title = 'CAMBIO';
    $scope.total_compra = angular.copy(item.cart.Total().toFixed(2));
    $scope.recibo = 0;
    $scope.msg = '';
    $scope.cliente = item.cliente;

    $scope.$watch('recibo', function () {
        if (parseFloat($scope.recibo) >= parseFloat($scope.total_compra)) {
            /*console.log('recibo mayor o igual a total de la compra'+$scope.recibo+' >= '+$scope.total_compra);*/
            $scope.msg = '';
            $scope.cambio = ($scope.recibo - $scope.total_compra).toFixed(2);
        } else {
            /*console.log('menor a total compra'+$scope.recibo+' < '+$scope.total_compra);*/
            $scope.cambio = 0;
            $scope.msg = 'EL VALOR RECIBIDO ES MENOR AL TOTAL DE LA COMPRA';
        }
    });

    $scope.save_fact = function () {
        var aux = 0;
        factura = {"subtotalBruto": item.cart.Subtotal(),
            "subtotalNeto": item.cart.Subtotal(),
            "ivaval": item.cart.IVA(),
            "totalCompra": item.cart.Total(),
            "valorrecibidoefectivo": $scope.recibo,
            "valorcambio": $scope.cambio,
            "tarifacerobruto": item.cart.totalCero(),
            "tarifaceroneto": item.cart.totalCero(),
            "tarifadocebruto": item.cart.totalDoce(),
            "tarifadoceneto": item.cart.totalDoce(),
            "subtbrutobienes": item.cart.totalBienes(),
            "subtbrutoservicios": item.cart.totalServicios(),
            "subtnetobienes": item.cart.totalBienes(),
            "subtnetoservicios": item.cart.totalServicios(),
            "iceval": aux, "efectivoval": aux,
            "baseiva": item.cart.totalDoce()
        };
        send = {
            "factura": factura,
            "detalle": item.cart.getItems(),
            "cliente": $scope.cliente
        };
        $http.post('index/get_cart', send).then(function (result) {
            Data.toast({"status": "success", "message": "FACTURA HA SIDO ARCHIVADA"});
            var x = [];
            x.rta = 'OK';
            x.venta = result;
            $modalInstance.close(x);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
});

app.controller('img_ctrl', ['$scope', 'Data', 'upload', 'mySharedService', function ($scope, Data, upload, mySharedService) {

        Data.get('consultar_productos').then(function (result) {
            $scope.productos = result;
        });

        $scope.columns = [
            {text: "Codigo", predicate: "codigo", sortable: true},
            {text: "Nombre", predicate: "nombre", sortable: true},
            {text: "Imagen", predicate: "img", sortable: true},
            {text: "Accion", predicate: "", sortable: true}
        ];

        $scope.$on('handleBroadcast', function () {
            $scope.productos = mySharedService.message;
        });

    }]);

app.controller('grupo_img_ctrl', ['$scope', 'Data', 'upload', 'mySharedService', function ($scope, Data, upload, mySharedService) {

        Data.get('consultar').then(function (data) {
            $scope.grupos = data;
        });

        $scope.columns = [
            {text: "Codigo", predicate: "codigo", sortable: true},
            {text: "Nombre", predicate: "nombre", sortable: true},
            {text: "Imagen", predicate: "img", sortable: true},
            {text: "Accion", predicate: "", sortable: true}
        ];

        $scope.$on('handleBroadcast', function () {
            $scope.grupos = mySharedService.message;
        });

    }]);

app.controller('HomeCtrl', ['$scope', 'Data', 'upload', 'mySharedService', function ($scope, Data, upload, mySharedService) {

        $scope.uploadFile = function (x)
        {
            var name = x.codigo;
            var file = $scope.file;
            var send = {};
            send.codigo = x.codigo;
            send.file = file.name;
            upload.uploadFile(file, name).then(function (res)
            {
                Data.put('update_producto', send).then(function (result) {
                    mySharedService.prepForBroadcast(result);
                    Data.toast({"status": "success", "message": "SE HA ACTUALIZADO LA IMAGEN...!!!!!!!!!!"});
                });
            })
        }

        $scope.$on('handleBroadcast', function () {
            $scope.productos = mySharedService.message;
        });
    }])

app.controller('grupoImgCtrl', ['$scope', 'Data', 'upload', 'mySharedService', function ($scope, Data, upload, mySharedService) {

        $scope.uploadFile = function (x)
        {
            var name = x.codigo;
            var file = $scope.file;
            var send = {};
            send.codigo = x.codigo;
            send.file = file.name;
            upload.uploadFile_grupo(file, name).then(function (res)
            {
                Data.put('update_grupo', send).then(function (result) {
                    mySharedService.prepForBroadcast(result);
                    Data.toast({"status": "success", "message": "SE HA ACTUALIZADO LA IMAGEN...!!!!!!!!!!"});
                });
            })
        }

        $scope.$on('handleBroadcast', function () {
            $scope.grupos = mySharedService.message;
        });
    }])

app.controller('printCtrl', ['$scope', function ($scope) {
        $("#puntoventaprint_view").printThis({optprint1});
    }])

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
    }])

app.service('upload', ["$http", "$q", function ($http, $q)
    {
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

        this.uploadFile_grupo = function (file, name)
        {
            var deferred = $q.defer();
            var formData = new FormData();
            formData.append("name", name);
            formData.append("file", file);
            return $http.post("index/load_server_grupo", formData, {
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
    }])