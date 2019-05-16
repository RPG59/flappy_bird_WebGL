export class Input {
	private static keyDownHashMap: { [key: string]: boolean } = {};

	public static init(): void {
		document.addEventListener('keydown', key => {
			this.keyDownHashMap[key.code] = true;
		});

		document.addEventListener('keyup', key => {
			this.keyDownHashMap[key.code] = false;
		})

	}

	public static isKeyDown(keyCode: string): boolean {
		return !!this.keyDownHashMap[keyCode];
	}

}