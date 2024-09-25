/*
 * /imports/client/components/AccountPreferredLabel/AccountPreferredLabel.js
 *
 * A component which asynchronously display the preferred label for the provided user id.
 * 
 * Parms:
 * - ahName: the name of the ahClass instance we are referring to
 * - ahUserId: the user identifer whose preferred label is to be displayed
 */

import { AccountsHub } from 'meteor/pwix:accounts-hub';

import './AccountPreferredLabel.html';

Template.AccountPreferredLabel.onCreated( function(){
    const self = this;

    self.APP = {
        preferredLabel: new ReactiveVar( null )
    };

    // get the preferred label
    self.autorun(() => {
        const name = Template.currentData().ahName;
        if( name ){
            const ahInstance = AccountsHub.instances[name];
            if( ahInstance && ahInstance instanceof AccountsHub.ahClass ){
                const userId = Template.currentData().ahUserId;
                if( userId ){
                    ahInstance.preferredLabel( userId ).then(( res ) => {
                        self.APP.preferredLabel.set( res.label );
                    });
                }
            }
        }
    });
});

Template.AccountPreferredLabel.helpers({
    // display the preferred label
    preferredLabel(){
        return Template.instance().APP.preferredLabel.get();
    }
});
