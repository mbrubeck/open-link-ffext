/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Full Screen Mobile Add-on.
 *
 * The Initial Developer of the Original Code is
 * Mozilla Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * * Matt Brubeck <mbrubeck@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the LGPL or the GPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var Cc = Components.classes;
var Ci = Components.interfaces;

Components.utils.import("resource://gre/modules/Services.jsm");

function load(win) {
  let document = win.document;

  let item = document.createElement("richlistitem");
  item.setAttribute("id", "openlink-command");
  item.setAttribute("class", "context-command");
  item.setAttribute("type", "link-openable");
  item.addEventListener("click", function() {
    win.Browser.loadURI(win.ContextHelper.popupState.linkURL);
  }, false);

  let label = document.createElement("label");
  label.setAttribute("value", "Open Link");
  item.appendChild(label);

  let openInNewTab = document.getElementById("context-openinnewtab");
  let commands = document.getElementById("context-commands");
  commands.insertBefore(item, openInNewTab);
}

function unload(win) {
  let item = win.document.getElementById("openlink-command");
  item.parentNode.removeChild(item);
}

var listener = {
  onOpenWindow: function(aWindow) {
    // Wait for the window to finish loading
    let win = aWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                     .getInterface(Ci.nsIDOMWindowInternal);
    win.addEventListener("UIReady", function(aEvent) {
      win.removeEventListener(aEvent.name, arguments.callee, false);
      load(win);
    }, false);
  },

  // Unused:
  onCloseWindow: function(aWindow) { },
  onWindowTitleChange: function(aWindow, aTitle) { }
};

/* Bootstrap Interface */

function startup(aData, aReason) {
  // Load in existing windows.
  let enumerator = Services.wm.getEnumerator("navigator:browser");
  while(enumerator.hasMoreElements()) {
    let win = enumerator.getNext();
    load(win);
  }

  // Load in future windows.
  Services.wm.addListener(listener);
}

function shutdown(aData, aReason) {
  Services.wm.removeListener(listener);
  if (aReason == APP_SHUTDOWN)
    return;

  let enumerator = Services.wm.getEnumerator("navigator:browser");
  while(enumerator.hasMoreElements()) {
    let win = enumerator.getNext();
    unload(win);
  }
}

function install(aData, aReason) {}
function uninstall(aData, aReason) {}
