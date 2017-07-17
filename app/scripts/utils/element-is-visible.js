export default function elementIsVisible(element) {
  return !!(element.offsetWidth || element.offsetHeight);
}
