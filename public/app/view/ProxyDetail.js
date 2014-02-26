Ext.define('invoicing.view.ProxyDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.proxydetail',
    bodyPadding: 5,
    width: 350,
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    defaultType: 'textfield',
    items: [
        {
            fieldLabel: '送货人名称',
            name: 'name',
            allowBlank: false
        },
        {
            fieldLabel: '信用额度（件）',
            xtype: 'numberfield',
            name: 'credit',
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
                var me = this.up('proxydetail');
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