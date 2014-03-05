Ext.define('invoicing.view.Depot', {
    extend: 'invoicing.view.Panel',
    alias: 'widget.depot',
    store: Ext.create('invoicing.store.Depots'),
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    _columns: [
        {
            text: '分仓编号',
            flex: 1,
            sortable: false,
            dataIndex: 'id'
        },
        {
            text: '分仓名称',
            flex: 1,
            sortable: false,
            dataIndex: 'name',
            editor: {
                allowBlank: false
            }
        },
        {
            text: '学校编号匹配',
            flex: 1,
            sortable: false,
            dataIndex: 'matching',
            editor: {
                allowBlank: false
            }
        },
        {
            text: '送货人',
            flex: 1,
            sortable: false,
            dataIndex: 'proxy_name'
        }
    ],

    initComponent: function () {
        this.columns = Ext.clone(this._columns);
        this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
        this.plugins = [this.cellEditing];
        this.tbar = [
            {
                text: '新增分仓',
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

        this.callParent();
        this.getStore().load();
    },

    onAddClick: function () {
        Ext.create('Ext.window.Window', {title: '新增分仓', modal: true, items: [
            {xtype: 'depotdetail', store: this.getStore()}
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