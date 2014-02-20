Ext.define('invoicing.view.ShopDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.shopdetail',
    bodyPadding: 5,
    width: 350,
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    defaultType: 'textfield',
    items: [
        {
            fieldLabel: '学校名称',
            name: 'name',
            allowBlank: false
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
                var me = this.up('shopdetail');
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