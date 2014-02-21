Ext.define('invoicing.model.ProxyIn', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'money', type: 'float'},
        {name: 'proxy_id'},
        {name: 'shop_id'},
        {name: 'good_id'},
        {name: 'create_at', type: 'date', persist: false},
        {name: 'proxy_name', persist: false},
        {name: 'good_name', persist: false},
        {name: 'shop_name', persist: false}
    ],
    idProperty: 'id'
});