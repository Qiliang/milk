Ext.define('invoicing.view.DepotIn', {
    extend: 'invoicing.view.Panel',
    alias: 'widget.depotin',
    store: Ext.create('invoicing.store.DepotIn'),
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    _columns: [
        {
            text: '货品名称',
            flex: 1,
            sortable: true,
            dataIndex: 'name'
        },
        {
            text: '分仓名称',
            flex: 1,
            sortable: true,
            dataIndex: 'depot_name'
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
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 1,
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
                text: '分仓入库',
                scope: this,
                handler: this.onAddClick
            });
//            this.tbar.push({
//                text: '删除',
//                scope: this,
//                handler: this.onDelete
//            });

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
        } else if (window.capability('0003')) {
            this.tbar.splice(0, 0, {
                text: '分仓入库',
                scope: this,
                handler: this.onAddClick
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

    onAddClick: function () {
        var me = this;
        var win = Ext.create('invoicing.view.Window', {title: '分仓出库', items: [
            {xtype: 'depotinpanel'}
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
        if (to_date) {
            to_date.setHours(23);
            to_date.setMinutes(59);
        }
        var proxy = this.getStore().getProxy();
        proxy.setExtraParam('proxy', proxy);
        proxy.setExtraParam('from_date', from_date);
        proxy.setExtraParam('to_date', to_date);
        this.getStore().load();

    }


})
;