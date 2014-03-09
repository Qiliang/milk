Ext.define('invoicing.model.Depot', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'proxy_id',
        {name: 'proxy_name', persist: false},
        'matching',
        'clientId'
    ],
    idProperty: 'clientId'
});