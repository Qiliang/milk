Ext.define('invoicing.view.Shop', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.shop',
    store: 'Shop',
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    _columns: [
        {
            text: '学校编号',
            flex: 1,
            sortable: false,
            dataIndex: 'id'
        },
        {
            text: '学校名称',
            flex: 1,
            sortable: false,
            dataIndex: 'name',
            editor: {
                allowBlank: false
            }
        }
    ],

    initComponent: function () {
        this.columns = Ext.clone(this._columns);
        if (window.capability('2-2')) {
            this.tbar = [
                {
                    text: '新增学校',
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
        this.getStore().load();
    },

    onAddClick: function () {
        Ext.create('Ext.window.Window', {title: '新增货品', modal: true, items: [
            {xtype: 'shopdetail', store: this.getStore()}
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