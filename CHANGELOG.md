# Changelog

All notable changes to Nice Crochet are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [0.4.0] - 2026-08-31

### Added
- Add bilingual Thai+English semantic search and remove sort dropdown ([`a0a8705`](https://github.com/Vit129/nice-crochet/commit/a0a8705701c0c8b837ec3783bb88593c16145068))

### Fixed
- Show only the trio photo on Home's Market totes slide, no rotation ([`a3b0a69`](https://github.com/Vit129/nice-crochet/commit/a3b0a6967d09dbfd1920274baca7c815cd5b7a02))
- Update maker name to Nice and minimalist social chips ([`516ee34`](https://github.com/Vit129/nice-crochet/commit/516ee3441bd88631591583a5b97af0103808526c))

## [0.3.0] - 2026-08-26

### Added
- Elegant shop polish, scroll-reveal, craft spotlight, dynamic colours + subfolder images ([`6451ef9`](https://github.com/Vit129/nice-crochet/commit/6451ef95a320cd69dfabc4c4e227625fbe4bc0c8))
- Add Instagram link next to TikTok in About contact section ([`6b2ea11`](https://github.com/Vit129/nice-crochet/commit/6b2ea11d15b76ca4499946d7c46f2f8d663c069f))
- Add Instagram CTA to product lightbox contact hint ([`bd9fbce`](https://github.com/Vit129/nice-crochet/commit/bd9fbce3d7f7706545d134e6e324657d922af0c6))
- Replace mock catalog with the real 24-product catalog ([`8fc6dfa`](https://github.com/Vit129/nice-crochet/commit/8fc6dfab9461834fa80d261da58cadf376f0a151))
- Detect hardcoded image references missing from disk at build time ([`606e974`](https://github.com/Vit129/nice-crochet/commit/606e9743116c3ece48104bb0d9ad7f90ee8a6cfe))
- Show the complete product photo on Home instead of cropping it ([`02e2113`](https://github.com/Vit129/nice-crochet/commit/02e211373f1283ca8d8ef9fc4185fa8a08e12652))
- Pin the tan tote's flower-charm photo to Home's Flower charms slide ([`c557dd4`](https://github.com/Vit129/nice-crochet/commit/c557dd4e34c39ad882f2800c5eea89072876ad6d))
- Fully remove mustard-lattice and cream-tan-two-tone tote listings ([`2d40e08`](https://github.com/Vit129/nice-crochet/commit/2d40e0894e2f6006e215b9389621116d07bc683c))
- Merge flower-charm colourways and yellow lattice tote variants ([`7f0d81b`](https://github.com/Vit129/nice-crochet/commit/7f0d81b4439442e5999b9e9c2bc770062c0bfa5d))
- Translate narrative copy to Thai (mixed with English) ([`03f6b47`](https://github.com/Vit129/nice-crochet/commit/03f6b478ed1f47e58246b2cf70b175fed78b4ee6))

### Changed
- Merge trio/duo bundle listings into their individual products ([`1e982b5`](https://github.com/Vit129/nice-crochet/commit/1e982b51ac2b40acb8a0fa5a23061aad3c236d70))
- Remove the craft-spotlight photo, stat row now full-width ([`b4022ab`](https://github.com/Vit129/nice-crochet/commit/b4022abfb63cb8f410a6209d7b79b7ad85760333))

### Documentation
- Document Instagram addition in README and DESIGN.md ([`a72e99c`](https://github.com/Vit129/nice-crochet/commit/a72e99ce81db3adffc51279597c2fb9023faedb6))

### Fixed
- Restore decorative images the catalog cleanup wrongly deleted ([`f063bca`](https://github.com/Vit129/nice-crochet/commit/f063bca59adfdead5741b3259aab68c015a14eba))
- Merge brown-cream-multi-card-holder-pair into its 2 individual products ([`8d538b8`](https://github.com/Vit129/nice-crochet/commit/8d538b8918501523c9459d95c43af948e5350e33))
- Show only the trio photo on Home's Pouches slide, no rotation ([`702685a`](https://github.com/Vit129/nice-crochet/commit/702685a68c2df1e252c4331b9a4e7d50ca7748a4))
- Restore Instagram CTA lost in a git branch mixup ([`b537340`](https://github.com/Vit129/nice-crochet/commit/b537340cbf74e8e31d42470f2255503dfaabc216))
- Reorder Shelf default view, decouple it from Home rotation order ([`8f2b335`](https://github.com/Vit129/nice-crochet/commit/8f2b335d69eb2c04335e8aede81e39084d663567))

## [0.2.0] - 2026-08-24

### Added
- Scaffold static portfolio site with catalog validation, image pipeline, and product lightbox ([`a477347`](https://github.com/Vit129/nice-crochet/commit/a477347cb846f54a9b0adb64768a07a84e757a9a))
- Add GitHub Pages deploy workflow, remove unrequested preview badge ([`523b5f0`](https://github.com/Vit129/nice-crochet/commit/523b5f08b95c2755afe3d784880afb8f9011d802))
- Home/shelf visibility flags, click tracking, and a products.json fix ([`ae13fb2`](https://github.com/Vit129/nice-crochet/commit/ae13fb265049c43114bdbaefb6cf0c5df5abe5f0))
- Live showOnShelf/showOnHome overrides from a Google Sheet ([`6319e45`](https://github.com/Vit129/nice-crochet/commit/6319e45913fd220b3e4a405a9ab685d302588f8e))

### Documentation
- Record GitHub Pages deployment decision and basePath fix ([`c57b15c`](https://github.com/Vit129/nice-crochet/commit/c57b15cab981b6c5aea6902b15aa32b46f98e869))
- Record shop padding and EXIF orientation fixes ([`f8f4f7d`](https://github.com/Vit129/nice-crochet/commit/f8f4f7dbba3164694ae2486743f3768559463bcb))
- Add README with live site link and local dev instructions ([`3d97462`](https://github.com/Vit129/nice-crochet/commit/3d9746211ca71b3d0876ec07de1335439e20371d))
- Regenerate changelog after merging dropdown/timezone and dev-tooling PRs ([`90d8e90`](https://github.com/Vit129/nice-crochet/commit/90d8e90d71ca8dd291a9e79334459769eea7ebbc))

### Fixed
- Lightbox control contrast and close-button overlap ([`e706819`](https://github.com/Vit129/nice-crochet/commit/e70681943f7d14097e9acee54f9347084d620bf7))
- Correct EXIF photo orientation and restore shop page padding ([`e86d6d6`](https://github.com/Vit129/nice-crochet/commit/e86d6d69f475adeb8eef77a5d6e43ec1a33e09d8))
- Sort dropdown looks like a normal control, lighter focus ring ([`0d4dfa0`](https://github.com/Vit129/nice-crochet/commit/0d4dfa0abc82c101067690042ac8cdbe7da46c6e))
- Lightbox shows full product photo instead of cropping ([`2e45f96`](https://github.com/Vit129/nice-crochet/commit/2e45f964ef5e7d7c4f62757fadc5988176894c85))
- Replace native select with a custom listbox to match the reference ([`4eafdb4`](https://github.com/Vit129/nice-crochet/commit/4eafdb49fa1bedcfe6eb8c5b797a4bcee37a7aee))
- LastClickedAt was mislabeled UTC instead of +07:00 ([`51661e0`](https://github.com/Vit129/nice-crochet/commit/51661e0fe654253c111f43828de51f39915e54d5))

