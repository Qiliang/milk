Ext.define('invoicing.store.Out', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: false,
    remoteSort: true,
    model: 'invoicing.model.Out',
    sorters: [
        {
            property: 'create_at',
            direction: 'DESC'
        }
    ],
    proxy: {
        batchActions:true,
        type: 'rest',
        url: '/outs',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});
