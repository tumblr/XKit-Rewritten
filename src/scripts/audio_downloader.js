(function() {
  const process = function() {
    $('audio > source[src]:not(.audio_downloader_done)').each(function() {
      const $source = $(this).addClass('audio_downloader_done');
      const src = $source.attr('src');
      const div = document.createElement('div');
      const downloadButton = document.createElement('button');

      div.className = 'audio_downloader';

      downloadButton.textContent = '(Download)';
      downloadButton.setAttribute('data-src', src);
      downloadButton.onclick = function(event) {
        event.stopPropagation();

        const src = this.getAttribute('data-src');
        const filename = (new URL(src)).pathname.replace('/', '');

        fetch(src)
        .then(response => response.blob())
        .then(blob => {
          const blob_url = window.URL.createObjectURL(blob);
          const download_link = Object.assign(document.createElement('a'), {
            style: { display: 'none' },
            href: blob_url,
            download: filename,
          });

          document.body.appendChild(download_link);
          download_link.click();
          download_link.parentNode.removeChild(download_link);
          window.URL.revokeObjectURL(blob_url);
        })
      };

      div.appendChild(downloadButton);
      $source.parents()[4].appendChild(div);
    });
  }

  const main = async function() {
    const { newPostListener } = await fakeImport('/src/util/mutations.js');
    newPostListener.addListener(process);
    process();
  }

  const clean = async function() {
    const { newPostListener } = await fakeImport('/src/util/mutations.js');
    newPostListener.removeListener(process);
    $('.audio_downloader_done').removeClass('audio_downloader_done');
    $('.audio_downloader').remove();
  }

  const stylesheet = '/src/scripts/audio_downloader.css';

  return { main, clean, stylesheet };
})();