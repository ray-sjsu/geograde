export function isUriEncoded(value) {
    try {
      return decodeURIComponent(value) !== value;
    } catch (e) {
      return false;
    }
  }
  