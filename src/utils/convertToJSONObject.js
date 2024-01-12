export default function convertToJSONObject(model) {
    return JSON.parse(JSON.stringify(model));
}
