export default function buildAttributes(config) {
    return Object.entries(config)
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
            const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const attrValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            const escapedValue = attrValue.replace(/"/g, '&quot;');
            return `${attrName}="${escapedValue}"`;
        })
        .join(' ');
}
