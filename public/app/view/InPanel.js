Ext.define('invoicing.view.InPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.inpanel',

    autoScroll: true,
    bodyPadding: 5,
    layout: 'anchor',
    defaults: {
        anchor: '100%'
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
            allowBlank: false,
            store: Ext.create('invoicing.store.Goods'),
            listeners: {
                select: function (combo, records, eOpts) {
                    var priceField = combo.nextSibling('#price');
                    priceField.setValue(records[0].get('price'));
                }
            }
        },

        {
            fieldLabel: '数量',
            name: 'count',
            value: 1,
            allowBlank: false,
            minValue: 1,
            maxValue: 100000,
            xtype: 'numberfield'

        },
        {
            id: 'price',
            fieldLabel: '单价',
            name: 'price',
            allowBlank: false,
            readOnly: true,
            xtype: 'numberfield'

        },
        {
            fieldLabel: '效期',
            name: 'expiry',
            value: 90,
            allowBlank: false,
            xtype: 'numberfield'

        },
        {
            xtype: 'datefield',
            allowBlank: false,
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
                var form = this.up('inpanel').getForm();
                if (form.isValid()) {
                    Ext.create('invoicing.store.In').add(form.getValues());
                    this.up('window').close();
                }
            }
        }
    ],

    initComponent: function () {
        this.callParent();
    }


})