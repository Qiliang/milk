Ext.define('invoicing.store.Users', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: true,
    model: 'invoicing.model.User',
    proxy: {
        type: 'rest',
        url: '/users'
    }

});
