xquery version "3.0";
declare namespace xhtml="http://www.w3.org/1999/xhtml";
declare default element namespace "http://www.w3.org/1999/xhtml";
import module namespace xmldb="http://exist-db.org/xquery/xmldb";

declare variable $pages := collection('/db/in/figures/');
declare variable $js := $pages//xhtml:footer/xhtml:script/text();
declare variable $blocks := document('../../blocks.xml')


(: This only works for valid xhtml files, the rest we do by hand :)

(: first write external .js files from the footer script contents :)
declare function local:write_file ($nodes as node()*) as item()* {
    
    for $scripts in $js
    let $file := util:document-name($scripts)
    let $filename := string(substring-before($file, ".xhtml")||'.js')
    return xmldb:store("/db/out/figures", $filename, $scripts)
    
};

(: now add scr links to said external files inside the script tags  :)
declare function local:insert_js_link ($nodes as node()*) as item()* {
     for $scripts in $pages//xhtml:footer/xhtml:script
     let $file := util:document-name($scripts)
     let $filename := string(substring-before($file, ".xhtml")||'.js')
     return  update replace $scripts with <script src="../resources/scripts/figures/{$filename}"></script>
};

(:Match the tile of xhtml pages with title of bl.ocks from emeeks to insert links:)
declare function local:insert_blocks ($nodes as node()*) as item()* {
     for $nodes in $pages//xhtml:footer/xhtml:a[href="#"]
     let $file := util:document-name($pages)
     let $filename := string(substring-before($file, ".xhtml"))
     let $figure := $blocks/div/a/div/string()
     where matches($filename,  "Fig_[\d]+_[\d]+") eq matches($figure, "Ch\.[\d]+\, Fig\. [\d]+ \-")
     return  update replace $nodes with <a href"{$figure/../a/@href/text()>}"/>
};

(:
<title>D3 in Action Chapter 12 - Example 2</title>
Fig_12_02.xhtml
<a class="gist gist--thumbnail" href="https://bl.ocks.org/emeeks/10710551f7eb636fd45c"
    style="background-image: url(https://bl.ocks.org/emeeks/raw/10710551f7eb636fd45c/70e81933f786d06131e963ba0352e2b8d417776f/thumbnail.png);">
    <div class="gist-description gist-underline">Ch. 12, Fig. 2 - D3.js in Action</div>
</a>
:)

let $log-in := xmldb:login("/db", "admin", "******")
let $create-collection := xmldb:create-collection("/db/out", "figures")
for $scripts in $js
    return local:insert_js_link($scripts)