const { contextBridge, ipcRenderer } = require('electron');

function parseTime(timeStr) {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  return (parts[0] * 60) + parts[1];
}

function getTrackData() {
  const titleEl = document.querySelector('.playbackSoundBadge__titleLink');
  const artistEl = document.querySelector('.playbackSoundBadge__lightLink');
  const artworkEl = document.querySelector('.playbackSoundBadge__avatar span');
  const timePassedEl = document.querySelector('.playbackTimeline__timePassed > span:last-child');
  const durationEl = document.querySelector('.playbackTimeline__duration > span:last-child');

  if (!titleEl || !artistEl || !timePassedEl || !durationEl) return null;

  const title = titleEl.innerText.trim();
  const artist = artistEl.innerText.trim();
  const url = titleEl.href;
  const currentTime = parseTime(timePassedEl.innerText);
  const duration = parseTime(durationEl.innerText);

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
    thumbnail: thumbnail || 'soundcloud',
    currentTime,
    duration
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