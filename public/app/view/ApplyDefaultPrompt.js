Ext.define('invoicing.view.ApplyDefaultPrompt', {
    extend: 'Ext.form.Panel',
    alias: 'widget.applydefaultprompt',
    bodyPadding: 5,
    width: 350,
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    items: [
        {
            fieldLabel: '开始时间',
            name: 'from',
            xtype: 'datefield',
            format: 'Y-m-d',
            allowBlank: false
        },
        {
            fieldLabel: '结束时间',
            name: 'to',
            xtype: 'datefield',
            format: 'Y-m-d',
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
                var me = this.up('applydefaultprompt');
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    Ext.Ajax.request({
                        url: '/ins/' + me.good_id,
                        method: 'PUT',
                        params:  form.getValues(),
                        success: function (response) {
                            var text = response.responseText;
                            me.up('window').close();
                        },
                        failure: function (response, opts) {
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });

                }
            }
        }
    ]
});