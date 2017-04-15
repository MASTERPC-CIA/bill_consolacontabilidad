'use strict';


angular.module('ngCart', ['ngCart.directives'])

        .config([function () {

            }])

        .provider('$ngCart', function () {
            this.$get = function () {
            };
        })

        .run(['$rootScope', 'ngCart', 'ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

                $rootScope.$on('ngCart:change', function () {
                    ngCart.$save();
                });

                if (angular.isObject(store.get('cart'))) {
                    ngCart.$restore(store.get('cart'));

                } else {
                    ngCart.init();
                }

            }])

        .service('ngCart', ['$rootScope', 'ngCartItem', 'store', function ($rootScope, ngCartItem, store) {

                this.init = function () {
                    this.$cart = {
                        shipping: null,
                        taxRate: null,
                        tax: null,
                        items: []
                    };
                };

                this.addItem = function (id, name, price, quantity, data) {
                    var inCart = this.getItemById(id);
                    if (typeof inCart === 'object') {
                        //Update quantity of an item if it's already in the cart
                        inCart.setQuantity(quantity + inCart._quantity, false);
                    } else {
                        var newItem = new ngCartItem(id, name, price, quantity, data);
                        this.$cart.items.push(newItem);
                        $rootScope.$broadcast('ngCart:itemAdded', newItem);
                    }

                    $rootScope.$broadcast('ngCart:change', {});
                };

                this.getItemById = function (itemId) {
                    var items = this.getCart().items;
                    var build = false;

                    angular.forEach(items, function (item) {
                        if (item.getId() === itemId) {
                            build = item;
                        }
                    });
                    return build;
                };

                this.setShipping = function (shipping) {
                    this.$cart.shipping = shipping;
                    return this.getShipping();
                };

                this.getShipping = function () {
                    if (this.getCart().items.length == 0)
                        return 0;
                    return  this.getCart().shipping;
                };

                this.setTaxRate = function (taxRate) {
                    this.$cart.taxRate = +parseFloat(taxRate).toFixed(4);
                    return this.getTaxRate();
                };

                this.getTaxRate = function () {
                    return this.$cart.taxRate
                };

                this.getTax = function () {
                    return +parseFloat(((this.getSubTotal() / 100) * this.getCart().taxRate)).toFixed(4);
                };

                this.setCart = function (cart) {
                    this.$cart = cart;
                    return this.getCart();
                };

                this.getCart = function () {
                    return this.$cart;
                };

                this.getItems = function () {
                    return this.getCart().items;
                };

                this.getTotalItems = function () {
                    var count = 0;
                    var items = this.getItems();
                    angular.forEach(items, function (item) {
                        count += item.getQuantity();
                    });
                    return count;
                };

                this.getTotalUniqueItems = function () {
                    return this.getCart().items.length;
                };

                this.getSubTotalCero = function () {
                    var total = 0;
                    angular.forEach(this.getCart().items, function (item) {
                        total += item.getTotalCero();
                    });
                    return +parseFloat(total).toFixed(4);
                };

                this.getSubTotalDoce = function () {
                    var total = 0;
                    angular.forEach(this.getCart().items, function (item) {
                        total += item.getTotalDoce();
                    });
                    return +parseFloat(total).toFixed(4);
                };

                this.getSubTotal = function () {
                    var total = 0;
                    angular.forEach(this.getCart().items, function (item) {
                        total += item.getTotal();
                    });
                    return +parseFloat(total).toFixed(4);
                };

                this.getSubTotalIVA = function () {
                    var total = 0;
                    angular.forEach(this.getCart().items, function (item) {
                        total += item.getTotalDoce() * (item.get_iva_calc() / 100);
                    });
                    return +parseFloat(total).toFixed(4);
                };

                this.getBienes = function () {
                    var total = 0;
                    angular.forEach(this.getCart().items, function (item) {
                        total += item.getBienes();
                    });
                    return +parseFloat(total).toFixed(4);
                };

                this.getServicios = function () {
                    var total = 0;
                    angular.forEach(this.getCart().items, function (item) {
                        total += item.getServicios();
                    });
                    return +parseFloat(total).toFixed(4);
                };

                this.totalCero = function () {
                    //console.log(this.getSubTotalCero());
                    return +parseFloat(this.getSubTotalCero()).toFixed(4);
                };

                this.totalDoce = function () {
                    //console.log(this.getSubTotalDoce());
                    return +parseFloat(this.getSubTotalDoce()).toFixed(4);
                };

                this.Subtotal = function () {
                    //console.log(this.getSubTotalDoce());
                    return +parseFloat(this.getSubTotalCero() + this.getSubTotalDoce()).toFixed(4);
                };

                this.Recargo = function () {
                    return +parseFloat(0).toFixed(4);
                };

                this.Descuento = function () {
                    return +parseFloat(0).toFixed(4);
                };

                this.SubtotalNeto = function () {
                    return +parseFloat(this.getSubTotalCero() + this.getSubTotalDoce()).toFixed(4);
                };

                this.ICE = function () {
                    return +parseFloat(0).toFixed(4);
                };

                this.IVA = function () {
                    return +parseFloat(this.getSubTotalIVA()).toFixed(4);
                };

                this.Total = function () {
                    return +parseFloat(this.getSubTotalCero() + this.getSubTotalDoce() + this.getSubTotalIVA()).toFixed(4);
                };

                this.totalBienes = function () {
                    return +parseFloat(this.getBienes()).toFixed(4);
                };

                this.totalServicios = function () {
                    return +parseFloat(this.getServicios()).toFixed(4);
                };

                this.removeItem = function (index) {
                    this.$cart.items.splice(index, 1);
                    $rootScope.$broadcast('ngCart:itemRemoved', {});
                    $rootScope.$broadcast('ngCart:change', {});

                };

                this.removeItemById = function (id) {
                    var cart = this.getCart();
                    angular.forEach(cart.items, function (item, index) {
                        if (item.getId() === id) {
                            cart.items.splice(index, 1);
                        }
                    });
                    this.setCart(cart);
                    $rootScope.$broadcast('ngCart:itemRemoved', {});
                    $rootScope.$broadcast('ngCart:change', {});
                };

                this.empty = function () {

                    $rootScope.$broadcast('ngCart:change', {});
                    this.$cart.items = [];
                    localStorage.removeItem('cart');
                };

                this.isEmpty = function () {

                    return (this.$cart.items.length > 0 ? false : true);

                };

                this.toObject = function () {

                    if (this.getItems().length === 0)
                        return false;

                    var items = [];
                    angular.forEach(this.getItems(), function (item) {
                        items.push(item.toObject());
                    });

                    return {
                        shipping: this.getShipping(),
                        tax: this.getTax(),
                        taxRate: this.getTaxRate(),
                        subTotal: this.getSubTotal(),
                        totalCost: this.totalCost(),
                        items: items
                    }
                };


                this.$restore = function (storedCart) {
                    var _self = this;
                    _self.init();
                    _self.$cart.shipping = storedCart.shipping;
                    _self.$cart.tax = storedCart.tax;

                    angular.forEach(storedCart.items, function (item) {
                        _self.$cart.items.push(new ngCartItem(item._id, item._name, item._price, item._quantity, item._data));
                    });
                    this.$save();
                };

                this.$save = function () {
                    return store.set('cart', JSON.stringify(this.getCart()));
                }

            }])

        .factory('ngCartItem', ['$rootScope', '$log', function ($rootScope, $log) {

                var item = function (id, name, price, quantity, data) {
                    this.setId(id);
                    this.setName(name);
                    this.setPrice(price);
                    this.setQuantity(quantity);
                    this.setData(data);
                };


                item.prototype.setId = function (id) {
                    if (id)
                        this._id = id;
                    else {
                        $log.error('An ID must be provided');
                    }
                };

                item.prototype.getId = function () {
                    return this._id;
                };


                item.prototype.setName = function (name) {
                    if (name)
                        this._name = name;
                    else {
                        $log.error('A name must be provided');
                    }
                };
                item.prototype.getName = function () {
                    return this._name;
                };

                item.prototype.setPrice = function (price) {
                    /*console.log(price);
                     var priceFloat = parseFloat(price).toFixed(4);
                     console.log(priceFloat);
                     if (priceFloat) {
                     if (priceFloat <= 0) {
                     $log.error('A price must be over 0');
                     } else {
                     this._price = (priceFloat);
                     }
                     } else {
                     $log.error('A price must be provided');
                     }*/
                    /*console.log(price);
                     var priceFloat = parseFloat(price).toFixed(4);
                     console.log(priceFloat);*/
                    /*console.log(price);*/
                    if (price) {
                        if (price <= 0) {
                            $log.error('A price must be over 0');
                        } else {
                            this._price = (price);
                        }
                    } else {
                        $log.error('A price must be provided');
                    }
                };
                item.prototype.getPrice = function () {
                    return this._price;
                };

                item.prototype.setQuantity = function (quantity, relative) {
                    var quantityInt = parseInt(quantity);
                    if (quantityInt % 1 === 0) {
                        if (relative === true) {
                            if ((this._quantity + 1) <= this._data.stockactual) {
                                this._quantity += quantityInt;
                            }
                        } else {
                            this._quantity = quantityInt;
                        }
                        if (this._quantity < 1)
                            this._quantity = 1;

                    } else {
                        this._quantity = 1;
                        $log.info('Quantity must be an integer and was defaulted to 1');
                    }
                    $rootScope.$broadcast('ngCart:change', {});
                };

                item.prototype.getQuantity = function () {
                    return this._quantity;
                };

                item.prototype.setData = function (data) {
                    if (data)
                        this._data = data;
                };

                item.prototype.getData = function () {
                    if (this._data)
                        return this._data;
                    else
                        $log.info('This item has no data');
                };


                item.prototype.getTotalCero = function () {
                    var rta = 0;
                    if (parseInt(this._data.porcentaje) === 0) {
                        rta = +parseFloat(this.getQuantity() * this.getPrice()).toFixed(4);
                    }
                    return rta;
                };

                item.prototype.getTotalDoce = function () {
                    var rta = 0;
                    if (parseInt(this._data.porcentaje) === 14) {
                        rta = +parseFloat(this.getQuantity() * this.getPrice()).toFixed(4);
                    }
                    return rta;
                };

                item.prototype.get_iva_calc = function () {
                    var rta = 0;
                    /*console.log(this._data.iva_calc);*/
                    rta = this._data.iva_calc;
                    return 14;
                };

                item.prototype.getSubTotal = function () {
                    var rta = 0;
                    rta = +parseFloat(this.getTotalCero() + this.getTotalDoce()).toFixed(4);
                    return rta;
                };

                item.prototype.getTotal = function () {
                    return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(4);
                };

                item.prototype.getBienes = function () {
                    var rta = 0;
                    if (parseInt(this._data.esServicio) === 0) {
                        rta = +parseFloat(this.getQuantity() * this.getPrice()).toFixed(4);
                    }
                    return rta;
                };

                item.prototype.getServicios = function () {
                    var rta = 0;
                    if (parseInt(this._data.esServicio) === 1) {
                        rta = +parseFloat(this.getQuantity() * this.getPrice()).toFixed(4);
                    }
                    return rta;
                };

                item.prototype.toObject = function () {
                    return {
                        id: this.getId(),
                        name: this.getName(),
                        price: this.getPrice(),
                        quantity: this.getQuantity(),
                        data: this.getData(),
                        total: this.getTotal()
                    }
                };

                return item;

            }])

        .service('store', ['$window', function ($window) {

                return {
                    get: function (key) {
                        if ($window.localStorage [key]) {
                            var cart = angular.fromJson($window.localStorage [key]);
                            return JSON.parse(cart);
                        }
                        return false;

                    },
                    set: function (key, val) {

                        if (val === undefined) {
                            $window.localStorage.removeItem(key);
                        } else {
                            $window.localStorage [key] = angular.toJson(val);
                        }
                        return $window.localStorage [key];
                    }
                }
            }])

        .controller('CartController', ['$scope', 'ngCart', function ($scope, ngCart) {
                $scope.ngCart = ngCart;

            }])

        .value('version', '1.0.0');
