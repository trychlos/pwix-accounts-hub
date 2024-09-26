/*
 * pwix:accounts-hub/src/common/js/startup.js
 */

// at startup, instanciates a default ahClass instance for the standard 'users' collection
Meteor.startup(() => {
    if( !Object.keys( AccountsHub.instances ).length ){
        new AccountsHub.ahClass();
    }
});
