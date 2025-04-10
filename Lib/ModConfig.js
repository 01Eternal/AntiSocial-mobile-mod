export class ModConfig {
    
    static MakeFolder = (pathFolder) => !tl.directory.exists(`${pathFolder}`) ? tl.directory.create(`${pathFolder}`) : tl.log(`this path ${pathFolder} has exists!`)

    /**
     * Saves a JavaScript object to a file in JSON format.
     *
     * @param {string} path - The file path where the config should be saved.
     * @param {object} object - The object to be saved.
     * @returns {object} - The saved object.
     */
    static Save = (path, object) => tl.file.write(`${path}`, JSON.stringify(object, null, 4));

    /**
     * Loads a JSON file and parses it into an object.
     *
     * @param {string} path - The path of the file to load.
     * @returns {object|undefined} - The parsed object if successful, or undefined if the file doesn't exist.
     */
    static Load = path => {
        if (tl.file.exists(`${path}`)) {
            return JSON.parse(tl.file.read(`${path}`));
        }
        return tl.log(`${path} cannot be loaded!`);
    };
}
