Ext.define('invoicing.store.DepotIn', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: false,
    remoteSort: true,
    model: 'invoicing.model.DepotIn',
    sorters: [
        {
            property: 'create_at',
            direction: 'DESC'
        }
    ],
    proxy: {
        batchActions: true,
        type: 'rest',
        url: '/depotins',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});
