/*
 * pwix:accounts-hub/src/common/js/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

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
    if( idA === null ){
        console.warn( 'unable to get user identifier from', userA );
    }
    if( idB === null ){
        console.warn( 'unable to get user identifier from', userB );
    }
    const res = ( idA === idB );
    return res;
}
