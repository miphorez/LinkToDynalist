//Escape for OPML
function eOPML(str){
  return str
  .replace(/&/g,'&amp;') //edit DL handles escaping "&" differently than WF
  .replace(/</g,'&lt;')
  .replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;')
  .replace(/(\n)/g,'&#10;'); 
  }

function findOrCreateTab(){
  chrome.tabs.query({'currentWindow': true}, function (tabs) {
    var u = 'https://dynalist.io';
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url.indexOf(u) !== -1)  {
          chrome.tabs.update(tabs[i].id, { selected: true }); 
          return;
          }
    }
    chrome.tabs.create({ url: u, selected: true }); 
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
	
  // var clip = '<opml><body><outline text=\"'+ eOPML(tab.title) + '\" _note=\"' + eOPML(tab.url + ' ') + '\" /></body></opml>';
  var clip = '['+ tab.title + '](' + tab.url + ')';
	
  //create temporary textarea for copying
  var tempText = document.createElement('textarea');
	document.body.appendChild(tempText);
	tempText.innerText = clip;
	tempText.focus();
	document.execCommand('SelectAll');
	document.execCommand('Copy', false, null);
	document.body.removeChild(tempText);
  
  findOrCreateTab();
});

//Toggle Last Tab
var currentTab=0, oldTab=1, tabRemoved=false;
chrome.tabs.onActivated.addListener(function(activeInfo) {
  if(!tabRemoved){
  //простой переключатель
    if(oldTab!=activeInfo.tabId){
      oldTab = currentTab != 0 ? currentTab : activeInfo.tabId;
      currentTab = activeInfo.tabId;
    // console.log("oldTab: "+oldTab);
   }
  }else{
  //эта вкладка получила фокус, потому что предыдущая вкладка была закрыта. Так что просто обновите currentTab
    currentTab = activeInfo.tabId;
    tabRemoved=false;
  }

});


//listen for keyboard shortcuts
chrome.commands.onCommand.addListener(function (command) {
  if (command == "toggleLast") {
  	chrome.tabs.update(oldTab,{selected:true});
    } 
});

//listen when a tab is closed
chrome.tabs.onRemoved.addListener(function(){
	tabRemoved=true;
})

