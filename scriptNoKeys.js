$(document).ready(function() {
  const regExp = /\(([^)]+)\)/;
  const dateRegExp = /([0-9]{2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{2})|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{2};)|[0-9]{4};/g;
  const dateRegExpAlbum = /([0-9]{2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{2})|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{2};)|[0-9]{4};/g;
  const dateRegExpExact = /([0-9]{2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{2};)|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{2};)|[0-9]{4};|(\[pressing date unknown\])/g;
  const formatRegExp = /(CD|LP|45|MP3)(?: )?(?:\((S|M)\))?:/g;
  const recordLabelRegExp = /Motown|Tamla|Hip-O Select|Flapjack Records Digital Release|Reader's Digest|Brunswick|Soul|Ric Tic|Rare Earth|UMC Digital Release|BMG Victor|Britannia|Spectrum|Gordy|Singing Machine|Sound Of America|Check Mate|Workshop|Real Gone Music|Columbia|End|United Artists|Collectables CD|Golden World|Debutante|Kent|Wingate|DPSM|Shout|Soulmusic|Ace|Stephanye|Checker|Anna|YAN|V\.I\.P\.|Big Break|Sounds Superb|Rhino|Chess|Black Forum|Polydor|Disques Flèche|Edsel|Light In The Attic|Maltese|Ridge|Volkano|Yesteryear|Fresh Sounds|MoJazz|Marton|Natural Resources|Discover America|Chisa|JerryO|ABC|MFP|Harvey|Power|Polygram Special Markets|Stateside|BGO/g;
  // add title class around title, then replace the b tag with a div(this part didn't really work well)
  $("div p:first-child b").addClass("title");
  // const originalTitleElement = $("div p:first-child b");
  // const replacedTitle = replaceTag(originalTitleElement, "div");
  // $("div p:first-child b")
  //   .replaceWith(replacedTitle)
  //   .addClass("title");

  $("div p:first-child b").each(function(i, obj) {
    const replacedTitle = replaceTag(obj, "div");
    $(obj)
      .replaceWith(replacedTitle)
      .addClass("title");
  });

  let markers = document.querySelectorAll(".title"),
    l = markers.length,
    i,
    txt;

  for (i = l - 1; i >= 0; i--) {
    txt = markers[i].nextSibling;

    // now we're looking to see if it has an alt-title, is instrumental, or is from a film
    const altText = markers[i].parentElement.nextElementSibling.innerText;
    const altTitleElement = markers[i].parentElement.nextElementSibling;
    if (
      altText.includes("alt title") ||
      altText.includes("[instrumental]") ||
      altText.includes("[from film") ||
      altText.includes("[from musical") ||
      altText.includes("[tribute to")
    ) {
      $(altTitleElement).remove();
    }

    // now we're looking to see if it's instrumental AND has an alt title.
    // if so, we've already removed the alt-title, so instrumental should be the next sibling
    // we remove it and add it as a child to the title div
    const altTitleAndInstrumentalText =
      markers[i].parentElement.nextElementSibling.innerText;
    const altTitleAndInstrumentalElement =
      markers[i].parentElement.nextElementSibling;
    if (altTitleAndInstrumentalText.includes("[instrumental]")) {
      $(altTitleAndInstrumentalElement).remove();
    }

    $(txt).wrap(`<div class="composer" id=${i} />`);
    const jText = $(txt).text();

    const composerRegexMatch = regExp.exec(jText);

    const publisherTxt = composerRegexMatch
      ? jText
          .replace(composerRegexMatch[1], "")
          .replace("()", "")
          .replace(dateRegExp, "")
          .replace("published ", "")
          .trimLeft()
      : null;

    const publishedDate = composerRegexMatch
      ? jText
          .replace(composerRegexMatch[1], "")
          .replace("()", "")
          .match(dateRegExp)
      : null;

    const stringedMatch = composerRegexMatch
      ? composerRegexMatch[1].replace(/(\r\n|\n|\r)/gm, "")
      : null;
    // change song title to the only text inside composer tag
    // add a sibling class called 'publisher' and put the publisher inside the tag
    if (txt) {
      txt.textContent = `${stringedMatch}`;
      if (altText.includes("alt title")) {
        $(`#${i}`).after(
          `<div class="alt-title">${altText.replace("alt title: ", "")}</div>`
        );
      } else if (altText.includes("[instrumental]")) {
        $(`#${i}`).after(`<div class="instrumental">instrumental</div>`);
      } else if (altText.includes("[from film")) {
        $(`#${i}`).after(
          `<div class="from-film">${altText
            .replace("[", "")
            .replace("]", "")
            .replace("from film ", "")}</div>`
        );
      } else if (altText.includes("[from musical")) {
        $(`#${i}`).after(
          `<div class="from-musical">${altText
            .replace("[", "")
            .replace("]", "")
            .replace("from musical ", "")}</div>`
        );
      } else if (altText.includes("[tribute to")) {
        $(`#${i}`).after(
          `<div class="tribute-to">${altText
            .replace("[", "")
            .replace("]", "")
            .replace("tribute to ", "")}</div>`
        );
      }

      if (altTitleAndInstrumentalText.includes("[instrumental]")) {
        $(`#${i}`).after(`<div class="instrumental">instrumental again</div>`);
      }
      publisherTxt &&
        $(`#${i}`).after(`<div class="publisher">${publisherTxt}</div>`);
      publishedDate &&
        $(`#${i}`).after(`<div class="published-date">${publishedDate}</div>`);
    }
  }

  // now we're going to loop through each song and add an artist tag around each artist-albumSet

  $(".song p b").each(function(i, obj) {
    const par = $(obj).parent();
    const next = $(obj)
      .parent()
      .next();
    // $(par).addClass("artist");
    // $(next).addClass("artist-albums");
    $(par)
      .add(next)
      .wrapAll('<div class="artist" />');
  });

  // now we're going to loop through each artist class and divide it up a bit
  $(".artist").each(function(i, obj) {
    const artistAndRecordingInfo = obj.firstChild;
    const recordingInfoTextArry = obj.firstChild.innerText.split(";");
    // removing the first element. we don't need it.
    recordingInfoTextArry.shift();
    const artistName = obj.firstChild.innerText.split(";")[0];
    const artistAlbums = obj.lastChild;
    // $(artistAlbums).wrapAll('<div class="album" />')
    let artistAlbumsHTML = artistAlbums.innerHTML;
    let artistAlbumsText = artistAlbums.innerText;
    $(artistAlbums).remove();

    //separate albums into an array
    const artistAlbumsDateMatch = artistAlbumsText.match(dateRegExpExact);
    artistAlbumsDateMatch &&
      artistAlbumsDateMatch.forEach(function(date, i) {
        const currentIndex = artistAlbumsText.indexOf(date, 0);
        const nextIndex = artistAlbumsText.indexOf(
          artistAlbumsDateMatch[i + 1],
          currentIndex + 1
        );

        //get the same values for innerHTML
        const currentIndexHTML = artistAlbumsHTML.indexOf(date, 0);
        const nextIndexHTML = artistAlbumsHTML.indexOf(
          artistAlbumsDateMatch[i + 1],
          currentIndex + 1
        );

        let albumInfo;
        let wrapper;
        if (nextIndex != -1) {
          albumInfo = artistAlbumsText.slice(currentIndex, nextIndex);
          wrapper = document.createElement("div");
          $(wrapper).addClass("album");
        } else {
          albumInfo = artistAlbumsText.slice(currentIndex);
          wrapper = document.createElement("div");
          $(wrapper).addClass("album");
        }

        // get the same values for innerHTML
        let albumInfoHTML;
        if (nextIndexHTML != -1) {
          albumInfoHTML = artistAlbumsHTML.slice(
            currentIndexHTML,
            nextIndexHTML
          );
        } else {
          albumInfoHTML = artistAlbumsHTML.slice(currentIndexHTML);
        }

        albumInfo &&
          $(wrapper).append(`<div class="album-info">${albumInfo}</div>`);

        // album name
        const albumName = albumInfoHTML
          .substring(
            albumInfoHTML.lastIndexOf("<i>") + 1,
            albumInfoHTML.lastIndexOf("</i>")
          )
          .replace("i>", "");
        albumName &&
          $(wrapper).append(`<div class="album-name">${albumName}</div>`);
        // catalog #

        const catNum = albumInfoHTML
          .replace(dateRegExpAlbum, "")
          // .replace("; ", "")
          .replace(formatRegExp, "")
          .replace(recordLabelRegExp, "")
          .replace(/<i>.*<\/i>/, "");
        catNum &&
          $(wrapper).append(
            `<div class="album-catalog-number">${catNum}</div>`
          );
        //album date
        const releaseDate = albumInfo.match(dateRegExpAlbum);
        releaseDate &&
          $(wrapper).append(
            `<div class="album-release-date">${releaseDate[0].replace(
              ";",
              ""
            )}</div>`
          );

        //format
        const formatType = albumInfo.match(formatRegExp);
        formatType &&
          $(wrapper).append(
            `<div class="album-format">${formatType[0].replace(":", "")}</div>`
          );
        //record label
        const recordLabel = albumInfo.match(recordLabelRegExp);
        recordLabel &&
          $(wrapper)
            .last()
            .append(`<div class="album-record-label">${recordLabel[0]}</div>`);
        artistAlbumsText = artistAlbumsText.slice(nextIndex);
        $(obj).append(wrapper);
      });

    $(artistAndRecordingInfo).remove();
    recordingInfoTextArry.forEach(element => {
      if (element.includes("recorded")) {
        if (element.match(dateRegExp)) {
          $(obj).prepend(
            `<div class="recording-completed">${
              element.match(dateRegExp)[0]
            }</div>`
          );
        }
        $(obj).prepend(
          `<div class="recording-location">${element
            .replace("recorded ", "")
            .replace(", completed ", "")
            .replace(dateRegExp, "")}</div>`
        );
      } else if (element.includes("produced")) {
        $(obj).prepend(
          `<div class="producer">${element.replace("produced by ", "")}</div>`
        );
      } else if (element.includes("arranged")) {
        $(obj).prepend(
          `<div class="arranger">${element.replace("arranged by ", "")}</div>`
        );
      } else {
        $(obj).prepend(
          `<div class="recording-additional-info">${element
            .replace("[", "")
            .replace("]", "")}</div>`
        );
      }
    });
    artistName &&
      $(obj).prepend(`<div class="artist-name">${artistName}</div>`);
  });
  console.log(document.documentElement.innerHTML);
});

/*
 * replaceTag
 * @return {$object} a new object with replaced opening and closing tag
 */
function replaceTag($element, newTagName) {
  // Identify opening and closing tag
  var oldTagName = $element.nodeName,
    elementString = $element.outerHTML,
    openingRegex = new RegExp("^(<" + oldTagName + " )", "i"),
    openingTag = elementString.match(openingRegex),
    closingRegex = new RegExp("(</" + oldTagName + ">)$", "i"),
    closingTag = elementString.match(closingRegex);

  if (openingTag && closingTag && newTagName) {
    // Remove opening tag
    elementString = elementString.slice(openingTag[0].length);
    // Remove closing tag
    elementString = elementString.slice(0, -closingTag[0].length);
    // Add new tags
    elementString =
      "<" + newTagName + " " + elementString + "</" + newTagName + ">";
  }

  return $(elementString);
}
