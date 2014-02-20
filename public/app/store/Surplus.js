Ext.define('invoicing.store.Surplus', {
    extend: 'Ext.data.ArrayStore',
    autoLoad: false,
    fields: [
        'id',
        'name',
        'unit', 'begin_count', 'out_count', 'total_count', 'total_price'
    ]

});
