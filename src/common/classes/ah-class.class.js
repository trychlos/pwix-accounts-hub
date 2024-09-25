/*
 * pwix:accounts-hub/src/common/classes/ah-class.class.js
 *
 * This class manages an account entity.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import emailValidator from 'email-validator';
import zxcvbn from 'zxcvbn';

import { Mongo } from 'meteor/mongo';
import { pwixI18n } from 'meteor/pwix:i18n';

import { ahOptions } from './ah-options.class.js';

export class ahClass {

    // static data
    //

    // private data
    //
    #args = null;
    #opts = null;

    // runtime
    //

    // the mongo collection
    #collection = null;

    // private methods
    //

    /*
     * @summary: check that the proposed candidate email address is valid, and not already exists
     */
    async _checkEmailAddress( email, opts={} ){
        let result = {
            ok: true,
            reason: undefined,
            errors: [],
            countOk: 0,
            countNotOk: 0,
            canonical: ( email ? email.trim() : '' ).toLowerCase()
        };
        // check if the email address is set
        const _checkSet = async function(){
            if( opts.testEmpty !== false ){
                if( result.canonical ){
                    result.countOk += 1;
                } else {
                    result.ok = false;
                    result.reason = 'email_empty';
                    result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
                    result.countNotOk += 1;
                }
            }
        };
        await _checkSet();
        if( !result.ok ){
            return result;
        }
        // check for an email valid syntax
        const _checkSyntax = async function(){
            if( opts.testValid !== false ){
                if( emailValidator.validate( result.canonical )){
                    result.countOk += 1;
                } else {
                    result.ok = false;
                    result.reason = 'email_invalid';
                    result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
                    result.countNotOk += 1;
                }
            }
        };
        await _checkSyntax();
        if( !result.ok ){
            return result;
        }
        // check if the email address already exists
        const _checkExists = async function(){
            if( opts.testExists !== false ){
                result.ok = Boolean( await this.byEmailAddress( result.canonical ));
            }
        };
        if( await _checkExists()){
            result.ok = false;
            result.reason = 'email_exists';
            result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
            result.countNotOk += 1;
        } else {
            result.countOk += 1;
        }
        return result;
    }

    /*
        * @summary: check that the proposed candidate password is valid
        */
    async _checkPassword( password, opts={} ){
        let result = {
            ok: true,
            reason: undefined,
            errors: [],
            countOk: 0,
            countNotOk: 0,
            minScore: -1,
            zxcvbn: null,
            canonical: password || ''
        };
        // first compute min score function of required complexity
        result.minScore = this._checkPasswordComputeMinScore();
        result.zxcvbn = zxcvbn( result.canonical );
        // check if the email address is set
        const _checkSet = async function(){
            if( opts.testEmpty !== false ){
                if( result.canonical ){
                    result.countOk += 1;
                } else {
                    result.ok = false;
                    result.reason = 'password_empty';
                    result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
                    result.countNotOk += 1;
                }
            }
        };
        await _checkSet();
        if( !result.ok ){
            return result;
        }
        // check for minimal length
        const _checkLength = async function(){
            if( opts.testLength !== false ){
                const minLength = AccountsUI.opts().passwordLength();
                if( result.canonical.length < minLength ){
                    result.ok = false;
                    result.reason = 'password_short';
                    result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason, minLength ));
                    result.countNotOk += 1;
                } else {
                    result.countOk += 1;
                }
            }
        };
        await _checkLength();
        if( !result.ok ){
            return result;
        }
        // check for complexity
        const _checkComplexity = async function(){
            if( opts.testComplexity !== false ){
                if( result.zxcvbn.score < result.minScore ){
                    result.ok = false;
                    result.reason = 'password_weak';
                    result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason, result.zxcvbn.score, result.minScore ));
                    result.countNotOk += 1;
                } else {
                    result.countOk += 1;
                }
            }
        };
        await _checkComplexity();
        return result;
    }

    // let the configured password strength be converted into a zxcvbn score
    #scores = [
        AccountsHub.C.Password.VERYWEAK,
        AccountsHub.C.Password.WEAK,
        AccountsHub.C.Password.MEDIUM,
        AccountsHub.C.Password.STRONG,
        AccountsHub.C.Password.VERYSTRONG
    ];

    _checkPasswordComputeMinScore(){
        const strength = this.opts().passwordStrength();
        let minScore = -1;
        for( let i=0 ; i<this.#scores.length && minScore === -1 ; ++i ){
            if( this._scores[i] === strength ){
                minScore = i;
            }
        }
        return minScore;
    }

    /*
        * @summary: check that the proposed candidate username is valid, and not already exists
        */
    async _checkUsername( username, opts={} ){
        let result = {
            ok: true,
            reason: undefined,
            errors: [],
            countOk: 0,
            countNotOk: 0,
            canonical: username ? username.trim() : ''
        };
        // check if the username is set
        const _checkSet = async function(){
            if( opts.testEmpty !== false ){
                if( result.canonical ){
                    result.countOk += 1;
                } else {
                    result.ok = false;
                    result.reason = 'username_empty';
                    result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
                    result.countNotOk += 1;
                }
            }
        };
        await _checkSet();
        if( !result.ok ){
            return result;
        }
        // check for minimal length
        const _checkLength = async function(){
            if( opts.testLength !== false ){
                const minLength = this.opts().usernameLength();
                if( result.canonical.length < minLength ){
                    result.ok = false;
                    result.reason = 'username_short';
                    result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason, minLength ));
                    result.countNotOk += 1;
                } else {
                    result.countOk += 1;
                }
            }
        };
        await _checkLength();
        if( !result.ok ){
            return result;
        }
        // check if the username already exists
        const _checkExists = async function(){
            if( opts.testExists !== false ){
                result.ok = Boolean( await this.byUsername( result.canonical ));
            }
        };
        if( await _checkExists()){
            result.ok = false;
            result.reason = 'username_exists';
            result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
            result.countNotOk += 1;
        } else {
            result.countOk += 1;
        }
        return result;
    }

    /*
     * @summary returns the preferred label for the user
     * @locus Anywhere
     * @param {Object} user the user document got from the database
     * @param {String} preferred an optional preference, either AccountsHub.C.PreferredLabel.USERNAME or AccountsHub.C.PreferredLabel.EMAIL_ADDRESS,
     *  defaulting to the configured value.
     * @param {Object} the result object to be updated
     * @returns: {Object}
     */
    _preferredLabelByDoc = function( user, preferred, result ){
        _trace( 'ahClass._preferredLabelByDoc()', arguments );
        // make reasonably sure we have a user document
        if( user && _.isObject( user ) && user._id && _.isString( user._id )){
            let mypref = preferred;
            if( !mypref || !Object.keys( AccountsHub.C.PreferredLabel ).includes( mypref )){
                mypref = AccountsHub.opts().preferredLabel();
            }
            if( mypref === AccountsHub.C.PreferredLabel.USERNAME && user.username ){
                result = { label: user.username, origin: AccountsHub.C.PreferredLabel.USERNAME };

            } else if( mypref === AccountsHub.C.PreferredLabel.EMAIL_ADDRESS && user.emails[0].address ){
                result = { label: user.emails[0].address, origin: AccountsHub.C.PreferredLabel.EMAIL_ADDRESS };

            } else if( user.username ){
                _verbose( AccountsHub.C.Verbose.PREFERREDLABEL, 'pwix:accounts-hub fallback to username while preferred is', mypref );
                result = { label: user.username, origin: AccountsHub.C.PreferredLabel.USERNAME };

            } else if( user.emails[0].address ){
                _verbose( AccountsHub.C.Verbose.PREFERREDLABEL, 'pwix:accounts-hub fallback to email address name while preferred is', mypref );
                const words = user.emails[0].address.split( '@' );
                result = { label: words[0], origin: AccountsHub.C.PreferredLabel.EMAIL_ADDRESS };
            }
        }
        return result;
    }

    /*
     * @summary Returns the preferred label for the user
     * @locus Anywhere
     * @param {String} arg the user identifier
     * @param {String} preferred the optional caller preference, may be null
     * @param {Object} the result object
     * @returns {Promise} which eventually resolves to the result object, or null if user has not been found
     */
    async _preferredLabelById( id, preferred, result ){
        _trace( 'ahClass._preferredLabelById()', arguments );
        return this.byId( id )
            .then(( user ) => {
                return user ? AccountsHub._preferredLabelByDoc( user, preferred, result ) : null;
            });
    }

    /*
     * @summary Returns the preferredLabel initial result, or null
     * @locus Anywhere
     * @returns {Object} the initial result
     */
    _preferredLabelInitialResult = function( arg, preferred ){
        _trace( 'ahClass._preferredLabelInitialResult()', arguments );
        if( arg ){
            // if a user identifier is provided
            if( _.isString( arg )){
                return {
                    label: arg,
                    origin: 'ID'
                };
            }
            if( _.isString( arg._id )){
                return {
                    label: arg._id,
                    origin: 'ID'
                };
            }
        }
        return null;
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @param {Object} args the instanciation arguments
     * 
     * The Options base class takes care of managing the known options, either as a value, or as a function which return a value.
     * In some case where the expected value is a string, the base class also can accept an object with 'i18n' key.
     * All options are accepted as long as the corresponding getter/setter method exists in this derived class.
     * 
     * @returns {ahClass}
     */
    constructor( args ){
        _trace( 'ahClass.ahClass()', arguments );
        this.#args = args;
        this.#opts = new ahOptions( args );

        // if the name is already instanciated, then just return it
        if( AccountsHub.instances[this.name()] ){
            return AccountsHub.instances[this.name()];
        }

        // define the Mongo collection
        if( this.opts().collection() === 'users' ){
            this.#collection = Meteor.users;
        } else {
            this.#collection = new Mongo.Collection( this.opts().collection());
        }

        // at the end only, register this new instance
        AccountsHub.instances[this.name()] = this;
        return this;
    }

    /**
     * @locus Anywhere
     * @param {String} email
     * @param {Object} options an optional dictionary of fields to return or exclude
     * @returns {Promise} which will eventually resolve to the cleanup user document, or null
     */
    async byEmailAddress( email, options={} ){
        _trace( 'ahClass.byEmailAddress()', arguments );
        assert( email && _.isString( email ), 'expects email be a string, got '+email );
        assert( !options || _.isObject( options ), 'expects options be an object if set, got ',+options );
        return Meteor.isClient ? await Meteor.callAsync( 'AccountsHub.byEmailAddress', this.collection(), email, options ) : await AccountsHub.s.byEmailAddress( this.collection(), email, options );
    }

    /**
     * @locus Anywhere
     * @param {String} id
     * @param {Object} options an optional dictionary of fields to return or exclude
     * @returns {Promise} which will eventually resolve to the cleanup user document, or null
     */
    async byId( id, options={} ){
        _trace( 'ahClass.byId()', arguments );
        assert( id && _.isString( id ), 'expects id be a string, got '+id );
        assert( !options || _.isObject( options ), 'expects options be an object if set, got ',+options );
        return Meteor.isClient ? await Meteor.callAsync( 'AccountsHub.byId', this.collection(), id, options ) : await AccountsHub.s.byId( this.collection(), id, options );
    }

    /**
     * @locus Anywhere
     * @param {String} username
     * @param {Object} options an optional dictionary of fields to return or exclude
     * @returns {Promise} which will eventually resolve to the cleanup user document, or null
     */
    async byUsername( username, options={} ){
        _trace( 'ahClass.byUsername()', arguments );
        assert( username && _.isString( username ), 'expects email be a string, got '+username );
        assert( !options || _.isObject( options ), 'expects options be an object if set, got ',+options );
        return Meteor.isClient ? await Meteor.callAsync( 'AccountsHub.byUsername', this.collection(), username, options ) : await AccountsHub.s.byUsername( this.collection(), username, options );
    }

    /**
     * @summary: check that the proposed candidate email address is valid, and not already exists
     * @locus Anywhere
     * @param {String} email the email address to be checked
     * @param {Object} opts:
     *  - testSyntax: true|false, defaulting to true (test the syntax, returning an error if empty or bad syntax)
     *  - testExistance: true|false, defaulting to true (test the existance, positionning the flag in result object)
     * @returns {Promise} which resolves to the check result, as:
     *  - ok: true|false
     *  - reason: if not ok, the first reason
     *  - errors: an array of localized error messages
     *  - canonical: trimmed lowercase email address
     */
    async checkEmailAddress( email, opts={} ){
        return await this._checkEmailAddress( email, opts );
    }

    /**
     * @summary: check that the proposed candidate password is valid
     * @locus Anywhere
     * @param {String} password the password to be checked
     * @param {Object} opts:
     *  - testLength: true|false, defaulting to true (test the length vs the globally configured option)
     *  - testComplexity: true|false, defaulting to true (test the complexity)
     * @returns {Object} the check result, as:
     *  - ok: true|false
     *  - reason: if not ok, the first reason
     *  - errors: an array of localized error messages
     *  - minScore: the minimal computed score depending of the required strength
     *  - zxcvbn: the zxcvbn computed result
     *  - canonical: the checked password
     */
    async checkPassword( password, opts={} ){
        return await this._checkPassword( password, opts );
    }

    /**
     * @summary: check that the proposed candidate username is valid, and not already exists
     * @locus Anywhere
     * @param {String} username the username to be checked
     * @param {Object} an option object with:
     *  - testLength: true|false, defaulting to true (test the length vs the globally configured option)
     *  - testExists: true|false, defaulting to true (test the existance, positionning the flag in result object)
     * @returns {Promise} which resolves to the check result, as:
     *  - ok: true|false
     *  - errors: [] an array of localized error messages
     *  - warnings: [] an array of localized warning messages
     *  - username: trimmed username
     */
    async checkUsername( username, opts={} ){
        return await this._checkUsername( username, opts );
    }

    /**
     * Getter
     * @returns {Mongo.Collection} the Mongo collection attached to this instance
     */
    collection(){
        _trace( 'ahClass.collection()', arguments );
        return this.#collection;
    }

    /**
     * Getter
     * @returns {String} the name of this instance
     */
    name(){
        _trace( 'ahClass.name()', arguments );
        return this.opts().name();
    }

    /**
     * Getter
     * @returns {ahOptions} the instanciation options
     */
    opts(){
        _trace( 'ahClass.opts()', arguments );
        return this.#opts;
    }

    /**
     * @summary Returns the preferred label for the user
     * @locus Anywhere
     * @param {String|Object} arg the user identifier or the user document
     * @param {String} preferred the optional caller preference, either AccountsHub.C.PreferredLabel.USERNAME or AccountsHub.C.PreferredLabel.EMAIL_ADDRESS,
     *  defaulting to the value configured at instanciation time
     * @returns {Promise} a Promise which eventually will resolve to an object with following keys:
     *  - label: the computed preferred label
     *  - origin: the origin, which may be 'ID' or AccountsHub.C.PreferredLabel.USERNAME or AccountsHub.C.PreferredLabel.EMAIL_ADDRESS
     */
    async preferredLabel( arg, preferred=null ){
        _trace( 'ahClass.preferredLabel()', arguments );
        let result = this._preferredLabelInitialResult( arg, preferred );
        if( result ){
            // if a user identifier is provided, returns a Promise which resolves to the updated result object
            if( _.isString( arg )){
                return Promise.resolve( result )
                    .then(() => { return AccountsHub._preferredLabelById( arg, preferred || AccountsHub.opts().preferredLabel(), result ); })
                    .then(( res ) => {
                        //console.debug( 'res', res );
                        return res ? res : result;
                    });
            }
            if( _.isString( arg._id )){
                return Promise.resolve( result )
                    .then(() => { return AccountsHub._preferredLabelByDoc( arg, preferred || AccountsHub.opts().preferredLabel(), result ); })
                    .then(( res ) => {
                        //console.debug( res );
                        return res;
                    });
            }
        }
        console.error( 'AccountsHub.preferredLabel() expects at least one argument, none found' );
        return null;
    }
}
