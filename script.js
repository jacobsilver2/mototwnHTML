jQuery(document).ready(function() {
  const regExp = /\(([^)]+)\)/;
  const dateRegExp = /[0-9]{2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{2}/g;
  // add title class around title
  jQuery("div p:first-child b").addClass("title");

  let markers = document.querySelectorAll(".title"),
    l = markers.length,
    i,
    txt;

  for (i = l - 1; i >= 0; i--) {
    txt = markers[i].nextSibling;

    // now we're looking to see if it has an alt-title, is instrumental, or is from a film
    const altTitleText = markers[i].parentElement.nextElementSibling.innerText;
    const altTitleElement = markers[i].parentElement.nextElementSibling;
    if (
      altTitleText.includes("alt title") ||
      altTitleText.includes("[instrumental]") ||
      altTitleText.includes("[from film") ||
      altTitleText.includes("[from musical]")
    ) {
      // console.log(altTitleText);
      jQuery(altTitleElement).remove();
    }

    // now we're looking to see if it's instrumental AND has an alt title.
    // if so, we've already removed the alt-title, so instrumental should be the next sibling
    // we remove it and add it as a child to the title div
    const altTitleAndInstrumentalText =
      markers[i].parentElement.nextElementSibling.innerText;
    const altTitleAndInstrumentalElement =
      markers[i].parentElement.nextElementSibling;
    if (altTitleAndInstrumentalText.includes("[instrumental]")) {
      jQuery(altTitleAndInstrumentalElement).remove();
    }

    jQuery(txt).wrap(`<div class="composer" id=${i} />`);
    const jText = jQuery(txt).text();

    const composerRegexMatch = regExp.exec(jText);

    const publisherTxt = composerRegexMatch
      ? jText
          .replace(composerRegexMatch[1], "")
          .replace("()", "")
          .replace(dateRegExp, "")
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
      if (altTitleText.includes("alt title")) {
        jQuery(`#${i}`).after(
          `<div class="alt-title">Alt Title: ${altTitleText.replace(
            "alt title: ",
            ""
          )}</div>`
        );
      } else if (altTitleText.includes("[instrumental]")) {
        jQuery(`#${i}`).after(`<div class="instrumental">instrumental</div>`);
      }
      if (altTitleAndInstrumentalText.includes("[instrumental]")) {
        jQuery(`#${i}`).after(`<div class="instrumental">instrumental</div>`);
      }
      publisherTxt &&
        jQuery(`#${i}`).after(
          `<div class="publisher">Publisher: ${publisherTxt}</div>`
        );
      publishedDate &&
        jQuery(`#${i}`).after(
          `<div class="published-date">Published Date: ${publishedDate}</div>`
        );
    }
  }
});

// VIBE:
// Get text inside parens
// Get text outside parens
// Wrap tags around each item
// place back into DOM
