/*
 * pwix:accounts-hub/src/common/js/trace.js
 */

_verbose = function( level ){
    if( AccountsHub.configure().verbosity & level ){
        let args = [ ...arguments ];
        args.shift();
        console.debug( ...args );
    }
};

_trace = function( functionName ){
    _verbose( AccountsHub.C.Verbose.FUNCTIONS, ...arguments );
};
