# QuaSci.com
QuaSci.com is a quasi-scholarly blog on quantum science.
Posts are related to research and general research life. 

See the website at [www.quasci.com](http://www.quasci.com).

## Installation
QuaSci.com runs on Github pages using Jekyll.
Github has published [installation instructions](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/#step-2-install-jekyll-using-bundler)
for using Jekyll locally.

After following the instruction you should be able to run `jekyll serve` (or `bundle exec jekyll serve`)
to host the webpage contents.
You can view the contents with the link Jekyll puts in the terminal (under `server address`).

## Adding a Post
When working on new posts it is recommended to put them into the `_drafts` folder.
Jekyll [will serve](https://jekyllrb.com/docs/drafts/) these drafts by running `jekyll serve --drafts`.
Posts [must be named according to](https://jekyllrb.com/docs/posts/) `year-month-day-title.md`
A basic template is
```
---
layout:     post
title:      My Title
date:       2017-12-17 14:44:10
summary:    My summary
categories: mytag1 mytag2 mytag3
---

# Introduction
Lorem ipsum dolor sit amet.

```
Feel free to inspect previous posts for inspiration on how to organise your post source.
A more extensive manual is available on the [Jekyll manual website](https://jekyllrb.com/docs/posts/).

A custom feature is the ability to use `$` to delimit in-line math and `$$` to delimit math blocks.
