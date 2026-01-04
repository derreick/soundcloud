const { contextBridge, ipcRenderer } = require('electron');

function getTrackData() {
  const titleEl = document.querySelector('.playbackSoundBadge__titleLink');
  const artistEl = document.querySelector('.playbackSoundBadge__lightLink');
  const artworkEl = document.querySelector('.playbackSoundBadge__avatar span');

  if (!titleEl || !artistEl) return null;

  const title = titleEl.innerText.trim();
  const artist = artistEl.innerText.trim();
  const url = titleEl.href;

  let thumbnail = null;
  if (artworkEl) {
    const bg = artworkEl.style.backgroundImage;
    if (bg) {
      thumbnail = bg.slice(5, -2).replace('50x50', '500x500');
    }
  }

  return {
    title: `${artist} - ${title}`,
    url,
    thumbnail: thumbnail || 'soundcloud'
  };
}

setInterval(() => {
  const isPlaying =
    document
      .querySelector('.playControls__play')
      ?.classList.contains('playing');

  if (!isPlaying) {
    ipcRenderer.send('sc:searching');
    return;
  }

  const track = getTrackData();
  if (track) {
    ipcRenderer.send('sc:listening', track);
  }
}, 3000);

contextBridge.exposeInMainWorld('soundcloud', {});
