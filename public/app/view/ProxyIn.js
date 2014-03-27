Ext.define('invoicing.view.ProxyIn', {
    extend: 'invoicing.view.Panel',
    alias: 'widget.proxyin',
    store: Ext.create('invoicing.store.ProxyIns'),
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    _columns: [
        {
            text: '送货人',
            flex: 1,
            sortable: false,
            dataIndex: 'proxy_name'
        },
        {
            text: '学校名称',
            flex: 1,
            sortable: false,
            dataIndex: 'shop_name'
        },
        {
            text: '入账日期',
            flex: 1,
            xtype: 'datecolumn',
            sortable: false,
            format: 'Y-m-d',
            dataIndex: 'create_at'
        },
        {
            text: '金额',
            flex: 1,
            sortable: false,
            dataIndex: 'money'
        }
    ],
    _tbar: [
        {
            xtype: 'datefield',
            anchor: '100%',
            fieldLabel: '开始时间',
            name: 'from_date',
            flex: 1,
            format: 'Y-m-d'
        },
        {
            xtype: 'datefield',
            anchor: '100%',
            fieldLabel: '结束时间',
            name: 'to_date',
            flex: 1,
            format: 'Y-m-d'
        },
        {
            xtype: 'combo',
            name: 'proxy',
            typeAhead: true,
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'id',
            store: Ext.create('invoicing.store.Proxies'),
            flex: 1,
            fieldLabel: '送货人'
        },
        {
            xtype: 'combo',
            name: 'shop',
            typeAhead: true,
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'id',
            store: Ext.create('invoicing.store.Shop'),
            flex: 1,
            fieldLabel: '学校'
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

        if (window.capability('0001') || window.capability('0005')) {

            this.tbar.splice(0, 0, {
                text: '入账',
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
                        tooltip: '删除',
                        scope: this,
                        handler: this.onRemoveClick
                    }
                ]
            });
        }


        this.callParent();
        this.getStore().load();
    },

    onAddClick: function () {
        Ext.create('Ext.window.Window', {title: '入账', modal: true, items: [
            {xtype: 'proxyindetail', store: this.getStore()}
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

    onQuery: function () {
        var proxy_id = this.down('toolbar').down('combo[name=proxy]').value;
        var from_date = this.down('toolbar').down('datefield[name=from_date]').value;
        var to_date = this.down('toolbar').down('datefield[name=to_date]').value;
        var shop_id = this.down('toolbar').down('combo[name=shop]').value;
        if (to_date) {
            to_date.setHours(23);
            to_date.setMinutes(59);
        }
        var proxy = this.getStore().getProxy();
        proxy.setExtraParam('proxy_id', proxy_id);
        proxy.setExtraParam('shop_id', shop_id);
        proxy.setExtraParam('from_date', from_date);
        proxy.setExtraParam('to_date', to_date);
        this.getStore().load();

    }
});