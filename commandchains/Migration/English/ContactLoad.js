//block
try{
    let format = /[{}[]]/;
    var insertSqlStmt = "INSERT INTO CONTACT(bankid,bankaccount,birth,cif,cnp,[created],customerDate,fiscalNumber,gender,isPerson,maritalStatus,migrationCode,name,passport,surname1,surname2,updated,publicStatus,bmi,height,weight,income,idType)";
    var valueSqlStmt = "VALUES([bankid],[bankaccount],[birth],[cif],[cnp],[createDate],[customerDate],[fiscalNumber],[gender],[isPerson],[maritalStatus],[migrationCode],[name],[passport],[surname1],[surname2],[updateDate],[publicStatus],0,0,0,0,[idType])";
    let MSG01 = "DATA INCONSISTENCY: ";
    let MSG02 = "ERROR IN LOGIC: ";
    let MSG03 = "SQL ERROR: ";

    
    if(_row.isPerson==null){
        throw MSG01+"Person type not valid or null value";
    }
    else{
        switch(_row.isPerson){
            case "TRUE":
                valueSqlStmt = valueSqlStmt.replace("[isPerson]",1);
				break;
            case "FALSE":
                valueSqlStmt = valueSqlStmt.replace("[isPerson]",0);
				break;
            default:
                throw MSG01+"Type of person cannot be empty or undefined";
        }  
    }

    if(_row.migrationCode==null){
		throw MSG01+"Source system contact ID cannot be null";
	}
	else{
        switch(_row.migrationCode){
            case "":
                throw MSG01+"The source system contact ID cannot be empty."
            default:
                valueSqlStmt = valueSqlStmt.replace("[migrationCode]","'"+_row.migrationCode+"'");
        }
	}

		if(doCmd({cmd:"DoQuery",data:{sql:"SELECT id as cant FROM Contact WHERE cnp ='"+_row.cnp+"' AND cnp <> ''"}}).outData.count >0){
			throw MSG01+"There is a contact with the identification provided";
		}else{
            if(_row.passport =="" && _row.isPerson =="TRUE"){
                switch(_row.cnp){
                    case "":
						insertSqlStmt = insertSqlStmt.replace(",cnp","");
                		valueSqlStmt = valueSqlStmt.replace(",[cnp]","");
                        break;
                    default:
                        valueSqlStmt = valueSqlStmt.replace("[cnp]","'"+_row.cnp+"'");
                        valueSqlStmt = valueSqlStmt.replace("[idType]","'ID001'");
                }
            }else{
                insertSqlStmt = insertSqlStmt.replace(",cnp","");
                valueSqlStmt = valueSqlStmt.replace(",[cnp]","");
            }
			
		}
		

        if(_row.isPerson == "FALSE" && _row.cnp ==null){
            switch(_row.fiscalNumber){
                case "":
                    break;
                default:
                    valueSqlStmt = valueSqlStmt.replace("[fiscalNumber]",_row.fiscalNumber);
                    valueSqlStmt = valueSqlStmt.replace("[idType]","'ID004'");
            }
        }else{
            insertSqlStmt = insertSqlStmt.replace(",fiscalNumber","");
            valueSqlStmt = valueSqlStmt.replace(",[fiscalNumber]","");
        }		

    if(_row.passport!=null && _row.isPerson == "TRUE"){
        if(doCmd({cmd:"DoQuery",data:{sql:"SELECT id as cant FROM Contact WHERE passport='"+_row.passport+"' AND passport <>''"}}).outData.count >0){
            throw MSG01 +"There is a contact with the passport provided";
        }
		switch(_row.passport){
			case "":
				insertSqlStmt = insertSqlStmt.replace(",passport","");
				valueSqlStmt = valueSqlStmt.replace(",[passport]","");
				break;
			default:
				valueSqlStmt = valueSqlStmt.replace("[passport]","'"+_row.passport+"'");
                valueSqlStmt = valueSqlStmt.replace("[idType]","'ID003'");
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


		if(_row.isPerson=="FALSE"){
			insertSqlStmt = insertSqlStmt.replace(",birth","");
			valueSqlStmt = valueSqlStmt.replace(",[birth]","");
		}else{
			switch(_row.birth){
				case "":
					insertSqlStmt = insertSqlStmt.replace(",birth","");
					valueSqlStmt = valueSqlStmt.replace(",[birth]","");
					break;
				default:
					valueSqlStmt = valueSqlStmt.replace("[birth]","'"+new Date(_row.birth).toISOString()+"'");
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
		throw MSG01+"Name cannot be empty";
	}
	else{
		valueSqlStmt = valueSqlStmt.replace("[name]","'"+_row.firstName+"'");
	}

	if(_row.surname1==null && _row.isPerson !="FALSE"){
		throw MSG01+"The first surname of a natural person cannot be empty.";
	}
	else{
		if(_row.isPerson ==false){
			valueSqlStmt = valueSqlStmt.replace("[surname1]","'"+_row.firstName+"'");
		}else{
			switch(_row.surname1){
				case "":
					throw MSG01+"The first surname of a natural person cannot be empty.";
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
            case "FALSE":
                valueSqlStmt = valueSqlStmt.replace("[surname2","'"+_row.firstName+"'");
                break;
            default:
                valueSqlStmt = valueSqlStmt.replace("[surname2]","'"+_row.surname2+"'");
        }
		
	}

	if(_row.createDate != null){
        switch(_row.createDate){
            case "":
                throw MSG01+"Creation date is empty. A creation date must be provided so as not to generate corrupted data.";
            default:
                valueSqlStmt = valueSqlStmt.replace("[createDate]","'"+new Date(_row.createDate).toISOString()+"'");
                valueSqlStmt = valueSqlStmt.replace("[customerDate]","'"+new Date(_row.createDate).toISOString()+"'");
        }
		
	}
	else{
        throw MSG01+"Creation date is empty. A creation date must be provided so as not to generate corrupted data.";
    }

	if(_row.maritalStatus != null){
		switch(_row.maritalStatus){
			case "1":
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",2);
				break;
			case "2":
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",1);
				break;
			case "3":
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",3);
				break;
			case "4":
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",4);
				break;
			case "5":
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",5);
				break;
			case "6":
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",6);
				break;
			case "7":
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",3);
				break;
			case "8":
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",1);
				break;
			default:
				valueSqlStmt = valueSqlStmt.replace("[maritalStatus]",7);

		}
		
	}
	else{
		insertSqlStmt = insertSqlStmt.replace(",maritalStatus","");
		valueSqlStmt = valueSqlStmt.replace(",[maritalStatus]","");
	}

	

	if(_row.gender == null && _row.isPerson == "TRUE"){
		throw MSG01+"Gender must be defined"
	}
	else{
		if(_row.isPerson=="FALSE"){
			insertSqlStmt = insertSqlStmt.replace(",gender","");
			valueSqlStmt = valueSqlStmt.replace(",[gender]","");
		}else{
			switch(_row.gender){
				case "TRUE":
					valueSqlStmt = valueSqlStmt.replace("[gender]","'M'");
					break;
				case "FALSE":
					valueSqlStmt = valueSqlStmt.replace("[gender]","'F'");
					break;
				default:
					throw MSG01+"The gender of the natural person is empty or not defined.";
			}
		}
		
	}

	
	if(_row.publicStatus!=null && _row.isPerson=="TRUE"){
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

	if(valueSqlStmt.search("[idType]")>-1){
		valueSqlStmt = valueSqlStmt.replace(",[idType]","''");
	}

	var runSqlStmt = insertSqlStmt + " " + valueSqlStmt;
	if(runSqlStmt.search(",,") > -1){
		throw MSG03+"There is an empty value that does not allow you to enter data, please check the following query: "+runSqlStmt;
	}
    if(format.test(valueSqlStmt)){
        throw MSG03+"There is an invalid character that does not allow you to enter data, please check the following query: "+runSqlStmt;
    }
doCmd({cmd:"DoQuery",data:{sql:runSqlStmt}});

}
catch(err){
    throw err;
}
