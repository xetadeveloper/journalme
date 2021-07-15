/** To remove null or undefined values from an object */
export function removeNull(obj) {
  for (let property in obj) {
    if (!obj[property]) {
      delete obj[property];
    }
  }
  return obj;
}
