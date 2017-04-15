app.controller('initCtrl', function ($scope, $uibModal, Data, $filter, ngCart, $http, MyService, $location) {
    $scope.init = function () {
        $scope.grupos = {};
        $scope.subgrupos = {};
        $scope.productos = {};
        $scope.producto = [];
        $scope.cliente_default = [];
        $scope.puntoventas = [];
        $scope.cedula_valida = false;
        $scope.product_X_cod = [];
        $scope.product_X_cod.stockactual = 0;
        $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        $scope.bandera_codigo = false;
        $scope.producto.img = [];
        $scope.producto_find = {'cantidad': 1, 'codigo2': ''};
        ngCart.empty();
        //Variable que almacena las mesas, que se deben mostrar como ocupadas o disponibles
        $scope.mesas = {};
        $scope.ver_datos_mesa = false;
        $scope.empleados = {};
        $scope.mesa_aux = [];
        $scope.show_boton_rec = false;
        $scope.show_boton_des = false;
        $scope.ver_boton_facturar = true;
//<<<<<<< HEAD
        
        ngCart.setTaxRate(0);
        ngCart.setShipping(0);
       
//=======

        $scope.puntoventas.bodega_id = 0;

//>>>>>>> 9eac046a83885ef5180f5649ee46e3d98e94d4e1
        Data.get('get_tarifaIva').then(function (result) {
            iva_calc = result.iva_calc;
        });
        //Permite obtener el listado de mesas
        Data.get('select_all_mesas').then(function (data) {
            if (data.length > 0) {
                $scope.mesas = data;
            }
        });

        Data.get('get_size_img').then(function (data) {
            $scope.ancho = data.ancho;
            $scope.largo = data.largo;
        });

        Data.get('get_ptoventa').then(function (data) {
            if (data.length > 0) {
                $scope.puntoventas.bodega_id = data[0].bodega_id;
                $scope.puntoventas.establecimiento = data[0].establecimiento;
                $scope.puntoventas.puntoemision = data[0].puntoemision;
                $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
                $scope.permiso = true;
            } else {
                $scope.permiso = false;
            }
        });

        $scope.get_ptoventa = function (){
            Data.get('get_ptoventa').then(function (data) {
                if (data.length > 0) {
                    $scope.puntoventas.bodega_id = data[0].bodega_id;
                    $scope.puntoventas.establecimiento = data[0].establecimiento;
                    $scope.puntoventas.puntoemision = data[0].puntoemision;
                    $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
                    $scope.permiso = true;
                } else {
                    $scope.permiso = false;
                }
            });
        }

        Data.get('consultar_grupos').then(function (data) {
            if (data.length > 0) {
                $scope.grupos = data;
                $scope.subgrupo = [];
                $scope.productos = [];
                send = {'cod_grupo': $scope.grupos[0].codigo, 'bodega_id':$scope.puntoventas.bodega_id};
                Data.post('consultar_subgrupos', send).then(function (result) {
                    if (result.count > 0) {
                        $scope.subgrupo = result.query;
                    } else {
                        Data.post('consultar_productos_x_grupo_marca', send).then(function (result) {
                            $scope.productos = result.query;
                        });
                    }
                });
            }

        });

        Data.get('select_cli_x_ced/9999999999').then(function (result) {
            $scope.cliente_default = result.query[0];
            $scope.cliente_find = $scope.cliente_default;
            $scope.cedula_valida = true;
        });


    };

    $scope.init();
    //Obtener datos de una mesa
    $scope.set_mesa_orden = function (mesa) {
        $scope.mesa_aux = {};
        $scope.cliente_find = {};

        $scope.mesa_aux.mesa_id = mesa.mesa_id;
        $scope.mesa_aux.mesa_nro = mesa.mesa_nro;
        $scope.mesa_aux.mesa_estado = mesa.mesa_estado;
        $scope.ver_datos_mesa = true;
        $scope.ver_boton_facturar = false;
        $scope.empleados = {};

        ngCart.empty();

        Data.get('select_all_empleados').then(function (data) {
            if (data.length > 0) {
                $scope.empleados = data;
                $scope.mesa_aux.emp = $scope.empleados[0];
            }
        });
        
        if ($scope.mesa_aux.mesa_estado == 0) {
            $scope.mesa_aux.orden_servicio = 0;
            
            
            //Para que cargue por defeto en las mesas consumidor final MC 16/05/2016
            Data.get('select_cli_x_ced/9999999999').then(function (result) {
                $scope.cliente_default = result.query[0];
                $scope.cliente_find = $scope.cliente_default;
                $scope.cedula_valida = true;
            });
      
            Data.toast({"status": '', "message": 'Mesa libre, agregada correctamente'});
        } else {
            Data.post('get_data_cliente_orden', mesa.mesa_id).then(function (result) {
                if (result.count > 0) {
                    $scope.cliente_find = result.cliente[0];
                    $scope.mesa_aux.orden_servicio = result.query.ord_id;
                    $scope.mesa_aux.cliente_mesa = $scope.cliente_find.nombres_apellidos;
                    $scope.mesa_aux.emp = $scope.empleados[result.pos_mesero];

                }
            });
            Data.toast({"status": '', "message": 'Mesa ocupada, el pedido que realice será agregado a la orden de servicio relacionada con esta mesa.'});
        }

    };

    $scope.consultar_productos = function (grupo) {
        $scope.extras = [];
        $scope.subgrupo = [];
        $scope.productos = [];
        $scope.get_ptoventa();
        send = {'cod_grupo': grupo.codigo, 'bodega_id':$scope.puntoventas.bodega_id};
        Data.post('consultar_subgrupos', send).then(function (result) {
            if (result.count > 0) {
                $scope.subgrupo = result.query;
            } else {
                Data.post('consultar_productos_x_grupo_marca', send).then(function (result) {
                    $scope.productos = result.query;
                });
            }
        });
    };

    $scope.find_product = function (subgrupo) {
        $scope.extras = [];
        $scope.productos = [];
        send = {'id_subgrupo': subgrupo.id_sub};
        Data.post('consultar_productos_X_subgrupos', send).then(function (result) {
            $scope.productos = result.query;
        });
    };

    $scope.add_item = function (producto) {
        /*Mostar al agregar un producto*/
        $scope.show_boton_rec = true;
        $scope.show_boton_des = true;
        $scope.ver_recargo_descuento = true;
        producto.iva_calc = iva_calc;
        ngCart.addItem(producto.codigo, producto.nombreUnico.substring(0, 20), producto.price, 1, producto);
        Data.post('consultar_extras', producto.codigo).then(function (result) {
            $scope.extras = result.query;
        });
    };

    $scope.add_extra = function (extra) {
        send = {'cart': ngCart.getItems(), 'id_extra': extra.codigo};
        Data.post('consultar_existe_combo', send).then(function (result) {
            if (result === "true") {
                ngCart.addItem(extra.codigo2, extra.nombreUnico, extra.price, 1, extra);
            } else {
                Data.toast({"status": "error", "message": "ERROR...!!!!!!!!!!"});
            }
        });
    };
    
    $scope.recargo_val = function () {
        $scope.rec_porcentaje = parseFloat(($scope.rec_valor * 100) / ngCart.Subtotal());
        $scope.rec_porcentaje = $scope.rec_porcentaje.toFixed(2);
        ngCart.setTaxRate($scope.rec_valor);
    }
    
    $scope.recargo_por = function () {
        $scope.rec_valor = (ngCart.Subtotal() * $scope.rec_porcentaje) /100;
        $scope.rec_valor = $scope.rec_valor.toFixed(2);
        ngCart.setTaxRate($scope.rec_valor);
    }
    
    $scope.descuento_val = function () {
        $scope.des_porcentaje = parseFloat(($scope.des_valor * 100) / ngCart.Subtotal());
        $scope.des_porcentaje = $scope.des_porcentaje.toFixed(2);
        ngCart.setShipping($scope.des_valor);
    }
    
    $scope.descuento_por = function () {
        $scope.des_valor = (ngCart.Subtotal() * $scope.des_porcentaje) /100;
        $scope.des_valor = $scope.des_valor.toFixed(2);
        ngCart.setShipping($scope.des_valor);
    }
    
    $scope.find_cli = function () {
        var cliente = '';
        Data.get('select_cli_x_ced/' + $scope.cliente_find.PersonaComercio_cedulaRuc).then(function (result) {
            if (result.credito > 0) {
                MyService.data.es_credito = true;
            } else {
                MyService.data.es_credito = false;
            }
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
                var modalInstance = $uibModal.open({
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

    $scope.find_pro = function (producto_find) {
        var producto = [];
        Data.post('find_product_codigo2', producto_find).then(function (result) {
            if (result.query.length > 0) {
                producto = result.query[0];
                producto.iva_calc = iva_calc;
                ngCart.addItem(producto.codigo, producto.nombreUnico, producto.price, parseInt(producto.cant), producto);
                var el = document.getElementById('cantidad');
                el.focus();
            }
            $scope.producto_find = {'cantidad': 1, 'codigo2': ''};
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };

    $scope.get_cart = function () {
        if (ngCart.getTotalItems() > 0) {
            if (!angular.isUndefined($scope.pedido)) {
                send = {"cart": ngCart, "cliente": $scope.cliente_find, "id_factura": $scope.pedido};
            } else {
                if ($scope.mesa_aux) {
                    send = {"cart": ngCart, "cliente": $scope.cliente_find, "id_factura": 0, "mesa_aux": $scope.mesa_aux};
                } else {
                    send = {"cart": ngCart, "cliente": $scope.cliente_find, "id_factura": 0, "mesa_aux": null};
                }

            }
            var modalInstance = $uibModal.open({
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
                    $location.path('/print/' + selectedObject.venta.venta_id);
                    ngCart.empty();
                } else if (selectedObject.rta == "FAIL") {

                }
            });
        } else {
            Data.toast({"status": "error", "message": "LA FACTURA ESTA VACIA...!!!!!!!!!!"});
        }
    };

    $scope.save_pedido = function () {
        if (ngCart.getTotalItems() > 0) {
            var aux = 0;
            comanda = {
                "subtotal0": ngCart.totalCero(),
                "subtotal12": ngCart.totalDoce(),
                "servicios": ngCart.totalServicios(),
                "subtotal": ngCart.Subtotal(),
                "iva12": ngCart.IVA(),
                "descuento_val": $scope.des_valor,
                "descuento_porc": $scope.des_porcentaje
            };
            send = {
                "comanda": comanda,
                "detalle": ngCart.getItems(),
                "cliente": $scope.cliente_find,
                "mesa": $scope.mesa_aux
            };
            Data.post('save_orden_servicio', send).then(function (result) {
                if (result.rta === 'OK') {
                    ngCart.empty();
                    MyService.data.id_comanda = result.id_comanda;
                    $location.path('/print_comanda/' + result.id_comanda);
                    $scope.init();
                }
                Data.toast({"status": result.tipo, "message": result.msg});
            });
        } else {
            Data.toast({"status": "error", "message": "EL PEDIDO ESTA VACIO...!!!!!!!!!!"});
        }
    };

    $scope.consultar_comandas_mesa = function (mesa_id) {
        $scope.pedidos = [];
        Data.post('get_comandas_mesa', mesa_id).then(function (result) {
            if (result.query) {
                $scope.ver_boton_facturar = true;
                $scope.pedidos = result.query;
                console.log($scope.pedidos);
                angular.forEach($scope.pedidos, function (pedido) {
                    pedido.iva_calc = iva_calc;
                    ngCart.addItem(pedido.id_producto, pedido.nombreUnico.substring(0, 20), pedido.valor, parseInt(pedido.cantidad), pedido);
                    // asigno el descuento al des_valor del scope AJP 28/10/2016
                    $scope.des_valor = pedido.desc_val;
                });
                
                // llamo la funcion de descuento del scope AJP 28/10/2016
                $scope.descuento_val();
            }
        });

    };

    $scope.cambiar_mesa = function (mesa) {
        var modalInstance = $uibModal.open({
            templateUrl: 'index/load_view_mesas',
            controller: 'mesasCtrl',
            size: 'lg',
            resolve: {
                item: function () {
                    return mesa;
                }
            }
        });
        modalInstance.result.then(function (mesa) {
            $scope.mesa_aux.mesa_nro = mesa.mesa_nro;
            $scope.mesa_aux.mesa_id = mesa.mesa_id;
            Data.get('select_all_mesas').then(function (data) {
                if (data.length > 0) {
                    $scope.mesas = data;
                }
            });

        });
    };

    $scope.ver_mapa = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'index/load_mapa',
            controller: 'mapaImgCtrl',
            size: 'lg',
            resolve: {
                item: function () {
                    //return cliente;
                }
            }
        });
        modalInstance.result.then(function (selectedObject) {
            //$scope.cliente_find = selectedObject;
        });
    };
});


app.controller('admin_cli', function ($scope, Data, $uibModalInstance, item, MyService) {
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
            $uibModalInstance.close(result.query[0]);
        });
    };

    $scope.new_cli = function (cliente) {
        Data.post('new_cli', cliente).then(function (rta) {
            if (rta.id > 0) {
                Data.toast({"status": "success", "message": rta.msg});
                Data.get('select_cli_x_ced/' + cliente.PersonaComercio_cedulaRuc).then(function (result) {
                    $uibModalInstance.close(result.query[0]);
                });
            } else {
                Data.toast({"status": "error", "message": rta.msg});
            }
        });
    };
});

