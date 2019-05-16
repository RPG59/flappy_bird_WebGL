import  {Game} from './main'

function main(): void {
	const game = new Game();
	if(game.init()) {
		game.run();
	}

}

document.addEventListener('load', main);


