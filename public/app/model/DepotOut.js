Ext.define('invoicing.model.DepotOut', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'good_id',
        'proxy',
        {name: 'proxy_name', persist: false},
        {name: 'depot_name', persist: false},
        {name: 'modifier', type: 'string'},
        {name: 'name', persist: false},
        {name: 'spec', persist: false},
        {name: 'unit', persist: false},
        {name: 'category', persist: false},
        'shop_name',
        {name: 'supplement', type: 'int'},
        'comment',
        {name: 'count'},
        {name: 'depot_id', defaultValue: '0'},
        {name: 'create_at', type: 'date', defaultValue: new Date()}
    ]

});