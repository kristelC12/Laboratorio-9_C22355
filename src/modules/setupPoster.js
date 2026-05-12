const DATA_URL = new URL("../data/poster.json", import.meta.url);

export async function setupPoster() {
	const response = await fetch(DATA_URL);

	if (!response.ok) {
		throw new Error(`No se pudo cargar ${DATA_URL.pathname}`);
	}

	const data = await response.json();
	const poster = document.querySelector("posters-app");

	if (poster) {
		poster.data = data;
	}
}
