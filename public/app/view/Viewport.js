Ext.define('invoicing.view.Viewport', {
    extend: 'Ext.container.Viewport',
    xtype:'top',
    layout: 'border',
    bodyBorder: false,
    defaults: {
        collapsible: true,
        split: true,
        bodyPadding: 15
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
            collapsible: false,
            region: 'center',
            margins: '5 0 0 0',
            xtype: 'tabpanel',
            activeTab: 0, // index or id
            items: [
                {
                    title: '主页',
                    html: '进销存管理系统'
                }
            ]
        }
    ],

    initComponent: function () {
        this.callParent(arguments);
        this.down('treemenu').setTitle(Ext.util.Cookies.get('name'));
    }
});

