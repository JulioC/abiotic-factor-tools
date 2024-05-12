import _ from 'lodash';

export async function mapValuesAsync<T, E>(
  dict: _.Dictionary<T>,
  iteratee: (val: T, key: string) => Promise<E>
): Promise<_.Dictionary<E>> {
  return _.fromPairs(
    await Promise.all(
      _.toPairs(dict).map(async ([k, v]) => {
        return [k, await iteratee(v, k)];
      })
    )
  );
}
