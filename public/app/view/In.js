Ext.define('invoicing.view.In', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.in',
    store: 'In',
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    _columns: [
        {
            text: '货品编号',
            flex: 1,
            sortable: true,
            dataIndex: 'good_id'
        },
        {
            text: '货品名称',
            flex: 1,
            sortable: true,
            dataIndex: 'name'
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
            header: '单价',
            dataIndex: 'price',
            sortable: false,
            flex: 1,
            xtype: 'numbercolumn',
            format: '0.00',
            editor: {
                xtype: 'numberfield',
                allowBlank: false

            }
        },
        {
            header: '总价',
            sortable: false,
            xtype: 'numbercolumn',
            format: '0.00',
            flex: 1,
            dataIndex: 'total'
        },
        {
            text: '数量',
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
            text: '入库日期',
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
            text: '备注',
            flex: 1,
            sortable: false,
            dataIndex: 'comment'
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
            anchor: '100%',
            fieldLabel: '开始时间',
            name: 'from_date',
            format: 'Y-m-d'
        },
        {
            xtype: 'datefield',
            anchor: '100%',
            fieldLabel: '结束时间',
            name: 'to_date',
            format: 'Y-m-d'
        },
        {
            xtype: 'combo',
            name: 'category',
            typeAhead: true,
            triggerAction: 'all',
            displayField: '_id',
            valueField: '_id',
            store: Ext.create('invoicing.store.Category'),
            fieldLabel: '分类'
        }
    ],
    initComponent: function () {
        this.columns = Ext.clone(this._columns);
        this.tbar = Ext.clone(this._tbar);
        if (window.capability('4-2')) {
            this.cellEditing = new Ext.grid.plugin.CellEditing({
                clicksToEdit: 1
            });
            this.plugins = [this.cellEditing];
            this.tbar.splice(0, 0, {
                text: '货品入库',
                scope: this,
                handler: this.onAddClick
            });
            this.columns.push({
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
            });

        } else {
            this.columns[5].xtype = 'templatecolumn';
            this.columns[5].tpl = '#####';
            this.columns[6].xtype = 'templatecolumn';
            this.columns[6].tpl = '#####';
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
        if (window.capability('5-2')) {
            this.tbar.push({
                text: '删除',
                scope: this,
                handler: this.onDelete
            });
        }
//        this.bbar = Ext.create('Ext.PagingToolbar', {
//            store: this.getStore(),
//            beforePageText: '第',
//            afterPageText: '页 共{0}页'
//        });
        this.callParent();
        this.on('edit', function (editor, e) {
            e.record.set('total', 0);
        });
    },

    onAddClick: function () {
        Ext.create('Ext.window.Window', {title: '入库', modal: true, items: [
            {xtype: 'inpanel', width: 750, height: 500, maximizable: true, source: this.getStore()}
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
    },
    onExport: function () {
        var filename = 'ins.xml';
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


    onDelete: function () {
        var me = this;
//        var mask = new Ext.LoadMask(this, {msg: "正在删除，请稍等..."});
//        me.getStore().addListener('bulkremove', function (store, records, indexes, isMove, eOpts) {
//            mask.hide();
//            console.log('hide')
//        }, this);


        Ext.Msg.show({
            title: '批量删除',
            msg: '确认批量删除?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (buttonId) {
                if (buttonId === 'yes') {

//                    me.getStore().suspendAutoSync();
                    me.getStore().removeAll();
//                    me.getStore().sync({batch: {}, callback: function (batch, options) {
//                        console.log(batch)
//                    }});
//                    me.getStore().resumeAutoSync();
                }
            }
        });

    },
    onQuery: function () {
        var category = this.down('toolbar').down('combo[name=category]').value;
        var from_date = this.down('toolbar').down('datefield[name=from_date]').value;
        var to_date = this.down('toolbar').down('datefield[name=to_date]').value;
        if (to_date) {
            to_date.setHours(23);
            to_date.setMinutes(59);
        }

        var proxy = this.getStore().getProxy();
        proxy.setExtraParam('category', category);
        proxy.setExtraParam('from_date', from_date);
        proxy.setExtraParam('to_date', to_date);
        this.getStore().load();


    }
});