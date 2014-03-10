Ext.define('invoicing.store.DepotOut', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: false,
    remoteSort: true,
    model: 'invoicing.model.DepotOut',
    sorters: [
        {
            property: 'create_at',
            direction: 'DESC'
        }
    ],
    proxy: {
        batchActions:true,
        type: 'rest',
        url: '/depotouts',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});
