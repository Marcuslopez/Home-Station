//Usado en proyecto Crecer
(r,v,cb)=>{
    //Validar cedula
    function isValid(str) {
  
        if(str == null || str == ''){
            if(EsMenorDeEdad())
            return true;
        }
  
    var regex = new RegExp("^[0-9]{3}-?[0-9]{7}-?[0-9]{1}$");
    if (!regex.test(str)) {
        console.log('FALSE');
    return false;
    }
    str = str.replace(/-/g, '');
    return CheckDigit(str);
    }
    
    //Validar formato
    function CheckDigit(str) {
    var sum = 0;
    for (var i = 0; i < 10; ++i) {
    var n = ((i + 1) % 2 != 0 ? 1 : 2) * parseInt(str.charAt(i));
    sum += (n <= 9 ? n : n % 10 + 1);
    }
    var dig = ((10 - sum % 10) % 10);
    return dig == parseInt(str.charAt(10));
    }
  
    //Si asegurado es menor de edad campo cedula
    //no es requerido
    function EsMenorDeEdad(){
        var spanEdad = $('span[class="ant-tag"]').eq(0);
        
        if(spanEdad.length > 0){
        var sEdad = spanEdad.text();
        
        var edad = parseInt(sEdad.slice(0,sEdad.length - 1));
        console.log('Edad del asegurado: '+ edad);
  
        if(edad < 18){
            $("#cnp").parents(".ant-form-item-control").removeClass("has-error");
            $("#cnp").attr("placeHolder","");
            return true;
        }
        else
        return false
  
    }
    }
    
    const resultado=isValid(v);
    console.log('EVALUAR');
    return resultado?cb():cb("Cedula invalida. Ejemplo: 00116454281")
    }