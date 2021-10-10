// TODO - $(document).ready function
$(document).ready( function() {
    /* https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString */
    // El inglés británico hace uso del orden día-mes-año
    date= new Date().toLocaleDateString("en-GB", {timeZone: "America/Bogota"});
    //console.log('Time mm/dd/yyyy:', date);

    /* https://stackoverflow.com/questions/35856104/convert-mm-dd-yyyy-to-yyyy-mm-dd */
    fecha_hoy = date.split("/").reverse().join("-");
    //console.log('Time yyyy-mm-dd:', fecha_hoy);

    document.getElementById("txtFecha").value = fecha_hoy;

    cargarRangoFechas();

    //document.getElementById("cuotaPromedio").innerHTML = '0.00';
    document.getElementById("totalPagado").innerHTML = '0.00';
    document.getElementById("interesesPagados").innerHTML = '0.00';

    let llenar_tabla = '';
    llenar_tabla +=`
    <tr>
        <th scope="row">0</th>
        <td>00/00/0000</td>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
    </tr>
    `;

    document.getElementById("tabla_cuotas").innerHTML=llenar_tabla;

});

// TODO - function cargarRangoFechas
function cargarRangoFechas(){

    // primera fecha del array
    let firstItemArray = db_periodos[0].periodo;

    // ultima fecha del array
    let lastItemArray = db_periodos[db_periodos.length-1].periodo;
    
    //console.log(firstItemArray, ' ', lastItemArray);

    /* https://stackoverflow.com/questions/13571700/get-first-and-last-date-of-current-month-with-javascript-or-jquery */
    let date = new Date(firstItemArray);

    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let primerDiaMes = firstDay.toISOString().slice(0, 10);

    //var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    //let ultimoDiaMes = lastDay.toISOString().slice(0, 10);

    /* https://stackoverflow.com/questions/32378590/set-date-input-fields-max-date-to-today */
    document.getElementById("txtFecha").setAttribute("min", primerDiaMes);
    document.getElementById("txtFecha").setAttribute("max", lastItemArray);

}

// TODO - function validarFecha
function validarFecha(){

    let fecha = document.getElementById("txtFecha").value;
    //console.log('validarFecha ',fecha.slice(0, 10));

    // primera fecha del array
    let firstItemArray = db_periodos[0].periodo;
    
    // ultima fecha del array
    let lastItemArray = db_periodos[db_periodos.length-1].periodo;
    
    //console.log(firstItem, ' ', lastItem);

    /* https://stackoverflow.com/questions/13571700/get-first-and-last-date-of-current-month-with-javascript-or-jquery */
    let date = new Date(firstItemArray);
    
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let primerDiaMes = firstDay.toISOString().slice(0, 10);
    
    //var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    //let ultimoDiaMes = lastDay.toISOString().slice(0, 10);

    // Si la fecha ingresada por el usuario es menor a la fecha minima permitida, se retorna la primer fecha permitida
    if(fecha < primerDiaMes){
        document.getElementById("txtFecha").value = primerDiaMes;
        return primerDiaMes;
    // Si la fecha ingresada por el usuario está dentro del rango permitido, se retorna la fecha tal cual
    }else if(fecha >= primerDiaMes && fecha <= lastItemArray ){
        document.getElementById("txtFecha").value = fecha;
        return fecha;
    // Si la fecha ingresada por el usuario es mayor a la fecha máxima permitida, se retorna la ultima fecha permitida
    }else{
        document.getElementById("txtFecha").value = lastItemArray;
        return lastItemArray;
    }

}

function validarCompra(){
    let compra = parseFloat( document.getElementById("txtCompra").value );
    // Validación imput txtTasaIntCte para no permitir valores menores a 1
    if(!isNaN(compra) && compra < 1){
        document.getElementById("txtCompra").value = 1;
        return compra = 1.00;
    }else{
        document.getElementById("txtCompra").value = compra;
        return compra;
    }
}

function validarTasaIntCte(){
    let interes_mensual = parseFloat( document.getElementById("txtTasaIntCte").value );
    // Validación imput txtTasaIntCte para no permitir valores menores a 1
    if (!isNaN(interes_mensual) && interes_mensual < 1) {
        document.getElementById("txtTasaIntCte").value = '1.00';
        return interes_mensual = '1.00';
    }else if(!isNaN(interes_mensual)){
        document.getElementById("txtTasaIntCte").value = interes_mensual;
        return interes_mensual;
    }
}

