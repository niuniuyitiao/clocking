import VueI18n from 'vue-i18n'
export const statusColumns = [
	{ id: -1, name: '驳回' },
	{ id: 0, name: VueI18n.$t('application.approving') },
	{ id: 1, name: '通过' },
	{ id: 2, name: '取消' }
]