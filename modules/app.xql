xquery version "3.0";

module namespace app="http://exist-db.org/apps/d3ia/templates";

import module namespace templates="http://exist-db.org/xquery/templates" ;
import module namespace config="http://exist-db.org/apps/d3ia/config" at "config.xqm";

declare namespace xhtml="http://www.w3.org/1999/xhtml";

declare variable $app:pages := collection('/db/apps/d3ia/figures/');
(:declare variable $app:figPath := $node/ancestor::xhtml:body//xhtml:div[@role="main"]/@id;:)

declare variable $app:files := for $fig in data($app:pages//*[@role="main"]/@id)
    order by $fig ascending
    return $fig;

(:~
 : This is a sample templating function. It will be called by the templating module if
 : it encounters an HTML element with an attribute: data-template="app:test" or class="app:test" (deprecated). 
 : The function has to take 2 default parameters. Additional parameters are automatically mapped to
 : any matching request or function parameter.
 : 
 : @param $node the HTML node with the attribute which triggered this call
 : @param $model a map containing arbitrary data - used to pass information between template calls
 :)
 
declare function app:test($node as node(), $model as map(*)) {
    <p>Dummy template output generated by function app:test at {current-dateTime()}. The templating
        function was triggered by the data-template attribute <code>data-template="app:test"</code>.</p>
};

declare
    %templates:wrap
function app:loadStyle($node as node(), $model as map(*)) {

let $styles := doc('/db/apps/d3ia/data/styles.xml')//styles/*

(: see local:styles :)

return
    <link xmlns="http://www.w3.org/1999/xhtml" 
        rel="stylesheet" 
        href="{data($styles[@id = $node/ancestor::xhtml:html//xhtml:div[@role="main"]/@id]/@href)}"/>
};

(: create a map of the styles to be passed between the different navbar items :)
declare 
    %templates:wrap 
    function app:figures($node as node(), $model as map(*)) as map(*) {
    let $figures :=    
        for $node in $app:pages//*[@role="main"]/@id           
        order by $node ascending
        return data($node)
        
    let $map := 
        map:new(for $fig at $pos in $figures
    return 
        map:entry($fig, $pos), "?strength=primary")
    return $map    
};

(: hide the navbar and stop processing if showing a figure page e.g. index.html) 
    inspired by joewiz's https://github.com/HistoryAtState/hsg-shell/blob/master/modules/app.xqm#L62
    :)

declare
    %templates:wrap
function app:hideEmpty($node as node(), $model as map(*)) {
(:   <debug>
   <model>{map:keys($model)}</model>
   <key>{data($node/ancestor::xhtml:body//xhtml:div[@role="main"]/@id)}</key>
   </debug>:)
   
   let $id := $node/ancestor::xhtml:body//xhtml:div[@role="main"]/@id
   return
        if 
            ( map:contains($model, $id) )
        then 
            ( templates:process($node/node(), $model) )
        else
            (attribute style { "display: none" })
};

(:
http://stackoverflow.com/questions/35581004/url-rewriting-for-nested-directories-in-exist-db/35611286#35611286
:)



declare 
    %templates:wrap 
function app:blocks($node as node(), $model as map(*)) {
    let $id := data($node/ancestor::xhtml:body//xhtml:div[@role="main"]/@id) 
    let $blocks := doc('/db/apps/d3ia/data/blocks.xml')//*
    
        (:see local:blocks:)   
         
    return
    if (map:contains($model, $id))
    then($blocks[@id = $id])
    else()
};


declare 
    %templates:wrap 
    function app:previous ($node as node(), $model as map(*)) {
    let $id := data($node/ancestor::xhtml:body//xhtml:div[@role="main"]/@id)
    let $i := index-of($app:files, $app:files[. = $id]) 
    let $previous := $i -1  
    return     
        if ($i = 1)
        then ( attribute style { "display: none" })    
        else( <a xmlns="http://www.w3.org/1999/xhtml" 
                    class="previous" href="{concat('/exist/apps/d3ia/figures/', $app:files[$previous], '.html')}">
                <span aria-hidden="true">←</span> Previous</a>)    
};

declare 
    %templates:wrap 
    function app:next ($node as node(), $model as map(*)) as element(a) {
    let $id := data($node/ancestor::xhtml:body//xhtml:div[@role="main"]/@id)
    let $i := index-of($app:files, $app:files[. = $id]) 
    let $next := $i +1 
    
    return 
        if ( count($app:files) < $i)
        then ( attribute style { "display: none" })   
        else ( <a xmlns="http://www.w3.org/1999/xhtml" 
                    class="next" href="{concat('/exist/apps/d3ia/figures/', $app:files[$next], '.html')}">
                   Next <span aria-hidden="true">→</span>
                </a>)    
};