;
'use strict';


angular.module('ngCart.directives', ['ngCart.fulfilment'])

        .controller('CartController', ['$scope', 'ngCart', function ($scope, ngCart) {
                $scope.ngCart = ngCart;
            }])

        .directive('ngcartAddtocart', ['ngCart', function (ngCart) {
                return {
                    restrict: 'E',
                    controller: 'CartController',
                    scope: {
                        id: '@',
                        name: '@',
                        quantity: '@',
                        quantityMax: '@',
                        price: '@',
                        data: '='
                    },
                    transclude: true,
                    templateUrl: function (element, attrs) {
                        if (typeof attrs.templateUrl == 'undefined') {
                            return 'template/ngCart/addtocart.html';
                        } else {
                            return attrs.templateUrl;
                        }
                    },
                    link: function (scope, element, attrs) {
                        scope.attrs = attrs;
                        scope.inCart = function () {
                            return  ngCart.getItemById(attrs.id);
                        };

                        if (scope.inCart()) {
                            scope.q = ngCart.getItemById(attrs.id).getQuantity();
                        } else {
                            scope.q = parseInt(scope.quantity);
                        }

                        scope.qtyOpt = [];
                        for (var i = 1; i <= scope.quantityMax; i++) {
                            scope.qtyOpt.push(i);
                        }

                    }

                };
            }])

        .directive('ngcartCart', [function () {
                return {
                    restrict: 'E',
                    controller: 'CartController',
                    scope: {},
                    templateUrl: function (element, attrs) {
                        if (typeof attrs.templateUrl == 'undefined') {
                            return 'template/ngCart/cart.html';
                        } else {
                            return attrs.templateUrl;
                        }
                    },
                    link: function (scope, element, attrs) {

                    }
                };
            }])

        .directive('ngcartSummary', [function () {
                return {
                    restrict: 'E',
                    controller: 'CartController',
                    scope: {},
                    transclude: true,
                    templateUrl: function (element, attrs) {
                        if (typeof attrs.templateUrl == 'undefined') {
                            return 'template/ngCart/summary.html';
                        } else {
                            return attrs.templateUrl;
                        }
                    }
                };
            }])

        .directive('ngcartCheckout', [function () {
                return {
                    restrict: 'E',
                    controller: ('CartController', ['$rootScope', '$scope', 'ngCart', 'fulfilmentProvider', function ($rootScope, $scope, ngCart, fulfilmentProvider) {
                            $scope.ngCart = ngCart;

                            $scope.checkout = function () {
                                fulfilmentProvider.setService($scope.service);
                                fulfilmentProvider.setSettings($scope.settings);
                                fulfilmentProvider.checkout()
                                        .success(function (data, status, headers, config) {
                                            $rootScope.$broadcast('ngCart:checkout_succeeded', data);
                                        })
                                        .error(function (data, status, headers, config) {
                                            $rootScope.$broadcast('ngCart:checkout_failed', {
                                                statusCode: status,
                                                error: data
                                            });
                                        });
                            }
                        }]),
                    scope: {
                        service: '@',
                        settings: '='
                    },
                    transclude: true,
                    templateUrl: function (element, attrs) {
                        if (typeof attrs.templateUrl == 'undefined') {
                            return 'template/ngCart/checkout.html';
                        } else {
                            return attrs.templateUrl;
                        }
                    }
                };
            }]);
;
angular.module('ngCart.fulfilment', [])
        .service('fulfilmentProvider', ['$injector', function ($injector) {

                this._obj = {
                    service: undefined,
                    settings: undefined
                };

                this.setService = function (service) {
                    this._obj.service = service;
                };

                this.setSettings = function (settings) {
                    this._obj.settings = settings;
                };

                this.checkout = function () {
                    var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
                    return provider.checkout(this._obj.settings);

                }

            }])


        .service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart', function ($q, $log, ngCart) {

                this.checkout = function () {

                    var deferred = $q.defer();

                    $log.info(ngCart.toObject());
                    deferred.resolve({
                        cart: ngCart.toObject()
                    });

                    return deferred.promise;

                }

            }])

        .service('ngCart.fulfilment.http', ['$http', 'ngCart', function ($http, ngCart) {

                this.checkout = function (settings) {
                    return $http.post(settings.url,
                            {data: ngCart.toObject(), options: settings.options});
                }
            }])


        .service('ngCart.fulfilment.paypal', ['$http', 'ngCart', function ($http, ngCart) {


            }]);
