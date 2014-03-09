Ext.define('invoicing.view.Login', {
    extend: 'Ext.form.Panel',
    alias: 'widget.login',
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
            xtype: 'combo',
            fieldLabel: '用户名',
            name: 'name',
            allowBlank: false,
            displayField: 'name',
            valueField: 'name',
            store: Ext.create('invoicing.store.Users')
        },
        {
            fieldLabel: '密码',
            inputType: 'password',
            name: 'password',
            value: '',
            allowBlank: false
        }

    ],

    // Reset and Submit buttons
    buttons: [
        {
            text: '登录',
            formBind: true,
            disabled: true,
            handler: function () {
                var me = this.up('login');
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    var values = form.getValues();
                    Ext.Ajax.request({
                        method: 'POST',
                        params: values,
                        url: 'auth',
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.util.Cookies.set('name', values.name);
                            Ext.util.Cookies.set('roles', obj.roles);
                            me.up('window').close();
                        },
                        failure: function (response, opts) {
                            me.failure();
                        }
                    });


                }
            }
        }
    ],
    failure: function () {
        Ext.Msg.show({
            title: '登录失败',
            msg: '密码或用户名错误',
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO
        });
    },

    initComponent: function () {
        this.callParent();
    }

});