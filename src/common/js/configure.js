/*
 * pwix:accounts-hub/src/common/js/config.js
 */

import _ from 'lodash';

import { acOptions } from '../classes/ac_options.class.js';

AccountsHub._conf = {};
AccountsHub._opts = null;

/**
 * @summary Package configuration
 *  Should be called *in same terms* both by the client and the server
 * @locus Anywhere
 * @param {Object} o the configuration options
 * @returns {Object} the package configuration
 */
AccountsHub.configure = function( o ){
    if( o && _.isObject( o )){
        _.merge( AccountsHub._conf, AccountsHub._defaults.conf, o );
        AccountsHub._opts.base_set( AccountsHub._conf );
        _verbose( AccountsHub.C.Verbose.CONFIGURE, 'pwix:accounts-hub configure() with', o );
    }
    // also acts as a getter
    return AccountsHub._conf;
};

/**
 * @summarry Runtime configuration getter
 * @locus Anywhere
 * @returns {acOptions} the runtime configuration object
 */
AccountsHub.opts = function(){
    return AccountsHub._opts;
};

_.merge( AccountsHub._conf, AccountsHub._defaults.conf );
AccountsHub._opts = new acOptions( AccountsHub._conf );
