//Up and down indicators
var SlideDirectionEnum = {
  UP: 1,
  DOWN: 2
};

//Left border color applied in highlightTab function
var TAB_BORDER_COLORS = [
  "#0060df", 
  "#d7b600", 
  "#058b00", 
  "#a44900", 
  "#008ea4"
];


var lastCursorPos = { 
  x: 0, 
  y: 0
};

//Checking whether tab elements are fully visible
// or not in window. 
// returns false when hidden by overflow.
function isScrolledIntoView(el) {
  var elemTop = el.getBoundingClientRect().top;
  var elemBottom = el.getBoundingClientRect().bottom;
  var tabContainerTop = document.getElementById("tab_container").getBoundingClientRect().top;
  return (elemTop >= tabContainerTop) && (elemBottom <= window.innerHeight);
}

//Applies highlighted class to index to be highlighted
// when up or down pressed
function highlightTab(tabIndex, shouldScrollIntoView, slideDirection) {
  var toHighlight = document.getElementById("search_id_" + tabIndex);
  if (toHighlight == null) {
    return false;
  }
  toHighlight.classList.add("highlighted");
  if (shouldScrollIntoView && !isScrolledIntoView(toHighlight)) {
    if(slideDirection==2){
      toHighlight.scrollIntoView(false);
    }else{
      toHighlight.scrollIntoView(true);
    }
  }
  toHighlight.style["border-left-color"] = TAB_BORDER_COLORS[tabIndex % 5];
  return true;
}

//Checking whether before starting or after ending 
// of highlighted Index
function isHighlightOverTop() {
  return highlightIndex < 1;
}

function isHighLightPastBottom() {
  return highlightIndex > numTabs;
}
//end of boundary condition helper functions

//Removes highlighted class
function removeHighlight(tabIndex) {
  var active = document.getElementById("search_id_" + tabIndex);
  if (active !== null) {
    active.classList.remove("highlighted");
  }
}
//end of removeHighlight

//ENTRY GATE for handling up and down arrow keys
function slideHighlighting(slideDirection) {
  var boundaryCondition;
  var oppositeBoundaryCondition;
  var oppositeSlideDirection;
  if (slideDirection == SlideDirectionEnum.UP) {
    boundaryCondition = isHighlightOverTop;
    oppositeBoundaryCondition = isHighLightPastBottom;
    oppositeSlideDirection = SlideDirectionEnum.DOWN;
  } else {
    boundaryCondition = isHighLightPastBottom;
    oppositeBoundaryCondition = isHighlightOverTop;
    oppositeSlideDirection = SlideDirectionEnum.UP;
  }

  removeHighlight(highlightIndex);

  if (!boundaryCondition()) {
    if (slideDirection == SlideDirectionEnum.UP) {
      --highlightIndex;
    } else {
      ++highlightIndex;
    }
  }

  while (!highlightTab(highlightIndex, true, slideDirection) && !boundaryCondition()) {
    if (slideDirection == SlideDirectionEnum.UP) {
      --highlightIndex;
    } else {
      ++highlightIndex;
    }
  }
  if (highlightIndex == 0 || highlightIndex == numTabs + 1) {
    while(!highlightTab(highlightIndex, true, slideDirection) && !oppositeBoundaryCondition()) {
      if (oppositeSlideDirection == SlideDirectionEnum.UP) {
        --highlightIndex;
      } else {
        ++highlightIndex;
      }
    }
  }
  return;
}
//slideHighlighting end

//ENTRY GATE for highlighting tabs on hovering
function highlightTabOnHover(tabIndex, event) {
  
  var currentCursorPos = { 
    x: event.screenX, 
    y: event.screenY 
  };

  if (lastCursorPos.x == currentCursorPos.x &&
      lastCursorPos.y == currentCursorPos.y) {
    // Mouse didn't move, don't process hover event
    return;
  }
  lastCursorPos.x = currentCursorPos.x;
  lastCursorPos.y = currentCursorPos.y;

  removeHighlight(highlightIndex);
  highlightIndex = tabIndex;
  highlightTab(tabIndex, false, 1);
}

function highLightSearchResults(tab) {
  var matchKey;
  var highLightedText;
  var new_key;
  for (let match of tab.matches) {
    matchKey = match.key;
    highLightedText = _highLightSearchResultsHelper(
      tab[matchKey].replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      match.indices);
    new_key = matchKey + '_highlighted';
    tab[new_key] = highLightedText;
  }
}

function _highLightSearchResultsHelper(text, matches) {
  var result = [];
  var pair = matches.shift();
  // Build the formatted string
  for (var i = 0; i < text.length; i++) {
    var char = text.charAt(i);
    if (pair && i == pair[0]) {
      result.push('<b>');
    }
    result.push(char);
    if (pair && i == pair[1]) {
      result.push('</b>');
      pair = matches.shift();
    }
  }
  return result.join('');
}
