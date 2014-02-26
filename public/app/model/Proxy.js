Ext.define('invoicing.model.Proxy', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        {name: 'credit', type: 'int'},
        {name: 'remainder', type: 'int', persist: false},
        {name: 'remainder_money', type: 'float', persist: false},
        {name: 'credit_money', type: 'float', persist: false},
        {name: 'canUsed', type: 'float', persist: false, convert: function (value, record) {
            var credit = record.get('credit_money');
            var remainder = record.get('remainder_money');
            return Ext.util.Format.number(credit - remainder, '0.00')
        }}
    ],
    idgen: 'sequential',
    idProperty: 'id'
});