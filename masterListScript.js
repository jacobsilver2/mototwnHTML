$(document).ready(function() {
  const songArray = [];
  $(".song").each((key, song) => {
    const songObj = {};
    // title object (including composer, publisher, published-date, alt-title, instrumental
    const titleObj = {};
    const artistObj = {};
    const title = $(song).find(".title");
    const composer = $(song).find(".composer");
    const publisher = $(song).find(".publisher");
    const publishedDate = $(song).find(".published-date");
    const altTitle = $(song).find(".alt-title");
    const instrumental = $(song).find(".instrumental");

    composer[0] && Object.assign(titleObj, { composer: composer[0].innerText });
    title[0] && Object.assign(titleObj, { title: title[0].innerText });
    publisher[0] &&
      Object.assign(titleObj, { publisher: publisher[0].innerText });
    publishedDate[0] &&
      Object.assign(titleObj, { publishedDate: publishedDate[0].innerText });
    altTitle[0] && Object.assign(titleObj, { altTitle: altTitle[0].innerText });
    instrumental[0] &&
      Object.assign(titleObj, { instrumental: instrumental[0].innerText });

    songObj.title = titleObj;

    $(song)
      .find(".artist")
      .each((key, artist) => {
        const artistName = $(artist).find(".artist-name");
        artistName[0] &&
          Object.assign(artistObj, { artistName: artistName[0].innerText });

        songObj.artist = artistObj;
      });

    songArray.push(songObj);
  });
  console.log(songArray);
});
