Ext.define('invoicing.model.Proxy', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'credit'
    ],
    idgen: 'sequential',
    idProperty: 'id'
});