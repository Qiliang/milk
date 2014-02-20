Ext.define('invoicing.store.In', {
    extend: 'Ext.data.Store',
    autoSync: true,
    autoLoad: false,
    remoteSort: true,
    model: 'invoicing.model.In',
    sorters: [
        {
            property: 'create_at',
            direction: 'DESC'
        }
    ],
    proxy: {
        batchActions:true,
        type: 'rest',
        url: '/ins',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});
