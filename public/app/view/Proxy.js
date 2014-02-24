Ext.define('invoicing.view.Proxy', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.proxy',
    store: Ext.create('invoicing.store.Proxies'),
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    _columns: [
        {
            text: '送货人名称',
            flex: 1,
            sortable: false,
            dataIndex: 'name',
            editor: {
                allowBlank: false
            }
        },
        {
            text: '信用金额',
            flex: 1,
            sortable: false,
            dataIndex: 'credit',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 1,
                maxValue: 10000000
            }
        },
        {
            text: '已用金额',
            flex: 1,
            sortable: false,
            dataIndex: 'remainder'
        }
    ],

    initComponent: function () {
        this.columns = Ext.clone(this._columns);
        if (window.capability('2-2')) {
            this.tbar = [
                {
                    text: '新增送货人',
                    scope: this,
                    handler: this.onAddClick
                },
                {
                    text: '刷新',
                    scope: this,
                    handler: this.onRefresh
                }
            ];
            this.columns.push({
                xtype: 'actioncolumn',
                flex: 1,
                sortable: false,
                menuDisabled: true,
                items: [
                    {
                        icon: '/images/icons/delete.gif',
                        tooltip: '删除',
                        scope: this,
                        handler: this.onRemoveClick
                    }
                ]
            });
        }
        this.callParent();
        this.getStore().load();
    },

    onRefresh: function () {
        this.getStore().load();
    },

    onAddClick: function () {
        Ext.create('Ext.window.Window', {title: '新增送货人', modal: true, items: [
            {xtype: 'proxydetail', store: this.getStore()}
        ]}).show();
    },
    onRemoveClick: function (grid, rowIndex) {
        var me = this;
        Ext.Msg.show({
            title: '确认删除',
            msg: '确认删除?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (buttonId) {
                if (buttonId === 'yes') {
                    me.getStore().removeAt(rowIndex);
                }
            }
        });
    }
});