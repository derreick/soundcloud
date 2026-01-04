module.exports = function listening(rpc, music) {
  const now = Date.now();
  const startTimestamp = now - (music.currentTime * 1000);
  const endTimestamp = startTimestamp + (music.duration * 1000);

  rpc.setActivity({
    details: `Listening ${music.title}`,
    state: 'SoundCloud',
    largeImageKey: music.thumbnail,
    largeImageText: music.title,
    startTimestamp: Math.floor(startTimestamp),
    endTimestamp: Math.floor(endTimestamp),
    buttons: [
      {
        label: 'Listen on SoundCloud',
        url: music.url
      },
      {
        label: 'Repository',
        url: 'https://github.com/derreick/soundcloud'
      }
    ]
  });
};