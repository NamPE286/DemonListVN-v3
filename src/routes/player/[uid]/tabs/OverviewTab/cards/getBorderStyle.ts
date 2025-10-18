import { isActive } from '$lib/client/isSupporterActive';

export function getBorderStyle(player: any) {
	if (isActive(player.supporterUntil)) {
		const isDark = localStorage.getItem('theme') == 'dark';
		const bgColor = isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';

		return `border-color: ${player.borderColor}; background-color: ${bgColor}`;
	}

	return '';
}
