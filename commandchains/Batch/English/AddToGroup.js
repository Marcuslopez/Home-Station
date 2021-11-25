exe(GetOrAddContact,passport:_row.passport,name:_row.name,birth:_row.birth);
_row.holderId=exe0.id;
_row.policyType='C';
exe(RepoLifePolicy,entity:_row,operation:'ADD',noUi:true);
_row.policyId=exe1[0].id;
exe(QuotePolicy,policyId:_row.policyId,dbMode:true,save:true);
return {ok:1,msg:QuotePolicy.msg,outData:QuotePolicy.outData[0]};