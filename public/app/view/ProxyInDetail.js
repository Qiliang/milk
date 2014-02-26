Ext.define('invoicing.view.ProxyInDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.proxyindetail',
    bodyPadding: 5,
    width: 350,
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    defaultType: 'textfield',
    items: [
        {
            fieldLabel: '送货人',
            name: 'proxy_id',
            xtype: 'combo',
            allowBlank: false,
            typeAhead: true,
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            store: Ext.create('invoicing.store.Proxies')
        },
        {
            fieldLabel: '学校名称',
            name: 'shop_id',
            xtype: 'combo',
            allowBlank: false,
            typeAhead: true,
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            store: Ext.create('invoicing.store.Shop')
        },
        {
            xtype: 'datefield',
            allowBlank: false,
            anchor: '100%',
            value: new Date(),
            fieldLabel: '入账日期',
            name: 'create_at',
            format: 'Y-m-d'
        },
        {
            fieldLabel: '入账金额',
            xtype: 'numberfield',
            name: 'money',
            allowBlank: false,
            minValue: 1,
            maxValue: 10000000
        }
    ],

    // Reset and Submit buttons
    buttons: [
        {
            text: '取消',
            handler: function () {
                this.up('window').close();
            }
        },
        {
            text: '确定',
            formBind: true,
            disabled: true,
            handler: function () {
                var me = this.up('proxyindetail');
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    var values = form.getValues();
                    me.store.add(values);
                    this.up('window').close();
                }
            }
        }
    ]
});