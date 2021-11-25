$('#fb-render input').attr('disabled','disabled');
$('#fb-render textarea').attr('disabled','disabled');
var taskStartDate = new Date();
var daysLeftCalculated = 0;
var currentDaysPassed = 0;
var validityDayNumber = 0;
var controlPanel = $("div.ant-card-body").last();
controlPanel.append('<div class="ant-divider ant-divider-horizontal" role="separator"></div>');
controlPanel.append('<div id="validityNotice"></div>');
controlPanel.append('<div id="expirationDateField" class="ant-select ant-select-enabled ant-select-allow-clear ant-select-selection__rendered formbuilder-text form-group field-bonusty"><label  for="daysToExtend" style="text-align:left;display:block;">Expiration Date Extension: </label><select style="display:block;" name="daysToExtend" id="daysToExtend"><option value="0">Select</option><option value="1">1 Day</option><option value="5">5 Days</option><option value="10">10 Days</option></select><br><button id="btnDaysExtension" type="button" class="ant-btn ant-btn-primary" ant-click-animating-without-extra-node="false">Update Now</button></div>');
$("#btnDaysExtension").attr('disabled',true);
console.log(this.process);
  this.exe("GetProcesses",{filter:"id="+this.process.id}).then(p=>{
  const process = p.outData[0];
  taskStartDate = new Date(process.fInicio);
  if(process)
  {
    this.exe("RepoLifePolicy",{operation:"GET",include:["Coverages","PayPlan","Process","Requirements"],filter:"id="+process.entityPath.split("/")[1]}).then(r=>{
      const myPolicy=r.outData[0];
      if(myPolicy){
        this.exe("GetTable",{table:"ProductCharacteristic",column:"Product Version",row:myPolicy.productCode,getColumn:"ValidityDayNumber"}).then(v=>{
          if(v){
            const oneDay = 24*60*60*1000;
            validityDayNumber = v.outData;
            // Discard the time and time-zone information.
            const todayDate = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            const startDate = Date.UTC(new Date(process.fInicio).getFullYear(), new Date(process.fInicio).getMonth(), new Date(process.fInicio).getDate());
            currentDaysPassed = Math.floor((todayDate - startDate) / oneDay);
            daysLeftCalculated = validityDayNumber - currentDaysPassed; 
            var notice ="";
            
            if(daysLeftCalculated <= 5)
            {
              $("#validityNotice").html('<p style="color:red;">This task has '+daysLeftCalculated+' days left to due Date</p>');
            }
            else{
              $("#validityNotice").html('<p style="color:#1890ff;">This task has '+daysLeftCalculated+' days left to due Date</p>');
            }
            
          }
        });
        if(myPolicy.Requirements.filter(m=>m.response==false).length>0){
          this.notification.warning({message: 'Action Required', duration:0,
          description:'All requirements must be completed before the next step in Requirements Tab',
          });
        }
      }
    });
  }
});
$("#daysToExtend").change(()=>{
  console.log($( "#daysToExtend option:selected" ).val());
  if($( "#daysToExtend option:selected" ).val()>0 && (currentDaysPassed > $( "#daysToExtend option:selected" ).val()) && (daysLeftCalculated + parseInt($( "#daysToExtend option:selected" ).val(),10))<=validityDayNumber)
      $("#btnDaysExtension").attr('disabled',false);
  else
    $("#btnDaysExtension").attr('disabled',true);
});
$("#btnDaysExtension").click(()=>{
  const extensionValue = parseInt($( "#daysToExtend option:selected" ).val(),10);
  const extensionNewDate = new Date(taskStartDate.setDate(taskStartDate.getDate()+extensionValue));
  console.log(extensionNewDate);
  console.log(extensionNewDate.getFullYear()+"-"+(extensionNewDate.getMonth()+1)+"-"+extensionNewDate.getDate());
  this.exe("SetField",{entity:'proceso',entityId:this.process.id,fieldValue:"fInicio='"+extensionNewDate.getFullYear()+"-"+(extensionNewDate.getMonth()+1)+"-"+extensionNewDate.getDate()+"'"}).then(s=>{
    console.log("OK:"+s.ok);
    if(s.ok ==true)
      daysLeftCalculated = daysLeftCalculated + extensionValue;
                  
    if(daysLeftCalculated <= 5)
    {
      $("#validityNotice").html('<p style="color:red;">This task has '+daysLeftCalculated+' days left to due Date</p>');
    }else{
      $("#validityNotice").html('<p style="color:#1890ff;">This task has '+daysLeftCalculated+' days left to due Date</p>');
    }
  });
});