/*
 * pwix:accounts-hub/src/common/js/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { ReactiveVar } from 'meteor/reactive-var';

/**
 * @locus Anywhere
 * @param {String|Object} userA
 * @param {String|Object} userB
 * @returns {Boolean} whether userA and userB are same
 */
AccountsHub.areSame = function( userA, userB ){
    _trace( 'AccountsHub.areSame()', arguments );
    const idA = userA ? ( _.isObject( userA ) ? userA._id : ( _.isString( userA ) ? userA : null )) : null;
    const idB = userB ? ( _.isObject( userB ) ? userB._id : ( _.isString( userB ) ? userB : null )) : null;
    let res = true;
    if( idA === null ){
        console.warn( 'unable to get user identifier from', userA );
    }
    if( idB === null ){
        console.warn( 'unable to get user identifier from', userB );
    }
    if( idA && idB ){
        res = ( idA === idB );
    }
    return res;
}

/**
 * @locus Anywhere
 * @param {Object} document
 * @returns {Object} the cleaned-up user document
 *
 * make sure the password, even crypted, is not returned:
 * {
 *     _id: '55QDvyxocA8XBnyTy',
 *     createdAt: 2023-02-08T21:16:56.851Z,
 *     services: { password: {}, email: { verificationTokens: [Array] } },
 *     username: 'cccc',
 *     emails: [ { address: 'cccc@ccc.cc', verified: true } ],
 *     isAllowed: true,
 *     createdBy: 'EqvmJAhNAZTBAECya',
 *     lastConnection: 2023-02-09T13:22:14.057Z,
 *     updatedAt: 2023-02-09T13:25:16.114Z,
 *     updatedBy: 'EqvmJAhNAZTBAECya'
 * }
 */
AccountsHub.cleanupUserDocument = function( user ){
    _trace( 'AccountsHub.cleanupUserDocument()', arguments );
    if( user ){
        if( user.services ){
            delete user.services.resume;
            if( user.services.password ){
                delete user.services.password.bcrypt;
            }
        }
        delete user.profile;
    }
    return user;
}

/**
 * @locus Anywhere
 * @param {String} email the email address to be examined
 * @param {Object} user the (optional) user document
 * @returns {Promise} which eventually will resolve to a true|false Boolean
 * Please note that we do not search in `users` collection if a user document is provided.
 * So the result will be false if the provided user document is not the right one for this email address.
 */
/*
AccountsHub.isEmailVerified = async function( email, user=null ){
    _trace( 'AccountsHub.isEmailVerified()', arguments );
    if( user ){
        return AccountsHub._isEmailVerified( email, user );
    }
    return AccountsHub.byEmailAddress( email )
        .then(( user ) => { return AccountsHub._isEmailVerified( email, user ); });
}
        */

/**
 * @summary Returns the preferred label for the user
 * @locus Anywhere
 * @param {String|Object} arg the user identifier or the user document
 * @param {String} preferred the optional caller preference, either AccountsHub.C.PreferredLabel.USERNAME or AccountsHub.C.PreferredLabel.EMAIL_ADDRESS,
 *  defaulting to the configured value
 * @returns {ReactiveVar} a ReactiveVar initialized with the default result object.
 *  This ReactiveVar will later (and aynchronously) be updated with the actual values.
 *  This is an object with following keys:
 *  - label: the computed preferred label
 *  - origin: the origin, which may be 'ID' or AccountsHub.C.PreferredLabel.USERNAME or AccountsHub.C.PreferredLabel.EMAIL_ADDRESS
 */
/*
AccountsHub.preferredLabelRV = function( arg, preferred=null ){
    _verbose( AccountsHub.C.Verbose.PREFERREDLABEL, 'pwix:accounts-hub preferredLabelRV() arg='+arg, 'preferred='+preferred );
    let rv = new ReactiveVar( AccountsHub._preferredLabelInitialResult( arg, preferred ));
    AccountsHub.preferredLabel( arg, preferred ).then(( res ) => {
        rv.set( res );
    });
    return rv;
};
*/

/**
 * @summary Update an existing user document
 * @locus Anywhere
 * @param {String|Object} user the user identifier or the user document
 * @param {Object} modifier the values to be set as a Mongo modifier
 * @param {Object} options an optional options
 *  see https://v3-docs.meteor.com/api/collections.html#Mongo-Collection-updateAsync
 * @returns {Promise} which eventually resolves to the result
 */
/*
AccountsHub.update = async function( user, modifier, options ){
    const id = _.isString( user ) ? user : user._id;
    let res = null;
    if( id && _.isString( id )){
        if( Meteor.isClient ){
            res = Meteor.callAsync( 'AccountsHub.update', id, modifier, options );
        } else {
            res = AccountsHub.server.update( id, modifier, options );
        }
    } else {
        throw new Meteor.Error( 'arg', 'incorrect argument' );
    }
    return res;
};
*/
