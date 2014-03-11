Ext.define('invoicing.model.Good', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'spec',
        'unit',
        'category',
        'price',
        {name: 'count', persist: false},
        {name: 'comment', persist: false},
        {name: 'modifier', type: 'string'},
        {name: 'createAt', type: 'date'},
        {name: 'text', type: 'string', persist: false, convert: function (value, record) {
            var id = record.get('id');
            var name = record.get('name');
            return id + '(' + name + ')';
        }}
    ],

    idProperty: 'createAt'
});