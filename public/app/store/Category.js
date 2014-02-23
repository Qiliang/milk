Ext.define('invoicing.store.Category', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    fields: [ '_id'],
    proxy: {
        type: 'rest',
        url: '/category'
    }
});