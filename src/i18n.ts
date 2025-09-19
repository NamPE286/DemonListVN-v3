import { register, init, locale } from 'svelte-i18n';

register('en', () => import('./public/locales/en.json'));
register('vi', () => import('./public/locales/vi.json'));

init({
	fallbackLocale: 'vi',
	initialLocale: 'vi'
});

locale.set('vi');
