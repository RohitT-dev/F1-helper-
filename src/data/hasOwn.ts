/** Own-property check. Unlike `in`, it ignores inherited keys such as `constructor`. */
export function hasOwn(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
