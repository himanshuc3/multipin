var fuse; // used to perform the fuzzy search
var tabsToSearch = []; 
var tabsToRender = [];
var highlightIndex = 1; //highlighted tab index in my addon
var numTabs; 
var activeTabIndex; //currently active tab index
var isMuted = false;

function keyPresshandlers(){

  document.addEventListener("keypress", function(event){
  // use the value of event if available or
    // if not assume it's IE and use window.event
    event = event || window.event; 
    
    // Prevent arrow keys from scrolling
    if (event.keyCode == 38 || event.keyCode == 40){
      event.preventDefault();
    }

    // Down arrow key
    if (event.keyCode == 40) {
      slideHighlighting(SlideDirectionEnum.DOWN); //On refactoring remove SlideDirection from global namespace
      return;
    }

    // Up arrow key
    if (event.keyCode == 38) {
      slideHighlighting(SlideDirectionEnum.UP);
      return;
    }

    // Enter key
    if (event.keyCode == 13) {
      activateTab(highlightIndex);
    }

    // Shift + backspace key - delete 1st tab
    if (event.keyCode == 8 && event.shiftKey) {
      event.preventDefault(); // Prevent delete key from deleting
      if (document.getElementById('save_snap_menu').style.display == "initial") return;
      closeTab(highlightIndex);
    }

    // Ctrl key - Active tab highlighted in tab list
    if (event.keyCode == 17) {
      highlightActiveTab();
    }
    });
}

function createTabElementssortable(){
  Sortable.create(tab_container,{
    // handle:".handle",
    animation: 200,
    onEnd: function(event){
      browser.tabs.move(tabsToSearch[event.item.getAttribute("data-tabnumber")-1].tabId,{
        index: event.newIndex,
      });
    }
  });
}

function setupFeatures(){
  var featureButtons = document.getElementsByClassName("feature_buttons");
  featureButtons[0].addEventListener("click", createTab.bind(null));
  featureButtons[1].addEventListener("click", moveStartEnd.bind(null));
  featureButtons[2].addEventListener("click", deleteTabsToLeft.bind(null));
  featureButtons[3].addEventListener("click", deleteTabsToRight.bind(null));
  featureButtons[4].addEventListener("click", reloadAll.bind(null));
  featureButtons[5].addEventListener("click", muteAll.bind(null));
  featureButtons[6].addEventListener("click", restoreLastClosedTab.bind(null));
  document.getElementById("snap_set").addEventListener("click", saveSnapshot.bind(null));
  document.getElementById("snap_get").addEventListener("click", retrieveSnapshots.bind(null));
}

// Features Functions
function createTab(event){
  browser.tabs.create({});
  window.close();
}

function moveStartEnd(){
  // alert(typeof activeTabIndex + ""+activeTabIndex);
  if(activeTabIndex==1){
    browser.tabs.move(tabsToSearch[activeTabIndex-1].tabId,{
      index: numTabs
    });  
  }else{
    browser.tabs.move(tabsToSearch[activeTabIndex-1].tabId,{
      index: 0
    });
  }
  window.close();
}

function deleteTabsToLeft(){

  browser.tabs.query({currentWindow: true}, function(tabs) {
    for(var tab of tabs){
      if(tab.pinned)continue;
      if(tab.active)break;
      browser.tabs.remove(tab.id);
    }
  });

  // window.close();
}

function deleteTabsToRight(){
  browser.tabs.query({currentWindow: true}, function(tabs) {
    var activeGone = false;
    for(var tab of tabs){
      if(tab.active){
        activeGone = true;
        continue;
      }

      if(activeGone && !tab.pinned){
      browser.tabs.remove(tab.id);
      }
    }
  });
  // window.close();
}

function reloadAll(){
  browser.tabs.query({currentWindow: true}, function(tabs) {
    for(var tab of tabs){
      browser.tabs.reload(tab.id);
    }
  });
}

//Muting working well, unmuting not happening.
function muteAll(){
  browser.tabs.query({currentWindow: true}, function(tabs) {
    if(isMuted){
      for(var tab of tabs){
        browser.tabs.update(tab.id,{muted:false});
      }
      isMuted = false;
    }else{
      for(var tab of tabs){
        browser.tabs.update(tab.id,{muted:true});
      }
      isMuted = true;
    }
  });
}

