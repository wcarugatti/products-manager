export function extractAllowedFields<T>(fields: string[], object: T): Partial<T> {
  let newObject = {};
  for (const field of fields) {
    if (object.hasOwnProperty(field)) {
      newObject[field] = object[field];
    }
  }
  return newObject;
}
