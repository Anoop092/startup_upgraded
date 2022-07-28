import ImageUrlBuilder from "@sanity/image-url";
import client from "./client";

function urlForThumbnail(source) {
  return ImageUrlBuilder(client).image(source).width(400).height(300).url();
}
function urlFor(source) {
  return ImageUrlBuilder(client).image(source).width(600).url();
}

export { urlForThumbnail, urlFor };
