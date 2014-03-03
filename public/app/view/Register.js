Ext.define('invoicing.view.Register', {
    extend: 'Ext.form.Panel',
    alias: 'widget.register',
    bodyPadding: 5,
    width: 350,
    layout: 'anchor',
    defaults: {
        anchor: '100%',
        allowBlank: false,
    },

    defaultType: 'textfield',
    items: [
        {
            fieldLabel: '名称',
            name: 'name'
        },
        {
            fieldLabel: '密码',
            name: 'password'
        },
        {
            xtype: 'combo',
            fieldLabel: '角色',
            name: 'roles',
            forceSelection: true,
            store: [
                ['0001', '管理员'],
                ['0002', '普通用户']
            ]
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
        this.callParent();
    }
})
;