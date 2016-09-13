xquery version "3.0";
declare namespace xhtml="http://www.w3.org/1999/xhtml";
declare default element namespace "http://www.w3.org/1999/xhtml";
import module namespace xmldb="http://exist-db.org/xquery/xmldb";

declare variable $pages := collection('/db/in/figures/');
declare variable $js := $pages//xhtml:footer/xhtml:script/text();
declare variable $blocks := doc('/db/in/blocks.xml');


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
let $figures := $blocks/*/*/*

(:Lookup table with link targets:)
let $lookUp := <lookup>{
    for $x in $figures
    let $figID := replace($x/string(), "(\d+).* (\d+)", "$1_$2")
    let $part := substring-after(substring-before($figID, "-"), ".")
    let $figChapID := substring-before($part, "_")
    let $figSectID := substring-after($part, "_")
    
    return
        <title>{$figID}
            <chapter>{number($figChapID)}</chapter>
            <section>{number($figSectID)}</section>
            <link>{data($x/../@href)}</link>
        </title>}
        </lookup>

(:matches for file without links:)
let $matches := <matches>{
    for $nodes in $pages//xhtml:footer/xhtml:a[@href="#"]
    let $file := util:document-name($nodes)
    let $fileName := string(substring-before($file, ".xhtml"))
    let $fileChapID := substring($fileName, 5, 2)
    let $fileSectID := substring($fileName, 8,2)
    
    return <title>{$file}
        <chapter>{number($fileChapID)}</chapter>
        <section>{number($fileSectID)}</section>
        <link>{$nodes/text()}</link>
    </title>}
    </matches>

(:  merge  :)
let $insert := 
    for $x in $lookUp//xhtml:link,
        $y in $matches//xhtml:link
    where  $x/../xhtml:chapter = $y/../xhtml:chapter and 
        $x/../xhtml:section = $y/../xhtml:section  
    return 
    <root>    
        <source>{$y/..}</source>
        <target>{$x/..}</target>
    </root>
    
(: update from merge:)
   for $nodes in $pages//xhtml:footer/xhtml:a[@href="#"],
   $y in $insert
   where util:document-name($nodes) = $y/xhtml:source/xhtml:title/text()
   return
       update replace $nodes with <a href="{$y//xhtml:target//xhtml:link/text()}">Bl.ocks.org</a>
    
};



(:let $log-in := xmldb:login("/db", "admin", "******"):)
(:let $create-collection := xmldb:create-collection("/db/out", "figures"):)
(:for $n in $pages:)
(:    return local:insert_blocks($pages):)