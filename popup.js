const updateButton = $('.update-btn');
const extTitle = $('.ext-title');
const extAuthor = $('.ext-author');

const urlRegex = {
    YOUTUBE: /https?:\/\/w{0,3}.?youtube.com/,
}

const extConfig = {
    prefix: 'Audio Details -',
    platform: 'YOUTUBE'
}

updateButton.bind('click', function (e) {
    send({
        getInfo: true
    });
});

$(document).ready(function () {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        const url = tabs[0].url;
        const regexCheck = url.search(urlRegex[extConfig.platform]);
        if (regexCheck === -1) {
            $(extTitle).text('NOT CONNECTED');
            $(extAuthor).text(`TO ${extConfig.platform}`);
        }
    });
    
    send({
        setConfig: true,
        payload: extConfig
    })

});


async function send(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0].id;
        console.log(activeTabId);
        chrome.tabs.sendMessage(activeTabId, message);
      });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.finishedDoingSomething) {
        console.log('Success');
    } else if (message.updateAuthor) {
        extAuthor.text(message.payload);
    } else if (message.updateTitle) {
        extTitle.text(message.payload);
    } else if (message.gotError) {
        console.log(payload);
    }

    // Optional: sendResponse({message: "goodbye"});
});

// Thank you stackoverflow
/**************************************************************************
Functions to inject content.js script
***************************************************************************/
async function getCurrentTab() {
    let queryOptions = { active: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
};

function injectContentScript(tab) {
    const { id, url } = tab;
    chrome.scripting.executeScript(
        {
            target: { tabId: id, allFrames: true },
            files: ['content.js']
        }
    );
};

getCurrentTab().then((tab) => {
    injectContentScript(tab);
});


