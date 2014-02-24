Ext.define('invoicing.view.OutPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.outpanel',

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
            fieldLabel: '学校名称',
            name: 'shop_name',
            xtype: 'combo',
            displayField: 'name',
            valueField: 'name',
            forceSelection: true,
            store: Ext.create('invoicing.store.Shop')
        },
        {
            fieldLabel: '送货人',
            name: 'proxy',
            xtype: 'combo',
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            store: Ext.create('invoicing.store.Proxies')
        },
        {
            fieldLabel: '数量',
            name: 'count',
            value: 1,
            minValue: 1,
            maxValue: 100000,
            xtype: 'numberfield'
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
                var form = this.up('outpanel').getForm();
                if (form.isValid()) {
                    Ext.create('invoicing.store.Out').add(form.getValues());
                    this.up('window').close();
                }
            }
        }
    ],

    initComponent: function () {
        this.callParent();
    }

})