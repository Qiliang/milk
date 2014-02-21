Ext.define('invoicing.model.Proxy', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'credit',
        {name: 'remainder', type: 'float', persist: false}
    ],
    idgen: 'sequential',
    idProperty: 'id'
});