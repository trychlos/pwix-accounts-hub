/*
 * pwix:accounts/src/common/classes/ac_options_global_conf.class.js
 *
 * This class manages the global configuration options.
 */

import { Options } from 'meteor/pwix:options';

export class ahOptions extends Options.Base {

    // static data
    //

    static _defaults = {
        haveEmailAddress: AccountsHub.C.Identifier.MANDATORY,
        haveUsername: AccountsHub.C.Identifier.NONE,
        passwordLength: 10,
        passwordStrength: AccountsHub.C.Password.STRONG,
        usernameLength: 6,
        preferredLabel: AccountsHub.C.PreferredLabel.EMAIL_ADDRESS
    };

    // have email address / username
    static Identifiers = [
        AccountsHub.C.Identifier.NONE,
        AccountsHub.C.Identifier.MANDATORY,
        AccountsHub.C.Identifier.OPTIONAL
    ];

    // possible user label
    static Labels = [
        AccountsHub.C.PreferredLabel.USERNAME,
        AccountsHub.C.PreferredLabel.EMAIL_ADDRESS
    ];

    // password strength
    static Strength = [
        AccountsUI.C.Password.VERYWEAK,
        AccountsUI.C.Password.WEAK,
        AccountsUI.C.Password.MEDIUM,
        AccountsUI.C.Password.STRONG,
        AccountsUI.C.Password.VERYSTRONG
    ];

    // private data
    //

    // private functions
    //

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @param {Object} options the options to be managed
     * 
     * The Options base class takes care of managing the known options, either as a value, or as a function which return a value.
     * In some case where the expected value is a string, the base class also can accept an object with 'i18n' key.
     * All options are accepted as long as the corresponding getter/setter method exists in this derived class.
     * 
     * @returns {ahOptions}
     */
    constructor( options ){
        super( options );
        return this;
    }

    /**
     * Getter/Setter
     * @param {String|Function} value whether the application wants an email address
     * @returns {String}
     */
    haveEmailAddress( value ){
        return this.base_gsStringObjectFn( 'haveEmailAddress', value, { default: ahOptions._defaults.haveEmailAddress, ref: ahOptions.Identifiers });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value whether the application wants a username
     * @returns {String}
     */
    haveUsername( value ){
    return this.base_gsStringObjectFn( 'haveUsername', value, { default: ahOptions._defaults.haveUsername, ref: ahOptions.Identifiers });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value required password length
     *  must be greater or equal to zero
     *  default to DEF_PASSWORD_LENGTH
     * @returns {Integer}
     */
    passwordLength( value ){
        return this.base_gsIntegerFn( 'passwordLength', value, { check: ( val ) => { return val >= 0 }, default: ahOptions._defaults.passwordLength });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value required password strength
     * @returns {String}
     */
    passwordStrength( value ){
        return this.base_gsStringFn( 'passwordStrength', value, { default: ahOptions._defaults.passwordStrength, ref: ahOptions.Strength });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value preferred label when displaying a user
     * @returns {String}
     */
    preferredLabel( value ){
        return this.base_gsStringObjectFn( 'preferredLabel', value, { default: ahOptions._defaults.preferredLabel, ref: ahOptions.Labels });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value required username length
     * @returns {Integer}
     */
    usernameLength( value ){
        return this.base_gsIntegerFn( 'usernameLength', value, { check: ( val ) => { return val >= 0 }, default: ahOptions._defaults.usernameLength });
    }
}
