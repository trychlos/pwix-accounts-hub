/*
 * pwix:accounts-hub/src/server/js/methods.js
 */

Meteor.methods({
    // find a user by one of his/her email addresses
    async 'AccountsHub.byEmailAddress'( instanceName, email, options ){
        return AccountsHub.s.byEmailAddress( instanceName, email, options );
    },

    // find a user by his internal (mongo) identifier
    async 'AccountsHub.byId'( instanceName, id, options ){
        return AccountsHub.s.byId( instanceName, id, options );
    },

    // find a user by his/her username
    async 'AccountsHub.byUsername'( instanceName, username, options ){
        return AccountsHub.s.byUsername( instanceName, username, options );
    }
});
