//Usado en proyecto Crecer
(r,v,cb)=>{
    function isValid(str) {
    if (str=='PR') {
    return true;
    }
    }
    const resultado=isValid(v);
    return resultado?cb():cb("No es Puerto Rico")
    }