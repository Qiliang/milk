Ext.define('invoicing.view.DepotStock', {
    extend: 'invoicing.view.Panel',
    alias: 'widget.depotstock',
    store: Ext.create('invoicing.store.Stock'),
    features: [
        {
            ftype: 'summary'
        }
    ],
    columns: [
        {
            text: '货品编号',
            flex: 1,
            sortable: false,
            dataIndex: 'id',
            summaryType: 'count',
            summaryRenderer: function (value, summaryData, dataIndex) {
                return Ext.String.format('{0} 项总计', value);
            }
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
            dataIndex: 'begin_count',
            summaryType: 'sum'
        },
        {
            text: '入库',
            flex: 1,
            sortable: false,
            dataIndex: 'in_count',
            summaryType: 'sum'
        },
        {
            text: '出库',
            flex: 1,
            sortable: false,
            dataIndex: 'out_count',
            summaryType: 'sum'
        },
        {
            text: '总库存',
            flex: 1,
            sortable: false,
            dataIndex: 'total_count',
            summaryType: 'sum'
        },
        {
            text: '总库存总额',
            flex: 1,
            sortable: false,
            xtype: 'numbercolumn',
            format: '0.00',
            dataIndex: 'total_price',
            summaryType: 'sum'
        }
    ],


    initComponent: function () {

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
                fieldLabel: '分仓名称',
                name: 'depot_id',
                xtype: 'combo',
                displayField: 'name',
                valueField: 'id',
                forceSelection: true,
                store: Ext.create('invoicing.store.Depots')
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
        var depot_id = this.down('toolbar').down('combo[name=depot_id]').value;
        if (!from_date || !to_date || !depot_id) {
            Ext.Msg.show({
                title: '提示',
                msg: '请选择日期和仓库名称',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return;
        }
        to_date.setHours(23);
        to_date.setMinutes(59);
        Ext.Ajax.request({
            method: 'GET',
            url: 'depotstock',
            scope: this,
            params: {
                depot_id: depot_id,
                from_date: from_date,
                to_date: to_date
            },
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