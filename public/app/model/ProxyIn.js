Ext.define('invoicing.model.ProxyIn', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'money', type: 'float'},
        {name: 'proxy_name', persist: false},
        {name: 'shop_name', persist: false}
    ],
    idgen: 'sequential',
    idProperty: 'id'
});