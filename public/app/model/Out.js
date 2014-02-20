Ext.define('invoicing.model.Out', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'good_id',
        'proxy',
        {name: 'modifier', type: 'string'},
        {name: 'name', persist: false},
        {name: 'spec', persist: false},
        {name: 'unit', persist: false},
        {name: 'category', persist: false},
        'shop_name',
        'comment',
        {name: 'count', type: 'int'},
        {name: 'create_at', type: 'date', defaultValue: new Date()}
    ]

});