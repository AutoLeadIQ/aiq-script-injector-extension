console.log("I AM CONTENT.JS")
chrome.runtime.onMessage.addListener(messageHandler);

function messageHandler(message, _sender, _response){
  if(message.action == "__AIQ_SCRIPT_LOAD"){
    const aiqScriptContent = getAiQScript(message.apiKey, message.endPoint)
    const jsDom = document.createElement("script")
    jsDom.innerHTML = aiqScriptContent;
    jsDom.id ="__AIQ_SCRIPT"
    document.body.appendChild(jsDom);
    console.log(jsDom)
  }

  console.log(message)
}  

function getAiQScript(apiKey, endPoint){
  return `
  (function (d, url) {
    var iframe = d.body.appendChild(d.createElement('iframe')),
      doc = iframe.contentWindow.document;
    iframe.style.cssText = "position:absolute;height:0px;left:0px;display:none;visibility:hidden";
    doc.open()._l = function(fd){
      var s_l = fd.createElement("script");
      s_l.src = url;
      fd.getElementsByTagName("head")[0].appendChild(s_l)
    }
    doc.open().write("<body onload='document._l(document)'>");
    doc.close();
  })(document, "${endPoint}/widget/load/${apiKey}");
  `
}