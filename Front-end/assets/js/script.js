function hideme(item){var item = String(item);$(item).hide();}
function showme(item){var item = String(item);$(item).show();}
function initializer(item){var item = String(item);$(item).val('');}
function setvalue(item,value){var item = String(item);var value = String(value);$(item).val(value);}
function getvalue(item){var item = String(item);return ($(item).val())}
function dividetogetresult(item1,item2){var item1 = parseFloat(item1);var item2 = parseFloat(item2);return Math.round(item1 / item2);}
function multiplytogetresult(item1,item2){var item1 = String(item1);var item2 = String(item2);return parseFloat(item1) * parseFloat(item2);}
function addtoselect(item,id,instance){var str1 = String(item);var id = String(id);var instance = String(instance);$("<option></option>", { value: id , text: instance}).appendTo(str1);}

function removeduplicated()
{
	var usedNames = {};
    $("select[id ='purpose'] > option").each(function () 
    {
        if(usedNames[this.text]){$(this).remove();} 
        else{usedNames[this.text] = this.value;}
    })
}

function checkifvariableexists(item)
{
	var hash = '#';
	var str1 = String(item);
	var res = hash.concat(str1);
	elem = getvalue(res);
	if(elem){return true}
	else{return false}
}

function resetitems()
{

	hideme("#MemoryOptimised");hideme("#StorageOptimised");hideme("#ComputeOptimised");hideme("#GeneralPurpose");
	initializer("#mapperlabel");initializer("#timeforprocessingasamplefile");initializer("#desiredprocessingtime");
	initializer("#totalmapperrequired");initializer("#estimatednumberofnodes");initializer("#totalsizeofinput");
	setvalue("#totalsizeofinputselect","MB");setvalue("#inputsplitsizeselect","64");setvalue("#purpose","null")
}

function sorttheselectkey(item)
{	
	var hash = 'select';var str1 = String(item);var str2 = ' option';
	var res = hash.concat(str1);var ans = res.concat(str2);var options = $(ans);
    var arr = options.map(function(_, o) {return {t: $(o).text(),v: o.value};}).get();
    arr.sort(function(o1, o2){return o1.v > o2.v ? 1 : o1.v < o2.v ? -1 : 0;});
    options.each(function(i, o) {o.value = arr[i].v;$(o).text(arr[i].t);});
};

function consoleitems()
{
	var mapperlabel = getvalue('#mapperlabel');var timeforprocessingasamplefile = getvalue('#timeforprocessingasamplefile');
	var desiredprocessingtime = getvalue('#desiredprocessingtime');	var totalmapperrequired = getvalue('#totalmapperrequired');
	var numerator = multiplytogetresult(totalmapperrequired,timeforprocessingasamplefile);
	var denominator = multiplytogetresult(desiredprocessingtime,mapperlabel);
	var result = dividetogetresult(numerator,denominator);setvalue("#estimatednumberofnodes",result);
}

function checkifchangerequired()
{
	var val1 = checkifvariableexists('mapperlabel');var val2 = checkifvariableexists('totalmapperrequired');
	var val3 = checkifvariableexists('timeforprocessingasamplefile');var val4 = checkifvariableexists('desiredprocessingtime');
	if ((val1 === true) && (val2 === true) && (val3 === true) && (val4 === true)){consoleitems();}
	else{initializer("#estimatednumberofnodes");}
}

function changetotalmappersSubfunction(item1,item2,item3)
{
	var item1 = String(item1);var inputsplitsizeselect = String(item2);var totalsizeofinput = String(item3);
	var access = item1=="MB" ?  1 : (item1=="GB" ? (multiplytogetresult(totalsizeofinput,1024)) : multiplytogetresult(totalsizeofinput,1048576));
	var result = dividetogetresult(access,inputsplitsizeselect);
	setvalue("#totalmapperrequired",result);
	checkifchangerequired();
}

