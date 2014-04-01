
function buildQRCode(linkURL) {
  return "http://chart.apis.google.com/chart?cht=qr&chs=230x230&chl=" + linkURL;
}

chrome.tabs.getSelected(null, function(tab) { 
    var myTabUrl = tab.url; 
    var fullURL = buildQRCode(myTabUrl);
    document.getElementById("qrImage").src = fullURL;
  });
