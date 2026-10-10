# The Diary of Thea Lightbearer

A small Jekyll journal for https://mababao.github.io/thea/. This project is independent of Possibilis. Do not copy it into or alter the Possibilis repository.

## Publishing setup

Create the public repository `MABABAO/thea`, upload these files to `main`, then select Settings → Pages → Deploy from a branch → main → / (root). No custom workflow or root account-site repository is needed. Do not add `.nojekyll`. The approved URL is configured with `baseurl: /thea`.

## Writing an entry

Copy `templates/entry.md` to `_entries/001-entry-name.md`. Set a title, numeric `order`, and optional in-world date. Replace the instructional body with actual diary text, then set `published: true` when ready. Entries are intentionally empty initially: no campaign events or backstory have been invented.

The Markdown body is the character’s account. Keep it in first person and limited to what the character knows during that session. Layout and appearance live separately in `_layouts` and `assets/journal.css`.

## Later annotations

Add optional front-matter annotations:

```yaml
annotations:
  - label: "A later recollection"
    revealed: true
    text: |
      The later annotation, with *Markdown* supported.
```

`revealed: true` means the author has approved inclusion in the published page. It still begins collapsed; the reader must explicitly open it. Omit the annotation or set `revealed: false` to exclude its text from rendered HTML. This is spoiler presentation, not access control. Anything committed to a public repository is publicly readable, so keep genuinely unrevealed secrets outside the repository.

## Adventurer’s Notes

Optional `adventurers_notes: |` accepts Markdown gameplay details and renders in a separate, initially collapsed disclosure. The diary body remains in character.

## Parallel perspectives

Add a narrator to `_data/perspectives.yml` and set an entry’s `perspective` to that key. The index labels other narrators; previous/next navigation follows the current perspective. Entry filenames must remain globally unique and `order` should define the overall reading sequence.

## Fonts and preview

Alegreya regular and real italic faces load through Google Fonts; CSS disables synthetic font styles. Georgia is the offline fallback.

With Ruby and Bundler installed, run `bundle install`, then `bundle exec jekyll serve --baseurl /thea`. Open http://127.0.0.1:4000/thea/. Check the Pages deployment after publication. The initial production Jekyll build and GitHub Pages deployment succeeded. The live index was checked in the browser, including loaded regular and italic Alegreya fonts. Entry pages will need a content check when the first real entry is added.
