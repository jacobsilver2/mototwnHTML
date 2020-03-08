$(document).ready(function() {
  const songArray = [];
  $(".song").each((key, song) => {
    const songObj = {};
    // title object (including composer, publisher, published-date, alt-title, instrumental
    const titleObj = {};
    const artistsArr = [];
    const title = $(song).find(".title");
    const composer = $(song).find(".composer");
    const publisher = $(song).find(".publisher");
    const publishedDate = $(song).find(".published-date");
    const altTitle = $(song).find(".alt-title");
    const instrumental = $(song).find(".instrumental");
    const fromFilm = $(song).find(".from-film");
    const tributeTo = $(song).find(".tribute-to");

    composer[0] && Object.assign(titleObj, { composer: composer[0].innerText });
    title[0] && Object.assign(titleObj, { title: title[0].innerText });
    publisher[0] &&
      Object.assign(titleObj, { publisher: publisher[0].innerText });
    publishedDate[0] &&
      Object.assign(titleObj, { publishedDate: publishedDate[0].innerText });
    altTitle[0] && Object.assign(titleObj, { altTitle: altTitle[0].innerText });
    instrumental[0] &&
      Object.assign(titleObj, { instrumental: instrumental[0].innerText });
    fromFilm[0] && Object.assign(titleObj, { fromFilm: fromFilm[0].innerText });
    tributeTo[0] &&
      Object.assign(titleObj, { tributeTo: tributeTo[0].innerText });

    songObj.song = titleObj;

    $(song)
      .find(".artist")
      .each((key, artist) => {
        const artistObj = {};
        const albumsArr = [];
        const recordingInfoObj = {};
        const artistName = $(artist).find(".artist-name");
        const producer = $(artist).find(".producer");
        const recordingLocation = $(artist).find(".recording-location");
        const recordingCompleted = $(artist).find(".recording-completed");
        const additionalInfo = $(artist).find("recording-additional-info");

        artistName[0] &&
          Object.assign(artistObj, { artistName: artistName[0].innerText });
        producer[0] &&
          Object.assign(recordingInfoObj, { producer: producer[0].innerText });
        recordingLocation[0] &&
          Object.assign(recordingInfoObj, {
            location: recordingLocation[0].innerText
          });
        recordingCompleted[0] &&
          Object.assign(recordingInfoObj, {
            completed: recordingCompleted[0].innerText
          });
        additionalInfo[0] &&
          Object.assign(recordingInfoObj, {
            additionalInfo: additionalInfo[0].innerText
          });
        artistObj.recordingInfo = recordingInfoObj;

        $(artist)
          .find(".album")
          .each((key, album) => {
            const albumObj = {};
            const albumTitle = $(album).find(".album-name");
            const catalogNumber = $(album).find(".album-catalog-number");
            const recordLabel = $(album).find(".album-record-label");
            const format = $(album).find(".album-format");
            const releaseDate = $(album).find(".album-release-date");
            const info = $(album).find(".album-info");

            albumTitle[0] &&
              Object.assign(albumObj, { albumTitle: albumTitle[0].innerText });
            catalogNumber[0] &&
              Object.assign(albumObj, {
                catalogNumber: catalogNumber[0].innerText
              });
            recordLabel[0] &&
              Object.assign(albumObj, {
                recordLabel: recordLabel[0].innerText
              });
            format[0] &&
              Object.assign(albumObj, { format: format[0].innerText });
            releaseDate[0] &&
              Object.assign(albumObj, {
                releaseDate: releaseDate[0].innerText
              });
            info[0] && Object.assign(albumObj, { info: info[0].innerText });
            albumsArr.push(albumObj);
          });
        artistObj.albums = albumsArr;

        artistsArr.push(artistObj);
      });
    songObj.artists = artistsArr;
    songArray.push(songObj);
  });
  console.log(songArray);
});

function downloadObject(obj, filename) {
  var blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json;charset=utf-8"
  }).slice(2, -1);
  var url = URL.createObjectURL(blob);
  var elem = document.createElement("a");
  elem.href = url;
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}