function restoreLastClosedTab(){
  browser.sessions.getRecentlyClosed({
    maxResults: 1
  }).then((sessionInfos)=>{
    if (!sessionInfos.length) {
      console.log("No sessions found")
      return;
    }
    let sessionInfo = sessionInfos[0];
    if (sessionInfo.tab) {
      browser.sessions.restore(sessionInfo.tab.sessionId);
    } else {
      browser.sessions.restore(sessionInfo.window.sessionId);
    }
  });
}

function saveSnapshot(){

  getAllTabs(function(tabs, activeWindowId) {
    var currentWindowTabs = [];
    for(var tab of tabs){
      if(tab.windowId == activeWindowId){
        currentWindowTabs.push(tab);
      }
    }

    var obj = {
    tabs: currentWindowTabs
    };

    browser.storage.local.set({obj});
  });

}

function retrieveSnapshots(){
  browser.storage.local.get("obj").then((item)=>{
    for(var tab of item.obj.tabs){
      browser.tabs.create({
        url: tab.url
      });
    } 
  });
}
//End of feature functions


function toggleTheme(){
  var toggly = document.getElementById("toggly");
  var toggle = document.getElementsByClassName("toggle")[0];
  var theme  = document.getElementById("theme");
  toggly.addEventListener("click", function(){
    if(theme.getAttribute("href") == "dest/css/dark_theme.css"){
      theme.href = "dest/css/day_theme.css";
    }else{
      theme.href = "dest/css/dark_theme.css";
    }
  });
}

function onMovingTabsInBrowser(){
  browser.tabs.onMoved.addListener((tabId, moveInfo) => {});
}

function searchInputHandler(){
  var tabSearchInputBox = document.getElementById('search_box');
  tabSearchInputBox.focus();
  tabSearchInputBox.oninput = searchTabs;
}

function initializeApp(){

  //making tabs movable by the help of
  //sortable library
  createTabElementssortable();

  //Setting up feature handlers for
  //create tab, move tab to the beggining etc.
  setupFeatures();

  //Make the toggle button, toggle themes
  toggleTheme();

  //Attaching tabs moving handler
  onMovingTabsInBrowser();

  //searchInputHandler
  searchInputHandler();

  //Handle key press events
  keyPresshandlers();

  //Get all tabs.
  getAllTabs(initializeSearchVariables);
}

function highlightActiveTab() {
  if (activeTabIndex == null) return;
  removeHighlight(highlightIndex);
  highlightIndex = activeTabIndex;
  highlightTab(highlightIndex, true);
}

function activateTab(tabIndex) {
  var tab = tabsToRender[tabIndex - 1];
  browser.windows.update(tab.windowId, { focused : true });
  browser.tabs.update(tab.tabId, {
    active: true
  });
  window.close();
}

function closeTab(tabIndex, tabElement, event) {
  if (event != null) event.stopPropagation();
  tabElement = tabElement || document.getElementById("search_id_" + tabIndex);
  var tab = tabsToRender[tabIndex - 1];
  browser.tabs.remove(tab.tabId, function() {
    focusOnSearchInput();
    // Delete tab element from page
    tabElement.remove();
    // Delete tab from search list
    var tabInSearchList;
    for (var i = 0; i < tabsToSearch.length; i++) {
      tabInSearchList = tabsToSearch[i];
      if (tab.tabId == tabInSearchList.tabId) {
        tabsToSearch.splice(i, 1);
      }
    }
    slideHighlighting(SlideDirectionEnum.DOWN);
  });
}

function reloadTab(tabIndex, event) {
  if (event != null) event.stopPropagation();
  var tab = tabsToRender[tabIndex - 1];
  browser.tabs.reload(tab.tabId, function() {
  });
}

function getAllTabs(callback) {
  browser.tabs.query({}, function(tabs) {
    browser.windows.getCurrent({}, function(windowData) {
      callback(tabs, windowData.id);
    });
  });
}

