Ext.define('invoicing.view.Register', {
    extend: 'Ext.form.Panel',
    alias: 'widget.register',
    bodyPadding: 5,
    width: 350,
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    defaultType: 'textfield',
    items: [
        {
            fieldLabel: '名称',
            name: 'name',
            allowBlank: false
        },
        {
            fieldLabel: '密码',
            name: 'password',
            allowBlank: false
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: '角色',
            defaultType: 'checkboxfield',
            items: []
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
                var me = this.up('register');
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    var values = form.getValues();
                    me.store.add(values);
                    this.up('window').close();
                }
            }
        }
    ],

    initComponent: function () {
        var me = this;
        if (me.items[2].items.length == 0) {
            window.all_roles.forEach(function (item) {
                me.items[2].items.push({
                    boxLabel: item.name,
                    name: 'roles',
                    inputValue: item.id
                });
            });
        }

        this.callParent();
    }
})
;