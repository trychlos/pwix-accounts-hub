/*
 * pwix:accounts-hub/src/common/js/config.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

let _conf = {};
AccountsHub._conf = new ReactiveVar( _conf );

AccountsHub._defaults = {
    verbosity: AccountsHub.C.Verbose.CONFIGURE
};

/**
 * @summary Get/set the package configuration
 *  Should be called *in same terms* both by the client and the server.
 * @param {Object} o configuration options
 * @returns {Object} the package configuration
 */
AccountsHub.configure = function( o ){
    if( o && _.isObject( o )){
        _conf = AccountsHub._conf.get();
        _.merge( _conf, AccountsHub._defaults, o );
        AccountsHub._conf.set( _conf );
        // be verbose if asked for
        if( _conf.verbosity & AccountsHub.C.Verbose.CONFIGURE ){
            //console.log( 'pwix:accounts-manager configure() with', o, 'building', AccountsList._conf );
            console.log( 'pwix:accounts-HUB configure() with', o );
        }
    }
    // also acts as a getter
    return AccountsHub._conf.get();
}

_.merge( _conf, AccountsHub._defaults );
AccountsHub._conf.set( _conf );
