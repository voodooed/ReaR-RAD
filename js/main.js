// ReaR-RAD project page — small progressive-enhancement script.
// No dependencies, no build step.

document.addEventListener('DOMContentLoaded', function () {

  // ---- copy BibTeX to clipboard ----
  var copyBtn = document.getElementById('copyBtn');
  var bibtex = document.getElementById('bibtex');

  if (copyBtn && bibtex) {
    copyBtn.addEventListener('click', function () {
      var text = bibtex.textContent;

      function fallbackCopy(t) {
        var ta = document.createElement('textarea');
        ta.value = t;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* no-op */ }
        document.body.removeChild(ta);
      }

      var done = function () {
        copyBtn.textContent = 'Copied';
        copyBtn.classList.add('copied');
        setTimeout(function () {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 1800);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {
          fallbackCopy(text);
          done();
        });
      } else {
        fallbackCopy(text);
        done();
      }
    });
  }

  // ---- highlight the active section in the top nav while scrolling ----
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main .section[id]')
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a')
  );

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (a) {
      var id = a.getAttribute('href').replace('#', '');
      byId[id] = a;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.style.color = ''; a.style.borderColor = ''; });
          link.style.color = 'var(--ink)';
          link.style.borderColor = 'var(--ink)';
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

});
