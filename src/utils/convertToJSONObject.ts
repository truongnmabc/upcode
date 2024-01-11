export default function convertToJSONObject(model: any) {
    return JSON.parse(JSON.stringify(model));
}
