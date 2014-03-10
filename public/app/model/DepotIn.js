Ext.define('invoicing.model.DepotIn', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'good_id',
        {name: 'modifier', type: 'string'},
        {name: 'name', persist: false},
        {name: 'depot_name', persist: false},
        {name: 'spec', persist: false},
        {name: 'unit', persist: false},
        {name: 'category', persist: false},
        'comment',
        {name: 'count', type: 'int'},
        {name: 'good_price', type: 'int', persist: false},
        {name: 'expiry', type: 'int'},
        'depot_id',
        {name: 'remainder', type: 'int'},
        {name: 'price', type: 'float'},
        {name: 'total', type: 'float', persist: false, convert: function (value, record) {
            var price = record.get('good_price');
            var count = record.get('count');
            return Ext.util.Format.number(price * count, '0.00')
        }},
        {name: 'create_at', type: 'date', defaultValue: new Date()}

    ]

});