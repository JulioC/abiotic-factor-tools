type CleanedObject<T> = T extends Array<infer U>
  ? Array<CleanedObject<U>>
  : T extends object
  ? {
      [K in keyof T as K extends string ? CleanedKey<K> : K]: CleanedObject<
        T[K]
      >;
    }
  : T;

export function cleanObjectKeys<T>(obj: T): CleanedObject<T> {
  if (Array.isArray(obj)) {
    return obj.map((item: unknown) => {
      if (typeof item === 'object' && item !== null) {
        return cleanObjectKeys(item);
      }
      return item;
    }) as CleanedObject<T>;
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanedKey = cleanKey(key);

      if (typeof value === 'object' && value !== null) {
        acc[cleanedKey] = cleanObjectKeys(value);
      } else {
        acc[cleanedKey] = value;
      }
      return acc;
    }, {} as Record<string, unknown>) as CleanedObject<T>;
  }

  return obj as CleanedObject<T>;
}

type CleanedKey<T extends string> =
  T extends `${infer Base}_${number}_${string}` ? Base : T;
function cleanKey<T extends string>(key: T): CleanedKey<T> {
  return key.replace(/(_\d+_[A-F0-9]{32}(?:\[\d+\])?)$/, '') as CleanedKey<T>;
}
