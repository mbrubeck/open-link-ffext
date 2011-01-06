
function EV_OpenLink() {
  Browser.selectedBrowser.contentDocument.location = ContextHelper.popupState.linkURL;
}
