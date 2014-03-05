Ext.define('invoicing.store.DepotReport', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    groupField: 'depot_name',
    fields: [
        'depot_name',
        'shop_name',
        'count',
        'amount'
    ], proxy: {
        type: 'rest',
        url: '/depotreport'
    }

});
