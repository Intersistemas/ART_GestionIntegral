export function camelCaseKeys<Out = any>(o: any): Out {
  if (typeof o !== "object" || !o) return o;
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [
    k.charAt(0).toLowerCase() + k.slice(1),
    camelCaseKeys(v)
  ])) as Out;
}

/**
 * Selecciona de `source` propiedades presentes en `select`
 * @param source Objeto desde el que obtener las propiedades
 * @param select Propiedades a obtener de `source`
 * @param keep Mantener propiedades presentes en `select`
 */
export function pick(source: any, select: any, keep = false) {
	if (select == null) return Array.isArray(source) ? [] : {};
  const type = typeof select;
	if (type === "function") return pick(source, select(), keep);
	const keys = type === "object"
    ? Array.isArray(select) ? select : Object.keys(select)
    : [["number", "symbol"].includes(type) ? select : `${select}`];
  return Array.isArray(source)
    ? keep && keys.length ? load(new Array(Math.max(...keys) + 1)) : load([])
    : load({});
  function load(d: any): any {
    keys.filter(k =>  keep || k in source).forEach(k => d[k] = source[k]);
    return d;
  }
};

export function parseNumber<T = any>(value: T) {
  if (value == null) return undefined;
  const result = Number(value);
  return isNaN(result) ? undefined : result;
}

export type TryParseNumberParam<T = any> = { in: T, out?: number };
export function tryParseNumber<T = any>(param: TryParseNumberParam<T>) {
  const result = parseNumber(param.in);
  if (result === undefined) return false;
  param.out = result;
  return true;
}
