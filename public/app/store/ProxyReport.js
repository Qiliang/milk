Ext.define('invoicing.store.ProxyReport', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    groupField: 'proxy_name',
    fields: [
        'proxy_name',
        'shop_name',
        'count',
        'amount',
        'in_amount'
    ], proxy: {
        type: 'rest',
        url: '/proxyreport'
    }

});
