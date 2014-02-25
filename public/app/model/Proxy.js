Ext.define('invoicing.model.Proxy', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'credit',
        {name: 'remainder', type: 'float', persist: false},
        {name: 'canUsed', type: 'float', persist: false, convert: function (value, record) {
            var credit = record.get('credit');
            var remainder = record.get('remainder');
            return Ext.util.Format.number(credit - remainder, '0.00')
        }}
    ],
    idgen: 'sequential',
    idProperty: 'id'
});