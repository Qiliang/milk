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
//        this.store = Ext.create('Ext.data.Store', {
//            model: 'invoicing.model.Good',
//            autoLoad: true,
//            proxy: {
//                type: 'rest',
//                url: '/goods'
//            }
//        });
//        this.cellEditing = new Ext.grid.plugin.CellEditing({
//            clicksToEdit: 1
//        });

//        tbar: [
//            {
//                xtype: 'checkbox',
//                anchor: '100%',
//                fieldLabel: '退货',
//                name: 'reject',
//                listeners: {
//                    change: function (cmp, rec, index) {
//                        if (cmp.value)
//                            cmp.nextSibling('combo').enable();
//                        else
//                            cmp.nextSibling('combo').disable();
//                    }
//                }
//            },
//            {
//                fieldLabel: '学校名称',
//                name: 'shop_name',
//                xtype: 'combo',
//                disabled: true,
//                typeAhead: true,
//                triggerAction: 'all',
//                displayField: 'name',
//                valueField: 'name',
//                forceSelection: true,
//                store: Ext.create('invoicing.store.Shop')
//            },
//            {
//                xtype: 'datefield',
//                allowBlank: false,
//                anchor: '100%',
//                fieldLabel: '入库时间',
//                name: 'create_at',
//                format: 'Y-m-d'
//            }
//        ],
//        fbar
//            :
//            [
//                {
//                    text: '保存',
//                    scope: this,
//                    handler: this.onSave
//                }
//            ]
//    });

        this.callParent();
    },

    onSave: function () {
        var me = this;
        var create_at = this.down('toolbar').down('datefield[name=create_at]').value;
        var reject = this.down('toolbar').down('checkbox[name=reject]').value;
        var shop_name = this.down('toolbar').down('combo[name=shop_name]').value;
        var recs = [];
        var comment = '';
        me.getStore().each(function (rec) {
                if (!rec.get('count'))return;
                if (reject) comment = '退货:' + shop_name;
                recs.push({
                    'good_id': rec.get('id'),
                    'count': rec.get('count'),
                    'remainder': rec.get('remainder'),
                    'price': rec.get('price'),
                    'comment': comment,
                    'create_at': create_at
                })
            }
        )
        ;
        me.source.add(recs);
        me.up('window').close();
    }
})