function createTabHtmlElement(tabData, tabIndex) {
  var title = tabData.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  var url = tabData.url;
  url = url.replace(/(^\w+:|^)\/\//, '');

  if(url.charAt(url.length-1) == "/"){
    url = url.substring(0, url.length-1);
  }

  if ("title_highlighted" in tabData) title = tabData.title_highlighted;
  if ("url_highlighted" in tabData) url = tabData.url_highlighted;
  if (tabData.iconUrl === undefined) {
    return "<div class=\"tab\" data-tabnumber=\""+ tabIndex + "\" id=\"search_id_" + tabIndex + "\"><img class=\"url_icon\" src=\"../dest/images/firefox.png\"><div class=\"tab_title_container\"><div class='title_text'>" + title + "</div><div class=\"url_container\">" + url + "</div></div><div class=\"tab_buttons\" hidden><button class=\"reload\" type=\"button\"><i class=\"fas fa-redo-alt\"></i></button><button class=\"menu_button_base close_tab_button\" type=\"button\"><i class=\"fas fa-times\"></i></button></div></div>";
  } else {
    return "<div class=\"tab\" data-tabnumber=\"" + tabIndex + "\" id=\"search_id_" + tabIndex + "\"><img class=\"url_icon\" src=\"" + tabData.iconUrl + "\"><div class=\"tab_title_container\"><div class='title_text'>" + title + "</div><div class=\"url_container\">" + url + "</div></div><div class=\"tab_buttons\" hidden><button class=\"reload\" type=\"button\"><i class=\"fas fa-redo-alt\"></i></button><button class=\"menu_button_base close_tab_button\" type=\"button\"><i class=\"fas fa-times\"></i></button></div></div>";
  }
}

function renderSearchResults(tabsToRender) {
  var tabsHtml = "";
  var activeTabToBeRendered = false;
  for (let tab of tabsToRender) {
    if (tab.isActiveTab) {
      activeTabToBeRendered = true;
      activeTabIndex = tab.renderIndex;
    }
    tabsHtml += tab.html;
  }
  if (!activeTabToBeRendered) activeTabIndex = null;
  numTabs = tabsToRender.length;
  document.getElementById('tab_container').innerHTML = tabsHtml;
}

function makeTabElementsClickable() {
  var tabElements = document.getElementsByClassName('tab');
  var closeTabButton;
  var tabIndex;
  // var reloadButton;
  for (let tabElement of tabElements) {
    tabIndex = tabElement.getAttribute('data-tabnumber');
    tabElement.onclick = activateTab.bind(null, tabIndex);
    tabElement.addEventListener("mouseover", highlightTabOnHover.bind(null, tabIndex));
    // tabElement.addEventListener("mouseover", tabImage.bind(null, tabIndex));
    closeTabButton = tabElement.getElementsByClassName('close_tab_button');
    closeTabButton[0].addEventListener("click", closeTab.bind(null, tabIndex, tabElement));
      reloadButton = tabElement.getElementsByClassName("reload");
      reloadButton[0].addEventListener("click", reloadTab.bind(null, tabIndex));
    tabIndex++;
  }
}

// function tabImage(tabIndex){
//   browser.tabs.captureTab(tabsToSearch[tabIndex-1].tabId,{}).then((url)=>{
//     document.getElementById("capture_tab").src= url;
//   });
// }


function searchTabs() {
  var searchText = document.getElementById('search_box').value;
  // tabsToRender; - Why was this line here. No reason!!!
  if (searchText.length === 0) {
    tabsToRender = _searchTabsNoQuery(tabsToSearch);
  } else {
    tabsToRender = _searchTabsWithQuery(searchText);
  }


  renderSearchResults(tabsToRender);
  makeTabElementsClickable();
  highlightIndex = 1; // Reset highlight index to the first tab
  if (tabsToRender.length > 0) highlightTab(highlightIndex, true); // highlight first result
}

function _searchTabsNoQuery(tabsToSearch) {
  var tabsToRender = [];
  var tabIndex = 1;
  for (let tab of tabsToSearch) {
    delete tab.title_highlighted;
    delete tab.url_highlighted;
    tab.html = createTabHtmlElement(tab, tabIndex);
    tab.renderIndex = tabIndex;
    tabsToRender.push(tab);
    tabIndex++;
  }
  return tabsToRender;
}

function _searchTabsWithQuery(query) {
  results = fuse.search(query);
  var tabsToRender = [];
  var tabIndex = 1;
  for (let result of results) {
    result.item.matches = result.matches;
    highLightSearchResults(result.item);
    result.item.html = createTabHtmlElement(result.item, tabIndex);
    result.item.renderIndex = tabIndex;
    tabsToRender.push(result.item);
    tabIndex++;
  }
  return tabsToRender;
}

// function renderRaw(){
//   var html = "<ul>";
//   var index = 1;
//   for(var tab of tabsToSearch){
//     html += "<li>" + index + "-" + tab.tabId +"-" + tab.title + "</li>";
//     index++;
//   }
//   html += "</ul>";
//   document.getElementById("test").innerHTML = html;
// }

function initializeSearchVariables(tabs, activeWindowId) {
  for (let tab of tabs) {
    tabsToSearch.push({
      title: tab.title,
      url: tab.url,
      tabId: tab.id,
      windowId: tab.windowId,
      iconUrl: tab.favIconUrl,
      isActiveTab: (tab.active && tab.windowId == activeWindowId ? true : false),
      muted: tab.muted
    });
  }

  // renderRaw();
  var searchOpts = {
    shouldSort: true,
    keys: ["title", "url"],
    include: ['matches']
  };
  fuse = new Fuse(tabsToSearch, searchOpts);
  searchTabs();
}

function closeMenu(element) {
  hideElement(element);
  focusOnSearchInput();
}

function focusOnSearchInput() {
  var x = window.scrollX, y = window.scrollY;
  var tabSearchInputBox = document.getElementById('search_box');
  tabSearchInputBox.focus();
  window.scrollTo(x, y);
}

function hideElement(element) {
  element.style.display = "none";
}

//Starts code execution
document.addEventListener('DOMContentLoaded', function() {

  //Initializing all handlers
  initializeApp();
  
  // Display the save snapshot menu
  // var showSaveSnapshotMenuButton = document.getElementById('save_snap_button');
  // showSaveSnapshotMenuButton.onclick = showSaveSnapshotMenu;

  // Close the save snap menu
  // var saveSnapMenuElement = document.getElementById('save_snap_menu');
  // var cancelSaveSnapshotButton = document.getElementById('cancel_save_snap_button');
  // cancelSaveSnapshotButton.onclick = closeMenu.bind(null, saveSnapMenuElement);

  // Toggle checkboxes for selecting saving a snapshot of only the active window vs all windows
  // Default checkboxes do not go well with the theme of Gibbon Tabs. We use fontello icons for the checkboxes.
  // var snapshotActiveWindowCheckbox = document.getElementById('snapshot_only_active_window_checkbox');
  // var snapshotAllWindowsCheckbox = document.getElementById('snapshot_all_windows_checkbox');
  // snapshotActiveWindowCheckbox.onclick = toggleSnapshotTypeCheckbox.bind(null, snapshotActiveWindowCheckbox, snapshotAllWindowsCheckbox);
  // snapshotAllWindowsCheckbox.onclick = toggleSnapshotTypeCheckbox.bind(null, snapshotAllWindowsCheckbox, snapshotActiveWindowCheckbox);

  // Save a snapshot
  // var submitSaveSnapshotButton = document.getElementById('submit_save_snap_button');
  // submitSaveSnapshotButton.onclick = saveSnapshot.bind(null, snapshotActiveWindowCheckbox);

  // Display list of saved snapshots
  // var renderSnapsListButton = document.getElementById('get_snaps_button');
  // renderSnapsListButton.onclick = renderListOfSnapshots;

  // Having the mouse leave the Overwrite snapshot widget closes it
  // var overwriteSnapshotWidget = document.getElementById('overwrite_snap_widget');
  // overwriteSnapshotWidget.onmouseleave = closeMenu.bind(null, overwriteSnapshotWidget);

  // Toggle checkboxes for selecting the granularity of overwriting a snapshot (active window vs all windows)
  // var overwriteSnapshotActiveWindowCheckbox = document.getElementById('overwrite_snapshot_only_active_window_checkbox');
  // var overwriteSnapshotAllWindowsCheckbox = document.getElementById('overwrite_snapshot_all_windows_checkbox');
  // overwriteSnapshotActiveWindowCheckbox.onclick = toggleSnapshotTypeCheckbox.bind(null, overwriteSnapshotActiveWindowCheckbox, overwriteSnapshotAllWindowsCheckbox);
  // overwriteSnapshotAllWindowsCheckbox.onclick = toggleSnapshotTypeCheckbox.bind(null, overwriteSnapshotAllWindowsCheckbox, overwriteSnapshotActiveWindowCheckbox);

});
