//block
try{
    let format = /[{}[]]/;
    var insertSqlStmt = "INSERT INTO CONTACTROLE(contactId,role)";
    var valueSqlStmt = "VALUES([contactId],[role])";
    let MSG01 = "INCONSISTENCIA DE DATO: ";
    let MSG02 = "ERROR DE LOGICA: ";
    let MSG03 = "ERROR DE SQL: ";
    
    if(_row.migrationCode != null){
        const getSelectSqlStmt = JSON.parse(doCmd({cmd:"DoQuery",data:{sql:"SELECT id FROM Contact WHERE migrationCode = '"+_row.migrationCode+"'"}}).outData.toString());
        if(getSelectSqlStmt.length ==0){
            throw MSG01 +"No existe un contacto con el ID original provisto";
        }
    
        switch(_row.migrationCode){
            case "":
                throw MSG01+"El ID original del contacto no puede estar vacio";
            default:
                var 
                valueSqlStmt = valueSqlStmt.replace("[contactId]",getSelectSqlStmt[0].id);
        }
    }else{
        throw MSG01+"El ID original del contacto no puede ser nulo";
    }
    
    if(_row.roleId !=null){
        switch(_row.roleId){
            case "":
                throw MSG01+"El role del contacto no puede tener un valor vacio";
            default:
                valueSqlStmt = valueSqlStmt.replace("[role]","'"+_row.roleId+"'");
        }
    }
    
    var runSqlStmt = insertSqlStmt + " " + valueSqlStmt;
        if(runSqlStmt.search(",,") > -1){
            throw MSG03+"Existe un valor vacio que no permite registrar los datos, favor revise el siguiente query: "+runSqlStmt;
        }
        if(format.test(valueSqlStmt)){
            throw MSG03+"Existe caracter invalido que no permite registrar los datos, favor revise el siguiente query: "+runSqlStmt;
        }
    doCmd({cmd:"DoQuery",data:{sql:runSqlStmt}});
}
catch(err){
    throw err;
}