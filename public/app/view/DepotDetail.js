Ext.define('invoicing.view.DepotDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.depotdetail',
    bodyPadding: 5,
    width: 350,
    layout: 'anchor',
    defaults: {
        anchor: '100%',
        allowBlank: false
    },

    defaultType: 'textfield',
    items: [
        {
            fieldLabel: '分仓编号',
            name: 'id'
        },
        {
            fieldLabel: '分仓名称',
            name: 'name'
        },
        {
            fieldLabel: '学习编号匹配',
            name: 'matching'
        },
        {
            xtype: 'combo',
            name: 'proxy_id',
            typeAhead: true,
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'id',
            store: Ext.create('invoicing.store.Proxies'),
            fieldLabel: '送货人'
        }
    ],

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
                var me = this.up('depotdetail');
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