Ext.define('invoicing.model.Shop', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'address'
    ],
    idgen: 'sequential',
    idProperty: 'id'
});