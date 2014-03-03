Ext.define('invoicing.model.Depot', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'proxy_id',
        'proxy_name',
        'matching',
        'clientId'
    ],
    idProperty: 'clientId'
});