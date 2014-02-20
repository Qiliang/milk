Ext.define('invoicing.store.Category', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    fields: [ '_id'],
    proxy: {
        type: 'rest',
        url: '/category'
    }
});