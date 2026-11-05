/* Static strings are authored with this note. The query string is used only
 * to select one of three known languages, never as HTML. */
(() => {
  "use strict";
  const languages = ["zh-CN", "ja", "en"];
  const savedKey = "variational-ansatz-note-language";
  const picker = document.getElementById("language");
  let lang = "en";
  let column = 2;

  function pick(zh, ja, en) { return [zh, ja, en][column]; }
  function translation(key) {
    const entry = window.VariationalNoteText[key];
    if (!entry) throw Error("Missing note translation: " + key);
    return entry[column];
  }
  function apply(next, persist) {
    if (!languages.includes(next)) return;
    lang = next;
    column = languages.indexOf(next);
    document.documentElement.lang = next;
    for (const node of document.querySelectorAll("[data-i18n]"))
      node.innerHTML = translation(node.dataset.i18n);
    for (const node of document.querySelectorAll("[data-i18n-aria]"))
      node.setAttribute("aria-label", translation(node.dataset.i18nAria));
    picker.value = next;
    if (persist) {
      try { localStorage.setItem(savedKey, next); } catch { /* Local file/private browsing. */ }
      try {
        const url = new URL(location.href);
        url.searchParams.set("lang", next);
        history.replaceState(history.state, "", url);
      } catch { /* File URLs can still switch in memory. */ }
    }
    window.dispatchEvent(new CustomEvent("note-language", {detail: {language: next}}));
  }
  window.NoteI18n = Object.freeze({get lang() { return lang; }, pick});
  let initial = "en";
  try {
    const stored = localStorage.getItem(savedKey);
    if (languages.includes(stored)) initial = stored;
  } catch { /* Storage is optional. */ }
  const query = new URL(location.href).searchParams.get("lang");
  if (languages.includes(query)) initial = query;
  picker.addEventListener("change", () => apply(picker.value, true));
  apply(initial, false);
})();
