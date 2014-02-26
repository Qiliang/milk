Ext.define('invoicing.view.Users', {
    extend: 'invoicing.view.Panel',
    alias: 'widget.users',
    store: Ext.create('invoicing.store.Users'),

    initComponent: function () {
        this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
        this.plugins = [this.cellEditing];
        Ext.apply(this, {
            columns: [
                {
                    header: '名称',
                    dataIndex: 'name',
                    flex: 1
                },
                {
                    header: '密码',
                    dataIndex: 'password',
                    renderer: function (value) {
                        return '*****';
                    },
                    flex: 1,
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    header: '角色',
                    dataIndex: 'roles',
                    flex: 1,
                    editor: new Ext.form.field.ComboBox({
                        typeAhead: true,
                        triggerAction: 'all',
                        multiSelect: true,
                        store: [
                            ['1-1', '货品信息(浏览)1-1'],
                            ['1-2', '货品信息(编辑)1-2'],
                            ['2-1', '学校信息(浏览)2-1'],
                            ['2-2', '学校信息(编辑)2-2'],
                            ['3-1', '库存(浏览)3-1'],
                            ['3-2', '库存(编辑)3-2'],
                            ['4-1', '入库信息(浏览)4-1'],
                            ['4-2', '入库信息(编辑)4-2'],
                            ['5-1', '出库信息(浏览)5-1'],
                            ['5-2', '出库信息(编辑)5-2'],
                            ['6-1', '库存余额(浏览)6-1'],
                            ['6-2', '库存余额(编辑)6-2'],
                            ['999', '用户管理999']
                        ]
                    })
                },
                {
                    xtype: 'actioncolumn',
                    flex: 1,
                    sortable: false,
                    menuDisabled: true,
                    items: [
                        {
                            icon: '/images/icons/delete.gif',
                            tooltip: 'Delete Plant',
                            scope: this,
                            handler: this.onRemoveClick
                        }
                    ]
                }
            ],
            selModel: {
                selType: 'cellmodel'
            },
            tbar: [
                {
                    text: '添加用户',
                    scope: this,
                    handler: this.onAddClick
                }
            ]
        });

        this.callParent();
        this.getStore().load();

    },

    onAddClick: function () {
        Ext.create('Ext.window.Window', {title: '新增用户', modal: true, items: [
            {xtype: 'register', store: this.getStore()}
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