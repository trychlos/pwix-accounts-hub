/*
 * pwix:accounts-hub/src/common/classes/ah-class.class.js
 *
 * This class manages an account entity.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { ahOptions } from './ah-options.class.js';

export class ahClass {

    // static data
    //

    // private data
    //
    #args = null;
    #opts = null;

    // private functions
    //

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
        // check that the name exists and is unique
        assert( args.name, 'expects name be set, got '+args.name );
        assert( _.isString( args.name ), 'expects name be a string, got '+args.name );
        assert( !AccountsHub.instance[args.name], 'expects name be unique but already exists '+args.name );
        this.#args = args;
        this.#opts = new ahOptions( args );

        // at the end only, register this instance
        AccountsHub.instance[args.name] = this;
        return this;
    }

    /**
     * Getter
     * @returns {String} the name of this instance
     */
    name(){
        return this.#args.name;
    }
}
