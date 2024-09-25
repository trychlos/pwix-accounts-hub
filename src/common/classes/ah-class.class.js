/*
 * pwix:accounts-hub/src/common/classes/ah-class.class.js
 *
 * This class manages an account entity.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Mongo } from 'meteor/mongo';

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
        this.#args = args;
        this.#opts = new ahOptions( args );

        // if the name is already instanciated, then just return it
        if( AccountsHub.instances[this.name()] ){
            return AccountsHub.instances[this.name()];
        }

        // define the Mongo collection
        if( this.#opts().collection() === 'users' ){
            this.#collection = Meteor.users;
        } else {
            this.#collection = new Mongo.Collection( this.#opts().collection());
        }

        // at the end only, register this new instance
        AccountsHub.instances[this.name()] = this;
        return this;
    }

    /**
     * Getter
     * @returns {String} the name of this instance
     */
    name(){
        return this.#opts().name();
    }

    /**
     * Getter
     * @returns {ahOptions} the instanciation options
     */
    opts(){
        return this.#opts;
    }
}
