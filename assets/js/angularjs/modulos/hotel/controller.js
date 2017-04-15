app.controller('inicio_submodules',function($scope,Data, $filter){
    Data.get('get_sub_modules').then(function (result) {
            $scope.query = result;
        });
});
app.controller('initCtrl', function ($scope, Data, $filter, $location, $uibModal, MyService) {

    $scope.init = function () {
        $scope.cliente = {};
        $scope.registro = {};
        $scope.contacto = {};
        $scope.habitacion = {};

        $scope.cliente.cedula = true;
        $scope.cliente.pasaporte = false;

        $scope.cliente.masculino = true;
        $scope.cliente.femenino = false;

        $scope.cliente.casa = true;
        $scope.cliente.oficina = false;

        $scope.title = 'TARJETA DE INGRESO';
        $scope.cliente.fec_nac = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.registro.fec_in = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.registro.hora_in = $filter('date')(new Date(), 'HH:mm:ss');
        $scope.registro.fec_out = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.registro.fec_actual_reg = $filter('date')(new Date(), 'yyyy-MM-dd');//Almacena la fecha actual del registro
        $scope.registro.fin = false;

        Data.post('get_num_comanda').then(function (result) {
            $scope.registro.id_super_comanda = result;
        });
    };

    $scope.init();

    $scope.$watch('masculino', function () {
        if (!$scope.cliente.masculino) {
            $scope.cliente.femenino = true;
        } else {
            $scope.cliente.femenino = false;
        }
    });

    $scope.$watch('femenino', function () {
        if (!$scope.femenino) {
            $scope.cliente.masculino = true;
        } else {
            $scope.cliente.masculino = false;
        }
    });

    $scope.find_cli = function (cli) {
        var cliente = {'id': cli};
        Data.post('select_cli_x_ced', cliente).then(function (result) {
            if (result.count > 0) {
                $scope.cliente = result.query[0];
                if ($scope.cliente.sexo === 'M') {
                    $scope.cliente.femenino = false;
                    $scope.cliente.masculino = true;
                } else {
                    $scope.cliente.femenino = true;
                    $scope.cliente.masculino = false;
                }
            }
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };
    $scope.duplicar_datos_cli = function (cliente) {
        $scope.cliente_aux = {};
        $scope.cliente_aux = cliente;
        Data.toast({"status": '', "message": 'Datos duplicados correctamente'});
    };

    $scope.find_cli_aux = function (cli) {
        var cliente = '';
        Data.post('select_cli_x_ced', cli).then(function (result) {
            if (result.count > 0) {
                $scope.cliente_aux = result.query[0];
            }
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };

    $scope.guardar = function (cliente, registro, cliente_aux, contacto) {
        send = {"cliente": cliente, "registro": registro, "cliente_aux": cliente_aux, "contacto": contacto};
        Data.post('save_checkin', send).then(function (result) {
            if (result.rta === 'OK') {
                MyService.data.id_checkin = result.id_checkin;
                $location.path('/print_checkin');
                Data.toast({"status": result.tipo, "message": result.msg});
                $scope.init();
            } else {
                Data.toast({"status": result.tipo, "message": result.msg});
            }
        });
    };

    $scope.buscar_hab = function () {
        var cliente = '';
        var modalInstance = $uibModal.open({
            templateUrl: 'index/load_habitaciones',
            controller: 'habitacionesCtrl',
            size: 'lg',
            resolve: {
                item: function () {
                    return cliente;
                }
            }
        });
        modalInstance.result.then(function (selectedObject) {
            $scope.registro.habitacion = selectedObject.nro;
        });
    };

});

app.controller('tipoHabCtrl', function ($scope, Data, $filter) {
    $scope.tipo_elect = [];

    $scope.columns = [
        {text: "NOMBRE"},
        {text: "CODIGO PRODUCTO"},
        {text: "NOMBRE PRODUCTO"},
        {text: "VALOR PRODUCTO"},
        {text: "ACCION"},
        {text: "FIN REG."}
    ];

    Data.get('select_all_tipohab').then(function (result) {
        $scope.tipos = result;
    });

    Data.get('select_all_productos').then(function (result) {
        $scope.productos = result;
    });

    $scope.elegirTipo = function (tipo) {
        $scope.tipo_elec = tipo;
    };

    $scope.save_tipo = function (nombre_tipoh, producto) {
        if (!angular.isUndefined(producto)) {
            send = {"nombre": nombre_tipoh, "id_prod": producto.originalObject.codigo};
            Data.post('save_tipo_habitacion', send).then(function (result) {
                if (result.count > 0) {
                    $scope.tipos = result.query;
                } else {
                    Data.toast({"status": result.tipo, "message": result.msg});
                }
            });
        } else {
            Data.toast({"status": "error", "message": "El campo producto esta vacio...!!!!"});
        }
    };

    $scope.deleteTipo = function (tipo) {
        Data.post('delete_tipohab', tipo).then(function (result) {
            if (result.count > 0) {
                $scope.tipos = result.query;
                Data.toast({"status": result.tipo, "message": result.msg});
            } else {
                Data.toast({"status": result.tipo, "message": result.msg});
            }
        });
    };
});

app.controller('habCtrl', function ($scope, Data, $filter, $location) {
    $scope.habitacion = '';
    $scope.tipo = '';
    $scope.tipos = '';

    $scope.init = function () {
        Data.get('select_all_tipohab').then(function (result) {
            $scope.tipos = result;
        });

        Data.get('select_all_hab').then(function (result) {
            $scope.habitaciones = result;
        });

        Data.get('select_all_estados').then(function (result) {
            $scope.estados = result;
        });

        $scope.habitacion.nro = '';
        $scope.habitacion.capacidad = '';
    };

    $scope.init();

    $scope.save_habitacion = function (habitacion, tipo, estado, capacidad) {
        send = {"habitacion": habitacion, "tipo": tipo, "estado": estado, "capacidad": capacidad};
        Data.post('save_habitacion', send).then(function (result) {
            if (result.count > 0) {
                $scope.habitaciones = result.query;
                $scope.init();
            } else {
                Data.toast({"status": result.tipo, "message": result.msg});
            }
        });
    };

    $scope.deleteHab = function (hab) {
        Data.post('delete_hab', hab).then(function (result) {
            if (result.count > 0) {
                $scope.habitaciones = result.query;
                Data.toast({"status": result.tipo, "message": result.msg});
            } else {
                Data.toast({"status": result.tipo, "message": result.msg});
            }
        });
    };

    $scope.columns = [
        {text: "NRO HABITACION", predicate: "nombre", sortable: true},
        {text: "TIPO", predicate: "nombre_producto", sortable: true},
        {text: "CAPACIDAD", predicate: "nombre_producto", sortable: true},
        {text: "ESTADO", predicate: "nombre_producto", sortable: true}

    ];
});

app.controller('habitacionesCtrl', function ($scope, Data, $filter, $location, $uibModalInstance, item) {

    Data.get('select_all_hab').then(function (result) {
        $scope.habitaciones = result;
    });

    $scope.elegirHab = function (hab) {
        $uibModalInstance.close(hab);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('Close');
    };

    $scope.columns = [{text: "NRO HABITACION"}, {text: "TIPO"}, {text: "CAPACIDAD"}, {text: "ESTADO"}];
});

app.controller('comandaCtrl', function ($scope, Data, $filter, $location, MyService) {

    $scope.init = function () {
        $scope.selectedProduct = {};
        $scope.comandas = [];
        $scope.cantidad = 1;
        $scope.cliente = {};
        $scope.checkin = {};
        $scope.ver_productos = angular.equals({}, $scope.checkin);
        $scope.ver_clientes_hab = angular.equals({}, $scope.chekin);
    };

    $scope.init();

    Data.post('consultar_productos').then(function (result) {
        $scope.productos = result;
    });
    //Para buscar por número de comanda o id del cliente
    $scope.consultar_cli = function (cli) {
        $scope.comandas = [];
        Data.post('consultar_checkin', cli).then(function (result) {
            if (result.count > 0) {
                $scope.checkin = result.query;
                $scope.ver_productos = angular.equals({}, $scope.checkin);
                $scope.ver_clientes_hab = true;
            } else {
                $scope.init();
            }
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };
    //Para buscar por número de comanda
    $scope.consultar_cli_com = function (cli) {
        $scope.comandas = [];
        Data.post('consultar_checkin_com', cli).then(function (result) {
            if (result.count > 0) {
                $scope.checkin = result.query;
                $scope.ver_productos = angular.equals({}, $scope.checkin);
                $scope.ver_clientes_hab = true;
            } else {
                $scope.init();
            }
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };
    //Para buscar por número de habitación
    $scope.consultar_cli_hab = function (hab) {
        $scope.comandas = [];
        Data.post('consultar_checkin_hab', hab).then(function (result) {
            if (result.count > 0) {
                $scope.checkin = result.query;
                $scope.ver_clientes_hab = angular.equals({}, $scope.checkin);
                $scope.ver_productos = true;
            } else {
                $scope.init();
            }
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };

    Data.get('get_tarifaIva').then(function (result) {
        iva_calc = result.iva_calc;
    });

    $scope.add_pro = function (pro) {
        /*console.log('add_pro >>>>>>>>>>>>>>> '+pro);*/
        if (!angular.isUndefined(pro)) {
            $scope.totales = {};
            $scope.totales.subtotal = 0;
            $scope.totales.subtotal0 = 0;
            $scope.totales.subtotal12 = 0;
            $scope.totales.servicios = 0;
            $scope.totales.iva12 = 0;
            $scope.totales.total = 0;
            $scope.porcent_servicios = 10;
            Data.post('add_producto', pro).then(function (result) {
                result.cantidad = 1;
                $scope.comandas = $scope.comandas.concat(result);
                angular.forEach($scope.comandas, function (comanda) {
                    $scope.totales.subtotal += parseFloat(comanda.price);
                    if (comanda.tarporcent == 0) {
                        $scope.totales.subtotal0 += parseFloat(comanda.price);
                    }
                    if (comanda.tarporcent == iva_calc) {
                        $scope.totales.subtotal12 += parseFloat(comanda.price);
                    }
                });
                $scope.totales.servicios += (parseFloat($scope.totales.subtotal) * $scope.porcent_servicios) / 100;
                $scope.totales.iva12 += (parseFloat($scope.totales.subtotal) * iva_calc) / 100;
                $scope.totales.total += $scope.totales.subtotal0 + $scope.totales.subtotal12 + $scope.totales.servicios + $scope.totales.iva12;
                $scope.selectedProduct = {};
            });
        }
    };

    $scope.calcular = function () {
        /*console.log('calcular');*/
        $scope.totales = {};
        $scope.totales.subtotal = 0;
        $scope.totales.subtotal0 = 0;
        $scope.totales.subtotal12 = 0;
        $scope.totales.servicios = 0;
        $scope.totales.iva12 = 0;
        $scope.totales.total = 0;
        $scope.porcent_servicios = 10;
        angular.forEach($scope.comandas, function (comanda) {
            $scope.totales.subtotal += parseFloat(comanda.price);
            if (comanda.tarporcent == 0) {
                $scope.totales.subtotal0 += parseFloat(comanda.price);
            }
            if (comanda.tarporcent == iva_calc) {
                $scope.totales.subtotal12 += parseFloat(comanda.price);
            }
        });
        $scope.totales.servicios += (parseFloat($scope.totales.subtotal) * $scope.porcent_servicios) / 100;
        $scope.totales.iva12 += (parseFloat($scope.totales.subtotal) * iva_calc) / 100;
        $scope.totales.total += $scope.totales.subtotal0 + $scope.totales.subtotal12 + $scope.totales.servicios + $scope.totales.iva12;
    };

    $scope.guardar = function () {
        send = {"checkin": $scope.checkin, "comanda": $scope.comandas, "totales": $scope.totales};
        Data.post('guardar_comanda', send).then(function (result) {
            if (result.rta === 'OK') {
                MyService.data.id_comanda = result.id_comanda;
                $location.path('/print_comanda');
                $scope.init();
                $scope.ver_productos = angular.equals({}, $scope.checkin);
            }
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };

    $scope.quitproduct = function (id) {
        $scope.comandas = _.without($scope.comandas, _.findWhere($scope.comandas, {id: id}));
        $scope.calcular();
    };
});

app.controller('checkoutCtrl', function ($scope, Data, $filter, $location, MyService) {

    $scope.init = function () {
        $scope.selectedProduct = {};
        $scope.comandas = {};
        $scope.cantidad = 1;
        $scope.cliente = {};
        $scope.checkin = {};
        $scope.selectedProduct = {};
        $scope.ver_productos = angular.equals({}, $scope.checkin);
        $scope.ver_clientes_hab = angular.equals({}, $scope.checkin);
        Data.post('get_tarifaIva').then(function (result) {
            $scope.iva = result.iva_calc;
            ;
        });
        angular.forEach($scope.comandas, function (c) {
            $scope.recargo += parseFloat(c.servicios);
        });
        $scope.subtotal = parseFloat($scope.subtotal0 + $scope.subtotal12);
        $scope.descuento = 0;
        $scope.subtotal_neto = 0;
        $scope.subtotal_neto = $scope.subtotal + ($scope.recargo - $scope.descuento);
    };

    $scope.calcular = function () {
        angular.forEach($scope.comandas, function (c) {
            $scope.recargo += parseFloat(c.servicios);
        });
        $scope.subtotal = parseFloat($scope.subtotal0 + $scope.subtotal12);
        $scope.descuento = 0;
        $scope.subtotal_neto = 0;
    };

    $scope.calc_desc = function (comanda) {
        $scope.descuento = 0;
        $scope.subtotal_neto = 0;
        comanda.desc_val = parseFloat(comanda.subtotal * (comanda.desc_porc / 100));
        angular.forEach($scope.comandas, function (c) {
            $scope.descuento += parseFloat(c.desc_val);
        });
        $scope.subtotal_neto = $scope.subtotal + ($scope.recargo - $scope.descuento);
        $scope.iva12 = parseFloat($scope.subtotal_neto * $scope.iva);
        $scope.total = $scope.subtotal_neto + $scope.iva12;
    };

    $scope.$watch('descuento', function () {
        /*$scope.recargo += ($scope.subtotal - $scope.descuento) * 0.10;
         $scope.iva12 += ($scope.subtotal - $scope.descuento) * 0.12;
         $scope.total = ($scope.subtotal - $scope.descuento) + $scope.recargo + $scope.iva12;*/
    });

    $scope.consultar_cli = function (cli) {
        $scope.comandas = {};
        $scope.id_checkin = {};
        $scope.id_super_comanda = {};
        $scope.id_habitacion = {};
        $scope.subtotal = 0;
        $scope.subtotal0 = 0;
        $scope.subtotal12 = 0;
        $scope.recargo = 0;
        $scope.iva12 = 0;
        $scope.total = 0;
        $scope.porcent_servicios = 10;
        $scope.descuento = 0;
        $scope.subtotal_neto = 0;
        $scope.id_cliente = 0;
        Data.post('get_tarifaIva').then(function (result) {
            $scope.iva = parseFloat(result.iva_calc / 100);
        });
        Data.post('consultar_comandas', cli).then(function (result) {
            $scope.comandas = result.query;
            $scope.id_checkin = result.id_checkin;
            $scope.id_habitacion = result.id_habitacion;
            $scope.id_super_comanda = result.id_super_comanda;
            $scope.ver_clientes_hab = true;
            angular.forEach($scope.comandas, function (comanda) {
                $scope.subtotal += parseFloat(comanda.subtotal);
                $scope.subtotal0 += parseFloat(comanda.subtotal0);
                $scope.subtotal12 += parseFloat(comanda.subtotal12);
                $scope.recargo += parseFloat(comanda.servicios);
            });
            $scope.subtotal_neto = $scope.subtotal + ($scope.recargo - $scope.descuento);
            $scope.iva12 = $scope.subtotal_neto * $scope.iva;
            $scope.total = $scope.subtotal_neto + $scope.iva12;
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };
    //Busca todos los clientes de una habitación
    $scope.get_clientes_habitacion = function (hab) {
        $scope.comandas = {};
        $scope.subtotal = 0;
        $scope.subtotal0 = 0;
        $scope.subtotal12 = 0;
        $scope.recargo = 0;
        $scope.iva12 = 0;
        $scope.descuento = 0;
        $scope.total = 0;
        $scope.porcent_servicios = 10;
        $scope.checkin = {};

        Data.post('consultar_clientes_hab_com', hab).then(function (result) {
            if (result.count > 0) {
                $scope.checkin = result.query;
                $scope.ver_clientes_hab = angular.equals({}, $scope.checkin);
            } else {
                Data.toast({"status": 'warning', "message": 'No se encuentran resultados.'});
            }

        });
    };

    $scope.consultar_cli_com = function (id_super_com) {
        $scope.comandas = {};
        $scope.subtotal = 0;
        $scope.subtotal0 = 0;
        $scope.subtotal12 = 0;
        $scope.recargo = 0;
        $scope.iva12 = 0;
        $scope.total = 0;
        $scope.descuento = 0;
        $scope.porcent_servicios = 10;
        $scope.id_super_comanda = {};
        $scope.id_habitacion = {};
        Data.post('get_tarifaIva').then(function (result) {
            $scope.iva = parseFloat(result.iva_calc / 100);
        });
        Data.post('consultar_comandas_super_com', id_super_com).then(function (result) {
            console.log(result);
            $scope.comandas = result.query;
            $scope.id_checkin = result.id_checkin;
            $scope.id_habitacion = result.id_habitacion;
            $scope.id_super_comanda = result.id_super_comanda;
            $scope.id_cliente = result.id_cliente;
            $scope.ver_clientes_hab = true;
            angular.forEach($scope.comandas, function (comanda) {
                $scope.subtotal += parseFloat(comanda.valor);
                $scope.recargo += parseFloat(comanda.servicios);
                if(comanda.porcentaje == 0){
                    $scope.subtotal0 += parseFloat(comanda.valor);
                }else{
                    $scope.subtotal12 += parseFloat(comanda.valor);
                }
            });
            $scope.subtotal_neto = $scope.subtotal + ($scope.recargo - $scope.descuento);
            $scope.iva12 = $scope.subtotal_neto * $scope.iva;
            $scope.total = $scope.subtotal_neto + $scope.iva12;
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };


    $scope.print = function (id_comanda) {
        MyService.data.id_comanda = id_comanda;
        $location.path('/print_comanda');
    };


    $scope.quitcomanda = function (id_comanda, subtotal, subtotal0, subtotal12, servicios, iva12) {
        $scope.comandas = _.without($scope.comandas, _.findWhere($scope.comandas, {id_comanda: id_comanda}));
        Data.post('quitar_comanda', id_comanda).then(function (result) {
            $scope.subtotal -= parseFloat(subtotal);
            $scope.subtotal0 -= parseFloat(subtotal0);
            $scope.subtotal12 -= parseFloat(subtotal12);
            $scope.recargo -= parseFloat(servicios);
            $scope.iva12 -= parseFloat(iva12);
            $scope.total = $scope.subtotal0 - $scope.subtotal12 - $scope.recargo - $scope.iva12;
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };
});

app.controller('printCheckinCtrl', function ($scope, Data, MyService) {
    Data.post('consultar_checkin_print', MyService.data.id_checkin).then(function (result) {
        $scope.id_checkin = result.checkin.id_checkin;
        $scope.identificacion_cliente = result.checkin.identificacion_cliente;
        $scope.cliente = result.checkin.cliente;
        $scope.direccion_cliente = result.checkin.direccion_cliente;
        $scope.pais = result.checkin.pais;
        $scope.ciudad = result.checkin.ciudad;
        $scope.telefonos = result.checkin.telefonos;
        $scope.email = result.checkin.email;
        $scope.pais = result.checkin.pais;
        $scope.fec_nac = result.checkin.fec_nac;
        $scope.nacionalidad = result.checkin.nacionalidad;
        $scope.procedencia = result.checkin.procedencia;
        $scope.destino = result.checkin.destino;
        $scope.nro = result.checkin.nro;
        $scope.fec_in = result.checkin.fec_in;
        $scope.fec_out = result.checkin.fec_out;
        $scope.cliente_factura = result.checkin.cliente_factura;
        $scope.razonsocial = result.checkin.razonsocial;
        $scope.identificacion_cliente_factura = result.checkin.identificacion_cliente_factura;
        $scope.direccion_cliente_factura = result.checkin.direccion_cliente_factura;
        $scope.telefono_cliente_factura = result.checkin.telefono_cliente_factura;
        $scope.nom_con = result.checkin.nom_con;
        $scope.tel_con = result.checkin.tel_con;
        $scope.mail_con = result.checkin.mail_con;
        $scope.observaciones = result.observaciones;
        $scope.id_super_comanda = result.checkin.id_super_comanda;
    });
});

app.controller('printComandaCtrl', function ($scope, Data, MyService, $location) {
    Data.post('consultar_comanda_print', MyService.data.id_comanda).then(function (result) {
        $scope.comandas = result.query;
        $scope.totales = result.totales;
        $scope.datos = result.datos;
    });
    $scope.print_pdf = function (id_comanda) {
        Data.get('consultar_comanda_print_pfd/' + id_comanda).then(function (data) {
            $scope.datos_comanda = data;
        });
    };
});

app.controller('printComandaCtrl_pdf', function ($scope, Data, MyService, $location) {
    Data.post('consultar_comanda_print_pfd', MyService.data.id_comanda).then(function (result) {
        $scope.comandas = result.query;
        $scope.totales = result.totales;
        $scope.datos = result.datos;
    });
    // 06-05-2017 AJPyy

});

app.controller('listCheckinCtrl', function ($scope, Data, MyService, $location) {
    Data.post('select_all_checkin').then(function (result) {
        $scope.checkins = result.query;
    });
    $scope.checkins = [];
    $scope.print = function (id_checkin) {
        MyService.data.id_checkin = id_checkin;
        $location.path('/print_checkin');
    };
    $scope.edit = function (id_checkin) {
        MyService.data.id_checkin = id_checkin;
        $location.path('/edit_checkin');
    };
    $scope.delete = function (id_checkin) {
        $scope.checkins = _.without($scope.checkins, _.findWhere($scope.checkins, {id_checkin: id_checkin}));
        Data.post('delete_checkin', id_checkin).then(function (result) {
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };

    // AJP 11-05-2016
    $scope.data_form = {};// este se usará para llenar los datos del formulario en cada campo del mismo  
    $scope.estados_chekin = {
        datos_llenar: [
            {name: "Activa", value: "1"},
            {name: "Inactiva", value: "0"},
            {name: "Anulada", value: "-1"}
        ],
        dato_seleccionado: {value: "1", name: "Activa"}// Genero el dato que saldra por defecto
    };// genero los obj del selector

    $scope.search_by_filter = function (data_form) {
        Data.post('select_checkin_by_filter', data_form).then(function (result) {
            $scope.checkins = result.query;
        });

    }
});

app.controller('listComandasCtrl', function ($scope, Data, MyService, $location) {
    Data.post('select_all_comandas').then(function (result) {
        $scope.comandas = result.query;
    });
    $scope.comandas = [];
    $scope.data_form = {};// este se usará para llenar los datos del formulario en cada campo del mismo  

    $scope.print = function (id_comanda) {
        MyService.data.id_comanda = id_comanda;
        $location.path('/print_comanda');
    };
    $scope.edit = function (id_comanda) {
        MyService.data.id_comanda = id_comanda;
        $location.path('/edit_comanda');
    };
    $scope.delete = function (id_comanda) {
        $scope.comandas = _.without($scope.comandas, _.findWhere($scope.comandas, {id_comanda: id_comanda}));
        Data.post('delete_comanda', id_comanda).then(function (result) {
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };

    //BUSQUEDA POR FILTROS JLQ 12/05/2016
    $scope.search_by_filter = function (data_form) {
        data_form.ci_cliente = $('#ci_cliente').val();
        Data.post('select_comandas_by_filter', data_form).then(function (result) {
            $scope.comandas = result.query;
        });
    }
});

app.controller('editCheckinCtrl', function ($scope, Data, $filter, $uibModal, MyService, $location) {
    Data.post('consultar_checkin_edit', MyService.data.id_checkin).then(function (result) {
        $scope.cliente = {};
        $scope.registro = {};
        $scope.contacto = {};
        $scope.habitacion = {};
        $scope.cliente_aux = {};

        $scope.title = 'TARJETA DE INGRESO';
        //OBJETO CLIENTE
        $scope.cliente = result.checkin;
        $scope.cliente.cedula = true;
        $scope.cliente.pasaporte = false;
        $scope.cliente.masculino = result.checkin.sexo == 'M' ? true : false;
        $scope.cliente.femenino = result.checkin.sexo == 'F' ? true : false;
        //OBJETO REGISTRO
        $scope.registro.id_checkin = result.checkin.id_checkin;
        $scope.registro.fec_in = result.checkin.fec_in;
        $scope.registro.fec_out = result.checkin.fec_out;
        $scope.registro.fec_actual_reg = $filter('date')(new Date(), 'yyyy-MM-dd');//Almacena la fecha actual del registro
        $scope.registro.fin = false;
        $scope.registro.procedencia = result.checkin.procedencia;
        $scope.registro.destino = result.checkin.destino;
        $scope.registro.habitacion = result.checkin.nro;

        //OBJETO CONTACTO
        $scope.contacto.nombre = result.checkin.nom_con;
        $scope.contacto.telefonos = result.checkin.tel_con;
        $scope.contacto.email = result.checkin.email;

        //OBJETO CLIENTE AUX (cliente factura)
        $scope.cliente_aux.PersonaComercio_cedulaRuc = result.checkin.identificacion_cliente_factura;
        $scope.cliente_aux.nombres = result.checkin.nombres_cliente_factura;
        $scope.cliente_aux.apellidos = result.checkin.apellidos_cliente_factura;
        $scope.cliente_aux.razonsocial = result.checkin.razonsocial_cliente_factura;
        $scope.cliente_aux.telefonos = result.checkin.telefono_cliente_factura;
        $scope.cliente_aux.direccion = result.checkin.direccion_cliente_factura;
        $scope.cliente_aux.email = result.checkin.email_cliente_factura;
        $scope.cliente_aux.fec_nac = result.checkin.fec_nac_cliente_factura;
        $scope.cliente_aux.pais = result.checkin.pais_cliente_factura;
        $scope.cliente_aux.nacionalidad = result.checkin.nacionalidad_cliente_factura;
        $scope.cliente_aux.ciudad = result.checkin.ciudad_cliente_factura;
    });



    $scope.find_cli = function (cli) {
        var cliente = '';
        Data.post('select_cli_x_ced', cli).then(function (result) {
            if (result.count > 0) {
                $scope.cliente = result.query[0];
                if (result.query[0].sexo === 'M') {
                    $scope.cliente.femenino = false;
                    $scope.cliente.masculino = true;
                } else {
                    $scope.cliente.femenino = true;
                    $scope.cliente.masculino = false;
                }
            }
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };
    $scope.duplicar_datos_cli = function (cliente) {
        $scope.cliente_aux = {};

        $scope.cliente_aux.PersonaComercio_cedulaRuc = cliente.PersonaComercio_cedulaRuc;
        $scope.cliente_aux.nombres = cliente.nombres;
        $scope.cliente_aux.apellidos = cliente.apellidos;
        $scope.cliente_aux.telefonos = cliente.telefonos;
        $scope.cliente_aux.razonsocial = cliente.razonsocial;
        $scope.cliente_aux.direccion = cliente.direccion;
        $scope.cliente_aux.email = cliente.email;
        Data.post('select_cli_x_ced', cliente.PersonaComercio_cedulaRuc).then(function (result) {
            if (result.count > 0) {
                $scope.cliente_aux = result.query[0];
            }
            Data.toast({"status": '', "message": 'Datos duplicados correctamente'});
        });

    };

    $scope.find_cli_aux = function (cli) {
        var cliente = '';
        Data.post('select_cli_x_ced', cli).then(function (result) {
            if (result.count > 0) {
                $scope.cliente_aux = result.query[0];
            }
            Data.toast({"status": result.tipo, "message": result.msg});
        });
    };

    $scope.update = function (cliente, registro, cliente_aux, contacto) {
        send = {"cliente": cliente, "registro": registro, "cliente_aux": cliente_aux, "contacto": contacto};
        Data.post('update_checkin', send).then(function (result) {
            if (result.rta === 'OK') {
                MyService.data.id_checkin = result.id_checkin;
                $location.path('/print_checkin');
                Data.toast({"status": result.tipo, "message": result.msg});
            } else {
                Data.toast({"status": result.tipo, "message": result.msg});
            }
        });
    };

    $scope.buscar_hab = function () {
        var cliente = '';
        var modalInstance = $uibModal.open({
            templateUrl: 'index/load_habitaciones',
            controller: 'habitacionesCtrl',
            size: 'lg',
            resolve: {
                item: function () {
                    return cliente;
                }
            }
        });
        modalInstance.result.then(function (selectedObject) {
            $scope.registro.habitacion = selectedObject.nro;
        });
    };
});