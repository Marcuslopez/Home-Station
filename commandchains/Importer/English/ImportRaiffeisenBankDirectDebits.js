//block

var E = "E";
var code= _row.code;
var reference = code + E;

doCmd({"cmd":"RepoTransfer","data":{"operation":"ADD","entity":{"currency":_row.currency,"isExternal":true,"amount":_row.minimum,"concept":reference,"destinationAccountId":1144,"sourceExternal":"EXTERNAL"}}});

doCmd({"cmd":"DoTransfer","data":{"transferId":RepoTransfer.outData[0].id,"transfer":null}});
