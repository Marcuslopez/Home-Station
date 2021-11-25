exe(RepoLifePolicy,operation:'GET',filter:'id='+_row.policyId);
_row.code= exe0[0].productCode;
exe(GetTable,table:'ProductCharacteristic',column:'Product Version',row:_row.code,getColumn:_row.characteristicName);
return {ok:1,msg:GetTable.msg,outData:GetTable.outData};