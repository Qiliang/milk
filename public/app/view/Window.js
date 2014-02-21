Ext.define('invoicing.view.Window', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    modal: true,

    tools: [
        {type: 'maximize',
            itemId: 'maximize',
            handler: function (event, toolEl, owner, tool) {
                var me = tool.up('window')
                me.down('#maximize').hide();
                me.down('#restore').show();
                me.maximize(false);
            }},
        {type: 'restore',
            itemId: 'restore',
            hidden: true,
            handler: function (event, toolEl, owner, tool) {
                var me = tool.up('window')
                me.down('#maximize').show();
                me.down('#restore').hide();
                me.restore(false);
            }}
    ]
})