function changetotalmappers() 
{
	var totalsizeofinput = document.getElementById("totalsizeofinput").value;
	var totalsizeofinputselect = String(getvalue('#totalsizeofinputselect'));
	var inputsplitsizeselect = String(getvalue('#inputsplitsizeselect'));
	changetotalmappersSubfunction(totalsizeofinputselect,inputsplitsizeselect,totalsizeofinput)
}
    
function setmappervalue(instanceid,api_gateway_url)
{
	instanceid = String(instanceid);
	api_gateway_url = String(api_gateway_url);

	$.get(api_gateway_url, function(data)
	{
    	data.forEach(function(item)
    	{
        	var mappervalue = (item['mappervalue']['S']);
        	var id = (item['id']['S']);
            
        	if(instanceid == id)
        	{
        	    setvalue("#mapperlabel",mappervalue);
        	}
        });
    });
    checkifchangerequired();
}

$(document).ready(function(){
	var api_gateway_url = 'your api url';
	$.get(api_gateway_url, function(data) 
    {
    	data.forEach(function(item) 
        {
        	var typeid = (item['typeid']['S']);
        	var type = (item['type']['S']);
        	var id = (item['id']['S']);
            var instance = (item['instance']['S']);
            if(typeid == '0'){addtoselect('#GeneralPurpose',id,instance);sorttheselectkey('#GeneralPurpose');}   
            if(typeid == '1'){addtoselect('#ComputeOptimised',id,instance);sorttheselectkey('#ComputeOptimised');}   
            if(typeid == '2'){addtoselect('#StorageOptimised',id,instance);sorttheselectkey('#StorageOptimised');}   
            if(typeid == '3'){addtoselect('#MemoryOptimised',id,instance);sorttheselectkey('#MemoryOptimised');}   
        });

        data.forEach(function(item) 
        {            
        	var typeid = (item['typeid']['S']);
        	var type = (item['type']['S']);
        	addtoselect('#purpose',typeid,type);
            removeduplicated();
        });
    });
    $('#purpose').on('change', function() 
    {
      if ( this.value == '0'){showme('#GeneralPurpose');hideme('#ComputeOptimised');hideme('#MemoryOptimised');hideme('#StorageOptimised');initializer('#mapperlabel');}
      if ( this.value == '1'){showme('#ComputeOptimised');hideme('#GeneralPurpose');hideme('#MemoryOptimised');hideme('#StorageOptimised');initializer('#mapperlabel');}
      if ( this.value == '2'){showme('#StorageOptimised');hideme('#GeneralPurpose');hideme('#MemoryOptimised');hideme('#ComputeOptimised');initializer('#mapperlabel');}
      if ( this.value == '3'){showme('#MemoryOptimised');hideme('#GeneralPurpose');hideme('#StorageOptimised');hideme('#ComputeOptimised');initializer('#mapperlabel');}     
      if ( this.value == 'null'){hideme('#MemoryOptimised');hideme('#GeneralPurpose');hideme('#StorageOptimised');hideme('#ComputeOptimised');initializer('#mapperlabel');}
    });

	$("#totalsizeofinput").on("keyup", function() {changetotalmappers();});
	$('#totalsizeofinputselect').on('change', function() {changetotalmappers();});
	$('#inputsplitsizeselect').on('change', function() {changetotalmappers();});
	$('#desiredprocessingtime').on('keyup', function() {checkifchangerequired();});
    $('#timeforprocessingasamplefile').on('keyup', function() {checkifchangerequired();});
    $('#GeneralPurpose').on('change', function(){ setmappervalue(this.value, api_gateway_url);});
    $('#ComputeOptimised').on('change',function(){setmappervalue(this.value, api_gateway_url);});
    $('#StorageOptimised').on('change',function(){setmappervalue(this.value, api_gateway_url);});
    $('#MemoryOptimised').on('change', function(){setmappervalue(this.value, api_gateway_url);});
   

});

