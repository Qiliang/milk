Ext.define('invoicing.view.DepotReport', {
    extend: 'invoicing.view.Panel',
    alias: 'widget.depotreport',
    store: Ext.create('invoicing.store.DepotReport'),
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    features: [
        {ftype: 'grouping'}
    ],

    _columns: [
        {
            text: '仓库名称',
            flex: 1,
            sortable: false,
            dataIndex: 'depot_name'
        },
        {
            text: '学校名称',
            flex: 1,
            sortable: false,
            dataIndex: 'shop_name'
        },
        {
            text: '送货量',
            flex: 1,
            sortable: false,
            dataIndex: 'count'
        },
        {
            text: '送货金额',
            flex: 1,
            sortable: false,
            dataIndex: 'amount'
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
        }
    ],
    initComponent: function () {
        this.columns = Ext.clone(this._columns);
        this.tbar = Ext.clone(this._tbar);
        this.tbar.push({
            text: '查询',
            scope: this,
            handler: this.onQuery
        });

        this.callParent();
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
            return;
        }
        if (to_date) {
            to_date.setHours(23);
            to_date.setMinutes(59);
        }
        var proxy = this.getStore().getProxy();
        proxy.setExtraParam('from_date', from_date);
        proxy.setExtraParam('to_date', to_date);
        this.getStore().load();

    }
});