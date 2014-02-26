Ext.define('invoicing.view.Panel', {
    extend: 'Ext.grid.Panel',

    header: {
        titlePosition: 2,
        titleAlign: 'center'
    },
    tools: [
        {
            type: 'refresh',
            tooltip: '刷新',
            handler: function (event, toolEl, owner, tool) {
                if (owner.ownerCt.getStore) {
                    owner.ownerCt.getStore().reload();
                }
            }
        }

    ]
})