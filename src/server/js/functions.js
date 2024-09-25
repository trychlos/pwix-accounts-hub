/*
 * pwix:accounts-hub/src/server/js/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';

import { ahOptions } from '../../common/classes/ah-options.class.js';

AccountsHub.s = {
    /*
     * @param {String} the searched email address
     * @param {Object} options an optional dictionary of fields to return or exclude
     * @returns {Promise} which eventually resolves to the cleaned-up user document, or null
     *
     *  As a reminder, see https://v3-docs.meteor.com/api/accounts.html#Meteor-users
     *                 and https://v3-docs.meteor.com/api/accounts.html#passwords
     *                 and https://v3-docs.meteor.com/api/accounts.html#Accounts-findUserByEmail
     *  Each email address can only belong to one user
     *  In other words, an email address can be considered as a user identiier in Meteor ecosystems
     */
    async byEmail( collection, email, options={} ){
        _trace( 'AccountsHub.s.byEmail()', arguments );
        assert( collection && collection instanceof Mongo.Collection, 'expects email be a Mongo.Collection, got '+collection );
        assert( email && _.isString( email ), 'expects email be a string, got '+email );
        assert( options && _.isObject( options ), 'expects options be an object, got ',+options );
        let docs = null;
        let result = null;
        if( collection.name === ahOptions._defaults.name ){
            docs = await Accounts.findUserByEmail( email, options );
            if( docs ){
                docs = [ docs ];
            }
        } else {
            docs = await collection.find( AccountsHub.emailSelector( email ), options ).fetchAsync();
        }
        if( docs && docs.length === 1 && docs[0] ){
            result = AccountsHub.cleanupUserDocument( docs[0] );
        }
        _verbose( AccountsHub.C.Verbose.SERVER, 'pwix:accounts-hub byEmail('+email+')', result );
        return result;
},

    /*
     * @param {String} the user identifier
     * @returns {Promise} which eventually resolves to the user document
     */
    async byId( collection, id, options={} ){
        _trace( 'AccountsHub.s.byId()', arguments );
        assert( collection && collection instanceof Mongo.Collection, 'expects email be a Mongo.Collection, got '+collection );
        assert( id && _.isString( id ), 'expects id be a string, got '+id );
        assert( options && _.isObject( options ), 'expects options be an object, got ',+options );
        let doc = await collection.findOneAsync({ _id: id }, options );
        if( doc ){
            doc = AccountsHub.cleanupUserDocument( doc );
        }
        _verbose( AccountsHub.C.Verbose.SERVER, 'pwix:accounts-hub byId('+id+')', doc );
        return doc;
    },

    /*
     * @param {String} the searched username
     * @param {Object} options an optional dictionary of fields to return or exclude
     * @returns {Promise} which eventually resolves to the user document, or null
     *
     *  As a reminder, see https://v3-docs.meteor.com/api/accounts.html#Accounts-findUserByUsername
     *  Each username can only belong to one user
     *  In other words, a username can be considered as a user identiier in Meteor ecosystems
     */
    async byUsername( collection, username, options={} ){
        _trace( 'AccountsHub.s.byUsername()', arguments );
        assert( collection && collection instanceof Mongo.Collection, 'expects email be a Mongo.Collection, got '+collection );
        assert( username && _.isString( username ), 'expects email be a string, got '+username );
        assert( options && _.isObject( options ), 'expects options be an object, got ',+options );
        let docs = null;
        let result = null;
        if( collection.name === ahOptions._defaults.name ){
            docs = await Accounts.findUserByUsername( username, options );
            if( docs ){
                docs = [ docs ];
            }
        } else {
            docs = await collection.find( AccountsHub.usernameSelector( username ), options ).fetchAsync();
        }
        if( docs && docs.length === 1 && docs[0] ){
            result = AccountsHub.cleanupUserDocument( docs[0] );
        }
        _verbose( AccountsHub.C.Verbose.SERVER, 'pwix:accounts-hub byUsername('+username+')', result );
        return result;
    },

    /**
     * update user document with provided values
     *  do not update updatedAt/updatedBy values as this is considered as pure user settings
     * @throws {Error} when user not found
     */
    /*
    async update( id, modifier, options ){
        check( id, String );
        check( modifier, Object );
        if( id && _.isString( id )){
            return Meteor.users.updateAsync({ _id: id }, modifier, options )
                .then(( res ) => {
                    _verbose( AccountsHub.C.Verbose.SERVERDB, 'pwix:accounts-hub writeData('+id+')', res );
                    return res;
                });
        } else {
            // either a code error or a user try to bypass our checks
            throw new Meteor.Error( 'arg', 'incorrect argument' );
        }
    }
        */
};
