app.controller('inicio', function ($scope, $modal, Data, $filter, ngCart, $http, MyService, $location) {
    ngCart.empty();
    $scope.producto = {};
    $scope.cliente_default = [];
    $scope.puntoventas = [];
    $scope.empleado_find = [];
    $scope.cedula_valida = false;
    $scope.product_X_cod = [];
    $scope.product_X_cod.stock = 0;
    $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
    $scope.bandera_codigo = false;
    $scope.factura_venta = '01';
    $scope.bandera_verproductos = true;
    $scope.res = [];
    
    var now = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.res.fecha_emision = now;

    $scope.get_productos_by_cod = function () {
        Data.get('select_products_by_cod/' + $scope.prod_codigo).then(function (result) {
            $scope.prods_by_cod = result.query;
        });
    };
    $scope.get_productos_by_cod2 = function () {
        Data.get('select_products_by_cod2/' + $scope.prod_codigo2).then(function (result) {
            $scope.prods_by_cod2 = result.query;
        });
    };
    $scope.get_productos_by_name = function () {
        Data.get('select_products_by_name/' + $scope.prod_name).then(function (result) {
            $scope.prods_by_name = result.query;
        });
    };

    $scope.get_productos_by_barcode = function () {
        Data.get('select_products_by_name/' + $scope.prod_barras).then(function (result) {
            $scope.prods_by_barras = result.query;
        });
    };


    Data.get('get_ptoventa').then(function (data) {
        if (data.length > 0) {
            $scope.empleado_find.PersonaComercio_cedulaRuc = data[0].PersonaComercio_cedulaRuc;
            $scope.empleado_find.nombres_apellidos = data[0].nombres_apellidos;
            $scope.puntoventas.establecimiento = data[0].establecimiento;
            $scope.puntoventas.puntoemision = data[0].puntoemision;
            $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
            $scope.permiso = true;
            Data.get('empleado_cli_x_ced/' + $scope.empleado_find.PersonaComercio_cedulaRuc).then(function (result) {
                $scope.empleado_default = result.query[0];
                $scope.empleado_find = $scope.empleado_default;
                $scope.cedula_valida = true;
            });
        } else {
            $scope.permiso = false;
        }
    });
    Data.get('select_cli_x_ced/9999999999').then(function (result) {
        $scope.cliente_default = result.query[0];
        $scope.cliente_find = $scope.cliente_default;
        $scope.cedula_valida = true;
    });

    Data.get('select_all_empleados').then(function (result) {
        $scope.vendedores = result.vendedores;
    });

    $scope.get_cart = function (res) {
        console.log(ngCart.getItems());
        if (ngCart.getTotalItems() > 0) {
            val = true;
            for (index = 0; index < ngCart.getItems().length; ++index) {
                stock = ngCart.getItems()[index]._data.stock;
                if (stock <= 0) {
                    val = false;
                    break;
                }
            }
            if (val == true) {
                send = {
                    "cart": ngCart,
                    "cliente": $scope.cliente_find,
                    "empleado": $scope.empleado_find,
                    "punto_venta": $scope.puntoventas,
                    "fecha_emision": $scope.res,
                    "tipo_comprobante": $scope.factura_venta
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
                Data.toast({"status": "error", "message": "PRODUCTO SIN STOCK..."});
            }
        } else {
            Data.toast({"status": "error", "message": "LA FACTURA ESTA VACIA...!!!!!!!!!!"});
        }
    };
    $scope.buscar_letras = function () {
        Data.get('select_all_products/' + $scope.letras+"/1").then(function (result) {
            $scope.products = result.query;
        });
    };
    $scope.verificar_stock = function () {
        if ($scope.product_X_cod.qty != '') {
            if ($scope.product_X_cod.qty > $scope.product_X_cod.stock) {
                //$scope.product_X_cod.qty = $scope.product_X_cod.stock;
                Data.toast({"status": "error", "message": "LA CANTIDAD ES MAYOR AL STOCK"});
            }
        }
    };
    $scope.find_emp = function () {
        var empleado = '';
        Data.get('empleado_cli_x_id/' + $scope.empleado_find.empl_id).then(function (result) {
            if (result.count > 0) {
                $scope.empleado_find = result.query[0];
                $scope.es_cedula = true;
                $scope.es_ruc = false;
                $scope.cedula_valida = true;
                Data.toast({"status": "success", "message": "EMPLEADO ENCONTRADO...!!!!!!!!!!"});
            } else {
                $scope.cedula_valida = false;
                $scope.empleado_find.nombres_apellidos = 'EMPLEADO NO EXISTE...!!!!!!!!!!';
                Data.toast({"status": "error", "message": "EMPLEADO NO EXISTE...!!!!!!!!!!"});
            }
        });
    }
    $scope.buscar_letras_cliente = function () {
        Data.get('select_all_clients/' + $scope.letras_clientes).then(function (result) {
            $scope.clientes = result;
        });
    };
    $scope.elegir_cliente = function (client) {
        $scope.cliente_find = client;
        $scope.bandera_verclientes = false;
        $scope.letras_clientes = '';
        Data.toast({"status": "success", "message": "Cliente seleccionado...!!!"});
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
    $scope.add_producto = function (pro) {
        if (pro != null) {

            producto = pro.codigo;

            Data.get('select_product_x_cod/' + producto + "/1").then(function (result) {
                if (result.query.length > 0) {
                    $scope.add(result, producto, 1);
                } else {
                    Data.toast({"status": "error", "message": "No existe el codigo ingresado..!!!"});
                    $scope.product_X_cod = [];
                    $scope.product_X_cod.stock = 0;
                    $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
                }
            });
        }
        $scope.selectedProduct = {};
        $scope.prods_by_cod = null;
        $scope.prods_by_cod2 = null;
        //$scope.prods_by_barras = null;
        $scope.prods_by_name = null;
    };

    $scope.add_cart = function (product, qty, price) {
        qty_cart = ngCart.getItemById(product.codigo)._quantity;
        $scope.product_X_cod = product;
        $scope.product_X_cod.priceA = product.priceA;
        $scope.product_X_cod.price_iva = product.price_iva;
        $scope.product_X_cod.priceB = product.priceB;
        $scope.product_X_cod.priceC = product.priceC;
        $scope.product_X_cod.qty = parseInt(qty);
        if ($scope.product_X_cod.esServicio == 1) {
            $scope.product_X_cod.stock = 1000;
            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            Data.toast({"status": "success", "message": "PRODUCTO INGRESADO...!!!"});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        } else {
            send = {
                "product": $scope.product_X_cod,
                "qty": ($scope.product_X_cod.qty + qty_cart)
            };
            if (!angular.isUndefined($scope.product_X_cod.codigo)) {
                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            }
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        }
    };

    $scope.add = function (result, codigo, qty) {
        qty_cart = ngCart.getItemById(codigo)._quantity;
        $scope.product_X_cod = result.query[0];
        $scope.product_X_cod.priceA = result.priceA;
        $scope.product_X_cod.price_iva = result.price_iva;
        $scope.product_X_cod.priceB = result.priceB;
        $scope.product_X_cod.priceC = result.priceC;
        $scope.product_X_cod.qty = parseInt(qty);
        if ($scope.product_X_cod.esServicio == 1) {
            $scope.product_X_cod.stock = 1000;
            /*if ($scope.product_X_cod.pvppromo > 0) {
             ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, $scope.product_X_cod.qty, $scope.product_X_cod);
             } else {*/
            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            //}
            Data.toast({"status": "success", "message": "PRODUCTO INGRESADO...!!!"});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        } else {
//if(qty <= $scope.product_X_cod.stock){
            send = {
                "product": $scope.product_X_cod,
                "qty": ($scope.product_X_cod.qty + qty_cart)
            };
            //$http.post('index/verificar_stock', send).then(function (result) {
            //if (result.data.rta) {
            if (!angular.isUndefined($scope.product_X_cod.codigo)) {
                /*if ($scope.product_X_cod.pvppromo > 0) {
                 ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, $scope.product_X_cod.qty, $scope.product_X_cod);
                 } else {*/
                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
                //}
            }
//}
//Data.toast({"status": "success", "message": result.data.msg});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
            //});
            /*}else{
             Data.toast({"status":"error","message":"LA CANTIDAD ES MAYOR AL STOCK"});
             $scope.product_X_cod.qty = $scope.product_X_cod.stock;
             }*/
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
    }
    ;
}
);


app.controller('admin_cli', function ($scope, Data, $modalInstance, item, MyService) {
    $scope.title = 'NUEVO CLIENTE';
    $scope.btnText = 'GUARDAR';
    $scope.tipo_id = false;
    $scope.cliente = {"es_pasaporte": "0", "PersonaComercio_cedulaRuc": MyService.data.cedula, "nombres": "", "apellidos": "", "razonsocial": "", "direccion": "Cuenca", "celular": "", "telefonos": "", "email": ""};
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
            console.log(rta);
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
    $scope.pago_credito = false;
    $scope.tipo_pago = 1;
    $scope.empleado = item.empleado;
    $scope.val_efectivo = $scope.total_compra;
    $scope.val_credito = 0;
    $scope.res = item.fecha_emision;

    Data.get('load_tipos_pago').then(function (result) {
        $scope.formaspago = result.formaspago;
        $scope.selectedFormaPago = $scope.formaspago[0].id;
    });



    $scope.cambiar_forma_pago = function () {
        $scope.tipo_pago = $scope.selectedFormaPago;

        if ($scope.tipo_pago == 1) {
            $scope.pago_credito = false;

        } else {
            $scope.pago_credito = true;
        }
    };

    $scope.$watch('val_efectivo', function () {
        if ((parseFloat($scope.val_efectivo) >= 0) && (parseFloat($scope.val_efectivo) < parseFloat($scope.total_compra))) {
            $scope.msg = '';
            $scope.val_credito = ($scope.total_compra - $scope.val_efectivo).toFixed(2);
            $scope.tipo_pago = '02';
        } else {
            $scope.val_credito = 0;
            $scope.msg = 'EL VALOR DEL EFECTIVO NO ESTA DENTRO DEL RANGO DEL TOTAL DE LA COMPRA';
        }
    });

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
        console.log(item);
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
            "iceval": aux,
            "efectivoval": $scope.val_efectivo,
            "creditoval": $scope.val_credito,
            "baseiva": item.cart.totalDoce(),
            "tipo_comprobante": item.tipo_comprobante,
            "establecimiento": item.punto_venta.establecimiento,
            "punto_emision": item.punto_venta.puntoemision,
            "secuencia": item.punto_venta.secuenciaultima,
            "tipo_pago": $scope.tipo_pago,
            "fecha_emision": $scope.res.fecha_emision.value,

        };
        send = {
            "factura": factura,
            "detalle": item.cart.getItems(),
            "cliente": $scope.cliente,
            "empleado": $scope.empleado
        };

        $http.post('index/get_cart', send).then(function (result) {
            if (result.data.cod != -1) {
                Data.toast({"status": "success", "message": "FACTURA HA SIDO ARCHIVADA"});
                var x = [];
                x.rta = 'OK';
                x.venta = result;
                $modalInstance.close(x);
            } else {
                Data.toast({"status": "error", "message": "Error en el stock de un subproducto"});
            }
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
});

app.controller('reservar', function ($scope, $modal, Data, $filter, ngCart, $http, MyService, $location) {
    ngCart.empty();
    $scope.producto = {};
    $scope.cliente_default = [];
    $scope.puntoventas = [];
    $scope.cedula_valida = false;
    $scope.product_X_cod = [];
    $scope.product_X_cod.stock = 0;
    $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
    $scope.bandera_codigo = false;
    $scope.empleado_find = [];
    $scope.res = [];
    $scope.factura_reserva = '55';
    $scope.bandera_verproductos = true;

    var now = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.res.fecha_ret = now;
    var now1 = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.res.fecha = now1;
    $scope.res.anticipo = 0;

    $scope.get_productos_by_cod = function () {
        Data.get('select_products_by_cod/' + $scope.prod_codigo).then(function (result) {
            $scope.prods_by_cod = result.query;
        });
    };
    $scope.get_productos_by_cod2 = function () {
        Data.get('select_products_by_cod2/' + $scope.prod_codigo2).then(function (result) {
            $scope.prods_by_cod2 = result.query;
        });
    };
    $scope.get_productos_by_name = function () {
        Data.get('select_products_by_name/' + $scope.prod_name).then(function (result) {
            $scope.prods_by_name = result.query;
        });
    };

    Data.get('get_ptoventa_reserva').then(function (data) {
        if (data.length > 0) {
            $scope.empleado_find.empl_id = data[0].empl_id;
            $scope.empleado_find.empl_id = data[0].empl_id;
            $scope.empleado_find.PersonaComercio_cedulaRuc = data[0].PersonaComercio_cedulaRuc;
            $scope.empleado_find.nombres_apellidos = data[0].nombres_apellidos;
            $scope.puntoventas.bodega = data[0].id_bodega;
            $scope.puntoventas.nombres_apellidos = data[0].nombres_apellidos;
            $scope.puntoventas.establecimiento = data[0].establecimiento;
            $scope.puntoventas.puntoemision = data[0].puntoemision;
            $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
            $scope.permiso = true;
            /*Data.get('empleado_cli_x_ced/' + $scope.empleado_find.PersonaComercio_cedulaRuc).then(function (result) {
             $scope.empleado_default = result.query[0];
             $scope.empleado_find = $scope.empleado_default;
             $scope.cedula_valida = true;
             });*/
        } else {
            $scope.permiso = false;
        }
    });

    Data.get('select_all_empleados').then(function (result) {
        $scope.vendedores = result.vendedores;
    });

    $scope.find_emp = function () {
        var empleado = '';
        Data.get('empleado_cli_x_id/' + $scope.empleado_find.empl_id).then(function (result) {
            if (result.count > 0) {
                $scope.empleado_find = result.query[0];
                $scope.es_cedula = true;
                $scope.es_ruc = false;
                $scope.cedula_valida = true;
                Data.toast({"status": "success", "message": "EMPLEADO ENCONTRADO...!!!!!!!!!!"});
            } else {
                $scope.cedula_valida = false;
                $scope.empleado_find.nombres_apellidos = 'EMPLEADO NO EXISTE...!!!!!!!!!!';
                Data.toast({"status": "error", "message": "EMPLEADO NO EXISTE...!!!!!!!!!!"});
            }
        });
    }

    $scope.get_cart = function () {
        if ($scope.cliente_find) {
            if (ngCart.getTotalItems() > 0) {
                val = true;
                for (index = 0; index < ngCart.getItems().length; ++index) {
                    stock = ngCart.getItems()[index]._data.stock;
                    //console.log(stock);
                    if (stock <= 0) {
                        val = false;
                        break;
                    }
                }
                if (val == true) {
                    send = {
                        "cart": ngCart,
                        "punto_venta": $scope.puntoventas,
                        "cliente": $scope.cliente_find,
                        "empleado": $scope.empleado_find,
                        "reserva": $scope.res,
                        "tipo_comprobante": $scope.factura_reserva
                    };
                    var modalInstance = $modal.open({
                        templateUrl: 'index/load_cambio_res',
                        controller: 'cambio_res',
                        resolve: {
                            item: function () {
                                return send;
                            }
                        }
                    });
                    modalInstance.result.then(function (selectedObject) {
                        if (selectedObject.rta == "OK") {
                            ngCart.empty();
                            Data.get('get_ptoventa_reserva').then(function (data) {
                                $scope.puntoventas.establecimiento = data[0].establecimiento;
                                $scope.puntoventas.puntoemision = data[0].puntoemision;
                                $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
                            });
                            $location.path('/print/' + selectedObject.venta.data);
                        } else if (selectedObject.rta == "FAIL") {

                        }
                    });
                } else {
                    Data.toast({"status": "error", "message": "PRODUCTO SIN STOCK..."});
                }
            } else {
                Data.toast({"status": "error", "message": "LA FACTURA ESTA VACIA...!!!!!!!!!!"});
            }
        } else {
            Data.toast({"status": "error", "message": "INGRESE UN CLIENTE..."});
        }
    };
    $scope.buscar_letras = function () {
        Data.get('select_all_super_products/' + $scope.letras + '/1').then(function (result) {
            $scope.res_alq = 1;
            $scope.products = result.query;
        });
    };
    $scope.verificar_stock = function () {
        if ($scope.product_X_cod.qty != '') {
            if ($scope.product_X_cod.qty > $scope.product_X_cod.stock) {
                //$scope.product_X_cod.qty = $scope.product_X_cod.stock;
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

    $scope.add_producto = function (pro) {
        if (pro != null) {
            producto = pro.codigo;

            Data.get('select_product_x_cod/' + producto).then(function (result) {

                if (result.query.length > 0) {
                    $scope.add(result, producto, 1);
                    //console.log(result);
                } else {
                    Data.get('select_product_x_cod_comun/' + producto).then(function (result) {
                        if (result.query.length > 0) {
                            $scope.add(result, producto, 1);
                        } else {
                            Data.get('select_product_x_barcode/' + producto).then(function (result) {
                                if (result.query.length > 0) {
                                    $scope.add(result, producto, 1);
                                } else {
                                    Data.toast({"status": "error", "message": "No existe el codigo ingresado..!!!"});
                                    $scope.product_X_cod = [];
                                    $scope.product_X_cod.stock = 0;
                                    $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
                                }
                            });
                        }
                    });
                }
            });

        }
        $scope.selectedProduct = {};
        $scope.prods_by_cod = null;
        $scope.prods_by_cod2 = null;
        //$scope.prods_by_barras = null;
        $scope.prods_by_name = null;
    };

    $scope.add_cart = function (product, qty, price) {
        qty_cart = ngCart.getItemById(product.codigo)._quantity;
        $scope.product_X_cod = product;
        $scope.product_X_cod.priceA = product.priceA;
        $scope.product_X_cod.price_iva = product.price_iva;
        $scope.product_X_cod.priceB = product.priceB;
        $scope.product_X_cod.priceC = product.priceC;
        $scope.product_X_cod.qty = parseInt(qty);
        if ($scope.product_X_cod.esServicio == 1) {
            $scope.product_X_cod.stock = 1000;
            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            Data.toast({"status": "success", "message": "PRODUCTO INGRESADO...!!!"});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        } else {
            send = {
                "product": $scope.product_X_cod,
                "qty": ($scope.product_X_cod.qty + qty_cart)
            };
            if (!angular.isUndefined($scope.product_X_cod.codigo)) {
                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            }
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        }
    };

    $scope.add = function (result, codigo, qty) {
        qty_cart = ngCart.getItemById(codigo)._quantity;
        $scope.product_X_cod = result.query[0];
        $scope.product_X_cod.priceA = parseFloat(result.priceA).toFixed(2);
        $scope.product_X_cod.price_iva = parseFloat(result.price_iva).toFixed(2);
        $scope.product_X_cod.priceB = parseFloat(result.priceB).toFixed(2);
        $scope.product_X_cod.priceC = parseFloat(result.priceC).toFixed(2);
        $scope.product_X_cod.qty = parseInt(qty);
        if ($scope.product_X_cod.esServicio == 1) {
            $scope.product_X_cod.stock = 1000;
            /*if ($scope.product_X_cod.pvppromo > 0) {
             ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, $scope.product_X_cod.qty, $scope.product_X_cod);
             } else {*/
            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            //}
            Data.toast({"status": "success", "message": "PRODUCTO INGRESADO...!!!"});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        } else {
//if(qty <= $scope.product_X_cod.stock){
            send = {
                "product": $scope.product_X_cod,
                "qty": ($scope.product_X_cod.qty + qty_cart)
            };
            //$http.post('index/verificar_stock', send).then(function (result) {
            //if (result.data.rta) {
            if (!angular.isUndefined($scope.product_X_cod.codigo)) {
                /*if ($scope.product_X_cod.pvppromo > 0) {
                 ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, $scope.product_X_cod.qty, $scope.product_X_cod);
                 } else {*/
                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
                //}
            }
//}
//Data.toast({"status": "success", "message": result.data.msg});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
            //});
            /*}else{
             Data.toast({"status":"error","message":"LA CANTIDAD ES MAYOR AL STOCK"});
             $scope.product_X_cod.qty = $scope.product_X_cod.stock;
             }*/
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
    }
    ;
});
app.controller('search_devolucion', function ($scope, Data, MyService, $http, $filter) {

    $scope.facturas = [];
    $scope.codigos = [];
    $scope.totales = [];
    //Columnas que se muestran en el reporte de ventas
    $scope.codigo_view = true;
    $scope.secuencia_view = true;
    $scope.cliente_ci_view = true;
    $scope.cliente_nombres_view = true;
    $scope.archivada_view = true;
    $scope.subtotalNeto_view = true;
    $scope.iva_view = true;
    $scope.totalCompra_view = true;
    $scope.estado_view = true;
    $scope.fecha_dev_view = true;

    $scope.cliente_view = {};
    $scope.cliente_view.estado = false;

    $scope.contacto_view = {};
    $scope.contacto_view.estado = false;

    $scope.producto_view = {};
    $scope.producto_view.estado = false;

    $scope.comprobantes = {};

    $scope.filas = [{'valor': '5'}, {'valor': '10'}, {'valor': '15'}, {'valor': '20'}, {'valor': '30'}, {'valor': $scope.facturas.length}];
    $scope.filas_now = $scope.facturas.length;

    $scope.clientes = [];
    $scope.productos = [];

    $scope.selectedCliente = [];
    $scope.selectedContacto = [];
    $scope.selectedProducto = [];

    $scope.selectedCliente.originalObject = [];
    $scope.selectedContacto.originalObject = [];
    $scope.selectedProducto.originalObject = [];

    Data.get('load_bodegas').then(function (result) {
        $scope.bodegas = result;
    });
    Data.get('load_estados_alquiler').then(function (result) {
        $scope.estados_alq = result;
    });

    Data.get('select_all_clientes').then(function (result) {
        $scope.clientes = result;
    });

    Data.get('select_all_productos').then(function (result2) {
        $scope.productos = result2;
    });

    $scope.buscar = function () {
        if (angular.isUndefined($scope.selectedCliente)) {
            $scope.cliente_select = '';
        } else {
            if ($scope.selectedCliente.originalObject != null) {
                $scope.cliente_select = $scope.selectedCliente.originalObject.ci;
            } else {
                $scope.cliente_select = '';
            }
        }
        if (angular.isUndefined($scope.selectedContacto)) {
            $scope.contacto_select = '';
        } else {
            if ($scope.selectedContacto.originalObject != null) {
                $scope.contacto_select = $scope.selectedContacto.originalObject.telefonos;
            } else {
                $scope.contacto_select = '';
            }
        }
//        if (angular.isUndefined($scope.selectedProducto)) {
//            $scope.producto_select = '';
//        } else {
//            if ($scope.selectedContacto.originalObject != null) {
//                $scope.producto_select = $scope.selectedProducto.originalObject.codigo;
//            } else {
//                $scope.producto_select = '';
//            }
//        }
        formData = {
            "estado": $scope.validate($scope.selectedEstado),
            "bodega": $scope.validate($scope.selectedBodega),
            "farchivada_ini": $scope.validate($scope.farchivada_ini),
            "farchivada_fin": $scope.validate($scope.farchivada_fin),
            "cliente": $scope.validate($scope.cliente_select),
            "contacto": $scope.validate($scope.contacto_select),
//            "producto": $scope.validate($scope.producto_select),
            "prod_nombre": $scope.validate($scope.nombre_prod),
            "prod_cod2": $scope.validate($scope.cod2_prod),
            "secuencia": $scope.validate($scope.secuencia)
        };

        $http.post('devolucion/find', formData).then(function (result) {
            if (result) {
                $scope.facturas = result.data.query;
                $scope.codigo = result.data.codigo;
                $scope.totales = result.data.sum[0];
                $scope.filas[5].valor = $scope.facturas.length;
            }
        });


    };
    $scope.quit_cli = function () {
        $scope.selectedCliente.title = '';
        $scope.selectedCliente.originalObject = null;
        $scope.cliente_view.estado = false;
    };
    $scope.quit_contacto = function () {
        $scope.selectedContacto.title = '';
        $scope.selectedContacto.originalObject = null;
        $scope.contacto_view.estado = false;
    };
    $scope.quit_producto = function () {
        $scope.selectedProducto.title = '';
        $scope.selectedProducto.originalObject = null;
        $scope.producto_view.estado = false;
    };
    $scope.validate = function (valor) {
        var send;
        if ((angular.isUndefined(valor)) || (valor == -1)) {
            send = '';
        } else {
            send = valor;
        }
        return send;
    };


    $scope.filas_now_change = function (valor) {
        $scope.filas_now = valor.valor;
    };
    $scope.load_color = function (estado) {
        var color_send;
        if (estado < 0) {
            color_send = 'red';
        }
        if (estado == 1) {
            color_send = 'black';
        }
        if (estado == 2) {
            color_send = '#ff6600';
        }
        if ((estado == 3)) {
            color_send = 'green';
        }
        return {"color": color_send};
    };

});

app.controller('ModalDemoCtrl', function ($scope, $http, $uibModal, $log) {
    $scope.animationsEnabled = true;

    $scope.open = function (size, val) {
        $http.post('devolucion/select_fact', val).then(function (rta) {
            if (rta) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    size: size,
                    resolve: {
                        item: function () {
                            return rta;
                        }
                    }
                });
                modalInstance.result.then(function (selectedObject) {
                    if (selectedObject.rta == "OK") {
                        val.codigo = selectedObject.codigo;
                    }
                });
            }
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item, $http, Data, $filter) {
    $scope.factura = item.data.factura;


    $scope.ok = function () {
        send = {
            "codigofactventa": $scope.factura.codigofactventa,
            "estado": 3, //Indica que los productos de esta factura han sido devueltos
            "fecha_devolucion": $filter('date')(new Date(), 'yyyy-MM-dd')//Para guardar la fecha de devolución

        };
        $http.post('devolucion/update_fact', send).then(function (result) {
            var x = angular.copy(result.data.query);
            if (parseInt(result.data.update) > 0) {
                x.rta = 'OK';
                $uibModalInstance.close(x);
                Data.toast({"status": "success", "message": "DEVOLUCION REALIZADA CORRECTAMENTE...!!!!!!!!!!"});
            } else {
                x.rta = 'FAIL';
                $uibModalInstance.close(x);
                Data.toast({"status": "error", "message": "HA OCURRIDO UN ERROR AL REALIZAR LA DEVOLUCION...!!!!!!!!!!"});
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
app.controller('cambio_res', function ($http, $scope, Data, $modalInstance, item, MyService) {
    $scope.title = 'CAMBIO RESERVA';
    $scope.res = item.reserva;
    $scope.recibo = $scope.res.anticipo;
    $scope.total_compra = angular.copy(item.cart.Total().toFixed(2));
    $scope.msg = '';
    $scope.val_cambio = 0;
    $scope.cambio = ($scope.total_compra - $scope.recibo).toFixed(2);
    $scope.cliente = item.cliente;
    $scope.empleado = item.empleado;

    $scope.$watch('val_efectivo', function () {
        if (parseFloat($scope.val_efectivo) >= parseFloat($scope.cambio)) {
            /*console.log('recibo mayor o igual a total de la compra'+$scope.recibo+' >= '+$scope.total_compra);*/
            $scope.msg = '';
            $scope.val_cambio = ($scope.val_efectivo - $scope.recibo).toFixed(2);
        } else {
            /*console.log('menor a total compra'+$scope.recibo+' < '+$scope.total_compra);*/
            $scope.val_cambio = 0.00;
            $scope.msg = 'EL VALOR RECIBIDO ES MENOR AL TOTAL DE LA COMPRA';
        }
    });

    $scope.save_fact = function () {
        var aux = 0;
        factura = {
            "subtotalBruto": item.cart.Subtotal(),
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
            "iceval": aux,
            "efectivoval": aux,
            "creditoval": aux,
            "baseiva": item.cart.totalDoce(),
            "tipo_comprobante": item.tipo_comprobante,
            "establecimiento": item.punto_venta.establecimiento,
            "punto_emision": item.punto_venta.puntoemision,
            "secuencia": item.punto_venta.secuenciaultima,
            "tipo_pago": 1, //por defecto efectivo
            "fecha_reserva": $scope.res.fecha.value,
            "anticipo": $scope.res.anticipo,
            "f_salida": $scope.res.fecha_ret.value
        };
        //console.log(factura);
        send = {
            //"reserva": $scope.res,
            "factura": factura,
            "detalle": item.cart.getItems(),
            "cliente": $scope.cliente,
            "empleado": $scope.empleado
        };
        $http.post('index/get_cart_res', send).then(function (result) {
            //console.log(result.data.cod);
            if (result.data.cod != -1) {
                Data.toast({"status": "success", "message": "FACTURA HA SIDO ARCHIVADA"});
                var x = [];
                x.rta = 'OK';
                x.venta = result;
                $modalInstance.close(x);
            } else {
                Data.toast({"status": "error", "message": "Error en el stock de un subproducto"});
            }
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
});
app.controller('alquiler', function ($scope, $modal, Data, $filter, ngCart, $http, MyService, $location) {
    ngCart.empty();
    $scope.producto = {};
    $scope.cliente_default = [];
    $scope.puntoventas = [];
    $scope.cedula_valida = false;
    $scope.product_X_cod = [];
    $scope.product_X_cod.stock = 0;
    $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
    $scope.bandera_codigo = false;
    $scope.empleado_find = [];
    $scope.res = [];
    $scope.factura_reserva = '55';
    $scope.bandera_verproductos = true;
    
    var now = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.res.fecha_emision = now;

    $scope.get_productos_by_cod = function () {
        Data.get('select_products_by_cod/' + $scope.prod_codigo).then(function (result) {
            $scope.prods_by_cod = result.query;
        });
    };
    $scope.get_productos_by_cod2 = function () {
        Data.get('select_products_by_cod2/' + $scope.prod_codigo2).then(function (result) {
            $scope.prods_by_cod2 = result.query;
        });
    };
    $scope.get_productos_by_name = function () {
        Data.get('select_products_by_name/' + $scope.prod_name).then(function (result) {
            $scope.prods_by_name = result.query;
        });
    };

    //$scope.data_form = {};// este se usará para llenar los datos del formulario en cada campo del mismo  
    $scope.estados_chekin = {
        datos_llenar: [
            {name: "Cédula", value: "Cédula"},
            {name: "15 Dólares", value: "15 Dólares"},
            {name: "S.P.", value: "S.P."}
        ],
        dato_seleccionado: {value: "S.P.", name: "S.P."}// Genero el dato que saldra por defecto
    };

    Data.get('get_ptoventa_reserva').then(function (data) {
        if (data.length > 0) {
            $scope.empleado_find.PersonaComercio_cedulaRuc = data[0].PersonaComercio_cedulaRuc;
            $scope.empleado_find.nombres_apellidos = data[0].nombres_apellidos;
            $scope.puntoventas.bodega = data[0].id_bodega;
            $scope.puntoventas.nombres_apellidos = data[0].nombres_apellidos;
            $scope.puntoventas.establecimiento = data[0].establecimiento;
            $scope.puntoventas.puntoemision = data[0].puntoemision;
            $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
            $scope.permiso = true;
            Data.get('empleado_cli_x_ced/' + $scope.empleado_find.PersonaComercio_cedulaRuc).then(function (result) {
                $scope.empleado_default = result.query[0];
                $scope.empleado_find = $scope.empleado_default;
                $scope.cedula_valida = true;
            });
        } else {
            $scope.permiso = false;
        }
    });

    Data.get('select_all_empleados').then(function (result) {
        $scope.vendedores = result.vendedores;
    });

    $scope.find_emp = function () {
        var empleado = '';
        Data.get('empleado_cli_x_id/' + $scope.empleado_find.empl_id).then(function (result) {
            if (result.count > 0) {
                $scope.empleado_find = result.query[0];
                $scope.es_cedula = true;
                $scope.es_ruc = false;
                $scope.cedula_valida = true;
                Data.toast({"status": "success", "message": "EMPLEADO ENCONTRADO...!!!!!!!!!!"});
            } else {
                $scope.cedula_valida = false;
                $scope.empleado_find.nombres_apellidos = 'EMPLEADO NO EXISTE...!!!!!!!!!!';
                Data.toast({"status": "error", "message": "EMPLEADO NO EXISTE...!!!!!!!!!!"});
            }
        });
    }

    $scope.get_cart = function () {
        if ($scope.cliente_find) {
            if (ngCart.getTotalItems() > 0) {
                val = true;
                for (index = 0; index < ngCart.getItems().length; ++index) {
                    stock = ngCart.getItems()[index]._data.stock;
                    //console.log(stock);
                    if (stock <= 0) {
                        val = false;
                        break;
                    }
                }
                //console.log($scope.res.factura);
                if ($scope.res.factura) {
                    val = true;
                }
                if (val == true) {
                    send = {
                        "cart": ngCart,
                        "punto_venta": $scope.puntoventas,
                        "cliente": $scope.cliente_find,
                        "empleado": $scope.empleado_find,
                        "alquiler": $scope.res, //alquiler res
                        "tipo_comprobante": $scope.factura_reserva
                    };
                    var modalInstance = $modal.open({
                        templateUrl: 'index/load_cambio_alq',
                        controller: 'cambio_alq',
                        resolve: {
                            item: function () {
                                return send;
                            }
                        }
                    });
                    modalInstance.result.then(function (selectedObject) {
                        if (selectedObject.rta == "OK") {
                            ngCart.empty();
                            Data.get('get_ptoventa_reserva').then(function (data) {
                                $scope.puntoventas.establecimiento = data[0].establecimiento;
                                $scope.puntoventas.puntoemision = data[0].puntoemision;
                                $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
                            });
                            //location.reload();
                            //$location.path('/print/' + selectedObject.venta.data);
                            $location.path('/print/' + selectedObject.venta.data+'?nd=' + Date.now());
                        } else if (selectedObject.rta == "FAIL") {

                        }
                    });
                } else {
                    Data.toast({"status": "error", "message": "PRODUCTO SIN STOCK..."});
                }
            } else {
                Data.toast({"status": "error", "message": "LA FACTURA ESTA VACIA...!!!!!!!!!!"});
            }
        } else {
            Data.toast({"status": "error", "message": "INGRESE UN CLIENTE..."});
        }
    };
    $scope.buscar_letras = function () {
        Data.get('select_all_super_products/' + $scope.letras + '/1').then(function (result) {
            $scope.res_alq = 1;
            $scope.products = result.query;
        });
    };
    $scope.verificar_stock = function () {
        if ($scope.product_X_cod.qty != '') {
            if ($scope.product_X_cod.qty > $scope.product_X_cod.stock) {
                //$scope.product_X_cod.qty = $scope.product_X_cod.stock;
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
    $scope.add_producto = function (pro) {
        if (pro != null) {
            //producto = pro.id_producto;
            producto = pro.codigo;
            Data.get('select_product_x_cod/' + producto).then(function (result) {

                if (result.query.length > 0) {
                    $scope.add(result, producto, 1);
                    //console.log(result);
                } else {
                    Data.get('select_product_x_cod_comun/' + producto).then(function (result) {
                        if (result.query.length > 0) {
                            $scope.add(result, producto, 1);
                        } else {
                            Data.get('select_product_x_barcode/' + producto).then(function (result) {
                                if (result.query.length > 0) {
                                    $scope.add(result, producto, 1);
                                } else {
                                    Data.toast({"status": "error", "message": "No existe el codigo ingresado..!!!"});
                                    $scope.product_X_cod = [];
                                    $scope.product_X_cod.stock = 0;
                                    $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
                                }
                            });
                        }
                    });
                }
            });
        }
        $scope.selectedProduct = {};
    };

    $scope.add_cart = function (product, qty, price) {
        qty_cart = ngCart.getItemById(product.codigo)._quantity;
        $scope.product_X_cod = product;
        $scope.product_X_cod.priceA = product.priceA;
        $scope.product_X_cod.price_iva = product.price_iva;
        $scope.product_X_cod.priceB = product.priceB;
        $scope.product_X_cod.priceC = product.priceC;
        $scope.product_X_cod.qty = parseInt(qty);
        if ($scope.product_X_cod.esServicio == 1) {
            $scope.product_X_cod.stock = 1000;
            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            Data.toast({"status": "success", "message": "PRODUCTO INGRESADO...!!!"});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        } else {
            send = {
                "product": $scope.product_X_cod,
                "qty": ($scope.product_X_cod.qty + qty_cart)
            };
            if (!angular.isUndefined($scope.product_X_cod.codigo)) {
                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            }
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        }
    };

    $scope.add = function (result, codigo, qty) {
        qty_cart = ngCart.getItemById(codigo)._quantity;
        $scope.product_X_cod = result.query[0];
        $scope.product_X_cod.priceA = result.priceA;
        $scope.product_X_cod.price_iva = result.price_iva;
        $scope.product_X_cod.priceB = result.priceB;
        $scope.product_X_cod.priceC = result.priceC;
        $scope.product_X_cod.qty = parseInt(qty);
        if ($scope.product_X_cod.esServicio == 1) {
            $scope.product_X_cod.stock = 1000;
            /*if ($scope.product_X_cod.pvppromo > 0) {
             ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, $scope.product_X_cod.qty, $scope.product_X_cod);
             } else {*/
            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
            //}
            Data.toast({"status": "success", "message": "PRODUCTO INGRESADO...!!!"});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        } else {
//if(qty <= $scope.product_X_cod.stock){
            send = {
                "product": $scope.product_X_cod,
                "qty": ($scope.product_X_cod.qty + qty_cart)
            };
            //$http.post('index/verificar_stock', send).then(function (result) {
            //if (result.data.rta) {
            if (!angular.isUndefined($scope.product_X_cod.codigo)) {
                /*if ($scope.product_X_cod.pvppromo > 0) {
                 ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.pvppromo, $scope.product_X_cod.qty, $scope.product_X_cod);
                 } else {*/
                ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
                //}
            }
//}
//Data.toast({"status": "success", "message": result.data.msg});
            $scope.product_X_cod = [];
            $scope.product_X_cod.stock = 0;
            $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
            //});
            /*}else{
             Data.toast({"status":"error","message":"LA CANTIDAD ES MAYOR AL STOCK"});
             $scope.product_X_cod.qty = $scope.product_X_cod.stock;
             }*/
        }
    }

    $scope.add_fac = function (result, codigo, qty) {
        qty_cart = ngCart.getItemById(codigo)._quantity;
        $scope.product_X_cod = result;
        $scope.product_X_cod.priceA = result.totitembaseiva;
        $scope.product_X_cod.price_iva = result.totitembaseiva;
        $scope.product_X_cod.priceB = result.totitembaseiva;
        $scope.product_X_cod.priceC = result.priceC;
        $scope.product_X_cod.qty = parseInt(qty);
        //if(qty <= $scope.product_X_cod.stock){
        send = {
            "product": $scope.product_X_cod,
            "qty": ($scope.product_X_cod.qty + qty_cart)
        };
        if (!angular.isUndefined($scope.product_X_cod.codigo)) {
            ngCart.addItem($scope.product_X_cod.codigo, $scope.product_X_cod.nombreUnico, $scope.product_X_cod.priceA, $scope.product_X_cod.qty, $scope.product_X_cod);
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
                Data.get('get_fac_cliente/' + $scope.cliente_find.PersonaComercio_cedulaRuc).then(function (result) {
                    if (result.factura) {
                        $scope.res.factura = result.factura.codigofactventa;
                        $scope.res.anticipo = result.factura.descuentovalor;
                        $scope.res.fecha = result.factura.fechaCreacion;
                        $scope.res.fecha_ret = result.factura.f_salida;
                        $scope.puntoventas.establecimiento = result.factura.puntoventaempleado_establecimiento;
                        $scope.puntoventas.puntoemision = result.factura.puntoventaempleado_puntoemision;
                        $scope.puntoventas.secuenciaultima = result.factura.secuenciafactventa;
                    } else {
                        // $scope.res = [];
                        $scope.res.anticipo = 0;
                        ngCart.empty();
                        Data.get('get_ptoventa_reserva').then(function (data) {
                            $scope.puntoventas.establecimiento = data[0].establecimiento;
                            $scope.puntoventas.puntoemision = data[0].puntoemision;
                            $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
                        });
                    }
                    if (result.factura_det) {
                        angular.forEach(result.factura_det, function (det) {
                            $scope.add_fac(det, det.codigo, det.itemcantidad);
                        });
                    }
                });
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
                    $scope.res.anticipo = 0;
                    $scope.cliente_find = selectedObject;
                });
            }
        });
    };

    $scope.find_sec = function () {
        var cliente = '';
        Data.get('select_secuencia/' + $scope.res.secuencia).then(function (result) {
            if (result.count > 0) {
                $scope.cliente_find = result.query[0];
                $scope.es_cedula = true;
                $scope.es_ruc = false;
                $scope.cedula_valida = true;
                Data.toast({"status": "success", "message": "CLIENTE ENCONTRADO...!!!!!!!!!!"});
                Data.get('get_fac/' + $scope.cliente_find.PersonaComercio_cedulaRuc + '/' + $scope.res.secuencia).then(function (result) {
                    if (result.factura) {
                        $scope.res.factura = result.factura.codigofactventa;
                        $scope.res.anticipo = result.factura.descuentovalor;
                        $scope.res.fecha = result.factura.fechaCreacion;
                        $scope.res.fecha_ret = result.factura.f_salida;
                        $scope.puntoventas.establecimiento = result.factura.puntoventaempleado_establecimiento;
                        $scope.puntoventas.puntoemision = result.factura.puntoventaempleado_puntoemision;
                        $scope.puntoventas.secuenciaultima = result.factura.secuenciafactventa;
                    } else {
                        // $scope.res = [];
                        $scope.res.anticipo = 0;
                        ngCart.empty();
                        Data.get('get_ptoventa_reserva').then(function (data) {
                            $scope.puntoventas.establecimiento = data[0].establecimiento;
                            $scope.puntoventas.puntoemision = data[0].puntoemision;
                            $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
                        });
                    }
                    if (result.factura_det) {
                        angular.forEach(result.factura_det, function (det) {
                            $scope.add_fac(det, det.codigo, det.itemcantidad);
                        });
                    }
                });
            } else {
                // $scope.cedula_valida = false;
                //$scope.cliente_find.nombres_apellidos = 'SECUENCIA NO EXISTE...!!!!!!!!!!';
                $scope.cliente_find = [];
                $scope.res.secuencia = "";
                ngCart.empty();
                Data.get('get_ptoventa_reserva').then(function (data) {
                    $scope.puntoventas.establecimiento = data[0].establecimiento;
                    $scope.puntoventas.puntoemision = data[0].puntoemision;
                    $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
                });
                Data.toast({"status": "error", "message": "SECUENCIA NO EXISTE...!!!!!!!!!!"});
            }
        });
    };

});

app.controller('cambio_alq', function ($http, $scope, Data, $modalInstance, item, MyService) {
    $scope.title = 'CAMBIO ALQUILER';
    $scope.res = item.alquiler;
    //console.log($scope.res);
    $scope.recibo = $scope.res.anticipo;
    $scope.total_compra = angular.copy(item.cart.Total().toFixed(2));
    $scope.msg = '';
    $scope.cambio = ($scope.total_compra - $scope.recibo).toFixed(2);
    $scope.cliente = item.cliente;
    $scope.pago_credito = false;
    $scope.tipo_pago = 1;
    $scope.empleado = item.empleado;
    $scope.val_efectivo = $scope.cambio;
    $scope.val_credito = 0;

    Data.get('load_tipos_pago').then(function (result) {
        $scope.formaspago = result.formaspago;
        $scope.selectedFormaPago = $scope.formaspago[0].id;
    });

    $scope.cambiar_forma_pago = function () {
        $scope.tipo_pago = $scope.selectedFormaPago;
        if ($scope.tipo_pago == 1) {
            $scope.pago_credito = false;
        } else {
            $scope.pago_credito = true;
        }
    };

    $scope.$watch('val_efectivo', function () {
        if ((parseFloat($scope.val_efectivo) >= 0) && (parseFloat($scope.val_efectivo) < parseFloat($scope.cambio))) {
            $scope.msg = '';
            $scope.val_credito = ($scope.cambio - $scope.val_efectivo).toFixed(2);
            $scope.tipo_pago = '02';
        } else {
            $scope.val_credito = 0;
            $scope.msg = 'EL VALOR DEL EFECTIVO NO ESTA DENTRO DEL RANGO DEL TOTAL DE LA COMPRA';
        }
    });

    $scope.$watch('value_efectivo', function () {
        if (parseFloat($scope.value_efectivo) >= parseFloat($scope.cambio)) {
            /*console.log('recibo mayor o igual a total de la compra'+$scope.recibo+' >= '+$scope.total_compra);*/
            $scope.msg = '';
            $scope.value_cambio = ($scope.value_efectivo - $scope.cambio).toFixed(2);
        } else {
            /*console.log('menor a total compra'+$scope.recibo+' < '+$scope.total_compra);*/
            $scope.value_cambio = 0.00;
            $scope.msg = 'EL VALOR RECIBIDO ES MENOR AL TOTAL DE LA COMPRA';
        }
    });

    $scope.save_fact = function () {
        var aux = 0;
        factura = {
            "subtotalBruto": item.cart.Subtotal(),
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
            "iceval": aux,
            "efectivoval": $scope.val_efectivo,
            "creditoval": $scope.val_credito,
            "baseiva": item.cart.totalDoce(),
            "tipo_comprobante": item.tipo_comprobante,
            "establecimiento": item.punto_venta.establecimiento,
            "punto_emision": item.punto_venta.puntoemision,
            "secuencia": item.punto_venta.secuenciaultima,
            "tipo_pago": $scope.tipo_pago, //por defecto efectivo
            "fecha_reserva": $scope.res.fecha,
            "anticipo": $scope.res.anticipo,
            "factura_cod": $scope.res.factura,
            "garantias": $scope.res.garantias.value,
            "fecha_emision": $scope.res.fecha_emision.value/*,
             "prendas": $scope.res.prendas*/
        };
        //console.log(factura);
        send = {
            //"reserva": $scope.res,
            "factura": factura,
            "detalle": item.cart.getItems(),
            "cliente": $scope.cliente,
            "empleado": $scope.empleado
        };
        $http.post('index/get_cart_alq', send).then(function (result) {//get_cart_res
            if (result.data.cod != -1) {
                Data.toast({"status": "success", "message": "FACTURA HA SIDO ARCHIVADA"});
                var x = [];
                x.rta = 'OK';
                x.venta = result;
                $modalInstance.close(x);
            } else {
                Data.toast({"status": "error", "message": "Error en el stock de un subproducto"});
            }
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
});

app.controller('search_reporte', function ($scope, Data, $http, $filter) {
    $scope.facturas = [];
    $scope.codigos = [];
    $scope.totales = [];
    $scope.codigo_view = true;
    $scope.secuencia_view = true;
    $scope.cliente_ci_view = true;
    $scope.cliente_nombres_view = true;
    $scope.emision_view = true;
    $scope.archivada_view = true;
    $scope.subtotalNeto_view = true;
    $scope.iva_view = true;
    $scope.totalCompra_view = true;
    $scope.tipo_pago_view = true;
    $scope.asiento_contable_view = true;

    $scope.pendiente = false;
    $scope.archivada = true;
    $scope.anuladas = false;

    $scope.usuario_view = true;
    $scope.vendedor_view = true;
    $scope.edit_cli_view = false;
    $scope.edit_fact_view = false;

    $scope.change_invoice_date = false;
    $scope.change_user = false;

    $scope.cliente_view = {};
    $scope.cliente_view.estado = false;

    $scope.producto_view = {};
    $scope.producto_view.estado = false;

    $scope.comprobantes = {};

    $scope.filas = [{'valor': '5'}, {'valor': '10'}, {'valor': '15'}, {'valor': '20'}, {'valor': '30'}, {'valor': $scope.facturas.length}];
    $scope.filas_now = $scope.facturas.length;

    $scope.clientes = [];
    $scope.selectedCliente = [];
    $scope.selectedCliente.originalObject = [];

    $scope.productos = [];
    $scope.selectedProducto = [];
    $scope.selectedProducto.originalObject = [];


    $scope.femision_ini = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.femision_fin = $filter('date')(new Date(), 'yyyy-MM-dd');


    Data.get('load_bodegas').then(function (result) {
        $scope.bodegas = result;
    });

    Data.get('load_tipos_garantias').then(function (result) {
        $scope.garantias = result;
    });
    Data.get('load_tipos_transaccion').then(function (result) {
        $scope.transacciones = result;
    });

    Data.get('select_all_clientes').then(function (result) {
        $scope.clientes = result;
    });

    Data.get('select_all_productos').then(function (result2) {
        $scope.productos = result2;
    });

    Data.get('../ventas/load_datos_init').then(function (result) {
        $scope.vendedores = result.vendedores;
        $scope.usuarios = result.usuarios;
        $scope.ventatipos = result.ventatipos;
    });

    Data.get('../ventas/permisos_users').then(function (result) {

        if (result.change_invoice_date) {
            $scope.edit_fact_view = true;
        }
        if (result.change_user) {
            $scope.edit_cli_view = true;
        }
        if (result.root) {
            $scope.edit_fact_view = true;
            $scope.edit_cli_view = true;
        }
        if (result.make_nota_credito) {
            $scope.asiento_contable_view = true;
        }
    });

    $scope.buscar = function () {
        if (angular.isUndefined($scope.selectedCliente)) {
            $scope.cliente_select = '';
        } else {
            if ($scope.selectedCliente.originalObject != null) {
                $scope.cliente_select = $scope.selectedCliente.originalObject.ci;
            } else {
                $scope.cliente_select = '';
            }
        }
        if (angular.isUndefined($scope.selectedProducto)) {
            $scope.producto_select = '';
        } else {
            if ($scope.selectedProducto.originalObject != null) {
                $scope.producto_select = $scope.selectedProducto.originalObject.codigo;
            } else {
                $scope.producto_select = '';
            }
        }
        formData = {
            "pendiente": $scope.validate($scope.pendiente),
            "archivada": $scope.validate($scope.archivada),
            "anuladas": $scope.validate($scope.anuladas),
            "vendedor": $scope.validate($scope.selectedVendedor),
            "usuario": $scope.validate($scope.selectedUsuario),
            "tipo": $scope.validate($scope.selectedVentaTipo),
            "femision_ini": $scope.validate($scope.femision_ini),
            "femision_fin": $scope.validate($scope.femision_fin),
            "farchivada_ini": $scope.validate($scope.farchivada_ini),
            "farchivada_fin": $scope.validate($scope.farchivada_fin),
            "transaccion": $scope.validate($scope.selectedTTransaccion),
            "garantia": $scope.validate($scope.selectedTGarantia),
            "bodega": $scope.validate($scope.selectedBodega),
            "prod_nombre": $scope.validate($scope.nombre_prod),
            "prod_cod2": $scope.validate($scope.cod2_prod),
//            "producto": $scope.validate($scope.producto_select),
            "cliente": $scope.validate($scope.cliente_select),
        };
        $http.post('ventas/find', formData).then(function (result) {
            if (result) {
                $scope.facturas = result.data.query;
                $scope.codigo = result.data.codigo;
                $scope.totales = result.data.sum[0];
                $scope.filas[5].valor = $scope.facturas.length;
            }
            $scope.pendiente = false;
            $scope.archivada = false;
            $scope.anuladas = false;
        });
    };

    $scope.pendiente_elect = function () {
        $scope.archivada = false;
        $scope.anuladas = false;
    };

    $scope.archivada_elect = function () {
        $scope.pendiente = false;
        $scope.anuladas = false;
    };



    $scope.anulada_elect = function () {
        $scope.pendiente = false;
        $scope.archivada = false;
    };

    $scope.validate = function (valor) {
        var send;
        if ((angular.isUndefined(valor)) || (valor == -1)) {
            send = '';
        } else {
            send = valor;
        }
        return send;
    };

    $scope.load_color = function (estado, autorizado) {
        var color_send;
        if (estado < 0) {
            color_send = 'red';
        }
        if (estado == 1) {
            color_send = 'black';
        }
        if ((estado == 2)) {
            color_send = '#ff6600';
        }
        if ((estado == 3)) {
            color_send = 'green';
        }
        return {"color": color_send};
    };

    $scope.filas_now_change = function (valor) {
        $scope.filas_now = valor.valor;
    };

    $scope.quit_cli = function () {
        $scope.selectedCliente.title = '';
        $scope.selectedCliente.originalObject = null;
        $scope.cliente_view.estado = false;
    };

    $scope.quit_producto = function () {
        $scope.selectedProducto.title = '';
        $scope.selectedProducto.originalObject = null;
        $scope.producto_view.estado = false;
    };
});
app.controller('printCtrl', ['$scope', 'Data', '$location', function ($scope, Data, $location) {
        $("#factventaprint_view_f1").printThis({optprint1});
    }]);

app.controller('EditClientCtrl', function ($scope, $http, $uibModal, $log, MyService) {
    $scope.animationsEnabled = true;

    $scope.open = function (size, cliente) {
        $http.post('ventas/select_cli', cliente).then(function (result) {
            if (result) {
                MyService.data.cliente = result.data;
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modalClientEdit.html',
                    controller: 'EditClientInstanceCtrl',
                    size: size,
                    resolve: {
                        item: function () {
                            return cliente;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    if (selectedItem.rta == "OK") {
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

app.controller('EditClientInstanceCtrl', function ($scope, $uibModalInstance, item, MyService, $http, Data) {
    $scope.cliente = MyService.data.cliente[0];

    $scope.ok = function () {
        $http.post('ventas/update_cli', $scope.cliente).then(function (result) {
            var x = '';
            if (parseInt(result.data) > 0) {
                Data.toast({"status": "success", "message": "HA SIDO MODIFICADO...!!!!!!!!!!"});
                x.rta = 'OK';
            } else {
                Data.toast({"status": "error", "message": "HA OCURRIDO UN ERROR AL ACTUALIZAR...!!!!!!!!!!"});
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
        $http.post('ventas/select_fact', val.codigo).then(function (rta) {
            if (rta) {
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
                modalInstance.result.then(function (selectedObject) {
                    if (selectedObject.rta == "OK") {
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

    $scope.vendedor_default = _.findWhere($scope.empleados, {id: item.data.vendedor_default.id}).id;
    $scope.tecnico_default = _.findWhere($scope.empleados, {id: item.data.tecnico_default.id}).id;
    $scope.tipopago_default = _.findWhere($scope.tipo_pagos, {id: item.data.tipopago_default.id}).id;
    $scope.establecimiento_default = _.findWhere($scope.establecimientos, {establecimiento: item.data.establecimiento_default});
    $scope.pemision_default = _.findWhere($scope.pemisiones, {pemision: item.data.pemision_default}).pemision;

    $scope.ok = function () {
        send = {
            "codigofactventa": $scope.factura.codigofactventa,
            "nroAutorizacion": $scope.factura.nroAutorizacion,
            "observaciones": $scope.factura.observaciones,
            "empleado_vendedor": $scope.vendedor_default,
            "tecnico_id": $scope.tecnico_default,
            "tipo_pago": $scope.tipopago_default,
            "puntoventaempleado_establecimiento": $scope.establecimiento_default,
            "puntoventaempleado_puntoemision": $scope.pemision_default,
            "secuenciafactventa": $scope.factura.secuencia,
            "fechaCreacion": $scope.factura.fechaCreacion,
            "fechaarchivada": $scope.factura.fechaarchivada,
            "autorizado_sri": $scope.factura.autorizado_sri,
            "mensaje_sri": $scope.factura.mensaje_sri
        };
        $http.post('ventas/update_fact', send).then(function (result) {
            var x = angular.copy(result.data.query);
            if (parseInt(result.data.update) > 0) {
                x.rta = 'OK';
                $uibModalInstance.close(x);
                Data.toast({"status": "success", "message": "HA SIDO MODIFICADO...!!!!!!!!!!"});
            } else {
                x.rta = 'FAIL';
                $uibModalInstance.close(x);
                Data.toast({"status": "error", "message": "HA OCURRIDO UN ERROR AL ACTUALIZAR...!!!!!!!!!!"});
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('existencias', function ($scope, Data, $http, $filter) {
    $scope.facturas = [];
    $scope.codigos = [];
    $scope.totales = [];

    $scope.nombre = true;

    $scope.producto_view = {};
    $scope.producto_view.estado = false;

    $scope.filas = [{'valor': '5'}, {'valor': '10'}, {'valor': '15'}, {'valor': '20'}, {'valor': '30'}, {'valor': $scope.facturas.length}];
    $scope.filas_now = $scope.facturas.length;

    $scope.productos = [];
    $scope.selectedProducto = [];
    $scope.selectedProducto.originalObject = [];


    Data.get('../existencias/load_grupo').then(function (result) {
        $scope.grupos = result;
    });

    Data.get('../existencias/load_marca').then(function (result) {
        $scope.marcas = result;
    });

    Data.get('select_all_productos').then(function (result2) {
        $scope.productos = result2;
    });

    $scope.buscar = function () {
        if (angular.isUndefined($scope.selectedProducto)) {
            $scope.producto_select = '';
        } else {
            if ($scope.selectedProducto.originalObject != null) {
                $scope.producto_select = $scope.selectedProducto.originalObject.codigo;
            } else {
                $scope.producto_select = '';
            }
        }
        formData = {
            "grupo": $scope.validate($scope.selectedGrupo),
            "marca": $scope.validate($scope.selectedMarca),
            "prod_nombre": $scope.validate($scope.nombre_prod),
            "prod_cod2": $scope.validate($scope.cod2_prod)
        };
        $http.post('existencias/find', formData).then(function (result) {
            if (result) {

                var prod = [];
                for (var i = 0; i < result.data.query.length; i++) {
                    if (i % 4 == 0)
                        prod.push([]);
                    prod[prod.length - 1].push(result.data.query[i]);
                }
                $scope.producto = prod;
                $scope.filas[5].valor = $scope.producto.length;
            }
        });
    };


    $scope.validate = function (valor) {
        var send;
        if ((angular.isUndefined(valor)) || (valor == -1)) {
            send = '';
        } else {
            send = valor;
        }
        return send;
    };

    $scope.filas_now_change = function (valor) {
        $scope.filas_now = valor.valor;
    };

    $scope.quit_producto = function () {
        $scope.selectedProducto.title = '';
        $scope.selectedProducto.originalObject = null;
        $scope.producto_view.estado = false;
    };
});
