$(document).ready(function() {
  const regExp = /\(([^)]+)\)/;
  const dateRegExp = /[0-9]{2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{2}/g;
  const dateRegExpExact = /([0-9]{2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{2})/g;

  // add title class around title, then replace the b tag with a div
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
      txt.textContent = `Composer: ${stringedMatch}`;
      if (altText.includes("alt title")) {
        $(`#${i}`).after(
          `<div class="alt-title">Alt Title: ${altText.replace(
            "alt title: ",
            ""
          )}</div>`
        );
      } else if (altText.includes("[instrumental]")) {
        $(`#${i}`).after(`<div class="instrumental">instrumental</div>`);
      } else if (altText.includes("[from film")) {
        $(`#${i}`).after(
          `<div class="from-film">From Film: ${altText
            .replace("[", "")
            .replace("]", "")
            .replace("from film ", "")}</div>`
        );
      } else if (altText.includes("[from musical")) {
        $(`#${i}`).after(
          `<div class="from-musical">From Musical: ${altText
            .replace("[", "")
            .replace("]", "")
            .replace("from musical ", "")}</div>`
        );
      } else if (altText.includes("[tribute to")) {
        $(`#${i}`).after(
          `<div class="tribute-to">Tribute to: ${altText
            .replace("[", "")
            .replace("]", "")
            .replace("tribute to ", "")}</div>`
        );
      }

      if (altTitleAndInstrumentalText.includes("[instrumental]")) {
        $(`#${i}`).after(`<div class="instrumental">instrumental again</div>`);
      }
      publisherTxt &&
        $(`#${i}`).after(
          `<div class="publisher">Publisher: ${publisherTxt}</div>`
        );
      publishedDate &&
        $(`#${i}`).after(
          `<div class="published-date">Published Date: ${publishedDate}</div>`
        );
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

    //working on method to separate albums into an array
    const artistAlbumsDateMatch = artistAlbums.innerText.match(dateRegExpExact);
    console.log(artistAlbumsDateMatch);
    let previousIndex = 0;
    const returnedAlbumsArray = [];

    const returnedAlbums =
      artistAlbumsDateMatch &&
      artistAlbumsDateMatch.forEach(function(date, i) {
        const currentIndex = artistAlbums.innerText.indexOf(date, 0);
        console.log(
          `previous index is ${previousIndex}. Current index is ${currentIndex}`
        );
        if (i > 1) {
          console.log(
            artistAlbums.innerText.slice(previousIndex, currentIndex)
          );
          previousIndex = currentIndex;
          debugger;
        } else if (i === 0) {
          const nextIndex = artistAlbums.innerText.indexOf(
            artistAlbumsDateMatch[i + 1],
            0
          );
          console.log(artistAlbums.innerText.slice(currentIndex, nextIndex));
          previousIndex = nextIndex;
          debugger;
        } else if (i === 1) {
          const nextIndex = artistAlbums.innerText.indexOf(
            artistAlbumsDateMatch[i + 1],
            0
          );
          console.log(artistAlbums.innerText.slice(currentIndex, nextIndex));
          // previousIndex = currentIndex;
          debugger;
        }
      });

    $(artistAndRecordingInfo).remove();
    recordingInfoTextArry.forEach(element => {
      // console.log(element);
      if (element.includes("recorded")) {
        if (element.match(dateRegExp)) {
          $(obj).prepend(
            `<div class="recording-completed">Recording Completed: ${
              element.match(dateRegExp)[0]
            }</div>`
          );
        }
        $(obj).prepend(
          `<div class="recording-location">Recording Location: ${element
            .replace("recorded ", "")
            .replace(", completed ", "")
            .replace(dateRegExp, "")}</div>`
        );
      } else if (element.includes("produced")) {
        $(obj).prepend(
          `<div class="producer">Producer: ${element.replace(
            "produced by ",
            ""
          )}</div>`
        );
      } else if (element.includes("arranged")) {
        $(obj).prepend(
          `<div class="arranger">Arranged By: ${element.replace(
            "arranged by ",
            ""
          )}</div>`
        );
      } else {
        $(obj).prepend(
          `<div class="recording-additional-info">Additional Info: ${element
            .replace("[", "")
            .replace("]", "")}</div>`
        );
      }
    });
    artistName &&
      $(obj).prepend(
        `<div class="artist-name">Artist Name: ${artistName}</div>`
      );
  });
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
