'use strict';

const clipboard = require('@cloudcmd/clipboard');

const resolve = Promise.resolve.bind(Promise);
const reject = Promise.reject.bind(Promise);

module.exports = function(cmd) {
    const NAME = 'editor-clipboard';
    const {
        _Ace,
        _story,
    } = this;
    
    const insert = _Ace.insert.bind(_Ace);
    const value = this._Ace.getSelectedText();
    
    if (cmd === 'copy') {
        _story.setData(NAME, value);
        return clipboard.writeText(_Ace.getSelectedText());
    }
    
    if (cmd === 'cut') {
        _story.setData(NAME, value);
        return cut(_story, value) ? resolve() : reject();
    }
    
    return clipboard.readText()
        .then(insert)
        .catch(() => {
            this._showMessageOnce('Could not paste from clipboard. Inner buffer used.');
            const value = _story.getData(NAME);
            insert(value);
        });
};

function cut(story, value) {
    const body = document.body;
    const textarea = document.createElement('textarea');
    
    body.appendChild(textarea);
    
    textarea.value = value;
    textarea.select();
    const result = document.execCommand('cut');
    
    body.removeChild(textarea);
    
    return result;
}

