chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create({
    url: 'popup.html',
    type: 'popup',
    width: 400,
    height: 300,
    left: 100,
    top: 100
  });
}); 