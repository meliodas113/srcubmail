let scrapeEmails = document.getElementById('scrape-emails');
let list = document.getElementById('email-list');
let clipBtn = document.getElementById('clipboard-btn');

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  list.textContent = "";
  let emails = request.emails;
  if (emails == null || emails.length == 0) {
    const li = document.createElement('li');
    li.innerHTML = 'No emails found.';
    list.appendChild(li);
  } else {
    emails.filter(onlyUnique).forEach((element) => {
      const li = document.createElement('li');
      li.innerHTML = element;
      list.appendChild(li);
    });
    clipBtn.style.display = "flex";
  }
});

scrapeEmails.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeEmailsFromPage,
  });
});

function scrapeEmailsFromPage() {
  const emailRegEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  let emails = document.body.innerHTML.match(emailRegEx);
  chrome.runtime.sendMessage({ emails });
}

clipBtn.addEventListener('click', () => {
  const emailRegEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  let emails = document.body.innerHTML.match(emailRegEx);
  const ta = document.createElement('textarea');
  ta.style.cssText =
    'opacity:0; position:fixed; width:1px; height:1px; top:0; left:0;';
  ta.value = emails.filter(onlyUnique).join(",");
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand('copy');
  ta.remove();
  document.getElementById("message-text").style.display = "block";
  setTimeout(()=>{
    document.getElementById("message-text").style.display = "none"; 
  },2000)
});
