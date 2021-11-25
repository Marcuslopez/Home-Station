//block
try{
    let format = /([\[])([\s\S]+?)([\]])/;
    var insertSqlStmt = "INSERT INTO CONTACT(bankid,bankaccount,birth,cif,cnp,[created],customerDate,fiscalNumber,gender,isPerson,maritalStatus,migrationCode,name,passport,surname1,surname2,updated,publicStatus,bmi,height,weight,income,idType)";
    var valueSqlStmt = "VALUES([bankid],[bankaccount],[birth],[cif],[cnp],[createDate],[customerDate],[fiscalNumber],[gender],[isPerson],[maritalStatus],[migrationCode],[name],[passport],[surname1],[surname2],[updateDate],[publicStatus],0,0,0,0,[idType])";
    let MSG01 = "INCONSISTENCIA DE DATO: ";
    let MSG02 = "ERROR DE LOGICA: ";
    let MSG03 = "ERROR DE SQL: ";
        
    if(_row.isPerson==null){
        throw MSG01+"Tipo de persona no es valida o valor nulo";
    }
    else{
        switch(_row.isPerson){
            case "":
                throw MSG01+"Tipo de persona no puede estar vacio";
            case "P":
                valueSqlStmt = valueSqlStmt.replace("[isPerson]",1);
            case "E":
                valueSqlStmt = valueSqlStmt.replace("[isPerson]",0);
            default:
                break;
        }  
    }

	if(_row.migrationCode==null){
		throw MSG01+"El ID de contacto de sistema origen no puede ser nulo";
	}
	else{
        switch(_row.migrationCode){
            case "":
                throw MSG01+"El ID de contacto de sistema origen no puede ser vacio"
            default:
                valueSqlStmt = valueSqlStmt.replace("[migrationCode]","'"+_row.migrationCode+"'");
        }
	}

	if(_row.cnp==null && _row.isPerson =="P"){
		throw MSG01+"Identificación tiene valor nulo para una persona natural";
	}
	else{
		if(doCmd({cmd:"DoQuery",data:{sql:"SELECT id as cant FROM CONTACT WHERE cnp ='"+_row.cnp+"' AND cnp <> ''"}}).outData.count >0){
			throw MSG01+"Existe un contacto con la identificacion provista";
		}else{
            if(_row.passport =="" && _row.isPerson =="P"){
                switch(_row.cnp){
                    case "":
                        throw MSG01+"Se ha proporcionado una identificacion con valor vacio";
                    default:
                        valueSqlStmt = valueSqlStmt.replace("[cnp]","'"+_row.cnp+"'");
                        valueSqlStmt = valueSqlStmt.replace("[idType]","'CED'");
                }
            }else{
                insertSqlStmt = insertSqlStmt.replace(",cnp","");
                valueSqlStmt = valueSqlStmt.replace(",[cnp]","");
            }
			
		}
		
	}

	if(_row.fiscalNumber != null){
        if(_row.isPerson == "E" && _row.cnp ==null){
			if(doCmd({cmd:"DoQuery",data:{sql:"SELECT id as cant FROM CONTACT WHERE fiscalNumber='"+_row.fiscalNumber+"' AND fiscalNumber <> ''"}}).outData.count >0){
				throw MSG01 +"Existe un contacto con la RNC provisto";
			}
            switch(_row.fiscalNumber){
                case "":
                    throw MSG01 + "RNC no puede ser vacio para empresas";
                    break;
                default:
                    valueSqlStmt = valueSqlStmt.replace("[fiscalNumber]",_row.fiscalNumber);
                    valueSqlStmt = valueSqlStmt.replace("[idType]","'RNC'");
            }
        }else{
            insertSqlStmt = insertSqlStmt.replace(",fiscalNumber","");
            valueSqlStmt = valueSqlStmt.replace(",[fiscalNumber]","");
        }		
	}
	else{
		insertSqlStmt = insertSqlStmt.replace(",fiscalNumber","");
		valueSqlStmt = valueSqlStmt.replace(",[fiscalNumber]","");
	}

	if(_row.passport!=null && _row.isPerson == "P"){
		if(doCmd({cmd:"DoQuery",data:{sql:"SELECT id as cant FROM CONTACT WHERE passport='"+_row.passport+"' AND passport <> ''"}}).outData.count >0){
			throw MSG01 +"Existe un contacto con el pasaporte provisto";
		}
		switch(_row.passport){
			case "":
				insertSqlStmt = insertSqlStmt.replace(",passport","");
				valueSqlStmt = valueSqlStmt.replace(",[passport]","");
				break;
			default:
				valueSqlStmt = valueSqlStmt.replace("[passport]",_row.passport);
                valueSqlStmt = valueSqlStmt.replace("[idType]","'PASS'");
		}
	}
	else{
		insertSqlStmt = insertSqlStmt.replace(",passport","");
		valueSqlStmt = valueSqlStmt.replace(",[passport]","");
	}

	if(_row.bankid != null && _row.bankid != 0){
		valueSqlStmt = valueSqlStmt.replace("[bankid]",_row.bankid);
	}else{
		insertSqlStmt = insertSqlStmt.replace("bankid,","");
		valueSqlStmt = valueSqlStmt.replace("[bankid],","");
	}

	if(_row.bankaccount != null){
		valueSqlStmt = valueSqlStmt.replace("[bankaccount]",_row.bankid);
	}else{
		insertSqlStmt = insertSqlStmt.replace("bankaccount,","");
		valueSqlStmt = valueSqlStmt.replace("[bankaccount],","");
	}

	if(_row.birth==null && _row.fiscalNumber==null && _row.isPerson =="P"){
		throw MSG01+"Fecha de nacimiento no ha sido proporcionada para una persona natural";
	}
	else{
		if(_row.isPerson=="E"){
			insertSqlStmt = insertSqlStmt.replace(",birth","");
			valueSqlStmt = valueSqlStmt.replace(",[birth]","");
		}else{
			switch(_row.birth){
				case "":
                    throw MSG01+"Fecha de nacimiento vacia para una persona natural";
				default:
					valueSqlStmt = valueSqlStmt.replace("[birth]","'"+new Date(_row.birth).toISOString()+"'");
			}

		}
		
	}

	if(_row.cif != null){
		switch(_row.cif){
			case "":
				insertSqlStmt = insertSqlStmt.replace(",cif","");
				valueSqlStmt = valueSqlStmt.replace(",[cif]","");
				break;
			default:
				valueSqlStmt = valueSqlStmt.replace("[cif]",_row.cif);
		}
		
	}else{
		insertSqlStmt = insertSqlStmt.replace(",cif","");
		valueSqlStmt = valueSqlStmt.replace(",[cif]","");
	}

	if(_row.firstName==null){
		throw MSG01+"El nombre no puede estar vacio";
	}
	else{
		valueSqlStmt = valueSqlStmt.replace("[name]","'"+_row.firstName+"'");
	}

	if(_row.surname1==null && _row.isPerson !="E"){
		throw MSG01+"El primer apellido de una persona natural no puede estar vacio";
	}
	else{
		if(_row.isPerson =="E"){
			valueSqlStmt = valueSqlStmt.replace("[surname1]","'"+_row.firstName+"'");
		}else{
			switch(_row.surname1){
				case "":
					throw MSG01+"El primer apellido de una persona natural no puede estar vacio";
				default:
					valueSqlStmt = valueSqlStmt.replace("[surname1]","'"+_row.surname1+"'");
			}
			
		}
		
	}

	if(_row.surname2==null){
		insertSqlStmt = insertSqlStmt.replace(",surname2","");
		valueSqlStmt = valueSqlStmt.replace(",[surname2]","");
	}else{
        switch(_row.isPerson){
            case "E":
                valueSqlStmt = valueSqlStmt.replace("[surname2","'"+_row.firstName+"'");
                break;
            default:
                valueSqlStmt = valueSqlStmt.replace("[surname2]","'"+_row.surname2+"'");
        }
		
	}

	if(_row.createDate != null){
        switch(_row.createDate){
            case "":
                throw MSG01+"La fecha de inclusion esta vacia. Se debe proporcionar una fecha de inclusion para no generar data corrupta";
            default:
                valueSqlStmt = valueSqlStmt.replace("[createDate]","'"+new Date(_row.createDate).toISOString()+"'");
                valueSqlStmt = valueSqlStmt.replace("[customerDate]","'"+new Date(_row.createDate).toISOString()+"'");
        }
		
	}
	else{
        throw MSG01+"Fecha de inclusion tiene un valor nulo. Se debe proporcionar una fecha de inclusion para no generar data corrupta";
    }

	if(_row.maritalStatus != null){
		switch(_row.maritalStatus){
			case "S":
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",3);
				break;
			case "C":
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",1);
				break;
			default:
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",2);

		}
		
	}
	else{
		insertSqlStmt = insertSqlStmt.replace(",maritalStatus","");
		valueSqlStmt = valueSqlStmt.replace(",[maritalStatus]","");
	}

	if(_row.gender == null && _row.isPerson == "P"){
		throw MSG01+"El genero debe definirse"
	}
	else{
		if(_row.isPerson=="E"){
			insertSqlStmt = insertSqlStmt.replace(",gender","");
			valueSqlStmt = valueSqlStmt.replace(",[gender]","");
		}else{
			switch(_row.gender){
				case "":
					throw MSG01+"El genero de la persona natural esta vacio";
				default:
					valueSqlStmt = valueSqlStmt.replace("[gender]","'"+_row.gender+"'");
			}
		}
		
	}

	if(_row.publicStatus!=null && _row.isPerson=="P"){
		switch(_row.publicStatus){
			case "1":
				valueSqlStmt = valueSqlStmt.replace("[publicStatus]",_row.publicStatus);
				break;
			default:
				valueSqlStmt = valueSqlStmt.replace("[publicStatus]",0);
		}
		
	}else{
		insertSqlStmt = insertSqlStmt.replace(",publicStatus","");
		valueSqlStmt = valueSqlStmt.replace(",[publicStatus]","");
	}

	if(_row.updateDate != null){
		switch(_row.updateDate){
			case "":
				valueSqlStmt = valueSqlStmt.replace("[updateDate]","'"+new Date().toISOString()+"'");
				break;
			default:
				valueSqlStmt = valueSqlStmt.replace("[updateDate]","'"+new Date(_row.updateDate).toISOString()+"'");
		}
		
	}else{
		valueSqlStmt = valueSqlStmt.replace("[updateDate]","'"+new Date().toISOString()+"'");
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
