xquery version "3.0";
declare namespace xhtml="http://www.w3.org/1999/xhtml";
declare default element namespace "http://www.w3.org/1999/xhtml";
import module namespace xmldb="http://exist-db.org/xquery/xmldb";

declare variable $pages := collection('/db/in/figures/');
declare variable $js := $pages//xhtml:footer/xhtml:script/text();



(: This only works for valid xhtml files, the rest we do by hand :)

(: first write external .js files from the footer script contents :)
declare function local:write_file ($nodes as node()*) as item()* {
    
    for $scripts in $js
    let $file := util:document-name($scripts)
    let $filename := string(substring-before($file, ".xhtml")||'.js')
    return xmldb:store("/db/out/figures", $filename, $scripts)
    
};

(: now add scr links to said external files inside the script tags  :)
declare function local:insert_link ($nodes as node()*) as item()* {
     for $scripts in $pages//xhtml:footer/xhtml:script
     let $file := util:document-name($scripts)
    let $filename := string(substring-before($file, ".xhtml")||'.js')
     return  update replace $scripts with <script src="../resources/scripts/figures/{$filename}"></script>
};

let $log-in := xmldb:login("/db", "admin", "******")
let $create-collection := xmldb:create-collection("/db/out", "figures")
for $scripts in $js
    return local:insert_link($scripts)