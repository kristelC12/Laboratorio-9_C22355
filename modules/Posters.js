export class Posters extends HTMLElement {
  #data = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(value) {
    this.#data = value;
    this.#render();
  }

  get data() {
    return this.#data;
  }

  connectedCallback() {
    if (this.#data) {
      this.#render();
    }
  }

  #render() {
    if (!this.shadowRoot || !this.#data) {
      return;
    }

    const fragment = document.createDocumentFragment();
    const style = document.createElement("style");
    style.textContent = styles;
    fragment.append(style, this.#buildLayout(this.#data));
    this.shadowRoot.replaceChildren(fragment);
  }

  #buildLayout(data) {
    const root = document.createElement("section");
    root.className = "layout";
    root.setAttribute("aria-label", data.ariaLabel);

    root.append(this.#buildPoster(data), this.#buildDirections(data));
    return root;
  }

  #buildPoster(data) {
    const poster = document.createElement("article");
    poster.className = "poster";

    const header = document.createElement("header");
    header.className = "poster__header";

    data.headerBlocks.forEach((block) => {
      const blockElement = document.createElement(block.tag || "div");
      blockElement.className = `poster__block poster__block--${block.variant}`;

      if (block.variant === "exclamation") {
        blockElement.setAttribute("aria-hidden", "true");
      }

      const textElement = document.createElement(block.textTag || "span");
      textElement.className = `poster__text poster__text--${block.textVariant || block.variant}`;
      textElement.textContent = block.text;
      blockElement.append(textElement);
      header.append(blockElement);
    });

    const body = document.createElement("div");
    body.className = "poster__body";

    const lead = document.createElement("h1");
    lead.className = "poster__lead";
    lead.textContent = data.body.lead;

    const claim = document.createElement("h2");
    claim.className = "poster__claim";
    claim.textContent = data.body.claim;

    const helper = document.createElement("p");
    helper.className = "poster__helper";
    helper.textContent = data.body.helper;

    const qr = document.createElement("img");
    qr.className = "poster__qr";
    qr.src = data.body.qr.src;
    qr.alt = data.body.qr.alt;
    qr.loading = "lazy";

    const artwork = document.createElement("img");
    artwork.className = "poster__artwork";
    artwork.src = data.body.artwork.src;
    artwork.alt = data.body.artwork.alt;
    artwork.loading = "lazy";

    const signature = document.createElement("strong");
    signature.className = "poster__signature";
    signature.textContent = data.body.signature;

    body.append(lead, claim, helper, qr, artwork, signature);
    poster.append(header, body);

    return poster;
  }

  #buildDirections(data) {
    const directions = document.createElement("aside");
    directions.className = "directions";
    directions.setAttribute("aria-label", data.signsLabel);

    const list = document.createElement("ul");
    list.className = "directions__list";

    data.signs.forEach((sign, index) => {
      const item = document.createElement("li");
      item.className = `directions__item${index === data.signs.length - 1 ? " directions__item--curve" : ""}`;

      const label = document.createElement("h3");
      label.className = "directions__label";
      label.textContent = sign.text;

      item.append(label);

      if (!sign.isTerminal) {
        const arrow = document.createElement("img");
        arrow.className = "directions__arrow";
        arrow.src = sign.arrow.src;
        arrow.alt = sign.arrow.alt;
        arrow.loading = "lazy";
        item.append(arrow);
      } else {
        const badge = document.createElement("span");
        badge.className = "directions__badge";
        badge.textContent = sign.badge;
        item.append(badge);
      }

      list.append(item);
    });

    directions.append(list);
    return directions;
  }
}


