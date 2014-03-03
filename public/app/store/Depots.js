Ext.define('invoicing.store.Depots', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: false,
    model: 'invoicing.model.Depot',
    proxy: {
        type: 'rest',
        url: '/depots'
    }
});
