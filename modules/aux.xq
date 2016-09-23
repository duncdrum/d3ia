xquery version "3.0";
declare namespace xhtml="http://www.w3.org/1999/xhtml";
declare default element namespace "http://www.w3.org/1999/xhtml";
import module namespace xmldb="http://exist-db.org/xquery/xmldb";

declare variable $pages := collection('/db/apps/d3ia/figures/');
declare variable $js := $pages//xhtml:footer/xhtml:script/text();
declare variable $blocks := doc('/db/apps/d3ia/data/blocks.xml');
declare variable $test := doc('/db/apps/d3ia/test.html');



(: This only works for valid xhtml files, the rest we do by hand 
    TO-DO create automatic import function for files
    
    To-Do JS:
        replcae d3.select("body") with d3.select("[role=main]")
        Fig_08_04 & 05 buttons not working (bottstrap related issue?)
        Fig_08_09 missing canvas button not working again
        Fig_09 spreadsheet in DOM but invisible (might be css related)
        Ch 12_09 next button pager still visible
    
:)

(: first write external .js files from the footer script contents :)
declare function local:write_file ($nodes as node()*) as item()* {
    
    for $scripts in $js
    let $file := util:document-name($scripts)
    let $filename := string(substring-before($file, ".html")||'.js')
    return xmldb:store("/db/apps/d3ia/figures", $filename, $scripts)
    
};

(: now add scr links to said external files inside the script tags  :)
declare function local:insert_js_link ($nodes as node()*) as item()* {
     for $scripts in $pages//xhtml:footer/xhtml:script
     let $file := util:document-name($scripts)
     let $filename := string(substring-before($file, ".html")||'.js')
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
    let $fileName := string(substring-before($file, ".html"))
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

(:declare function local:navLinks:)


(:insert the contents from  the header/title element as h2 into body:)
declare function local:figHeading ($nodes as node()*) as item()* {
    for $nodes in $pages  
    let $heading := $nodes//xhtml:title/text()
    return 
        update replace $nodes//xhtml:h2 with <h2>{$heading}</h2> 
};


(: two aux functions to create blocks.xml first insert the links into the full html pages, later replaced by templating via combined link + id :)
declare function local:insertID ($nodes as node()*) as item()*{    
for $nodes in $pages//xhtml:body

return  update insert attribute id  {substring-before(util:document-name($nodes), ".html")} into $nodes
};

declare function local:blocks ($nodes as node()*) as item()*{  

for $a in $pages//xhtml:a
return 
 <a xmlns="http://www.w3.org/1999/xhtml" 
    id="{data($a/ancestor::xhtml:body[@role="main"]/@id)}" 
    href="{data($a/@href)}">Bl.ocks.org</a>
};

(:write stylesheet locations to data/styles.xml :)
declare function local:styles ($nodes as node()*) as item()*{  
<styles>{
for $node in $pages//xhtml:head/xhtml:link
order by $node/../../xhtml:body[@role="main"]/@id
    return 
    <link xmlns="http://www.w3.org/1999/xhtml" 
            id="{data($node/../../xhtml:body[@role="main"]/@id)}"
            rel="stylesheet" 
            href="{concat('resources/css/Fig_', 
                substring-after($node/@href, '_'))}"/>}
</styles>
};

(: No more undo behind this point :)
declare function local:cleanHead ($nodes as node()*) as item()* {
for $nodes in $pages//xhtml:head
return
update delete $nodes
};

declare function local:cleanFooter ($nodes as node()*) as item()* {
for $nodes in $pages//xhtml:footer/xhtml:a
return
update delete $nodes
};

    


(:let $log-in := xmldb:login("/db", "admin", "******"):)
(:let $create-collection := xmldb:create-collection("/db/out", "figures"):)
(:for $n in $pages:)
(:    return local:insert_blocks($pages):)