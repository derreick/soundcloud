module.exports = function listening(rpc, music) {
    rpc.setActivity({
        details: `Listening ${music.title}`,
        state: 'SoundCloud',
        largeImageKey: music.thumbnail,
        largeImageText: music.title,
        buttons: [
            {
                label: 'Listen on SoundCloud',
                url: music.url
            },
            {
                label: 'Repository',
                url: 'https://github.com/derreick/soundcloud'
            }
        ],
        startTimestamp: Date.now()
    });
};
