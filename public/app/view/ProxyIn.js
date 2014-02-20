Ext.define('invoicing.view.ProxyIn', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.proxyin',
    store: 'ProxyIns',
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    _columns: [
        {
            text: '送货人',
            flex: 1,
            sortable: false,
            dataIndex: 'proxy_name'
        },
        {
            text: '学校名称',
            flex: 1,
            sortable: false,
            dataIndex: 'shop_name'
        },
        {
            text: '货品名称',
            flex: 1,
            sortable: false,
            dataIndex: 'good_name'
        },
        {
            text: '入账日期',
            flex: 1,
            sortable: false,
            dataIndex: 'create_at'
        },
        {
            text: '金额',
            flex: 1,
            sortable: false,
            dataIndex: 'money'
        }
    ],

    initComponent: function () {
        this.columns = Ext.clone(this._columns);
        if (window.capability('2-2')) {
            this.tbar = [
                {
                    text: '入账',
                    scope: this,
                    handler: this.onAddClick
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
    },

    onAddClick: function () {
        Ext.create('Ext.window.Window', {title: '入账', modal: true, items: [
            {xtype: 'proxyindetail', store: this.getStore()}
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