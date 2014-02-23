Ext.define('invoicing.store.Goods', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: false,
    model: 'invoicing.model.Good',

    proxy: {
        type: 'rest',
        url: '/goods'
    }
});
