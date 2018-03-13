---
---
MathJax.Hub.Config({
	tex2jax: {
		inlineMath: [
			['$','$'],
			['\\(','\\)']
		],
		balanceBraces: false,
		processEscapes: true
	},
	TeX: {
		Macros: {
			ket: ["\\left|{#1}\\right\\rangle", 1],
			bra: ["\\left\\langle{#1}\\right|", 1],
			norm: ["\\left\\Vert{#1}\\right\\Vert", 1]
		}
	}
});

MathJax.Ajax.loadComplete("{{ site.url }}{{ page.url }}");
