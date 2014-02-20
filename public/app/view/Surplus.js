Ext.define('invoicing.view.Surplus', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.surplus',
    //store: 'Surplus',
    columnLines: true,
    viewConfig: {
        stripeRows: true
    },

    _columns: {
        defaults: {
            flex: 1,
            minWidth: 55,
            sortable: false
        },
        items: [
            {
                text: '编号',
                dataIndex: 'id'
            },
            {
                text: '名称',
                minWidth: 100,
                dataIndex: 'name'
            },
            {
                text: '期初库存',
                columns: [
                    {
                        text: '数量',
                        dataIndex: 'begin_count'
                    },
                    {
                        text: '金额',
                        xtype: 'numbercolumn',
                        format: '0.00',
                        dataIndex: 'begin_price'
                    }
                ]
            },
            {
                text: '到货量',
                columns: [
                    {
                        text: '数量',
                        dataIndex: 'in_count'
                    },
                    {
                        text: '金额',
                        xtype: 'numbercolumn',
                        format: '0.00',
                        dataIndex: 'in_price'
                    }
                ]
            }
        ]
    },


    initComponent: function () {
        this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
        Ext.apply(this, {
            plugins: [this.cellEditing]
        });
        this.createStore();
        this.columns = this._columns;
        if (this.columns.items.length == 4) {
            this.createColumns();
        }

        this.tbar = [
            {
                xtype: 'datefield',
                anchor: '100%',
                fieldLabel: '开始时间',
                name: 'from_date',
                format: 'Y-m-d',
                listeners: {
                    select: function (field, value, eOpts) {
                        field.nextSibling('datefield').minValue = value;
                    }
                }
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
            },
            {
                text: '查询',
                scope: this,
                handler: this.onQuery
            },
            {
                text: '导出',
                scope: this,
                handler: this.onExport
            }
        ];

        if (!window.capability('6-2')) {
            Ext.Array.each(this.columns.items, function (col) {
                if (col.xtype === 'numbercolumn') {
                    col.xtype = 'templatecolumn';
                    col.tpl = '#####';
                }
                Ext.Array.each(col.columns, function (sub_col) {
                    if (sub_col.xtype === 'numbercolumn') {
                        sub_col.xtype = 'templatecolumn';
                        sub_col.tpl = '#####';
                    }
                });
            })
        }


        this.callParent();

//       this.reconfigure(null,this._columns);
    },

    createStore: function () {
        var me = this;
        var fields = ['id', 'name', 'unit',
            {name: 'begin_count', type: 'int'},
            {name: 'begin_price', type: 'float'},
            {name: 'in_count', type: 'int'},
            {name: 'in_price', type: 'float'},
            {name: 'out_count', type: 'int'},
            {name: 'total_count', type: 'int'},
            {name: 'total_price', type: 'float'},
            {name: 'real_count', type: 'int'},
            {name: 'deficit', type: 'int'},
            {name: 'real_price', type: 'float'}];
        me.options.forEach(function (rec) {
            fields.push({name: rec.get('name') + '_count', type: 'int'});
            // fields.push({'name': rec.get('name') + '_price', type: 'float'});
            fields.push({'name': rec.get('name') + '_price', type: 'float', convert: function (value, record) {
                var countField = rec.get('name') + '_count';
                var count = record.get(countField)
                if (!count || count === '')return 0;
                var price = record.get('total_price') / record.get('total_count')
                return count * price;
            }});
        });


        this.store = Ext.create('invoicing.store.Surplus', {fields: fields})
    },

    createColumns: function () {
        var me = this;
        me.options.forEach(function (rec) {
            me.columns.items.push({
                text: rec.get('name'),
                columns: [
                    {
                        text: '数量',
                        dataIndex: rec.get('name') + '_count'
                    },
                    {
                        text: '金额',
                        xtype: 'numbercolumn',
                        format: '0.00',
//                        renderer: function (value) {
//                            return  Ext.util.Format.number(value, '0.00');
//                        },
                        dataIndex: rec.get('name') + '_price'
                    }
                ]
            });
        });

        me.columns.items.push({
            text: '总库存',
            minWidth: 70,
            dataIndex: 'total_count'
        });
        me.columns.items.push({
            text: '总金额',
            minWidth: 70,
            xtype: 'numbercolumn',
            format: '0.00',
            dataIndex: 'total_price'
        });
        me.columns.items.push({
            text: '实际库存',
            minWidth: 100,
            dataIndex: 'real_count',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 1,
                maxValue: 100000,
                listeners: {
                    change: function (field, newValue, oldValue, eOpts) {
                        var selectionModel = field.up('grid').getSelectionModel();
                        var model = selectionModel.getSelection()[0];
                        var price = model.get('total_price') / model.get('total_count')
                        model.set('real_price', Ext.util.Format.number(newValue * price, '0.00'));
                        model.set('deficit', model.get('total_count') - newValue);
                        //var me = cmp.up('outdetail');
                    }
                }
            }
        });
        me.columns.items.push({
            text: '差值',
            minWidth: 100,
            dataIndex: 'deficit'
        });
        me.columns.items.push({
            text: '实际金额',
            minWidth: 100,
            xtype: 'numbercolumn',
            format: '0.00',
            dataIndex: 'real_price'
        });
    },
    onExport: function () {
        var from_date = this.down('toolbar').down('datefield[name=from_date]').getRawValue();
        var to_date = this.down('toolbar').down('datefield[name=to_date]').getRawValue();
        var filename = from_date + '_' + to_date + '.xml';
        var data = Ext.ux.exporter.Exporter.exportGrid(this, 'excel', 'aaa', this.buildGroup());
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

    buildGroup: function () {
        var cells = [];
        Ext.each(this.headerCt.items.items, function (group) {
            var title;
            if (group.text != undefined) {
                title = group.text;
            } else if (group.name) {
                //make columns taken from Record fields (e.g. with a col.name) human-readable
                title = group.name.replace(/_/g, " ");
                title = Ext.String.capitalize(title);
            }
            if (['编号', '名称', '总库存', '总金额', '实际库存', '实际金额'].indexOf(group.text) >= 0)
                cells.push(Ext.String.format('<ss:Cell ss:StyleID="headercell"><ss:Data ss:Type="String">{0}</ss:Data><ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>', ''));
            else
                cells.push(Ext.String.format('<ss:Cell ss:StyleID="headercell" ss:MergeAcross="1"><ss:Data ss:Type="String">{0}</ss:Data><ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>', title));

        }, this);

        return cells.join("");
    },

    onQuery: function () {
        var from_date = this.down('toolbar').down('datefield[name=from_date]').value;
        var to_date = this.down('toolbar').down('datefield[name=to_date]').value;
        var category = this.down('toolbar').down('combo[name=category]').value;
        if (!from_date || !to_date) {
            Ext.Msg.show({
                title: '提示',
                msg: '请选择日期',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
        }
        to_date.setHours(23);
        to_date.setMinutes(59);
        Ext.Ajax.request({
            method: 'GET',
            url: 'surplus',
            scope: this,
            params: {from_date: from_date, to_date: to_date, category: category},
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                this.getStore().loadData(obj);
            },
            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    }
});