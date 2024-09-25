/*
 * pwix:accounts-hub/src/server/js/methods.js
 */

Meteor.methods({
    // find a user by one of his/her email addresses
    async 'AccountsHub.byEmailAddress'( collection, email, options ){
        return AccountsHub.s.byEmailAddress( collection, email, options );
    },

    // find a user by his internal (mongo) identifier
    async 'AccountsHub.byId'( collection, id, options ){
        return AccountsHub.s.byId( collection, id, options );
    },

    // find a user by his/her username
    async 'AccountsHub.byUsername'( collection, username, options ){
        return AccountsHub.s.byUsername( collection, username, options );
    },

    /*
    // update the named field of the user data
    async 'AccountsHub.update'( id, modifier, options ){
        return AccountsHub.server.update( id, modifier, options );
    }
        */
});
