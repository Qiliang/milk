Ext.define('invoicing.view.DepotOutPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.depotoutpanel',

    bodyPadding: 5,
    layout: 'anchor',
    defaults: {
        anchor: '100%',
        allowBlank: false
    },

    defaultType: 'textfield',
    items: [
        {
            fieldLabel: '货品名称',
            name: 'good_id',
            xtype: 'combo',
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            store: Ext.create('invoicing.store.Goods')
        },
        {
            fieldLabel: '分仓名称',
            name: 'depot_id',
            xtype: 'combo',
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            store: Ext.create('invoicing.store.Depots'),
            listeners: {
                select: function (combo, records, eOpts) {
                    var proxyIdField = combo.nextSibling('#proxy_id');
                    var proxyNameField = combo.nextSibling('#proxy_name');
                    proxyIdField.setValue(records[0].get('proxy_id'));
                    proxyNameField.setValue(records[0].get('proxy_name'));
                    var shopField = combo.nextSibling('#shop_name');
                    var matching = records[0].get('matching');
                    shopField.getStore().clearFilter();
                    shopField.getStore().filters.add({filterFn: function (item) {
                        return item.get('id').indexOf(matching) === 0;
                    }})

                }
            }
        },
        {
            fieldLabel: '学校名称',
            name: 'shop_name',
            id: 'shop_name',
            xtype: 'combo',
            displayField: 'name',
            valueField: 'name',
            forceSelection: true,
            store: Ext.create('invoicing.store.Shop')
        },
        {
            fieldLabel: '送货人',
            readOnly: true,
            disabled: false,
            id: 'proxy_name'
        },
        {
            xtype: 'hidden',
            name: 'proxy',
            id: 'proxy_id'
        },
        {
            fieldLabel: '数量',
            name: 'count',
            value: 1,
            minValue: 0.01,
            maxValue: 100000,
            xtype: 'numberfield'
        },
        {
            fieldLabel: '出库分类',
            name: 'supplement',
            xtype: 'combo',
            forceSelection: true,
            value: 0,
            store: [
                [0, '正常'],
                [1, '补损'],
                [2, '赠送']
            ]
        },
        {
            xtype: 'datefield',
            anchor: '100%',
            fieldLabel: '入库时间',
            name: 'create_at',
            value: new Date(),
            format: 'Y-m-d'
        }
    ],

    buttons: [
        {
            text: '保存',
            formBind: true,
            disabled: true,
            handler: function () {
                var me = this;
                var form = this.up('depotoutpanel').getForm();
                if (!form.isValid()) return;
                var values = form.getValues();
                if (values.supplement > 0) {
                    Ext.create('invoicing.store.Out').add(values);
                    me.up('window').close();
                } else {
                    Ext.Ajax.request({
                        method: 'GET',
                        url: 'proxies/' + values.proxy + '/credit',
                        params: {good_id: values.good_id, count: values.count},
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            var canUsed = obj.credit - obj.remainder;
                            if (canUsed >= values.count) {
                                Ext.create('invoicing.store.DepotOut').add(values);
                                me.up('window').close();
                            } else {
                                Ext.Msg.show({
                                    title: '提示',
                                    msg: '货品数量：' + values.count + '<br />可用信用额度(件)：' + canUsed,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.WARNING
                                });
                            }
                        },
                        failure: function (response, opts) {
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });
                }
            }
        }
    ],

    initComponent: function () {
        this.callParent();
    }

})