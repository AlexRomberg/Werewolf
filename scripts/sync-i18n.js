import { readFile, writeFileSync } from "fs";

function sortJson(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sortJson); // Recursively sort array elements
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj)
            .sort()
            .reduce((sortedObj, key) => {
                sortedObj[key] = sortJson(obj[key]); // Recursively sort nested objects
                return sortedObj;
            }, {});
    }
    return obj; // Return values as-is
}

Promise.all([
    new Promise((res, rej) => readFile("../src/locale/messages.json", (err, data) => { if (err) { return rej(); } res(data.toString()) })),
    new Promise((res, rej) => readFile("../src/locale/messages.en.json", (err, data) => { if (err) { return rej(); } res(data.toString()) })),
]).then(([de, en]) => {
    const jsonDe = JSON.parse(de);
    const keysDe = Object.keys(jsonDe.translations);

    const jsonEn = JSON.parse(en);
    const keysEn = Object.keys(jsonEn.translations);

    const missingKeysInEn = keysDe.filter((key) => !keysEn.includes(key));
    const missingKeysInDe = keysEn.filter((key) => !keysDe.includes(key));

    console.log("------------------------------------------------------------");


    for (const key of missingKeysInEn) {
        console.log("Adding key to en:", key);
        jsonEn.translations[key] = jsonDe.translations[key];
    }

    for (const key of missingKeysInDe) {
        console.log("Removing key in en:", key);
        delete jsonEn.translations[key];
    }


    writeFileSync(
        "../src/locale/messages.en.json",
        JSON.stringify(sortJson(jsonEn), null, 2),
        (err) => {
            if (err) {
                console.error("Error writing file:", err);
            }
        }
    );
});