_row.changeId = (exe(LoadEntities,entity:'Change',fields:'*',filter:"Discriminator = '_row.change' and lifePolicyId="+_row.policyId)).sort(function(a,b){return b.id - a.id})[0].id;

exe(GenerateActuarialChangeProjection, changeId: _row.changeId);
_row.data = exe1.data;
_row.array = [];

for (var indice in _row.data) {
_row.obj = new Object()
 for (var a in _row.data[indice])
	_row.obj[(_row.data[0][a])] = _row.data[indice][a]
_row.array.push(_row.obj)
};

_row.array.shift();
_row.datadoc = {outData: _row.array};
exe(GenerateDoc,template:_row.templatename,data:_row.datadoc,async:0);
_row.url = exe2.url;

exe(LoadEntities,entity:'LifePolicy',filter:'id='+_row.policyId);
_row.contactid = exe3[0].holderId;
exe(GetContacts,filter:'id='+_row.contactid);
_row.email = exe4[0].email;

exe(SendEmail,email:_row.email,text:_row.text,subject:_row.subject,attachments:[_row.url]);