import { Posters } from "./modules/Posters.js";
import { setupPoster } from "./modules/setupPoster.js";

customElements.define("posters-app", Posters);

setupPoster().catch((error) => {
	console.error(error);
});
