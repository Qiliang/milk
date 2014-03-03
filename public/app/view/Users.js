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
                        forceSelection:true,
                        store: [
                            ['0001', '管理员'],
                            ['0002', '普通用户']
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
                            tooltip: '删除',
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
        if (me.getStore().getAt(rowIndex).get('name') === "admin") {
            Ext.Msg.alert('消息', '不能删除系统用户');
        }else{
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
    }
})