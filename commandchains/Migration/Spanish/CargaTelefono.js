//block
try{
    let format = /[{}[]]/;
    var insertSqlStmt = "INSERT INTO CONTACTPHONE(contactId,num,type)";
    var valueSqlStmt = "VALUES([contactId],[num],[type])";
    var updateSqlStmt = "UPDATE CONTACT SET phone=[phone] WHERE migrationCode='[migrationCode]'";
    let MSG01 = "INCONSISTENCIA DE DATO: ";
    let MSG02 = "ERROR DE LOGICA: ";
    let MSG03 = "ERROR DE SQL: ";
    var isUpdate = false;

    function validatePhone(phone) {
        var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    
        if (regex.test(phone)) {
            return true;
        }else{
            return false;
        }
    }

    var getSelectSqlStmt = [];
    
    if(_row.migrationCode != null){
        getSelectSqlStmt = JSON.parse(doCmd({cmd:"DoQuery",data:{sql:"SELECT id,phone FROM CONTACT WHERE migrationCode = '"+_row.migrationCode+"'"}}).outData.toString());        
        if(getSelectSqlStmt.length ==0){
            throw MSG01 +"No existe un contacto con el ID original provisto";
        }
    
        switch(_row.migrationCode){
            case "":
                throw MSG01+"El ID original del contacto no puede estar vacio";
            default:                
                valueSqlStmt = valueSqlStmt.replace("[contactId]",getSelectSqlStmt[0].id);
        }
    }else{
        throw MSG01+"El ID original del contacto no puede ser nulo";
    }

    if(_row.phoneNumber !=null){
        switch(_row.phoneNumber){
            case "":
                throw MSG01+"El registro tiene el campo de telefono vacio";
        }

        if(_row.phoneNumber.length <=10){
            if(getSelectSqlStmt[0].phone == null || getSelectSqlStmt.phone ==""){
                updateSqlStmt = updateSqlStmt.replace("[phone]",_row.phoneNumber);
                updateSqlStmt = updateSqlStmt.replace("[migrationCode]","'"+_row.migrationCode+"'");
                isUpdate=true;
            }else{
                const countAdditionalPhones = JSON.parse(doCmd({cmd:"DoQuery",data:{sql:"SELECT num FROM CONTACTPHONE WHERE contactId="+getSelectSqlStmt[0].id}}).outData.toString());
                if(countAdditionalPhones.length>0){
                    if(countAdditionalPhones[0].num == _row.phoneNumber){
                        throw MSG01+"El numero de telefono ya existe para el contacto";
                    }
                }

                switch(countAdditionalPhones.length){
                    case 0:
                        valueSqlStmt = valueSqlStmt.replace("[type","PHONETYPE1");
                        break;
                    case 1:
                        valueSqlStmt = valueSqlStmt.replace("[type","PHONETYPE2");
                        break;
                    case 2:
                        valueSqlStmt = valueSqlStmt.replace("[type","PHONETYPE3");
                        break;
                    default:
                        valueSqlStmt = valueSqlStmt.replace("[type","PHONETYPE4");
                }
                valueSqlStmt = valueSqlStmt.replace("[contactId]",getSelectSqlStmt[0].id);
                valueSqlStmt = valueSqlStmt.replace("[num]",_row.phoneNumber);
            }
            
        }else{
            throw MSG01+"El telefono no es valido segun formato de maximo 10 digitos";
        }
    }else{
        throw MSG01+"El registro no contiene un numero de telefono correcto";
    }

    if(isUpdate){
        doCmd({cmd:"DoQuery",data:{sql:updateSqlStmt}});
    }else{
        var runSqlStmt = insertSqlStmt + " " + valueSqlStmt;
        if(runSqlStmt.search(",,") > -1){
            throw MSG03+"Existe un valor vacio que no permite registrar los datos, favor revise el siguiente query: "+runSqlStmt;
        }
        if(format.test(valueSqlStmt)){
            throw MSG03+"Existe caracter invalido que no permite registrar los datos, favor revise el siguiente query: "+runSqlStmt;
        }
        doCmd({cmd:"DoQuery",data:{sql:runSqlStmt}});

    }

    
}
catch(err){
    throw err;
}