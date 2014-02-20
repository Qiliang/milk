Ext.define('invoicing.store.Stock', {
    extend: 'Ext.data.ArrayStore',
    autoLoad: true,
    fields: [
        'id',
        'name',
        'unit', 'begin_count', 'out_count', 'in_count', 'total_count', 'total_price'
    ]

});
