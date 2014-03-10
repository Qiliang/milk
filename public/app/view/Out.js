Ext.define('invoicing.view.Out', {
    extend: 'invoicing.view.Panel',
    alias: 'widget.out',
    store: Ext.create('invoicing.store.Out'),
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    features: [
        {ftype: 'summary'}
    ],
    _columns: [
        {
            text: '货品名称',
            flex: 1,
            sortable: true,
            dataIndex: 'name',
            summaryType: 'count',
            summaryRenderer: function (value, summaryData, dataIndex) {
                return Ext.String.format('{0} 项总计', value);
            }
        },
        {
            text: '学校名称',
            flex: 1,
            sortable: false,
            dataIndex: 'shop_name',
            editor: new Ext.form.field.ComboBox({
                allowBlank: false,
                typeAhead: true,
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'name',
                forceSelection: true,
                store: Ext.create('invoicing.store.Shop')
            })
        },
        {
            text: '送货人',
            flex: 1,
            sortable: true,
            dataIndex: 'proxy_name'

        },
        {
            text: '规格',
            flex: 1,
            sortable: false,
            dataIndex: 'spec'
        },
        {
            text: '单位',
            flex: 1,
            sortable: false,
            dataIndex: 'unit'
        },
        {
            text: '货品数量',
            flex: 1,
            sortable: false,
            dataIndex: 'count',
            summaryType: 'sum',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 0.01,
                maxValue: 100000
            }
        },
        {
            text: '出库时间',
            flex: 1,
            dataIndex: 'create_at',
            xtype: 'datecolumn',
            format: 'Y-m-d',
            editor: {
                xtype: 'datefield',
                format: 'Y-m-d',
                allowBlank: false
            }
        },
        {
            text: '送货类型',
            flex: 1,
            sortable: false,
            xtype: 'booleancolumn',
            dataIndex: 'supplement',
            renderer: function (value) {
                if (value === 0) return '正常';
                if (value === 1) return '补损';
                if (value === 2) return  '赠送';
            }
        },
        {
            header: '修改人',
            dataIndex: 'modifier',
            flex: 1
        }
    ],
    _tbar: [
        {
            xtype: 'datefield',
            flex: 1,
            fieldLabel: '开始时间',
            name: 'from_date',
            format: 'Y-m-d'
        },
        {
            xtype: 'datefield',
            flex: 1,
            fieldLabel: '结束时间',
            name: 'to_date',
            format: 'Y-m-d'
        },
        {
            fieldLabel: '学校名称',
            flex: 1,
            name: 'shop',
            xtype: 'combo',
            typeAhead: true,
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'name',
            store: Ext.create('invoicing.store.Shop')
        },
        {
            xtype: 'combo',
            flex: 1,
            name: 'proxy',
            typeAhead: true,
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'id',
            store: Ext.create('invoicing.store.Proxies'),
            fieldLabel: '送货人'
        }
    ],
    initComponent: function () {
        this.columns = Ext.clone(this._columns);
        this.tbar = Ext.clone(this._tbar);
        if (window.capability('0001') || window.capability('0004')) {
            this.cellEditing = new Ext.grid.plugin.CellEditing({
                clicksToEdit: 1
            });
            this.plugins = [this.cellEditing];
            this.tbar.splice(0, 0, {
                text: '总仓出库',
                scope: this,
                handler: this.onToProxy
            });

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
//            this.tbar.push({
//                text: '删除',
//                scope: this,
//                handler: this.onDelete
//            });
        } else if (window.capability('0003')) {
            this.tbar.splice(0, 0, {
                text: '总仓出库',
                scope: this,
                handler: this.onToProxy
            });
        }
        this.tbar.push({
            text: '查询',
            scope: this,
            handler: this.onQuery
        });
        this.tbar.push({
            text: '导出',
            scope: this,
            handler: this.onExport
        });


        this.callParent();
    },

    onToProxy: function () {
        var me = this;
        var win = Ext.create('invoicing.view.Window', {title: '总仓出库', items: [
            {xtype: 'outpanel'}
        ]
        });
        win.show();

    },

    onToDepot: function () {
        var me = this;
        var win = Ext.create('invoicing.view.Window', {title: '总仓到分仓', items: [
            {xtype: 'outtodepot'}
        ]
        });
        win.show();

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

    },
    onDelete: function () {
        var me = this;
        Ext.Msg.show({
            title: '批量删除',
            msg: '确认批量删除?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (buttonId) {
                if (buttonId === 'yes') {
                    me.getStore().removeAll();
                }
            }
        });

    },
    onExport: function () {
        var filename = 'outs.xml';
        var data = Ext.ux.exporter.Exporter.exportGrid(this, 'excel', 'aaa');
        Ext.Ajax.request({
            url: 'download',
            params: {
                filename: filename,
                data: data
            },
            success: function () {
                var ifrm = document.getElementById('downloadFrame');
                ifrm.src = 'download?filename=' + filename;
            }
        });
    },
    onQuery: function () {
        var proxy = this.down('toolbar').down('combo[name=proxy]').value;
        var from_date = this.down('toolbar').down('datefield[name=from_date]').value;
        var to_date = this.down('toolbar').down('datefield[name=to_date]').value;
        var shop = this.down('toolbar').down('combo[name=shop]').value;
        if (to_date) {
            to_date.setHours(23);
            to_date.setMinutes(59);
        }
        var proxy = this.getStore().getProxy();
        proxy.setExtraParam('proxy', proxy);
        proxy.setExtraParam('shop', shop);
        proxy.setExtraParam('from_date', from_date);
        proxy.setExtraParam('to_date', to_date);
        this.getStore().load();

    }


})
;