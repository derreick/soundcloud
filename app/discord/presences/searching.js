module.exports = function searching(rpc) {
    rpc.setActivity({
        details: 'Searching music',
        state: 'SoundCloud',
        largeImageKey: 'soundcloud',
        largeImageText: 'SoundCloud'
    });
};
