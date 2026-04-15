export default function deepMerge(target, source) {
    if (source === undefined) return target;
    if (source === null) return null;
    if (typeof source !== 'object' || Array.isArray(source)) return source;
    if (typeof target !== 'object' || Array.isArray(target) || target === null) return source;

    const result = { ...target };
    for (const key of Object.keys(source)) {
        result[key] = deepMerge(target[key], source[key]);
    }
    return result;
}
