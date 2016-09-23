xquery version "3.0";
declare namespace output = "http://www.w3.org/2010/xslt-xquery-serialization";
declare option output:method "json";
declare option output:media-type "application/json";


declare variable $data := doc('../data/worldcup.xml');

declare function local:cards($n as node()*){
for $n in $data//team
return
    <root>
        <team id="{string($n/@id)}">
            <cards>{number($n/yc) + number($n/rc)}</cards>
        </team>
    </root>
};

local:cards($data)