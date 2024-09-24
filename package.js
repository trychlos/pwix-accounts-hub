Package.describe({
    name: 'pwix:accounts-hub',
    version: '1.0.0-rc',
    summary: 'Accounts management base',
    git: 'https://github.com/trychlos/pwix-accounts-hub',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'AccountsHub'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
    api.mainModule( 'src/server/js/index.js', 'server' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwix:accounts-hub' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    api.versionsFrom([ '2.9.0', '3.0.0' ]);
    api.use( 'accounts-base' );
    api.use( 'check' );
    api.use( 'ecmascript' );
    api.use( 'mongo' );
    api.use( 'pwix:i18n@1.5.0' );
    api.use( 'reactive-var' );
    api.use( 'tmeasday:check-npm-versions@1.0.2 || 2.0.0-beta.0', 'server' );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies
