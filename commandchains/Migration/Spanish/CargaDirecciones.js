//block
try{
    let format = /[{}[]]/;
    var insertSqlStmt = "INSERT INTO CONTACTADDRESS(address1,address2,addressType,city,contactId,country,id,jMap,sector,state,zip)";
    var valueSqlStmt = "VALUES([address1],[address2],[addressType],[city],[contactId],[country],[id],[jMap],[sector],[state],[zip])";
    var updateSqlStmt = "UPDATE CONTACT SET phone=[phone] WHERE migrationCode='[migrationCode]'";
    let MSG01 = "INCONSISTENCIA DE DATO: ";
    let MSG02 = "ERROR DE LOGICA: ";
    let MSG03 = "ERROR DE SQL: ";
    var isUpdate = false;
    

}
catch(err){
    throw err;
}