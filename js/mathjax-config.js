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
  }
});

MathJax.Ajax.loadComplete("{{ site.url }}{{ page.url }}");
