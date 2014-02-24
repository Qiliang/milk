Ext.define('invoicing.view.GoodDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.gooddetail',
    bodyPadding: 5,
    width: 350,
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    // The fields
    defaultType: 'textfield',
    items: [
        {
            fieldLabel: '货品编号',
            name: 'id',
            allowBlank: false
        },
        {
            fieldLabel: '货品名称',
            name: 'name',
            allowBlank: false
        },
        {
            fieldLabel: '规格',
            name: 'spec',
            allowBlank: false
        },
        {
            fieldLabel: '单位',
            name: 'unit',
            allowBlank: false
        },
        {
            fieldLabel: '默认单价',
            xtype: 'numberfield',
            dataIndex: 'price',
            allowBlank: true,
            flex: 1
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
                var me = this.up('gooddetail');
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    var values = form.getValues();
                    me.store.add(values);
                    me.store.load();
                    this.up('window').close();
                }
            }
        }
    ]
});