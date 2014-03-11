Ext.application({
    name: 'invoicing',
    appFolder: 'app',
    models: window.ext_models,
    stores: window.ext_stores,
    controllers: ['Main'],


    launch: function () {

        var grid = Ext.create('Ext.grid.Panel', {
//            cellEditing: new Ext.grid.plugin.CellEditing({
//                clicksToEdit: 1
//            }),
            plugins: [new Ext.grid.plugin.CellEditing({
                clicksToEdit: 1
            })],
            store: Ext.create('invoicing.store.Goods', {autoLoad: true}),
            columnLines: true,
            border: 5,
            columns: [
                {
                    header: '品项',
                    dataIndex: 'name',
                    flex: 2
                },
                {
                    header: '规格',
                    dataIndex: 'spec',
                    flex: 1
                },
                {
                    header: '单位',
                    dataIndex: 'unit',
                    flex: 1
                },
                {
                    header: '订货量',
                    dataIndex: 'count',
                    flex: 1,
                    editor: {
                        xtype: 'numberfield'
                    }
                },
                {
                    header: '实际收货',
                    flex: 1
                },
                {
                    header: '备注',
                    dataIndex: 'comment',
                    flex: 1
                }
            ],
            tbar: [
                {
                    fieldLabel: '学校名称',
                    flex: 1,
                    labelWidth: 70,
                    xtype: 'combo',
                    fieldStyle: 'border: 0px !important;',
                    displayField: 'name',
                    store: Ext.create('invoicing.store.Shop')
                },
                {
                    fieldLabel: '送货人',
                    labelWidth: 70,
                    flex: 1,
                    xtype: 'combo',
                    fieldStyle: 'border: 0px !important;',
                    displayField: 'name',
                    store: Ext.create('invoicing.store.Proxies')
                },
                {
                    xtype: 'datefield',
                    flex: 1,
                    labelWidth: 70,
                    fieldStyle: 'border: 0px !important;',
                    fieldLabel: '日期',
                    value: new Date(),
                    format: 'Y-m-d'
                }
            ],
            header: {
                title: '<h1>牛奶送货单</h1>',
                titleAlign: 'center'
            },

            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    defaults: {
                        flex: 1,
                        xtype: 'displayfield'
                    },
                    items: [
                        {
                            fieldLabel: '发货人签字<br/>日期'
                        },
                        {
                            fieldLabel: '送货人签字<br/>日期'
                        },
                        {
                            fieldLabel: '收货人签字<br/>日期'
                        },
                        {
                            xtype: 'button',
                            text: '打印',
                            handler: function () {
                                var me = this;
                                var task = new Ext.util.DelayedTask(function () {
                                    me.show();
                                });

                                this.hide();

                                window.print();
                                //this.show();
                                task.delay(1000);
                            }
                        }

                    ]
                }
            ]



        });


        Ext.create('Ext.container.Viewport', {
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            bodyBorder: false,
            items: [
                grid,
                {
                    border: 0,
                    html: '注：如和订货量有差异，请在店铺实际收货栏填写实际收货量。此表格需接货人确认后签字。'
                }
            ]

        });

        $('.x-form-trigger-wrap').removeClass();
    }
})
;