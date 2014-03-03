Ext.define('invoicing.view.DepotInPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.depotinpanel',

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
                }
            }
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
            minValue: 1,
            maxValue: 100000,
            xtype: 'numberfield'
        },
        {
            name: 'supplement',
            xtype: 'hidden',
            value: 0
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
                var form = this.up('depotinpanel').getForm();
                if (!form.isValid()) return;
                var values = form.getValues();
                Ext.create('invoicing.store.Out').add(values);
                me.up('window').close();
            }
        }
    ],

    initComponent: function () {
        this.callParent();
    }

})