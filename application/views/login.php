<div class="main">
    <div class="container">
        <center>
        <div class="middle">
            <div id="login">
                <form name='cliente_form' class='form-horizontal' role='form'>
                    <fieldset class="clearfix">
                        <p ><span class="fa fa-user"></span><input type="text" ng-model="usuario.nombre" Placeholder="Usuario" ng-required="true"></p>
                        <p><span class="fa fa-lock"></span><input type="password" ng-model="usuario.clave" Placeholder="Clave" ng-required="true"></p>
                        <div>
                            <span style="width:48%; text-align:left;  display: inline-block;"><a class="small-text" href="#"></a></span>
                            <span style="width:50%; text-align:right;  display: inline-block;">
                                <input type="submit" ng-click="verificar(usuario);" value="INGRESAR" ng-disabled='cliente_form.$invalid'>
                            </span>
                        </div>
                    </fieldset>
                    <div class="clearfix"></div>
                </form>
                <div class="clearfix"></div>
            </div>
            <div class="logo">PUNTOPYMES
                <div class="clearfix"></div>
            </div>
            </div>
        </center>
    </div>
</div>