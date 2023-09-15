export function calcTotal(months: Month[]) {
	return months.reduce((p, c) => {
		p += c.init - c.Block.value;
		p -= c.Trans.reduce((tp, tc) => {
			return tp + tc.value;
		}, 0);
		return p;
	}, 0);
}
