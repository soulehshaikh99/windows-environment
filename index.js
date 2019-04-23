const { spawnSync } = require('child_process');

/**
 * A scope enumeration of Target Constants
 *
 * @public
 * @const
 * @returns {string} Returns `Environment Variable Target (USER or MACHINE)`.
 */
const Target = {
    USER: "USER",
    MACHINE: "MACHINE"
};

/**
 * A enumeration to decide whether to receive values in long form or not
 * If this is set to no, all the values will be displayed as is.
 * If set to yes then, the values enclosed inside % symbol will take its long form
 * for e.g. %userprofile% will be C:\Users\UserName
 * for e.g. %systemroot% will be C:\Windows
 *
 * @public
 * @const
 * @returns {string} Returns `Expanded Form Value (FULL or SHORT)`.
 */
const ExpandedForm = {
    YES: "FULL",
    NO: "SHORT"
};

/**
 * A enumeration to decide whether to create a new Environment Variable or update an existing one with new value appended to it.
 *
 * @public
 * @const
 * @returns {string} Returns `Set Operation Type (NEW or APPEND)`.
 */
const SetOperationType = {
    NEW: "NEW",
    APPEND: "APPEND"
};

/**
 * A enumeration to decide what kind of operation to be performed on Environment Variable Value.
 *
 * @public
 * @const
 * @returns {string} Returns string if OPTIMIZED option is selected and returns array if BROKEN or DUPLICATES option is selected.
 */
const ExtOperationType = {
    BROKEN: "BROKEN",
    DUPLICATES: "DUPLICATES",
    OPTIMIZE: "OPTIMIZE"
};

function checkForTargetValidity(options) {
    if ('target' in options) {
        switch (options.target) {
            case Target.USER:
                return Target.USER;
            case Target.MACHINE:
                return Target.MACHINE;
            default:
                return Target.USER;
        }
    } else {
        return Target.USER;
    }
}

function checkForExpandedFormValidity(options) {
    if ('expandedForm' in options) {
        switch (options.expandedForm) {
            case ExpandedForm.YES:
                return ExpandedForm.YES;
            case ExpandedForm.NO:
                return ExpandedForm.NO;
            default:
                return ExpandedForm.NO;
        }
    } else {
        return ExpandedForm.NO;
    }
}

function checkForSetOperationTypeValidity(options) {
    if ('setOperationType' in options) {
        switch (options.setOperationType) {
            case SetOperationType.NEW:
                return SetOperationType.NEW;
            case SetOperationType.APPEND:
                return SetOperationType.APPEND;
            default:
                return SetOperationType.APPEND;
        }
    } else {
        return SetOperationType.APPEND;
    }
}

function checkForExtOperationTypeValidity(options) {
    if ('extOperationType' in options) {
        switch (options.extOperationType) {
            case ExtOperationType.BROKEN:
                return ExtOperationType.BROKEN;
            case ExtOperationType.DUPLICATES:
                return ExtOperationType.DUPLICATES;
            case ExtOperationType.OPTIMIZE:
                return ExtOperationType.OPTIMIZE;
            default:
                return ExtOperationType.OPTIMIZE;
        }
    } else {
        return ExtOperationType.OPTIMIZE;
    }
}

/**
 * The main class which acts as the core of module
 * containing 4 static functions for managing Windows Environment Variable
 *
 * @public
 * @class
 */
class Env   {

    /**
     * This function either reads the Environment Variable value by its name
     * and if name is not specified it reads all the Environment Variables
     * under the specified target (User or System).
     *
     * @public
     * @static
     * @function
     * @param {Object} [options={}] The Options object
     * @param {Object} [options.target=Target.USER] Specifies the target to look into (User or System).
     * @param {Object} [options.expandedForm=ExpandedForm.NO] If set to yes then the values enclosed inside % symbol will take its long form for e.g. %userprofile% will be C:\Users\UserName
     * @param {Object} [options.name] It can be any name like JDK, PATH, GH_TOKEN, TEMP, TMP, etc.
     * @return It returns string if name is specified or array if name is not specified
     * @return {Array} [array] returns array of JS Objects containing keys like:
     * name: Name of the environment variable inside specified target.
     * value: Value of the environment variable of that name.
     */
    static get(options)    {
        if (!options) options={};
        let target = checkForTargetValidity(options);
        let expandedForm = checkForExpandedFormValidity(options);
        let command = ('name' in options) ? `${__dirname}\\libs\\get-env.exe ${target} ${expandedForm} "${options.name}"` : `${__dirname}\\libs\\get-env.exe ${target} ${expandedForm}`;
        let child = spawnSync("cmd.exe", ["/c", command], { shell: true });
        if ('name' in options)    {
            return child.stdout.toString().replace(/\r\n/g,'');
        } else {
            let retValue = child.stdout.toString().replace(/\r/g,'');
            let array = retValue.split('\n');
            array.pop();
            let newArray = [];
            for (let arr of array)  {
                let temp = arr.split("=");
                newArray.push({
                    name: temp[0],
                    value: temp[1]
                });
            }
            return newArray;
        }
    }

