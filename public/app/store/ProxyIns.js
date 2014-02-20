Ext.define('invoicing.store.ProxyIns', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: true,
    model: 'invoicing.model.ProxyIn',
    proxy: {
        type: 'rest',
        url: '/proxies'
    }
});
