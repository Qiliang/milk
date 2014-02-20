Ext.define('invoicing.model.Shop', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'seq',
        'address'
    ],
    idgen: 'sequential',
    idProperty: 'id'
});