const styles = `
	:host {
		display: block;
		color: #fff;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(320px, 390px) minmax(320px, 390px);
		justify-content: center;
		align-items: start;
		gap: 20px;
		width: 100%;
		max-width: 860px;
		margin: 0 auto;
	}

	.poster,
	.directions {
		min-width: 0;
	}

	.poster {
		display: grid;
		grid-template-rows: 185px auto;
		width: 100%;
		max-width: 390px;
		overflow: clip;
	}

	.poster__header {
		position: relative;
		background: #fdb912;
		min-height: 185px;
	}

	.poster__body {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		background: #fdb912;
		text-align: center;
		padding: 5rem 2rem 0rem;
	}

	.poster__lead,
	.poster__claim,
	.poster__helper,
	.directions__label {
		margin: 0;
	}

	.poster__lead {
		font-size: clamp(1.4rem, 2vw, 2rem);
		font-weight: 700;
		color: #8a0552;
	}

	.poster__claim {
		font-size: clamp(1.75rem, 2.5vw, 2.4rem);
		font-weight: 800;
		color: #8a0552;
	}

	.poster__helper {
		font-size: 0.95rem;
		color: #fff;
		margin-top: 0.5rem;
	}

	.poster__qr {
		width: min(100%, 110px);
		height: auto;
	}

	.poster__artwork {
		width: min(100%, 360px);
		height: auto;
		display: block;
		margin-top: 0.25rem;
	}

	.poster__signature {
		position: absolute;
		bottom: 0.15rem;
		left: 50%;
		transform: translateX(-50%);
		font-family: "Cinzel", "Times New Roman", serif;
		font-size: clamp(1.5rem, 2vw, 2rem);
		font-weight: 600;
		letter-spacing: 0.02em;
		color: #fff;
		display: none;
	}

	.poster__block {
		position: absolute;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
	}

	.poster__block--exclamation {
		width: fit-content;
		height: fit-content;
		padding: 0.1rem 0.25rem;
		top: 18px;
		left: 36px;
		background: #8a0552;
		transform: rotate(-10deg);
		z-index: 4;
	}

	.poster__block--brand-blue {
		top: 52px;
		left: 68px;
		background: #8ed8f8;
		transform: rotate(1deg);
		z-index: 3;
	}

	.poster__block--brand-white {
		top: 104px;
		left: 60px;
		background: #fff;
		width: fit-content;
		height: fit-content;
		transform: rotate(20deg);
		z-index: 5;
	}

	.poster__block--brand-purple {
		top: 108px;
		left: 86px;
		background: #8a0552;
		transform: rotate(-3deg);
		padding-inline-start: 10px;
		z-index: 4;
	}

	.poster__block--accent-blue {
		top: 85px;
		left: 314px;
		background: #8ed8f8;
		transform: rotate(10deg);
		width: fit-content;
		height: fit-content;
		padding: 0.1rem 0.25rem;
		z-index: 6;
	}

	.poster__text {
		display: block;
		margin: 0.3rem 0.85rem;
		font-family: "Myriad Pro", Arial, sans-serif;
		font-weight: 700;
	}

	.poster__text--exclamation,
	.poster__text--accent-blue {
		font-size: 4rem;
		line-height: 1;
		color: #8a0552;
		margin: 0;
	}

	.poster__text--brand-blue {
		font-size: 2rem;
		color: #fff;
		
	}
	
	.poster__text--brand-purple {
		font-size: 2rem;
		color: #fff;
		
	}
		
	.poster__text--brand-white {
		font-size: 1.5rem;
		color: #fdb912;	
		line-height: 1;
		margin: 0.5rem 0.5rem;
	}

	.poster__text--exclamation {
		color: #fdb912;
	}

	.poster__text--accent-blue {
		color: #8a0552;
	}

	.directions {
		display: block;
		width: 100%;
		max-width: 390px;
	}

	.directions__list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.directions__item {
		position: relative;
		display: flex;
		align-items: center;
		min-height: 62px;
		padding: 0.9rem 1.15rem;
		background: #005da4;
		border-bottom: 1px solid rgba(255, 255, 255, 0.9);
	}

	.directions__item:last-child {
		border-bottom: 0;
	}

	.directions__item--curve {
		overflow: hidden;
		min-height: 84px;
		border-bottom: 0;
	}

	.directions__item--curve::after {
		content: "";
		position: absolute;
		inset-inline: 0;
		bottom: 0;
		height: 58px;
		background: #fff;
		border-top-left-radius: 50% 40%;
		border-top-right-radius: 50% 40%;
	}

	.directions__label {
		position: relative;
		z-index: 1;
		flex: 1;
		font-size: clamp(1rem, 1.6vw, 1.35rem);
		font-weight: 700;
		line-height: 1.1;
	}

	.directions__arrow {
		position: relative;
		z-index: 1;
		width: 24px;
		height: auto;
		flex: none;
		margin-inline-start: 0.75rem;
	}

	.directions__badge {
		position: absolute;
		z-index: 1;
		inset-inline-start: 50%;
		bottom: 0.2rem;
		transform: translateX(-50%);
		font-family: "Cinzel", "Times New Roman", serif;
		font-size: clamp(2.2rem, 4vw, 3rem);
		font-weight: 600;
		color: #005da4;
		line-height: 1;
	}

	@media (max-width: 860px) {
		.layout {
			grid-template-columns: minmax(0, 390px);
		}
	}
`;
