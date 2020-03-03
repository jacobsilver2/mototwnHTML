$(document).ready(function() {
  const regExp = /\(([^)]+)\)/;
  const dateRegExp = /[0-9]{2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{2}/g;
  // add title class around title, then replace the b tag with a div

  $("div p:first-child b").addClass("title");
  const originalTitleElement = $("div p:first-child b");
  const replacedTitle = replaceTag(originalTitleElement, "div");
  $("div p:first-child b")
    .replaceWith(replacedTitle)
    .addClass("title");

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
  $(".artist").each(function(i, obj) {
    const artistAndRecordingInfo = obj.firstChild;
    const artistAlbums = obj.lastChild;

    const artistAndRecordingInfoArray = artistAndRecordingInfo.innerText.split(
      ";"
    );
    const recordingInfo = artistAndRecordingInfoArray.filter(el =>
      el.includes("recorded")
    );
    const completedInfo = artistAndRecordingInfoArray.filter(el =>
      el.includes("completed")
    );
    completedInfo[0] && console.log(completedInfo[0].match(dateRegExp));
    // console.log(artistAndRecordingInfoArray);
    $(artistAndRecordingInfo).remove();
    $(obj).append(
      `<div class="artist-name">Artist Name: ${artistAndRecordingInfoArray[0]}</div>`
    );
    recordingInfo[0] &&
      $(obj).append(
        `<div class="studio">Recorded: ${recordingInfo[0]
          .replace("recorded ", "")
          .replace("completed ", "")
          .replace(dateRegExp, "")
          .replace(",", "")}</div>`
      );
    completedInfo[0] &&
      $(obj).append(
        `<div class="completed">Completed: ${completedInfo[0].match(
          dateRegExp
        )}</div>`
      );
  });
});

// now we're going to loop through each artist class and divide it up a bit
/*
 * replaceTag
 * @return {$object} a new object with replaced opening and closing tag
 */
function replaceTag($element, newTagName) {
  // Identify opening and closing tag
  var oldTagName = $element[0].nodeName,
    elementString = $element[0].outerHTML,
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
