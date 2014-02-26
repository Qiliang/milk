Ext.define('invoicing.view.Goods', {
    extend: 'invoicing.view.Panel',
    alias: 'widget.goods',
    store: Ext.create('invoicing.store.Goods'),

    _columns: [
        {
            header: '编号',
            dataIndex: 'id',
            flex: 1
        },
        {
            header: '名称',
            dataIndex: 'name',
            flex: 1,
            editor: {
                allowBlank: false
            }
        },
        {
            header: '规格',
            dataIndex: 'spec',
            flex: 1,
            editor: {
                allowBlank: false
            }
        },
        {
            header: '单位',
            dataIndex: 'unit',
            flex: 1,
            editor: new Ext.form.field.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                store: ['包', '罐', '袋', '桶', '瓶', '支', '条', '扎', '套', '个', '把', '根', '件']
            })
        },
        {
            header: '默认单价',
            dataIndex: 'price',
            flex: 1,
            editor: {
                xtype: 'numberfield',
                allowBlank: true
            }
        },
        {
            header: '修改人',
            dataIndex: 'modifier',
            flex: 1
        }
    ],

    initComponent: function () {
        this.columns = Ext.clone(this._columns);
        if (window.capability('1-2')) {
            this.cellEditing = new Ext.grid.plugin.CellEditing({
                clicksToEdit: 1
            });
            this.plugins = [this.cellEditing];
            this.tbar = [
                {
                    text: '添加货品',
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
            {xtype: 'gooddetail', store: this.getStore()}
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

})