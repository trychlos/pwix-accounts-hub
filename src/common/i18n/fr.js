/*
 * pwix:accounts-hub/src/common/i18n/fr.js
 */

AccountsHub.i18n = {
    ...AccountsHub.i18n,
    ...{
        fr: {
            checks: {
                email_empty: 'L\'adresse de messagerie n\'est pas renseignée',
                email_exists: 'L\'adresse de messagerie existe déjà',
                email_invalid: 'L\'adresse de messagerie est invalide',
                password_empty: 'Le mot de passe n\'est pas renseigné',
                password_short: 'Le mot de passe est trop court (mini=%s)',
                password_weak: 'Le mot de passe est trop faible (score=%s, mini=%s)',
                username_empty: 'Le nom d\'utilisateur n\'est pas renseigné',
                username_exists: 'Le nom d\'utilisateur existe déjà',
                username_short: 'Le nom d\'utilisateur est trop court (mini=%s)'
            },
            dialogs: {
                accounts_select_dialog_title: 'Choisissez un ou plusieurs comptes utilisateur',
                accounts_select_ph: 'Selectionnez les comptes souhaités'
            }
        }
    }
};
