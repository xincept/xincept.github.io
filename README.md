## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/xincept/xincept.github.io/edit/master/README.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### XMap

XMap is a javascript indoor map library, you can use like

```markdown
var map = new XMap.Map("#xmap", {
  viewMode: XMap.ViewMode.MODE_3D
});
map.load("../files/data.json", function() {
  console.log("Map loaded.")
});
```

For more details see [XMap Documentation](https://xincept.github.io/map/index.html).
