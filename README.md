# Multipin

A Firefox extension to help you escape the tabs hell and find your way around.

<strong><a href="#">Firefox addons Store</a> | <a href="https://github.com/himanshuc3/multipin/archive/master.zip">Download ZIP</a></strong>

## Features

### Themes

2 themes available __currently__. 

 - Default theme - __Clear Sky__
 
 <p align="center">
    <img src="/repo_images/day.png" width="550">
 </p>
 
 - Theme suitable for less pain on the eyes - __Midnight Blue__
 
 <p align="center">
    <img src="https://github.com/himanshuc3/multipin/tree/master/repo_images/midnight_blue.png" width="550">
 </p>


### Realtime Search functionality

 <p align="center">
    <img src="https://github.com/himanshuc3/multipin/tree/master/repo_images/search.png" width="550">
 </p>

- Search through for open tabs quick and fast.
 
### Make tabs your puppets

 <p align="center">
    <img src="https://github.com/himanshuc3/multipin/tree/master/repo_images/features.png" width="550">
 </p>
 
- __Create Tab__ - Does what you think. Creates a new tab in the current window.
- __First of last__ - Move the current tab to the beginning or last position in the current window.
- __Eliminate Left__ - Delete all tabs to the left of current tab.
- __Eliminate Right__ - Delete all tabs to the right of current tab.
- __Reload All__ - Reload all tabs of current window.
- __Mute All__ - Mute all tabs of current window.
- __Restore Health__ - Not a good name. I know. Anyway, this features helps you restore last closed tab.
- __Sortable__ - Drag and drop list tabs in the addon to move their position.
- __Reload and Delete__ - Individual tab reloading and deletion.

 __NOTE__: Got an idea about about an existing feature? Contact me at himichhabra14@gmail.com.

### Restore Previous Tab session

- __Tab Snapshots let you save all your open tabs so you can close them and open them later.__
- You can take a snapshot of all your windows, or just the currently active one.
- Snapshots are synchronized across all your devices running Chrome and Gibbon Tabs.
- Take a snapshot of...
  - The internal sites you open at work every morning!
  - All the websites you use to procrastinate. Waste lots of time more effectively!
  - The giant hairy ball of tabs you don't want to close, but you sure as hell don't want to take home at the end of the day either. Free your mind!
<!-- - Snapshots are synchronized to your Google profile using [chrome.storage.sync](https://developer.chrome.com/extensions/storage) - I don't have access to your history. All data is stored securely in Google's servers. -->
- The "Overwrite Snapshot" widget lets you modify the contents of snapshots you created in the past.

## Requirements

- Mozilla Firefox.

- Go to the [Mozilla Addons Page](https://addons.mozilla.org/en-US/firefox/) and search for extension.
- __It is highly recommended that you assign a keyboard shortcut to the Multipin extension.__
- Press the shortcut you assigned or click on the extension icon in your browser to activate it.
- __Type to begin searching__. The search box is always highlighted.
- Press <kbd>Enter</kbd> to activate a tab. Or click on it.
- Use the <kbd>Up</kbd> and <kbd>Down</kbd> keys to navigate the tabs list.
- Press <kbd>Shift</kbd>+<kbd>Backspace</kbd> to delete the currently highlighted tab in the tabs list.
  - You can also delete tabs by clicking on the X at the right side of each tab in the list.
- Press <kbd>Ctrl</kbd> while the extension is open to highlight the currently active tab.
  - When you haven't entered a search query the list shows all tabs ordered from left to right and by window. This lets you quickly find neighbouring tabs to the active window.
<!--  
- There are no shortcuts for "Tab Snapshots". Just use it once and you'll learn how it works!
- When you open the "Tab Snapshots" dropdown you will see a list of all the snapshots you have saved.
  - Click on the "x" icon next to a snapshot name to delete it.
  - Click on the pencil icon to overwrite the contents of a snapshot.
    - Through this feature you can add new tabs to snapshots you have created in the past!
-->

## Why do I need this?

_If you suffer from one of the following:_

- Having __dozens of tabs__ open in one or multiple windows.
- Constantly fiddling with keyboard shortcuts to find the tab you need, or worse, using your mouse/trackpad.
- The horrible confusion that ensues when the tab favicons disappear because you have too many open tabs. See below:

<p align="center">
  <img src="https://github.com/himanshuc3/multipin/tree/master/repo_images/tab_hell.png"/>
  <em>Welcome to Tab Hell. You can go safely leave the planet now.</em>
</p>

- Heartache and wrist pain :smile:

## Some technical details

- Fuzzy search library used: [Fuse](https://github.com/krisk/Fuse)
- Sortable
- I wanted to implement this without using any javascript frameworks. It's all pure javascript.
  - Some parts of the code got a bit Sphagetti-ed along the way. I don't have tons of experience with frontend. I learned a lot!
- The CSS is a bit of a hack. I also learned a ton here.
- What was the hardest part of this project? Writing this damn README.
