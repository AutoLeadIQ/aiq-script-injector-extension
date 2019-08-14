const endPointMapping = {
  "live": "https://widget.autoleadiq.com",
  "dev": "http://localhost:5000"
}

getPreviousValue("LAST_SAVED", function(result){
  if(result["LAST_SAVED"]){
    const mode = JSON.parse(result["LAST_SAVED"]).mode;
    $(`#__AIQ__${mode}_MODE`).prop("checked", true)
    handleAfterModeChanged(mode)
  }
});

document.getElementById("btn-clicker").addEventListener("click", function (){
  const messageObj = {
    action: "__AIQ_SCRIPT_LOAD",
    apiKey: document.getElementById("__AIQ__API_KEY").value.trim(),
    mode: document.querySelector('input[name="app_mode_chooser"]:checked').value,
  } 
  
  if(!messageObj.apiKey || messageObj.apiKey.length < 1 ){
    return alert("Please Add Api Key")
  }

  save(messageObj, messageObj.mode)
  save({mode: messageObj.mode}, "LAST_SAVED")

  const aiqScript = getAiQScript(messageObj.apiKey, endPointMapping[messageObj.mode]);

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
    chrome.tabs.executeScript(tabs[0].id, {code: aiqScript})
  });
});

$('input[type=radio][name=app_mode_chooser]').change(function() {
  handleAfterModeChanged(this.value)
});

function handleAfterModeChanged(mode){
  getPreviousValue(mode, function(result){
    $("#__AIQ__API_KEY").val(null);
    
    if(result[mode]){
      const parsedValue = JSON.parse(result[mode])
      $("#__AIQ__API_KEY").val(parsedValue.apiKey)
    }
    
  })
}

function save(messageObj, key){
  const obj = {}
  obj[key] = JSON.stringify(messageObj)
  chrome.storage.local.set(obj, function() {
    console.log('Value is set to ' + this);
  });
}

function getPreviousValue(key, cb){
  chrome.storage.local.get([key], function(result) {
    console.log('Value currently is ',  result);
    cb(result)
  });
}



function getAiQScript(apiKey, endPoint){
  return `
  
  (function (d, url) {
    console.log(document.getElementById);
    var s_l = d.createElement("script");
      s_l.src = url;
    d.getElementsByTagName("head")[0].appendChild(s_l)

  })(document, "${endPoint}/widget/load/${apiKey}");
  `
}