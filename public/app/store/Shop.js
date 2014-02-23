Ext.define('invoicing.store.Shop', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: false,
    model: 'invoicing.model.Shop',
    proxy: {
        type: 'rest',
        url: '/shops'
    }
});
