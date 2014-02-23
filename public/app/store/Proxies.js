Ext.define('invoicing.store.Proxies', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: false,
    model: 'invoicing.model.Proxy',
    proxy: {
        type: 'rest',
        url: '/proxies'
    }
});
