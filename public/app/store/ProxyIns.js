Ext.define('invoicing.store.ProxyIns', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: false,
    model: 'invoicing.model.ProxyIn',
    sorters: [
        {
            property: 'create_at',
            direction: 'DESC'
        }
    ],
    proxy: {
        type: 'rest',
        url: '/proxyins'
    }
});
