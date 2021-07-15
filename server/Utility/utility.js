/** To remove null or undefined values from an object */
export function removeNull() {
  for (let property in this) {
    if (!this[property]) {
      delete this[property];
    }
  }
  return this;
}
