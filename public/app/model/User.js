Ext.define('invoicing.model.User', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'password',
        'roles'
    ],
    idProperty: 'id'
});