    /**
     * Requires Admin Privileges (set-env.exe is the program it tries to run)
     * This function creates a new Environment Variable or it updates the existing with the passed value.
     *
     * @public
     * @static
     * @function
     * @param {Object} [options={}] The Options object
     * @param {Object} [options.target=Target.USER] Specifies the target to look into (User or System).
     * @param {Object} [options.setOperationType=SetOperationType.APPEND] If set to SetOperationType.Append it just adds a new value to the existing value and if set to SetOperationType.NEW, a new Environment Variable is created overwriting the existing one if it exists.
     * @param {Object} [options.name] It can be any name like JDK, PATH, GH_TOKEN, TEMP, TMP, etc.
     * @param {Object} [options.value] The value to be appended or set for the Environment Variable.
     * @return {number} the exit code of method execution is returned either 0 (success) or 1 (failure)
     */
    static set(options) {
        if (!options) options={};
        let target = checkForTargetValidity(options);
        let setOperationType = checkForSetOperationTypeValidity(options);
        let name = options.name;
        let value = options.value;
        if(!name || !value) throw new Error("Name and value field are mandatory!");
        value = value.replace(/%/g, '^%');
        if (!value.endsWith(";")) value = value+";";
        let child = spawnSync("cmd.exe", ["/c", `${__dirname}\\libs\\set-env.exe ${target} ${setOperationType} "${name}" "${value}"`], { shell:true });
        return child.status;
    }

    /**
     * Requires Admin Privileges (del-env.exe is the program it tries to run)
     * This function deletes an existing Environment Variable or it deletes a particular value from it.
     *
     * @public
     * @static
     * @function
     * @param {Object} [options={}] The Options object
     * @param {Object} [options.target=Target.USER] Specifies the target to look into (User or System).
     * @param {Object} [options.name] It can be any name like JDK, PATH, GH_TOKEN, TEMP, TMP, etc.
     * @param {Object} [options.value] If the value is specified it deletes only this value from the existing value and if not specified then the entire Environment Variable is deleted
     * @return {number} the exit code of method execution is returned either 0 (success) or 1 (failure)
     */
    static del(options) {
        if (!options) options={};
        let target = checkForTargetValidity(options);
        let name = options.name;
        if(!name) throw new Error("Name field is mandatory!");
        let command = `${__dirname}\\libs\\del-env.exe ${target} "${name}"`;
        if ('value' in options) {
            command = `${__dirname}\\libs\\del-env.exe ${target} "${name}" "${options.value.replace(/%/g, '^%')}"`
        }
        let child = spawnSync("cmd.exe", ["/c", command], { shell: true });
        return child.status;
    }

    /**
     * This function operates on a single Environment Variable at a time.
     * It can be used to find:
     * broken paths: (the path which no longer exits on your File System)
     * duplicate values: duplicate paths are returned
     * optimized value: value which removes any redundancies (duplicate values) and broken paths.
     *
     * @public
     * @static
     * @function
     * @param {Object} [options={}] The Options object
     * @param {Object} [options.target=Target.USER] Specifies the target to look into (User or System).
     * @param {Object} [options.extOperationType=ExtOperationType.OPTIMIZE] the type of operation you want to perform.
     * @param {Object} [options.name] It can be any name like JDK, PATH, GH_TOKEN, TEMP, TMP, etc.
     * @return It returns string if optimize option is specified.
     * @return {Array} [array] broken paths or duplicate paths are returned.
     */
    static ext(options)    {
        if (!options) options={};
        let target = checkForTargetValidity(options);
        let exOperationType = checkForExtOperationTypeValidity(options);
        let name = options.name;
        if(!name) throw new Error("Name field is mandatory!");
        let child = spawnSync("cmd.exe", ["/c", `${__dirname}\\libs\\ext-env.exe ${target} "${name}" ${exOperationType}`], { shell: true });
        if (exOperationType === ExtOperationType.BROKEN || exOperationType === ExtOperationType.DUPLICATES)   {
            let retValue = child.stdout.toString().replace(/\r/g,'');
            let array = retValue.split('\n');
            array.pop();
            return array;
        } else {
            return child.stdout.toString();
        }
    }
}

module.exports = {
    Env,
    Target,
    ExpandedForm,
    SetOperationType,
    ExtOperationType
};
