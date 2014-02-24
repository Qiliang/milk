Ext.define('invoicing.view.Stock', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.stock',
    store: Ext.create('invoicing.store.Stock'),

    columns: [
        {
            text: '货品编号',
            flex: 1,
            sortable: false,
            dataIndex: 'id'
        },
        {
            text: '品项',
            flex: 1,
            sortable: false,
            dataIndex: 'name'
        },
        {
            text: '单位',
            flex: 1,
            sortable: false,
            dataIndex: 'unit'
        },
        {
            text: '期初',
            flex: 1,
            sortable: false,
            dataIndex: 'begin_count'
        },
        {
            text: '入库',
            flex: 1,
            sortable: false,
            dataIndex: 'in_count'
        },
        {
            text: '出库',
            flex: 1,
            sortable: false,
            dataIndex: 'out_count'
        },
        {
            text: '总库存',
            flex: 1,
            sortable: false,
            dataIndex: 'total_count'
        },
        {
            text: '总库存总额',
            flex: 1,
            sortable: false,
            xtype: 'numbercolumn',
            format: '0.00',
            dataIndex: 'total_price'
        }
    ],


    initComponent: function () {
        if (!window.capability('3-2')) {
            this.columns[7].xtype = 'templatecolumn';
            this.columns[7].tpl = '#####';
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
                text: '查询',
                scope: this,
                handler: this.onQuery
            },
            {
                text: '导出',
                scope: this,
                handler: this.onExport
            }
        ]
        this.callParent();
    },
    onExport: function () {
        var from_date = this.down('toolbar').down('datefield[name=from_date]').getRawValue();
        var to_date = this.down('toolbar').down('datefield[name=to_date]').getRawValue();
        var filename = from_date + '_' + to_date + '.xml';
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
        var from_date = this.down('toolbar').down('datefield[name=from_date]').value;
        var to_date = this.down('toolbar').down('datefield[name=to_date]').value;
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
            url: 'stock',
            scope: this,
            params: {
                from_date: from_date,
                to_date: to_date},
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