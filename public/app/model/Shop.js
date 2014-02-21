Ext.define('invoicing.model.Shop', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'address',
        'clientId'

    ],
    //clientIdProperty: 'create_at',
    idProperty: 'clientId'
});