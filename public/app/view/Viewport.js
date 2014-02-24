Ext.define('invoicing.view.Viewport', {
    extend: 'Ext.container.Viewport',
    xtype: 'top',
    layout: 'border',
    bodyBorder: false,
    defaults: {
        collapsible: true,
        split: true,
        bodyPadding: 0
    },
    items: [
        {
            xtype: 'treemenu',
            title: '',
            region: 'west',
            floatable: false,
            margins: '5 0 0 0',
            width: 225,
            minWidth: 100,
            maxWidth: 350
        },
        {
            xtype: 'panel',
            region: 'center',
            header: false,
            layout: 'fit',
            id: 'contentPanel'
        }
    ],

    initComponent: function () {
        this.callParent(arguments);
        this.down('treemenu').setTitle(Ext.util.Cookies.get('name'));
    }
});

