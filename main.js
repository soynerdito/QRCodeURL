// May 2013, Soynerdito
// Based on chrome context menu examples

// The onClicked callback function.
function onClickHandler(info, tab) {
  if( info.menuItemId == "showqrcode" ) {
    console.log("selected = " + info.selectionText );
	showQRCode(info.selectionText);
  } else if( info.menuItemId == "showean8Code" ) {
    console.log("selected = " + info.selectionText );
	showEAN8Code(info.selectionText);
  }
};

function checkSum(value){
    var sum = 0,
        odd = true;
    for(i=6; i>-1; i--){
        sum += (odd ? 3 : 1) * parseInt(value.charAt(i));
        odd = ! odd;
    }
    return (10 - sum % 10) % 10;
}

function getPart1EAN8Dic(){
    var part1Dic = new Array();
    part1Dic[0] = "AAA99A9";
    part1Dic[1] = "AA99AA9";
    part1Dic[2] = "AA9AA99";
    part1Dic[3] = "A9999A9";
    part1Dic[4] = "A9AAA99";
    part1Dic[5] = "A99AAA9";
    part1Dic[6] = "A9A9999";
    part1Dic[7] = "A999A99";
    part1Dic[8] = "A99A999";
    part1Dic[9] = "AAA9A99";
    return part1Dic;    
}

function getEAN8Spacer(){
    return "A9A9A";
}

function getPart2EAN8Dic(){
    var part2Dic = new Array();
    
	part2Dic[0] = "999AA9A";
	part2Dic[1] = "99AA99A";
	part2Dic[2] = "99A99AA";
	part2Dic[3] = "9AAAA9A";
	part2Dic[4] = "9A999AA";
	part2Dic[5] = "9AA999A";
	part2Dic[6] = "9A9AAAA";
	part2Dic[7] = "9AAA9AA";
	part2Dic[8] = "9AA9AAA";
	part2Dic[9] = "999A9AA";

    return part2Dic;    
}


// Ref http://barcode-coder.com/en/ean-8-specification-101.html
//Los 1 = 9 Los 0 = A
//Hay que calcular el checkDigit. El Barcode puede tener 7 caracteres +1 del check Digit
//Ver pagina web para informacion de como hacer el barcode
//start : 101
//part #1
//center : 01010
//part #2
//stop : 101
//Show EAN8Code from selection
function showEAN8Code(selectedText){
    var url1 = "http://chart.apis.google.com/chart?chbh=1,0,0&chs=320x75&cht=bvg&chco=000000&chds=0,1&chd=s:";
    var url2 = "&chtt=";
    
    var calcCS = "";    
    if( selectedText.length < 7 || selectedText.length > 8 || selectedText != parseInt(selectedText) ){
        //Nothing to do here
        alert("Invalid data, EAN8 Barcode can only be numeric. Max length is 7 numeric chars without checkdigit or 8 including the check digit."  )
        return;
    }
    var part1Dic = getPart1EAN8Dic();
    var part2Dic = getPart2EAN8Dic();
    if( selectedText.length < 8) {
        calcCS = checkSum( selectedText );
    }    
    var literal = selectedText + calcCS;
    var border = "9A9";
    
    var encoded = border;    
    for(i=0; i < 4; i++){        
        encoded += part1Dic[parseInt(literal.charAt(i))];                
    }
    
    encoded += getEAN8Spacer();
    for(i=4; i < 8; i++){
        encoded += part2Dic[parseInt(literal.charAt(i))];        
    }
    encoded += border;
    var serviceCall = url1 + encoded + url2 + literal    
    chrome.tabs.create({url: serviceCall});  
}

function showQRCode(selectedText) {
  var serviceCall = 'http://chart.apis.google.com/chart?cht=qr&chs=400x400&chld=M&choe=UTF-8&chl=' + selectedText;
  chrome.tabs.create({url: serviceCall});  
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
  // Create one test item for each context type.
  var id = chrome.contextMenus.create({"title": "QR Code from selection", contexts:["selection"],
                                         "id": "showqrcode"} );
  var id2 = chrome.contextMenus.create({"title": "EAN8 Barcode from numeric selection (max 7 or 8 chars) ", contexts:["selection"],
                                         "id": "showean8Code"} );

});