function validarCuotas(){
    let cuotas = parseInt( document.getElementById("txtCuotas").value );

    // Validación imput txtCuotas para no permitir valores menores a 1
    if(cuotas < 1){
        document.getElementById("txtCuotas").value = 1;
        return cuotas = 1;
    //Si el número de cuotas ingresada por el usuario está dentro del rango permitido, se retorna el valor de las cuotas tal cual
    }else if(cuotas >= 1 && cuotas <= 36 ){
        document.getElementById("txtCuotas").value = cuotas;
        return cuotas;
    // Si el número de cuotas ingresada por el usuario es mayor a la cuota máxima permitida, se retorna la máxima cuota permitida
    }
    else if(!isNaN(cuotas) && cuotas){
        document.getElementById("txtCuotas").value = 36;
        return cuotas = 36;
    //Si ocurre algún error inesperado
    }
}







// TODO - PRINCIPAL function calculadora_rappicard
function calculadora_rappicard(){
    let fecha = validarFecha();

    compra = validarCompra();
    let interes_mensual = validarTasaIntCte();
    let cuotas = validarCuotas();

    if( !isNaN(compra) && !isNaN(interes_mensual) && !isNaN(cuotas) ){

        let llenar_tabla = "";
        let intereses_pagados = 0.0;
        let suma_total_cuotas = 0.0;

        /* TODO --- Inicio - primera cuota --------------- */

        // CAPITAL
        //cuota_a_devolver = 83333.33;
        cuota_a_devolver = (compra/cuotas);

        // SALDO FINAL
        //deuda_total = 416666.67;
        //deuda_total_fix = 416666.67;
        deuda_total = compra - cuota_a_devolver;

        if(deuda_total < 0){
            deuda_total_fix = 0.00;
        }else{
            deuda_total_fix = deuda_total;
        }

        //intereses = 643.33;
        let intereses = compra*(interes_mensual/100);

        let contpos = 0;
        for (let el of db_periodos) {
            //console.log(el);
            //var fecha_cobro_mes_1 = el;

            // Se extrae el mes y año de la fecha ingresada por el usuario
            let mesAnioFecha = fecha.slice(0, 7);
            //console.log('mes_fecha ',mesAnioFecha);

            let mesAnioPeriodo = el.periodo.slice(0, 7);
            //console.log('mes_periodo ',mesAnioPeriodo);
            
            if ( mesAnioFecha === mesAnioPeriodo ) {
                
                // Si la fecha elegida por el usuario es mayor a la fecha de cobro actual, se mueve al siguiente periodo de facturación
                if(fecha > el.periodo){ 

                    //console.log('true');
                    contpos = contpos + 1;

                    //console.log(db_periodos[contpos].periodo);
                    var fecha_cobro_mes_1 = db_periodos[contpos].periodo; // Se mueve al siguiente periodo de facturación y se retorna el dato en fecha_cobro_mes_1
                    
                    //9650/30 = 321.66
                    interes_diario_mes_1 = intereses / el.dias_calendario_periodo_fecha_cobro;
                    //console.log(interes_diario_mes_1);

                    break;
                }else{ // Se conserva la fecha de facturación actual
                    //console.log('false');
                    var fecha_cobro_mes_1 = el.periodo;

                    //9650/30 = 321.66
                    interes_diario_mes_1 = intereses / el.dias_calendario_periodo_fecha_cobro;
                    //console.log(interes_diario_mes_1);

                    break;
                }

            }
            //console.log(contpos);
            contpos = contpos + 1;
        }

        //console.log('fecha cobro mes 1 ',fecha_cobro_mes_1);
        //console.log('interes diario mes 1 ',interes_diario_mes_1);
        //console.log('cuota 1 posicion registro ',contpos);

        let diff = diffFechas(fecha,fecha_cobro_mes_1);
        //console.log(diff);

        //fecha = '2021-10-05';

        // 321.66 * 2 = 643.33  (2 dias antes del corte de la tarjeta)
        //dias_antes_del_corte = 2;
        let dias_antes_del_corte = diff; //diferencia de dias antes del corte

        // TODO - cuotas 1 | interes 0.00
        // Si el crédito es a una cuota, no genera intereses
        if(cuotas === 1){
            prorateo_interes_mes_1 = 0.00;
        }else{
            prorateo_interes_mes_1 = interes_diario_mes_1 * dias_antes_del_corte;
        }


        // CUOTA
        cuota = cuota_a_devolver + prorateo_interes_mes_1;
        console.log(cuota);



        /* https://bytes.com/topic/javascript/answers/821709-convert-format-date-yyyy-mm-dd-dd-mm-yyyy */
        // Convert format date from "YYYY-mm-dd" to "dd/mm/YYYY"
        let p = fecha_cobro_mes_1.split(/\D/g);
        fecha_cobro_mes_1 = [ p[2], p[1], p[0] ].join("/");

        /* https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat */
        // Formato con separador de miles y decimales
        let compra_tabla = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2}).format(compra);
        let cuota_a_devolver_tabla = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2}).format(cuota_a_devolver);
        let prorateo_interes_mes_1_tabla = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2}).format(prorateo_interes_mes_1);
        let cuota_tabla = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2}).format(cuota);
        let deuda_total_fix_tabla = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2}).format(deuda_total_fix);

        llenar_tabla +=`

        <tr>
            <th scope="row">1</th>
            <td>`+fecha_cobro_mes_1+`</td>
            <td>`+compra_tabla+`</td>
            <td>`+cuota_a_devolver_tabla+`</td>
            <td>`+prorateo_interes_mes_1_tabla+`</td>
            <td>`+cuota_tabla+`</td>
            <td>`+deuda_total_fix_tabla+`</td>
        </tr>

        `;

        //contpos_aux = contpos;
        deuda_total_aux = deuda_total;

        /* TODO --- Fin - primera cuota ----------------- */

        /* TODO --- Inicio - calculos cuota 2 hascia adelante y preparación llenado de tabla ----------------- */

        //console.log('contpos_aux antes del for: ', contpos_aux);
        //console.log('tamaño del array: ', db_periodos.length);
        //console.log('ultima posicion del array: ', db_periodos.length-1);
        //console.log('ultimo registro array: ', db_periodos[10]);


        /*
        Hay que validar el tamaño del array de database.js, para saber cuantas cuotas máximo
        puedo elegir, para no salirme de los periodos disponibles en database.js, 
        según la fecha escogida en el calendario de la interfaz
        */

        let tamano_array = db_periodos.length;
        let posiciones_disponibles_array = contpos;

        let me_puedo_mover = tamano_array - posiciones_disponibles_array;
        //console.log('me puedo mover por el array: ', me_puedo_mover);

        if (cuotas > me_puedo_mover) {
            document.getElementById("txtCuotas").value = me_puedo_mover;
            cuotas = me_puedo_mover;
        }

        for (let i = 1; i < (cuotas); i++) {

            //console.log(db_periodos);

            contpos = contpos + 1;
            console.log('cuota ',(i+1),' posicion registro ', contpos, 'periodo ', db_periodos[contpos].periodo);

            //console.log(deuda_total);

            let cuota_a_devolver = (compra/cuotas);

            let interes_neto = deuda_total_aux*(interes_mensual/100);

            let month = new Date(db_periodos[contpos].periodo).getMonth() + 1;
            //let month = db_periodos[contpos].periodo.slice(5, 7);
            //console.log(month);
            let year = new Date(db_periodos[contpos].periodo).getFullYear();
            //let year = db_periodos[contpos].periodo.slice(0, 7);
            //console.log(year);
            
            // https://stackoverflow.com/questions/38672087/get-no-of-days-in-current-month-in-javascript
            let days_in_month = new Date(year, month, 0).getDate(); // 0 + number of days
            //console.log(db_periodos[contpos_aux].periodo, ' ', days_in_month);

            //interes_diario = interes_neto / days_in_month; // dias del mes
            let interes_diario = interes_neto / days_in_month; // dias del mes
            //console.log(interes_diario);

            //intereses
            let intereses = interes_diario * db_periodos[contpos].dias_calendario_periodo_fecha_cobro; // dias de diferencia con el mes anterior - diff

            //cuota = (compra/cuotas)+intereses;
            let cuota = cuota_a_devolver + intereses;
            
            //deuda_total = deuda_total_aux-(cuota_a_devolver-intereses);
            // SALDO FINAL
            //deuda_total = 416666.67;
            //deuda_total_fix = 416666.67;
            let deuda_total = deuda_total_aux - cuota_a_devolver;
            //console.log('deuda total ',deuda_total);
            //deuda_total_aux = deuda_total;

            // TODO Deuda_total periodo anterior
            if(deuda_total < 0){
                deuda_total_fix = 0.00;
            }else{
                deuda_total_fix = deuda_total;
            }
            //console.log('deuda total fix ',deuda_total_fix);

            /* https://bytes.com/topic/javascript/answers/821709-convert-format-date-yyyy-mm-dd-dd-mm-yyyy */
            // Convert format date from "YYYY-mm-dd" to "dd/mm/YYYY"
            let p = db_periodos[contpos].periodo.split(/\D/g);
            let fecha_cobro_mes = [ p[2], p[1], p[0] ].join("/");

            //let deuda_total_tabla = new Intl.NumberFormat("de-DE", {style: "currency", currency: "COP", maximumFractionDigits: 2}).format(deuda_total);
            
            /* https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat */
            // Formato con separador de miles y decimales
            
            let deuda_total_aux_tabla = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2}).format(deuda_total_aux);
            let cuota_a_devolver_tabla = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2}).format(cuota_a_devolver);
            let intereses_tabla = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2}).format(intereses);
            let cuota_tabla = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2}).format(cuota);
            let deuda_total_fix_tabla = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2}).format(deuda_total_fix);

            llenar_tabla +=`

            <tr>
                <th scope="row">`+(i+1)+`</th>
                <td>`+fecha_cobro_mes+`</td>
                <td>`+deuda_total_aux_tabla+`</td>
                <td>`+cuota_a_devolver_tabla+`</td>
                <td>`+intereses_tabla+`</td>
                <td>`+cuota_tabla+`</td>
                <td>`+deuda_total_fix_tabla+`</td>
            </tr>

            `;

            deuda_total_aux = deuda_total;

            intereses_pagados = intereses_pagados + intereses;
            suma_total_cuotas = suma_total_cuotas + cuota;

        }

        //cuota_promedio = suma_total_cuotas/cuotas;
        total_pagado = compra + intereses_pagados + prorateo_interes_mes_1;
        intereses_pagados_totales = intereses_pagados + prorateo_interes_mes_1;

        /*if(isNaN(cuota_promedio)){
            cuota_promedio = 0;
        }*/

        /* TODO --- Fin - calculos cuota 2 hacia adelante y preparación llenado de tabla ----------------- */

        //let cuota_promedio = new Intl.NumberFormat("de-DE", {style: "currency", currency: "COP", maximumFractionDigits: 2}).format(cuota_promedio);
        let total_pagado_frontend = new Intl.NumberFormat("de-DE", {style: "currency", currency: "COP", maximumFractionDigits: 2}).format(total_pagado);
        let intereses_pagados_totales_frontend = new Intl.NumberFormat("de-DE", {style: "currency", currency: "COP", maximumFractionDigits: 2}).format(intereses_pagados_totales);

        //intereses_pagados = total_pagado-compra;

        //document.getElementById("cuotaPromedio").innerHTML=cuota_promedio;
        document.getElementById("totalPagado").innerHTML=total_pagado_frontend;
        document.getElementById("interesesPagados").innerHTML=intereses_pagados_totales_frontend;

        document.getElementById("tabla_cuotas").innerHTML=llenar_tabla;

    }else{
        //document.getElementById("cuotaPromedio").innerHTML="0.0";
        document.getElementById("totalPagado").innerHTML="0.0";
        document.getElementById("interesesPagados").innerHTML="0.0";
    }
}

// TODO - function diffFechas
function diffFechas(fechaInicio, fechaFin){

    let dt1 = new Date(fechaInicio);
    let dt2 = new Date(fechaFin);
    
    let result = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));

    //console.log(result);
    return result;

}

