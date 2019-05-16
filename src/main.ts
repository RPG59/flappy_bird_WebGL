import { Game } from './Game/game';
import { GL, initWebGL } from './common';

function main(): void {
	initWebGL();

	if (GL === null) {
		console.log('WebGL context not found!');
		return;
	}
	console.log(GL);

	const game = new Game();

	game.init().then(() => {
		game.run();
	});
}

main();
