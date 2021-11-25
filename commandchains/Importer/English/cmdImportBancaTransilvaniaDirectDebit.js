//block
const lines=_file.split('\n');
const out=[];
lines.forEach(line=>{
  const p=line.split(',');

if(p[7] =="OK")
{
out.push(["EXTERNAL","EXTERNAL-03",p[4]+ "" +"E","RON",p[3]]);
}
})
return {ok:true,msg:"OK",fileName:"test.json",outData:out}