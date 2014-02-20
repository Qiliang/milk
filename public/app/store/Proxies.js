Ext.define('invoicing.store.Proxies', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: true,
    model: 'invoicing.model.Proxy',
    proxy: {
        type: 'rest',
        url: '/proxies'
    }
});