app.controller('cambio_ctrl', function ($http, $scope, Data, $uibModalInstance, item, MyService) {
    $scope.title = 'CAMBIO';
    $scope.total_compra = angular.copy(item.cart.Total().toFixed(2));
    $scope.recibo = $scope.total_compra;
    $scope.cambio = 0.00;
    $scope.credito = $scope.total_compra;
    $scope.msg = '';
    $scope.cliente = item.cliente;
    $scope.bandera = true;
    $scope.es_credito = MyService.data.es_credito;


    $scope.$watch('recibo', function () {
        if (parseFloat($scope.recibo) >= parseFloat($scope.total_compra)) {
            $scope.msg = '';
            $scope.cambio = ($scope.recibo - $scope.total_compra).toFixed(2);
            $scope.bandera = false;
        } else {
            $scope.bandera = true;
            $scope.cambio = 0;
            $scope.msg = 'EL VALOR RECIBIDO ES MENOR AL TOTAL DE LA COMPRA...!!!';
        }
    });

    $scope.save_fact = function () {
        var aux = 0;
        factura = {"subtotalBruto": item.cart.Subtotal(),
            "descuentovalor": item.cart.Descuento(),
            "recargovalor": item.cart.Recargo(),
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
            "efectivoval": $scope.recibo,
            "baseiva": item.cart.totalDoce()
        };
        send = {
            "factura": factura,
            "detalle": item.cart.getItems(),
            "cliente": $scope.cliente,
            "id_factura": item.id_factura,
            "mesa_aux": item.mesa_aux
        };
        if ($scope.es_credito) {
            send.tipo_pago = "CREDITO";
        } else {
            send.tipo_pago = "EFECTIVO";
        }
        Data.post('get_cart', send).then(function (result) {
            if (result.bandera) {
                Data.toast({"status": "success", "message": "FACTURA HA SIDO ARCHIVADA"});
                var x = [];
                x.rta = 'OK';
                x.venta = result;
                //$scope.es_credito = false;
                MyService.data.es_credito = false;
                $uibModalInstance.close(x);
            } else {
                Data.toast({"status": "error", "message": result.msg});
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('Close');
    };
});

app.controller('list_ordenes', function ($scope, Data, MyService, $location) {
    $scope.bandera_vereditar = true;

    Data.post('select_all_ordenes').then(function (result) {
        $scope.checkins = result.query;
    });
    $scope.checkins = [];
    $scope.print = function (id_comanda) {

        /* MyService.data.id_comanda = id_comanda;
         $location.path('/print_comanda');*/
//        $scope.pedidos = [];
//        Data.post('get_comandas', id_comanda).then(function (result) {
//            if (result.query) {
//                $scope.ver_boton_facturar = true;
//                $scope.pedidos = result.query;
//                //console.log($scope.pedidos);
//                angular.forEach($scope.pedidos, function (pedido) {
//                    console.log(pedido);
//                    ngCart.addItem(pedido.codigo, pedido.nombreUnico.substring(0, 20), pedido.price, 1, pedido);
//                    //ngCart.addItem(pedido.id_producto, pedido.nombreUnico.substring(0, 20), pedido.valor, parseInt(pedido.cantidad), pedido);
//
//                });
//            }
//        });

        MyService.data.id_comanda = id_comanda;
        $location.path('/print_comanda/'+id_comanda);

    };

    $scope.edit = function (id_comanda) {
        MyService.data.id_comanda = id_comanda;
        $location.path('/edit_comanda/' + id_comanda);
    };

    $scope.delete = function (id_comanda) {
        $scope.comandas = _.without($scope.comandas, _.findWhere($scope.comandas, {id_comanda: id_comanda}));
        Data.post('delete_comanda', id_comanda).then(function (result) {
            $scope.checkins = result.query.query;
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };

    // AJP 11-05-2016
    $scope.data_form = {};// este se usará para llenar los datos del formulario en cada campo del mismo  
    $scope.estados_chekin = {
        datos_llenar: [
            {name: "Seleccione", value: "0"},
            {name: "Facturar", value: "2"},
            {name: "Facturada", value: "1"},
            {name: "Anulada", value: "-1"}
        ],
        dato_seleccionado: {value: "2", name: "Facturar"}// Genero el dato que saldra por defecto
    };// genero los obj del selector

    $scope.search_by_filter = function (data_form) {
        console.log(data_form);
        Data.post('select_ordenes_by_filter', data_form).then(function (result) {
            $scope.checkins = result.query;
//                    $scope.lista_checkin = data;
//                    alert($scope.lista_pagos);
            console.log($scope.checkins);
//                    llamar_tabla(data_form);
        });

    }

    $scope.ver_editar = function () {
        var currentItem = this.data_form;
        //console.log("here"+currentItem.chekin_estado.value);
        if (currentItem.chekin_estado.value == 2) {
            $scope.bandera_vereditar = true;
        } else {
            $scope.bandera_vereditar = false;
        }
    };

});

app.controller('genericoCtrl', function ($scope, MyService, $http, Data, $filter) {
    $scope.superproductos = [];
    $scope.superproductos.nombre = '';
    $scope.add_productos = false;
    $scope.producto_find = [];
    $scope.producto_find.codigo = '';
    $scope.producto_find.cantidad = 1;

    Data.get('get_superproductos').then(function (data) {
        $scope.superproductos = data;
    });

    $scope.add = function (producto) {
        $scope.productos = [];
        $scope.add_productos = true;
        Data.post('find_generic', producto.codigo).then(function (rta) {
            $scope.producto_generico = producto;
            if (rta.query.length > 0) {
                angular.forEach(rta.query, function (prod) {
                    $scope.productos = $scope.productos.concat(prod);
                    $scope.producto_find.codigo = '';
                    $scope.producto_find.cantidad = 1;
                });
            } else {
                $scope.producto_find.codigo = '';
                $scope.producto_find.cantidad = 1;
            }
        });
    };

    $scope.findproduct = function (cod, cant) {
        send = {codigo: cod, cantidad: cant};
        if ($scope.productos.length > 0) {
            if (angular.isUndefined(_.findWhere($scope.productos, {codigo: cod}))) {
                Data.post('find_product', send).then(function (rta) {
                    Data.toast({"status": rta.tipo, "message": rta.msg});
                    if (rta.rows > 0) {
                        $scope.productos = $scope.productos.concat(rta.query);
                        $scope.producto_find.codigo = '';
                        $scope.producto_find.cantidad = 1;
                    }
                });
            } else {
                Data.toast({"status": 'error', "message": "YA EXISTE"});
            }
        } else {
            Data.post('find_product', send).then(function (rta) {
                Data.toast({"status": rta.tipo, "message": rta.msg});
                if (rta.rows > 0) {
                    $scope.productos = $scope.productos.concat(rta.query);
                    $scope.producto_find.codigo = '';
                    $scope.producto_find.cantidad = 1;
                }
            });
        }
    };

    $scope.quitproduct = function (cod) {
        $scope.productos = _.without($scope.productos, _.findWhere($scope.productos, {codigo: cod}));
    };

    $scope.nuevo = function () {
        send = {producto_generico: $scope.producto_generico, productos: $scope.productos};
        Data.post('guardar_productos', send).then(function (rta) {
            if (rta > 0) {
                $scope.productos = [];
                $scope.producto_find.codigo = "";
                $scope.add_productos = false;
                Data.toast({"status": "success", "message": "HA SIDO CREADO...!!!!!!!!!!"});
            } else {
                Data.toast({"status": "error", "message": "HA OCURRIDO UN ERROR...!!!!!!!!!!"});
            }
        });
    };
});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item, MyService, $http, Data) {
    $scope.cliente = MyService.data.cliente[0];

    $scope.ok = function () {
        $http.post('ventasjs/update_cli', $scope.cliente).then(function (result) {
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
    }]);

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
    }]);

//<<<<<<< HEAD
//app.controller('printCtrl', ['$scope', 'Data', '$location', function ($scope, Data, $location) {

//=======
app.controller('mapaImgCtrl', ['$scope', 'Data', 'upload', 'mySharedService', function ($scope, Data, upload, mySharedService) {

        $scope.mapa_img = '';

        Data.get('get_mapa').then(function (data) {
            $scope.mapa_img = data;
        });

        $scope.uploadFile = function ()
        {
            var name = '';
            var file = $scope.file;
            var send = {};
            send.codigo = '';
            send.file = file.name;
            upload.uploadFile_mapa(file, name).then(function (res)
            {
                Data.put('update_mapa', send).then(function (result) {
                    mySharedService.prepForBroadcast(result);
                    Data.toast({"status": "success", "message": "SE HA ACTUALIZADO LA IMAGEN...!!!!!!!!!!"});
                });
            })
        }

        $scope.$on('handleBroadcast', function () {
            $scope.mapa_img = mySharedService.message;
        });
    }]);

app.controller('printCtrl', ['$scope','Data', '$location', function ($scope, Data,$location) {
        
//>>>>>>> 9eac046a83885ef5180f5649ee46e3d98e94d4e1
        Data.get('get_forma_print').then(function (forma_print) {
            $("#puntoventaprint_view").printThis({optprint1});
            if (forma_print.directa == 1) {
                $location.path('/index/load_main/');
            }


        });
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

        this.uploadFile_mapa = function (file, name)
        {
            var deferred = $q.defer();
            var formData = new FormData();
            formData.append("name", name);
            formData.append("file", file);
            return $http.post("index/load_server_mapa", formData, {
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

app.controller('mesaCtrl', function ($scope, Data, $filter, $location, $uibModal) {
    $scope.mesa = '';

    $scope.init = function () {
        Data.get('select_all_mesas').then(function (result) {
            $scope.mesas = result;
        });

        Data.get('select_all_estados').then(function (result) {
            $scope.estados = result;
        });

        $scope.mesa.nro = '';
        $scope.mesa.capacidad = '';
    };

    $scope.init();

    $scope.save_mesa = function (mesa, estado) {
        send = {"mesa": mesa, "estado": estado};
        Data.post('save_mesa', send).then(function (result) {
            if (result.count > 0) {
                $scope.mesas = result.query;
                $scope.init();
            } else {
                Data.toast({"status": result.tipo, "message": result.msg});
            }
        });
    };

    $scope.delete_mesa = function (mesa) {
        Data.post('delete_mesa', mesa).then(function (result) {
            if (result.count > 0) {
                $scope.mesas = result.query;
                Data.toast({"status": result.tipo, "message": result.msg});
            } else {
                Data.toast({"status": result.tipo, "message": result.msg});
            }
        });
    };

    $scope.columns = [
        {text: "NRO MESA", predicate: "nombre", sortable: true},
        {text: "CAPACIDAD", predicate: "nombre_producto", sortable: true},
        {text: "ESTADO", predicate: "nombre_producto", sortable: true}

    ];
});

app.controller('printComandaCtrl', function ($scope, Data, MyService) {
    Data.post('consultar_comanda_print', MyService.data.id_comanda).then(function (result) {
        $scope.comandas = result.query;
        $scope.totales = result.totales;
        $scope.datos = result.datos;
    });
});

app.controller('mesasCtrl', function ($scope, Data, $filter, $location, $uibModalInstance, item) {
    $scope.mesa_cambio = {};
    $scope.mesas_disp = {};

    Data.get('select_all_mesas_disponibles').then(function (result) {
        $scope.mesas_disp = result;
        $scope.mesa_cambio = item;
    });

    $scope.elegirMesa = function (mesa_cambio, mesa) {
        send = {"mesa_anterior": mesa_cambio.mesa_id, "mesa_nueva": mesa.mesa_id, "orden_id": mesa_cambio.orden_servicio};
        Data.post('update_data_mesa_orden', send).then(function (res) {
            Data.toast({"status": res.tipo, "message": res.msg});
        });
        $uibModalInstance.close(mesa);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('Close');
    };
});

app.controller('editComandaCtrl', function ($scope, Data, $filter, ngCart, $uibModal, MyService, $location) {

    Data.post('consultar_comanda_edit', MyService.data.id_comanda).then(function (result) {
        $scope.grupos = {};
        $scope.subgrupos = {};
        $scope.productos = {};
        $scope.producto = [];
        $scope.cliente_default = [];
        $scope.puntoventas = [];
        $scope.cedula_valida = false;
        $scope.product_X_cod = [];
        $scope.product_X_cod.stockactual = 0;
        $scope.product_X_cod.nombreUnico = 'CODIGO ESTA VACIO....!!!!!!';
        $scope.bandera_codigo = false;
        $scope.producto.img = [];
        $scope.producto_find = {'cantidad': 1, 'codigo2': ''};
        ngCart.empty();
        //Variable que almacena las mesas, que se deben mostrar como ocupadas o disponibles
        $scope.mesas = {};
        $scope.ver_datos_mesa = false;
        $scope.empleados = {};
        $scope.mesa_aux = {};
        $scope.ver_boton_facturar = true;
        $scope.comanda = {};
        $scope.comanda.id_comanda = result.totales.id_comanda;
        //console.log("here"+result.totales.id_comanda);

        Data.get('get_tarifaIva').then(function (result) {
            iva_calc = result.iva_calc;
        });

        //Permite obtener el listado de mesas
        Data.get('select_all_mesas').then(function (data) {
            if (data.length > 0) {
                $scope.mesas = data;
            }
        });


        Data.post('get_data_cliente_orden', result.datos.mesa_id).then(function (result) {
            console.log(result);
            if (result.count > 0) {
                $scope.cliente_find = result.cliente[0];
                $scope.mesa_aux.orden_servicio = result.query.ord_id;
                $scope.mesa_aux.cliente_mesa = $scope.cliente_find.nombres_apellidos;
                $scope.mesa_aux.emp = $scope.empleados[result.pos_mesero];
            }
        });

        Data.get('select_all_empleados').then(function (data) {
            if (data.length > 0) {
                $scope.empleados = data;
//                console.log($scope.empleados);
            }
        });
        /* $scope.mesa_aux.emp = $scope.empleados[0];
         $scope.mesa_aux.emp = $scope.empleados[result.pos_mesero];*/
        Data.get('get_size_img').then(function (data) {
            $scope.ancho = data.ancho;
            $scope.largo = data.largo;
        });

        $scope.mesa_aux.mesa_id = result.datos.mesa_id;
        $scope.mesa_aux.mesa_nro = result.datos.mesa_nro;
        $scope.mesa_aux.mesa_estado = 1;

        $scope.ver_datos_mesa = true;
        $scope.ver_boton_facturar = false;

        Data.get('consultar_grupos').then(function (data) {
            if (data.length > 0) {
                $scope.grupos = data;
                $scope.subgrupo = [];
                $scope.productos = [];
                send = {'cod_grupo': $scope.grupos[0].codigo};
                Data.post('consultar_subgrupos', send).then(function (result) {
                    if (result.count > 0) {
                        $scope.subgrupo = result.query;
                    } else {
                        Data.post('consultar_productos_x_grupo_marca', send).then(function (result) {
                            $scope.productos = result.query;
                        });
                    }
                });
            }

        });

        Data.get('select_cli_x_ced/' + result.datos.ci).then(function (result) {
            $scope.cliente_default = result.query[0];
            $scope.cliente_find = $scope.cliente_default;
            $scope.cedula_valida = true;
        });


        $scope.pedidos = [];
        mesa_id = result.datos.mesa_id;
        Data.post('get_comandas_mesa', mesa_id).then(function (result) {
            if (result.query) {
                $scope.ver_boton_facturar = false;
                $scope.pedidos = result.query;
                //console.log($scope.pedidos);
                angular.forEach($scope.pedidos, function (pedido) {
                    pedido.iva_calc = iva_calc;
                    ngCart.addItem(pedido.id_producto, pedido.nombreUnico.substring(0, 20), pedido.valor, parseInt(pedido.cantidad), pedido);
                });
            }
        });

    });

    $scope.consultar_productos = function (grupo) {
        $scope.extras = [];
        $scope.subgrupo = [];
        $scope.productos = [];
        send = {'cod_grupo': grupo.codigo};
        Data.post('consultar_subgrupos', send).then(function (result) {
            if (result.count > 0) {
                $scope.subgrupo = result.query;
            } else {
                Data.post('consultar_productos_x_grupo_marca', send).then(function (result) {
                    $scope.productos = result.query;
                });
            }
        });
    };

    $scope.find_product = function (subgrupo) {
        $scope.extras = [];
        $scope.productos = [];
        send = {'id_subgrupo': subgrupo.id_sub};
        Data.post('consultar_productos_X_subgrupos', send).then(function (result) {
            $scope.productos = result.query;
        });
    };

    $scope.add_item = function (producto) {
        producto.iva_calc = iva_calc;
        ngCart.addItem(producto.codigo, producto.nombreUnico.substring(0, 20), producto.price, 1, producto);
        Data.post('consultar_extras', producto.codigo).then(function (result) {
            $scope.extras = result.query;
        });
    };

    $scope.add_extra = function (extra) {
        send = {'cart': ngCart.getItems(), 'id_extra': extra.codigo};
        Data.post('consultar_existe_combo', send).then(function (result) {
            if (result === "true") {
                ngCart.addItem(extra.codigo2, extra.nombreUnico, extra.price, 1, extra);
            } else {
                Data.toast({"status": "error", "message": "ERROR...!!!!!!!!!!"});
            }
        });
    };

    $scope.find_cli = function () {
        var cliente = '';
        Data.get('select_cli_x_ced/' + $scope.cliente_find.PersonaComercio_cedulaRuc).then(function (result) {
            if (result.credito > 0) {
                MyService.data.es_credito = true;
            } else {
                MyService.data.es_credito = false;
            }
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
                var modalInstance = $uibModal.open({
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

    $scope.find_pro = function (producto_find) {
        var producto = [];
        Data.post('find_product_codigo2', producto_find).then(function (result) {
            if (result.query.length > 0) {
                producto = result.query[0];
                producto.iva_calc = iva_calc;
                ngCart.addItem(producto.codigo, producto.nombreUnico, producto.price, parseInt(producto.cant), producto);
                var el = document.getElementById('cantidad');
                el.focus();
            }
            $scope.producto_find = {'cantidad': 1, 'codigo2': ''};
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };

    $scope.get_cart = function () {
        if (ngCart.getTotalItems() > 0) {
            if (!angular.isUndefined($scope.pedido)) {
                send = {"cart": ngCart, "cliente": $scope.cliente_find, "id_factura": $scope.pedido};
            } else {
                if ($scope.mesa_aux) {
                    send = {"cart": ngCart, "cliente": $scope.cliente_find, "id_factura": 0, "mesa_aux": $scope.mesa_aux};
                } else {
                    send = {"cart": ngCart, "cliente": $scope.cliente_find, "id_factura": 0, "mesa_aux": null};
                }

            }
            var modalInstance = $uibModal.open({
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
                    $location.path('/print/' + selectedObject.venta.venta_id);
                    ngCart.empty();
//                    Data.get('get_ptoventa').then(function (data) {
//                        $scope.puntoventas.establecimiento = data[0].establecimiento;
//                        $scope.puntoventas.puntoemision = data[0].puntoemision;
//                        $scope.puntoventas.secuenciaultima = parseInt(data[0].secuenciaultima) + 1;
//                    });
                } else if (selectedObject.rta == "FAIL") {

                }
            });
        } else {
            Data.toast({"status": "error", "message": "LA FACTURA ESTA VACIA...!!!!!!!!!!"});
        }
    };

    $scope.update_pedido = function () {
//        if($scope.cliente_find.PersonaComercio_cedulaRuc!='9999999999'){
        if (ngCart.getTotalItems() > 0) {
            var aux = 0;
            comanda = {
                "subtotal0": ngCart.totalCero(),
                "subtotal12": ngCart.totalDoce(),
                "servicios": ngCart.totalServicios(),
                "subtotal": ngCart.Subtotal(),
                "iva12": ngCart.IVA()
            };
            send = {
                "comanda": comanda,
                "detalle": ngCart.getItems(),
                "cliente": $scope.cliente_find,
                "mesa": $scope.mesa_aux,
                "des_comanda": $scope.comanda
            };
            console.log(send.mesa.emp);
            if(send.mesa.emp == undefined){
                Data.toast({"status": "error", "message": "MESERO NO ESTA ESPECIFICADO"});
            }
            Data.post('update_orden_servicio', send).then(function (result) {
                
                if (result.rta === 'OK') {
                    ngCart.empty();
                    MyService.data.id_comanda = result.id_comanda;
//                    location.reload(); // esta linea 
//                    document.location.reload(false);
                    $location.path('/print_comanda/' + result.id_comanda);
                    $scope.init();
                }
                Data.toast({"status": result.tipo, "message": result.msg});
            });
        } else {
            Data.toast({"status": "error", "message": "EL PEDIDO ESTA VACIO...!!!!!!!!!!"});
        }
//        }else{
//            Data.toast({"status":"error","message":"NO SE PUEDE REALIZAR UN PEDIDO A UN CONSUMIDOR FINAL...!!!!!!!!!!"});
//        }
    };

    $scope.consultar_comandas_mesa = function (mesa_id) {
        $scope.pedidos = [];
        Data.post('get_comandas_mesa', mesa_id).then(function (result) {
            if (result.query) {
                $scope.ver_boton_facturar = true;
                $scope.pedidos = result.query;
                //console.log($scope.pedidos);
                angular.forEach($scope.pedidos, function (pedido) {
                    pedido.iva_calc = iva_calc;
                    ngCart.addItem(pedido.id_producto, pedido.nombreUnico.substring(0, 20), pedido.valor, parseInt(pedido.cantidad), pedido);

                });
            }
        });

    };

});