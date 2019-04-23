interface GetOptions {
    target?: {
        USER: "USER",
        MACHINE: "MACHINE"
    },
    expandedForm?: {
        YES: "FULL",
        NO: "SHORT"
    },
    name: string
}

interface GetReturnValues   {
    name: string,
    value: string
}

interface SetOptions {
    target?: {
        USER: "USER",
        MACHINE: "MACHINE"
    },
    setOperationType? : {
        NEW: "NEW",
        APPEND: "APPEND"
    },
    name: string,
    value: string
}

interface DelOptions {
    target?: {
        USER: "USER",
        MACHINE: "MACHINE"
    },
    name: string,
    value: string
}

interface ExtOptions {
    target?: {
        USER: "USER",
        MACHINE: "MACHINE"
    },
    extOperationType : {
        BROKEN: "BROKEN",
        DUPLICATES: "DUPLICATES",
        OPTIMIZE: "OPTIMIZE"
    },
    name: string
}

declare module 'windows-environment' {

    /**
     * The main class which acts as the core of module
     * containing 4 static functions for managing Windows Environment Variable
     *
     * @public
     * @class
     */
    const Env : {

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
        get(options?: GetOptions | object) : GetReturnValues[] | object[];

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
        set(options?: SetOptions | object) : number;

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
        del(options?: DelOptions | object) : number;

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
        ext(options?: ExtOptions | object) : string;
    };

    /**
     * A scope enumeration of Target Constants
     *
     * @public
     * @const
     * @returns {string} Returns `Environment Variable Target (USER or MACHINE)`.
     */
    const Target : {
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
    const ExpandedForm : {
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
    const SetOperationType : {
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
    const ExtOperationType : {
        BROKEN: "BROKEN",
        DUPLICATES: "DUPLICATES",
        OPTIMIZE: "OPTIMIZE"
    };
}