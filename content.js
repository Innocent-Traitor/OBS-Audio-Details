let contentConfig = {}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.getInfo) {
        console.log(extConfig.prefix, "Gathering video info");
        getTitle();
        getAuthor();
    } else if (message.setConfig) {
        extConfig = message.payload;
        console.log(extConfig.prefix, 'Config loaded...');
    }
});

function getTitle() {
    const gotTitle = $('#title h1').text();

    if (!gotTitle) {
        console.log(extConfig.prefix, 'NO TITLE FOUND');
        send({
            gotError: true,
            payload: 'NO TITLE FOUND'
        })
        return;
    }

    send({
        updateTitle: true,
        payload: gotTitle
    });
}

function getAuthor() {
    const gotAuthor = $('yt-formatted-string.ytd-channel-name > a').text();

    if (!gotAuthor) {
        console.log(extConfig.prefix, 'NO AUTHOR FOUND');
        send({
            gotError: true,
            payload: 'No Author Found'
        })
        return;
    }

    send({
        updateAuthor: true,
        payload: gotAuthor
    });
}

async function send(message) {
    const response = await chrome.runtime.sendMessage(message);
    // Optional: do something with response
}